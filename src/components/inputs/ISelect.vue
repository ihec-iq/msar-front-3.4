<script setup lang="ts">
import { defineModel, defineProps } from "vue";

const modelValue = defineModel();

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array<any>,
    required: true,
  },
  IsRequire: {
    type: Boolean,
    default: false,
  },
});

// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>

<template>
  <div class="mb-2 mx-1">
    <label class="_inputLabel" :for="name">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <select class="_input" :name="name" :id="name" :v-model="modelValue">
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.id"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
