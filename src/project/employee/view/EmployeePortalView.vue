<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { EmployeeLinks } from "../EmployeeLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowUsers]);
});
</script>
<template>
  <IPage :HeaderTitle="t('EmployeeIndex')">
    <IPageContent>
      <CardPortalComponent :links="EmployeeLinks[0].children"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>
../EmployeeLinks