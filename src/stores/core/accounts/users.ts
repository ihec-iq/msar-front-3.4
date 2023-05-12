import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useUserStore = defineStore("userStore", () => {
  const users = ref([]);
  const usersMini = ref([]);
  async function get() {
    if (users.value.length < 1) {
      await Api.get("/core/user/ho").then((response) => {
        users.value = response.data.data;
      });
    }
  }
  async function getMini(hardRefresh: boolean = false) {
    if (hardRefresh || (usersMini.value.length < 1 && hardRefresh == false)) {
      await Api.get("/core/user/mini").then((response) => {
        usersMini.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await getMini();
  });
  return {
    users,
    get,
    usersMini,
    getMini,
  };
});
