import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type { IArchiveType } from "../IArchive";

const pathBase = "/archiveSys/archiveType";

export const useArchiveTypeStore = defineStore("archiveTypeStore", () => {
  const archiveType = ref<IArchiveType>({ id: 0, name: "", description: "" });
  const archiveTypes = ref<IArchiveType[]>([]);

  async function getBySection() {
    return await Api.get(`${pathBase}/by/section`);
  }

  async function getById(id: number) {
    return await Api.get(`${pathBase}/${id}`);
  }

  async function store(prams: object) {
    return await Api.post(`${pathBase}/store`, prams);
  }

  async function update(id: number, prams: object) {
    return await Api.post(`${pathBase}/update/${id}`, prams);
  }

  async function _delete(id: number) {
    return await Api.delete(`${pathBase}/delete/${id}`);
  }

  const resetData = () => {
    archiveType.value = { id: 0, name: "", description: "" };
  };

  return {
    archiveTypes,
    archiveType,
    getBySection,
    getById,
    store,
    update,
    _delete,
    resetData,
    getError,
  };
});
