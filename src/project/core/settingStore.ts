import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import type { ISetting } from "./ISetting"; // Import the updated ISetting interface

export const useSettingStore = defineStore("SettingStore", () => {
  const Settings = ref<Array<ISetting>>([]);
  const Setting = ref<ISetting>({
    id: 0,
    key: "",
    valStr: "",
    valStr2: "",
    valBool: false,
    valDate: "",
    valInt:0,
    valDbl:0,
    description: "",
    isActive: false
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pathBase = "";
  const pathUrl = `${pathBase}/setting`;
  const sortedSettings = computed(() => {
    return [...Settings.value].sort((a, b) => a.key.localeCompare(b.key));
  });

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
    let response;
    try {
      response = await Api.post(`${pathUrl}/update/${id}`, updatedSetting);
      if (response.status === 200) {
        const index = Settings.value.findIndex(setting => setting.id === updatedSetting.Id);
        if (index !== -1) {
          Settings.value[index] = response.data.data;
        }
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
      return response;
    }
  }
  async function updateByKey(setting : any , id : string) {
    isLoading.value = true;
    let response;
    try {
      response = await Api.post(`${pathUrl}/update/`+id,  setting  );
      if (response.status === 200) {
        const index = Settings.value.findIndex(seting => seting.key === setting.key);
        if (index !== -1) {
          Settings.value[index] = response.data.data;
        }
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
      return response;
    }
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
  async function showByKey(key: string) {
    isLoading.value = true;
    try {
      const response = await Api.get(`${pathUrl}/show/key`, { params: { key: key } });
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
    updateByKey,
    show,
    showByKey
  };
});
