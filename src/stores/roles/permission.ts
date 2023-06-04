import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import type IPermission from "@/types/role/IPermission";
export const usePermissionsStore = defineStore("permissionStore", () => {
  const permissionsBase = ref<Array<IPermission>>([]);
  const permissions = ref<Array<IPermission>>([]);
  async function get() {
    if (permissions.value.length < 1) {
      await Api.get("/ho/permission").then((response) => {
        permissions.value = response.data.data;
        permissionsBase.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return { permissions, permissionsBase, get };
});
