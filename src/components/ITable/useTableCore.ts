// ─────────────────────────────────────────────────────────────────────────────
// File: useTableCore.ts
// إصلاح فرز الأعمدة أبجديًا ورقميًا (ويدعم التواريخ) بشكل موثوق.
// - يستخدم Intl.Collator لفرز النصوص (يدعم العربية واللغات الأخرى).
// - يكتشف الأرقام الحقيقية فقط (بدون خلط النصوص التي تحتوي أرقامًا بحروف).
// - يدعم dot.path في sortKey (“user.name” مثلاً).
// - يحافظ على null/undefined في الأخير.
// ─────────────────────────────────────────────────────────────────────────────
import { computed, ref, watch, type CSSProperties } from 'vue'
import type { ITableHeader, ITableItem } from './ITable.types'

type CoreOptions = {
  headers: () => ITableHeader[]
  items: () => ITableItem[]
  visibleColumns: () => string[]
  serverSide: () => boolean
  pageSizeProp: () => number
  showPagination: () => boolean
}

type SortState = { key: string; asc: boolean }

// Collator للنصوص: natural-ish، يحترم اللغة الحالية، ويهمل الفرق بين الحروف الكبيرة/الصغيرة.
const textCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

// التعرّف على "نص رقمي خالص" (بدون حروف). نسمح بـ - . , مسافات.
// مثال صالح: "  -1,234.50  " | "99" | "0.3"
const pureNumberRegex = /^[\s]*[-+]?\d{1,3}(\d{3})*(?:[.,]\d+)?[\s]*$|^[\s]*[-+]?\d+(?:[.,]\d+)?[\s]*$/

function coerceNumberStrict(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const s = String(v ?? '')
  if (!pureNumberRegex.test(s)) return null
  // أزل الفواصل، وحوّل الفاصلة العشرية إلى نقطة
  const normalized = s
    .replace(/\s+/g, '')
    .replace(/,/g, '')
    .replace(/，/g, '')
    .replace(/٬/g, '')
    .replace(/٫/g, '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

function coerceDate(v: unknown): number | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.getTime()
  const s = String(v ?? '')
  const t = Date.parse(s)
  return Number.isNaN(t) ? null : t
}

// getter بمسار dot.path
export function getCellValue(row: ITableItem, keyPath: string): unknown {
  return keyPath.split('.').reduce<unknown>((acc: any, part) => acc?.[part], row)
}

// مقارنة ذكية: nulls-last ثم تاريخ ثم رقم صارم ثم نص باستخدام Collator
function compareValues(a: unknown, b: unknown): number {
  // null/undefined آخر القائمة
  const aNull = a == null
  const bNull = b == null
  if (aNull && bNull) return 0
  if (aNull) return 1
  if (bNull) return -1

  // تواريخ
  const at = coerceDate(a)
  const bt = coerceDate(b)
  if (at != null && bt != null) return at - bt

  // أرقام (صارمة)
  const an = coerceNumberStrict(a)
  const bn = coerceNumberStrict(b)
  if (an != null && bn != null) return an - bn

  // نصوص (فرز أبجدي طبيعي)
  return textCollator.compare(String(a), String(b))
}

export function useTableCore(options: CoreOptions) {
  // البحث/الصفحة/الحجم/الفرز
  const search = ref<string>('')
  const page = ref<number>(1)
  const pageSize = ref<number>(options.pageSizeProp())
  const sort = ref<SortState>({ key: '', asc: true })

  // مزامنة حجم الصفحة القادم من props
  watch(
    () => options.pageSizeProp(),
    (next) => {
      if (next !== pageSize.value) {
        pageSize.value = next
        page.value = 1
      }
    }
  )

  // فلترة حسب البحث (عميل فقط)
  const filtered = computed<ITableItem[]>(() => {
    if (options.serverSide()) return options.items()
    const q = search.value.trim().toLowerCase()
    if (!q) return options.items()
    const visible = options.visibleColumns()
    return options.items().filter((row) =>
      visible.some((key) => String(getCellValue(row, key) ?? '').toLowerCase().includes(q))
    )
  })

  // فرز (أبجدي/رقمي/تاريخ) حسب sort.key
  const sorted = computed<ITableItem[]>(() => {
    if (options.serverSide()) return filtered.value
    const key = sort.value.key
    if (!key) return [...filtered.value]
    const dir = sort.value.asc ? 1 : -1
    return [...filtered.value].sort((a, b) => {
      const va = getCellValue(a, key)
      const vb = getCellValue(b, key)
      return dir * compareValues(va, vb)
    })
  })

  // ترقيم
  const paged = computed<ITableItem[]>(() => {
    if (options.serverSide() || !options.showPagination()) return sorted.value
    const start = (page.value - 1) * pageSize.value
    return sorted.value.slice(start, start + pageSize.value)
  })

  const totalPages = computed<number>(() => {
    if (options.serverSide() || !options.showPagination()) return 0
    return Math.max(1, Math.ceil(sorted.value.length / pageSize.value))
  })

  // حافظ على الصفحة ضمن الحدود
  watch([sorted, pageSize], () => {
    if (options.serverSide()) return
    const pages = totalPages.value || 1
    if (page.value > pages) page.value = pages
  })

  // حساب ستايل الأعمدة تلقائيًا
  const COLUMN_SAMPLE_COUNT = 25
  const columnStyleMap = computed<Record<string, CSSProperties>>(() => {
    const map: Record<string, CSSProperties> = {}
    for (const h of options.headers()) {
      if (h.width) {
        map[h.value] = { width: h.width, whiteSpace: 'nowrap' }
        continue
      }
      const sample = options.items().slice(0, COLUMN_SAMPLE_COUNT).map((row) =>
        String(getCellValue(row, h.value) ?? '')
      )
      const maxLen = Math.max(h.value.length, ...sample.map((s) => s.length))
      const minWidthPx = maxLen * 8 + 24 // 8px/char + padding
      map[h.value] = { minWidth: `${minWidthPx}px`, whiteSpace: 'nowrap' }
    }
    return map
  })

  // واجهة أوامر
  const setSort = (key: string) => {
    sort.value = sort.value.key === key ? { key, asc: !sort.value.asc } : { key, asc: true }
  }
  const setSearch = (q: string) => { search.value = q; page.value = 1 }
  const setPage = (p: number) => { page.value = Math.max(1, p) }
  const setPageSize = (ps: number) => { pageSize.value = ps; page.value = 1 }

  return {
    // state
    search,
    page,
    pageSize,
    sort,

    // data
    filtered,
    sorted,
    paged,
    totalPages,
    columnStyleMap,

    // helpers
    getCellValue,

    // actions
    setSearch,
    setPage,
    setPageSize,
    setSort
  }
}
