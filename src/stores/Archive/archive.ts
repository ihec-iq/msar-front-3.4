import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IArchive from "@/types/Archive/IArchive";

export const useArchiveStore = defineStore("archiveStore", () => {
  const archive = reactive<IArchive>({
    id: 0,
    title: "",
    date: new Date().toISOString().split("T")[0],
    file1: undefined,
    description: "",
  });

  const pathUrl = "/ar/archive";
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}`, prams);
  }
  async function update(prams: object) {
    return await Api.post(`${pathUrl}/${archive.id}`, prams);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  return {
    archive,
    get,
    show,
    store,
    update,
    getError,
  };
});
