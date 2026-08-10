<script setup lang="ts">
import { ref, watch } from "vue";
import type { PropType } from "vue";

const emit = defineEmits(["update:modelValue"]);
const localValue = ref(false);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
  },
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
  onChange: {
    type: Function as PropType<() => void>,
    required: false,
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

const handleChange = () => {
  emit("update:modelValue", localValue.value);
  if (props.onChange) {
    props.onChange();
  }
};
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
      v-model="localValue"
      :checked="checked"
      @change="handleChange"
    />
  </div>
</template>
