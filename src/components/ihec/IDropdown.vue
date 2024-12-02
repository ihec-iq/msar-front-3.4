<script setup lang="ts">
import { Icon } from '@iconify/vue';


</script>
<template>
  <div class="dropdown">
    <button
      class="dropdown-toggle peer rounded-full border-2 p-0 m-0 border-gray-600 text-white font-medium  p-1 text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
      type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="true">
      <Icon icon="mdi:menu" width="32" class="dark:text-[#eee] text-gray-900"></Icon>
    </button>
    <ul
      class="dropdown-menu   top-3 peer-hover:block hover:block min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
      aria-labelledby="dropdownMenuButton2">
      <slot> </slot>
    </ul>
  </div>
</template>
