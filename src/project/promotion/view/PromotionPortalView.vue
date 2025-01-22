<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { PromotionLinks } from "../PromotionLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
});
</script>
<template>
  <IPage :HeaderTitle="t('Promotion.Portal')">
    <IPageContent>
      <CardPortalComponent :links="PromotionLinks"></CardPortalComponent>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false" />
  </IPage>
</template>
