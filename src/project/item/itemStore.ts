import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IItem, IItemFilter } from "@/project/item/IItem";

export const useItemStore = defineStore("itemStore", () => {
  const item = ref<IItem>({
    id: 0,
    name: "",
    description: "",
    code: "",
    Category: { name: "", id: 0 },
    measuringUnit: "",
  });
  const items = ref<Array<IItem>>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/item`;
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  function resetData() {
    item.value = {
      id: 0,
      name: "",
      description: "",
      code: "",
      Category: { name: "", id: 0 },
      measuringUnit: "",
    };
  }
  async function get_items() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          items.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get stocks : " + errors);
      });
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
    items,
    get,
    get_filter,
    resetData,
    get_items,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
