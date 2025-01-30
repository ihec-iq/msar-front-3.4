<script setup lang="ts">
import { useRouter } from "vue-router";
import moment from "moment";
import { useDragDropStore } from "../dragDrop";
import type { IArchive  } from "@/project/archive/IArchive";
import type { PropType } from "vue";

const { generateIcon } = useDragDropStore();

const router = useRouter();

const props = defineProps({
  item: {
    type: Object as PropType<IArchive>,
    required: true,
  },
});



const openFile = (path: string) => {
  const fileUrl = path;
  window.open(fileUrl, "_blank");
};

const formatArchiveDate = (value: string) => {
  const currentDayCondition =
    moment(new Date()).format("YYYY-MM-DD") ==
    moment(value).format("YYYY-MM-DD");
  const currentYearCondition =
    moment(new Date()).format("YYYY") == moment(value).format("YYYY");

  if (currentDayCondition) return moment(value).format("h:mm A");
  else if (currentYearCondition) return moment(value).format("MMM D");
  else return moment(value).format("MMM Do YY");
};
</script>

<template>
  <div
    class="grid grid-flow-row auto-rows-max box-border hover:bg-gray-100 border dark:bg-darkNav dark:border-slate-700 dark:hover:bg-slate-900 bg-white transition-all duration-200 ease-in-out hover:shadow-inner">
    <div @click="router.push({ name: 'archiveUpdate', params: { id: item.id } })"
      class="w-full h-auto flex flex-wrap min-h-16 px-4 cursor-pointer">
      <span class="flex-none w-auto min-w-96 rtl:text-right ltr:text-left font-bold text-xl p-4">{{ item.title }}</span>
      <span class="flex-1 w-96 min-w-96 rtl:text-right font-semibold ltr:text-left text-xl p-4">{{ item.number }}
        <span v-if="item.description" class="font-thin text-sm">
          - {{ item.description }}</span>

      </span>

      <span class="w-36 min-w-36 rtl:text-end ltr:text-start text-md p-4 justify-self-end">
        {{ formatArchiveDate(item.issueDate) }}</span>
    </div>

    <div class="flex px-6 pb-2">
      <!-- empty div -->
      <div class="flex basis-96"></div>
      <span
        class="text-gray text-sm rounded-lg opacity-80 dark:bg-gray-800  bg-orange-100 border-1 border border-orange-300 p-1 px-2 mx-2">{{
          item.ArchiveType.name }}</span>
      <!-- chip -->
      <div v-if="item.FilesDocument.length < 3" v-for="(file, index) in item.FilesDocument" :key="index"
        @click="openFile(file.path)"
        class="rtl:ml-3 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-50 hover:text-gray-600 relative grid select-none items-center whitespace-nowrap rounded-lg border border-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-700">
        <div class="absolute top-2/4 right-1.5 h-5 w-5 -translate-y-2/4">
          <img width="16" height="16" :src="generateIcon(file.extension)" alt="file" />
        </div>
        <span class="mr-[18px]">{{ file.title }}</span>
      </div>
      <div v-else class="flex">
        <div v-for="i in 2" @click="openFile(item.FilesDocument[i].path)"
          class="rtl:ml-3 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-50 hover:text-gray-600 relative grid select-none items-center whitespace-nowrap rounded-lg border border-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-700">
          <div class="absolute top-2/4 right-1.5 h-5 w-5 -translate-y-2/4">
            <img width="16" height="16" :src="generateIcon(item.FilesDocument[i].extension)" alt="file" />
          </div>
          <span class="mr-[18px]">{{ item.FilesDocument[i].title }}</span>
        </div>
        <div v-if="item.FilesDocument.length > 2"
          class="rtl:ml-3 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-50 hover:text-gray-600 relative grid select-none items-center whitespace-nowrap rounded-lg border border-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-700">
          <span>+{{ item.FilesDocument.length - 2 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
