<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: false,
  },
});
</script>
<template>
  <div>
    <nav
      class="rounded-t-lg relative my-4 flex w-full items-center justify-between h-full bg-[#D7D9DC] dark:bg-[#1F2230] py-2 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:text-neutral-200 md:flex-wrap md:justify-start"
      data-te-navbar-ref
    >
      <div class="flex w-full flex-wrap items-center justify-between px-3">
        <div class="flex items-center">
          <div
            class="font-bold cursor-default text-center text-text dark:text-textLight mx-4 text-lg"
          >
            {{ title }}
          </div>
        </div>

        <div>
          <slot name="HeaderButtons"></slot>
        </div>
      </div>
    </nav>
  </div>
</template>
