<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import envConfig from "@/api/envConfig";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
const rtlStore = useRtlStore();
import { Icon } from "@iconify/vue";

import { useConfigStore } from "@/stores/configStore";
import { ref, getCurrentInstance, onMounted } from "vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
const { Config } = storeToRefs(useConfigStore());
const { is } = storeToRefs(rtlStore);

//region""
import { useToast, POSITION } from "vue-toastification";
// Utility function to show error toasts
const toast = useToast();
const showErrorToast = (message = "") => {
  toast.error(message, {
    position: POSITION.TOP_CENTER,
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });
};
const showSuccessToast = (message = "") => {
  toast.success(message, {
    position: POSITION.TOP_CENTER,
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });
};
//#endregion

//#region Vars
const app = getCurrentInstance();
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref(t("ConfigServer"));
const route = useRoute();
const Loading = ref(false);
const router = useRouter();

const back = () => {
  router.push({
    name: "inputVoucherIndex",
  });
};
const store = async () => {
  await useConfigStore()
    .store(String(Config.value.connectionString), String(Config.value.organization))
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Your configuration has been updated",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.back();
      });
    });
};
const loading = ref(false);
const successConnection = ref(0);
// state 0 inial, 1 loading , 2 success , 3 error
const checkConnection = async () => {
  successConnection.value = 1;
  await useConfigStore()
    .checkConnection(String(Config.value.connectionString))
    .then((response) => {
      const success: Boolean = Boolean(response);
      if (success) {
        successConnection.value = 2;
        showSuccessToast("Connection is successful");
        return;
      } else {
        successConnection.value = 3;
        showErrorToast("Connection failed");
      }
    });
};
//http://10.10.10.10/workflow_ihec/public/api
onMounted(async () => {
  //console.log(can("show items1"));
  //checkPermissionAccessArray(["show Item"]);
  await useConfigStore()
    .load()
    .then(() => {
      if (Config.value.connectionString == null || Config.value.connectionString == "") {
        Config.value.connectionString = envConfig._baseURL;
      }
      if (Config.value.organization == null || Config.value.organization == "") {
        Config.value.organization = "المفوضية العليا المستقلة للانتخابات";
      }
    });
});
</script>
<template>
  <PageTitle> {{ namePage }}</PageTitle>

  <div class="w-full">
    <div class="w-full p-6 grid lg:grid-cols-1 xs:grid-cols-1">
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("ConnectionString") }}
        </div>
        <div class="flex">
          <input
            v-model="Config.connectionString"
            type="text"
            class="w-full text-left outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
          <IButton2
            :text="t('Check')"
            @click="checkConnection"
            :type="EnumButtonType.Outlined"
            class="ml-2"
            :class="{
              'bg-create': successConnection == 2,
              'border-red-500 border-2': successConnection == 3,
            }"
          >
            <template #icon>
              <Icon
                v-if="successConnection == 1"
                icon="mdi:loading"
                class="grow-0 animate-spin"
              >
              </Icon>
              <Icon
                v-else-if="successConnection == 2"
                icon="mdi:check-circle"
                class="grow-0"
              />
              <Icon
                v-else-if="successConnection == 3"
                icon="fa6-solid:circle-exclamation"
                class="grow-0 text-red-500"
              />
            </template>
          </IButton2>
        </div>
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Organization") }}
        </div>
        <input
          v-model="Config.organization"
          type="text"
          class="w-full text-left outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
    </div>
    <!-- bottom tool bar -->
    <div
      :class="{
        'lg:w-[99.2%] xs:w-[97%] lg:mx-2 xs:mx-2 bottom': is,
        'lg:w-[95%] md:w-[90%] xs:w-[75%] lg:mr-0 ltr:xs:ml-3 rtl:xs:mr-3 bottom':
          !is,
      }"
      class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
    >
      <div class="flex ltr:ml-8 rtl:mr-8">
        <div class="items-center mr-3">
          <button
            @click="store()"
            class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Save") }}
          </button>
        </div>
      </div>
    </div>
    <div
      :class="{
        'ltr:left-4 rtl:right-4': is,
        'ltr:left-28 rtl:right-28': !is,
      }"
      class="backBtn z-10 fixed bottom-2 lg:ml-3 xs:ml-0 print:hidden"
    >
      <button
        @click="back()"
        class="bg-back hover:bg-backHover h-10 duration-500 lg:w-32 xs:w-20 p-2 rounded-md text-white"
      >
        {{ t("Back") }}
      </button>
    </div>
    <!-- end bottom tool -->
  </div>
</template>
<style scoped>
.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background: rgba(255, 255, 255, 0.333);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}

.drop-area[data-active="true"] {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.8);
}

label {
  font-size: 36px;
  cursor: pointer;
  display: block;
}

label span {
  display: block;
}

label input[type="file"]:not(:focus-visible) {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

label .smaller {
  font-size: 16px;
}

.image-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  padding: 0;
  margin-bottom: 35px;
}

.preview-card {
  display: flex;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin: 5px;
}

.upload-button {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 50px;
  padding: 0.75rem 3rem;
  margin: 1rem auto;
  font-size: 1.25rem;
  font-weight: bold;
  background: #369;
  color: #fff;
  text-transform: uppercase;
}

button {
  cursor: pointer;
}

.custom-quill .ql-editor {
  direction: rtl !important;
  text-align: right !important;
}
</style>
@/project/user/permissionStore@/utilities/I18nPlugin
