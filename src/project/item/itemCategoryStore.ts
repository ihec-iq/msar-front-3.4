import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IItemCategory, IItemCategoryFilter } from "@/project/item/IItem";

export const useItemCategoryStore = defineStore("itemCategoryStore", () => {
  const category = reactive<IItemCategory>({
    id: 0,
    name: "",
  });
  const categories = ref<IItemCategory[]>([]);

  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/itemCategory`;
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function getFast() {
    return await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          categories.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Categories : " + errors);
      });
  }

  function resetData() {
    category.id = 0;
    category.name = "";
    category.description = "";
  }

  async function get_filter(params: IItemCategoryFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(item_id: number, prams: object) {
    return await Api.post(`${pathUrl}/update/${item_id}`, prams);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  return {
    category,
    categories,
    resetData,
    get,
    getFast,
    get_filter,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
