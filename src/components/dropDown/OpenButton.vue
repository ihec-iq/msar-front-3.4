<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

const props = defineProps({
  title: { type: String, default: "Open" },
  icon: { type: String, default: "mdi-folder-eye-outline" },
});
onMounted(() => {});
</script>
<template>
  <button
    class="flex justify-between dropdown-item text-sm py-2 px-4 font-normal w-full whitespace-nowrap bg-transparent text-text dark:text-textLight hover:bg-gray-300 hover:border-2 dark:hover:bg-gray-700"
    href="#"
  >
    <div class="mr-4 text-lg">{{ t(title) }}</div>
    <Icon :icon="icon" class="w-6 h-6 text-currentColor dark:text-gray-400" />
  </button>
</template>
