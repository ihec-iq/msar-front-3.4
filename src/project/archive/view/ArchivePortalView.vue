<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { ArchiveLinks } from "../ArchiveLinks";
import { usePermissionStore } from "@/project/user/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowUsers]);
});
</script>
<template>
  <IPage :HeaderTitle="t('UserIndex')">
    <IPageContent>
      <CardPortalComponent :links="ArchiveLinks"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>
