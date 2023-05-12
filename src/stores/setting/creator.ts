import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IComputer from "@/types/computer/IComputer";

export const useCreatorStore = defineStore("creatorStore", () => {
  const creator = reactive({
    id: 0,
    name: "",
    company: "",
    job: "",
    requests_count: 0,
    rank: 0,
  });
  async function get() {
    return await Api.get(`/hd/creators`);
  }
  async function store(prams: object) {
    return await Api.post(`/hd/creator`, prams);
  }
  async function show(id: number) {
    return await Api.get(`${`/hd/creator`}/${id}`);
  }
  async function update(prams: object) {
    return await Api.post(`/hd/creator/${creator.id}`, prams);
  }

  return {
    creator,
    get,
    show,
    store,
    update,
    getError,
  };
});
