<script setup lang="ts">
import { useRouter } from "vue-router";
import { t } from "@/utilities/I18nPlugin";
// Note: The IButton2 component is no longer needed as we've opted for a more integrated UI.

const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

/**
 * Navigates to the detail page for the voucher.
 * This is triggered by clicking anywhere on the card.
 */
const goToDetails = () => {
  router.push({
    name: "outputVoucherUpdate",
    params: { id: props.item.id },
  });
};
</script>

<template>
  <div
    @click="goToDetails"
    class="group flex m-1 cursor-pointer items-start justify-between gap-6 rounded-xl bg-cardLight p-5 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:bg-card dark:shadow-black/20 dark:hover:border-primary/50"
  >
    <div class="flex-1 overflow-hidden">
      <div class="space-y-3">
        <p class="truncate text-xl font-bold text-primary dark:text-secondary">
          {{ item.number }}
        </p>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-textGray">
          <div class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12H12V17H17V12M16 1V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H18V1M19 19H5V8H19V19Z" />
            </svg>
            <span>{{ item.date }}</span>
          </div>
          <div class="flex items-center gap-1.5" title="Items count">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.5 7.56L12 13L21.5 7.56L12 2L2.5 7.56M12 14.5L2 9L12 19.5L22 9L12 14.5Z" />
            </svg>
            <span>{{ item.itemsCount }} {{ t("items") }}</span>
          </div>
          <div class="flex items-center gap-1.5" title="Items count">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4A4 4 0 0 1 16 8A4 4 0 0 1 12 12A4 4 0 0 1 8 8A4 4 0 0 1 12 4M12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" />
            </svg>
            <span>{{ item.UserCreated.name }} {{ t("User") }}</span>
          </div>
        </div>

        <p v-if="item.notes" class="line-clamp-2 text-sm text-text dark:text-textLight" v-html="item.notes" />
      </div>
    </div>

    <div class="flex-shrink-0 self-center">
      <div class="rounded-full bg-gray-100 p-2 transition-colors duration-300 group-hover:bg-primary/20 dark:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 transition-colors duration-300 group-hover:text-primary dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
        </svg>
      </div>
    </div>
  </div>
</template>