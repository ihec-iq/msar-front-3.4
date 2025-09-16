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
import Swal from "sweetalert2";
import { t } from "@/utilities/I18nPlugin";
import { date } from "yup";

export const useOutputVoucherStore = defineStore(
  "useOutputVoucherStore",
  () => {
    const outputVoucher = reactive<IOutputVoucher>({
      id: 0,
      number: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      Items: [],
      dateBill: new Date().toISOString().split("T")[0],
      numberBill: "",
      Employee: { name: "", id: 0 },
      Stock: { name: "", id: 0, description: "" },
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
      return await Api.get(`${pathUrl}/filter?page=${page}`, {
        params: params,
      });
    }
    async function checkBillExists(number: string, date: string) {
      if (number === "") {
        Swal.fire({
          icon: "warning",
          title: t("Warning"),
          text: t("Please enter the bill number"),
        });
        return;
      }
      return await Api.get(`${pathUrl}/checkBillExists`, {
        params: { number: number, date: date },
      });
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
      if (Number(outputVoucher.Items[index]?.id) > 0) {
        return await Api.delete(
          `${pathBase}/outputVoucherItem/delete/` +
            String(outputVoucher.Items[index]?.id)
        )
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              outputVoucher.Items?.splice(index, 1);
              return;
            }
          })
          .catch((errors) => {
            console.log("in removeItem outputVoucher : " + errors);
          });
      }
      try {
        outputVoucher.Items?.splice(index, 1);
      } catch (error) {
        console.log("delete item in outputVoucher items : ",error);
      }
    }
    function resetData() {
      outputVoucher.id = 0;
      outputVoucher.number = "";
      outputVoucher.date = "";
      outputVoucher.notes = "";
      outputVoucher.Items = [];
      outputVoucher.Employee = { name: "", id: 0 };
      outputVoucher.Stock = { name: "", id: 0, description: "" };
      outputVoucher.dateBill = new Date().toISOString().split("T")[0];
      outputVoucher.numberBill = "";
    }
    return {
      outputVoucher,
      outputVouchers,
      outputVoucherStates,
      outputVoucherEmployees,
      checkBillExists,
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
