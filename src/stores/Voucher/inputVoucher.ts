import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IInputVoucher,
  IInputVoucherEmployee,
  IInputVoucherFilter,
  IInputVoucherItem,
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
  const inputVouchers = ref<IInputVoucher[]>([]);
  const inputVoucherItem = ref<IInputVoucherItem>({
    id: 0,
    input_voucher_id: 0,
    item: {
      id: 0,
      name: "",
      code: "",
      description: "",
      itemCategory: {
        id: 0,
        name: "",
      },
      measuringUnit: "",
    },
    itemId: 0,
    stock: {
      id: 0,
      name: "",
    },
    stockId: 0,
    serialNumber: "",
    count: 0,
    price: 0,
    value: 0,
    notes: "",
  });
  const inputVoucherItems = ref<IInputVoucherItem[]>([]);
  const inputVoucherStates = ref<IInputVoucherState[]>([]);
  const inputVoucherEmployees = ref<IInputVoucherEmployee[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/inputVoucher`;
  async function get() {
    inputVouchers.value = await Api.get(`${pathUrl}`);
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
  async function getItems() {
    return await Api.get(`${pathBase}/inputVoucherItem`)
      .then((response) => {
        if (response.status == 200) {
          inputVoucherItems.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get input Voucher Items : " + errors);
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
  function addItem(item: IInputVoucherItem) {
    inputVoucher.items = [item].concat(inputVoucher.items);
  }
  function editItem(index: number, item: IInputVoucherItem) {
    inputVoucher.items[index] = item;
  }
  function removeItem(index: number) {
    inputVoucher.items?.splice(index, 1);
  }
  function resetData() {
    inputVoucher.id = 0;
    inputVoucher.number = "";
    inputVoucher.date = "";
    inputVoucher.notes = "";
    inputVoucher.state = { name: "", id: 0 };
    inputVoucher.items = [];
    inputVoucher.signaturePerson = "";
    inputVoucher.employeeRequestId = 0;
    inputVoucher.employeeRequest = { name: "", id: 0 };
    inputVoucher.inputVoucherStateId = 0;
  }
  return {
    inputVoucher,
    inputVouchers,
    inputVoucherItem,
    inputVoucherItems,
    inputVoucherStates,
    inputVoucherEmployees,
    addItem,
    editItem,
    removeItem,
    get,
    get_filter,
    getState,
    getItems,
    getEmployees,
    show,
    store,
    update,
    getError,
    _delete,
    resetData,
  };
});
