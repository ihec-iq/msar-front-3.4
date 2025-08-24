<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import type { IStore, IStoreFilter } from "../IStore";
import { useStoringStore } from "../storingStore";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const data = ref<Array<IBarrenSectionReportView>>([]);
const dataPage = ref();
const dataBase = ref<Array<IBarrenSectionReportView>>([]);

const router = useRouter();
const route = useRoute();
const id = ref(Number(route.params.id));

const { get_BarrenSectionId } = useStoringStore();

import { limits } from "@/utilities/defaultParams";
import ICol from "@/components/ihec/ICol.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import IPage from "@/components/ihec/IPage.vue";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import ITable from "@/components/ihec/ITable.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import CardBarrenSectionReportIndex from "../component/CardBarrenSectionReportIndex.vue";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import { on } from "events";
import { useSectionStore } from "@/project/section/sectionStore";
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
const filterByIDName = (item: IBarrenSectionReportView) => {
  if (
    item.itemName.includes(fastSearch.value) ||
    item.count.toString().includes(fastSearch.value)
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
const sectionName = ref("")
const getSection=async ()=>{
  sectionName.value=''
  await useSectionStore().show(id.value).then((response) =>{
    sectionName.value = response.data.data.name
  })
}
const getFilterData = async (page = 1) => {
  getSection()
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.id = id.value;
  searchFilter.value.item = fastSearch.value;
  searchFilter.value.description = fastSearch.value;

  await get_BarrenSectionId(searchFilter.value, page)
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
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowStorage]);

  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});
interface IBarrenSectionReportView {
  itemId: number;
  itemName: string;
  count: number;
  numberOutput: string;
  dateOutput: string;
  price: number;
  employeeName: string;
  employeeId: number;
  OutputId : number
}
interface IGroupedReport {
  employeeName: string;
  employeeId: number;
  items: {
    itemId: number;
    itemName: string;
    count: number;
    numberOutput: string;
    dateOutput: string;
    price: number;
    OutputId: number;
  }[];
}
function groupByEmployee(data: IBarrenSectionReportView[]): IGroupedReport[] {
  const map = new Map<number, IGroupedReport>();

  data.forEach((row) => {
    if (!map.has(row.employeeId)) {
      map.set(row.employeeId, {
        employeeName: row.employeeName,
        employeeId: row.employeeId,
        items: [],
      });
    }

    map.get(row.employeeId)!.items.push({
      itemId: row.itemId,
      itemName: row.itemName,
      count: row.count,
      numberOutput: row.numberOutput,
      dateOutput: row.dateOutput,
      price: row.price,
      OutputId: row.OutputId,
    });
  });

  return Array.from(map.values());
}

const headers = ref<Array<ITableHeader>>([
  { caption: t("Details"), value: "actions" },
  { caption: t("Item.Name"), value: "itemName" },
  { caption: t("Count"), value: "count" },
  { caption: t("OutputVoucher.Number"), value: "numberOutput" },
  { caption: t("OutputVoucher.Date"), value: "dateOutput" },
  { caption: t("Price"), value: "price" },
  { caption: t("Note"), value: "note" },
]);
const groupedData = computed(() => groupByEmployee(data.value));
const checkGroup = ref(true);
const showGroupedData = () => {
  if (checkGroup.value) {
    //data.value = groupedData.value;
  } else {
    //data.value = dataBase.value;
  }
}
const goToDetails = (id : number) => {
  router.push({
    name: "outputVoucherUpdate",
    params: { id:  id },
  });
};

</script>
<template>
  <IPage :HeaderTitle="t('Store.BarrenSectionIndex') + ' - ' + sectionName" :isLoading="isLoading">
    <IPageContent>
      <IRow  >
        <ISearchBar :getDataButton="getFilterData" class="min-w-[500px] ">
          <ICol>
            <IInput :label="t('Title')" :placeholder="t('Search')" v-model="fastSearch" :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData" />       
          </ICol>
          <ICol>
            <ICheckbox label="عرض بشكل تجميعي" v-model="checkGroup"  
              :onChange="showGroupedData"/>       
          </ICol>
          <ICol v-if="data.length >= limits[0].id" >
                <ISelect :label="t('Limit')" v-model="searchFilter.limit" name="archiveTypeId" :options="limits"
                  :IsRequire="true" @onChange="getFilterData()" /> 
          </ICol> 
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers" v-if="!checkGroup">
          <template v-slot:actions="{ row }">
             <button class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 transition-colors duration-200"  @click="goToDetails(row.OutputId)">
              <i class="fas fa-external-link-alt mr-1"></i>{{ t('Open') }}
            </button>
          </template>
          <template v-slot:count="{ row }">
            <span
              class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2">↓{{
                ConvertToMoneyFormat(row.count) }}
            </span>
          </template>
          <template v-slot:price="{ row }">
            <span> {{ ConvertToMoneyFormat(row.price) }}</span>
          </template>  
        </ITable>
        <div v-else> 
              <div v-for="item in groupedData">
                <div class="bg-gray-100 p-2 rounded-md">
                  <div class="flex justify-between items-center">
                    <div class="font-bold">{{ item.employeeName }}</div>
                  </div>
                  <div class="mt-2">
                    <ITable :items="item.items" :headers="headers"   >
                    <template v-slot:actions="{ row }">
                      <button class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 transition-colors duration-200"  @click="goToDetails(row.OutputId)">
                        <i class="fas fa-external-link-alt mr-1"></i>{{ t('Open') }}
                      </button>
                    </template>
                    <template v-slot:count="{ row }">
                      <span
                        class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2">↓{{
                          ConvertToMoneyFormat(row.count) }}
                      </span>
                    </template>
                    <template v-slot:price="{ row }">
                      <span> {{ ConvertToMoneyFormat(row.price) }}</span>
                    </template>  
                    </ITable>
                  </div>
                </div>
              </div>
        </div>
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
