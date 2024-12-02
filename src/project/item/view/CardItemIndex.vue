<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
import { t } from "@/utilities/I18nPlugin";

const update = (id: number) => {
  router.push({
    name: "itemUpdate",
    params: { id: id },
  });
};

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
  >
    <div class="w-3/4 overflow-hidden">
      <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right">
        <div class="text-2xl text-text dark:text-textLight mb-2">
          {{ item.name }}
        </div>
        <div class="text-text dark:text-textGray mb-2 justify-between">
          <span>{{ t("Item.Code") }}: {{ item.code }}</span>
          <span class="float-left flex">
            {{ item.Category.name }}
            <img src="@/assets/svg/bag.svg" />
          </span>
        </div>
        <div class="flex justify-betweens">
          <div
            class="text-text dark:text-textGray"
            v-html="item.description"
          ></div>
        </div>
      </div>
    </div>
    <IDropdown>
      <li>
        <EditButton @click="update(item.id)" />
      </li>
    </IDropdown>
  </div>
</template>