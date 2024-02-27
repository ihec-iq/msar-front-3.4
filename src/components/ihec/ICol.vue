<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  span: {
    type: [Number, String],
    default: 1,
  },
  spanXl: {
    type: [Number, String],
    default: null,
  },
  spanLg: {
    type: [Number, String],
    default: null,
  },
  spanMd: {
    type: [Number, String],
    default: null,
  },
  spanSm: {
    type: [Number, String],
    default: null,
  },
  spanXs: {
    type: [Number, String],
    default: null,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});
const colClass = computed(() => {
  var classStyle = "";
  if (props.span != null) classStyle += ` col-span-${props.span}`;
  if (props.spanXl != null) classStyle += ` xl:col-span-${props.spanXl}`;
  if (props.spanLg != null) classStyle += ` lg:col-span-${props.spanLg}`;
  if (props.spanMd != null) classStyle += ` md:col-span-${props.spanMd}`;
  if (props.spanSm != null) classStyle += ` sm:col-span-${props.spanSm}`;
  if (props.spanXs != null) classStyle += ` xs:col-span-${props.spanXs}`;
  return classStyle
});
</script>

<template>
  <div :class="colClass" class="ltr:mr-2 rtl:ml-2">
    <div v-if="debug">{{ colClass }}</div>
    <slot></slot>
  </div>
</template>
