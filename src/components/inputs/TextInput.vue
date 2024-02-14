<script setup lang="ts">
const modelValue = defineModel();
import { EnumDirection } from "@/utils/EnumSystem";

defineProps({
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    required: true,
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

import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
</script>
<template>
  <div class="w-11/12 mr-2">
    <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
      {{ t(label) }}
    </div>
    <input
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :style="{ direction: dir }"
      class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightDirect dark:bg-input text-text bg-white dark:text-textLight"
    />
  </div>
</template>
