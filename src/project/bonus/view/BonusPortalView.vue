<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { BonusLinks } from "../BonusLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";
import IRow2 from "@/components/ihec/IRow2.vue";

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
});
</script>
<template>
  <IPage :HeaderTitle="t('Bonus.Portal')">
    <IPageContent>
      <IRow2 :gap="2"  > 
         <CardPortalComponent :links="BonusLinks"></CardPortalComponent>
      </IRow2>
    </IPageContent>
  </IPage>
</template>