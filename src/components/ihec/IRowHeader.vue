<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "IHEC",
  },
  color: {
    type: String,
    default: "blue",
  },
});
</script>

<template>
  <nav
    class="rounded-t-lg relative flex w-full items-center justify-between h-full bg-white dark:bg-darkNav py-1 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:text-neutral-200 md:flex-wrap md:justify-start"
    data-te-navbar-ref
  >
    <div class="flex w-full flex-wrap items-center justify-between dark:bg-gray-700 bg-gray-200">
      <div class="flex items-center">
        <div
          class="font-bold cursor-default text-center text-gray-700 dark:text-textLight mx-4 text-lg "
        >
          {{ props.title }}
        </div>
      </div>
      <div>
        <slot name="buttons"></slot>
      </div>
    </div>
  </nav>
</template>
