<script setup lang="ts">
import { ref } from "vue";

const modelValue = defineModel<any>();
const emits = defineEmits<{
  //(e: "change", id: number): void;
  (e: "onChange"): void;
}>();
const props = defineProps({
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

const inputClasses = ref("_input");

const checkRequired = () => {
  if (!props.IsRequire) return;

  if (modelValue.value) {
    inputClasses.value = "_input";
  } else {
    inputClasses.value = "_input border border-red-500";
  }
};
</script>
<template>
  <div class="mb-2 mx-1">
    <label class="_inputLabel" :for="name">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <select
      :class="inputClasses"
      :name="name"
      v-model="modelValue"
      @change="Change"
      @focusout="checkRequired"
    >
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
