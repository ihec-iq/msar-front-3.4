<script setup lang="ts">

import { Icon } from "@iconify/vue";
import { computed, type PropType } from "vue";
export enum EnumButtonType {
  Default = "default",
  Outlined = "outlined",
  Text = "text",
  Primary = "primary",
}
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: false,
    default: "Btn",
  },
  type: {
    type: String as PropType<EnumButtonType>,
    default: EnumButtonType.Default,
  },
  color: {
    type: String as PropType<"blue" | "green" | "amber" | "white" | "red">,
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
    default: (): void => {},
  },
  width: {
    type: String,
    default: "32",
  },
});
const PreIcon = computed(() => {
  return props.preIcon != "" ? "mdi:" + props.preIcon : "";
});
const PostIcon = computed(() => {
  return props.postIcon != "" ? "mdi:" + props.postIcon : "";
});
const classIcon = computed(() => {
  let _classIcon = "";
  if (props.type === EnumButtonType.Default) {
    _classIcon = "w-5 h-5 text-" + props.color + "-500 mx-1 basis-1/3 p-0";
  } else if (props.type === EnumButtonType.Outlined) {
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
  if (props.type == EnumButtonType.Default) {
    return (
      "bg-" +
      props.color +
      "-500 hover:bg-" +
      props.color +
      "-700 duration-500 text-white font-bold w-" +
      props.width +
      " py-2 px-4 rounded"
    );
  } else if (props.type == EnumButtonType.Outlined) {
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
      " py-2 px-4 rounded"
    );
  } else if (props.type == EnumButtonType.Text) {
    return (
      " dark:hover:text-white-200 hover:text-white-800 duration-300 font-bold py-2 px-4 text-" +
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
      " py-2 px-4 rounded"
    );
  }
});
</script>

<template>
  <button
    @click="onClick()"
    :class="buttonClass"
    class="flex flex-row mx-2"
    style="align-items: center"
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
