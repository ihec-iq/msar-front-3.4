import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  ICorruptedVoucher,
  ICorruptedVoucherEmployee,
  ICorruptedVoucherFilter,
  ICorruptedVoucherItem,
  ICorruptedVoucherState,
} from "./ICorruptedVoucher";
import type { IEmployeeHistory } from "@/project/employee/IEmployee";

export const useCorruptedVoucherStore = defineStore(
  "CorruptedVoucherStore",
  () => {
    const corruptedVoucher = reactive<ICorruptedVoucher>({
      id: 0,
      number: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      items: [],
      signaturePerson: "",
      employeeRequest: { name: "", id: 0 },
    });
    const SelectedOutItemCorrupted = ref<Array<IEmployeeHistory>>([]);
    const corruptedVouchers = ref<ICorruptedVoucher[]>([]);
    const corruptedVoucherStates = ref<ICorruptedVoucherState[]>([]);
    const corruptedVoucherEmployees = ref<ICorruptedVoucherEmployee[]>([]);
    const pathBase = "/stockSys";
    const pathUrl = `${pathBase}/corruptedVoucher`;
    async function get() {
      corruptedVouchers.value = await Api.get(`${pathUrl}`);
    }
    async function get_filter(params: ICorruptedVoucherFilter, page: number) {
      return await Api.get(`${pathUrl}/filter?page=${page}`, {
        params: params,
      });
    }
    async function store(prams: object) {
      return await Api.post(`${pathUrl}/store`, prams);
    }
    async function update(corruptedVoucher_id: number, params: object) {
      return await Api.post(`${pathUrl}/update/${corruptedVoucher_id}`, params);
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
            corruptedVoucherStates.value = response.data.data;
          }
        })
        .catch((errors) => {
          console.log("in get Categories : " + errors);
        });
    }
    async function getEmployees() {
      return await Api.get("employee/lite")
        .then((response) => {
          if (response.status == 200) {
            corruptedVoucherEmployees.value = response.data.data;
          }
        })
        .catch((errors) => {
          console.log("in get Employees : " + errors);
        });
    }
    function addItem(item: ICorruptedVoucherItem) {
      corruptedVoucher.items = [item].concat(corruptedVoucher.items);
    }
    function editItem(index: number, item: ICorruptedVoucherItem) {
      corruptedVoucher.items[index] = item;
    }

    async function removeItem(index: number) {
      console.log(index);
      console.log(corruptedVoucher.items[index]?.id);
      return await Api.delete(
        `${pathBase}/corruptedVoucherItem/delete/` +
          String(corruptedVoucher.items[index]?.id)
      )
        .then((response) => {
          if (response.status == 200) {
            corruptedVoucher.items?.splice(index, 1);
          }
        })
        .catch((errors) => {
          console.log("in removeItem corruptedVoucher : " + errors);
        });
    }
    function resetData() {
      corruptedVoucher.id = 0;
      corruptedVoucher.number = "";
      corruptedVoucher.date = "";
      corruptedVoucher.notes = "";
      corruptedVoucher.items = [];
      corruptedVoucher.signaturePerson = "";
      corruptedVoucher.employeeRequest = { name: "", id: 0 };
    }
    return {
      corruptedVoucher,
      corruptedVouchers,
      corruptedVoucherStates,
      corruptedVoucherEmployees,
      SelectedOutItemCorrupted,
      addItem,
      editItem,
      removeItem,
      get,
      get_filter,
      getState,
      getEmployees,
      show,
      store,
      update,
      getError,
      _delete,
      resetData,
    };
  }
);
