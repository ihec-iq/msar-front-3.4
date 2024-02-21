<script setup lang="ts">
import SimpleLoading from "@/components/general/loading.vue";
import { useArchiveStore } from "@/stores/archives/archiveStore";

import { t } from "@/utils/I18nPlugin";
import { usePermissionStore } from "@/stores/permissionStore";
import type { IArchive, IArchiveFilter } from "@/types/archives/IArchive";
import { TailwindPagination } from "laravel-vue-pagination";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardArchiveIndex from "@/components/ihec/archive/CardArchiveIndex.vue";

import IPage from "@/components/ihec/IPage.vue";
import IButton from "@/components/ihec/IButton.vue";

const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const data = ref<Array<IArchive>>([]);
const dataPage = ref();
const dataBase = ref<Array<IArchive>>([]);
const { archive } = useArchiveStore();
const { get_filter } = useArchiveStore();

import { limits } from "@/utils/defaultParams";
import IInput from "@/components/inputs/IInput.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import IPageContent from "@/components/ihec/archive/IPageContent.vue";
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
import { EnumPermission } from "@/utils/EnumSystem";
import CardsArchiveTypeindex from "@/components/ihec/archive/CardsArchiveTypeindex.vue";

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1, -1);
  }
);
const addArchive = () => {
  archive.id = 0;
  archive.title = "";
  archive.issueDate = new Date().toISOString().split("T")[0];
  archive.files = [];
  archive.number = "";
  archive.description = "";
  archive.isIn = 1;
  archive.sectionId = 1;
  archive.archiveTypeId = 0;
  router.push({
    name: "archiveAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IArchive) => {
  if (
    item.title.includes(fastSearch.value) ||
    item.way.includes(fastSearch.value) ||
    item.number.includes(fastSearch.value)
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
const searchFilter = ref<IArchiveFilter>({
  title: "",
  limit: 10,
  issueDateFrom: new Date(new Date().setDate(new Date().getDate() - 360))
    .toISOString()
    .split("T")[0],
  issueDateTo: new Date().toISOString().split("T")[0],
  description: "",
  way: "",
  number: "",
  isIn: -1,
  sectionId: -1,
  archiveTypeId: -1,
});
const scrollPageTo = (navEl: string) => {
  let element = document.getElementById(navEl);
  //element?.scrollIntoView({ behavior: "smooth" });
  // console.log(navEl);
  // console.log(element?.offsetTop);
  window.scrollTo({
    top: Number(element?.offsetTop) + 1200,
    left: Number(element?.offsetLeft),
    behavior: "smooth",
  });
};
const getFilterData = async (page = 1, archiveType: number = 0) => {
  isLoading.value = true;
  searchFilter.value.number = fastSearch.value;
  if (archiveType != 0) {
    searchFilter.value.archiveTypeId = archiveType;
  }
  await get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = response.data.data.data;
        dataBase.value = response.data.data.data;
        if (searchFilter.value.limit == 6) {
          scrollPageTo("PageDataEnd");
        } else {
          scrollPageTo("PageDataStart");
        }
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
  checkPermissionAccessArray([EnumPermission.ShowArchives]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";

  await getFilterData(1, -1);
});
</script>
<template>
  <IPage :HeaderTitle="t('Archive')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addArchive" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Title')"
              :placeholder="t('SearchForArchive')"
              v-model="fastSearch"
              type="text"
            />
          </ICol>
          <!-- date -->
          <ICol :span-lg="1" :span-md="2" :span="1">
            <IInput
              :label="t('DateFrom')"
              v-model="searchFilter.issueDateFrom"
              name="issueDateFrom"
              type="date"
              :IsRequire="true"
            />
          </ICol>
          <ICol :span-lg="1" :span-md="2">
            <IInput
              :label="t('DateTo')"
              v-model="searchFilter.issueDateTo"
              name="issueDateTo"
              type="date"
              :IsRequire="true"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <CardsArchiveTypeindex :OnClick="getFilterData"></CardsArchiveTypeindex>
      </IRow>
      <IRow
        ><div class="rounded-xl" v-if="isLoading == false">
          <div
            v-motion
            :initial="{ opacity: 0, y: -15 }"
            :enter="{ opacity: 1, y: 0 }"
            :variants="{ custom: { scale: 2 } }"
            :delay="200"
            v-if="data.length > 0"
          >
            <div class="max-w-full relative">
              <div
                class="grid lg:grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-5 lg:m-0 xs:mx-3"
              >
                <CardArchiveIndex
                  v-for="item in data"
                  :key="item.id"
                  :item="item"
                ></CardArchiveIndex>
              </div>
              <TailwindPagination
                class="flex justify-center mt-10"
                :data="dataPage"
                @pagination-change-page="getFilterData"
                :limit="searchFilter.limit"
              />
              <ISelect
                v-if="data.length >= searchFilter.limit"
                :label="t('Limit')"
                v-model="searchFilter.limit"
                name="archiveTypeId"
                :options="limits"
                @change="getFilterData()"
              />
            </div>
          </div>
        </div>
        <SimpleLoading v-if="isLoading">.</SimpleLoading></IRow
      >
      <IRow><div id="PageDataEnd"></div></IRow>
    </IPageContent>
  </IPage>
</template>
