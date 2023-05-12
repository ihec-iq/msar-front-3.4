import { ref } from "vue";
export default function usePermissions() {
  const permissions = ref<string[]>([]);
  const set = (_permission: string[]) => {
    permissions.value = _permission;
  };
  const can = (name: string) => {
    if (permissions.value.length == 0) return 0;
    if (permissions.value.includes(name)) return 1;
    return 0;
  };
  const canRedirect = (name: string) => {
    if (permissions.value.length == 0) window.location.href = "/unauthorized";
    if (permissions.value.includes(name)) return 1;
    window.location.href = "/unauthorized";
  };
  return { permissions, set, canRedirect, can };
}
