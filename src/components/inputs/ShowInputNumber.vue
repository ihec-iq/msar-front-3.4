<script setup lang="ts">
import { toRef } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  value: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
});
const name = toRef(props, "name");
</script>

<template>
  <div class="flex flex-col">
    <label class="font-bold text-text dark:text-textLight" :for="name">{{
      label
    }}</label>
    <input
      class="text-text dark:text-textLight bg-lightInput dark:bg-input disabled h-10"
      :name="name"
      :id="name"
      :type="type"
      :value="value"
      :placeholder="placeholder"
    />
  </div>
</template>
