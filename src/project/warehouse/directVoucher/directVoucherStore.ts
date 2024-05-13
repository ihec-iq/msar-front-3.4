import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IDirectVoucher,
  IDirectVoucherEmployee,
  IDirectVoucherFilter,
  IDirectVoucherItem,
} from "@/project/warehouse/directVoucher/IDirectVoucher";

export const useDirectVoucherStore = defineStore("DirectVoucherStore", () => {
  const directVoucher = reactive<IDirectVoucher>({
    id: 0,
    number: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    Items: [],
    signaturePerson: "",
    Employee: { name: "", id: 0 },
  });
  const directVouchers = ref<IDirectVoucher[]>([]);
  const directVoucherEmployees = ref<IDirectVoucherEmployee[]>([]);
  const directVoucherItemsVSelect = ref<IDirectVoucherItem[]>([]);

  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/directVoucher`;
  async function get() {
    directVouchers.value = await Api.get(`${pathUrl}`);
  }
  async function get_filter(params: IDirectVoucherFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(directVoucher_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${directVoucher_id}`, params);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  // async function getState() {
  //   return await Api.get(`${pathBase}/directVoucherState`)
  //     .then((response) => {
  //       if (response.status == 200) {
  //         directVoucherStates.value = response.data.data;
  //       }
  //     })
  //     .catch((errors) => {
  //       console.log("in get Categories : " + errors);
  //     });
  // }
  async function getAvailableItemsVSelect() {
    directVoucherItemsVSelect.value = [];
    return await Api.get(`${pathBase}/directVoucherItem/getItemsForVSelect`)
      .then((response) => {
        if (response.status == 200) {
          directVoucherItemsVSelect.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get input get Items For VSelect : " + errors);
      });
  }
  async function getEmployees() {
    return await Api.get("employee/lite")
      .then((response) => {
        if (response.status == 200) {
          directVoucherEmployees.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Employees : " + errors);
      });
  }
  function addItem(item: IDirectVoucherItem) {
    directVoucher.Items = [item].concat(directVoucher.Items);
  }
  function editItem(index: number, item: IDirectVoucherItem) {
    console.log(directVoucher.Items);
    directVoucher.Items[index] = item;
    console.log(directVoucher.Items);
  }

  async function removeItem(index: number) {
    console.log(index);
    console.log(directVoucher.Items[index]?.id);
    if (Number(directVoucher.Items[index]?.id) > 0) {
      return await Api.delete(
        `${pathBase}/directVoucherItem/delete/` +
          String(directVoucher.Items[index]?.id)
      )
        .then((response) => {
          if (response.status == 200) {
            /* empty */
          }
        })
        .catch((errors) => {
          console.log("in removeItem directVoucher : " + errors);
        });
    }
    directVoucher.Items?.splice(index, 1);
  }
  function resetData() {
    directVoucher.id = 0;
    directVoucher.number = "";
    directVoucher.date = "";
    directVoucher.notes = "";
    directVoucher.Items = [];
    directVoucher.signaturePerson = "";
    directVoucher.Employee = { name: "", id: 0 };
  }
  return {
    directVoucher,
    directVouchers,
    directVoucherItemsVSelect,
    directVoucherEmployees,
    addItem,
    editItem,
    removeItem,
    get,
    get_filter,
    getEmployees,
    getAvailableItemsVSelect,
    show,
    store,
    update,
    getError,
    _delete,
    resetData,
  };
});
