<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

const props = defineProps({
  title: { type: String, default: "Open" },
  icon: { type: String, default: "mdi-folder-outline" },
  iconHover: { type: String, default: "mdi-folder-open-outline" },
});
onMounted(() => {});
</script>
<template>
  <button class="flex justify-between dropdown-item text-sm p-2 font-normal
    whitespace-nowrap bg-transparent text-text dark:text-textLight
  hover:bg-gray-200 hover:border-2 dark:hover:bg-gray-900 dark:border-gray-700 border-gray-300 border-2 rounded-md"
    href="#">
    <div class="mx-2 text-lg">{{ t(title) }}</div>
    <Icon :icon="icon" class="h-6 w-6 text-currentColor mx-2 dark:text-gray-400" />
  </button>
</template>
