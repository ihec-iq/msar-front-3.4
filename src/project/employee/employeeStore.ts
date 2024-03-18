import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IEmployee, IEmployeeFilter, IEmployeePosition, IEmployeeType } from "@/project/employee/IEmployee";

export const useEmployeeStore = defineStore("employeeStore", () => {
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
    dateWork: new Date().toLocaleDateString(),
    Position: {
      id: 0,
      name: "",
      level: "",
      code: "",
    },
    Type: {
      id: 0,
      name: "",
    },
  });
  const employees = ref<Array<IEmployee>>([]);
  const employees_positions = ref<Array<IEmployeePosition>>([]);
  const employees_types = ref<Array<IEmployeeType>>([]);

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
      isPerson: 1,
      number: "",
      idCard: "",
      initVacation: 0,
      takeVacation: 0,
      initVacationSick: 0,
      takeVacationSick: 0,
      dateWork: new Date().toLocaleDateString(),
      Position: {
        id: 0,
        name: "",
        level: "",
        code: "",
      },
      Type: {
        id: 0,
        name: "",
      },
    };
  }
  async function get_filter(params: IEmployeeFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function get_employee_positions() {
    return await Api.get(`employee_position`).then((response: any) => {
        if (response.status == 200) {
          employees_positions.value = response.data.data;
        }
      })
      .catch((errors: any) => {
        console.log("in get employees_positions : " + errors);
      });
  }
  async function get_employee_types() {
    return await Api.get(`employee_type`).then((response: any) => {
        if (response.status == 200) {
          employees_types.value = response.data.data;
        }
      })
      .catch((errors: any) => {
        console.log("in get employees_positions : " + errors);
      });;
  }
  async function getItemHistory(params: IEmployeeFilter, page: number) {
    return await Api.get(`stockSys/voucherItemHistory/filter?page=${page}`, {
      params: params,
    });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(item_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${item_id}`, params);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  return {
    employee,
    resetData,
    employees,
    employees_types,
    employees_positions,
    get,
    get_filter,
    getItemHistory,
    get_employees,
    get_employee_positions,
    get_employee_types,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
