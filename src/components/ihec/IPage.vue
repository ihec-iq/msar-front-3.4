<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  HeaderTitle: {
    type: String,
    default: "IHEC",
  },
  Color: {
    type: String,
    default: "blue",
  },
});
</script>
<template>
  <div class="container mx-auto p-3">
    <nav
      class="rounded-t-lg relative mb-1 flex w-full items-center justify-between h-full bg-[#D7D9DC] dark:bg-darkNav py-2 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:text-neutral-200 md:flex-wrap md:justify-start"
      data-te-navbar-ref
    >
      <div class="flex w-full flex-wrap items-center justify-between px-3">
        <div class="flex items-center">
          <div
            class="font-bold cursor-default text-center text-text dark:text-textLight mx-4 text-xl"
          >
            {{ HeaderTitle }}
          </div>
        </div>

        <div>
          <slot name="HeaderButtons"></slot>
        </div>
      </div>
    </nav>

    <div class="bg-slate-50 dark:bg-slate-800">
      <slot></slot>
    </div>
    <div class="bg-slate-100 dark:bg-slate-800">
      <slot name="Footer"></slot>
    </div>
  </div>
</template>
