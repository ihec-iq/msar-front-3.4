<script setup lang="ts">
import Toolbar from "@/components/fixed/toolBar.vue";
import navbar from "@/components/fixed/navBar.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
const rtlStore = useRtlStore();
const { isClose, is } = storeToRefs(rtlStore);
</script>

<template>
  <div class="flex duration-300">
    <navbar />
    <div
      :class="{ 'ltr:ml-0 rtl:mr-0': is, 'ltr:ml-[80px] rtl:mr-[80px]': !is }"
      class="flex-1 overflow-hidden duration-300 image-bg dark:bg-content flex flex-col min-h-screen h-full"
    >
      <Toolbar />
      <RouterView />
    </div>
  </div>
  <!-- <component :is="$route.meta.layout || 'div'"></component> -->
</template>
<style scoped>
.dark .image-bg {
  background-image: none;
}
.image-bg {
  background-image: url("./assets/image/beams-home@95.jpg");
}
</style>
