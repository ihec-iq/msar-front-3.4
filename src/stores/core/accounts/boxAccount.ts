import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import type IAccount from "@/types/core/IAccount";
export const useBoxStore = defineStore("useBoxStore", () => {
  const boxes = ref<IAccount[]>([]);
  const boxesMini = ref([]);

  async function get(hardRefresh: boolean = false) {
    if (hardRefresh || (boxes.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/account/boxes").then((response) => {
        boxes.value = response.data.data;
      });
    }
  }
  async function getMini(hardRefresh: boolean = false) {
    if (hardRefresh || (boxesMini.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/account/boxes").then((response) => {
        boxesMini.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return {
    boxes,
    get,
    boxesMini,
    getMini,
  };
});
