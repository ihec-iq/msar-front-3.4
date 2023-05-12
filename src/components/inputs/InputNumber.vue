<script setup lang="ts">
import { toRef } from "vue";
import { useField } from "vee-validate";
import { i18nRepository } from "@/stores/i18n/I18nRepository";

const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  value: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  successMessage: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
const name = toRef(props, "name");
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.value,
});
</script>

<template>
  <div
    class="TextInput w-full placeholder:pl-2"
    :class="{ 'has-error': !!errorMessage, success: meta.valid }"
  >
    <label :for="name">{{ label }}</label>
    <input
      class="placeholder:pl-2 placeholder:text-text dark:bg-input dark:text-gray-300 bg-lightInput dark:placeholder:text-textLight"
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
    />

    <p class="help-message" v-show="errorMessage || meta.valid">
      {{ t(errorMessage || successMessage) }}
    </p>
  </div>
</template>

<style scoped>
.TextInput {
  width: 100%;
  position: relative;
}
.dark label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
  color: white;
}
label {
  color: black;
  display: block;
  margin-bottom: 4px;
  width: 100%;
}
@media (min-width: 350px) {
  .dark label {
    display: block;
    margin-bottom: 4px;
    width: 100%;
    color: white;
    font-size: 12px;
  }
  label {
    color: black;
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    width: 100%;
  }
}
input {
  border-radius: 5px;
  padding-left: 5px;
  /* border: 1px solid transparent; */
  /* padding: 15px 10px; */
  outline: none;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  /* background-color: #1f2937; */
  --tw-border-opacity: 1;
  /* border-color: rgb(55 65 81 / var(--tw-border-opacity)); */
  height: 40px;
  width: 100%;
  color: #ddd;
}

/* input::placeholder {
  padding-left: 8px;
} */
/* .TextInput::placeholder {
  padding-left: 8px;
} */
input:focus {
  border-color: hsl(220, 12%, 62%);
}

.help-message {
  left: 0;
  margin: 0;
  font-size: 14px;
}

.dark .TextInput.has-error input {
  background-color: #5a2e2e;
  color: #f23648;
}
.TextInput.has-error input {
  background-color: #7e2929;
  color: #f23648;
}

.TextInput.has-error input:focus {
  border-color: #f23648;
}

.TextInput.has-error .help-message {
  color: #f23648;
}

.dark .TextInput.success input {
  background-color: #1f2937;
  color: #ddd;
}
.TextInput.success input {
  background-color: #d1d5db;
  color: #363636;
}

.TextInput.success input:focus {
  border-color: #21a67a;
}

.TextInput.success .help-message {
  color: #21a67a;
}
</style>
