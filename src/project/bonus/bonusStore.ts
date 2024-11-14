import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IBonusFilter, IBonusJobTitle, IBonusStudy, IBonus, IDegreeStage } from "./IBonus";
import type { IEmployeeLite } from "../employee/IEmployee";

export const useBonusStore = defineStore("BonusStore", () => {
  const Bonus = ref<IBonus>({
    id: 0,
    issueDate: new Date().toISOString().split("T")[0],
    number: "",
    Employee: {
      id: 0,
      name: "",
      dateLastBonus: "",
      dateNextBonus: "",
      numberLastBonus: "",
      DegreeStage: {
        id: 0,
        title: "",
        Degree: { id: 0, name: "" },
        Stage: { id: 0, name: "" },
        salery: 0,
        yearlyBonus: 0,
        yearlyService: 0
      },
      BonusJobTitle: { id: 0, name: "", description: "" },
      BonusStudy: { id: 0, name: "" }
    },
    DegreeStage: {
      id: 0,
      title: "",
      Degree: { id: 0, name: "" },
      Stage: { id: 0, name: "" },
      salery: 0,
      yearlyBonus: 0,
      yearlyService: 0
    },
    notes: ""
  });
  const BonusJobTitle = ref<IBonusJobTitle>({ id: 0, name: "", description: "" });
  const BonusStudy = ref<IBonusStudy>({ id: 0, name: "" });
  const DegreeStage = ref<IDegreeStage>({ id: 0, title: "", Degree: { id: 0, name: "" }, Stage: { id: 0, name: "" }, salery: 0, yearlyBonus: 0, yearlyService: 0 });

  const Bonuses = ref<Array<IBonus>>([]);
  const BonusJobTitles = ref<Array<IBonusJobTitle>>([]);
  const BonusStudies = ref<Array<IBonusStudy>>([]);
  const DegreeStages = ref<Array<IDegreeStage>>([]);
  const Employees = ref<Array<IEmployeeLite>>([]);

  const pathBase = "";
  const pathUrl = `${pathBase}/bonus`;
  const pathEmployeeUrl = `${pathBase}/employee`;

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const sortedBonuses = computed(() => {
    return [...Bonuses.value].sort((a, b) => a.number.localeCompare(b.number));
  });

  const resetDataBonus = () => {
    Bonus.value = {
      id: 0,
      issueDate: new Date().toISOString().split("T")[0],
      number: "",
      Employee: {
        id: 0,
        name: "",
        dateLastBonus: "",
        dateNextBonus: "",
        numberLastBonus: "",
        DegreeStage: { // Added this property
          id: 0,
          title: "",
          Degree: { id: 0, name: "" },
          Stage: { id: 0, name: "" },
          salery: 0,
          yearlyBonus: 0,
          yearlyService: 0
        },
        BonusJobTitle: { id: 0, name: "", description: "" },
        BonusStudy: { id: 0, name: "" }
      },
      DegreeStage: {
        id: 0,
        title: "",
        Degree: { id: 0, name: "" },
        Stage: { id: 0, name: "" },
        salery: 0,
        yearlyBonus: 0,
        yearlyService: 0
      },
      notes: ""
    };
  }
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function get_Bonuses() {
    await Api.get(`${pathUrl}`).then((response) => {
      if (response.status == 200) {
        Bonuses.value = response.data.data;
      }
    });
  }
  async function get_filter(params: IBonusFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params });
  }
  async function get_checkBonus(params: IBonusFilter, page: number) {
    return await Api.get(`${pathEmployeeUrl}/bonus/check?page=${page}`, { params });
  }
  async function calculateBonus(params: IBonusFilter) {
    return await Api.get(`${pathEmployeeUrl}/bonus/calculate`, { params });
  }

  //#region BonusJobTitle
  const resetDataBonusJobTitle = () => {
    BonusJobTitle.value = {
      id: 0,
      name: "",
      description: ""
    };
  }
  async function get_BonusJobTitle(params: object = {}) {
    return await Api.get(`bonus_job_title`, { params }).then((response) => {
      if (response.status == 200) {
        BonusJobTitles.value = response.data.data;
      }
    });
  }
  async function getFilter_BonusJobTitle(params: IBonusFilter, page: number) {
    return await Api.get(`bonus_job_title/filter?page=${page}`, { params });
  }
  async function store_BonusJobTitle(params: object) {
    return await Api.post(`bonus_job_title/store`, params);
  }
  async function update_BonusJobTitle(id: number, params: object) {
    return await Api.post(`bonus_job_title/update/${id}`, params);
  }
  async function delete_BonusJobTitle(id: number) {
    return await Api.delete(`bonus_job_title/delete/${id}`);
  }
  async function show_BonusJobTitle(id: number) {
    return await Api.get(`bonus_job_title/${id}`);
  }
  //#endregion

  //#region BonusStudy
  const resetDataBonusStudy = () => {
    BonusStudy.value = {
      id: 0,
      name: ""
    };
  }
  async function get_BonusStudy() {
    return await Api.get(`bonus_study`).then((response) => {
      if (response.status == 200) {
        BonusStudies.value = response.data.data;
      }
    });
  }
  async function store_BonusStudy(params: object) {
    return await Api.post(`bonus_study/store`, params);
  }
  async function update_BonusStudy(id: number, params: object) {
    return await Api.post(`bonus_study/update/${id}`, params);
  }
  async function delete_BonusStudy(id: number) {
    return await Api.delete(`bonus_study/delete/${id}`);
  }
  async function show_BonusStudy(id: number) {
    return await Api.get(`bonus_study/${id}`);
  }
  //#endregion

  //#region DegreeStage  
  const resetDataDegreeStage = () => {
    DegreeStage.value = {
      id: 0,
      title: "",
      Degree: { id: 0, name: "" },
      Stage: { id: 0, name: "" },
      salery: 0,
      yearlyBonus: 0,
      yearlyService: 0
    };
  }
  async function get_DegreeStage() {
    return await Api.get(`bonus_degree_stage`).then((response) => {
      if (response.status == 200) {
        DegreeStages.value = response.data.data;
      }
    });
  }
  async function store_DegreeStage(params: object) {
    return await Api.post(`bonus_degree_stage/store`, params);
  }
  async function update_DegreeStage(id: number, params: object) {
    return await Api.post(`bonus_degree_stage/update/${id}`, params);
  }
  async function delete_DegreeStage(id: number) {
    return await Api.delete(`bonus_degree_stage/delete/${id}`);
  }
  async function show_DegreeStage(id: number) {
    return await Api.get(`bonus_degree_stage/${id}`);
  }
  //#endregion

  async function get_EmployeesLite() {
    return await Api.get(`/employee/lite`).then((response) => {
      if (response.status == 200) {
        Employees.value = response.data.data;
      }
    });
  }
  async function get_Employees() {
    return await Api.get(`/employee`).then((response) => {
      if (response.status == 200) {
        Employees.value = response.data.data;
      }
    });
  }

  async function store(params: object) {
    return await Api.post(`${pathUrl}/store`, params);
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
    Bonus,
    resetDataBonus,
    resetDataBonusJobTitle,
    resetDataBonusStudy,
    resetDataDegreeStage,
    BonusJobTitle,
    BonusStudy,
    DegreeStage,
    Bonuses,
    BonusJobTitles,
    BonusStudies,
    DegreeStages,
    sortedBonuses,
    Employees,
    isLoading,
    error,
    get,
    get_filter,
    get_checkBonus,
    calculateBonus,
    get_Bonuses,
    get_BonusJobTitle,
    getFilter_BonusJobTitle,
    get_BonusStudy,
    get_DegreeStage,
    get_Employees,
    get_EmployeesLite,
    show,
    show_BonusJobTitle,
    show_BonusStudy,
    show_DegreeStage,
    delete_BonusJobTitle,
    delete_BonusStudy,
    delete_DegreeStage,
    store,
    store_BonusJobTitle,
    store_BonusStudy,
    store_DegreeStage,
    update,
    update_BonusJobTitle,
    update_BonusStudy,
    update_DegreeStage,
    getError,
    _delete,
  };
});
