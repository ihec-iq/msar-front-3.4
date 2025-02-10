import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IEmployeePosition } from "./IEmployeePosition";


export const useEmployeePositionStore = defineStore("EmployeePositionStore", () => {
  const employeePosition = reactive<IEmployeePosition>({
    id: 0,
    name: "",
    level: "",
    code: "",
  });
  const employeePositions = ref<IEmployeePosition[]>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/employee_position`;


  async function get_employeePositions() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {

          employeePositions.value = response.data.data;
        }

      })
      .catch((errors) => {
        console.log("in get employeePositions : " + errors);
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
    employeePosition.id = 0;
    employeePosition.name = "";
  }

  return {
    employeePosition,
    employeePositions,
    get_employeePositions,
    get,
    show,
    getError,
    resetData,
    store,
    update,
    _delete,
  };
});
