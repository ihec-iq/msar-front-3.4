import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IOutputVoucher,
  IOutputVoucherEmployee,
  IOutputVoucherFilter,
  IOutputVoucherItem,
  IOutputVoucherState,
} from "./IOutputVoucher";

export const useOutputVoucherStore = defineStore("useOutputVoucherStore", () => {
  const outputVoucher = reactive<IOutputVoucher>({
    id: 0,
    number: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    Items: [],
    signaturePerson: "",
    dateBill: new Date().toISOString().split("T")[0],
    numberBill: "",
    Employee: { name: "", id: 0 },
    Stock: { name: "", id: 0, description: '' },
  });
  const outputVouchers = ref<IOutputVoucher[]>([]);
  const outputVoucherStates = ref<IOutputVoucherState[]>([]);
  const outputVoucherEmployees = ref<IOutputVoucherEmployee[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/outputVoucher`;
  async function get() {
    outputVouchers.value = await Api.get(`${pathUrl}`);
  }
  async function get_filter(params: IOutputVoucherFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(outputVoucher_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${outputVoucher_id}`, params);
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
          outputVoucherStates.value = response.data.data;
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
          outputVoucherEmployees.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Employees : " + errors);
      });
  }
  function addItem(item: IOutputVoucherItem) {
    outputVoucher.Items = [item].concat(outputVoucher.Items);
  }
  function editItem(index: number, item: IOutputVoucherItem) {
    outputVoucher.Items[index] = item;
  }

  async function removeItem(index: number) {
    console.log(index);
    console.log(outputVoucher.Items[index]?.id);
    if (Number(outputVoucher.Items[index]?.id) > 0) {
      return await Api.delete(
        `${pathBase}/outputVoucherItem/delete/` +
        String(outputVoucher.Items[index]?.id)
      )
        .then((response) => {
          if (response.status == 200) {
            /* empty */
          }
        })
        .catch((errors) => {
          console.log("in removeItem outputVoucher : " + errors);
        });
    }
    outputVoucher.Items?.splice(index, 1);
  }
  function resetData() {
    outputVoucher.id = 0;
    outputVoucher.number = "";
    outputVoucher.date = "";
    outputVoucher.notes = "";
    outputVoucher.Items = [];
    outputVoucher.signaturePerson = "";
    outputVoucher.Employee = { name: "", id: 0 };
    outputVoucher.Stock = { name: "", id: 0, description: ''};
    outputVoucher.dateBill= new Date().toISOString().split("T")[0];
    outputVoucher. numberBill= "";
  }
  return {
    outputVoucher,
    outputVouchers,
    outputVoucherStates,
    outputVoucherEmployees,
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
});
