import { ref } from "vue";
import { defineStore } from "pinia";
import router from "@/router";

export const usePermissionStore = defineStore("PermissionStore", () => {
  const permissions = ref<string[]>([]);
  //const doubleCount = computed(() => count.value * 2);
  const can = (name: string) => {
    if (permissions.value?.length == 0) return 0;
    if (permissions.value?.includes(name)) return 1;
    return 0;
  };
  const checkPermissionAccess = (name: string) => {
    if (permissions.value?.length == 0) router.push("/unauthorized");
    if (permissions.value?.includes(name)) return 1;
    router.push("/unauthorized");
  };
  const checkPermissionAccessArray = (names: string[]) => {
    if (permissions.value?.length == 0) router.push("/unauthorized");
    if (hasCommonItems(names, permissions.value)) return true;
    router.push("/unauthorized");
  };
  function hasCommonItems(subArray: string[], array: string[]): boolean {
    return subArray.some((subItem) =>
      array.some((item) => item.toLowerCase() === subItem.toLowerCase())
    );
  }
  const canRedirect = (name: string) => {
    if (permissions.value?.length == 0) router.push("/unauthorized");
    if (permissions.value?.includes(name)) return 1;
    router.push("/unauthorized");
  };
  const setPermissions = (_permission: string[]) => {
    permissions.value = _permission;
  };
  return {
    permissions,
    can,
    canRedirect,
    checkPermissionAccess,
    checkPermissionAccessArray,
    setPermissions,
  };
});
