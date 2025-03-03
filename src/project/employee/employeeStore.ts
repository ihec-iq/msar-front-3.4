import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IEmployee, IEmployeeFilter } from "@/project/employee/IEmployee";
import type { IEmployeeType } from "./setting/employeeType/IEmployeeType";
import type { IEmployeePosition } from "./setting/employeePosition/IEmployeePosition";
import type { IEmployeeCenter } from "./setting/employeeCenter/IEmployeeCenter";

export const useEmployeeStore = defineStore("useEmployeeStore", () => {
  const employee = ref<IEmployee>({
    id: 0,
    name: "",
    Section: { name: "", id: 0 },
    isPerson: 1,
    number: "",
    idCard: "",
    initVacation: 0,
    takeVacation: 0,
    initVacationSick: 0,
    takeVacationSick: 0,
    dateWork: new Date().toISOString().split("T")[0],
    EmployeePosition: {
      id: 0,
      name: "",
      level: "",
      code: "",
    },
    EmployeeType: {
      id: 0,
      name: "",
    },
    MoveSection: {
      id: 0,
      name: ""
    },
    isMoveSection: 0,
    EmployeeCenter: {
      id: 0,
      name: ""
    },
    BonusJobTitle: {
      id: 0,
      name: "",
      description: ""
    },
    Study: {
      id: 0,
      name: ""
    },
    DegreeStage: {
      id: 0,
      title: "",
      Degree: {
        id: 0,
        name: ""
      },
      Stage: {
        id: 0,
        name: ""
      },
      salary: 0,
      yearlyBonus: 0,
      yearlyService: 0
    },
    numberLastBonus: "",
    dateLastBonus: "", 
    dateNextBonus: ""
  });
  const error = ref<string | null>(null);

  const employees = ref<Array<IEmployee>>([]);
  const employees_positions = ref<Array<IEmployeePosition>>([]);
  const employees_types = ref<Array<IEmployeeType>>([]);
  const employees_centers = ref<Array<IEmployeeCenter>>([]);

  const pathBase = "";
  const pathUrl = `${pathBase}/employee`;
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function get_employees() {
    await Api.get(`${pathUrl}`)
      .then((response: any) => {
        if (response.status == 200) {
          employees.value = response.data.data;
        }
      })
      .catch((errors: any) => {
        console.log("in get employee : " + errors);
      });
  }
  function resetData() {
    employee.value = {
      id: 0,
      name: "",
      Section: { name: "", id: 0 },
      MoveSection: { name: "", id: 0 },
      isMoveSection: 0,
      isPerson: 1,
      number: "",
      idCard: "",
      initVacation: 0,
      takeVacation: 0,
      initVacationSick: 0,
      takeVacationSick: 0,
      dateWork: new Date().toISOString().split("T")[0],
      EmployeePosition: {
        id: 0,
        name: "",
        level: "",
        code: "",
      },
      EmployeeType: {
        id: 0,
        name: "",
      },
      EmployeeCenter: {
        id: 0,
        name: ""
      },
      BonusJobTitle: {
        id: 0,
        name: "",
        description: ""
      },
      Study: {
        id: 0,
        name: ""
      },
      DegreeStage: {
        id: 0,
        title: "",
        Degree: {
          id: 0,
          name: ""
        },
        Stage: {
          id: 0,
          name: ""
        },
        salary: 0,
        yearlyBonus: 0,
        yearlyService: 0
      },
      numberLastBonus: "",
      dateLastBonus: "",
      dateNextBonus: "" 
    };
  }
  async function get_filter(params: IEmployeeFilter, page: number) {
    try {
      return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
    } catch (error : any) {
      // Handle errors where response might not exist
      console.error('Error:', error.response?.data || error.message);
    }
    return ; 
  }
  async function get_light_filter(params: IEmployeeFilter, page: number) {
    try {
      return await Api.get(`${pathUrl}/filter/lite?page=${page}`, { params: params });
    } catch (error: any) {
      // Handle errors where response might not exist
      console.error('Error:', error.response?.data || error.message);
    }
    return;
  }
  async function get_employee_positions(hardRefresh: boolean = false) {
    if (hardRefresh == false || employees_positions.value.length == 0) {
      return await Api.get(`employee_position`).then((response: any) => {
        if (response.status == 200) {
        employees_positions.value = response.data.data;
      }
    })
      .catch((errors: any) => {
        console.log("in get employees_positions : " + errors);
      });
    }
  }
  async function get_employee_types(hardRefresh: boolean = false) {
    if (hardRefresh == false || employees_types.value.length == 0) {
      return await Api.get(`employee_type`).then((response: any) => {
        if (response.status == 200) {
          employees_types.value = response.data.data;
        }
      })
      .catch((errors: any) => {
        console.log("in get employee_type : " + errors);
        });;
    }
  }
  async function get_employee_centers(hardRefresh: boolean = false) {
    if (hardRefresh == false || employees_centers.value.length == 0) {
      return await Api.get(`employee_center`).then((response: any) => {
        if (response.status == 200) {
          employees_centers.value = response.data.data;
        }
      })
      .catch((errors: any) => {
        console.log("in get employee_center : " + errors);
        });;
    }
  }
  async function getItemHistory(params: IEmployeeFilter, page: number) {
    return await Api.get(`stockSys/voucherItemHistory/filter?page=${page}`, {
      params: params,
    });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${id}`, params);
  }
  async function updateBonus(id: number, params: object) {
    return await Api.post(`${pathUrl}/update/bonus/${id}`, params);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function showBonusLite(id: number) {
    return await Api.get(`${pathUrl}/show/bonus/lite/${id}`);
  } 
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  return {
    employee,
    resetData,
    employees,
    employees_types,
    employees_centers,
    employees_positions,
    get,
    get_filter,
    get_light_filter,
    getItemHistory,
    get_employees,
    get_employee_positions,
    get_employee_types,
    get_employee_centers,
    show,
    showBonusLite,
    store,
    update,
    updateBonus,
    getError,
    error,
    _delete,
  };
});
