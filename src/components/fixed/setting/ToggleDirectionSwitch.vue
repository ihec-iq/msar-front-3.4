<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  checked: boolean;       // true => RTL
  disabled?: boolean;
  rtlLabel?: string;
  ltrLabel?: string;
}>();
const emit = defineEmits<{ (e: "toggle"): void }>();

// قياسات مضبوطة (أعلى قليلًا من السابق)
const HEIGHT = 28;        // ↑ أعلى قليلًا
const KNOB   = 22;        // قطر الدائرة
const PADX   = 10;        // حشوة أفقية
const GAP    = 6;         // مسافة أمان
const FONT   = "13px Inter, system-ui, sans-serif";
const MIN_W  = 78;        // أقل عرض محترم

const currentLabel = computed(() =>
  props.checked ? (props.rtlLabel ?? "RTL") : (props.ltrLabel ?? "LTR")
);

// قياس عرض النص بدقة
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
const labelPx = ref(0);
const measure = () => {
  ctx.font = FONT;
  labelPx.value = Math.ceil(ctx.measureText(currentLabel.value).width);
};
watch([() => props.checked, () => props.rtlLabel, () => props.ltrLabel], measure, { immediate: true });

// العرض = padding + نص + مساحة مقبض + padding
const trackW = computed(() =>
  Math.max(PADX + labelPx.value + (KNOB + GAP) + PADX, MIN_W)
);

const onClick = () => { if (!props.disabled) emit("toggle"); };
const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return;
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); emit("toggle"); }
};

// CSS ديناميكي
const trackClass = computed(() =>
  [
    "relative inline-flex items-center rounded-full select-none",
    "transition-colors duration-200",
    props.checked ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-gray-600",
    props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  ].join(" ")
);
const trackStyle = computed(() => ({
  width:  `${trackW.value}px`,
  height: `${HEIGHT}px`,
}));

// النص: دائمًا مقابل جهة المقبض
const labelClass = computed(() =>
  [
    "w-full flex items-center text-white font-semibold leading-none",
    props.checked ? "justify-start" : "justify-end",
  ].join(" ")
);
const labelStyle = computed(() => ({
  font: FONT,
  whiteSpace: "nowrap",
  // padding بحيث لا يصطدم بالمقبض
  paddingLeft:  props.checked ? `${PADX}px` : `${KNOB + PADX / 2}px`,
  paddingRight: props.checked ? `${KNOB + PADX / 2}px` : `${PADX}px`,
}));

// موضع المقبض
const knobStyle = computed(() => {
  const top = (HEIGHT - KNOB) / 2;
  const startLeft = 2;
  const endLeft = trackW.value - KNOB - 2;
  const tx = props.checked ? (endLeft - startLeft) : 0;
  return {
    width: `${KNOB}px`,
    height:`${KNOB}px`,
    top:   `${top}px`,
    left:  `${startLeft}px`,
    transform: `translateX(${tx}px)`,
  };
});
const knobIconColor = computed(() => (props.checked ? "#2563eb" : "#6b7280"));
</script>

<template>
  <button
    type="button"
    :class="trackClass"
    :style="trackStyle"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    @click="onClick"
    @keydown="onKeydown"
  >
    <!-- النص في الجهة المعاكسة للمقبض -->
    <span :class="labelClass" :style="labelStyle">{{ currentLabel }}</span>

    <!-- الدائرة: الأيقونة بالوسط تمامًا -->
    <span
      class="absolute rounded-full bg-white dark:bg-neutral-100 shadow
             transition-transform duration-200 grid place-items-center"
      :style="knobStyle"
    >
      <Icon
        :icon="checked ? 'mdi:format-textdirection-r-to-l' : 'mdi:format-textdirection-l-to-r'"
        class="text-[12px]"
        :style="{ color: knobIconColor }"
      />
    </span>
  </button>
</template>
