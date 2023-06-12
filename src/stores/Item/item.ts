import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IItem, IItemFilter } from "@/types/IItem";

export const useItemStore = defineStore("itemStore", () => {
  const item = reactive<IItem>({
    id: 0,
    name: "",
    description: "",
    code: "",
    itemCategory: { name: "", id: 0 },
    measuringUnit: "",
    itemCategoryId: 0,
  });

  const pathBase = "/storageSys";
  const pathUrl = `${pathBase}/item`;
  async function get(page: number = 1) {
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IItemFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(item_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${item_id}`, params);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  return {
    item,
    get,
    get_filter,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
