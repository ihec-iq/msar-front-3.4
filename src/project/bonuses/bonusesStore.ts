import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IBonuses, IBonusesFilter, IBonusesBonusJobTitle, IBonusesBonusStudy, IBonusesDigreeStage } from "./IBonuses";
import type { IEmployeeLite } from "../employee/IEmployee";

export const useBonusesStore = defineStore("BonusesStore", () => {
  const Bonuses = ref<IBonuses>({
    id: 0,
    title: "",
    issueDate: new Date().toISOString().split("T")[0],
    dateLastBounues: new Date().toISOString().split("T")[0],
    dateLastWorth: new Date().toISOString().split("T")[0],
    dateNextWorth: new Date().toISOString().split("T")[0],
    numberLastBounues: 0,
    Employee: { id: 0, name: "" },
    BonusJobTitle: { id: 0, name: "" },
    BonusStudy: { id: 0, name: "" },
    BonusDigreeStage: { id: 0, name: "" },
    notes: ""
  });

  const Bonusess = ref<Array<IBonuses>>([]);
  const BonusJobTitle = ref<Array<IBonusesBonusJobTitle>>([]);
  const BonusStudy = ref<Array<IBonusesBonusStudy>>([]);
  const BonusDigreeStage = ref<Array<IBonusesDigreeStage>>([]);
  const Employees = ref<Array<IEmployeeLite>>([]);

  const pathBase = "";
  const pathUrl = `${pathBase}/bonuses`;

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const sortedBonusess = computed(() => {
    return [...Bonusess.value].sort((a, b) => a.title.localeCompare(b.title));
  });

  async function fetchData(apiCall: () => Promise<any>, errorMessage: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiCall();
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (err) {
      console.error(`Error in ${errorMessage}:`, err);
      if (err && typeof err === 'object' && 'response' in err) {
        error.value = getError(err as { 
          response: { 
            data: { errors: { [s: string]: unknown } | ArrayLike<unknown> },
            status: any,
            headers: any
          },
          config: { url: any }
        });
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function get() {
    return await fetchData(() => Api.get(`${pathUrl}`), "get");
  }

  async function get_Bonusess() {
    const data = await fetchData(() => Api.get(`${pathUrl}`), "get_Bonusess");
    if (data) Bonusess.value = data;
  }

  function resetData() {
    Bonuses.value = {
      id: 0,
      title: "",
      issueDate: new Date().toISOString().split("T")[0],
      numberLastBounues: 0,
      dateLastBounues: new Date().toISOString().split("T")[0],
      dateLastWorth: new Date().toISOString().split("T")[0],
      dateNextWorth: new Date().toISOString().split("T")[0],
      Employee: { id: 0, name: "" },
      BonusJobTitle: { id: 0, name: "" },
      BonusStudy: { id: 0, name: "" },
      BonusDigreeStage: { id: 0, name: "" },
      notes: ""
    };
  }

  async function get_filter(params: IBonusesFilter, page: number) {
    return await fetchData(() => Api.get(`${pathUrl}/filter?page=${page}`, { params }), "get_filter");
  }

  async function get_BonusJobTitle() {
    const data = await fetchData(() => Api.get(`/bonuses_job_title`), "get_BonusJobTitle");
    if (data) BonusJobTitle.value = data;
  }

  async function get_BonusStudy() {
    const data = await fetchData(() => Api.get(`/bonuses_study`), "get_BonusStudy");
    if (data) BonusStudy.value = data;
  }

  async function get_BonusDigreeStage() {
    const data = await fetchData(() => Api.get(`/bonuses_digree_stage`), "get_BonusDigreeStage");
    if (data) BonusDigreeStage.value = data;
  }

  async function get_Employees() {
    const data = await fetchData(() => Api.get(`/employee/lite`), "get_Employees");
    if (data) Employees.value = data;
  }

  async function store(params: object) {
    return await fetchData(() => Api.post(`${pathUrl}/store`, params), "store");
  }

  async function update(id: number, params: object) {
    return await fetchData(() => Api.post(`${pathUrl}/update/${id}`, params), "update");
  }

  async function show(id: number) {
    return await fetchData(() => Api.get(`${pathUrl}/${id}`), "show");
  }

  async function _delete(id: number) {
    return await fetchData(() => Api.delete(`${pathUrl}/delete/${id}`), "delete");
  }

  return {
    Bonuses,
    resetData,
    BonusJobTitle,
    BonusStudy,
    BonusDigreeStage,
    Bonusess,
    sortedBonusess,
    Employees,
    isLoading,
    error,
    get,
    get_filter,
    get_Bonusess,
    get_BonusJobTitle,
    get_BonusStudy,
    get_BonusDigreeStage,
    get_Employees,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
