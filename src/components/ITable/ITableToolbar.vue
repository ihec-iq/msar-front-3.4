// ─────────────────────────────────────────────────────────────────────────────
// File: ITableToolbar.vue
// Search + actions (export/print) + column popover. Emits small, focused events.
// ─────────────────────────────────────────────────────────────────────────────
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ITableHeader } from './ITable.types'

const props = defineProps<{
  headers: ITableHeader[]
  visibleColumns: string[]
  pageSize: number
  pageSizeOptions: number[]
  showSearch: boolean
  showExportButton: boolean
  showPrintButton: boolean
  showColumnsButton: boolean
  exportDisabled: boolean
  debounceMs: number
}>()

const emit = defineEmits<{
  (e: 'search', q: string): void
  (e: 'toggle-all-columns'): void
  (e: 'update:visibleColumns', cols: string[]): void
  (e: 'export'): void
  (e: 'print'): void
  (e: 'update:pageSize', size: number): void
}>()

// local debounced input
const raw = ref('')
let timer: number | undefined
watch(raw, (v) => {
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => emit('search', v.trim()), props.debounceMs)
})
</script>

<template>
  <div class="mb-4 flex flex-wrap justify-between items-center gap-4">
    <div class="flex items-center gap-3">
      <div v-if="showSearch" class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <input v-model="raw" placeholder="Search..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div v-if="showColumnsButton" class="relative">
        <details class="relative">
          <summary class="list-none">
            <button type="button" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 hover:from-purple-300 hover:to-blue-300 dark:hover:from-purple-800 dark:hover:to-blue-800 text-purple-800 dark:text-blue-100 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-700 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
              <span class="text-sm font-semibold">Columns</span>
            </button>
          </summary>
          <div class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 min-w-72 p-5 backdrop-blur-sm">
            <div class="mb-4 flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Visible {{ visibleColumns.length }} of {{ headers.length }}</span>
              <button @click="$emit('toggle-all-columns')" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Toggle All</button>
            </div>
            <div class="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              <label v-for="h in headers" :key="h.value" class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <input type="checkbox" :value="h.value" :checked="visibleColumns.includes(h.value)" @change="$emit('update:visibleColumns', visibleColumns.includes(h.value) ? visibleColumns.filter(v=>v!==h.value) : [...visibleColumns, h.value])" class="w-4 h-4 text-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 bg-white dark:bg-gray-700" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ h.caption }}<span v-if="h.print===false" class="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">Print Hidden</span></span>
              </label>
            </div>
          </div>
        </details>
      </div>

      <slot name="toolbar-left" />
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Rows</span>
        <select class="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100" :value="pageSize" @change="$emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))">
          <option v-for="s in pageSizeOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <button v-if="showExportButton" :disabled="exportDisabled" @click="$emit('export')" class="bg-green-100 hover:bg-green-200 disabled:opacity-50 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Export Excel
      </button>

      <button v-if="showPrintButton" @click="$emit('print')" class="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Print
      </button>

      <slot name="toolbar-right" />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar{width:4px}
.custom-scrollbar::-webkit-scrollbar-track{background:rgb(243 244 246);border-radius:4px}
.custom-scrollbar::-webkit-scrollbar-thumb{background:rgb(209 213 219);border-radius:4px}
</style>