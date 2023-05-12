import { useAuthStore } from "@/stores/auth";
import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";

export const usePermissionStore = defineStore("PermissionStore", () => {
  const authStore = useAuthStore();
  const permissions = ref<string[]>([]);
  //const doubleCount = computed(() => count.value * 2);
  const can = (name: string) => {
    if (permissions.value?.length == 0) return 0;
    if (permissions.value?.includes(name)) return 1;
    return 0;
  };
  const checkPermissionAccess = (name: string) => {
    if (permissions.value?.length == 0) window.location.href = "/unauthorized";
    if (permissions.value?.includes(name)) return 1;
    window.location.href = "/unauthorized";
  };
  const canRedirect = (name: string) => {
    if (permissions.value?.length == 0) window.location.href = "/unauthorized";
    if (permissions.value?.includes(name)) return 1;
    window.location.href = "/unauthorized";
  };
  const setPermissions = (_permission: string[]) => {
    permissions.value = _permission;
  };
  onMounted(() => {
    // console.log("usePermissionStore");
    // permissions.value = authStore.user.permissions;
  });
  return {
    permissions,
    can,
    canRedirect,
    checkPermissionAccess,
    setPermissions,
  };
});
