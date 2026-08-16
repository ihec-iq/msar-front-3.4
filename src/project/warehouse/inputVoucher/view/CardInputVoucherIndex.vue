<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { useRouter } from "vue-router";

defineOptions({ name: "CardInputVoucherIndex" });

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";
type Density = "comfortable" | "compact";

import type { IInputVoucher } from "../IInputVoucher";

const props = withDefaults(
  defineProps<{
    item: IInputVoucher;
    routeName?: string;
    showNotes?: boolean;
    notesAreHtml?: boolean;
    disabled?: boolean;
    loading?: boolean;
    tone?: Tone;
    density?: Density;
    showChevron?: boolean;
  }>(),
  {
    routeName: "inputVoucherUpdate",
    showNotes: true,
    notesAreHtml: true,
    disabled: false,
    loading: false,
    tone: "neutral",
    density: "comfortable",
    showChevron: true,
  }
);

const router = useRouter();

const paddingClass = computed(() =>
  props.density === "compact" ? "px-3 py-2" : "px-4 py-3"
);

const accent = computed(() => {
  switch (props.tone) {
    case "brand":
      return {
        stripe: "bg-primary/80",
        text: "text-primary",
        ring: "focus-visible:ring-primary/60",
        badge: "text-primary bg-primary/10",
      };
    case "success":
      return {
        stripe: "bg-green-600/80",
        text: "text-green-700 dark:text-green-400",
        ring: "focus-visible:ring-green-600/60",
        badge: "text-green-700 dark:text-green-400 bg-green-600/10",
      };
    case "warning":
      return {
        stripe: "bg-amber-600/80",
        text: "text-amber-700 dark:text-amber-400",
        ring: "focus-visible:ring-amber-600/60",
        badge: "text-amber-700 dark:text-amber-400 bg-amber-600/10",
      };
    case "danger":
      return {
        stripe: "bg-rose-600/80",
        text: "text-rose-700 dark:text-rose-400",
        ring: "focus-visible:ring-rose-600/60",
        badge: "text-rose-700 dark:text-rose-400 bg-rose-600/10",
      };
    default:
      return {
        stripe: "bg-gray-400/70 dark:bg-gray-500/70",
        text: "text-gray-700 dark:text-gray-300",
        ring: "focus-visible:ring-gray-500/50",
        badge:
          "text-gray-700 dark:text-gray-300 bg-gray-200/60 dark:bg-gray-700/50",
      };
  }
});

const formattedDate = computed(() => {
  const v = props.item?.date;
  if (v === undefined || v === null) return "";
  const d = typeof v === "string" || typeof v === "number" ? new Date(v) : v;
  return isNaN(d.getTime())
    ? String(v)
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(d)
        .replace(/\//g, "-");
});

const formattedItemsCount = computed(() =>
  Number(props.item?.itemsCount ?? 0).toLocaleString()
);
const voucherNumberText = computed(() => String(props.item?.number ?? ""));

function navigateToDetails(): void {
  if (props.disabled || props.loading) return;
  router.push({ name: props.routeName, params: { id: props.item.id } });
}

function handleKeyActivate(e: KeyboardEvent): void {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    navigateToDetails();
  }
}
</script>

<template>
  <!-- Flat, clickable card -->
  <article
    role="button"
    tabindex="0"
    :aria-label="`${t('View Details')}: ${voucherNumberText}`"
    :aria-disabled="disabled ? 'true' : 'false'"
    @click="navigateToDetails"
    @keyup="handleKeyActivate"
    class="relative group flex w-full max-w-sm cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 transition-colors duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
    :class="accent.ring"
    :disabled="disabled"
  >
    <!-- Flat accent stripe -->
    <div
      class="absolute inset-y-0 left-0 w-1 rounded-r-md transition-opacity duration-200 opacity-70 group-hover:opacity-100"
      :class="accent.stripe"
    />

    <!-- Top row -->
    <header
      :class="[
        'flex items-start justify-between border-b border-gray-200 dark:border-gray-700 bg-transparent',
        paddingClass,
      ]"
    >
      <div
        class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M17 12H12V17H17V12M16 1V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H18V1M19 19H5V8H19V19Z"
          />
        </svg>
        <span class="tabular-nums">{{ formattedDate }}</span>
      </div>

      <span
        class="rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold"
        :class="accent.badge"
      >
        {{ formattedItemsCount }} {{ t("items") }}
      </span>
    </header>

    <!-- Content -->
    <div :class="['flex flex-col', paddingClass]">
      <h5
        class="mb-1 text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums"
      >
        {{ voucherNumberText }}
      </h5>

      <template v-if="showNotes && item?.notes">
        <p
          v-if="!notesAreHtml"
          class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
        >
          {{ item.notes }}
        </p>
        <p
          v-else
          class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
          v-html="item.notes"
        />
      </template>

      <div
        v-if="showChevron"
        class="mt-3 flex items-center justify-end text-sm font-medium opacity-70 transition-opacity duration-200 group-hover:opacity-100"
        :class="accent.text"
      >
        <span>{{ t("View Details") }}</span>
        <svg
          class="ms-1 h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
          />
        </svg>
      </div>
    </div>

    <!-- Loading (kept flat) -->
    <div
      v-if="loading"
      class="absolute inset-0 grid place-items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px]"
      aria-hidden="true"
    >
      <svg class="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-opacity="0.25"
          stroke-width="4"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          stroke-width="4"
        />
      </svg>
    </div>
  </article>
</template>
