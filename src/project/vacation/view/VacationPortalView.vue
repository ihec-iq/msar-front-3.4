<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
import { VacationLinks } from "./VacationLinks";
import { usePermissionStore } from "@/project/user/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionStore();

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.VacationReport]);
});
</script>
<template>
  <IPage :HeaderTitle="t('VacationIndex')">
    <IPageContent>
      <CardPortalComponent :links="VacationLinks"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>
<style></style>
