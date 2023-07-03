<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import Toolbar from "@/components/fixed/toolBar.vue";
import navbar from "@/components/fixed/navBar.vue";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
const { getUser } = useAuthStore();
const { setPermissions } = usePermissionStore();
const { CheckAuth } = useAuthStore();

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
onMounted(async () => {
  CheckAuth();
  const user = await getUser();
  setPermissions(user.permissions);

  let htmlEl = document.querySelector("html");
  let dir: string | any = "rtl";
  if (localStorage.getItem("dir")?.toString() != undefined)
    dir = localStorage.getItem("dir")?.toString();
  htmlEl?.setAttribute("dir", dir);
  localStorage.getItem("isLtr");
  // lang
  let lang: string | any = "ar";
  lang = localStorage.getItem("lang");
  htmlEl?.setAttribute("lang", lang);
});

//const logo = ref("@assets/logo.svg");
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
