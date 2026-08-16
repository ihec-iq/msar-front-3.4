<script setup lang="ts">
/**
 * ICol.vue — عمود (grid item) مرن داخل IRow
 * - Vue 3 + TS Composition API
 * - يدعم col-span لكل breakpoint: base, sm, md, lg, xl (بدون xs)
 * - يضبط القيم إلى المجال الآمن 1..12 لتفادي أخطاء Tailwind
 * - debug mode: يظهر الأصناف الناتجة
 * - disabled: يعطل التفاعل + aria-disabled
 * - optional gutter: هامش جانبي بسيط عند الحاجة (افتراضيًا معطّل لأن IRow يضبط gap)
 */

import { computed } from "vue";

type Size = number | string | null | undefined;

const props = withDefaults(
  defineProps<{
    /** حجم العمود الأساسي 1..12 */
    span?: Size;
    /** أحجام استجابية */
    spanSm?: Size;
    spanMd?: Size;
    spanLg?: Size;
    spanXl?: Size;

    /** تفعيل حدّ أحمر للتصحيح */
    debug?: boolean;

    /** تعطيل محتوى العمود (pointer-events + opacity + aria-disabled) */
    disabled?: boolean;

    /** تفعيل مسافة جانبية بسيطة (عندما لا تستخدم gap في IRow) */
    gutter?: boolean;
  }>(),
  {
    span: 1,
    spanSm: null,
    spanMd: null,
    spanLg: null,
    spanXl: null,
    debug: false,
    disabled: false,
    gutter: false,
  }
);

/** يضمن القيمة ضمن 1..12 ويحوّلها لرقم */
function clampSpan(n: Size): number | null {
  if (n === null || n === undefined || n === "") return null;
  const num = Number(n);
  if (Number.isNaN(num)) return null;
  return Math.max(1, Math.min(12, num));
}

/** يبني صنف col-span-* آمن، مع بادئة breakpoint عند الحاجة */
function spanClass(n: Size, prefix = ""): string {
  const v = clampSpan(n);
  return v ? `${prefix}col-span-${v}` : "";
}

/** جميع الأصناف المحسوبة — نستخدم مصفوفة ثم join لتفادي مسافات زائدة */
const colClass = computed(() => {
  const classes: string[] = [];
  classes.push(spanClass(props.span));
  classes.push(spanClass(props.spanSm, "sm:"));
  classes.push(spanClass(props.spanMd, "md:"));
  classes.push(spanClass(props.spanLg, "lg:"));
  classes.push(spanClass(props.spanXl, "xl:"));
  if (props.debug) classes.push("border border-red-500");
  return classes.filter(Boolean).join(" ");
});

/** مسافة جانبية اختيارية (لو ما في gap على مستوى IRow) */
const gutterClass = computed(() => (props.gutter ? "ltr:mr-2 rtl:ml-2" : ""));

/** صنف التعطيل */
const disabledClass = computed(() => (props.disabled ? "icol--disabled" : ""));

/** نص الـ debug */
const debugText = computed(() => (props.debug ? colClass.value : ""));
</script>

<template>
  <div
    :class="[colClass, gutterClass, disabledClass]"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <div v-if="debug" class="text-xs text-red-600/80 mb-1 select-all">
      {{ debugText }}
    </div>

    <slot />
  </div>
</template>

<style scoped>
/* تعطيل التفاعل + خفض الشفافية مع احترام محتوى النموذج */
.icol--disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* ملاحظة: تجنّبنا xs: لأن Tailwind يبدأ من sm */
</style>
