<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import type { IEmployeeHistory, IEmployeeFilter } from "@/types/IEmployee";
import { useEmployeeStore } from "@/stores/employee";
import { useOutputVoucherStore } from "@/stores/voucher/outputVoucher";
import { useCorruptedVoucherStore } from "@/stores/voucher/corruptedVoucher";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import WindowsDesign from "@/components/general/WindowsDesign.vue";
const outputVoucherStore = useOutputVoucherStore();
const corruptedVoucherStore = useCorruptedVoucherStore();

const { employees } = storeToRefs(useEmployeeStore());
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const { t } = useI18n();
const isLoading = ref(false);
const IsShowCorrupted = ref(false);
const data = ref<Array<IEmployeeHistory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployeeHistory>>([]);

const limits = reactive([
  { name: "6", val: 6, selected: false },
  { name: "12", val: 12, selected: true },
  { name: "24", val: 24, selected: false },
  { name: "50", val: 50, selected: false },
  { name: "All", val: 999999999 },
]);

const CorruptedVoucher = ref<{
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
const { SelectedOutItemCorrupted } = storeToRefs(corruptedVoucherStore);
//#region Search
const searchFilter = ref<IEmployeeFilter>({
  limit: 6,
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
      name: "inputVoucherUpdate",
      params: { id: id },
    });
  } else {
    router.push({
      name: "outputVoucherUpdate",
      params: { id: id },
    });
  }
};
const deleteItem = (index: number) => {
  SelectedOutItemCorrupted.value.splice(index, 1);
};
//#region Pagination
const createCorruptedVoucher = () => {
  //router.push({ name: "corruptedVoucherAdd" });
  CorruptedVoucher.value.items = SelectedOutItemCorrupted.value;
  console.log(CorruptedVoucher.value);

  corruptedVoucherStore
    .store(CorruptedVoucher.value)
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
  searchFilter.value.limit = 24;
  if (route.params.search != undefined)
    fastSearch.value = route.params.id.toString() || "";
  await outputVoucherStore.getEmployees().then(() => {});
  await getFilterData(1);
});
</script>
<template>
  <div class="justify-between flex">
    <PageTitle> {{ t("StoreIndex") }} </PageTitle>
  </div>
  <div class="flex">
    <!-- <Nav class="w-[5%]" /> -->
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div
        class="flex lg:flex-row xs:flex-col lg:justify-around xs:items-center mt-6"
      >
        <label for="table-search" class="sr-only">{{ t("Search") }}</label>
        <div class="relative flex">
          <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            v-model="fastSearch"
            @input="makeFastSearch()"
            class="block p-2 pl-10 w-80 text-sm text-text dark:text-textLight bg-lightInput dark:bg-input rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('SearchForItem')"
          />
        </div>
        <!-- limit -->
        <div
          class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]"
        >
          <div
            class="py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
          >
            <p>{{ t("Sort By") }}:</p>
            <select
              aria-label="select"
              v-model="searchFilter.limit"
              class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
              @change="getFilterData()"
            >
              <option
                v-for="limit in limits"
                :key="limit.val"
                :value="limit.val"
                :selected="limit.selected == true"
                class="text-sm text-indigo-800"
              >
                {{ limit.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <label class="cursor-pointer label">
            <span
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("StoreTypeReport") }} :
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
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <button
            @click="getFilterData()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("Search") }}
          </button>
        </div>
      </div>
      <WindowsDesign
        :width="250"
        class="col-11 shadow-lg rounded-2xl border-red-700"
        v-if="SelectedOutItemCorrupted.length > 0"
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
                  v-for="(row, index) in SelectedOutItemCorrupted"
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
                    v-model="CorruptedVoucher.number"
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
                    v-model="CorruptedVoucher.date"
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
                    v-model="CorruptedVoucher.signaturePerson"
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
                    v-model="CorruptedVoucher.requestEmployeeId"
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
              type="secondary"
              is-link
              @click="createCorruptedVoucher()"
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
                      <input type="checkbox" v-model="IsShowCorrupted" />
                      تفعيل سند اتلاف
                    </div>
                    <table class="min-w-full text-center">
                      <thead class="border-b bg-[#0003] text-gray-300">
                        <tr>
                          <th
                            scope="col"
                            class="text-sm font-medium px-6 py-4"
                            v-if="IsShowCorrupted"
                          >
                            {{ t("Selected") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Item") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Date") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("SerialNumber") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("BillType") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Available") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Price") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Stock") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
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
                          <th v-if="IsShowCorrupted">
                            <input
                              type="checkbox"
                              v-model="SelectedOutItemCorrupted"
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
                              type="secondary"
                              is-link
                              @click="openItem(row.Voucher.idVoucher, row.type)"
                              >Open
                            </van-button>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <TailwindPagination
                    class="flex justify-center mt-10"
                    :data="dataPage"
                    @pagination-change-page="getFilterData"
                    :limit="searchFilter.limit"
                  />
                </div>
              </div>
            </div>
            <SimpleLoading v-if="isLoading"></SimpleLoading>
            <!-- end card -->
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{
        'ltr:left-4 rtl:right-4': is,
        'ltr:left-28 rtl:right-28': !is,
      }"
      class="backBtn z-10 fixed bottom-2 lg:ml-3 xs:ml-0 print:hidden"
    >
      <button
        @click="back()"
        class="bg-back hover:bg-backHover h-10 duration-500 lg:w-32 xs:w-20 p-2 rounded-md text-white"
      >
        {{ t("Back") }}
      </button>
    </div>
  </div>
</template>
<style></style>
