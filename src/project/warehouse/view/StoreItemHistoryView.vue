<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IStoreItemHistory, IStoreItemFilter } from "@/types/IStore";
import { useStoringStore } from "@/stores/warehouse/storingStore";
import { useOutputVoucherStore } from import { useOutputVoucherStore } from "@/project/warehouse/outputVoucher/outputVoucherStore";;
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/project/user/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();

const outputVoucherStore = useOutputVoucherStore();
const { outputVoucherEmployees } = storeToRefs(useOutputVoucherStore());

const isLoading = ref(false);
const data = ref<Array<IStoreItemHistory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStoreItemHistory>>([]);

const { get_item } = useStoringStore();

import { limits } from "@/utils/defaultParams";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import type { ITableHeader } from "@/types/core/components/ITable";
;
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission } from "@/utils/EnumSystem";

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
const filterByIDName = (item: IStoreItemHistory) => {
  if (
    item.itemName.includes(fastSearch.value) ||
    item.serialNumber.includes(fastSearch.value)
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
const searchFilter = ref<IStoreItemFilter>({
  itemId: "0",
  limit: 10,
  serialNumber: "",
  summation: true,
  isEmployee: false,
  employeeId: 0,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.serialNumber = fastSearch.value;
  searchFilter.value.itemId = route.params.id.toString();
  await get_item(searchFilter.value, page)
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
const openItem = (id: number, billType: string) => {
  if (billType == "in") {
    router.push({
      name: "inputVoucherUpdate",
      params: { id: id },
    });
  } else if (billType == "out") {
    router.push({
      name: "outputVoucherUpdate",
      params: { id: id },
    });
  }
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowStorage]);

  if (route.params.search != undefined)
    fastSearch.value = route.params.id.toString() || "";
  await outputVoucherStore.getEmployees().then(() => {});

  await getFilterData(1);
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("Item"), value: "itemName" },
  { caption: t("SerialNumber"), value: "serialNumber" },
  { caption: t("BillType"), value: "billType" },
  { caption: t("AvailableInStock"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Stock"), value: "stockName" },
  { caption: t("Employee"), value: "name" },
  { caption: t("Details"), value: "actions" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('StoreIndex')">
    <IPageContent>
      <IRow :col="4" :col-md="4" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
            <IInput
              :label="t('Title')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              type="text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
          <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
            <ISelect
              :options="outputVoucherEmployees"
              @onChange="getFilterData()"
              :label="t('Employee')"
              :name="t('Employee')"
            >
            </ISelect>
          </ICol>
          <!-- report type -->
          <ICol :span-lg="1" :span-md="1" :span="1">
            <ICheckbox
              v-model="searchFilter.summation"
              :checked="searchFilter.summation"
              @change="getFilterData()"
            >
              {{ t("StoreTypeReport") }} :
              {{ searchFilter.summation ? " تجميعي " : " مفصل " }}</ICheckbox
            >
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:name="{ row }">
            <span>{{ row.Employee.name }}</span></template
          >
          <template v-slot:billType="{ row }">
            <span>{{
              row.billType == "in" ? t("In") : t("Out")
            }}</span></template
          >
          <template v-slot:count="{ row }">
            <span
              v-if="row.count > 0"
              class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2"
              >↓{{ row.count }}</span
            >
            <span
              v-else
              class="bg-red-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-2"
              >↑{{ row.count }}</span
            ></template
          >
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton @click="openItem(row.voucherId, row.billType)" />
              </li>
            </IDropdown>
          </template>
        </ITable>
      </IRow>
    </IPageContent>
  </IPage>
</template>
@/project/user/permissionStore@/views/Warehouse/OutputVoucher/outputVoucherStore@/views/Warehouse/warehouse/storingStore@/views/Warehouse/storingStore@/project/warehouse/IStore