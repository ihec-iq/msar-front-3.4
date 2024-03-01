<script setup lang="ts">
import { useRouter } from "vue-router";
import type { IDocument } from "@/types/archives/IArchive";
import { t } from "@/utils/I18nPlugin";
const router = useRouter();
const update = (id: number) => {
  router.push({
    name: "archiveUpdate",
    params: { id: id },
  });
};
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const getPath = (files: Array<IDocument>) => {
  if (files.length == 0 || files == null)
    return "https://picsum.photos/100/150/?random";
  else {
    if (files[0].extension == "png" || files[0].extension == "jpg")
      return String(files[0].path);
    else if (files[0].extension == "pdf")
      return new URL("@/assets/image/pdf.png", import.meta.url);
    else if (files[0].extension == "doc" || files[0].extension == "docx")
      return new URL("@/assets/image/word.png", import.meta.url);
    else if (files[0].extension == "xls" || files[0].extension == "xlsx")
      return new URL("@/assets/image/excel.png", import.meta.url);
    else return new URL("@/assets/image/undefined.png", import.meta.url);
  }
};
</script>
<template>
  <div
    class="bg-cardLight hover:bg-[#E8F6FD] dark:bg-[#22262A] flex w-full p-5 rounded-md border border-gray-200 shadow-sm shadow-gray-600 duration-500 hover:border hover:border-gray-400 hover:shadow-sm hover:shadow-gray-600">
    <div class="w-1/4">
      <img @click="update(item.id)" class="rounded-lg cursor-pointer" :src="getPath(item.files).toString()" alt="" />
    </div>
    <div class="w-3/4 overflow-hidden">
      <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right">
        <div class="text-2xl text-text dark:text-textLight mb-2">
          {{ item.title }}
        </div>
        <div class="text-text dark:text-textGray mb-2 justify-between">
          <span>{{ t("NumberBook") }}: {{ item.number }}</span>
        </div>
        <div class="text-text dark:text-textGray mb-2 justify-between">
          <span>{{ t("Date") }}: {{ item.issueDate.split(" ")[0] }}</span>
          <span class="float-left flex">
            {{ item.files.length }}
            <img src="@/assets/svg/document.svg" :alt="item.title" />
          </span>
        </div>
        <div class="flex justify-betweens">
          <div class="text-text dark:text-textGray" v-html="item.description"></div>
        </div>
      </div>
    </div>

    <div class="dropdown">
      <IButton type="outlined" width="18" :text="t('Edit')" :onClick="() => update(item.id)" />
    </div>
  </div>
</template>
