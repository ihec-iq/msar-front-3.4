import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { DefaultURL } from "@/utils/defualts";

export const useConfigStore = defineStore("ConfigStore", () => {
  const ConnectionString = ref<string | null>("");
  const store = async (config: string) => {
    if (ConnectionString.value) {
      try {
        await localStorage.setItem("ConnectionString", config);
        ConnectionString.value = config;
        Api.defaults.baseURL = String(ConnectionString.value);
      } catch (error) {
        console.error("Error writing  file:", error);
      }
    } else {
      console.log("save Config failed");
    }
  };
  const load = async () => {
    try {
      const URL = ref(await localStorage.getItem("ConnectionString"));
      if (URL.value == "" || URL.value == undefined || URL.value == null)
        URL.value = DefaultURL;
      ConnectionString.value = URL.value;
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return { ConnectionString, store, load };
});
