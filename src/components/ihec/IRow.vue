<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  col: {
    type: [Number, String],
    default: 1,
  },
  colXl: {
    type: [Number, String],
    default: null,
  },
  colLg: {
    type: [Number, String],
    default: null,
  },
  colMd: {
    type: [Number, String],
    default: null,
  },
  colSm: {
    type: [Number, String],
    default: null,
  },
  colXs: {
    type: [Number, String],
    default: null,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});
const colClass = computed(() => {
  let classStyle = "grid ";
  if (props.col != null) classStyle += ` grid-cols-${props.col}`;
  if (props.colXl != null) classStyle += ` xl:grid-cols-${props.colXl}`;
  if (props.colLg != null) classStyle += ` lg:grid-cols-${props.colLg}`;
  if (props.colMd != null) classStyle += ` md:grid-cols-${props.colMd}`;
  if (props.colSm != null) classStyle += ` sm:grid-cols-${props.colSm}`;
  if (props.colXs != null) classStyle += ` xs:grid-cols-${props.colXs}`;
  return classStyle;
});
const debugClass = computed(() => {
  if (props.debug) return `border border-1 border-red-500`;
  return "";
});
</script>
<template>
  <div
    name="Row#"
    :class="[colClass, debugClass]"
    class="lg:justify-around xs:items-center mt-4 w-full px-1"
  >
    <div v-if="debug">{{ colClass }}</div>
    <slot></slot>
  </div>
</template>
