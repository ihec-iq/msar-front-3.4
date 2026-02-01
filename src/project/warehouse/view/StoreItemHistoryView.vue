import { ISection } from './../../section/ISection';
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { useSectionStore } from "@/project/section/sectionStore";

import { t } from "@/utilities/I18nPlugin";
import type { IStoreItemHistory, IStoreItemFilter, IInverntoryHistoryFilter } from "../IStore"; 
import { useStoringStore } from "../storingStore";
import { useOutputVoucherStore } from "@/project/warehouse/outputVoucher/outputVoucherStore";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { debounce } from "lodash";
import { limits } from "@/utilities/defaultParams";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import type { ITableHeader } from "@/types/core/components/ITable";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import ShowButton from "@/components/dropDown/ShowButton.vue";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import EditButton from "@/components/dropDown/EditButton.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import dropdownmenu from "../component/dropdownmenu.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import { Icon } from "@iconify/vue";
const { get_sections } = useSectionStore();
const { sections } = storeToRefs(useSectionStore());

const { checkPermissionAccessArray } = usePermissionsStore();
const route = useRoute();
const router = useRouter();

// Store initialization
const outputVoucherStore = useOutputVoucherStore();
const { outputVoucherEmployees } = storeToRefs(useOutputVoucherStore());
const { get_item } = useStoringStore();

// Reactive state
const isLoading = ref(false);
const data = ref<Array<IStoreItemHistory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStoreItemHistory>>([]);
const fastSearch = ref("");

// Search filter configuration
const searchFilter = ref<IInverntoryHistoryFilter>({
  itemId: "0",
  limit: 10,
});

// Table headers configuration
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

// Debounced search function
const debouncedSearch = debounce(async () => {
  await getFilterData(1);
}, 300);

// Watch for route param changes
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined) {
      fastSearch.value = newValue.toString() || "";
      await getFilterData(1);
    }
  }
);

// Watch for fast search changes
watch(fastSearch, () => {
  debouncedSearch();
});
// watch(Number(searchFilter.value.sectionId), () => {
//   getFilterData();
// });
// Filter functions
const filterByIDName = (item: IStoreItemHistory) => {
  const searchTerm = fastSearch.value.toLowerCase();
  return (
    item.itemName.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm)
  );
};

const makeFastSearch = () => {
  data.value =
    fastSearch.value === ""
      ? dataBase.value
      : dataBase.value.filter(filterByIDName);
};

// Data fetching
const getFilterData = async (page = 1) => {
  try {
    dataPage.value = [];
    data.value = [];
    dataBase.value = [];
    isLoading.value = true;

    // searchFilter.value.description = fastSearch.value;
    searchFilter.value.itemId = route.params.id.toString();
     
    const response = await get_item(searchFilter.value, page);console.log(response);
    if (response.status === 200) {
      dataPage.value = response.data.data;
      data.value = dataPage.value.data;console.log(data.value);
      dataBase.value = dataPage.value.data;
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Navigation functions
const openItem = (id: number, billType: string) => {
  const routeName =
    billType === "input" ? "inputVoucherUpdate" : (billType === "output" ? "outputVoucherUpdate" : "retrievalVoucherUpdate");
  router.push({
    name: routeName,
    params: { id },
  });
};

const history = (id: number) => {
  router.push({
    name: "employeeHistory",
    params: { id },
  });
};

// Lifecycle hooks
onMounted(async () => {
  try {
    checkPermissionAccessArray([EnumPermission.ShowStorage]);
    isLoading.value = true;

    if (route.params.search != undefined) {
      fastSearch.value = route.params.id.toString() || "";
    }

    await Promise.all([
      get_sections(),
      outputVoucherStore.getEmployees(),
      getFilterData(1),
    ]);
  } catch (error) {
    console.error("Error during component initialization:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <IPage :HeaderTitle="t('Store.ItemHistory')" :isLoading="isLoading">
    <IPageContent>
      <IRow>
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
            <IInput
              :label="t('Employee.Name')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
          <!-- <ICol>
            <ISelect
              class="w-[180px]"
              :options="sections"
              :label="t('Employee.Section')"
              name="EmployeeSection"
              v-model="searchFilter.sectionId"
              :autoFocus="true"
              :isSearchable="true"
              :isClearable="true"
            >
              <template v-slot:header>
                <input type="checkbox" v-model="searchFilter.isSection" />
              </template>
            </ISelect>
          </ICol>  -->
        </ISearchBar>
      </IRow>

      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:name="{ row }">
            <span>{{ row.Employee.name }}</span>
          </template>
 
          <template v-slot:billType="{ row }">
            <span>{{ row.billType === "input" ? t("In") : (row.billType === "output" ? t("Out") : t("Retrieval")) }}</span>
          </template>

          <template v-slot:price="{ row }">
            <span>{{ ConvertToMoneyFormat(row.price) }}</span>
          </template>

          <template v-slot:count="{ row }">
            <span
              :class="[
                row.count > 0
                  ? 'bg-green-100 dark:bg-green-200 dark:text-green-800'
                  : 'bg-red-100 dark:bg-red-200 dark:text-red-800',
                'text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded ml-2',
              ]"
            >
              {{ row.count > 0 ? "↓" : "↑" }}{{ Math.abs(row.count) }}
            </span>
          </template>

          <template v-slot:actions="{ row }">
            <dropdownmenu :openFn="() => openItem(row.voucherId, row.billType)">
              <template v-if="row.Employee?.id > 0">
                <DropdownMenuItem @click="history(row.Employee.id)">
                  <Icon icon="mdi-open" class="mr-2 h-4 w-4" />
                  <span>{{ t("Employee.HistoryReport") }}</span>
                </DropdownMenuItem>
              </template>
            </dropdownmenu>
          </template>
        </ITable>
      </IRow>
    </IPageContent>
    <template #Footer>
      <IFooter/>
    </template>
  </IPage>
</template>
