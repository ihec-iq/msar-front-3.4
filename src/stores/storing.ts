import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IStore, IStoreFilter, IStoreItemFilter } from "@/types/IStore";

export const useStoringStore = defineStore("StoringStore", () => {
  const stores = ref<IStore[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/store`;
  async function get_store() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          stores.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get stocks : " + errors);
      });
  }
  async function get_filter(params: IStoreFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function get_summation(params: IStoreFilter, page: number) {
    return await Api.get(`${pathUrl}/summation?page=${page}`, {
      params: params,
    });
  }
  async function get_item(params: IStoreItemFilter, page: number) {
    return await Api.get(
      `${pathUrl}/item/history/${params.itemId}?page=${page}`,
      {
        params: params,
      }
    );
  }
  return {
    stores,
    get_store,
    get_filter,
    get_item,
    get_summation,
    getError,
  };
});
