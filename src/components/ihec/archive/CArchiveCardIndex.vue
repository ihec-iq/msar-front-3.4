<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: String,
    required: false,
    default: "0",
  },
});
</script>
<template>
  <div
    class="bg-cardLight btn dark:bg-card overflow-hidden hover:bg-gray-300
     dark:hover:bg-gray-800  rounded-lg border border-gray-300 shadow-md
      shadow-gray-400 duration-500 hover:border hover:border-gray-400 
      hover:shadow-md hover:shadow-gray-600 mb-2"
  >
      <button
        class="ltr:ml-2 rtl:mr-2 lg:text-sm md:text-sm sm:text-sm xs:text-xl w-full text-text justify-between dark:text-textLight mb-2"
      >
        <span class="float-right flex"> {{ props.title }}</span>
        <span class="float-left text-sm mr-8 flex dark:text-textGray">
          {{ props.count }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            class="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"
            ></path>
          </svg>
        </span>
      </button>
  </div>
</template>
