<script setup lang="ts">
import { defineModel, defineProps } from "vue";

const modelValue = defineModel<boolean>();

defineProps({
  label: {
    type: String,
    default: "",
  },
  checked: {
    type: Boolean,
    default: false,
  },
  IsRequire: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>

<template>
  <div class="mb-2 flex h-full">
    <label class="_inputLabel mx-2">
      <span v-if="IsRequire" class="text-red-600">*</span
      ><span v-if="label != ''"></span> {{ label }}
      <slot class="_inputLabel"></slot>
    </label>
    <input
      :disabled="disabled"
      type="checkbox"
      class="toggle toggle-secondary mx-2"
      v-model="modelValue"
      :checked="checked"
    />
  </div>
</template>
