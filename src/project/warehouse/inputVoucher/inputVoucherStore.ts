import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type {
  IInputVoucher,
  IInputVoucherEmployee,
  IInputVoucherFilter,
  IInputVoucherItem,
} from "./IInputVoucher";
import type { IInputVoucherState } from "../settingVoucher/inputVoucherState/IInputVoucherState";
import Swal from "sweetalert2";
import { t } from "@/utilities/I18nPlugin";

export const useInputVoucherStore = defineStore("InputVoucherStore", () => {
  const today = () => new Date().toISOString().split("T")[0];

  const inputVoucher = ref<IInputVoucher>({
    id: 0,
    number: "",
    date: today(),
    notes: "",
    State: { name: "", id: 1 },
    Items: [],
    requestedBy: "",
    Stock: { name: "", id: 0, description: "" },
    numberBill: "",
    dateBill: today(),
    dateReceive: today(),
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
      Category: { id: 0, name: "", description: "" },
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
    try {
      return await Api.get(`${pathUrl}/filter?page=${page}`, { params });
    } catch (error) {
      console.error("Error in get_filter:", error);
      return null;
    }
  }

  async function store(params: object) {
    return await Api.post(`${pathUrl}/store`, params);
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

  async function getItems() {
    inputVoucherItems.value = [];
    try {
      const response = await Api.get(`${pathBase}/inputVoucherItem`);
      if (response.status === 200) {
        inputVoucherItems.value = response.data.data;
      }
    } catch (error) {
      console.error("Error in getItems:", error);
    }
  }

  async function fetchItemsVSelect(endpoint: string, params: object = {}) {
    inputVoucherItemsVSelect.value = [];
    try {
      console.log(`fetchItemsVSelect`);
      const response = await Api.get(endpoint, { params: params });
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        inputVoucherItemsVSelect.value = response.data.data;
        console.log(response.data.data);
      }
    } catch (error) {
      console.error(`Error in fetchItemsVSelect (${endpoint}):`, error);
    }
  }

  function getAvailableItemsVSelect(query?: string | undefined) {
    if (query === undefined || query === "") {
      inputVoucherItemsVSelect.value = [];
      return;
    }
    return fetchItemsVSelect(
      `${pathBase}/inputVoucherItem/getAvailableItemsVSelect`,
      { itemName: query }
    );
  }
  const getItemsVSelect2 = async (query?: string | undefined) => {
    if (query === undefined || query === "") {
      return [];
    }
    let endpoint = `${pathBase}/inputVoucherItem/getAvailableItemsVSelect`;
    try {
      const response = await Api.get(endpoint, { params: { itemName: query } });
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        //console.log(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error(`Error in fetchItemsVSelect (${endpoint}):`, error);
    }
  };

  const getItemsVSelect3 = async (query?: string | undefined) => {
    if (query === undefined || query === "") {
      return [];
    }
    let endpoint = `${pathBase}/inputVoucherItem/getAvailableItemsVSelect`;
    try {
        await Api.get(endpoint, { params: { itemName: query } }).then((response) => {
          if (response.status === 200 && Array.isArray(response.data?.data)) {
            //console.log(response.data.data);
            return response.data.data;
          }
        });

    } catch (error) {
      console.error(`Error in fetchItemsVSelect (${endpoint}):`, error);
    }
    return {
      data: [],
    };
  };

  function getAllItemsVSelect() {
    return fetchItemsVSelect(`${pathBase}/inputVoucherItem/getAllItemsVSelect`);
  }

  function getAllItemsVSelectByEmployeeId(employeeId: number = 0) {
    return fetchItemsVSelect(
      `${pathBase}/inputVoucherItem/getAvailableItemsVSelectByEmployeeId/${employeeId}`
    );
  }

  async function getEmployees() {
    try {
      const response = await Api.get(`employee/lite`);
      if (response.status === 200) {
        inputVoucherEmployees.value = response.data.data;
      }
    } catch (error) {
      console.error("Error in getEmployees:", error);
    }
  }

  function addItem(item: IInputVoucherItem) {
    inputVoucher.value.Items = [item, ...inputVoucher.value.Items];
  }

  function editItem(index: number, item: IInputVoucherItem) {
    inputVoucher.value.Items[index] = item;
  }

  async function removeItem(index: number) {
    const itemId = inputVoucher.value.Items[index]?.id;
    if (!itemId) {
      inputVoucher.value.Items.splice(index, 1);
      return false;
    }

    try {
      const response = await Api.delete(
        `${pathBase}/inputVoucherItem/delete/${itemId}`
      );
      if (response.status === 200) {
        inputVoucher.value.Items.splice(index, 1);
        return true;
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Deleted not successfully ."),
        text: error.response?.data?.message || "An error occurred",
        footer: "",
      });
    }
  }

  function resetData() {
    inputVoucher.value = {
      id: 0,
      number: "",
      numberBill: "",
      date: today(),
      dateBill: today(),
      dateReceive: today(),
      notes: "",
      State: { name: "", id: 1 },
      Items: [],
      requestedBy: "",
      Stock: { name: "", id: 1, description: "" },
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
    getItems,
    getEmployees,
    getAvailableItemsVSelect,
    getItemsVSelect2,
    getItemsVSelect3,
    getAllItemsVSelect,
    getAllItemsVSelectByEmployeeId,
    show,
    store,
    update,
    getError,
    _delete,
    resetData,
  };
});
