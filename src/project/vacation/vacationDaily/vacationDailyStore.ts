import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IVacationDaily,
  IVacationDailyFilter,
} from "@/project/vacation/vacationDaily/IVacationDaily";

export const useVacationDailyStore = defineStore("vacationDailyStore", () => {
  const vacationDaily = reactive<IVacationDaily>({
    id: 0,
    dayFrom: new Date().toISOString().split("T")[0],
    dayTo: new Date().toISOString().split("T")[0],
    Vacation: {
      Employee: {
        id: 1,
        name: "",
        Section: { id: 0, name: "" },
        MoveSection: {
          id: 0,
          name: ""
        },
        isMoveSection: 0,
        isPerson: 1,
        dateWork: "",
        number: "",
        telegramId: "",
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
      id: 0,
      deservedRecord: 0,
      totalTaken: 0,
      remaining: 0,
      currentYearVacations: 0,
      currentYearTimeVacations: 0,
      currentYearDailyVacations: 0,
      deservedSickRecord: 0,
      takenSick: 0,
      remainingSick: 0,
      currentYearSickVacations: 0,
      record: 0,
      recordSick: 0,
    },
    EmployeeAlter: {
      id: 1,
      name: "",
      Section: { id: 0, name: "" },
      MoveSection: {
        id: 0,
        name: ""
      },
      isMoveSection: 0,
      isPerson: 1,
      dateWork: "",
      number: "",
      idCard: "",
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
      }
    },
    record: 0,
    Reason: {
      id: 1,
      name: "",
    },
  });
  function resetData() {
    vacationDaily.id = 0;
    vacationDaily.record = 1;
    vacationDaily.dayFrom = new Date().toISOString().split("T")[0];
    const d = new Date(vacationDaily.dayFrom);
    d.setDate(d.getDate() + vacationDaily.record);
    vacationDaily.dayTo = d.toISOString().split("T")[0];
    vacationDaily.Vacation = {
      Employee: {
        id: 1,
        name: "",
        Section: { id: 0, name: "" },
      MoveSection: {
        id: 0,
        name: ""
      },
      isMoveSection: 0,
      isPerson: 1,
      dateWork: "",
      number: "",
      idCard: "",
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
      }
    },
      id: 0,
        deservedRecord: 0,
          totalTaken: 0,
            remaining: 0,
              currentYearVacations: 0,
                currentYearTimeVacations: 0,
                  currentYearDailyVacations: 0,
                    deservedSickRecord: 0,
                      takenSick: 0,
                        remainingSick: 0,
                          currentYearSickVacations: 0,
                            record: 0,
                              recordSick: 0,
    };
  vacationDaily.EmployeeAlter = {
    id: 1,
    name: "",
    Section: { id: 0, name: "" },
    MoveSection: {
      id: 0,
      name: ""
    },
    isMoveSection: 0,
    isPerson: 1,
    dateWork: "",
    number: "",
    idCard: "",
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
    }
  };
  vacationDaily.Reason = {
    id: 0,
    name: "",
  };
}
  const pathBase = "/vacationSys";
const pathUrl = `${pathBase}/vacationDaily`;
async function get(page: number = 1) {
  console.log(`page : ${page}`);
  return await Api.get(`${pathUrl}?page=${page}`);
}
async function get_filter(params: IVacationDailyFilter, page: number) {
  return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
}
async function store(prams: FormData) {
  return await Api.post(`${pathUrl}/store`, prams);
}

async function update(archive_id: number, prams: FormData) {
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
