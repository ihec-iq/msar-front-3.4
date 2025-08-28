<script setup lang="ts">
import { EnumDirection } from "@/utilities/EnumSystem";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { ref, onMounted, nextTick } from "vue";
const modelValue = defineModel<any>();
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

const props = defineProps({
  type: {
    type: String as () =>
      | "text"
      | "number"
      | "email"
      | "password"
      | "date"
      | "time"
      | "datetime"
      | "color"
      | "file"
      | "hidden"
      | "search"
      | "range"
      | "tel"
      | "url",
    default: "text",
  },
  label: { type: String },
  placeholder: { type: String, default: "" },
  IsRequire: { type: Boolean, default: false },
  max: { type: Number, default: null },
  min: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
  dir: {
    type: String as () => EnumDirection,
    default: EnumDirection.Auto,
  },
  OnKeyEnter: {
    type: Function,
    default: () => {},
  },
  FnClick: {
    type: Function,
    default: () => {},
  },
  FunIcon: {
    type: String,
    default: "",
  },
  FnTooltip: {
    type: String,
    default: "",
  },
  onInput: {
    type: Function,
    default: () => {},
  },
  cached: { type: Boolean, default: false },
  cachedName: { type: String, default: "" },
  autoCorrect: { type: Boolean, default: true },
});

const inputRef = ref<HTMLInputElement>();

async function focus() {
  await nextTick();
  inputRef.value?.focus();
}

defineExpose({ focus });

const inputClasses = ref("_input");
const customPlaceholder = ref(props.placeholder);

const setInvalidBorder = (invalid: boolean) => {
  inputClasses.value = invalid
    ? "_input border border-red-500"
    : "_input";
};

const animateShake = () => {
  if (!inputRef.value) return;
  inputRef.value.classList.add("animate-shake");
  setTimeout(() => {
    inputRef.value?.classList.remove("animate-shake");
  }, 500);
};

const checkRequired = () => {
  if (!props.IsRequire) return;
  if (modelValue.value) {
    setInvalidBorder(false);
    customPlaceholder.value = props.placeholder;
  } else {
    setInvalidBorder(true);
    customPlaceholder.value = t("RequiredField");
  }
};

const checkNumberBoundaries = () => {
  if (props.type !== "number" || modelValue.value === null || modelValue.value === undefined) return;

  let value = Number(modelValue.value);
  let invalid = false;
  let corrected = false;

  if (props.max !== null && value > props.max) {
    if (props.autoCorrect) {
      modelValue.value = props.max;
      corrected = true;
    } else {
      invalid = true;
    }
  }

  if (props.min !== null && value < props.min) {
    if (props.autoCorrect) {
      modelValue.value = props.min;
      corrected = true;
    } else {
      invalid = true;
    }
  }

  setInvalidBorder(invalid);

  if (corrected || invalid) {
    animateShake();
  }
};

const keydown = () => {
  if (props.cached && props.cachedName !== "") {
    localStorage.setItem(props.cachedName, modelValue.value);
  }
  props.OnKeyEnter();
};

onMounted(async () => {
  if (props.cached && props.cachedName !== "") {
    modelValue.value = await localStorage.getItem(props.cachedName);
  }
});
</script>

<template>
  <div class="mb-2 px-1">
    <label class="_inputLabel w-full" v-if="label">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <div class="flex flex-row relative items-center">
      <i
        v-if="FunIcon"
        @click="FnClick()"
        class="cursor-pointer absolute left-2 text-gray-500"
        :title="FnTooltip"
      >
        <Icon :icon="`mdi:${FunIcon}`" class="w-5 h-5" />
      </i>
      <input
        ref="inputRef"
        :disabled="disabled"
        :type="type"
        v-model="modelValue"
        :placeholder="customPlaceholder"
        :style="{ direction: dir }"
        @change="keydown"
        @focusout="() => { checkRequired(); checkNumberBoundaries(); }"
        @input="() => props.onInput(modelValue.value)"
        :max="max"
        :min="min"
        :class="[
          inputClasses,
          disabled ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-60' : '',
          'focus:outline-none focus:ring-0 focus:border-gray-900 outline-none border-[1px] border-gray-300 dark:border-gray-800 h-10 px-3 py-2 dark:bg-input text-text dark:text-textLight'
        ]"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.3s ease;
}
</style>
