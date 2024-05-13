<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, type PropType } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: "Btn",
  },
  type: {
    type: String as PropType<"default" | "outlined" | "text">,
    default: "default",
  },
  color: {
    type: String as PropType<"blue" | "green" | "amber" | "white" | "red">,
    default: "blue",
  },
  icon: {
    type: String,
    default: "",
  },
  onClick: {
    type: Function,
    default: () => {},
  },
  width: {
    type: String,
    default: "32",
  },
});
const iconBase = computed(() => {
  return props.icon != "" ? "mdi:" + props.icon : "";
}); 
const classIcon = computed(() => {
  let _classIcon = "";
  if (props.type === "default") {
    _classIcon = "w-5 h-5 text-" + props.color + "-500 mx-1 basis-1/3 p-0";
  } else if (props.type === "outlined") {
    _classIcon = "w-5 h-5 text-" + props.color + "-500 mx-1 basis-1/3 p-0";
  } else {
    _classIcon = "w-5 h-5 text-" + props.color + "-500 mx-1 basis-1/3 p-0";
  }
  return _classIcon;
});
const BColor = computed(() => {
  return props.color;
});
const buttonClass = computed(() => {
  if (props.type == "default") {
    return (
      "bg-" +
      props.color +
      "-500 hover:bg-" +
      props.color +
      "-700 duration-500 text-white font-bold w-" +
      props.width +
      " p-1 rounded"
    );
  } else if (props.type == "outlined") {
    return (
      "ring-1 ring-" +
      props.color +
      "-700 text-" +
      props.color +
      "-500 hover:bg-" +
      props.color +
      "-200 dark:hover:bg-" +
      props.color +
      "500 dark:hover:text-white duration-300 font-bold w-" +
      props.width +
      " p-1 rounded"
    );
  } else if (props.type == "text") {
    return (
      " dark:hover:text-white-200 hover:text-white-800 duration-300 font-bold p-1 text-" +
      BColor.value +
      " w-" +
      props.width +
      ""
    );
  } else {
    return (
      "bg-green-500 hover:bg-" +
      props.color +
      "-700 duration-500 text-white font-bold w-" +
      props.width +
      " p-1 rounded"
    );
  }
});
</script>

<template>{{  }}
  <button @click="onClick()" :class="buttonClass" class="rounded-xl mx-1">
    <Icon :icon="iconBase"
      :class="classIcon"
      class="grow-0" />
  </button>
</template>
<style scoped>
button:hover {
  @apply transform scale-105;
}
</style>
