<script setup lang="ts">
import { EnumDirection } from "@/utils/EnumSystem";
const modelValue = defineModel<string | number>();

defineProps({
  type: {
    type: String,
    default: "",
  },
  label: {
    type: String, 
  },
  placeholder: {
    type: String,
    default: "",
  },
  dir: {
    type: String as () => EnumDirection, // Cast to the enum type
    default: EnumDirection.LTR, // Default value (optional)
  },
});
</script>
<template>
  <div class="mb-4">
    <label class="_inputLabel"> {{ label }}* </label>
    <input
      class="_input"
      :type="type"
      :v-model="modelValue"
      :placeholder="placeholder"
      :style="{ direction: dir }"
    />
  </div>
</template>
