<script setup lang="ts">
import { toRef } from "vue";
import { EnumDirection } from "@/utils/EnumSystem";
const modelValue = defineModel<string>();

defineProps({
  type: {
    type: String,
    default: "",
  },
  //   name: {
  //     type: String,
  //     required: true,
  //   },
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
//const name = toRef(props, "name");

// const error = computed(() => {
//   if (modelValue.value === undefined) {
//     return "Name is required";
//   }

//   const isValidName = /^[a-zA-Z]+$/.test(modelValue.value);
//   if (!isValidName && props.type == "text") {
//     return "Invalid name (only alphabetic characters allowed)";
//   }

//   return null;
// });
// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>
<template>
  <div class="mb-4">
    <label class="_inputLabel"> {{ label }}* </label>
    <input
      class="_input"
      :type="type"
      v-model="modelValue"
      :placeholder="placeholder"
      :style="{ direction: dir }"
    />
    <!-- :class="{ 'border-red-500': error }"
    <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div> -->
  </div>
</template>
