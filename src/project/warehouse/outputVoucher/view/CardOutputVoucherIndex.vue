<script setup lang="ts">
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import IButton2 from "@/components/ihec/IButton2.vue";
import { t } from "@/utilities/I18nPlugin";
import { useRouter } from "vue-router";
const router = useRouter();
const update = (id: number) => {
  router.push({
    name: "outputVoucherUpdate",
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
          {{ item.number }}
        </div>
        <div class="text-text dark:text-textGray mb-2 justify-between">
          <span>{{ t("Date") }}: {{ item.date }}</span>
          <span class="float-left flex" title="Items count">
            {{ item.itemsCount }}
            <svg
              title="Items count"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6 4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6 4h4v-4h-4M4 8h4V4H4v4Z"
              />
            </svg>
          </span>
        </div>
        <div class="flex justify-betweens">
          <div class="text-text dark:text-textGray" v-html="item.notes"></div>
        </div>
      </div>
    </div>

    <IButton2
      :type="EnumButtonType.Outlined"
      @click="update(item.id)"
      class="w-[80px] h-10 rounded-full text-gray-800"
      :text="t('Open')"
      pre-icon="folder-open"
    />
  </div>
</template>
