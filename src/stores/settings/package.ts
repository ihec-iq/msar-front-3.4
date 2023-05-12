import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import type IPackage from "@/types/settings/IPackage";
export const usePackageStore = defineStore("packageStore", () => {
  const packages = ref([]);
  const package0 = reactive<IPackage>({
    id: 0,
    name: "",
  });
  async function get() {
    return await Api.get(`/hd/package`);
  }
  async function store() {
    return await Api.post(`/hd/package`, package0);
  }
  // async function show(id: number) {
  //   return await Api.get(`${`/hd/feature/requests`}/${id}`);
  // }
  async function update() {
    return await Api.post(`/hd/package/${package0.id}`, package0);
  }

  return {
    package0,
    packages,
    get,
    // show,
    store,
    update,
    getError,
  };
});
