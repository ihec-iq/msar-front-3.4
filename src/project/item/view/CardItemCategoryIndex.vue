<script setup lang="ts">
 import type { IItemCategory } from "@/project/item/IItem";
import type { PropType } from "vue";
import { useRouter } from "vue-router";

// Define props first for better readability
const props = defineProps({
  item: {
    type: Object as PropType<IItemCategory>,
    required: true,
  },
});

const router = useRouter();

const update = (id: number) => {
  router.push({
    name: "itemCategoryUpdate",
    params: { id: id },
  });
};
</script>

<template>
  <div
    class="group flex w-full items-center justify-between gap-x-6 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500/50"
  >
    <div class="flex flex-grow items-center gap-x-5 overflow-hidden">
      <div class="hidden sm:block flex-shrink-0 rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/40">
        <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      <div class="overflow-hidden">
        <h2 class="truncate text-xl font-bold text-gray-800 dark:text-white">
          {{ item.name }}
        </h2>
        <div
          class="mt-1 truncate text-sm text-gray-500 dark:text-gray-400"
          v-html="item.description"
        ></div>
      </div>
    </div>

    <div class="flex-shrink-0">
      <IDropdown>
        <li>
          <EditButton @click="update(item.id)" />
        </li>
      </IDropdown>
    </div>
  </div>
</template>