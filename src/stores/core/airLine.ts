import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useAirLineStore = defineStore("airLineStore", () => {
  const airLines = ref([]);

  async function get() {
    if (airLines.value.length < 1) {
      await Api.get("/ho/accessory/airline/codes").then((response) => {
        airLines.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return { airLines, get };
});
