<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { HrLinks } from "../HrLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
});
</script>
<template>
  <IPage :HeaderTitle="t('UserIndex')">
    <IPageContent>
      <CardPortalComponent :links="HrLinks"></CardPortalComponent>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"/>
  </IPage>
</template>