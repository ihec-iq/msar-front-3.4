import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IUser from "@/types/core/IUser";

export const useUserStore = defineStore("userStore", () => {
  const user = reactive<IUser>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    active: 0,
    any_device: 0,
    roles: [],
    permissions: [],
    id: 0,
    last_login: "",
  });
  async function get(params: object) {
    return await Api.get(`/user`, { params: params });
  }
  async function show(id: number) {
    return await Api.get(`/user/${id}`);
  }
  async function store(prams: object) {
    return await Api.post(`/user`, prams);
  }
  async function update(prams: object, id: number) {
    return await Api.post(`/user/${id}`, prams);
  }
  async function _delete(id: number) {
    return await Api.delete(`/user/delete/${id}`);
  }
  return { user, get, _delete, store, update, show, getError };
});
