<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useDragDropStore } from "../dragDrop";
import type { IArchive } from "@/project/archive/IArchive";
import type { PropType } from "vue";

const router = useRouter();
const { generateIcon } = useDragDropStore();

const props = defineProps({
  item: {
    type: Object as PropType<IArchive>,
    required: true,
  },
});

/** تاريخ منسّق بحسب اليوم/السنة */
const formattedDate = computed(() => {
  const v = props.item.issueDate;
  const sameDay =
    dayjs().format("YYYY-MM-DD") === dayjs(v).format("YYYY-MM-DD");
  const sameYear = dayjs().format("YYYY") === dayjs(v).format("YYYY");
  if (sameDay) return dayjs(v).format("h:mm A");
  if (sameYear) return dayjs(v).format("MMM D");
  return dayjs(v).format("MMM D YYYY");
});

/** ملفات للعرض + المتبقي */
const filesPreview = computed(() => props.item.FilesDocument.slice(0, 2));
const filesRestCount = computed(() =>
  Math.max(0, props.item.FilesDocument.length - 2)
);

/** فتح ملف في تبويب جديد (آمن) */
const openFile = (path: string) => {
  window.open(path, "_blank", "noopener,noreferrer");
};

/** فتح صفحة التعديل */
const openDetails = () => {
  router.push({ name: "archiveUpdate", params: { id: props.item.id } });
};

/** فتح التفاصيل عبر Enter */
const onKeyOpen = (e: KeyboardEvent) => {
  if (e.key === "Enter") openDetails();
};
</script>

<template>
  <article
    class="w-full rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-sm hover:bg-gray-50 dark:bg-[#131625] dark:border-slate-700 dark:hover:bg-slate-900"
  >
    <!-- رأس البطاقة: عنوان + رقم + تاريخ -->
    <header
      class="grid grid-cols-12 gap-3 p-4 cursor-pointer select-none"
      role="button"
      tabindex="0"
      @click="openDetails"
      @keydown="onKeyOpen"
      :aria-label="`Open #${item.number}`"
    >
      <!-- العنوان -->
      <h3
        class="col-span-12 lg:col-span-6 font-bold text-lg leading-snug rtl:text-right ltr:text-left text-gray-900 dark:text-gray-100 line-clamp-2"
        :title="item.title"
      >
        {{ item.title }}
      </h3>

      <!-- الرقم + الوصف -->
      <div
        class="col-span-12 lg:col-span-4 text-gray-800 dark:text-gray-200 rtl:text-right ltr:text-left"
      >
        <span class="font-semibold">{{ item.number }}</span>
        <span v-if="item.description" class="ml-1 opacity-80 line-clamp-1">
          – {{ item.description }}
        </span>
      </div>

      <!-- التاريخ -->
      <time
        class="col-span-12 lg:col-span-2 text-gray-600 dark:text-gray-400 rtl:text-end ltr:text-start"
        :datetime="item.issueDate"
      >
        {{ formattedDate }}
      </time>
    </header>

    <!-- أسفل البطاقة: النوع + الملفات -->
    <footer class="flex flex-wrap items-center gap-2 px-4 pb-4">
      <!-- نوع الأرشيف -->
      <span
        class="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 text-[12px] text-orange-800 px-2.5 py-1 font-medium dark:bg-gray-800 dark:text-orange-200"
      >
        {{ item.ArchiveType.name }}
      </span>

      <!-- شرائط الملفات (أول 2) -->
      <button
        v-for="(file, i) in filesPreview"
        :key="i + file.path"
        type="button"
        @click.stop="openFile(file.path)"
        class="relative inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
        :title="file.title"
      >
        <img
          :src="generateIcon(file.extension)"
          alt=""
          width="16"
          height="16"
        />
        <span class="max-w-[12rem] truncate">{{ file.title }}</span>
      </button>

      <!-- بقية الملفات (+N) -->
      <span
        v-if="filesRestCount > 0"
        class="inline-flex items-center rounded-lg border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-[12px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        :title="`${filesRestCount} more file(s)`"
      >
        +{{ filesRestCount }}
      </span>
    </footer>
  </article>
</template>
