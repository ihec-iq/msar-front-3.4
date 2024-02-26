<script setup lang="ts">
import { Icon } from '@iconify/vue';


</script>
<template>
  <div class="dropdown">
    <button
      class="dropdown-toggle peer mr-45 px-6 py-2.5 text-white font-medium rounded-md text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
      type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="true">
      <Icon icon="mdi:menu" color="black" width="32"></Icon>
    </button>
    <ul
      class="dropdown-menu top-8 peer-hover:block hover:block min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
      aria-labelledby="dropdownMenuButton2">
      <slot> </slot>
    </ul>
  </div>
</template>
