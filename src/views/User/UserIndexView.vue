<script setup lang="ts">
//region"Basic Import"
import SimpleLoading from "@/components/general/loading.vue";
import { useUserStore } from "@/stores/userStore";
import { usePermissionStore } from "@/stores/permissionStore";
import type { IUser, IUserFilter } from "@/types/core/IUser";
import { TailwindPagination } from "laravel-vue-pagination";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EnumPermission } from "@/utils/EnumSystem";
import JsonExcel from "vue-json-excel3";
import { t } from "@/utils/I18nPlugin";

//#region Vars
//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const data = ref<Array<IUser>>([]);
const dataPage = ref();
const dataBase = ref<Array<IUser>>([]);
const headers = ref<Array<ITableHeader>>([
  { caption: t("Name"), value: "name" },
  { caption: t("Email"), value: "email" },
  { caption: t("Role"), value: "roles" },
  { caption: t("Details"), value: "actions" },
]);
const { get_filter } = useUserStore();
import { limits } from "@/utils/defaultParams";
const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  },
);
//#endregion

//#endregion

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (vacation: IUser) => {
  if (vacation.Employee?.name.includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  getFilterData();
  return;
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
//#region Filter
const searchFilter = ref<IUserFilter>({
  limit: 10,
  name: "",
  email: "",
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  await get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = dataPage.value.data;
        dataBase.value = dataPage.value.data;
        makeExcel(data.value);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  isLoading.value = false;
};
//#endregion

//#endregion
const update = (id: number) => {
  router.push({
    name: "userUpdate",
    params: { id: id },
  });
};
const add = () => {
  router.push({
    name: "userAdd",
  });
};
//#region Search by Enter Key
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
const makeExcel = (data: any) => {};
const ExportExcel = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowUsers]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});
import { getCurrentInstance } from "vue";
import type { ITableHeader } from "@/types/core/components/ITable";
import ITable from "@/components/ihec/ITable.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import IInput from "@/components/inputs/IInput.vue";
const app = getCurrentInstance();
const trns = app?.appContext.config.globalProperties.$trns;
</script>
<template>
  <IPage :HeaderTitle="t('UserIndex')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="add" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <!-- date -->
          <ICol :span-lg="1" :span-md="2" :span="1">
            <IInput
              :label="t('UserSearch')"
              v-model="fastSearch"
              name="Name"
              type="text"
              :IsRequire="true"
              :getDataByInter="getFilterData"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:actions="{ row }">
            <div class="dropdown">
              <button
                class="dropdown-toggle peer mr-45 px-6 py-2.5 text-white font-medium rounded-md text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                type="button"
                id="dropdownMenuButton2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://img.icons8.com/office/344/menu--v1.png "
                  class="w-8 float-left"
                  alt=""
                />
              </button>

              <ul
                class="dropdown-menu top-8 peer-hover:block hover:block min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
                aria-labelledby="dropdownMenuButton2"
              >
                <li>
                  <EditButton @click="update(row.id)" />
                </li>
              </ul></div
          ></template>
          <template v-slot:email="{ row }">
            <span style="direction: ltr">{{ row.email }}</span>
          </template>
          <template v-slot:roles="{ row }">
            <span v-if="row.roles.length > 0">
              <p
                v-for="role in row.roles.slice(0, 3)"
                :key="role.id"
                class="text-sm leading-none text-text dark:text-textLight ml-2"
              >
                <IBadge>{{ role.name }}</IBadge>
              </p>
            </span>
          </template>
        </ITable>
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
                <div class="basis-1/5" v-if="searchFilter.limit > 1">
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
      </IRow>
    </IPageContent>
  </IPage>
</template>
<style></style>
