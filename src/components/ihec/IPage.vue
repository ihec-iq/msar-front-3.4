<script setup lang="ts">
import loading from "../general/loading.vue";

defineProps({
  HeaderTitle: {
    type: String,
    default: "IHEC",
  },
  Color: {
    type: String,
    default: "blue",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="mx-auto p-3 m-3 w-[99%]">
    <nav
      class="rounded-t-lg relative flex w-full items-center justify-between h-full bg-[#D7D9DC] dark:bg-[#1F2230] py-2 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:text-neutral-200 md:flex-wrap md:justify-start"
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

        <div class="flex flex-row">
          <div
           v-if="isLoading"
            class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span  
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
          <slot v-if="isLoading==false" name="HeaderButtons"></slot>
        </div>
      </div>
    </nav>

    <div  class="bg-slate-50 dark:bg-slate-800">
      <slot></slot>
    </div>
    <div  v-if="isLoading==false" class="bg-slate-100 dark:bg-slate-800">
      <slot name="Footer"></slot>
    </div>
  </div>
</template>
