<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  title: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  height: '400px',
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ title }}</h3>
    <div :style="{ height }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>
