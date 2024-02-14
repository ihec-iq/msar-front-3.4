<script setup lang="ts">
import { defineProps } from "vue";

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
    class="rounded-t-lg relative flex w-full items-center justify-between h-full bg-neutral-300 py-2 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200 md:flex-wrap md:justify-start"
    data-te-navbar-ref
  >
    <div class="flex w-full flex-wrap items-center justify-between px-3">
      <div class="flex items-center">
        <div
          class="font-bold cursor-default text-center text-text dark:text-textLight mx-4 text-xl"
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
