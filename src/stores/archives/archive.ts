import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type {
  IArchive,
  IArchiveFilter,
  IArchiveType,
} from "@/types/archives/IArchive";

export const useArchiveStore = defineStore("archiveStore", () => {
  const archive = reactive<IArchive>({
    id: 0,
    title: "",
    issueDate: new Date().toISOString().split("T")[0],
    files: [],
    description: "",
    way: "",
    number: "",
    isIn: 1,
    isInWord: "",
    archiveType: { id: 0, name: "" },
    archiveTypeId: 0,
    sectionId: 1,
  });
  const archiveTypes = ref<IArchiveType[]>([]);

  const pathBase = "/archiveSys";
  const pathUrl = `${pathBase}/archive`;
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
  async function addDocument(archive_id: number, prams: object) {
    return await Api.post(`${pathUrl}/document/add`, prams);
  }
  async function addDocumentMulti(archive_id: number, prams: object) {
    return await Api.post(
      `${pathUrl}/${archive_id}/document/store_multi`,
      prams
    );
  }
  async function getDocuments(archive_id: number) {
    return await Api.get(`${pathUrl}/${archive_id}/documents`);
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
  async function _deleteDocument(id: number) {
    const path = `${pathBase}/document/delete/${id}`;
    return await Api.delete(path);
  }
  async function getArchiveTypes() {
    return await Api.get(`${pathBase}/archiveType`)
      .then((response) => {
        if (response.status == 200) {
          archiveTypes.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get Categories : " + errors);
      });
  }

  return {
    archive,
    archiveTypes,
    get,
    get_filter,
    getArchiveTypes,
    show,
    store,
    update,
    getError,
    _delete,
    addDocument,
    addDocumentMulti,
    getDocuments,
    _deleteDocument,
  };
});
