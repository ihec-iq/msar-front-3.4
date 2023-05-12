import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useSupplierStore = defineStore("useSupplierStore", () => {
  const suppliers = ref([]);
  const suppliersMini = ref([]);
  async function get() {
    if (suppliers.value.length < 1) {
      await Api.get("/core/account/suppliers").then((response) => {
        suppliers.value = response.data.data;
      });
    }
  }
  async function getSuppliersMini(hardRefresh: boolean = false) {
    if (
      hardRefresh ||
      (suppliersMini.value.length < 1 && hardRefresh == false)
    ) {
      await Api.get("/core/account/suppliers/mini").then((response) => {
        suppliersMini.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return {
    suppliers,
    get,
    suppliersMini,
    getSuppliersMini,
  };
});
