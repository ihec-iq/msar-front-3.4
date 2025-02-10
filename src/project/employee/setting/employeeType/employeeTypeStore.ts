import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IEmployeeType } from "./IEmployeeType";

export const useEmployeeTypeStore = defineStore("EmployeeTypeStore", () => {
  const employeeType = reactive<IEmployeeType>({
    id: 0,
    name: "",
  });
  const employeeTypes = ref<IEmployeeType[]>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/employee_type`;
  async function get_employeeTypes() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          employeeTypes.value = response.data.data;
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
    employeeType.id = 0;
    employeeType.name = "";
  }
  return {
    employeeType,
    employeeTypes,
    get_employeeTypes,
    get,
    show,
    getError,
    resetData,
    store,
    update,
    _delete,
  };
});
