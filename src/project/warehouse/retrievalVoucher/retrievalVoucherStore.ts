import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IRetrievalVoucher,
  IRetrievalVoucherEmployee,
  IRetrievalVoucherFilter,
  IRetrievalVoucherItem,
  IRetrievalVoucherState,
} from "./IRetrievalVoucher";

export const useRetrievalVoucherStore = defineStore("RetrievalVoucherStore", () => {
  const retrievalVoucher = reactive<IRetrievalVoucher>({
    id: 0,
    number: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    Items: [],
    signaturePerson: "",
    Employee: { name: "", id: 0 },
  });
  const retrievalVouchers = ref<IRetrievalVoucher[]>([]);
  const retrievalVoucherStates = ref<IRetrievalVoucherState[]>([]);
  const retrievalVoucherEmployees = ref<IRetrievalVoucherEmployee[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/retrievalVoucher`;
  async function get() {
    retrievalVouchers.value = await Api.get(`${pathUrl}`);
  }
  async function get_filter(params: IRetrievalVoucherFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(retrievalVoucher_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${retrievalVoucher_id}`, params);
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
          retrievalVoucherStates.value = response.data.data;
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
          retrievalVoucherEmployees.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Employees : " + errors);
      });
  }
  function addItem(item: IRetrievalVoucherItem) {
    retrievalVoucher.Items = [item].concat(retrievalVoucher.Items);
  }
  function editItem(index: number, item: IRetrievalVoucherItem) {
    retrievalVoucher.Items[index] = item;
  }

  async function removeItem(index: number) {
    console.log(index);
    console.log(retrievalVoucher.Items[index]?.id);
    if (Number(retrievalVoucher.Items[index]?.id) > 0) {
      return await Api.delete(
        `${pathBase}/retrievalVoucherItem/delete/` +
        String(retrievalVoucher.Items[index]?.id)
      )
        .then((response) => {
          if (response.status == 200) {
            /* empty */
          }
        })
        .catch((errors) => {
          console.log("in removeItem retrievalVoucher : " + errors);
        });
    }
    retrievalVoucher.Items?.splice(index, 1);
  }
  function resetData() {
    retrievalVoucher.id = 0;
    retrievalVoucher.number = "";
    retrievalVoucher.date = "";
    retrievalVoucher.notes = "";
    retrievalVoucher.Items = [];
    retrievalVoucher.signaturePerson = "";
    retrievalVoucher.Employee = { name: "", id: 0 };
  }
  return {
    retrievalVoucher,
    retrievalVouchers,
    retrievalVoucherStates,
    retrievalVoucherEmployees,
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
