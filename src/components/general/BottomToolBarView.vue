<script setup lang="ts">
import { useRtlStore } from "@/stores/i18n/rtlPi";
import useLanguage from "@/stores/i18n/languageStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const { t } = useLanguage();
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
const router = useRouter();
const back = () => {
  router.go(-1);
};
</script>
<template>
  <!-- bottom tool bar -->
  <div
    :class="{
      'w-[95%]': isClose,
      'w-10/12': !isClose,
    }"
    class="dark:bg-bottomTool duration-700 bg-sideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0"
  >
    <!-- create -->
    <div class="flex">
      <div class="items-center ml-2">
        <button
          type="submit"
          class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
        >
          {{ t("Create") }}
        </button>
        <button
          type="submit"
          class="bg-update hover:bg-updateHover duration-500 h-12 w-32 rounded-lg text-white"
        >
          {{ t("Update") }}
        </button>
      </div>
    </div>
  </div>
  <div class="z-10 fixed bottom-2 ml-3">
    <button
      @click="back()"
      class="bg-back hover:bg-backHover h-10 duration-500 w-32 p-2 rounded-md text-white"
    >
      {{ t("Back") }}
    </button>
  </div>
</template>
