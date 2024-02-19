<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  span: {
    type: Number,
    default: 1,
  }, 
  spanLg: {
    type: Number,
    default: 1,
  }, 
  spanMd: {
    type: Number,
    default: 1,
  }, 
  spanSm: {
    type: Number,
    default: 1,
  },
});
var colClass = `col-span-${props.span} lg:col-span-${props.spanLg} md:col-span-${props.spanMd} sm:col-span-${props.spanSm}`;
// var colClass  = `ltr:mr-2 rtl:ml-2 col-span-${props.col}`;
</script>

<template>
  <div :style="colClass" class="ltr:mr-2 rtl:ml-2">
    <slot></slot>
  </div>
</template>
