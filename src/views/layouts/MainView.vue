<script setup lang="ts">
import Toolbar from "@/components/fixed/ToolBar1.vue";
import Navbar from "@/components/fixed/NavBar1.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
const rtlStore = useRtlStore();
const { isClose, isCloseStick } = storeToRefs(rtlStore);
</script>

<template>
  <div class="flex duration-300 bg-mainBG overflow-hidden dark:bg-[#25293c]">
    <Navbar />
    <div
      :class="{
        'ltr:ml-[80px] rtl:mr-[80px] xs:ltr:ml-[65px] xs:rtl:mr-[65px]':
          isClose,
        'md:rtl:mr-[256px] md:ltr:ml-[256px] opacity-30': !isClose && !isCloseStick,
        'md:rtl:mr-[256px] md:ltr:ml-[256px]': !isClose && isCloseStick,
      }"
      class="flex-1 bg-white overflow-hidden dark:bg-[#25293c] flex flex-col min-h-screen h-full print:ltr:ml-0 print:rtl:mr-0 duration-500"
    >
      <Toolbar />
      <RouterView />
    </div>
  </div>
</template> 
