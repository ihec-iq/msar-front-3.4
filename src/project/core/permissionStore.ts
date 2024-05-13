import { onMounted, ref } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import Api from "@/api/apiConfig";
import type IPermission from "../role/IPermission";

export const usePermissionsStore = defineStore("PermissionStore", () => {
  const permissions = ref<IPermission[]>([]);
  const permissionsBase = ref<IPermission[]>([]);
  const UserPermissions = ref<Array<string>>([]);
  async function get() {
    if (permissions.value.length < 1) {
      console.log('Get Permssions from DB')
      await Api.get("/permission").then((response) => {
        permissions.value = response.data.data;
        permissionsBase.value = response.data.data;
      });
    }
  }


  //const doubleCount = computed(() => count.value * 2);
  const can = (name: string) => {
    if (UserPermissions.value?.length == 0) return 0;
    if (UserPermissions.value?.includes(name)) return 1;
    return 0;
  };
  const checkPermissionAccess = (name: string) => {
    if (UserPermissions.value?.length == 0) router.push("/unauthorized");
    if (UserPermissions.value?.includes(name)) return 1;
    router.push("/unauthorized");
  };
  const checkPermissionAccessArray = (names: string[]) => {
    if (UserPermissions.value?.length == 0) router.push("/unauthorized");
    if (hasCommonItems(names, UserPermissions.value)) return true;
    router.push("/unauthorized");
  };
  function hasCommonItems(subArray: string[], array: string[]): boolean {
    return subArray.some((subItem) =>
      array.some((item) => item.toLowerCase() === subItem.toLowerCase())
    );
  }
  const canRedirect = (name: string) => {
    if (UserPermissions.value?.length == 0) router.push("/unauthorized");
    if (UserPermissions.value?.includes(name)) return 1;
    router.push("/unauthorized");
  };
  const setPermissions = (_permission: string[]) => {
    UserPermissions.value = _permission;
  };
  return {
    permissions,
    permissionsBase,
    UserPermissions,
    get,
    can,
    canRedirect,
    checkPermissionAccess,
    checkPermissionAccessArray,
    setPermissions,
  };
});
