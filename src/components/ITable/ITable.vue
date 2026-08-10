<!-- ITable.vue — حل جذري: فرز محلي مستقل يعمل مع كل الأعمدة -->
<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from "vue";
import { t } from "@/utilities/I18nPlugin";
import ITableToolbar from "./ITableToolbar.vue";
import ITablePagination from "./ITablePagination.vue";
import type { ITableHeader, ITableItem, RowKey } from "./ITable.types";
import { useColumnPersistence } from "./useColumnPersistence";
import { useTableCore } from "./useTableCore";
import { useSelection } from "./useSelection";
import { exportToExcel } from "./useExportExcel";
import { printTable as doPrint } from "./usePrintTable";

// ========== Props / Emits ==========
const props = defineProps({
  headers: { type: Array as () => ITableHeader[], required: true },
  items: { type: Array as () => ITableItem[], required: true },

  title: { type: String, default: "" },
  caption: { type: String, default: "" },

  showNoData: { type: Boolean, default: false },
  titleNoData: { type: String, default: "noResults" },

  showRowNumber: { type: Boolean, default: false },
  showPrintButton: { type: Boolean, default: true },
  showExportButton: { type: Boolean, default: true },
  showColumnsButton: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },

  pageSize: { type: Number, default: 10 },
  pageSizeOptions: {
    type: Array as () => number[],
    default: () => [10, 25, 50, 100],
  },

  persistKey: { type: String, default: "" },
  serverSide: { type: Boolean, default: false },

  rowKey: { type: [String, Function] as any, default: "" },
  dense: { type: Boolean, default: false },
  stickyHeader: { type: Boolean, default: true },
  stickyFirstColumn: { type: Boolean, default: false },

  exportFilename: { type: String, default: "" },
  exportOnlyVisible: { type: Boolean, default: true },
  debounceSearchMs: { type: Number, default: 250 },

  selectable: { type: Boolean, default: false },
  selectedKeys: { type: Array as () => Array<RowKey>, default: () => [] },
});

const emit = defineEmits<{
  (e: "update:selectedKeys", v: RowKey[]): void;
  (e: "update:currentPage", v: number): void;
  (e: "update:pageSize", v: number): void;
  (e: "columns-change", v: string[]): void;
  (e: "search-change", v: string): void;
  (e: "sort-change", p: { sortKey: string; ascending: boolean }): void;
  (e: "row-click", p: { row: ITableItem; index: number }): void;
}>();

// ========== Columns visibility ==========
const initialVisible = props.headers
  .filter((h) => h.visible !== false)
  .map((h) => h.value);
const { visibleColumns, toggleAll } = useColumnPersistence(
  props.persistKey || props.title,
  initialVisible
);

// ترتيب العرض النهائي للأعمدة = ترتيب visibleColumns
const displayHeaders = computed<ITableHeader[]>(() => {
  const map = new Map(props.headers.map((h) => [h.value, h] as const));
  return visibleColumns.value
    .map((k) => map.get(k))
    .filter((h): h is ITableHeader => !!h);
});

// ========== Core (نستفيد منه للفلترة والـpaging فقط) ==========
const core = useTableCore({
  headers: () => props.headers,
  items: () => props.items,
  visibleColumns: () => visibleColumns.value,
  serverSide: () => props.serverSide,
  pageSizeProp: () => props.pageSize,
  showPagination: () => props.showPagination,
});

// ========== فرز محلي مستقل ==========
type UISort = { key: string; asc: boolean };
const uiSort = ref<UISort>({ key: "", asc: true });

// Collator للنصوص (natural + case-insensitive)
const textCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function getByPath(row: ITableItem, keyPath: string): unknown {
  return keyPath
    .split(".")
    .reduce<unknown>((acc: any, part) => acc?.[part], row);
}

const pureNumberRegex =
  /^[\s]*[-+]?\d{1,3}(\d{3})*(?:[.,]\d+)?[\s]*$|^[\s]*[-+]?\d+(?:[.,]\d+)?[\s]*$/;
function asStrictNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v ?? "");
  if (!pureNumberRegex.test(s)) return null;
  const normalized = s
    .replace(/\s+/g, "")
    .replace(/,/g, "")
    .replace(/，/g, "")
    .replace(/٬/g, "")
    .replace(/٫/g, ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
function asTime(v: unknown): number | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.getTime();
  const t = Date.parse(String(v ?? ""));
  return Number.isNaN(t) ? null : t;
}
function smartCompare(a: unknown, b: unknown): number {
  const aNull = a == null,
    bNull = b == null;
  if (aNull && bNull) return 0;
  if (aNull) return 1;
  if (bNull) return -1;
  const at = asTime(a),
    bt = asTime(b);
  if (at != null && bt != null) return at - bt;
  const an = asStrictNumber(a),
    bn = asStrictNumber(b);
  if (an != null && bn != null) return an - bn;
  return textCollator.compare(String(a), String(b));
}

// قاعدة الفرز: نرتّب فوق filtered من core
const baseRows = computed(() => core.filtered.value);

const clientSorted = computed<ITableItem[]>(() => {
  if (props.serverSide) return baseRows.value;
  const key = uiSort.value.key;
  if (!key) return [...baseRows.value];
  const dir = uiSort.value.asc ? 1 : -1;
  return [...baseRows.value].sort(
    (a, b) => dir * smartCompare(getByPath(a, key), getByPath(b, key))
  );
});

// ترقيم محلي فوق الترتيب المحلي
const rowsToRender = computed<ITableItem[]>(() => {
  if (props.serverSide || !props.showPagination) return clientSorted.value;
  const start = (core.page.value - 1) * core.pageSize.value;
  return clientSorted.value.slice(start, start + core.pageSize.value);
});

// عدادات العرض
const from = computed(() => (core.page.value - 1) * core.pageSize.value + 1);
const to = computed(() =>
  Math.min(core.page.value * core.pageSize.value, clientSorted.value.length)
);

// تحديث حالة الفرز عند النقر
function onSort(header: ITableHeader) {
  if (header.sortable === false) return;
  const key = header.sortKey || header.value;
  uiSort.value =
    uiSort.value.key === key
      ? { key, asc: !uiSort.value.asc }
      : { key, asc: true };
  if (!props.serverSide) {
    core.setPage(1);
    emit("update:currentPage", 1);
  }
  emit("sort-change", { sortKey: key, ascending: uiSort.value.asc });
}

// لإظهار حالة aria والسهم
function ariaSort(header: ITableHeader): "none" | "ascending" | "descending" {
  const key = header.sortKey || header.value;
  if (uiSort.value.key !== key) return "none";
  return uiSort.value.asc ? "ascending" : "descending";
}

// ========== مفاتيح صفوف مستقرة ==========
const _rowId = new WeakMap<ITableItem, number>();
let _rowSeq = 0;
function ensureRowId(row: ITableItem): number {
  if (!_rowId.has(row)) _rowId.set(row, ++_rowSeq);

  return _rowId.get(row)!;
}
function getRowKey(row: ITableItem, i: number): RowKey {
  if (typeof props.rowKey === "function") return props.rowKey(row, i);
  if (typeof props.rowKey === "string" && props.rowKey)
    return (row as any)[props.rowKey] ?? ensureRowId(row);
  return ensureRowId(row);
}

// ========== Selection يعتمد على الصفوف بعد الفرز/الترقيم ==========
const selection = useSelection({
  selectable: () => props.selectable,
  controlledKeys: () => props.selectedKeys,
  rowKeyGetter: getRowKey,
  pagedItems: () => rowsToRender.value,
  page: () => core.page.value,
  pageSize: () => core.pageSize.value,
});
watchEffect(() => emit("update:selectedKeys", selection.selected.value));
watchEffect(() => emit("columns-change", visibleColumns.value));

// ========== أدوات ==========
function onSearch(q: string) {
  core.setSearch(q);
  emit("search-change", q);
}

async function onExport() {
  await exportToExcel({
    headers: props.headers,
    items: props.items,
    sortedItems: clientSorted.value, // ⚠️ نصدر وفق الترتيب المحلي
    filename: props.exportFilename || `${props.title || "export"}.xlsx`,
    onlyVisible: props.exportOnlyVisible,
    visibleColumns: visibleColumns.value,
    title: props.title,
  });
}

async function onPrint() {
  await nextTick();
  await doPrint("printable-table", props.headers, {
    showRowNumber: props.showRowNumber,
    selectable: props.selectable,
    title: props.title,
    caption: props.caption,
  });
}

// لإجبار إعادة تركيب tbody عند تغيّر حالة الفرز/الصفحة/الحجم
const sortRenderKey = computed(
  () =>
    `${uiSort.value.key}:${uiSort.value.asc ? 1 : 0}:${core.page.value}:${core.pageSize.value}`
);
</script>

<template>
  <div class="table-container my-2">
    <div v-if="items.length">
      <ITableToolbar
        :headers="headers"
        :visible-columns="visibleColumns"
        :page-size="core.pageSize.value"
        :page-size-options="pageSizeOptions"
        :show-search="showSearch"
        :show-export-button="showExportButton"
        :show-print-button="showPrintButton"
        :show-columns-button="showColumnsButton"
        :export-disabled="!clientSorted.length"
        :debounce-ms="debounceSearchMs"
        @update:page-size="
          (s: number) => {
            core.setPageSize(s);
            $emit('update:pageSize', s);
            $emit('update:currentPage', 1);
          }
        "
        @search="onSearch"
        @export="onExport"
        @print="onPrint"
        @toggle-all-columns="toggleAll(headers.map((h) => h.value))"
        @update:visible-columns="
          (cols: string[]) => {
            visibleColumns = cols;
          }
        "
      >
        <template #toolbar-left><slot name="toolbar-left" /></template>
        <template #toolbar-right><slot name="toolbar-right" /></template>
      </ITableToolbar>

      <div
        id="printable-table"
        class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        role="grid"
        :aria-rowcount="clientSorted.length"
      >
        <slot name="headerTitle" />
        <table class="w-full border-collapse">
          <thead>
            <tr
              class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-600"
            >
              <th
                v-if="selectable"
                class="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                :class="{
                  'sticky top-0 z-10 bg-gray-100 dark:bg-gray-700':
                    stickyHeader,
                }"
              >
                <input
                  type="checkbox"
                  :checked="selection.allOnPage.value"
                  @change="selection.toggleAllOnPage"
                  aria-label="Select all on page"
                />
              </th>
              <th
                v-if="showRowNumber"
                class="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                :class="{
                  'sticky top-0 z-10 bg-gray-100 dark:bg-gray-700':
                    stickyHeader,
                }"
              >
                #
              </th>

              <th
                v-for="h in displayHeaders"
                :key="h.value"
                :style="core.columnStyleMap.value[h.value]"
                :aria-sort="ariaSort(h)"
                :class="[
                  'px-4 py-3 select-none text-left border-r border-gray-200 dark:border-gray-600 last:border-r-0',
                  stickyHeader
                    ? 'sticky top-0 z-10 bg-gray-100 dark:bg-gray-700'
                    : '',
                  h.align === 'center'
                    ? 'text-center'
                    : h.align === 'right'
                      ? 'text-right'
                      : 'text-left',
                ]"
              >
                <button
                  type="button"
                  class="w-full flex items-center justify-between focus:outline-none"
                  :class="
                    h.sortable === false
                      ? 'cursor-default'
                      : 'cursor-pointer hover:opacity-80'
                  "
                  @click.stop.prevent="onSort(h)"
                >
                  <span
                    class="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  >
                    {{ h.caption }}
                    <span
                      v-if="h.print === false"
                      class="ml-1 text-gray-400 dark:text-gray-500 print-hide"
                      title="Hidden on print"
                    >
                      <svg
                        class="w-4 h-4 inline-block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    </span>
                  </span>
                  <span
                    v-if="uiSort.key === (h.sortKey || h.value)"
                    class="text-blue-600 dark:text-blue-400 font-bold text-sm"
                  >
                    {{ uiSort.asc ? "↑" : "↓" }}
                  </span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody
            :key="sortRenderKey"
            class="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr
              v-for="(row, i) in rowsToRender"
              :key="getRowKey(row, i)"
              class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all duration-150 group"
              @click="$emit('row-click', { row, index: i })"
            >
              <td
                v-if="selectable"
                class="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                <input
                  type="checkbox"
                  :checked="
                    selection.selected.value.includes(getRowKey(row, i))
                  "
                  @change="selection.toggleOne(row, i)"
                  aria-label="Select row"
                />
              </td>

              <td
                v-if="showRowNumber"
                class="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 group-hover:bg-blue-100 dark:group-hover:bg-gray-600/50"
              >
                {{ i + 1 + (core.page.value - 1) * core.pageSize.value }}
              </td>

              <td
                v-for="h in displayHeaders"
                :key="h.value"
                :style="core.columnStyleMap.value[h.value]"
                class="px-4 text-sm text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                :class="[
                  dense ? 'py-2' : 'py-3',
                  h.align === 'center'
                    ? 'text-center'
                    : h.align === 'right'
                      ? 'text-right'
                      : 'text-left',
                ]"
              >
                <slot
                  :name="h.value"
                  :row="row"
                  :value="getByPath(row, h.value)"
                >
                  <template v-if="h.format">{{
                    h.format(row, getByPath(row, h.value))
                  }}</template>
                  <template v-else>{{
                    getByPath(row, h.value) as any
                  }}</template>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ITablePagination
        v-if="showPagination && !serverSide"
        :page="core.page.value"
        :total-pages="core.totalPages.value"
        :from="from"
        :to="to"
        :total="clientSorted.length"
        @prev="
          () => {
            core.setPage(core.page.value - 1);
            $emit('update:currentPage', core.page.value);
          }
        "
        @next="
          () => {
            core.setPage(core.page.value + 1);
            $emit('update:currentPage', core.page.value);
          }
        "
      />
      <slot v-else name="serverPager" />
    </div>

    <div
      v-else-if="!items.length && showNoData"
      class="text-center mt-8 py-8 text-gray-500 dark:text-gray-400"
    >
      <div class="text-lg">{{ t(titleNoData) || t("noData") }}</div>
    </div>

    <div
      v-else-if="!baseRows.length"
      class="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dotted border-gray-400 rounded-lg"
    >
      <div class="text-lg">
        {{ t(titleNoData) || "No results found for your search" }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  position: relative;
}
.dark .bg-gradient-to-r.from-gray-50.to-gray-100 {
  background: linear-gradient(to right, rgb(31, 41, 55), rgb(17, 24, 39));
}
.sticky-first-col {
  position: sticky;
  left: 0;
  z-index: 5;
  background: inherit;
}
@media print {
  .table-container,
  .table-container * {
    visibility: hidden;
  }
  #printable-table,
  #printable-table * {
    visibility: visible;
  }
  #printable-table {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: visible !important;
    border: none !important;
    border-radius: 0 !important;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th,
  td {
    background: white !important;
    color: black !important;
  }
  th {
    background: #f5f5f5 !important;
  }
}
.print-hide {
  display: none !important;
}
</style>
