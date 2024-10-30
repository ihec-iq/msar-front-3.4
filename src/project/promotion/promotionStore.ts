import { defineStore } from 'pinia';
import { ref } from 'vue';
import Api from "@/api/apiConfig"; // Assuming you have a similar API setup
import type { IPromotion, IPromotionFilter } from './IPromotion';

export const usePromotionStore = defineStore('promotion', () => {
  const promotions = ref<Array<IPromotion>>([]);
  const promotion = ref<IPromotion>({
    id: 0,
    Employee: { id: 0, name: "" },
    numberPromotion: "",
    issueDate: new Date().toISOString().split("T")[0],
    note: "",
    BonusDegreeStage: { id: 0, title: "", Degree: { id: 0, name: "" }, Stage: { id: 0, name: "" }, salery: 0, yearlyBonus: 0, yearlyService: 0 },
    BonusJobTitle: { id: 0, name: "", description: "" },
  });
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function get() {
    isLoading.value = true;
    try {
      const response = await Api.get('/promotions');
      if (response.status === 200) {
        promotions.value = response.data.data;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
    const resetData = () => {
        promotion.value = {
            id: 0,
            issueDate: new Date().toISOString().split("T")[0],
            numberPromotion: "",
            Employee: { id: 0, name: "" },
            BonusJobTitle: { id: 0, name: "", description: "" },
            BonusDegreeStage: { id: 0, title: "", Degree: { id: 0, name: "" }, Stage: { id: 0, name: "" }, salery: 0, yearlyBonus: 0, yearlyService: 0 },
            note: ""
        };
    }
    const pathBase = "";
    const pathUrl = `${pathBase}/promotion`;
    const pathEmployeeUrl = `${pathBase}/employee`;
    async function get_filter(params: IPromotionFilter, page: number) {
        return await Api.get(`${pathUrl}/filter?page=${page}`, { params });
    }
    async function get_checkPromotion(params: IPromotionFilter, page: number) {
        return await Api.get(`${pathEmployeeUrl}/promotion/check?page=${page}`, { params });
    }
    async function calculatePromotion(params: IPromotionFilter) {
        return await Api.get(`${pathEmployeeUrl}/promotion/calculate`, { params });
    }


  async function store(params: object) {
    isLoading.value = true;
    try {
      await Api.post('/promotions/store', params);
      await get(); // Refresh the list after storing
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(id: number, params: object) {
    isLoading.value = true;
    try {
      await Api.post(`/promotions/update/${id}`, params);
      await get(); // Refresh the list after updating
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function _delete(id: number) {
    isLoading.value = true;
    try {
      await Api.delete(`/promotions/delete/${id}`);
      await get(); // Refresh the list after deletion
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function show(id: number) {
    isLoading.value = true;
    try {
      const response = await Api.get(`/promotions/${id}`);
      return response.data; // Return the promotion details
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    promotions,
    isLoading,
    error,
    promotion,
    resetData,
    get,
    get_filter,
    get_checkPromotion,
    calculatePromotion,
    store,
    update,
    _delete,
    show,
  };
}); 