import { reactive } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IArchive, IArchiveFilter } from "@/types/Archive/IArchive";

export const useArchiveStore = defineStore("archiveStore", () => {
  const archive = reactive<IArchive>({
    id: 0,
    title: "",
    issueDate: new Date().toISOString().split("T")[0],
    files: [],
    description: "",
    way: "way",
    number: "123",
    isIn: 0,
    isInWord: "",
    archiveTypeId: 1,
    sectionId: 1,
  });

  const pathUrl = "/archiveSys/archive";
  async function get(page: number = 1) {
    console.log(`page : ${page}`);
    return await Api.get(`${pathUrl}?page=${page}`);
  }
  async function get_filter(params: IArchiveFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function add_document(prams: object) {
    return await Api.post(`${pathUrl}/${archive.id}/document/add`, prams);
  }
  async function update(prams: object) {
    return await Api.put(`${pathUrl}/update/${archive.id}`, prams);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }

  return {
    archive,
    get,
    get_filter,
    show,
    store,
    update,
    _delete,
    getError,
  };
});
