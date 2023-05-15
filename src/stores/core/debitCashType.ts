import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useTowPayTypeStore = defineStore("TowPayTypeStore", () => {
  const towPayTypes = ref([]);

  async function get() {
    if (towPayTypes.value.length < 1) {
      await Api.get("/core/pay/type/debit/cash").then((response) => {
        towPayTypes.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return { towPayTypes, get };
});
