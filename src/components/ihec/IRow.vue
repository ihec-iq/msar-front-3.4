<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";

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
  collapse: {
    type: Boolean,
    default: true,
  },
  OpenCollapse: {
    type: Boolean,
    default: true,
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
const isOpen = ref(props.OpenCollapse);
watch(() => props.OpenCollapse, (newValue) => {
  isOpen.value = newValue;
});
</script>
<template>
  <div class="w-full">
    <div v-if="title" @click="isOpen = !isOpen"
      class="hover:text-gray-300 dark:hover:text-gray-700 duration-300 text-lg font-bold header-title text-blue-700 dark:text-blue-300 py-2 w-full basis-full px-2 bg-gray-200 dark:bg-gray-800 flex justify-between items-center cursor-pointer">
      {{ title }}
      <Icon :icon="props.collapse ? (isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down') : ''" />
      <Icon icon="'mdi:chevron-up" />
    </div>
    <transition name="collapse">
      <div v-show="isOpen" name="Row#" :class="[colClass, debugClass]" class="lg:justify-around xs:items-center mt-4 w-full px-1">
        <div v-if="debug">{{ colClass }}</div>
        <slot></slot>
      </div>
    </transition>
  </div>

</template>
