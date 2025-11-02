// ─────────────────────────────────────────────────────────────────────────────
// File: useSelection.ts
// Row selection (page-level select all + individual toggling).
// ─────────────────────────────────────────────────────────────────────────────
import { ref, computed, watch } from 'vue'
import type { ITableItem, RowKey } from './ITable.types'

export function useSelection(opts: {
  selectable: () => boolean
  controlledKeys: () => RowKey[]
  rowKeyGetter: (row: ITableItem, absoluteIndex: number) => RowKey
  pagedItems: () => ITableItem[]
  page: () => number
  pageSize: () => number
}) {
  const selected = ref<RowKey[]>([...opts.controlledKeys()])

  watch(() => opts.controlledKeys(), v => { selected.value = [...v] }, { deep: true })

  const allOnPage = computed(() => {
    if (!opts.selectable() || opts.pagedItems().length === 0) return false
    const base = (opts.page() - 1) * opts.pageSize()
    const keys = opts.pagedItems().map((r, i) => opts.rowKeyGetter(r, base + i))
    return keys.every(k => selected.value.includes(k))
  })

  const toggleAllOnPage = () => {
    const base = (opts.page() - 1) * opts.pageSize()
    const keys = opts.pagedItems().map((r, i) => opts.rowKeyGetter(r, base + i))
    selected.value = allOnPage.value
      ? selected.value.filter(k => !keys.includes(k))
      : Array.from(new Set([...selected.value, ...keys]))
  }

  const toggleOne = (row: ITableItem, absoluteIndex: number) => {
    const key = opts.rowKeyGetter(row, absoluteIndex)
    selected.value = selected.value.includes(key)
      ? selected.value.filter(k => k !== key)
      : [...selected.value, key]
  }

  return { selected, allOnPage, toggleAllOnPage, toggleOne }
}