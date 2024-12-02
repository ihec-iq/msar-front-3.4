import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { IPromotionFilter, IPromotion } from "./IPromotion";
import type { IDegreeStage } from "../bonus/IBonus";
import type { IEmployeeLite } from "../employee/IEmployee";

export const usePromotionStore = defineStore("PromotionStore", () => {
  const Promotion = ref<IPromotion>({
    id: 0,
    issueDate: new Date().toISOString().split("T")[0],
    number: "",
    Employee: {
      id: 0,
      name: "",
      dateLastPromotion: "",
      dateNextPromotion: "",
      numberLastPromotion: "",
      DegreeStage: {
        id: 0,
        title: "",
        Degree: { id: 0, name: "" },
        Stage: { id: 0, name: "" },
        salary: 0,
        yearlyBonus: 0,
        yearlyService: 0
      },
      BonusJobTitle: { id: 0, name: "", description: "" }
    },
    DegreeStage: {
      id: 0,
      title: "",
      Degree: { id: 0, name: "" },
      Stage: { id: 0, name: "" },
      salary: 0,
      yearlyBonus: 0,
      yearlyService: 0
    },
    notes: ""
  });
  const DegreeStage = ref<IDegreeStage>({ id: 0, title: "", Degree: { id: 0, name: "" }, Stage: { id: 0, name: "" }, salary: 0, yearlyBonus: 0, yearlyService: 0 });

  const Promotiones = ref<Array<IPromotion>>([]);
  const DegreeStages = ref<Array<IDegreeStage>>([]);
  const Employees = ref<Array<IEmployeeLite>>([]);

  const pathBase = "";
  const pathUrl = `${pathBase}/promotion`;
  const pathEmployeeUrl = `${pathBase}/employee`;

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const sortedPromotiones = computed(() => {
    return [...Promotiones.value].sort((a, b) => a.number.localeCompare(b.number));
  });

  const resetDataPromotion = () => {
    Promotion.value = {
      id: 0,
      issueDate: new Date().toISOString().split("T")[0],
      number: "",
      Employee: {
        id: 0,
        name: "",
        dateLastPromotion: "",
        dateNextPromotion: "",
        numberLastPromotion: "",
        DegreeStage: { // Added this property
          id: 0,
          title: "",
          Degree: { id: 0, name: "" },
          Stage: { id: 0, name: "" },
          salary: 0,
          yearlyBonus: 0,
          yearlyService: 0
        },
        BonusJobTitle: { id: 0, name: "", description: "" },
      },
      DegreeStage: {
        id: 0,
        title: "",
        Degree: { id: 0, name: "" },
        Stage: { id: 0, name: "" },
        salary: 0,
        yearlyBonus: 0,
        yearlyService: 0
      },
      notes: ""
    };
  }
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function get_Promotiones() {
    await Api.get(`${pathUrl}`).then((response) => {
      if (response.status == 200) {
        Promotiones.value = response.data.data;
      }
    });
  }
  async function get_filter(params: IPromotionFilter, page: number) {
    return await Api.get(`${pathUrl}/filter?page=${page}`, { params });
  }
  async function get_checkPromotion(params: IPromotionFilter, page: number) {
    return await Api.get(`${pathEmployeeUrl}/promotion/check?page=${page}`, { params });
  }
  async function calculatePromotion(params: IPromotionFilter) {
    return await Api.get(`${pathEmployeeUrl}/promotion/calculate`, { params });
  }

    
 

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
    Promotion,
    resetDataPromotion,
    DegreeStage,
    Promotiones,
    DegreeStages,
    sortedPromotiones,
    Employees,
    isLoading,
    error,
    get,
    get_filter,
    get_checkPromotion,
    calculatePromotion,
    get_Promotiones,
    get_Employees,
    get_EmployeesLite,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
