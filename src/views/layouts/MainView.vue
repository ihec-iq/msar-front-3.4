<script setup lang="ts">
import Toolbar from "@/components/fixed/toolBar.vue";
import navbar from "@/components/fixed/navBar.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
</script>

<template>
  <div class="flex duration-300 bg-mainBG overflow-hidden dark:bg-[#25293c]">
    <navbar />
    <div
      :class="{
        'lg:ltr:ml-[80px] lg:rtl:mr-[80px] xs:ltr:ml-[65px] xs:rtl:mr-[65px]':
          isClose,
        'lg:rtl:mr-[256px] lg:ltr:ml-[256px] opacity-100': !isClose,
      }"
      class="flex-1 bg-mainBG overflow-hidden dark:bg-[#25293c] flex flex-col min-h-screen h-full print:ltr:ml-0 print:rtl:mr-0 duration-500"
    >
      <Toolbar />
      <RouterView />
    </div>
  </div>
</template>
<style scoped>
.dark .image-bg {
  background-image: none;
}
.image-bg {
  background-image: url("@/assets/image/beams-home@95.jpg");
}
</style>
