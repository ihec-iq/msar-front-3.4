import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IHrDocument, IHrDocumentFilter, IHrHocumentType } from "./IHrDocument";

export const useHrDomcumnetStore = defineStore("HrDomcumnetStore", () => {
  const hrDocument = ref<IHrDocument>({
    id: 0,
    title: "",
    addDays: 0,
    dateIssue: new Date().toLocaleDateString(),
    Employee: {
      id: 0,
      name: "",
      Section: {
        id: 0,
        name: ""
      },
      MoveSection: {
        id: 0,
        name: ""
      },
      isMoveSection: 0,
      isPerson: 0,
      dateWork: "",
      number: "",
      idCard: "",
      Position: {
        id: 0,
        name: "",
        level: "",
        code: ""
      },
      Type: {
        id: 0,
        name: ""
      },
      Center: {
        id: 0,
        name: "",
        code: ""
      },
      initVacation: 0,
      takeVacation: 0,
      initVacationSick: 0,
      takeVacationSick: 0
    },
    Type: {
      id: 0,
      name: ""
    }
  });
  const hrDocuments = ref<Array<IHrDocument>>([]);
  const hrDocumentTypes = ref<Array<IHrHocumentType>>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/hrDocument`;
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
      dateIssue: new Date().toLocaleDateString(),
      Employee: {
        id: 0,
        name: "",
        Section: {
          id: 0,
          name: ""
        },
        MoveSection: {
          id: 0,
          name: ""
        },
        isMoveSection: 0,
        isPerson: 0,
        dateWork: "",
        number: "",
        idCard: "",
        Position: {
          id: 0,
          name: "",
          level: "",
          code: ""
        },
        Type: {
          id: 0,
          name: ""
        },
        Center: {
          id: 0,
          name: "",
          code: ""
        },
        initVacation: 0,
        takeVacation: 0,
        initVacationSick: 0,
        takeVacationSick: 0
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
    return await Api.get(`hrDocumentType`).then((response: any) => {
      if (response.status == 200) {
        hrDocumentTypes.value = response.data.data;
      }
    })
      .catch((errors: any) => {
        console.log("in get get hrDocumentTypes : " + errors);
      });
  }
  async function store(prams: object) {
    return await Api.post(`${pathUrl}/store`, prams);
  }
  async function update(item_id: number, params: object) {
    return await Api.post(`${pathUrl}/update/${item_id}`, params);
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
    get,
    get_filter,
    get_hrDocuments,
    get_hrDocumentTypes,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
