import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IArchiveType } from "../IArchive";

const pathBase = "/archiveSys/archiveType";

export const useArchiveTypeStore = defineStore("archiveTypeStore", () => {
  const archiveType = ref<IArchiveType>({ id: 0, name: "", description: "" });
  const archiveTypes = ref<IArchiveType[]>([]);

  async function getBySection() {
    await Api.get(`${pathBase}/by/section`).then((response) => {
      archiveTypes.value = response.data.data
      return new Promise(function (myReslove, myReject) {
        myReslove(response);
      })
    });
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

  async function getArchiveTypes() {
    return await Api.get(`${pathBase}/archiveType/by/section`)
      .then((response) => {
        if (response.status == 200) {
          archiveTypes.value = response.data.data;
          console.log('get Archive Type')

        }
      })
      .catch((errors) => {
        console.log("in get ArchiveTypes : " + errors);
      });
  }

  async function getArchiveTypeById(id: number) {
    return await Api.get(`${pathBase}/archiveType/${id}`)
      .then((response) => {
        if (response.status == 200) {
          archiveType.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get ArchiveType by id : " + errors);
      });
  }
 
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
