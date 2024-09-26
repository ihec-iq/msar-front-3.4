<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { BonusLinks } from "../BonusLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
});
</script>
<template>
  <IPage :HeaderTitle="t('Bonus.Portal')">
    <IPageContent>
      <CardPortalComponent :links="BonusLinks"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>