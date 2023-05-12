<script lang="ts" setup>
import { useRouter } from "vue-router";
import { i18nRepository } from "@/stores/i18n/I18nRepository";

const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
const router = useRouter();
const props = defineProps({
  count: { type: Number, required: true },
});
const back = () => {
  router.go(props.count);
};
</script>
<template>
  <div class="">
    <button
      @click="back()"
      class="bg-back hover:bg-backHover h-10 duration-500 lg:w-32 xs:w-16 lg:p-2 xs:p-1 rounded-md text-white"
    >
      {{ t("Back") }}
    </button>
  </div>
</template>
