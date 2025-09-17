<script setup lang="ts">
import { computed, type PropType, useSlots } from "vue";
import { Icon } from "@iconify/vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

// So we control class/attrs on the root element cleanly
defineOptions({ inheritAttrs: false });

type ButtonColor = "blue" | "green" | "amber" | "red" | "white" | "gray" | "slate";
type ButtonSize = "sm" | "md" | "lg";

const props = defineProps({
  /** Visible text. If omitted, use the default slot instead. */
  text: { type: String, default: "" },

  /** Optional name attribute for forms / accessibility fallback. */
  name: { type: String, default: "Btn" },

  /** Visual style variant (uses your existing enum). Prefer this over the deprecated `type` below. */
  variant: { type: String as PropType<EnumButtonType>, default: EnumButtonType.Default },

  /** Back-compat: old prop used for visual variant. Use `variant` going forward. */
  type: { type: String as PropType<EnumButtonType>, default: EnumButtonType.Default },

  /** Color palette (explicit to keep Tailwind safe). */
  color: { type: String as PropType<ButtonColor>, default: "blue" },

  /** Size scale. */
  size: { type: String as PropType<ButtonSize>, default: "md" },

  /** Iconify icon names. You can pass "mdi:content-save" or just "content-save". */
  preIcon: { type: String, default: "" },
  postIcon: { type: String, default: "" },

  /** States & layout. */
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  rounded: { type: Boolean, default: true },

  /** Native button type for forms. */
  nativeType: { type: String as PropType<"button" | "submit" | "reset">, default: "button" },

  /** Back-compat: prefer @click instead. */
  onClick: { type: Function as PropType<(...args: any[]) => void>, default: undefined },
});

const emit = defineEmits<{ (e: "click", event: MouseEvent): void }>();
const slots = useSlots();

const effectiveVariant = computed<EnumButtonType>(() => props.variant ?? props.type);

const colorMap: Record<
  ButtonColor,
  {
    solidBg: string; solidHover: string; solidText: string;
    outlineBorder: string; outlineText: string; outlineHover: string;
    textColor: string; textHover: string; ring: string;
  }
> = {
  blue:  { solidBg: "bg-blue-600",  solidHover: "hover:bg-blue-700",  solidText: "text-white",
           outlineBorder: "border-blue-600", outlineText: "text-blue-600", outlineHover: "hover:bg-blue-50",
           textColor: "text-blue-600", textHover: "hover:bg-blue-50", ring: "focus-visible:ring-blue-600" },
  green: { solidBg: "bg-green-600", solidHover: "hover:bg-green-700", solidText: "text-white",
           outlineBorder: "border-green-600", outlineText: "text-green-600", outlineHover: "hover:bg-green-50",
           textColor: "text-green-600", textHover: "hover:bg-green-50", ring: "focus-visible:ring-green-600" },
  amber: { solidBg: "bg-amber-500", solidHover: "hover:bg-amber-600", solidText: "text-white",
           outlineBorder: "border-amber-600", outlineText: "text-amber-600", outlineHover: "hover:bg-amber-50",
           textColor: "text-amber-600", textHover: "hover:bg-amber-50", ring: "focus-visible:ring-amber-600" },
  red:   { solidBg: "bg-red-600",   solidHover: "hover:bg-red-700",   solidText: "text-white",
           outlineBorder: "border-red-600", outlineText: "text-red-600", outlineHover: "hover:bg-red-50",
           textColor: "text-red-600", textHover: "hover:bg-red-50", ring: "focus-visible:ring-red-600" },
  white: { solidBg: "bg-white",     solidHover: "hover:bg-gray-50",   solidText: "text-gray-900",
           outlineBorder: "border-gray-300", outlineText: "text-gray-700", outlineHover: "hover:bg-gray-50",
           textColor: "text-gray-700", textHover: "hover:bg-gray-50", ring: "focus-visible:ring-gray-400" },
  gray:  { solidBg: "bg-gray-600",  solidHover: "hover:bg-gray-700",  solidText: "text-white",
           outlineBorder: "border-gray-600", outlineText: "text-gray-700", outlineHover: "hover:bg-gray-50",
           textColor: "text-gray-700", textHover: "hover:bg-gray-50", ring: "focus-visible:ring-gray-600" },
  slate: { solidBg: "bg-slate-600", solidHover: "hover:bg-slate-700", solidText: "text-white",
           outlineBorder: "border-slate-600", outlineText: "text-slate-700", outlineHover: "hover:bg-slate-50",
           textColor: "text-slate-700", textHover: "hover:bg-slate-50", ring: "focus-visible:ring-slate-600" },
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 font-medium transition-transform duration-150 " +
  "active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed select-none";

const roundedClass = computed(() => (props.rounded ? "rounded-lg" : "rounded"));

const variantClass = computed(() => {
  const c = colorMap[props.color] ?? colorMap.blue;
  if (effectiveVariant.value === EnumButtonType.Outlined) {
    return ["bg-transparent", "border", c.outlineBorder, c.outlineText, c.outlineHover, c.ring];
    }
  if (effectiveVariant.value === EnumButtonType.Text) {
    return ["bg-transparent", c.textColor, c.textHover, c.ring];
  }
  // Default (solid)
  return [c.solidBg, c.solidHover, c.solidText, c.ring];
});

const computedClass = computed(() => {
  const widthClass = props.block ? "w-full" : "";
  return [baseButtonClass, roundedClass.value, sizeMap[props.size], widthClass, ...variantClass.value];
});

const iconClass = computed(() => (props.size === "sm" ? "w-4 h-4" : "w-5 h-5"));

const normalizedPreIcon = computed(() =>
  props.preIcon ? (props.preIcon.includes(":") ? props.preIcon : `mdi:${props.preIcon}`) : ""
);
const normalizedPostIcon = computed(() =>
  props.postIcon ? (props.postIcon.includes(":") ? props.postIcon : `mdi:${props.postIcon}`) : ""
);

const ariaLabel = computed(() => {
  if (props.text) return props.text;
  if (slots.default) return undefined; // screen readers will use the slot text
  return props.name || "Button";
});

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return;
  if (props.onClick) {
    props.onClick(); // back-compat
    return
  }
  emit("click", event);
}
</script>

<template>
  <button
    :type="nativeType"
    :name="name"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel"
    :disabled="disabled || loading"
    :class="computedClass"
    v-bind="$attrs"
    @click="handleClick"
    class="h-10"
  >
    <!-- Leading icon slot (falls back to preIcon prop) -->
    <slot name="leading">
      <Icon v-if="normalizedPreIcon" :icon="normalizedPreIcon" :class="iconClass" />
    </slot>

    <!-- Content: prefer text prop, otherwise default slot -->
    <span v-if="text">{{ text }}</span>
    <slot v-else />

    <!-- Trailing icon slot (falls back to postIcon prop) -->
    <slot name="trailing">
      <Icon v-if="normalizedPostIcon" :icon="normalizedPostIcon" :class="iconClass" />
    </slot>

    <!-- Loading indicator -->
    <svg
      v-if="loading"
      class="ml-2 animate-spin inline-block"
      :class="iconClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
    </svg>
  </button>
</template>

<style scoped>
button:hover { transform: scale(1.02); }
</style>
