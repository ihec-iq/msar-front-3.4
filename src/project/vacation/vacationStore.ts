import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IVacation, IVacationFilter } from "@/project/vacation/IVacation";

export const useVacationStore = defineStore("vacationStore", () => {
  const vacations = ref<IVacation[]>([]);
  const vacation = reactive<IVacation>({
    id: 0,
    Employee: {
      id: 0,
      name: "",
      Section: { id: 0, name: "" },
      MoveSection: {
        id: 0,
        name: ""
      },
      isMoveSection: 0,
      isPerson: 1,
      dateWork: Date.now().toLocaleString(),
      idCard: "",
      number: "",
      telegramId: "",
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
      },
      Center: {
        id: 0,
        name: "",
        code: ""
      }
    },
    record: 0,
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
  });
  function reset() {
    vacation.id = 0;
    vacation.record = 1; 
    vacation.Employee = {
      id: 0,
      name: "",
      Section: { id: 0, name: "" },
      MoveSection: {
        id: 0,
        name: ""
      },
      isMoveSection: 0,
      isPerson: 1,
      dateWork: Date.now().toLocaleString(),
      idCard: "",
      number: "",
      telegramId: "",
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
      },
      Center: {
        id: 0,
        name: "",
        code: ""
      }
    };
  }
  const pathBase = "/vacationSys";
  const pathUrl = `${pathBase}/vacation`;
  async function get(page: number = 1) {
    console.log(`page : ${page}`);
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_vacations() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          vacations.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get employee : " + errors);
      });
  }
  async function get_filter(params: IVacationFilter, page: number) {
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
    vacation,
    vacations,
    reset,
    get,
    get_filter,
    get_vacations,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
