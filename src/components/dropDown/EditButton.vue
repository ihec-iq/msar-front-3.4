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
    class="flex justify-between w-full text-sm py-2 px-4 font-normal whitespace-nowrap text-text dark:text-textLight bg-white dark:bg-gray-800 bg-opacity-20 rounded-lg border-gray-200 dark:border-gray-700 border-[1px] hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-currentColor dark:hover:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:border-[1px] transition-all duration-200 ease-in-out"
    href="#"
  >
    <div class="mr-4 text-lg">{{ t(title) }}</div>
    <Icon :icon="icon" class="w-6 h-6 text-currentColor dark:text-gray-400" />
  </button>
</template>
