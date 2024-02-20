<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch, type PropType } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
    default: "Btn",
  },
  type: {
    type: String as PropType<"default" | "outlined">,
    default: "default",
  },
  color: {
    type: String,
    default: "blue",
  },
  preIcon: {
    type: String,
    default: "",
  },
  postIcon: {
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
const PreIcon = computed(() => {
  return "mdi:" + props.preIcon;
});
const PostIcon = computed(() => {
  return "mdi:" + props.postIcon;
});
const classIcon = computed(() => {
  let _classIcon = "";
  if (props.type === "default") {
    _classIcon = "w-5 h-5 text-white-500 mr-2 ml-2 basis-1/3 ";
  } else if (props.type === "outlined") {
    _classIcon = "w-5 h-5 text-gray-500 mr-2 ml-2 basis-1/3 ";
  } else {
    _classIcon = "w-5 h-5 text-white-500 mr-2 ml-2 basis-1/3 ";
  }
  return _classIcon;
});
const buttonClass = computed(() => {
  let colorClass = "";
  if (props.type === "default") {
    colorClass =
      "bg-" +
      props.color +
      "-500 hover:bg-" +
      props.color +
      "-700 duration-500 text-white font-bold w-" +
      props.width +
      " py-2 px-4 rounded";
  } else if (props.type === "outlined") {
    colorClass =
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
      " py-2 px-4 rounded";
  } else {
    colorClass =
      "bg-" +
      props.color +
      "-500 hover:bg-" +
      props.color +
      "-700 duration-500 text-white font-bold w-" +
      props.width +
      " py-2 px-4 rounded";
  }
  return colorClass;
});
</script>

<template>
  <button
    @click="onClick()"
    :class="buttonClass"
    class="flex flex-row mx-2 mt-3"
  >
    <Icon
      v-if="props.preIcon != ''"
      :icon="PreIcon"
      :class="classIcon"
      class="grow-0"
    />
    <span class="grow">{{ props.text }}</span>
    <Icon
      v-if="props.postIcon != ''"
      :icon="PostIcon"
      :class="classIcon"
      class="grow-0"
    />
  </button>
</template>
<style scoped>
button:hover {
  @apply transform scale-105;
}
</style>
