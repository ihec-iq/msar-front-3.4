<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { t } from "@/utils/I18nPlugin";
const fastSearch = defineModel();

const emit = defineEmits(["getFilterData", "makeFastSearch"]);
const inputRefSearch = ref<HTMLInputElement | null>(null);
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await emit("getFilterData", 1);
  }
};
onMounted(async () => {
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
});
</script>
<template>
  <div class="relative flex">
    <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
      <Icon icon="mdi:magnify" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
    </div>
    <input
      type="text"
      id="table-search"
      ref="inputRefSearch"
      v-model="fastSearch"
      @input="emit('makeFastSearch')"
      class="block p-2 pl-10 w-80 text-sm text-text dark:text-textLight bg-lightInput dark:bg-input rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :placeholder="t('UserSearch')"
    />
  </div>
</template>
