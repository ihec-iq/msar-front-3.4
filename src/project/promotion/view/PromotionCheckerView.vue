<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePromotionStore } from "../promotionStore"; // Updated to use promotion store
import { useSectionStore } from "@/project/section/sectionStore";

import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IPromotion, IPromotionFilter } from "../IPromotion"; // Updated to use promotion types
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const { promotions } = storeToRefs(usePromotionStore()); // Updated to use promotion store
const { sections } = storeToRefs(useSectionStore());

const data = ref<Array<IEmployee>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployee>>([]);
const { get_checkPromotion, calculatePromotion } = usePromotionStore(); // Updated to use promotion store

import { limits } from "@/utilities/defaultParams";
import IButton from "@/components/ihec/IButton.vue";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission, EnumSetting } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import IPage from "@/components/ihec/IPage.vue";
import { IEmployee } from "@/project/employee/IEmployee";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import { useSettingStore } from "@/project/core/settingStore";
import { ISetting } from "@/project/core/ISetting";
import ITable from "@/components/ihec/ITable.vue";
import { EnumInputType } from "@/components/inputs/IInput.vue";
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
const filterByIDName = (Promotion: IPromotion) => { // Updated to use promotion type
    if (Promotion.Employee.name.includes(fastSearch.value)) {
        return true;
    } else return false;
};
const makeFastSearch = () => {
    return;
};
//#endregion
//#region Search
const SettingStore = useSettingStore();
const SettingNumberDayesAlertPromotion = ref<ISetting>({ // Updated to use promotion setting
    id: 0,
    key: EnumSetting.SettingPromotionAlertData,
});
const searchFilter = ref<IPromotionFilter>({ // Updated to use promotion filter
    employeeName: "",
    limit: 10,
    title: "",
    isBound: true
});
const getFilterData = async (page = 1) => {
    localStorage.setItem("checkPromotion", page.toString()); // Updated to use promotion
    isLoading.value = true;
    searchFilter.value.employeeName = fastSearch.value;
    await get_checkPromotion(searchFilter.value, page) // Updated to use promotion store
        .then((response) => {
            if (response.status == 200) {
                dataPage.value = response.data.data;
                data.value = response.data.data.data;
                dataBase.value = response.data.data.data;
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
        name: "employeeUpdate",
        params: { id: id },
    });
};
const recheck = async () => {
    isLoading.value = true;
    await calculatePromotion(searchFilter.value); // Updated to use promotion calculation
    await getFilterData(1);
    isLoading.value = false;
};
//#region Pagination
//#endregion
onMounted(async () => {
    isLoading.value = true;
    checkPermissionAccessArray([EnumPermission.ShowEmployees]);
    if (route.params.search != undefined)
        fastSearch.value = route.params.search.toString() || "";
    await SettingStore.showByKey(SettingNumberDayesAlertPromotion.value.key).then((response) => { // Updated to use promotion setting
        Object.assign(SettingNumberDayesAlertPromotion.value, response);
    })
    let index = 1;

    if (localStorage.getItem("checkPromotion") != undefined) // Updated to use promotion
        index = Number(localStorage.getItem("checkPromotion"));
    await getFilterData(index);
    isLoading.value = false;
});

const headers = ref<Array<ITableHeader>>([
    { caption: t("Employee.Title"), value: "name" },
    { caption: t("Details"), value: "actions" },
    { caption: t("Promotion.dateLastPromotion"), value: "dateLastPromotion" }, // Updated for promotion
    { caption: t("Promotion.difNextDate"), value: "difNextDateShow" }, // Updated for promotion
    { caption: t("Promotion.dateNextBonus"), value: "dateNextBonus" }, // Updated for promotion
    { caption: t("Promotion.Study"), value: "promotionStudy" }, // Updated for promotion
    { caption: t("Promotion.DegreeStage"), value: "promotionDegreeStage" }, // Updated for promotion
]);
</script>
<template>
    <IPage :HeaderTitle="t('Promotion.Alert')" :is-loading="isLoading"> <!-- Updated for promotion -->
        <template #HeaderButtons>
            <IButton width="28" :onClick="recheck" :text="t('Promotion.ReCalculate')" /> <!-- Updated for promotion -->
        </template>
        <IPageContent>
            <IRow :col="3" :col-md="2" :col-lg="3">
                <ISearchBar :getDataButton="getFilterData">
                    <ICol :span-lg="2" :span-md="2" :span="2" :span-sm="4">
                        <IInput :label="t('SearchForUser')" :placeholder="t('SearchForUser')" v-model="fastSearch"
                            :type="EnumInputType.Text" :OnKeyEnter="getFilterData" />
                    </ICol>
                    <ICol :span-lg="1" :span-md="2" :span="1">
                        <ICheckbox
                            :label="t('Promotion.IsBoundFilter') + ' ' + SettingNumberDayesAlertPromotion.valInt + ' ' + t('Day')"
                            v-model="searchFilter.isBound" :IsRequire="true" @onChange="getFilterData()" />
                    </ICol>
                </ISearchBar>
            </IRow>
            <IRow>
                <ITable :items="data" :headers="headers">
                    <template v-slot:difNextDateShow="{ row }">
                        <span>{{ row.difNextDate + " " + t('Day') }} </span>
                    </template>
                    <template v-slot:actions="{ row }">
                        <IDropdown>
                            <li>
                                <EditButton title="Employee.Info" @click="update(row.id)" />
                            </li>
                        </IDropdown>
                    </template>
                </ITable>
                <IRow v-if="data.length > 0">
                    <div class="w-full flex flex-row">
                        <div class="basis-4/5 overflow-auto">
                            <TailwindPagination class="flex justify-center mt-6" :data="dataPage"
                                @pagination-change-page="getFilterData" :limit="searchFilter.limit" />
                        </div>
                        <div class="basis-1/5" v-if="data.length >= limits[0].id">
                            <ISelect name="limit" :label="t('Limit')" v-model="searchFilter.limit" :options="limits"
                                :IsRequire="true" @onChange="getFilterData()" />
                        </div>
                    </div>
                    <SimpleLoading v-if="isLoading">.</SimpleLoading>
                </IRow>
                <SimpleLoading v-if="isLoading">.</SimpleLoading>
            </IRow>
            <IRow>
                <div id="PageDataEnd"></div>
            </IRow>
        </IPageContent>
        <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
    </IPage>
</template>