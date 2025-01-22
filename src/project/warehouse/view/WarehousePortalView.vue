<script setup lang="ts">
import { onMounted } from "vue";
import PageTitle from "@/components/general/namePage.vue";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
import { WarehouseLinks } from "../WarehouseLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type CardPortalComponent from "@/components/CardPortalComponent.vue";
const { checkPermissionAccessArray } = usePermissionsStore();

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.VacationReport]);
});
</script>
<template>
  <IPage :HeaderTitle="t('Warehouse.Index')">
    <IPageContent>
      <CardPortalComponent
        :links="WarehouseLinks[0].children"
      ></CardPortalComponent>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false" />
  </IPage>
</template>
<style></style>
