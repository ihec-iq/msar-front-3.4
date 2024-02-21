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
  options: {
    type: Array<any>,
    required: true,
  },
  IsRequire: {
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
      label="name"
      :name="name"
      :getOptionLabel="(user: any) => user.name"
      @change="Change"
    >
      <template #option="{ name }">
        <div>
          <span>{{ name }}</span>
        </div>
      </template>
    </vSelect>
  </div>
</template>
