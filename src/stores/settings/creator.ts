import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type ICreator from "@/types/settings/ICreator";
export const creators = ref([]);
export const creator = reactive<ICreator>({
  id: 0,
  name: "",
  job: "",
  company: "",
});
export const useCreatorStore = defineStore("creatorStore", () => {
  async function get() {
    return await Api.get(`/hd/creators`);
  }
  async function store(prams: object) {
    return await Api.post(`/hd/creator`, prams);
  }
  // async function show(id: number) {
  //   return await Api.get(`${`/hd/feature/requests`}/${id}`);
  // }
  async function update(prams: object) {
    return await Api.post(`${`/hd/creator`}/${creator.id}`, prams);
  }
  async function show(id: number) {
    return await Api.get(`/hd/creator/${id}`);
  }
  return {
    creator,
    creators,
    get,
    show,
    store,
    update,
    getError,
  };
});
