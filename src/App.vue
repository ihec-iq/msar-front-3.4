<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { useAuthStore } from "@/stores/authStore";
import Api from "./api/apiConfig";
import { useConfigStore } from "@/stores/configStore";
import { Toaster } from "@/components/ui/sonner";
const { Config } = storeToRefs(useConfigStore());
import "vue-sonner/style.css";

const rtlStore = useRtlStore();
const { isClose, is } = storeToRefs(rtlStore);

const show = ref(false);
document.onkeydown = function (e) {
  if (
    (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
    (e.key === "K" && (e.ctrlKey || e.metaKey))
  ) {
    e.preventDefault();
    show.value = true;
  }

  if ((e.key === "b" && e.ctrlKey) || (e.key === "B" && e.ctrlKey)) {
    e.preventDefault();
    isClose.value = !isClose.value;
  }
};

onMounted(async () => {
  await useConfigStore().load();
  Api.defaults.baseURL = String(Config.value.connectionString) + "/api";
  useAuthStore().CheckAuth();

  const htmlEl = document.querySelector("html");
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
</script>

<template>
  <div class="font-Tajawal image-bg p-0 m-0">
    <Toaster />
    <RouterView></RouterView>
  </div>
</template>
