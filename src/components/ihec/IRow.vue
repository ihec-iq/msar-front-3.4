<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  col: {
    type: Number,
    default: 1,
  },
  colLg: {
    type: Number,
    default: 1,
  },
  colMd: {
    type: Number,
    default: 1,
  }, 
  colSm: {
    type: Number,
    default: 1,
  },
});
var colClass = `grid grid-cols-${props.col} lg:grid-cols-${props.colLg} md:grid-cols-${props.colMd} sm:grid-cols-${props.colSm}`;
// var colClass  = `ltr:mr-2 rtl:ml-2 col-span-${props.col}`;
</script>
<template>
  <div name="Row#" :class="colClass" class="lg:justify-around xs:items-center mt-4 w-full ltr:pl-1 rtl:pr-1">
    <slot></slot>
  </div>
</template>
