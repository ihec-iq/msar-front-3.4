import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IArchive from "@/types/Archive/IArchive";

export const useArchiveStore = defineStore("archiveStore", () => {
  const archive = reactive<IArchive>({
    id: 0,
    title: "",
    issueDate: new Date().toISOString().split("T")[0],
    files: undefined,
    description: "",
    way: "way",
    number: "123",
    isIn: 0,
    isInWord: "",
    archiveTypeId: 1,
    sectionId: 1,
  });

  const pathUrl = "/archiveSys/archive";
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(prams: object) {
    return await Api.put(`${pathUrl}/update/${archive.id}`, prams);
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
