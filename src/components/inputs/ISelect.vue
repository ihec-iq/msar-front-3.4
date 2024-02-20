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
});

// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>

<template>
  <div >
    <label class="_inputLabel" :for="name"> {{ label }}* </label>
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
