<script setup lang="ts">
import { Links } from "@/components/fixed/FixedMenu";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionStore } from "@/project/user/permissionStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
//#region nav menu
const { permissions } = storeToRefs(usePermissionStore());
const filteredLinks = computed(() =>
  Links.filter((link) => {
    // Check if any of the link's permissions are included in userPermissions
    if (permissions.value == undefined) return;
    return link.permissions.some((permission) =>
      permissions.value.includes(permission)
    );
  })
); 
//#endregion
</script>
<template>
  <IPage :HeaderTitle="t('Dashboard')">
    <IPageContent>
      <CardPortalComponent :links="filteredLinks"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>
