import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IInputVoucherState } from "./IInputVoucherState";

export const useInputVoucherStateStore = defineStore("InputVoucherStateStore", () => {
  const inputVoucherState = reactive<IInputVoucherState>({
    id: 0,
    name: "",
  });
  const inputVoucherStates = ref<IInputVoucherState[]>([]);
  const pathBase = "/stockSys";
  const pathUrl = `${pathBase}/inputVoucherState`;
  async function get_inputVoucherStates() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          inputVoucherStates.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get inputVoucherStates : " + errors);
      });
  }
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  const store = async (payload: object) => {
    return await Api.post(`${pathUrl}/store`, payload);
  };
  const update = async (id: number, payload: object ) => {
    return await Api.post(`${pathUrl}/update/${id}`, payload);
  };
  const _delete = async (id: number) => {
    return await Api.delete(`${pathUrl}/destroy/${id}`);
  };
  function resetData() {
    inputVoucherState.id = 0;
    inputVoucherState.name = "";
  }
  return {
    inputVoucherState,
    inputVoucherStates,
    get_inputVoucherStates,
    get,
    show,
    getError,
    resetData,
    store,
    update,
    _delete,
  };
});
