import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IEmployee, IEmployeeFilter } from "@/types/IEmployee";

export const useEmployeeStore = defineStore("employeeStore", () => {
  const employee = reactive<IEmployee>({
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
  });
  const employees = ref<Array<IEmployee>>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/employee`;
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function get_employees() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          employees.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get employee : " + errors);
      });
  }
  async function get_filter(params: IEmployeeFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function getItemHistory(params: IEmployeeFilter, page: number) {
    return await Api.get(`${pathBase}/voucherItemHistory/filter?page=${page}`, {
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
    employees,
    get,
    get_filter,
    getItemHistory,
    get_employees,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
