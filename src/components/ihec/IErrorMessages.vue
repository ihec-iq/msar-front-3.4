<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";

defineProps({
  validationResult: {
    type: Object,
    default: () => {
      success: false;
      errors: [];
    },
  },
});
</script>
<template>
  <div
    class="w-full border border-red-500 mx-auto rtl:text-right ltr:text-left p-5 rounded-lg"
    v-if="!validationResult.success"
  >
    <p class="font-semibold">{{ t("ErrorsMustResolve") }}</p>
    <ul v-for="(error, index) in validationResult.errors" :key="index">
      <h2 class="text-xl font-bold text-black py-2">
        {{ t(error.fieldName) }}
      </h2>
      <li
        v-for="(message, index) in error.messages"
        :key="index"
        class="text-lg font-bold text-red-500"
      >
        {{ `- ${message}` }}
      </li>
    </ul>
  </div>
</template>
