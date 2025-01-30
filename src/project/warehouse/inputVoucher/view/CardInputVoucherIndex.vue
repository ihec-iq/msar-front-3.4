<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import { useRouter } from "vue-router";
import { computed } from "vue";
const router = useRouter();
const update = (id: number) => {
  router.push({
    name: "inputVoucherUpdate",
    params: { id: id },
  });
};
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const truncatedNotes = computed(() => {
  if (props.item.notes) return props.item.notes.replace(/<[^>]*>/g, '').slice(0, 20) + "...";
  else return "";
});
</script>
<template>
  <div
    class="w-full max-w-sm min-h-36 max-h-36 bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div
      class="flex justify-between px-4 pt-3 rounded-t-md bg-[#7192AD] dark:bg-slate-600 h-10 text-white"
    >
      <span class="">{{ item.date }}</span>
      <button
        @click="update(item.id)"
        class="inline-block text-gray-500 dark:text-gray-400 hover:bg-slate-400 dark:hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm mb-2"
        type="button"
      >
        <span class="sr-only">Open dropdown</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-pen"
          color="white"
          viewBox="0 0 16 16"
        >
          <path
            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
          />
        </svg>
      </button>
      <!-- <button
        id="dropdownButton"
        data-dropdown-toggle="dropdown"
        class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
        type="button"
      >
        <span class="sr-only">Open dropdown</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3"
        >
          <path
            d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
          />
        </svg>
      </button> -->
      <div
        id="dropdown"
        class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <ul class="py-2" aria-labelledby="dropdownButton">
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >Edit</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >Export Data</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >Delete</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col items-center pb-10 pt-5">
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        {{ item.number }}
      </h5>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{
        truncatedNotes
      }}</span>
      <div class="badge badge-primary badge-outline">{{ item.itemsCount }}</div>
    </div>
  </div>
</template>

