import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IVacationTime,
  IVacationTimeFilter,
} from "@/project/vacation/vacationTime/IVacationTime";

export const useVacationTimeStore = defineStore("vacationTimeStore", () => {
  const vacationTime = reactive<IVacationTime>({
    id: 0,
    date: new Date().toISOString().split("T")[0],
    timeFrom: new Date().toLocaleTimeString(),
    timeTo: new Date().toLocaleTimeString(),
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
        Position: {
          id: 0,
          name: "",
          level: "",
          code: ""
        },
        Type: {
          id: 0,
          name: ""
        }
      },
      record: 0, 
      id: 0, 
      recordSick: 0,
      deservedRecord: 0,
      totalTaken: 0,
      remaining: 0,
      currentYearVacations: 0,
      currentYearTimeVacations: 0,
      currentYearDailyVacations: 0,
      deservedSickRecord: 0,
      takenSick: 0,
      remainingSick: 0,
      currentYearSickVacations: 0
    },
    record: 0.5,
    Reason: {
      id: 0,
      name: "",
    },
  });
  const addHours = (Hour: number = 0.5, _date: string = "") => {
    if (_date == "")
      _date = new Date().toISOString().split("T")[0] + " 08:00:00";
    const currentDate = new Date(_date);
    currentDate.setTime(currentDate.getTime() + Hour * 60 * 60 * 1000);
    const dateTimeTo =
      ("0" + currentDate.getHours()).slice(-2) +
      ":" +
      ("0" + currentDate.getMinutes()).slice(-2) +
      ":" +
      "00";
    return dateTimeTo;
  };
  function resetData() {
    vacationTime.timeFrom = addHours();
    vacationTime.record = 0.5;
    vacationTime.timeTo = addHours(vacationTime.record);
    vacationTime.id = 0;
    vacationTime.date = new Date().toISOString().split("T")[0];
    vacationTime.Vacation = {
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
        Position: {
          id: 0,
          name: "",
          level: "",
          code: ""
        },
        Type: {
          id: 0,
          name: ""
        }
      },
      record: 0,
      id: 0,
      recordSick: 0,
      deservedRecord: 0,
      totalTaken: 0,
      remaining: 0,
      currentYearVacations: 0,
      currentYearTimeVacations: 0,
      currentYearDailyVacations: 0,
      deservedSickRecord: 0,
      takenSick: 0,
      remainingSick: 0,
      currentYearSickVacations: 0
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
    resetData,
    get,
    get_filter,
    show,
    store,
    update,
    getError,
    _delete,
    addHours,
  };
});
