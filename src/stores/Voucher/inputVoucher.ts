import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IInputVoucher,
  IInputVoucherEmployee,
  IInputVoucherFilter,
  IInputVoucherState,
} from "@/types/IInputVoucher";

export const useInputVoucherStore = defineStore("InputVoucherStore", () => {
  const inputVoucher = reactive<IInputVoucher>({
    id: 0,
    number: "",
    date: "",
    notes: "",
    state: { name: "", id: 0 },
    items: [],
    signaturePerson: "",
    employeeRequestId: 0,
    employeeRequest: { name: "", id: 0 },
    inputVoucherStateId: 0,
  });

  const inputVoucherStates = ref<IInputVoucherState[]>([]);
  const inputVoucherEmployees = ref<IInputVoucherEmployee[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/inputVoucher`;
  async function get(page: number = 1) {
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IInputVoucherFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(inputVoucher_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${inputVoucher_id}`, params);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  async function getState() {
    return await Api.get(`${pathBase}/inputVoucherState`)
      .then((response) => {
        if (response.status == 200) {
          inputVoucherStates.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Categories : " + errors);
      });
  }
  async function getEmployees() {
    return await Api.get(`${pathBase}/employee`)
      .then((response) => {
        if (response.status == 200) {
          inputVoucherEmployees.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Employees : " + errors);
      });
  }
  return {
    inputVoucher,
    inputVoucherStates,
    inputVoucherEmployees,
    get,
    get_filter,
    getState,
    getEmployees,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
