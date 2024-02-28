<script setup lang="ts">
import { EnumDirection } from "@/utils/EnumSystem";
import { onMounted, ref } from "vue";
const modelValue = defineModel<any>();

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: "",
  },
  IsRequire: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dir: {
    type: String as () => EnumDirection, // Cast to the enum type
    default: EnumDirection.Auto, // Default value (optional)
  },
  getDataByInter: {
    type: Function, // Cast to the enum type
    default: () => {}, // Default value (optional)
  },
   onInput: {
    type: Function, // Cast to the enum type
    default: () => {}, // Default value (optional)
  },
});

const keydown = () => {
  props.getDataByInter();
};
</script>
<template>
  <div class="mb-2">
    <label class="_inputLabel">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <input
      @change="keydown"
      :disabled="disabled"
      class="_input"
      :type="type"
      v-model="modelValue"
      :placeholder="placeholder"
      :style="{ direction: dir }"
      @input="onInput()"
    />
  </div>
</template>
