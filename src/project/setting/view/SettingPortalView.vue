<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { SettingLinks } from "../SettingLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type CardPortalComponent from "@/components/CardPortalComponent.vue";
const { checkPermissionAccessArray } = usePermissionsStore();

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowUsers]);
});
</script>
<template>
  <IPage :HeaderTitle="t('UserIndex')">
    <IPageContent>
      <CardPortalComponent :links="SettingLinks"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>
