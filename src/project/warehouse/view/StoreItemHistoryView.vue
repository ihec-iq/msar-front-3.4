<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import type { IStoreItemHistory, IStoreItemFilter } from "../IStore";
import { useStoringStore } from "../storingStore";
import { useOutputVoucherStore } from "@/project/warehouse/outputVoucher/outputVoucherStore";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();

const outputVoucherStore = useOutputVoucherStore();
const { outputVoucherEmployees } = storeToRefs(useOutputVoucherStore());

const isLoading = ref(false);
const data = ref<Array<IStoreItemHistory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStoreItemHistory>>([]);

const { get_item } = useStoringStore();

import { limits } from "@/utilities/defaultParams";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import type { ITableHeader } from "@/types/core/components/ITable";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import ShowButton from "@/components/dropDown/ShowButton.vue";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import EditButton from "@/components/dropDown/EditButton.vue";
import IInput, { EnumInputType } from "@/components/inputs/IInput.vue";

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
    item.description.includes(fastSearch.value)
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
  description: "",
  summation: true,
  isEmployee: false,
  employeeId: 0,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.description = fastSearch.value;
  searchFilter.value.itemId = route.params.id.toString();
  console.log(searchFilter.value);

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
const history = (id: number) => {
  router.push({
    name: "employeeHistory",
    params: { id: id },
  });
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowStorage]);
  isLoading.value = true;
  if (route.params.search != undefined)
    fastSearch.value = route.params.id.toString() || "";
  await outputVoucherStore.getEmployees().then(() => {});

  await getFilterData(1);
  isLoading.value = false;
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("Item.Name"), value: "itemName" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Description"), value: "Description" },
  { caption: t("BillType"), value: "billType" },
  { caption: t("AvailableInStock"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Stock"), value: "stockName" },
  { caption: t("Employee.Title"), value: "name" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('Store.ItemHistory')" :isLoading="isLoading">
    <IPageContent>
      <IRow :col="4" :col-md="4" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
            <IInput
              :label="t('Title')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              :type="EnumInputType.Text"
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
              {{ t("Store.TypeReport") }} :
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
          <template v-slot:price="{ row }">
            <span>{{ ConvertToMoneyFormat(row.price) }}</span></template
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
                <ShowButton @click="openItem(row.voucherId, row.billType)" />
              </li>
              <li v-if="row.Employee.id > 0">
                <EditButton
                  :title="t('Employee.HistoryReport')"
                  @click="history(row.Employee.id)"
                />
              </li>
            </IDropdown>
          </template>
        </ITable>
      </IRow>
    </IPageContent>
  </IPage>
</template>
