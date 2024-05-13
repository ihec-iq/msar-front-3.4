<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  base: {
    type: [String],
    default: 1,
  },
  baseXl: {
    type: [String],
    default: null,
  },
  baseLg: {
    type: [String],
    default: null,
  },
  baseMd: {
    type: [String],
    default: null,
  },
  baseSm: {
    type: [String],
    default: null,
  },
  baseXs: {
    type: [String],
    default: null,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});
const colClass = computed(() => {
  let classStyle = "";
  let baseV: String = "";
  if (props.base != null) classStyle += ` w-${props.base}`;

  if (props.baseXl != null) baseV = props.baseXl;
  else baseV = props.base;

  classStyle += ` xl:w-${baseV}`;

  if (props.baseLg != null) baseV = props.baseLg;
  else baseV = props.base;
  classStyle += ` lg:w-${baseV}`;

  if (props.baseMd != null) baseV = props.baseMd;
  else baseV = props.base;
  classStyle += ` md:w-${baseV}`;

  if (props.baseSm != null) baseV = props.baseSm;
  else baseV = props.base;
  classStyle += ` sm:w-${baseV}`;

  if (props.baseXs != null) baseV = props.baseXs;
  else baseV = props.base;
  classStyle += ` xs:w-${baseV}`;
  return  classStyle;
});
const debugClass = computed(() => {
  if (props.debug) return `border border-1 border-red-500`;
  return "";
});
</script>

<template>
  <div :class="[colClass, debugClass]" class="ltr:mr-2 rtl:ml-2">
    <div v-if="debug" class="">{{ colClass }}</div>
    <slot></slot>
  </div>
</template>
