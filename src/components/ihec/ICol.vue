<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  col: {
    type: Number,
    default: 12,
  },
});
var colClass = `grid-column: span ${props.col} / span ${props.col};`;
// var colClass  = `ltr:mr-2 rtl:ml-2 col-span-${props.col}`;
</script>

<template>
  <div :style="colClass" class="ltr:mr-2 rtl:ml-2">
    <slot></slot>
  </div>
</template>
