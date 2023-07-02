import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IRole from "@/types/role/IRole";
export const useRoleStore = defineStore("roleStore", () => {
  const role = ref<IRole>({
    id: 0,
    name: "",
    permissions: [],
  });
  async function get() {
    return await Api.get(`/ho/role`);
  }
  async function store(prams: object) {
    return await Api.post(`/ho/role`, prams);
  }
  async function show(id: number) {
    return await Api.get(`/ho/role/${id}`);
  }
  async function update(prams: object, id: number) {
    return await Api.post(`/ho/role/${id}`, prams);
  }
  async function _delete(id: number) {
    return await Api.delete(`/ho/role/${id}`);
  }
  return { role, get, store, update, _delete, show, getError };
});
