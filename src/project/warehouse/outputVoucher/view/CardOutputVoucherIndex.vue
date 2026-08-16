<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { t } from "@/utilities/I18nPlugin";
import type { IOutputVoucher } from "@/project/warehouse/outputVoucher/IOutputVoucher";

const router = useRouter();

const props = defineProps<{ item: IOutputVoucher }>();

const formattedDate = computed(() => {
  const raw = props.item?.date ?? "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw || t("noDate");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

const employeeName = computed(() => props.item?.Employee?.name || t("unknown"));
const createdByName = computed(
  () => props.item?.UserCreated?.name || t("unknown")
);

function goToDetails() {
  router.push({ name: "outputVoucherUpdate", params: { id: props.item.id } });
}
</script>

<template>
  <!-- اجعل البطاقة RTL ومُحاذاة يمين -->
  <div
    dir="rtl"
    @click="goToDetails"
    class="group relative m-1 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-right shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-card"
  >
    <!-- الرأس: رقم السند + التاريخ -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3
          class="truncate text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          {{ props.item.number }}
        </h3>
        <div
          class="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
        >
          <!-- calendar -->
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 14H5V9h14v9Z"
            />
          </svg>
          <span class="truncate">{{ formattedDate }}</span>
        </div>
      </div>

      <!-- سهم للانتقال (يُناسب RTL) -->
      <div
        class="rounded-full bg-gray-100 p-1.5 transition-transform duration-200 group-hover:-translate-x-0.5 dark:bg-gray-700"
        aria-hidden="true"
      >
        <svg
          class="h-4 w-4 text-gray-500 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <!-- chevron-left -->
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
        </svg>
      </div>
    </div>

    <!-- فاصل -->
    <div class="my-3 h-px w-full bg-gray-100 dark:bg-gray-700/60"></div>

    <!-- الجسم: معلومات موظف/منشئ -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <!-- معلومات الشخص -->
      <div class="space-y-2">
        <div
          class="flex items-center justify-start gap-2 text-sm text-gray-700 dark:text-gray-200"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4Z"
            />
          </svg>
          <span class="font-medium">{{ employeeName }}</span>
          <span
            class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {{ t("employee") }}
          </span>
        </div>

        <div
          class="flex items-center justify-start gap-2 text-sm text-gray-700 dark:text-gray-200"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.3a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.84Z"
            />
          </svg>
          <span class="font-medium"> {{ createdByName }}</span>
          <span
            class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {{ t("created") }}
          </span>
        </div>
      </div>

      <!-- بادجات مختصرة -->
      <div
        class="flex flex-wrap items-center justify-start gap-2 sm:justify-end"
      >
        <div
          class="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M2.5 7.56 12 13l9.5-5.44L12 2 2.5 7.56ZM12 14.5 2 9l10 10.5L22 9 12 14.5Z"
            />
          </svg>
          <span class="tabular-nums">{{ props.item.itemsCount }}</span>
          <span class="hidden sm:inline">{{ t("items") }}</span>
        </div>
      </div>
    </div>

    <!-- ملاحظات -->
    <p
      v-if="props.item.notes"
      class="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      v-html="props.item.notes"
    />
  </div>
</template>
