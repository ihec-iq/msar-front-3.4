<template>
  <transition name="fade">
    <div
      v-if="isOpenModel"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative"
      >
        <!-- زر الإغلاق -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          @click="close"
        >
          ×
        </button>

        <!-- محتوى المودال -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  isOpenModel: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const close = () => emit('close')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
