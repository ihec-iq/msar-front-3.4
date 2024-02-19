<script setup lang="ts">
import { EnumDirection } from "@/utils/EnumSystem";
const modelValue = defineModel<any>();

defineProps({
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
  dir: {
    type: String as () => EnumDirection, // Cast to the enum type
    default: EnumDirection.Auto, // Default value (optional)
  },
});
</script>
<template>
  <div class="mb-2">
    <label class="_inputLabel">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }} 
    </label>
    <input
      class="_input"
      :type="type"
      v-model="modelValue"
      :placeholder="placeholder"
      :style="{ direction: dir }" 
    />
  </div>
</template>
