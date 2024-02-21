import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IVacationSick,
  IVacationSickFilter,
} from "@/types/vacation/IVacationSick";

export const useVacationSickStore = defineStore("vacationSickStore", () => {
  const vacationSick = reactive<IVacationSick>({
    id: 0,
    dayFrom: new Date().toISOString().split("T")[0],
    dayTo: new Date().toISOString().split("T")[0],
    Vacation: {
      Employee: {
        id: 0,
        name: "",
        Section: { id: 0, name: "" },
        isPerson: 1,
        dateWork: "",
        number: "",
        idCard: "",
        initVacation: 0,
        takeVacation: 0,
        initVacationSick: 0,
        takeVacationSick: 0,
      },
      record: 0,
      newRecord: 0,
      oldRecord: 0,
      id: 0,
      sumDaily: 0,
      sumTime: 0,
      sumSick: 0,
      oldRecordSick: 0,
      newRecordSick: 0,
      recordSick: 0,
    },
    record: 0,
    Reason: {
      id: 1,
      name: "",
    },
  });
  function resetData() {
    vacationSick.id = 0;
    vacationSick.record = 1;
    vacationSick.dayFrom = new Date().toISOString().split("T")[0];
    const d = new Date(vacationSick.dayFrom);
    d.setDate(d.getDate() + vacationSick.record);
    vacationSick.dayTo = d.toISOString().split("T")[0];

    vacationSick.Vacation = {
      Employee: {
        id: 0,
        name: "",
        Section: { id: 0, name: "" },
        isPerson: 1,
        dateWork: "",
        number: "",
        idCard: "",
        initVacation: 0,
        takeVacation: 0,
        initVacationSick: 0,
        takeVacationSick: 0,
      },
      record: 0,
      newRecord: 0,
      oldRecord: 0,
      id: 0,
      sumDaily: 0,
      sumTime: 0,
      sumSick: 0,
      oldRecordSick: 0,
      newRecordSick: 0,
      recordSick: 0,
    };
  }
  const pathBase = "/vacationSys";
  const pathUrl = `${pathBase}/vacationSick`;
  async function get(page: number = 1) {
    console.log(`page : ${page}`);
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IVacationSickFilter, page: number) {
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
    vacationSick,
    resetData,
    get,
    get_filter,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
