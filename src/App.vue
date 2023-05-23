<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import Toolbar from "./components/fixed/toolbar.vue";
import navbar from "./components/fixed/navbar.vue";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";

const rtlStore = useRtlStore();
const { isClose, is } = storeToRefs(rtlStore);
const show = ref(false);
document.onkeydown = function (e) {
  if (
    (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
    (e.key === "K" && (e.ctrlKey || e.metaKey))
  ) {
    e.preventDefault(); // present "Save Page" from getting triggered.
    show.value = true;
  }
};
document.onkeydown = function (s) {
  if ((s.key === "b" && s.ctrlKey) || (s.key === "B" && s.ctrlKey)) {
    s.preventDefault(); // present "Save Page" from getting triggered.

    isClose.value = !isClose.value;
  }
};
// let htmlEl = document.querySelector("html");
// htmlEl?.setAttribute("data-theme", "cupcake");
onMounted(() => {
  let htmlEl = document.querySelector("html");
  let dir: string | any = "ltr";
  if (localStorage.getItem("dir")?.toString() != undefined)
    dir = localStorage.getItem("dir")?.toString();
  htmlEl?.setAttribute("dir", dir);
  localStorage.getItem("isLtr");
  // lang
  let lang: string | any = "ar";
  lang = localStorage.getItem("lang");
  htmlEl?.setAttribute("lang", lang);
 
});

const logo = ref("@assets/logo.svg");
</script>

<template>
  <div class="flex">
    <vueSplash
      show="true"
      :logo="logo"
      title="Your App Name"
      color="#00bfa5"
      :size="180"
      :fixed="true"
    />
    <navbar />
    <div
      :class="{
        'lg:ltr:ml-[80px] lg:rtl:mr-[80px] xs:ltr:ml-[84px]': isClose,
        'lg:rtl:mr-[304.2px] lg:ltr:ml-[304.01px] xs:ltr:ml-[390px]': !isClose,
        'lg:ltr:ml-[0.1px] lg:rtl:mr-[0.001px] xs:ltr:ml-[0.1px]': is,
        'lg:rtl:mr-[80px] lg:ltr:ml-[80.1px] xs:ltr:ml-[84px]': !is,
      }"
      class="flex-1 overflow-hidden image-bg dark:bg-content flex flex-col min-h-screen h-full"
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
