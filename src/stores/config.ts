import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";

export const useConfigStore = defineStore("ConfigStore", () => {
  const ConnectionString = ref<string | null>("");
  const store = async (config: string) => {
    if (ConnectionString.value) {
      try {
        await localStorage.setItem("ConnectionString", config);
        ConnectionString.value = config;
        Api.defaults.baseURL = String(ConnectionString.value);
        console.log("Config Saved Successfully");
      } catch (error) {
        console.error("Error writing  file:", error);
      }
    } else {
      console.log("save Config failed");
    }
  };
  const load = async () => {
    try {
      ConnectionString.value = await localStorage.getItem("ConnectionString");
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return { ConnectionString, store, load };
});
