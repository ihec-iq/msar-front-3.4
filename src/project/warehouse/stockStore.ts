import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
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

  function resetData() {
    stock.id = 0;
    stock.name = "";
  }
  return {
    stock,
    stocks,
    get_stocks,
    getError,
    resetData,
  };
});
