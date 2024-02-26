<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  span: {
    type: [Number, String],
    default: 1,
  },
  spanLg: {
    type: [Number, String],
    default: 1,
  },
  spanMd: {
    type: [Number, String],
    default: 1,
  },
  spanSm: {
    type: [Number, String],
    default: 1,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});
const colClass = computed(() => {
  return `col-span-${props.span} lg:col-span-${props.spanLg} md:col-span-${props.spanMd} sm:col-span-${props.spanSm}`;
});
</script>

<template>
  <div :style="colClass" class="ltr:mr-2 rtl:ml-2">
    <div v-if="debug">{{ colClass }}</div>
    <slot></slot>
  </div>
</template>
