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
    timeFrom: new Date().toISOString().split("T")[0],
    timeTo: new Date().toISOString().split("T")[0],
    Vacation: {
      Employee: { id: 0, name: "", section: { id: 0, name: "" }, isPerson: 1 },
      record: 0,
      newRecord: 0,
      oldRecord: 0,
      id: 0,
      sumDaily: 0,
      sumTime: 0,
      sumSick: 0,
    },
    record: 0.5,
  });
  function reset() {
    const currentdate = new Date();
    const datetime =
      currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + "00";
    vacationTime.timeFrom = datetime;

    vacationTime.id = 0;
    vacationTime.record = 0.5;
    vacationTime.date = new Date().toISOString().split("T")[0];

    const recordValue = 0.5 * 60;
    currentdate.setDate(new Date().getTime() + recordValue);

    vacationTime.timeTo =
      currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + "00";
    vacationTime.Vacation = {
      Employee: { id: 0, name: "", section: { id: 0, name: "" }, isPerson: 1 },
      record: 0,
      newRecord: 0,
      oldRecord: 0,
      id: 0,
      sumDaily: 0,
      sumTime: 0,
      sumSick: 0,
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
