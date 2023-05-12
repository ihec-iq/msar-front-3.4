import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
export const useCountryStore = defineStore("useCountryStore", () => {
  const countries = ref([]);

  async function get() {
    if (countries.value.length < 1) {
      await Api.get("/core/country").then((response) => {
        countries.value = response.data.data;
      });
    }
  }
  onMounted(async () => {
    await get();
  });
  return { countries, get };
});
