<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

const props = defineProps({
  title: { type: String, default: "Edit" },
  icon: { type: String, default: "mdi-pencil-box-outline" },
});
onMounted(() => {});
</script>
<template>
  <button
    class="flex justify-between w-fit dropdown-item text-sm py-2 px-4 font-normal  whitespace-nowrap bg-transparent text-text dark:text-textLight hover:bg-gray-300 hover:border-2 dark:hover:bg-gray-700"
    href="#">
    <div class="mr-4 text-lg">{{ t(title) }}</div>
    <Icon :icon="icon" class="w-6 h-6 text-currentColor dark:text-gray-400" />
  </button>
</template>
