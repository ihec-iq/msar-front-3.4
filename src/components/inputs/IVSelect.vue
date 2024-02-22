<script setup lang="ts">
import { defineModel, defineProps } from "vue";

const modelValue = defineModel<any>();
const emits = defineEmits<{
  //(e: "change", id: number): void;
  (e: "onChange"): void;
}>();
defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  labelVSelect: {
    type: String,
    default: "name",
  },
  options: {
    type: Array<any>,
    required: true,
  },
  IsRequire: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const Change = () => {
  emits("onChange");
};
// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>
<template>
  <div class="mb-2 mx-1">
    <label class="_inputLabel" :for="name">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <vSelect
      :id="name"
      class="_input"
      v-model="modelValue"
      :options="options"
      :reduce="(user: any) => user"
      :label="labelVSelect"
      :name="name"
      :getOptionLabel="(user: any) => user.name"
      @change="Change"
      :multiple="multiple"
      :disabled="disabled"
    >
      <template #option="{ name }">
        <div class="_input">
          <span class="_input">{{ name }}</span>
        </div>
      </template>
    </vSelect>
  </div>
</template>
