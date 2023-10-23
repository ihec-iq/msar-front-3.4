import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IVacationTime,
  IVacationTimeFilter,
} from "@/types/vacation/IVacationTime";

export const useVacationTimeStore = defineStore("vacationTimeStore", () => {
  const vacationTime = reactive<IVacationTime>({
    id: 0,
    date: new Date().toISOString().split("T")[0],
    dayFrom: new Date().toISOString().split("T")[0],
    dayTo: new Date().toISOString().split("T")[0],
    Employee: { id: 0, name: "", section: { id: 0, name: "" }, isPerson: 1 },
    record: 0,
  });
  function reset() {
    vacationTime.id = 0;
    vacationTime.record = 1;
    vacationTime.date = new Date().toISOString().split("T")[0];
    vacationTime.dayFrom = new Date().toISOString().split("T")[0];
    const d = new Date(vacationTime.dayFrom);
    d.setDate(d.getDate() + vacationTime.record);
    vacationTime.dayTo = d.toISOString().split("T")[0];
    vacationTime.Employee = {
      id: 0,
      name: "",
      section: { id: 0, name: "" },
      isPerson: 1,
    };
  }
  const pathBase = "/vacationSys";
  const pathUrl = `${pathBase}/vacationTime`;
  async function get(page: number = 1) {
    console.log(`page : ${page}`);
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IVacationTimeFilter, page: number) {
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
    vacationTime,
    reset,
    get,
    get_filter,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
