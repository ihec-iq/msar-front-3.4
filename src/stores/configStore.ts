import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import envConfig from "@/api/envConfig";
import axios from "axios";

interface ConfigState {
  organization: string | null;
  connectionString: string | null;
}

export const useConfigStore = defineStore("ConfigStore", () => {
  // State with proper types according to ConfigState interface
  const Config = ref<ConfigState>({
    organization: null,
    connectionString: null
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
      throw new Error("Failed to store configuration");
    }
  };

  /**
   * Store connection string in localStorage and update state
   */
  const storeConnection = async (config: string): Promise<void> => {
    try {
      localStorage.setItem("ConnectionString", config);
      Config.value.connectionString = config;
      Api.defaults.baseURL = config;
    } catch (error) {
      console.error("Error writing connection config:", error);
      throw new Error("Failed to store connection string");
    }
  };

  /**
   * Store organization in localStorage and update state
   */
  const storeOrganization = async (orgName: string): Promise<void> => {
    try {
      localStorage.setItem("Organization", orgName);
      Config.value.organization = orgName;
    } catch (error) {
      console.error("Error writing organization config:", error);
      throw new Error("Failed to store organization");
    }
  };

  /**
   * Check if connection to server is valid
   */
  const checkConnection = async (server: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${server}/check`);
      return response.status === 200 && response.data.state === "ERP MSAR API running...";
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
      // Load connection string with fallback to environment config
      const storedUrl = localStorage.getItem("ConnectionString");
      Config.value.connectionString = storedUrl || envConfig._baseURL;
      
      // Load organization
      Config.value.organization = localStorage.getItem("Organization");
      
      // Initialize API base URL
      if (Config.value.connectionString) {
        Api.defaults.baseURL = Config.value.connectionString;
      }
    } catch (error) {
      console.error("Error loading configuration:", error);
      throw new Error("Failed to load configuration");
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
