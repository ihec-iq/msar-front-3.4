<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  col: {
    type: [Number, String],
    default: 1,
  },
  colLg: {
    type: [Number, String],
    default: 1,
  },
  colMd: {
    type: [Number, String],
    default: 1,
  },
  colSm: {
    type: [Number, String],
    default: 1,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});
const colClass = computed(() => {
  return `grid grid-cols-${props.col} lg:grid-cols-${props.colLg} md:grid-cols-${props.colMd} sm:grid-cols-${props.colSm}`;
});
const debugClass = computed(() => {
  if (props.debug) return `border border-1 border-red-500`;
  return "";
});

// var colClass  = `ltr:mr-2 rtl:ml-2 col-span-${props.col}`;
</script>
<template>
  <div
    name="Row#"
    :class="[colClass, debugClass]"
    class="lg:justify-around xs:items-center mt-4 w-full ltr:pl-1 rtl:pr-1"
  >
    <div v-if="debug">{{ colClass }}</div>
    <slot></slot>
  </div>
</template>
