import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IHrDocument, IHrDocumentFilter, IHrDocumentType } from "./IBonuses";
import type { IEmployeeLite } from "../employee/IEmployee";

export const useHrDocumentStore = defineStore("HrDocumentStore", () => {
  const hrDocument = ref<IHrDocument>({
    id: 0,
    title: "",
    addDays: 0,
    issueDate: new Date().toISOString().split("T")[0],
    Employee: {
      id: 0,
      name: ""
    },
    Type: {
      id: 0,
      name: ""
    }
  });
  const hrDocuments = ref<Array<IHrDocument>>([]);
  const hrDocumentTypes = ref<Array<IHrDocumentType>>([]);
  const employees = ref<Array<IEmployeeLite>>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/hr_document`;
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function get_hrDocuments() {
    await Api.get(`${pathUrl}`)
      .then((response: any) => {
        if (response.status == 200) {
          hrDocuments.value = response.data.data;
        }
      })
      .catch((errors: any) => {
        console.log("in get employee : " + errors);
      });
  }
  function resetData() {
    hrDocument.value = {
      id: 0,
      title: "",
      addDays: 0,
      issueDate: new Date().toISOString().split("T")[0],
      Employee: {
        id: 0,
        name: "",
      },
      Type: {
        id: 0,
        name: ""
      },

    };
  }
  async function get_filter(params: IHrDocumentFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params: params });
  }
  async function get_hrDocumentTypes() {
    return await Api.get(`/hr_document_type`).then((response: any) => {
      if (response.status == 200) {
        hrDocumentTypes.value = response.data.data;
      }
    })
      .catch((errors: any) => {
        console.log("in get get hrDocumentTypes : " + errors);
      });
  }
  async function get_employees() {
    return await Api.get(`/employee/lite`).then((response: any) => {
      if (response.status == 200) {
        employees.value = response.data.data;
      }
    })
      .catch((errors: any) => {
        console.log("in get get hrDocumentTypes : " + errors);
      });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${id}`, params);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/delete/${id}`);
  }
  return {
    hrDocument,
    resetData,
    hrDocumentTypes,
    hrDocuments,
    employees,
    get,
    get_filter,
    get_hrDocuments,
    get_hrDocumentTypes,
    get_employees,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
