import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const usePayTypeStore = defineStore("usePayTypeStore", () => {
  const payType = ref([]);

  async function get() {
    if (payType.value.length < 1) {
      await Api.get("/core/pay/type").then((response) => {
        payType.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return { payType, get };
});
