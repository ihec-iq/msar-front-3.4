<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { BackupLinks } from "../BackupLinks";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowBackups]);
});
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Portal')">
    <IPageContent>
      <CardPortalComponent
        :links="BackupLinks[0].children"
      ></CardPortalComponent>
    </IPageContent>
    <template #Footer>
      <IFooterCrud
        :show-add="false"
        :show-update="false"
        :show-delete="false"
      />
    </template>
  </IPage>
</template>
