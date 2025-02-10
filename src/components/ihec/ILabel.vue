<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="w-full">
    <div class="mb-0 md:text-sm text-base ml-2 mr-2 font-bold dark:text-gray-300">
      {{ title }}
    </div>
    <div
      class="rounded-md border-2 min-h-10 focus:outline-none focus:border focus:border-gray-700 dark:bg-gray-800 dark:text-gray-300 p-2 m-2 font-bold"
    >
      <slot></slot>
    </div>

  </div>
</template>
