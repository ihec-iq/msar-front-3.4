<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "CardArchiveTypeIndex" });

type CardAccentColor = "slate" | "blue" | "green" | "amber" | "red";

const props = withDefaults(
  defineProps<{
    title: string;
    count?: number | string;
    color?: CardAccentColor;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    count: 0,
    color: "slate",
    disabled: false,
    loading: false,
  }
);

const emit = defineEmits<{ (e: "click", event: MouseEvent): void }>();

const formattedCount = computed(() =>
  typeof props.count === "number"
    ? props.count.toLocaleString()
    : String(props.count)
);

const accentClasses = computed(() => {
  switch (props.color) {
    case "blue":
      return {
        ring: "focus-visible:ring-blue-500",
        badge:
          "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
      };
    case "green":
      return {
        ring: "focus-visible:ring-green-500",
        badge:
          "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300",
        icon: "text-green-600 dark:text-green-400",
      };
    case "amber":
      return {
        ring: "focus-visible:ring-amber-500",
        badge:
          "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
        icon: "text-amber-600 dark:text-amber-400",
      };
    case "red":
      return {
        ring: "focus-visible:ring-rose-500",
        badge:
          "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
        icon: "text-rose-600 dark:text-rose-400",
      };
    default:
      return {
        ring: "focus-visible:ring-slate-500",
        badge:
          "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
        icon: "text-slate-500 dark:text-slate-300",
      };
  }
});

function handleClick(event: MouseEvent): void {
  if (props.disabled || props.loading) return;
  emit("click", event);
}
</script>

<template>
  <button
    type="button"
    :aria-label="`${title} (${formattedCount})`"
    :disabled="disabled"
    @click="handleClick"
    class="group w-full text-start rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
    :class="accentClasses.ring"
  >
    <div class="flex items-center justify-between gap-3">
      <!-- Title + Icon -->
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800"
        >
          <!-- Custom icon slot (falls back to a tidy default) -->
          <slot name="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-5 w-5"
              :class="accentClasses.icon"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M20 6h-4V4H8v2H4v14h16zM10 6h4v2h-4z"
              />
            </svg>
          </slot>
        </div>

        <h3
          class="truncate text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100"
        >
          {{ title }}
        </h3>
      </div>

      <!-- Count pill -->
      <div
        class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border border-transparent"
        :class="accentClasses.badge"
      >
        <svg
          v-if="loading"
          class="h-3.5 w-3.5 animate-spin me-1"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            opacity="0.25"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
          />
        </svg>
        <span class="tabular-nums">{{ formattedCount }}</span>
      </div>
    </div>
  </button>
</template>
