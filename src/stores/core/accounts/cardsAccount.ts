import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useCardsStore = defineStore("useCardsStore", () => {
  const cards = ref([]);
  const cardsMini = ref([]);

  async function get(hardRefresh: boolean = false) {
    if (hardRefresh || (cards.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/account/agents").then((response) => {
        cards.value = response.data.data;
      });
    }
  }
  async function getCardsMini(hardRefresh: boolean = false) {
    if (hardRefresh || (cardsMini.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/account/agents/mini").then((response) => {
        cardsMini.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return {
    cards,
    get,
    cardsMini,
    getCardsMini,
  };
});
