<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { UserLinks } from "../UserLinks";
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
      <CardPortalComponent :links="UserLinks[0].children"></CardPortalComponent>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false" />
  </IPage>
</template>
