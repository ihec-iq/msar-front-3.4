import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IRole from "@/types/role/IRole";
export const useRoleStore = defineStore("roleStore", () => {
  const roles = ref([]);
  const role = ref<IRole>({
    id: 0,
    name: "",
    permissions: [],
  });
  async function getRole() {
    if (roles.value.length < 1) {
      await Api.get("/role").then((response) => {
        roles.value = response.data.data;
      });
    }
  }
  async function get() {
    return await Api.get(`/role`);
  }
  async function store(prams: object) {
    return await Api.post(`/role`, prams);
  }
  async function show(id: number) {
    return await Api.get(`/role/${id}`);
  }
  async function update(prams: object, id: number) {
    return await Api.post(`/role/${id}`, prams);
  }
  async function _delete(id: number) {
    return await Api.delete(`/role/${id}`);
  }
  return { role, roles, getRole, get, store, update, _delete, show, getError };
});
