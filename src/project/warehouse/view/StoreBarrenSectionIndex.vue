<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import type { IStore, IStoreFilter } from "../IStore";
import { useStoringStore } from "../storingStore";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const data = ref<Array<IBarrenSectionReportIndex>>([]);
const dataPage = ref();
const dataBase = ref<Array<IBarrenSectionReportIndex>>([]);


const { get_BarrenSection } = useStoringStore();

import { limits } from "@/utilities/defaultParams";
import ICol from "@/components/ihec/ICol.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import IPage from "@/components/ihec/IPage.vue";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import ITable from "@/components/ITable/ITable.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import CardBarrenSectionReportIndex from "../component/CardBarrenSectionReportIndex.vue";
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
//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IBarrenSectionReportIndex) => {
  if (
    item.sectionName.includes(fastSearch.value) ||
    item.count.includes(fastSearch.value)
  ) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  // eslint-disable-next-line no-self-assign
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IStoreFilter>({
  item: "",
  limit: 999999999,
  description: "",
  summation: true,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.item = fastSearch.value;
  searchFilter.value.description = fastSearch.value;

  await get_BarrenSection(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = dataPage.value.data;
        dataBase.value = dataPage.value.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });


  isLoading.value = false;
};
//#endregion
const openItem = (id: number) => {
  router.push({
    name: "ItemHistory",
    params: { id: id },
  });
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowStorage]);

  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});
interface IBarrenSectionReportIndex {
  sectionId: number;
  sectionName: string; 
  count: string; 
}

 
</script>
<template>
  <IPage :HeaderTitle="t('Store.BarrenSectionIndex')" :isLoading="isLoading">
    <IPageContent>
      <IRow  >
        <ISearchBar :getDataButton="getFilterData" class="min-w-[500px] ">
          <ICol>
            <IInput :label="t('Title')" :placeholder="t('Search')" v-model="fastSearch" :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData" />       
          </ICol>
          <ICol v-if="data.length >= limits[0].id" >
                <ISelect :label="t('Limit')" v-model="searchFilter.limit" name="archiveTypeId" :options="limits"
                  :IsRequire="true" @onChange="getFilterData()" /> 
          </ICol> 
        </ISearchBar>
      </IRow>
      <IRow>
      <IRow :cols="2"  :cols-lg="2" :cols-md="2" :cols-sm="1" >
        <ICol :span="1" :span-lg="1" :span-md="1" v-for="item in data" :key="item.sectionId">
          <CardBarrenSectionReportIndex :item="item" />
        </ICol>
      </IRow>
      </IRow>
      <IRow v-if="data.length > 0">
        <div class="w-full flex flex-row">
          <div class="basis-5/5 hidden">
            <TailwindPagination class="flex justify-center mt-6" :data="dataPage"
              @pagination-change-page="getFilterData" :limit="searchFilter.limit" />
          </div>
          
        </div>
        <SimpleLoading v-if="isLoading">.</SimpleLoading>
      </IRow>
      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false" />
  </IPage>
</template>
<style></style>
