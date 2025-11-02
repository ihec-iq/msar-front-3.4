<script setup lang="ts">
/**
 * IRow.vue — Responsive grid row with optional collapsible section.
 * - Vue 3 + TS Composition API
 * - TailwindCSS utilities
 * - Clean, safe class generation (no purge surprises)
 * - Accessible: keyboard toggle + ARIA
 */

import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";

/** Allowed Tailwind gap sizes to avoid purge of dynamic classes */
const GAP_CLASS: Record<string | number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

type Size = number | string | null | undefined;

const props = withDefaults(
  defineProps<{
    /** Optional section title shown in the header bar */
    title?: string;
    /** Base columns (1–12) */
    cols?: Size;
    /** Responsive columns (Tailwind breakpoints; no `xs` by default) */
    colsSm?: Size;
    colsMd?: Size;
    colsLg?: Size;
    colsXl?: Size;
    /** Tailwind gap size (keys in GAP_CLASS) */
    gap?: keyof typeof GAP_CLASS | number | string;
    /** Draw red debug border around the grid */
    debug?: boolean;
    /** Enable header click-to-collapse */
    collapsible?: boolean;
    /** v-model:open — controls expanded/collapsed state */
    open?: boolean;
  }>(),
  {
    cols: 1,
    colsSm: null,
    colsMd: null,
    colsLg: null,
    colsXl: null,
    gap: 4,
    debug: false,
    collapsible: true,
    open: true,
  }
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

/** Internal open state mirrors v-model:open */
const isOpen = ref<boolean>(props.open);
watch(
  () => props.open,
  (v) => (isOpen.value = v)
);

/** Clamp and stringify grid-cols-* safely (1..12) */
function gridColsClass(n: Size, prefix = ""): string {
  if (n === null || n === undefined || n === "") return "";
  const num = Math.max(1, Math.min(12, Number(n)));
  return `${prefix}grid-cols-${num}`;
}

/** Build grid + responsive classes */
const gridClass = computed(() => {
  const classes: string[] = ["grid", gapClass.value];
  classes.push(gridColsClass(props.cols));
  classes.push(gridColsClass(props.colsSm, "sm:"));
  classes.push(gridColsClass(props.colsMd, "md:"));
  classes.push(gridColsClass(props.colsLg, "lg:"));
  classes.push(gridColsClass(props.colsXl, "xl:"));
  if (props.debug) classes.push("border border-red-500");
  return classes.filter(Boolean).join(" ");
});

/** Safe gap class from whitelist (fallback to gap-4) */
const gapClass = computed(() => {
  const key = String(props.gap) as keyof typeof GAP_CLASS;
  return GAP_CLASS[key] ?? GAP_CLASS[4];
});

/** Toggle with mouse/keyboard and sync v-model */
function toggle() {
  if (!props.collapsible) return;
  isOpen.value = !isOpen.value;
  emit("update:open", isOpen.value);
}
function onKeyToggle(e: KeyboardEvent) {
  if (!props.collapsible) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggle();
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <div
      v-if="title"
      class="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold select-none shadow-sm"
      :class="collapsible ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors' : ''"
      role="button"
      :aria-expanded="isOpen"
      :tabindex="collapsible ? 0 : -1"
      @click="toggle"
      @keydown="onKeyToggle"
    >
      <span class="truncate">{{ title }}</span>

      <div class="flex items-center gap-2">
        <!-- Extra actions in the header -->
        <slot name="header-extra" />
        <!-- Chevron only when collapsible -->
        <Icon
          v-if="collapsible"
          :icon="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          class="text-xl"
          aria-hidden="true"
        />
      </div>
    </div>

    <!-- Content -->
    <transition name="row-collapse">
      <div
        v-show="isOpen"
        class="w-full mt-3"
      >
        <div
          :class="gridClass"
          class="w-full rounded-xl bg-white/60 dark:bg-white/5 p-2 sm:p-3 lg:p-4 shadow-sm"
        >
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Smooth height toggle; keep lightweight */
.row-collapse-enter-active,
.row-collapse-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.row-collapse-enter-from,
.row-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
