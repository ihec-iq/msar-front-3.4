<script setup lang="ts">
import { ref, computed } from "vue";
import type { ITableItem, ITableHeader } from "@/types/core/components/ITable";
import { t } from "@/utilities/I18nPlugin";
import * as XLSX from "xlsx";

const props = defineProps({
  headers: {
    type: Array as () => ITableHeader[],
    required: true,
  },
  items: {
    _type: Array as () => ITableItem[],
    get type() {
      return this._type;
    },
    set type(value) {
      this._type = value;
    },
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  caption: {
    type: String,
    default: "",
  },
  showNoData: {
    type: Boolean,
    default: false,
  },
  titleNoData: {
    type: String,
    default: "noResults",
  },
  showRowNumber: {
    type: Boolean,
    default: false,
  },
  showPrintButton: {
    type: Boolean,
    default: true,
  },
  showExportButton: {
    type: Boolean,
    default: true,
  },
  showColumnsButton: {
    type: Boolean,
    default: true,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const searchQuery = ref("");
const currentPage = ref(1);
const sortKey = ref("");
const sortAsc = ref(true);
const visibleColumns = ref(props.headers.map((h) => h.value));
const showColumnPopup = ref(false);

// Computed property for headers that should be visible in print
const printableHeaders = computed(() => {
  return props.headers.filter((header) => header.print !== false);
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter((item) => {
    return visibleColumns.value.some((key) =>
      String(item[key] ?? "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  });
});

const sortedItems = computed(() => {
  const items = [...filteredItems.value];
  if (!sortKey.value) return items;
  return items.sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    if (valA === valB) return 0;
    return (valA > valB ? 1 : -1) * (sortAsc.value ? 1 : -1);
  });
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return sortedItems.value.slice(start, start + props.pageSize);
});

const totalPages = computed(() => {
  return Math.ceil(sortedItems.value.length / props.pageSize);
});

const toggleSort = (key: string) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const toggleColumn = (key: string) => {
  if (visibleColumns.value.includes(key))
    visibleColumns.value = visibleColumns.value.filter((k) => k !== key);
  else visibleColumns.value.push(key);
};

const exportToExcel = () => {
  const data = props.items.map((item) => {
    const row: Record<string, any> = {};
    visibleColumns.value.forEach((key) => {
      const header = props.headers.find((h) => h.value === key);
      const columnName = header?.caption || key;
      row[columnName] = item[key];
    });
    return row;
  });
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, props.title || "Sheet1");
  XLSX.writeFile(wb, `${props.title || "export"}.xlsx`);
};

const printTable = () => {
  const printContent = document.getElementById("printable-table");
  if (!printContent) return;

  // Create a clean copy of the table for printing
  const tableClone = printContent.cloneNode(true) as HTMLElement;

  // Remove columns marked with print: false
  const hiddenColumns: number[] = [];
  props.headers.forEach((header, index) => {
    if (header.print === false) {
      hiddenColumns.push(index + (props.showRowNumber ? 1 : 0)); // Account for row number column
    }
  });

  // Remove header cells for hidden columns
  const headerRow = tableClone.querySelector("thead tr");
  if (headerRow) {
    hiddenColumns.reverse().forEach((colIndex) => {
      const cell = headerRow.children[colIndex];
      if (cell) cell.remove();
    });
  }

  // Remove body cells for hidden columns
  const bodyRows = tableClone.querySelectorAll("tbody tr");
  bodyRows.forEach((row) => {
    hiddenColumns.reverse().forEach((colIndex) => {
      const cell = row.children[colIndex];
      if (cell) cell.remove();
    });
    hiddenColumns.reverse(); // Restore order for next row
  });

  const newWindow = window.open("", "_blank");
  if (!newWindow) return;

  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${props.title || "Table Print"}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .print-caption { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .print-hide { display: none !important; }
        
        /* Hide columns with print: false - backup CSS method */
        ${props.headers
      .map((header, index) => {
        if (header.print === false) {
          const colIndex = index + (props.showRowNumber ? 2 : 1); // CSS nth-child is 1-based
          return `
              th:nth-child(${colIndex}),
              td:nth-child(${colIndex}) {
                display: none !important;
              }
            `;
        }
        return "";
      })
      .join("")}
        
        @media print { 
          body { margin: 0; }
          .print-caption { page-break-after: avoid; }
          .print-hide { display: none !important; }
        }
      </style>
    </head>
    <body>
      ${props.caption || props.title ? `<div class="print-caption">${props.caption || props.title}</div>` : ""}
      ${tableClone.outerHTML}
    </body>
    </html>
  `);

  newWindow.document.close();
  newWindow.focus();
  setTimeout(() => {
    newWindow.print();
    newWindow.close();
  }, 250);
};

const resetPage = () => {
  currentPage.value = 1;
};

const toggleAllColumns = () => {
  if (visibleColumns.value.length === props.headers.length) {
    visibleColumns.value = [];
  } else {
    visibleColumns.value = props.headers.map((h) => h.value);
  }
};
const getColumnStyle = (key: string) => {
  const header = props.headers.find((h) => h.value === key);
  if (header?.width) {
    return { width: header.width };
  }

  const values = props.items.map((item) => String(item[key] ?? ""));
  const maxLength = Math.max(...values.map((v) => v.length), key.length);
  const charWidth = 8; // estimated width of one character
  const padding = 24; // extra padding
  return {
    minWidth: `${maxLength * charWidth + padding}px`,
    whiteSpace: "nowrap",
  };
};
</script>

<template>
  <div class="table-container my-2">
    <div v-if="props.items.length">
      <!-- Controls Header -->
      <div class="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <!-- Search Input -->
          <div class="relative" v-if="showSearch">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input v-model="searchQuery" @input="resetPage" :placeholder="t('search') || 'Search...'"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <!-- Beautiful Column Visibility Button -->
          <div class="relative" v-if="showColumnsButton">
            <button @click="showColumnPopup = !showColumnPopup" type="button"
              class="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              <div class="relative">
                <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2">
                  </path>
                </svg>
                <div class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <span class="text-sm font-semibold">{{
                t("columns") || "Columns"
              }}</span>
              <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showColumnPopup }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Enhanced Column Visibility Popup -->
            <div v-if="showColumnPopup"
              class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 min-w-72 backdrop-blur-sm">
              <div class="p-5">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2">
                        </path>
                      </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 dark:text-gray-100">
                      {{ t("showColumns") || "Show Columns" }}
                    </h3>
                  </div>
                  <button @click="showColumnPopup = false"
                    class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                      </path>
                    </svg>
                  </button>
                </div>

                <div class="mb-4 flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t("visible") }} {{ visibleColumns.length }} {{ t("of") }}
                    {{ props.headers.length }}
                  </span>
                  <button @click="toggleAllColumns"
                    class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    {{
                      visibleColumns.length === props.headers.length
                        ? t("hideAll") || "Hide All"
                        : t("showAll") || "Show All"
                    }}
                  </button>
                </div>

                <div class="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  <label v-for="header in props.headers" :key="header.value"
                    class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors group">
                    <div class="relative">
                      <input type="checkbox" :value="header.value" v-model="visibleColumns"
                        class="w-4 h-4 text-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 bg-white dark:bg-gray-700" />
                      <div
                        class="absolute inset-0 rounded border-2 border-blue-500 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none">
                      </div>
                    </div>
                    <span
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {{ header.caption }}
                      <span v-if="header.print === false"
                        class="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                        Print Hidden
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button v-if="showExportButton" @click="exportToExcel"
  class="bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            {{ t("exportExcel") || "Export Excel" }}
          </button>

          <button v-if="showPrintButton" @click="printTable"
            class="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
              </path>
            </svg>
            {{ t("print") || "Print" }}
          </button>
        </div>
      </div>

      <!-- Printable Table Container -->
      <div id="printable-table" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="w-full border-collapse">
          <thead>
            <tr
              class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-600">
              <th v-if="props.showRowNumber"
                class="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                #
              </th>
              <th v-for="header in props.headers" :key="header.value" v-show="visibleColumns.includes(header.value)"
                :style="getColumnStyle(header.value)" :class="[
                  'px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 select-none text-left border-r border-gray-200 dark:border-gray-600 last:border-r-0 transition-all duration-150',
                ]" @click="toggleSort(header.value)">
                <div class="flex items-center justify-between group content-center">
                  <span
                    class="text-xs font-bold text-gray-700 text-center dark:text-gray-200 uppercase tracking-wider">{{
                      header.caption }}
                    <span v-if="header.print === false" class="ml-1 text-gray-400 dark:text-gray-500 print-hide"
                      title="This column will be hidden when printing">
                      <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </span>
                  </span>
                  <div class="flex items-center ml-2 print-hide">
                    <span v-if="sortKey === header.value" class="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {{ sortAsc ? "↑" : "↓" }}
                    </span>
                    <svg v-else
                      class="w-3 h-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-50 transition-opacity"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(row, rowIndex) in paginatedItems" :key="rowIndex"
              class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all duration-150 group">
              <td v-if="props.showRowNumber"
                class="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 group-hover:bg-blue-100 dark:group-hover:bg-gray-600/50">
                {{ rowIndex + 1 + (currentPage - 1) * pageSize }}
              </td>
              <td v-for="header in props.headers" :key="header.value" v-show="visibleColumns.includes(header.value)"
                :style="getColumnStyle(header.value)"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                <slot :name="header.value" :row="row" :value="row[header.value]">
                  {{ row[header.value] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center" v-if="showPagination && props.items.length">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ t("showing") || "Showing" }}
          <span class="font-medium text-gray-900 dark:text-gray-100">{{
            (currentPage - 1) * pageSize + 1
          }}</span>
          -
          <span class="font-medium text-gray-900 dark:text-gray-100">{{
            Math.min(currentPage * pageSize, sortedItems.length)
          }}</span>
          {{ t("of") || "of" }}
          <span class="font-medium text-gray-900 dark:text-gray-100">{{
            sortedItems.length
          }}</span>
          {{ t("results") || "results" }}
        </div>

        <div class="flex items-center gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-gray-100">
            {{ t("prev") || "Prev" }}
          </button>

          <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t("page") || "Page" }}
            <span class="font-medium text-gray-900 dark:text-gray-100">{{
              currentPage
            }}</span>
            {{ t("of") || "of" }}
            <span class="font-medium text-gray-900 dark:text-gray-100">{{
              totalPages
            }}</span>
          </span>
          <button @click="currentPage++" :disabled="currentPage >= totalPages"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-gray-100">
            {{ t("next") || "Next" }}
          </button>
        </div>
      </div>
    </div>


    <!-- No Data Message -->
    <div v-else-if="!props.items.length && props.showNoData"
      class="text-center mt-8 py-8 text-gray-500 dark:text-gray-400">
      <div class="text-lg">{{ t(props.titleNoData) || t("noData") }}</div>
    </div>

    <!-- No Results Message -->
    <div v-else-if="!filteredItems.length"
      class="text-center   py-4 text-gray-500 dark:text-gray-400 border-2 border-dotted border-gray-400 rounded-lg">
      <div class="text-lg">
        {{ t(props.titleNoData) || "No results found for your search" }}
      </div>
    </div>
    <!-- Overlay to close popup when clicking outside -->
    <div v-if="showColumnPopup" @click="showColumnPopup = false" class="fixed inset-0 z-40"></div>
  </div>
</template>

<style scoped>
.table-container {
  position: relative;
}

/* Custom scrollbar for column popup */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500;
}

/* Dark theme gradient support */
.dark .bg-gradient-to-r.from-gray-50.to-gray-100 {
  background: linear-gradient(to right, rgb(31, 41, 55), rgb(17, 24, 39));
}

/* Print-specific styles */
@media print {
  .table-container>*:not(#printable-table) {
    display: none !important;
  }

  #printable-table {
    overflow: visible !important;
    border: none !important;
    border-radius: 0 !important;
  }

  table {
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  /* Hide sort buttons and controls in print */
  .print-hide {
    display: none !important;
  }

  /* Hide columns with print: false */
  .print-hide-column {
    display: none !important;
  }

  /* Reset colors for print */
  th,
  td {
    background: white !important;
    color: black !important;
  }

  th {
    background: #f5f5f5 !important;
  }
}
</style>