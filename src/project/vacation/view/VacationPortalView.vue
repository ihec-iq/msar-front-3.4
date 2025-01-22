<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
import { VacationLinks } from "../VacationLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import CardPortalComponent from "@/components/CardPortalComponent.vue";
const { checkPermissionAccessArray } = usePermissionsStore();

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.VacationReport]);
});
</script>
<template>
  <IPage :HeaderTitle="t('VacationIndex')">
    <IPageContent>
      <CardPortalComponent
        :links="VacationLinks[0].children"
      ></CardPortalComponent>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false" />
  </IPage>
</template>
<style></style>
