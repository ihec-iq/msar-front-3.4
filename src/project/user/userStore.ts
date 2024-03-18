import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IUser } from "./IUser";

export const useUserStore = defineStore("userStore", () => {
  const user = reactive<IUser>({
    id: 0,
    name: "",
    user_name: "",
    email: "",
    phone: "",
    code: "",
    created: "",
    expire_date: "",
    roles: [],
    permissions: [],
  });
  const pathUrl = "/user";
  async function get(params: object) {
    return await Api.get(`${pathUrl}`, { params: params });
  }
   async function get_lite() {
    return await Api.get(`${pathUrl}/get_lite`);
  }
  async function get_filter(params: object, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function profile() {
    return await Api.get(`${pathUrl}/profile`);
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}`, prams);
  }
  async function update(prams: object, id: number) {
    return await Api.post(`${pathUrl}/${id}`, prams);
  }
  async function updateMyPasspord(prams: object) {
    return await Api.post(`${pathUrl}/update/MyPassword`, prams);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  return {
    user,
    get,
    get_lite,
    get_filter,
    _delete,
    store,
    update,
    updateMyPasspord,
    show,
    getError,
    profile,
  };
});
