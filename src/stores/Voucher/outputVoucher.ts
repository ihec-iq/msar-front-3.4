import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IOutputVoucher,
  IOutputVoucherEmployee,
  IOutputVoucherFilter,
  IOutputVoucherItem,
  IOutputVoucherState,
} from "@/types/IOutputVoucher";

export const useOutputVoucherStore = defineStore("OutputVoucherStore", () => {
  const outputVoucher = reactive<IOutputVoucher>({
    id: 0,
    number: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    items: [],
    signaturePerson: "",
    employeeRequest: { name: "", id: 0 },
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
    return await Api.get(`${pathBase}/employee`)
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
    outputVoucher.items = [item].concat(outputVoucher.items);
  }
  function editItem(index: number, item: IOutputVoucherItem) {
    outputVoucher.items[index] = item;
  }

  async function removeItem(index: number) {
    console.log(index);
    console.log(outputVoucher.items[index]?.id);
    if (Number(outputVoucher.items[index]?.id) > 0) {
      return await Api.delete(
        `${pathBase}/outputVoucherItem/delete/` +
          String(outputVoucher.items[index]?.id)
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
    outputVoucher.items?.splice(index, 1);
  }
  function resetData() {
    outputVoucher.id = 0;
    outputVoucher.number = "";
    outputVoucher.date = "";
    outputVoucher.notes = "";
    outputVoucher.items = [];
    outputVoucher.signaturePerson = "";
    outputVoucher.employeeRequest = { name: "", id: 0 };
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
