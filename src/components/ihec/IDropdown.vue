<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const isOpen = ref(false);
// This new ref will hold our timer ID
const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

/**
 * When the mouse leaves the component area, we START a timer.
 * If the timer finishes, the dropdown will close.
 */
const handleMouseLeave = () => {
  closeTimer.value = setTimeout(() => {
    isOpen.value = false;
  }, 200); // 200ms delay
};

/**
 * If the mouse enters the component area (either the button or the panel),
 * we CANCEL the timer to prevent it from closing.
 */
const handleMouseEnter = () => {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value);
  }
};
</script>

<template>
  <div
    class="relative inline-block text-left"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <button
      @click="toggleDropdown"
      type="button"
      class="flex items-center rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-gray-700"
    >
      <Icon icon="mdi:dots-vertical" class="h-5 w-5" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 z-10 mt-2 w-max origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
      >
        <ul class="p-1">
          <slot></slot>
        </ul>
      </div>
    </transition>
  </div>
</template>