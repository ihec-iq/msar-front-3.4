import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import envConfig from "@/api/envConfig";
import axios from "axios";
import { useLocalStorage } from "@/compositions/uselocalStorage";

interface ConfigState {
  organization: string | null;
  connectionString: string | null;
}

export const useConfigStore = defineStore("ConfigStore", () => {
  // State with proper types according to ConfigState interface
  const Config = ref<ConfigState>({
    organization: null,
    connectionString: null,
  });

  /**
   * Store both organization and connection string
   */
  const store = async (config: string, orgName: string): Promise<void> => {
    try {
      await storeConnection(config);
      await storeOrganization(orgName);
    } catch (error) {
      console.error("Error writing configuration:", error);
      throw new Error("Failed to store configuration", { cause: error });
    }
  };

  /**
   * Store connection string in localStorage and update state
   */
  const storeConnection = async (config: string): Promise<void> => {
    try {
      useLocalStorage().set({
        key: "ConnectionString",
        value: config,
        withEncrypt: false,
      });
      Config.value.connectionString = config;
      Api.defaults.baseURL = config + "/api";
    } catch (error) {
      console.error("Error writing connection config:", error);
      throw new Error("Failed to store connection string", { cause: error });
    }
  };

  /**
   * Store organization in localStorage and update state
   */
  const storeOrganization = async (orgName: string): Promise<void> => {
    try {
      useLocalStorage().set({
        key: "Organization",
        value: orgName,
        withEncrypt: false,
      });
      Config.value.organization = orgName;
    } catch (error) {
      console.error("Error writing organization config:", error);
      throw new Error("Failed to store organization", { cause: error });
    }
  };

  /**
   * Check if connection to server is valid
   */
  const checkConnection = async (server: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${server}/check`);
      return (
        response.status === 200 &&
        response.data.state === "ERP MSAR API running..."
      );
    } catch (error) {
      console.error("Connection check failed:", error);
      return false;
    }
  };

  /**
   * Load configuration from localStorage or fallback to defaults
   */
  const load = async (): Promise<void> => {
    try {
      // Must go through useLocalStorage: set() namespaces keys with the app
      // instance id, so localStorage.getItem("ConnectionString") never matched.
      const storage = useLocalStorage();
      const readString = (key: string): string | null => {
        const value = storage.get({ key, withEncrypt: false });
        return typeof value === "string" ? value : null;
      };

      // Load connection string with fallback to environment config
      Config.value.connectionString =
        readString("ConnectionString") || envConfig._baseURL;

      // Load organization
      Config.value.organization = readString("Organization");

      // Initialize API base URL
      if (Config.value.connectionString) {
        Api.defaults.baseURL = Config.value.connectionString + "/api";
      }
    } catch (error) {
      console.error("Error loading configuration:", error);
      throw new Error("Failed to load configuration", { cause: error });
    }
  };

  // Expose store state and actions
  return {
    // Expose state properties
    Config,
    // Actions
    store,
    checkConnection,
    storeConnection,
    storeOrganization,
    load,
  };
});
