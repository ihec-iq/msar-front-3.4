<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia"; 
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

import { ref, onMounted, computed } from "vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { useSettingsStore } from "../settingsStore"; // ← الستور الجديد

//region Toast
import { useToast, POSITION } from "vue-toastification";
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
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
//endregion

//#region Vars (الأصلية)
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref(t("HealthCheack.Index"));
const route = useRoute();
const Loading = ref(false);
const router = useRouter();

 
onMounted(async () => {
  try {
  
  } catch {
    // تجاهل الأخطاء الأولية
  }
});
</script>

<style></style>

<template>
  <IPage :HeaderTitle="namePage">
    <IPageContent>
      <IRow class="mb-4">
        <ICol :sm="12" :md="6" :lg="4" class="mb-2">
          <IButton2
            :type="EnumButtonType.Primary"
            :text="t('Refresh')"
            preIcon="refresh"
            @click="() => { }"
          />
        </ICol>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :show-add="false" :show-delete="false" />
    </template>
  </IPage>
</template>
