import { reactive, ref } from "vue";
import { defineStore, type StoreOnActionListener } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IInputVoucher,
  IInputVoucherEmployee,
  IInputVoucherFilter,
  IInputVoucherItem,
  IInputVoucherState,
  IInputVoucherItemVSelect,
} from "./IInputVoucher";

export const useInputVoucherStore = defineStore("InputVoucherStore", () => {
  const inputVoucher = ref<IInputVoucher>({
    id: 0,
    number: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    State: { name: "", id: 1 },
    Items: [],
    signaturePerson: "",
    requestedBy: "",
    Stock: { name: "", id: 0 },
    numberBill: "",
    dateBill: new Date().toISOString().split("T")[0],
    dateReceive: new Date().toISOString().split("T")[0],
  });
  const inputVouchers = ref<IInputVoucher[]>([]);
  const inputVoucherItem = ref<IInputVoucherItem>({
    id: 0,
    inputVoucherId: 0,
    Item: {
      id: 0,
      name: "",
      code: "",
      description: "",
      Category: {
        id: 0,
        name: "",
      },
      measuringUnit: "",
    },
    description: "",
    ItemDescription: "",
    count: 0,
    price: 0,
    value: 0,
    notes: "",
  });
  const inputVoucherItems = ref<IInputVoucherItem[]>([]);
  const inputVoucherItemsVSelect = ref<IInputVoucherItem[]>([]);
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
    inputVoucherItems.value = [];
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
  async function getAvailableItemsVSelect(storeId : string = "0") {
    inputVoucherItemsVSelect.value = [];
    return await Api.get(`${pathBase}/inputVoucherItem/getAvailableItemsVSelect/${storeId}`)
      .then((response) => {
        if (response.status == 200) {
          inputVoucherItemsVSelect.value = response.data.data;
          //console.log(response.data.data)
        }
      })
      .catch((errors) => {
        console.log("in get input get Items For VSelect : " + errors);
      });
  }
  async function getAllItemsVSelect() {
    inputVoucherItemsVSelect.value = [];
    return await Api.get(`${pathBase}/inputVoucherItem/getAllItemsVSelect`)
      .then((response) => {
        if (response.status == 200) {
          inputVoucherItemsVSelect.value = response.data.data;
          //console.log(response.data.data)

        }
      })
      .catch((errors) => {
        console.log("in get input get Items For VSelect : " + errors);
      });
  }
  async function getEmployees() {
    return await Api.get(`employee/lite`)
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
    inputVoucher.value.Items = [item].concat(inputVoucher.value.Items);
  }
  function editItem(index: number, item: IInputVoucherItem) {
    inputVoucher.value.Items[index] = item;
  }
  async function removeItem(index: number) {
    if (
      String(inputVoucher.value.Items[index]?.id) == undefined ||
      inputVoucher.value.Items[index]?.id === undefined ||
      inputVoucher.value.Items[index].id === undefined
    ) {
      inputVoucher.value.Items?.splice(index, 1);
      return false;
    }
    return await Api.delete(
      `${pathBase}/inputVoucherItem/delete/` +
      String(inputVoucher.value.Items[index]?.id)
    )
      .then((response) => {
        if (response.status == 200) {
          inputVoucher.value.Items?.splice(index, 1);
          return true;
        }
      })
      .catch((errors) => {
        console.log("in removeItem inputVoucherItem : " + errors);
      });
  }
  function resetData() {
    inputVoucher.value = {
      id: 0,
      number: "",
      numberBill: "",
      date: new Date().toISOString().split("T")[0],
      dateBill: new Date().toISOString().split("T")[0],
      dateReceive: new Date().toISOString().split("T")[0],
      notes: "",
      State: { name: "", id: 1 },
      Items: [],
      signaturePerson: "",
      requestedBy: "",
      Stock: { name: "", id: 0 },
    };
  }
  return {
    inputVoucher,
    inputVouchers,
    inputVoucherItem,
    inputVoucherItems,
    inputVoucherStates,
    inputVoucherEmployees,
    inputVoucherItemsVSelect,

    addItem,
    editItem,
    removeItem,
    get,
    get_filter,
    getState,
    getItems,
    getEmployees,
    getAvailableItemsVSelect,
    getAllItemsVSelect,
    show,
    store,
    update,
    getError,
    _delete,
    resetData,
  };
});
