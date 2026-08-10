// ─────────────────────────────────────────────────────────────────────────────
// File: ITablePagination.vue // Simple, accessible pager for client-side mode.
// ─────────────────────────────────────────────────────────────────────────────
<script setup lang="ts">
const props = defineProps<{
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
}>();
const emit = defineEmits<{ (e: "prev"): void; (e: "next"): void }>();
</script>

<template>
  <div class="mt-4 flex justify-between items-center">
    <div class="text-sm text-gray-600 dark:text-gray-400">
      Showing
      <span class="font-medium text-gray-900 dark:text-gray-100">{{
        from
      }}</span>
      -
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ to }}</span>
      of
      <span class="font-medium text-gray-900 dark:text-gray-100">{{
        total
      }}</span>
      results
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('prev')"
        :disabled="page === 1"
        class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300"
      >
        Prev
      </button>
      <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400"
        >Page
        <span class="font-medium text-gray-900 dark:text-gray-100">{{
          page
        }}</span>
        of
        <span class="font-medium text-gray-900 dark:text-gray-100">{{
          totalPages
        }}</span></span
      >
      <button
        @click="$emit('next')"
        :disabled="page >= totalPages"
        class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300"
      >
        Next
      </button>
    </div>
  </div>
</template>
