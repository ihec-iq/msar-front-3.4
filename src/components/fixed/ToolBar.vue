<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDark } from "@vueuse/core";
import { storeToRefs } from "pinia";
import router from "@/router";
import { useRoute } from "vue-router";
import { t } from "@/utilities/I18nPlugin";

const route = useRoute();
import { useConfigStore } from "@/stores/configStore";
import PopSetting from "./PopSetting.vue";
const { Config } = storeToRefs(useConfigStore());

//#region Theme Setting
let isDark = useDark();
let themeDark = ref(false);

//#endregion
//#region Search
const searchInput = ref(false);
document.onkeydown = function (e) {
  if (
    (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
    (e.key === "K" && (e.ctrlKey || e.metaKey))
  ) {
    e.preventDefault(); // present "Save Page" from getting triggered.
    searchInput.value = true;
    document.getElementById("inputValue")?.focus();
  }
};
const valSearch = ref("");
const Search = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    // Enter key is pressed
    // Perform your desired action here
    console.log("Enter key is pressed");
    console.log(valSearch.value);
    if (route.name == "archiveIndex") {
      router.push({ params: { search: valSearch.value } });
    } else {
      router.push({
        name: "archiveIndex",
        params: { search: valSearch.value },
      });
    }
  }
};

// watch((valSearch)=>(old,new)=>{
const inputRefSearch = ref<HTMLInputElement | null>(null);

//#endregion
import VersionChecker from "../VersionChecker.vue";
onMounted(async () => {
  themeDark.value = isDark.value;
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
});
</script>
<template>
  <div class="print:hidden flex text-gray-800 
        dark:bg-[#26293B]  max-h-14
    bg-navLight box-border mx-0 flex-1 items-center  p-1
    justify-between dark:border-b dark:border-gray-800 shadow-md sm:px-1 xs:w-full">
    <VersionChecker />
    <div class="flex items-center">
      <div class="text-gray-500 text-2xl rtl:mr-2 ltr:ml-2"><!-- # --></div>
      <div class="text-sm text-text dark:text-textLight">
        {{ Config.organization }}
      </div>
  </div>
  <div class="relative w-56 duration-500 ease-in-out max-w-md mx-auto" :class="{ 'lg:w-[700px] xs:w-56': searchInput }">
    <input type="text" id="inputValue" v-model="valSearch" ref="inputRefSearch" :placeholder="t('Search')"
      @focus="searchInput = true" @blur="searchInput = false"
      class="rounded w-full px-7 placeholder:ltr:left-10 placeholder:rtl:right-10 text-gray-800 border-[1px] dark:border-[#505051] dark:hover:border-[#686869] dark:bg-[#3C3C3D] dark:hover:bg-[#424243] bg-LightTableHead  py-1 duration-300"
      :class="{
          'lg:py-1 xs:py-1 placeholder:text-sm text-lg': searchInput,
        }" />
    <div
      class="absolute left-1 top-1/2 -translate-y-1/2 px-2 py-1 text-sm dark:text-gray-300 dark:bg-gray-700 dark:border-gray-800 text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
      Ctrl + K
    </div>
    <span class="absolute ltr:left-0 rtl:right-0 mx-2 top-1.5 ">
      <svg class="w-4 h-4 text-iconLight hover:text-iconHoverLight dark:text-icon dark:hover:text-iconHover"
        fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
        <path class="heroicon-ui"
          d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z">
        </path>
      </svg>
    </span>
  </div>

  <PopSetting></PopSetting>
  </div>
</template>
