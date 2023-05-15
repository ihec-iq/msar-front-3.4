import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import type IAccount from "@/types/core/IAccount";
export const useAgentsStore = defineStore("useAgentsStore", () => {
  const agents = ref<Array<IAccount>>([]);
  const agentsMini = ref([]);

  async function get(hardRefresh: boolean = false) {
    if (hardRefresh || (agents.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/account/agents").then((response) => {
        agents.value = response.data.data;
      });
    }
  }
  async function getAgentsMini(hardRefresh: boolean = false) {
    if (hardRefresh || (agentsMini.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/account/agents/mini").then((response) => {
        agentsMini.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    // await get();
    await getAgentsMini();
  });
  return {
    agents,
    get,
    agentsMini,
    getAgentsMini,
  };
});
