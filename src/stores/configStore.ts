import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { DefaultURL } from "@/utilities/defualts";

export const useConfigStore = defineStore("ConfigStore", () => {
  const Organization = ref<string | null>("");
  const ConnectionString = ref<string | null>("");

  const store = async (config: string, organization: string) => {
    try {
      await localStorage.setItem("ConnectionString", config);
      ConnectionString.value = config;
      await localStorage.setItem("Organization", organization);
      Organization.value = organization;
      Api.defaults.baseURL = String(ConnectionString.value);
    } catch (error) {
      console.error("Error writing connection config:", error);
    }
  };

  const storeConnection = async (config: string) => {
    if (ConnectionString.value) {
      try {
        await localStorage.setItem("ConnectionString", config);
        ConnectionString.value = config;

        Api.defaults.baseURL = String(ConnectionString.value);
      } catch (error) {
        console.error("Error writing connection config:", error);
      }
    } else {
      console.log("save Config failed");
    }
  };

  async function checkConnection(server: string) {
    return await new Promise((resolve, reject) => {
       Api.get(server+"/check")
      .then((response) => {
        if (response.status == 200) {
          if (response.status == 200) {
            if (response.data.state == "ERP MSAR API running...") {
              resolve(true);
            }
            resolve(false);
          }
        }
      })
      .catch((errors) => {
        console.log("in checkConnection : " + errors);
        resolve(false);
      });
    });
  }

  const storeOrganization = async (organization: string) => {
    if (Organization.value) {
      try {
        await localStorage.setItem("Organization", organization);
        Organization.value = organization;
      } catch (error) {
        console.error("Error writing organization config:", error);
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
      Organization.value = localStorage.getItem("Organization");
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return {
    ConnectionString,
    Organization,
    store,
    checkConnection,
    storeConnection,
    storeOrganization,
    load,
  };
});
