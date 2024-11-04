<script setup lang="ts">
import { Icon } from '@iconify/vue';



const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "default",
  },
  color: {
    type: String,
    default: "blue",
  },
  icon: {
    type: String,
    default: "",
  },
  onClick: {
    type: Function,
    required: true,
  },
  width: {
    type: String,
    default: "32",
  },
});

const defaultClass = `bg-${props.color}-500 hover:bg-${props.color}-700 duration-500 text-white font-bold w-${props.width} py-2 px-4 rounded`;
const outlinedClass = `ring-1 ring-${props.color}-700 text-${props.color}-500 hover:bg-${props.color}-200 dark:hover:bg-${props.color}-500 dark:hover:text-white duration-300 font-bold w-${props.width} py-2 px-4 rounded`;
const iconClass = `bg-${props.color}-500 hover:bg-${props.color}-700 text-white font-bold py-2 px-4 rounded inline-flex items-center`;

var buttonClass =
  props.type === "default"
    ? defaultClass
    : props.type === "outlined"
      ? outlinedClass
      : defaultClass;

if (props.icon != "") {
  buttonClass = iconClass;
}
</script>

<template>
  <button @click="onClick()" type="button" :class="buttonClass" class="focus:border-2 flex items-center justify-center">
    <Icon v-if="props.icon != ''" :icon="props.icon" />
    <span>{{ props.text }}</span>
    <slot></slot>
  </button>
</template>
