import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IVacationReason } from "@/types/vacation/IVacationDaily";

export const useVacationTimeStore = defineStore("vacationReasonStore", () => {
  const vacationReason = reactive<IVacationReason>({
    id: 0,
    name: "",
  });
  const reasons = ref<IVacationReason[]>([]);
  function reset() {
    vacationReason.name = "";
  }
  const pathBase = "/vacationSys";
  const pathUrl = `${pathBase}/vacationReason`;
  async function get(page: number = 1) {
    await Api.get(`${pathUrl}?page=${page}`)
      .then((response) => {
        if (response.status == 200) {
          reasons.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get employee : " + errors);
      });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }

  async function update(archive_id: number, prams: object) {
    return await Api.post(`${pathUrl}/update/${archive_id}`, prams);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }

  return {
    vacationReason,
    reasons,
    reset,
    get,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
