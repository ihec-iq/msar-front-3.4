<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission, EnumSetting } from "@/utilities/EnumSystem";
import { ErrorToast, SuccessToast } from "@/utilities/Toast";
import { prepareFormData } from "@/utilities/crudTool";
import { useSettingStore } from "@/project/core/settingStore";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import type { ISetting } from "@/project/core/ISetting";
import IPage from "@/components/ihec/IPage.vue";
import { showSuccessToast } from "vant";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";

const route = useRoute();
const router = useRouter();
const { checkPermissionAccessArray } = usePermissionsStore();
const SettingStore = useSettingStore();
const SettingPromotionData = ref<ISetting>({
  id: 0,
  key: EnumSetting.SettingNumberDayesAlertPromotion,
});

const isLoading = ref(false);
const errors = ref<string | null>(null);
const namePage = ref("Setting.PromotionName");

const update = async () => {
  errors.value = null;
  try {
    await SettingStore.updateByKey(prepareFormData(SettingPromotionData.value), SettingPromotionData.value.id.toString());
    SuccessToast();
  } catch (e: any) {
    ErrorToast(e.toString());
  }
};

const showData = async (key: string) => {
  return SettingStore.showByKey(key);
};

onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.Setting]);

  await showData(SettingPromotionData.value.key).then((response) => {
    Object.assign(SettingPromotionData.value, response);
  });

  isLoading.value = false;
});

</script>

<template>
  <IPage :HeaderTitle="t(namePage)" :isLoading="isLoading">
    <template #headerButtons>
    </template>
    <IPageContent>
      <IRow>
        <IRow col-lg="4" col-md="2" col-sm="1">
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Setting.SettingPromotionData')" v-model="SettingPromotionData.valInt"
              :type="EnumInputType.Number" />
          </ICol>
        </IRow>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :isAdd="false" :onUpdate="update" :showDelete="false" />
    </template>
  </IPage>
</template>
<style></style> 