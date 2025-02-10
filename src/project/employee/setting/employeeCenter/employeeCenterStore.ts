import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IEmployeeCenter } from "./IEmployeeCenter";


export const useEmployeeCenterStore = defineStore("EmployeeCenterStore", () => {
  const employeeCenter = reactive<IEmployeeCenter>({
    id: 0,
    name: "",
  });
  const employeeCenters = ref<IEmployeeCenter[]>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/employee_center`;

  async function get_employeeCenters() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {

          employeeCenters.value = response.data.data;
        }

      })
      .catch((errors) => {
        console.log("in get employeeTypes : " + errors);
      });
  }
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  const store = async (payload: object) => {
    return await Api.post(`${pathUrl}/store`, payload);
  };
  const update = async (id: number, payload: object ) => {
    return await Api.post(`${pathUrl}/update/${id}`, payload);
  };
  const _delete = async (id: number) => {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  };
  function resetData() {
    employeeCenter.id = 0;
    employeeCenter.name = "";
  }

  return {
    employeeCenter,
    employeeCenters,
    get_employeeCenters,
    get,
    show,
    getError,
    resetData,
    store,
    update,
    _delete,
  };
});
