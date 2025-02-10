<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeCenterStore } from "../employeeCenterStore";
import type { IEmployeeCenter } from "../IEmployeeCenter";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";

import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();

const isLoading = ref(false);
const data = ref<Array<IEmployeeCenter>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployeeCenter>>([]);
const { employeeCenter } = useEmployeeCenterStore();
const EmployeeCenterStore = useEmployeeCenterStore();
import CardEmployeeCenterIndex from "./CardEmployeeCenterIndex.vue";


import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const add = () => {
  employeeCenter.id = 0;
  employeeCenter.name = "";
  router.push({
    name: "EmployeeCenterAdd",
  });
};



//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IEmployeeCenter) => {
  if (item.name.includes(fastSearch.value)) {
    return true;
  } else return false;
};

const makeFastSearch = () => {
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
 
const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
   await EmployeeCenterStore
    .get()

     .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data;
        data.value = response.data.data;
        dataBase.value = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};
//#endregion
const update = (id: number) => {
  router.push({
    name: "EmployeeTypeUpdate",
    params: { id: id },
  });

};

//#region Pagination
//#endregion
onMounted(async () => {
  isLoading.value = true;
  //checkPermissionAccessArray([EnumPermission.ShowCategoriesItem]);
  checkPermissionAccessArray([EnumPermission.ShowWarehouseSettings]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
  isLoading.value = false;
});
</script>
<template>
  <IPage :HeaderTitle="t('Employee.Center')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="add" :text="t('Add')" />
    </template>

    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Search')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow :col="2" :colMd="2" :colLg="2">
        <ICol class="p-3" :span="2" v-for="item in data" :key="item.id">
          <CardEmployeeCenterIndex :item="item" />
          <SimpleLoading v-if="isLoading"></SimpleLoading>
        </ICol>
      </IRow> 

    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"/>
  </IPage>
</template>
