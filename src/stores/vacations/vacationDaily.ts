import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IVacationDaily,
  IVacationDailyFilter,
} from "@/types/vacation/IVacationDaily";

export const useVacationDailyStore = defineStore("vacationDailyStore", () => {
  const vacationDaily = reactive<IVacationDaily>({
    id: 0,
    dayFrom: new Date().toISOString().split("T")[0],
    dayTo: new Date().toISOString().split("T")[0],
    Employee: { id: 0, name: "", section: { id: 0, name: "" }, isPerson: 1 },
    record: 0,
  });

  const pathBase = "/vacationSys";
  const pathUrl = `${pathBase}/vacationDaily`;
  async function get(page: number = 1) {
    console.log(`page : ${page}`);
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IVacationDailyFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }

  async function update(archive_id: number, prams: object) {
    return await Api.post(`${pathUrl}/update/${archive_id}`, prams);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }

  return {
    vacationDaily,
    get,
    get_filter,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
