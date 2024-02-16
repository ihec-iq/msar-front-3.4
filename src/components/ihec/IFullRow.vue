<!-- <script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  col: {
    type: [Number],
    default: 12,
  },
});
//${props.col}
var rowClass = `grid grid-cols-12`;
</script> -->

<template>
  <div class="grid grid-cols-12">
    <slot></slot>
  </div>
</template>
