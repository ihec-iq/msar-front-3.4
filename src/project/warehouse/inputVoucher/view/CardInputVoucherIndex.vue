<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

/**
 * Navigates to the update page for the voucher.
 * Triggered by clicking anywhere on the card.
 */
const goToDetails = (id: number) => {
  router.push({
    name: "inputVoucherUpdate",
    params: { id },
  });
};
</script>

<template>
  <!-- 
    Main Card Container
    - The entire card is a clickable element for better UX.
    - 'group' allows child elements to be styled on card hover.
    - Subtle transitions and a "lift" effect on hover create a more dynamic feel.
    - A flexible height with padding ensures content fits without being cut off.
  -->
  <div
    @click="goToDetails(item.id)"
    class="group flex h-full w-full max-w-sm cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/50"
  >
    <!-- Card Header: Contains meta-information like date and item count -->
    <div class="flex items-start justify-between border-b border-gray-200 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
      <!-- Date -->
      <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 12H12V17H17V12M16 1V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H18V1M19 19H5V8H19V19Z" />
        </svg>
        <span>{{ item.date }}</span>
      </div>
      <!-- Item Count Badge -->
      <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary dark:bg-secondary/20 dark:text-secondary/80">
        {{ item.itemsCount }} {{ t("items") }}
      </span>
    </div>

    <!-- Card Body: Contains the main content -->
    <div class="flex flex-grow flex-col p-4">
      <!-- Voucher Number (Primary Identifier) -->
      <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ item.number }}
      </h5>

      <!-- Notes (Clamped to 2 lines for consistency) -->
      <p v-if="item.notes" class="line-clamp-2 flex-grow text-sm text-gray-600 dark:text-gray-400" v-html="item.notes" />

      <!-- Action Link: Appears on hover for a cleaner look -->
      <div class="mt-4 flex items-center justify-end text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-secondary">
        <span>{{ t("View Details") }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </div>
    </div>
  </div>
</template>
