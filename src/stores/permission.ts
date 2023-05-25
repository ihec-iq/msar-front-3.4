import { ref } from "vue";
import { defineStore } from "pinia";
import type IPermission from "@/types/role/IPermission";

export const usePermissionStore = defineStore("PermissionStore", () => {
  const permissions = ref<IPermission[]>([]);
  //const doubleCount = computed(() => count.value * 2);
  const can = (name: IPermission) => {
    if (permissions.value?.length == 0) return 0;
    if (permissions.value?.includes(name)) return 1;
    return 0;
  };
  const checkPermissionAccess = (name: IPermission) => {
    if (permissions.value?.length == 0) window.location.href = "/unauthorized";
    if (permissions.value?.includes(name)) return 1;
    window.location.href = "/unauthorized";
  };
  const canRedirect = (name: IPermission) => {
    if (permissions.value?.length == 0) window.location.href = "/unauthorized";
    if (permissions.value?.includes(name)) return 1;
    window.location.href = "/unauthorized";
  };
  const setPermissions = (_permission: IPermission[]) => {
    permissions.value = _permission;
  };
  return {
    permissions,
    can,
    canRedirect,
    checkPermissionAccess,
    setPermissions,
  };
});
