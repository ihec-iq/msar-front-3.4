<script setup lang="ts">
import { defineProps } from "vue";

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

const defaultClass = ` bg-${props.color}-500 hover:bg-${props.color}-700 duration-500 text-white font-bold w-${props.width} py-2 px-4 rounded`;
const outlinedClass = ` border border-${props.color}-500 text-${props.color}-500 hover:bg-${props.color}-500 hover:text-${props.color}-700 duration-500 font-bold w-${props.width} py-2 px-4 rounded`;
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
  <button @click="onClick()" :class="buttonClass">
    <svg
      v-if="props.icon != ''"
      class="fill-current w-4 h-4 mx-2"
      :xmlns="props.icon"
      viewBox="0 0 20 20"
    >
      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
    </svg>
    <span>{{ props.text }}</span>
  </button>
</template>
