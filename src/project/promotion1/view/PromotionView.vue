<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import vSelect from "vue-select";
import { usePromotionStore } from "@/project/promotion/promotionStore"; // Updated store import
import { SuccessToast } from "@/utilities/Toast";
import { IEmployeeLite } from "@/project/employee/IEmployee";
import { IDegreeStage, IBonusJobTitle } from "@/project/bonus/IBonus"; // Updated interfaces
import { ConvertToMoneyFormat } from "@/utilities/tools";
import { prepareFormData } from "@/utilities/crudTool";
import { useBonusStore } from "@/project/bonus/bonusStore";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

const route = useRoute();
const router = useRouter();
const id = ref(Number(route.params.id));
const { checkPermissionAccessArray } = usePermissionsStore();
const PromotionStore = usePromotionStore(); // Updated store reference
const { Promotion } = storeToRefs(PromotionStore); // Updated reference

const isLoading = ref(false);
const errors = ref<string | null>(null);
const namePage = ref("Promotion.Add"); // Updated page name
const ChangeDegreeStage = async () => {
    if (Promotion.value.DegreeStage.Degree) {
        await useBonusStore().get_BonusJobTitle({ bonusDegreeId: Promotion.value.DegreeStage.Degree.id }).then((response) => {
        })
    }
}
const store = async () => {
    errors.value = null;
    const formData = prepareFormData(Promotion.value); // Updated reference
    try {
        await PromotionStore.store(formData).then((response: any) => { // Updated store method
            if (response.status === 200) {
                SuccessToast();
                router.go(-1);
            }
        });
    } catch (error) {
        // ... existing error handling ...
    }
}

const update = async () => {
    errors.value = null;
    const formData = prepareFormData(Promotion.value); // Updated reference
    try {
        await PromotionStore.update(Promotion.value.id, formData).then((response: any) => { // Updated store method
            if (response.status === 200) {
                SuccessToast();
                router.go(-1);
            }
        });
    } catch (error) {
        // ... existing error handling ...
    }
};

const Delete = async () => {
    // ... existing delete logic ...
};

const showData = async () => {
    await PromotionStore.show(id.value).then((response) => { // Updated store method
        if (response.status === 200) {
            Object.assign(Promotion.value, response.data.data); // Updated reference
        }
    }).catch((error) => {
        // ... existing error handling ...
    });
};

const reset = () => {
    PromotionStore.resetData(); // Updated store method
};

onMounted(async () => {
    isLoading.value = true;
    checkPermissionAccessArray([EnumPermission.ShowEmployees]);

    await Promise.all([
        useBonusStore().get_BonusJobTitle(), // Updated store method
        useBonusStore().get_DegreeStage(), // Updated store method
        useBonusStore().get_Employees()
    ]);

    if (Number.isNaN(id.value) || id.value === undefined) {
        namePage.value = "Promotion.Add"; // Updated page name
        Promotion.value.id = 0; // Updated reference
    } else {
        Promotion.value.id = id.value; // Updated reference
        namePage.value = "Promotion.Update"; // Updated page name
        await showData();
    }
    isLoading.value = false;
});
</script>

<template>
    <IPage :HeaderTitle="t(namePage)" :isLoading="isLoading">
        <template #headerButtons>
            <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" preIcon="view-grid-plus" :onClick="reset"
                :text="t('New')" />
        </template>
        <IPageContent>
            <IRow>
                <IRow col-lg="4" col-md="2" col-sm="1">
                    <ICol span="1" span-md="1" span-sm="1">
                        <IInput :label="t('Date')" name="issueDate" v-model="Promotion.issueDate"
                            :type="EnumInputType.Date" />
                        <!-- Updated reference -->
                    </ICol>
                    <ICol span="1" span-md="1" span-sm="1">
                        <IInput :label="t('Promotion.numberLastPromotion')" name="numberLastPromotion"
                            v-model="Promotion.number" :type="EnumInputType.Text" /> <!-- Updated reference -->
                    </ICol>
                    <ICol span="1" span-md="2" span-sm="4">
                        <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
                            {{ t("Promotion.JobTitle") }} <!-- Updated label -->
                        </div>
                        <vSelect
                            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                            v-model="Promotion.JobTitle" :options="useBonusStore().BonusJobTitles"
                            :reduce="(BonusJobTitle: IBonusJobTitle) => BonusJobTitle"
                            :getOptionLabel="(BonusJobTitle: IBonusJobTitle) => BonusJobTitle.name">
                            <template #option="{ name }">
                                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                                    <span>{{ name }}</span>
                                </div>
                            </template>
                        </vSelect>
                    </ICol>
                    <ICol span="1" span-md="2" span-sm="4">
                        <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
                            {{ t("Promotion.DegreeStage") }} <!-- Updated label -->
                        </div>
                        <vSelect
                            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                            v-model="Promotion.DegreeStage" :options="useBonusStore().DegreeStages"
                            :reduce="(DegreeStage: IDegreeStage) => DegreeStage"
                            @update:model-value="ChangeDegreeStage" label="title" :getOptionLabel="(DegreeStage: IDegreeStage) =>
                                DegreeStage.title">
                            <template #option="{ title }">
                                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                                    <span>{{ title }} </span>
                                </div>
                            </template>
                        </vSelect>
                    </ICol>
                    <ICol span="1" span-md="2" span-sm="4">
                        <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
                            {{ t("Employee.Title") }}
                        </div>
                        <vSelect
                            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                            v-model="Promotion.Employee" :options="useBonusStore().Employees"
                            :reduce="(employee: IEmployeeLite) => employee" label="name"
                            :getOptionLabel="(employee: IEmployeeLite) => employee.name">
                            <template #option="{ name }">
                                <div>
                                    <span>{{ name }}</span>
                                </div>
                            </template>
                        </vSelect>
                    </ICol>
                </IRow>
            </IRow>
        </IPageContent>

        <template #Footer>
            <IFooterCrud :isAdd="Promotion.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
            <!-- Updated reference -->
        </template>
    </IPage>
</template>
<style></style>