import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import type { ISetting } from "./ISetting"; // Import the updated ISetting interface

export const useSettingStore = defineStore("SettingStore", () => {
  const Settings = ref<Array<ISetting>>([]);
  const Setting = ref<ISetting>({
    Id: 0,
    Key: "",
    Value1: "",
    Value2: "",
    Value3: "",
    Value4: "",
    Description: "",
    IsActive: false
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pathBase = "";
  const pathUrl = `${pathBase}/setting`;
  const sortedSettings = computed(() => {
    return [...Settings.value].sort((a, b) => a.Key.localeCompare(b.Key));
  });
  const reset = () => {
    Setting.value = {
      Id: 0,
      Key: "",
      Description: "",
      Value1: "",
      Value2: "",
      Value3: "",
      Value4: "",
      IsActive: false
    };
  }
  async function getSettings() {
    isLoading.value = true;
    try {
      const response = await Api.get(pathUrl);
      if (response.status === 200) {
        Settings.value = response.data.data;
      }
    } catch (err: any) { // Specify 'err' as type 'any'
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function store(newSetting: ISetting) {
    isLoading.value = true;
    try {
      const response = await Api.post(`${pathUrl}/store`, newSetting);
      if (response.status === 201 || response.status === 200) {
        Settings.value.push(response.data.data);
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(id: string, updatedSetting: any) {
    isLoading.value = true;
    try {
      const response = await Api.post(`${pathUrl}/update/${id}`, updatedSetting);
      if (response.status === 200) {
        const index = Settings.value.findIndex(setting => setting.Id === updatedSetting.Id);
        if (index !== -1) {
          Settings.value[index] = response.data.data;
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
    return Promise<null>
  }

  async function show(id: string) {
    isLoading.value = true;
    try {
      const response = await Api.get(`${pathUrl}/${id}`);
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    Settings,
    Setting,
    sortedSettings,
    isLoading,
    error,
    getSettings,
    store,
    update,
    show,
  };
});
