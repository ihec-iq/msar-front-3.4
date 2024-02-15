<script setup lang="ts">
import { defineModel, defineProps } from "vue";

const modelValue = defineModel<boolean>();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>

<template>
  <div class="mb-4">
    <label class="_inputLabel">
      {{ label }}
    </label>
    <input
      type="checkbox"
      class="toggle toggle-secondary"
      v-model="modelValue"
      :checked="checked"
    />
  </div>
</template>
