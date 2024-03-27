<script setup lang="ts"> 
import { EnumDirection } from "@/utilities/EnumSystem";
import { ref } from "vue";  
const modelValue = defineModel<any>();
import { t } from "@/utilities/I18nPlugin";

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
  max: {
    type: Number,
    default: null,
  },
  min: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dir: {
    type: String as () => EnumDirection, // Cast to the enum type
    default: EnumDirection.Auto, // Default value (optional)
  },
  OnKeyEnter: {
    type: Function, // Cast to the enum type
    default: () => {}, // Default value (optional)
  },
  onInput: {
    type: Function, // Cast to the enum type
    default: () => {}, // Default value (optional)
  },
});

const keydown = () => {
  props.OnKeyEnter();
};

const inputClasses = ref("_input");
const customPlaceholder = ref(props.placeholder);

const checkRequired = () => {
  if (!props.IsRequire) return;

  if (modelValue.value) {
    inputClasses.value = "_input";
    customPlaceholder.value = props.placeholder;
  } else {
    inputClasses.value = "_input border border-red-500";
    customPlaceholder.value = t("RequiredField");
  }
};
</script>
<template>
  <div class="mb-2">
    <label class="_inputLabel">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <input
      @change="keydown"
      @focusout="checkRequired"
      :disabled="disabled"
      :class="inputClasses"
      :type="type"
      v-model="modelValue"
      :placeholder="customPlaceholder"
      :style="{ direction: dir }"
      @input="onInput()"
      :max="max"
      :min="min"
    />
  </div>
</template>
@/utilities/EnumSystem
