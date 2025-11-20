<script setup lang="ts">
import { Links } from "@/components/fixed/FixedMenu";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
// import { useAuthStore } from "@/stores/authStore";
// import router from "@/router";
// import { EnumPermission } from "@/utilities/EnumSystem";
//#region nav menu
const { UserPermissions } = storeToRefs(usePermissionsStore());
const filteredLinks = computed(() =>
  Links.filter((link) => {
    // Check if any of the link's permissions are included in userPermissions
    if (UserPermissions.value == undefined) return;
    return link.permissions.some((permission) =>
      UserPermissions.value.includes(permission)
    );
  })
);
//#endregion

const { checkPermissionAccessArray } = usePermissionsStore();

onMounted(() => {
  // checkPermissionAccessArray([EnumPermission.Home]);
});
</script>
<template>
  <IPage :HeaderTitle="t('Home')">
    <IPageContent>
      <CardPortalComponent :links="filteredLinks"></CardPortalComponent>
    </IPageContent>
  </IPage>
</template>
