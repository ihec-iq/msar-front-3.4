import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IStock } from "./IStock";

export const useStockStore = defineStore("StockStore", () => {
  const stock = reactive<IStock>({
    id: 0,
    name: "",
  });

  const stocks = ref<IStock[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/stock`;
  async function get_stocks() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          stocks.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get stocks : " + errors);
      });
  }
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/show/${id}`);
  }
  const store = async (payload: object) => {
    await Api.post(`${pathUrl}/store`, payload);
  };
  const update = async (id: number, payload: object ) => {
    await Api.post(`${pathUrl}/update/${id}`, payload);
  };
  const _delete = async (id: number) => {
    await Api.delete(`${pathUrl}/destroy/${id}`);
  };


  function resetData() {
    stock.id = 0;
    stock.name = "";
  }
  return {
    stock,
    stocks,
    get_stocks,
    get,
    show,
    getError,
    resetData,
    store,
    update,
    _delete,
  };
});
