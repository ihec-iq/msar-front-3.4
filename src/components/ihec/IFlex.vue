<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="w-full flex flex-col">
    <h3 v-if="title" class="text-lg font-medium mb-2">{{ title }}</h3>
    <div class="w-full flex">
      <slot></slot>
    </div>
  </div>
</template>
