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
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
import ILabel from "@/components/ihec/ILabel.vue";
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
    .checkConnection(String(Config.value.connectionString+"/api"))
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
        Config.value.connectionString = envConfig._baseURL+"/api";
      }
      if (Config.value.organization == null || Config.value.organization == "") {
        Config.value.organization = "المفوضية العليا المستقلة للانتخابات";
      }
    });
});
</script>
<style></style>
<template>
  <IPage :HeaderTitle="namePage">
    <IPageContent>
      <div class="h-5"> .</div>
      <IRow cols-lg="2" cols-md="2" cols-sm="1">
        <ICol span="1" span-md="1" span-sm="1" class="flex">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold mx-2 text-text dark:text-textLight">
            {{ t("ConnectionString") }}
          </div>
          <input v-model="Config.connectionString" type="text"
            class="w-full text-left outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight" />
          <IButton2 :text="t('Check')" @click="checkConnection" :variant="EnumButtonType.Outlined" class="mx-2" :class="{
            'bg-create': successConnection == 2,
            'border-red-500 border-2': successConnection == 3,
          }">
            <template #icon>
              <Icon v-if="successConnection == 1" icon="mdi:loading" class="grow-0 animate-spin">
              </Icon>
              <Icon v-else-if="successConnection == 2" icon="mdi:check-circle" class="grow-0" />
              <Icon v-else-if="successConnection == 3" icon="fa6-solid:circle-exclamation"
                class="grow-0 text-red-500" />
            </template>
          </IButton2>
        </ICol>

      </IRow>
      <IRow cols-lg="2" cols-md="2" cols-sm="1"> 
        <ICol span="1" span-md="1" span-sm="1" class="flex">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight mx-2">
            {{ t("Organization") }}
          </div>
          <input v-model="Config.organization" type="text"
            class="w-full text-left outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight" />
        </ICol>
      </IRow>
    </IPageContent>
    <template #Footer>
      <IFooterCrud :show-add="false" :onUpdate="store" :show-delete="false" class="" />
    </template>
  </IPage>
</template>
