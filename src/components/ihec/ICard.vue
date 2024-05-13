<script setup lang="ts">
interface ICardAction {
  caption: string;
  icon: string;
  color: string;
  action: () => void;
}

const props = defineProps({
  showActions: {
    type: Boolean,
    default: false,
  },
  actions: {
    type: Array<ICardAction>,
    required: false,
  },
});
</script>
<template>
  <div
    class="w-full max-w-sm min-h-36 max-h-36 bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div
      v-if="showActions"
      class="flex justify-between px-4 pt-3 rounded-t-md bg-[#7192AD] dark:bg-slate-600 h-10 text-white"
    >
      <v-slot name="header"></v-slot>
      <button
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
      </button>
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
      <v-slot name="content"></v-slot>
    </div>
  </div>
</template>
