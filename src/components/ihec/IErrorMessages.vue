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
  <div class="w-full border border-red-500 m-0 rtl:text-right ltr:text-left p-4 rounded-lg"
    v-if="!validationResult.success">
    <p class="font-semibold text-lg">{{ t("ErrorsMustResolve") }}</p>
    <ul v-for="(error, index) in validationResult.errors" :key="index">
      <h2 class="text-md font-bold text-red-500 dark:text-gray-300 py-2">
        {{ error.fieldName }}
      </h2>
      <li v-for="(message, index) in error.messages" :key="index"
        class="text-md   text-red-400 dark:text-gray-400">
        {{ `- ${message}` }}
      </li>
    </ul>
  </div>
</template>
