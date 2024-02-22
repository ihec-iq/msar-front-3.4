<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, onBeforeMount, watch } from "vue";
import TableComponent from "@/components/ihec/ITableNew.vue";
import JsonExcel from "vue-json-excel3";

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const data = ref<Array<IUser>>([]);
const dataPage = ref();
const dataBase = ref<Array<IUser>>([]);

const { user } = useUserStore();
const { get_filter } = useUserStore();
import { limits } from "@/utils/defaultParams";
import { usePermissionStore } from "@/stores/permissionStore";
import { useUserStore } from "@/stores/userStore";
import type { IUser, IUserFilter } from "@/types/core/IUser";
import { t } from "@wangeditor/editor";
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
const tableHeaders = ["Name", "Email", "Role"];

//#region Filter
const searchFilter = ref<IUserFilter>({
  limit: 10,
  name: "",
  email: "",
});
interface ISHOw {
  ID: number;
  Name: string;
  Email: string;
  Role: string;
  //   Details: string;
}
const showDataArr = ref<Array<ISHOw>>([]);
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  showDataArr.value = [];
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  await get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = dataPage.value.data;
        dataBase.value = dataPage.value.data;
        // /////
        data.value.forEach((user) => {
          const roleNames = user.roles.map((role) => role.name.slice(3));
          const showData: ISHOw = {
            ID: user.id,
            Name: user.name,
            Email: user.email,
            Role: roleNames.join(", "), // Join role names into a string
            // Details: `${user.name} - ${user.email}`,
          };

          showDataArr.value.push(showData);
        });
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
const inputRefSearch = ref<HTMLInputElement | null>(null);
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};

onBeforeMount(() => {
  isLoading.value = true;
});
onMounted(async () => {
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
});
</script>
<template>
  <IPage>
    <IPageHeader :title="t('UserIndex')">
      <template v-slot:buttons>
        <IButton width="28" :onClick="add" :text="t('Add')" />
      </template>
    </IPageHeader>

    <TableComponent :headers="tableHeaders" :items="showDataArr">
      <template v-slot:tableBar>
        <IRow>
          <IBtnSearch
            v-model="fastSearch"
            @get-filter-data="getFilterData()"
            @make-fast-search="makeFastSearch()"
          />
          <div
            class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]"
          >
            <div
              class="py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
            >
              <p>{{ t("Limit") }}:</p>
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
            <button
              @click="getFilterData()"
              class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
            >
              {{ t("VacationSearch") }}
            </button>
          </div>
          <div class="ml-4 lg:mt-0 xs:mt-2">
            <button
              @click="getFilterData()"
              class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
            >
              <JsonExcel :data="showDataArr" type="xlsx" name="filename.xls">
                Download Excel
              </JsonExcel>
            </button>
          </div>
        </IRow></template
      >
      <template v-slot:buttons>
        <div class="flex justify-center relative mt-2">
          <button
            class="peer mr-45 px-6 py-2.5 text-text dark:text-textLight font-medium rounded-md text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
            type="button"
          >
            <img
              src="https://img.icons8.com/office/344/menu-2.png"
              class="w-4 float-left"
              alt=""
            />
          </button>
          <ul
            class="dropdown-content menu hidden peer-hover:block hover:block min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border border-gray-600 bg-lightDropDown dark:bg-dropDown"
          >
            <li>
              <IButton width="28" :onClick="add" :text="t('Add')" />
            </li>
            <li>
              <IButton width="28" :onClick="add" :text="t('Update')" />
            </li>
          </ul>
        </div>
      </template>
    </TableComponent>
  </IPage>
</template>
