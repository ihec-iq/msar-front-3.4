import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useCurrencyStore = defineStore("useCurrencyStore", () => {
  const currencies = ref([]);
  async function get() {
    if (currencies.value.length < 1) {
      await Api.get("/core/currency").then((response) => {
        currencies.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return { currencies, get };
});
