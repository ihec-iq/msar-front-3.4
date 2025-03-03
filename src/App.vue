<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { useAuthStore } from "@/stores/authStore";
//import { usePermissionsStore } from "@/project/core/permissionStore";
import Api from "./api/apiConfig";
import { useConfigStore } from "@/stores/configStore";
const { Config } = storeToRefs(useConfigStore());

// const { getUser } = useAuthStore();
// const { setPermissions } = usePermissionsStore();
// const { CheckAuth } = useAuthStore();

const rtlStore = useRtlStore();
const { isClose, is } = storeToRefs(rtlStore);
//#region  Code
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
  await useConfigStore().load();
  Api.defaults.baseURL = String(Config.value.connectionString);

  useAuthStore().CheckAuth();
  //const user = await getUser();
  //setPermissions(user.permissions);

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
//#endregion
</script>

<template>
  <div class="font-Tajawal image-bg p-0 m-0">
    <RouterView></RouterView>
  </div>
</template>
