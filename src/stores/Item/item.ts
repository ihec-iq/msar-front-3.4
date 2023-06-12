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
    item_category: { name: "", id: 0 },
    measuring_unit: "",
    itemCategoryId: 0,
  });

  const pathBase = "/storageSys";
  const pathUrl = `${pathBase}/item`;
  async function get(page: number = 1) {
    console.log(`page : ${page}`);
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IItemFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(item_id: number, prams: object) {
    return await Api.put(`${pathUrl}/update/${item_id}`, prams);
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
