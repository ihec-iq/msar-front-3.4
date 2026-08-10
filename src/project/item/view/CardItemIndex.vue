<script setup lang="ts">
import { useRouter } from "vue-router";
import { t } from "@/utilities/I18nPlugin";

const props = defineProps({
  item: {
    type: Object as () => {
      id: number;
      name: string;
      code: string;
      description: string;
      Category: { name: string };
    },
    required: true,
  },
});

const router = useRouter();

const update = (id: number) => {
  router.push({
    name: "itemUpdate",
    params: { id },
  });
};
</script>

<template>
  <div
    class="relative w-full rounded-lg border border-gray-200 bg-cardLight p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-card border-l-4 border-l-teal-500 dark:border-l-teal-400"
  >
    <div class="absolute top-4 right-4">
      <IDropdown>
        <li>
          <EditButton @click="update(item.id)" />
        </li>
      </IDropdown>
    </div>

    <div class="pr-10">
      <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {{ item.name }}
      </h3>

      <div
        class="mb-4 flex flex-wrap items-center gap-x-3 text-sm text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center gap-x-1.5">
          <img src="@/assets/svg/bag.svg" class="h-4 w-4" alt="Category Icon" />
          <span>{{ item.Category.name }}</span>
        </div>

        <span class="text-gray-300 dark:text-gray-600">|</span>

        <div>
          <span class="font-medium">{{ t("Item.Code") }}:</span> {{ item.code }}
        </div>
      </div>

      <div
        class="prose prose-sm max-h-28 overflow-y-auto text-gray-600 dark:prose-invert"
        v-html="item.description"
      ></div>
    </div>
  </div>
</template>
