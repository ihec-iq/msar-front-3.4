<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Toolbar from "@/components/fixed/ToolBar.vue";
import Navbar from "@/components/fixed/NavBar.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";

// rtl store
const rtlStore = useRtlStore();
const { isClose, isCloseStick } = storeToRefs(rtlStore);

// reactive flag for mobile
const whenMobileView = ref(false);

const handleResize = () => {
  // you can adjust 768 to whatever your Tailwind 'md' breakpoint is
  whenMobileView.value = window.innerWidth < 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<template>
  <div class="flex duration-300 bg-mainBG overflow-hidden dark:bg-[#25293c]">
    <Navbar />

    <div
      :class="[
        // remove sidebar margins completely on mobile
        whenMobileView
          ? 'ltr:ml-0 rtl:mr-0'
          : isClose
            ? 'ltr:ml-[80px] rtl:mr-[80px] xs:ltr:ml-[65px] xs:rtl:mr-[65px]'
            : !isCloseStick
              ? 'md:rtl:mr-[256px] md:ltr:ml-[256px] opacity-30'
              : 'md:rtl:mr-[256px] md:ltr:ml-[256px]',
      ]"
      class="flex-1 bg-white overflow-hidden dark:bg-[#25293c] flex flex-col min-h-screen h-full print:ltr:ml-0 print:rtl:mr-0 duration-500"
    >
      <Toolbar />
      <RouterView />
    </div>
  </div>
</template>
