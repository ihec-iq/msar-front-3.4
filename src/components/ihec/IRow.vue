<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  title: {
    type: [String],
    default: "",
  },
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
  <div class="w-full">
    <div v-if="title"
      class="hover:text-gray-300 dark:hover:text-gray-700 duration-300 text-lg font-bold header-title text-blue-700 dark:text-blue-300 py-2 w-full basis-full px-2 bg-gray-200 dark:bg-gray-800">
      {{ title }}</div>
    <div name="Row#" :class="[colClass, debugClass]" class="lg:justify-around xs:items-center mt-4 w-full px-1">
      <div v-if="debug">{{ colClass }}</div>
      <slot></slot>
    </div>
  </div>

</template>
