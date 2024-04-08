<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IEmployeeHistory, IEmployeeFilter } from "../IEmployee";
import { useEmployeeStore } from "../employeeStore";
import { useOutputVoucherStore } from "@/project/warehouse/outputVoucher/outputVoucherStore";
import { useRetrievalVoucherStore } from "@/project/warehouse/retrievalVoucher/retrievalVoucherStore";
import { storeToRefs } from "pinia";
import WindowsDesign from "@/components/general/WindowsDesign.vue";
import { usePermissionStore } from "@/project/user/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();

const outputVoucherStore = useOutputVoucherStore();
const retrievalVoucherStore = useRetrievalVoucherStore();

const { employees } = storeToRefs(useEmployeeStore());


const isLoading = ref(false);
const IsShowRetrieval = ref(false);
const data = ref<Array<IEmployeeHistory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployeeHistory>>([]);

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";

const RetrievalVoucher = ref<{
  number: string;
  date: string;
  signaturePerson: string;
  requestEmployeeId: string;
  items?: Array<IEmployeeHistory>;
}>({
  number: "",
  date: new Date().toISOString().split("T")[0],
  signaturePerson: "",
  requestEmployeeId: "1",
});

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
const back = () => {
  router.back();
};
//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IEmployeeHistory) => {
  if (
    item.Voucher.Item.name.includes(fastSearch.value) ||
    item.Voucher.serialNumber.includes(fastSearch.value)
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
const { SelectedOutItemRetrieval } = storeToRefs(retrievalVoucherStore);
//#region Search
const searchFilter = ref<IEmployeeFilter>({
  limit: 10,
  checked: true,
  name: "",
  employeeId: 0,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  searchFilter.value.employeeId = Number(route.params.id);
  await useEmployeeStore()
    .getItemHistory(searchFilter.value, page)
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
  await useEmployeeStore().get_employees();
  isLoading.value = false;
};
//#endregion
const openItem = (id: number, billType: string) => {
  if (billType == "In") {
    router.push({
      name: "outputVoucherUpdate",
      params: { id: id },
    });
  } else {
    router.push({
      name: "inputVoucherUpdate",
      params: { id: id },
    });
  }
};
const deleteItem = (index: number) => {
  SelectedOutItemRetrieval.value.splice(index, 1);
};
//#region Pagination
const createRetrievalVoucher = () => {
  //router.push({ name: "retrievalVoucherAdd" });
  RetrievalVoucher.value.items = SelectedOutItemRetrieval.value;
  console.log(RetrievalVoucher.value);

  retrievalVoucherStore
    .store(RetrievalVoucher.value)
    .then(async (response) => {
      if (response.status == 200) {
        alert("Operation successful");
        await getFilterData(1);
      }
    })
    .catch((error) => {
      alert("Errors : " + error);
    });
};
//#endregion

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  searchFilter.value.limit = 24;
  if (route.params.search != undefined)
    fastSearch.value = route.params.id.toString() || "";
  await outputVoucherStore.getEmployees().then(() => {});
  await getFilterData(1);
});
const headers = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Section"), value: "serialNumber" },
  { caption: t("Section"), value: "voucherDate" },
  { caption: t("Section"), value: "type" },
  { caption: t("Section"), value: "count" },
  { caption: t("Section"), value: "price" },
  { caption: t("Section"), value: "stock" },
  { caption: t("Details"), value: "actions" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('Store.Index')">
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1">
            <IInput
              :label="t('Search')"
              v-model="fastSearch"
              name="Name"
              type="text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
          <ICol :span-lg="1" :span-md="2" :span="1"
            ><div class="ml-4 lg:mt-0 xs:mt-2">
              <label class="cursor-pointer label">
                <span
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("Store.TypeReport") }} :
                  {{ searchFilter.checked ? " تجميعي " : " مفصل " }}</span
                >
                <input
                  type="checkbox"
                  v-model="searchFilter.checked"
                  class="toggle toggle-secondary"
                  checked
                  @change="getFilterData()"
                />
              </label>
            </div>
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <!-- <ITable :items="data" :headers="headers"></ITable> -->
        <WindowsDesign
          :width="250"
          class="col-11 shadow-lg rounded-2xl border-red-700"
          v-if="SelectedOutItemRetrieval.length > 0"
        >
          <template v-slot:header>
            <div class="">انشاء سند شطب</div>
          </template>
          <template v-slot:main>
            <div>
              <p class="p-[5px] text-right text-lg bg-[#1f2937]">
                تستطيع التعديل على كمية المواد من خلال تغير قيمة العدد.
              </p>
              <table class="min-w-full text-center">
                <thead class="border-b bg-[#0003] text-gray-300">
                  <tr class="bg-[#1f2937]">
                    <th scope="col" class="text-sm font-large px-6 py-4">
                      {{ t("Item") }}
                    </th>
                    <th scope="col" class="text-sm font-large px-6 py-4">
                      {{ t("SerialNumber") }}
                    </th>
                    <th scope="col" class="text-sm font-large px-6 py-4">
                      {{ t("Count") }}
                    </th>
                    <th scope="col" class="text-sm font-large px-6 py-4">
                      {{ t("Note") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody class="bg-[#1f2937]">
                  <tr
                    v-for="(row, index) in SelectedOutItemRetrieval"
                    :key="row.id"
                    class="border-b border-black h-14 text-gray-100"
                  >
                    <th>{{ row.Voucher.Item.name }}</th>
                    <th>{{ row.Voucher.serialNumber }}</th>
                    <th>
                      <input
                        class="w-[50px] p-2"
                        type="number"
                        :value="row.count"
                        min="1"
                        :max="row.count"
                      />
                    </th>
                    <th>
                      <input
                        class="w-[450px] p-2"
                        type="text"
                        :value="row.notes"
                      />
                    </th>
                    <th>
                      <button
                        class="border-none duration-900 h-[40px] p-[5px] m-[5px] rounded-sm bg-delete hover:bg-deleteHover"
                        is-link
                        @click="deleteItem(index)"
                      >
                        Remove
                      </button>
                    </th>
                  </tr>
                </tbody>
              </table>
              <div class="flex bg-[#1f2937]">
                <div class="w-4/12 mr-2">
                  <div
                    class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                  >
                    {{ t("NumberVoucher") }}
                    <input
                      v-model="RetrievalVoucher.number"
                      type="text"
                      class="w-full outline-none h-10 px-3 py-2 border-2 border-emerald-900 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
                    />
                  </div>
                </div>
                <div class="w-4/12 mr-2 flex">
                  <div
                    class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                  >
                    {{ t("Date") }}
                    <input
                      v-model="RetrievalVoucher.date"
                      type="date"
                      class="w-full outline-none h-10 px-3 py-2 border-2 border-emerald-900 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
                    />
                  </div>
                </div>
                <div class="w-4/12 mr-2 flex">
                  <div
                    class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                  >
                    {{ t("InputVoucherSignaturePerson") }}
                    <input
                      v-model="RetrievalVoucher.signaturePerson"
                      type="text"
                      class="w-full outline-none h-10 px-3 py-2 border-2 border-emerald-900 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
                    />
                  </div>
                </div>
                <div class="w-4/12 mr-2 flex">
                  <div
                    class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                  >
                    {{ t("InputVoucherEmployeeRequest") }}

                    <select
                      v-model="RetrievalVoucher.requestEmployeeId"
                      class="w-full outline-none h-10 px-3 py-2 border-2 border-emerald-900 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
                    >
                      <option
                        v-for="employee in employees"
                        :key="employee.id"
                        :value="employee.id"
                        class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                      >
                        {{ employee.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:footer>
            <div class="w-full bg-slate-600 p-2 flex">
              <van-button
                class="border-1 border-b border-black h-14 text-gray-100 duration-500 rounded-lg bg-amber-600 font-bold hover:bg-createHover"
                type="success"
                is-link
                @click="createRetrievalVoucher()"
                >انشاء سند شطب
              </van-button>
            </div>
          </template>
        </WindowsDesign>
        <div class="w-full">
          <div class="flex flex-col">
            <div class="py-4 inline-block min-w-full lg:px-8">
              <!-- card -->

              <div class="rounded-xl" v-if="isLoading == false">
                <div
                  v-motion
                  :initial="{ opacity: 0, y: -15 }"
                  :enter="{ opacity: 1, y: 0 }"
                  :variants="{ custom: { scale: 2 } }"
                  :delay="200"
                  v-if="data.length > 0"
                >
                  <div class="mt-10 p-6">
                    <div class="w-12/12 mx-2">
                      <div
                        class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                      >
                        <input type="checkbox" v-model="IsShowRetrieval" />
                        تفعيل سند اتلاف
                      </div>
                      <table class="min-w-full text-center">
                        <thead class="border-b bg-[#0003] text-gray-300">
                          <tr>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                              v-if="IsShowRetrieval"
                            >
                              {{ t("Selected") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("Item") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("Date") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("SerialNumber") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("BillType") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("Available") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("Price") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("Stock") }}
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium px-6 py-4"
                            >
                              {{ t("Actions") }}
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-[#1f2937]">
                          <tr
                            v-for="row in data"
                            :key="row.id"
                            class="border-b border-black h-14 text-gray-100"
                            :class="{
                              'bg-[#19472a26]': row.count > 0,
                              'bg-[#d7000017]': row.count < 0,
                            }"
                          >
                            <th v-if="IsShowRetrieval">
                              <input
                                type="checkbox"
                                v-model="SelectedOutItemRetrieval"
                                :value="row"
                              />
                            </th>
                            <th>{{ row.Voucher.Item.name }}</th>
                            <th>{{ row.Voucher.date }}</th>
                            <th>{{ row.Voucher.serialNumber }}</th>
                            <th>{{ row.type }}</th>
                            <th>
                              <span
                                v-if="row.count > 0"
                                class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2"
                                >↑{{ row.count }}</span
                              >
                              <span
                                v-else
                                class="bg-red-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-2"
                                >↓{{ row.count }}</span
                              >
                            </th>
                            <th>{{ row.price.toLocaleString() }}</th>
                            <th>{{ row.Voucher.Stock.name }}</th>
                            <th>
                              <van-button
                                class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
                                type="primary"
                                is-link
                                @click="
                                  openItem(row.Voucher.idVoucher, row.type)
                                "
                                >Open
                              </van-button>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div class="py-4 min-w-full w-full h-full lg:px-8">
                      <!-- card -->
                      <div class="rounded-xl" v-if="isLoading == false">
                        <div
                          v-motion
                          :initial="{ opacity: 0, y: -15 }"
                          :enter="{ opacity: 1, y: 0 }"
                          :variants="{ custom: { scale: 2 } }"
                          :delay="200"
                          v-if="data.length > 0"
                        >
                          <div class="w-full flex flex-row">
                            <div class="basis-4/5 overflow-x-auto font-Tajawal">
                              <TailwindPagination
                                class="flex justify-center mt-6"
                                :data="dataPage"
                                @pagination-change-page="getFilterData"
                                :limit="searchFilter.limit"
                              />
                            </div>
                            <div
                              class="basis-1/5"
                              v-if="data.length >= limits[0].id"
                            >
                              <ISelect
                                :label="t('Limit')"
                                v-model="searchFilter.limit"
                                name="archiveTypeId"
                                :options="limits"
                                :IsRequire="true"
                                @onChange="getFilterData()"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <SimpleLoading v-if="isLoading"></SimpleLoading>
                      <!-- end card -->
                    </div>
                  </div>
                </div>
              </div>
              <!-- end card -->
            </div>
          </div>
        </div>
        
      </IRow>
    </IPageContent>
  </IPage>
</template>@/utilities/I18nPlugin@/utilities/defaultParams@/utilities/EnumSystem
