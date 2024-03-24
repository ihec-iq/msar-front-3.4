import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import type { ISection } from "@/project/section/ISection";

export const useSectionStore = defineStore("sectionStore", () => {
  const section = reactive<ISection>({
    id: 0,
    name: "",
  });
  const sections = ref<Array<ISection>>([]);
  const pathBase = "";
  const pathUrl = `${pathBase}/section`;
  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function get_sections() {
    await Api.get(`${pathUrl}`)
      .then((response) => {
        if (response.status == 200) {
          sections.value = response.data.data;
        }
      })
      .catch((errors) => {
        console.log("in get section : " + errors);
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
    section,
    sections,
    get,
    get_sections,
    show,
    store,
    update,
    getError,
    _delete,
  };
});
