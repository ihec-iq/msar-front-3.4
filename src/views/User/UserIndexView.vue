<script setup lang="ts">
import UserTable from "./UserTable.vue";
import { useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { useI18n } from "@/stores/i18n/useI18n";

const { t } = useI18n();

const router = useRouter();
const userAdd = () => {
  router.push({
    name: "userAdd",
  });
};
</script>
<template>
  <PageTitle> {{ t("Users Details") }}</PageTitle>
  <UserTable />
  <div class="m-5 fixed bottom-0 ltr:right-0 rtl:left-0">
    <button
      @click="userAdd()"
      class="flex p-2.5 float-right bg-create rounded-xl hover:rounded-3xl md:mr-5 lg:mr-0 transition-all duration-300 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  </div>
</template>
