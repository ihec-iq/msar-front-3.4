<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import vSelect from "vue-select";
import { usePromotionStore } from "@/project/promotion/promotionStore";
import { SuccessToast } from "@/utilities/Toast";
import { IEmployeeLite } from "@/project/employee/IEmployee";
import { IDegreeStage } from "@/project/bonus/IBonus";

import { ConvertToMoneyFormat } from "@/utilities/tools";
import { prepareFormData } from "@/utilities/crudTool";
import { useEmployeeStore } from "@/project/employee/employeeStore";
import IRow from "@/components/ihec/IRow.vue";
import IRichtext from "@/components/ihec/IRichtext.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { useBonusStore } from "@/project/bonus/bonusStore";

const route = useRoute();
const router = useRouter();
const id = ref(Number(route.params.id));
const employeeId = ref(Number(route.params.employeeId));
const disabledChangeEmployee = ref(false);

const { checkPermissionAccessArray } = usePermissionsStore();
const PromotionStore = usePromotionStore();
const { Promotion } = storeToRefs(PromotionStore);
const isLoading = ref(false);
const errors = ref<string | null>(null);
const namePage = ref("Promotion.Add");


const store = async () => {
  errors.value = null;
  const formData = prepareFormData(Promotion.value);
  try {
    const response = await PromotionStore.store(formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.value = PromotionStore.getError(error as any);
      Swal.fire({
        icon: "error",
        title: "Create new data failed!",
        text: error.message,
      });
      console.log(errors.value)
    } else {
      console.error("An unknown error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Create new data failed!",
        text: "An unknown error occurred.",
      });
    }
  }
}

const update = async () => {
  errors.value = null;
  const formData = prepareFormData(Promotion.value);
  try {
    const response = await PromotionStore.update(Promotion.value.id, formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    errors.value = PromotionStore.error;
    Swal.fire({
      icon: "error",
      title: "Updating data failed!",
      text: PromotionStore.error?.toString(),

    });
  }
};

const Delete = async () => {
  const result = await Swal.fire({
    title: t("Confirm deletion"),
    text: t("Are you sure?"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("Yes, delete it!"),
    cancelButtonText: t("No, cancel!"),
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await PromotionStore._delete(Promotion.value.id);
      Swal.fire(t("Deleted!"), t("Deleted Successfully."), "success");
      router.go(-1);
    } catch (error) {
      Swal.fire("Error", "Deletion failed", "error");
    }
  }
};

const showData = async () => {
  await PromotionStore.show(id.value).then((response) => {
    if (response.status === 200) {
      Object.assign(Promotion.value, response.data.data);
    }
  }).catch((error) => {
    console.error(error);
    Swal.fire({
      icon: "warning",
      title: "Employee file does not exist!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.go(-1);
    });
  });
};
const reset = () => {
  PromotionStore.resetDataPromotion();
};
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);

  await Promise.all([
    useBonusStore().get_DegreeStage(),
    useBonusStore().get_BonusJobTitle(),
    PromotionStore.get_Employees()
  ]);
  //check if selected emplioyee or not
  if (Number.isNaN(employeeId.value) || employeeId.value === undefined) {
    // that mean it normal document and not select any employee
    disabledChangeEmployee.value = false
  } else {
    // it selected employee
    disabledChangeEmployee.value = true
    useEmployeeStore().showBonusLite(employeeId.value).then((response) => {
      reset()
      console.log(response.data.data)
      Object.assign(Promotion.value.Employee, response.data.data)
      Promotion.value.DegreeStage = response.data.data.DegreeStage
    })
  }
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "Promotion.Add";
    Promotion.value.id = 0;
  } else {
    Promotion.value.id = id.value;
    namePage.value = "Promotion.Update";
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
      <!-- for old data of employee -->
      <IRow>
        <IRow v-if="isLoading">
          <div class="skeleton h-32 w-full"></div>
        </IRow>
        <IRow v-else :title="t('Promotion.currentEmployeeData')" col-lg="4" col-md="2" col-sm="1"
          class="rounded-sm border-2 border-solid border-red-400">
          <ICol span="1" span-md="2" span-sm="4">
            <IInput :label="t('Promotion.JobTitle')" name="JobTitle" disabled v-model="Promotion.Employee.BonusJobTitle.name"
              :type="EnumInputType.Text" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Promotion.dateWorth')" name="dateWorth" disabled v-model="Promotion.Employee.dateNextPromotion" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Promotion.numberLastPromotion')" name="numberLastPromotion" disabled
              v-model="Promotion.Employee.numberLastPromotion" :type="EnumInputType.Text" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Promotion.DegreeStage')" name="degreeStage" disabled
              v-model="Promotion.Employee.DegreeStage.title" />
          </ICol>
        </IRow>

        <!-- for new Promotion of employee -->
        <IRow col-lg="4" col-md="2" col-sm="1">
          <ICol span="1" span-md="2" span-sm="4">
            <div class=" md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
              {{ t("Employee.Title") }}
            </div>
            <vSelect :disabled="disabledChangeEmployee"
              class="w-full outline-none h-10 px-2 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Promotion.Employee" :options="PromotionStore.Employees" :reduce="(employee: IEmployeeLite) => employee"
              label="name" :getOptionLabel="(employee: IEmployeeLite) => employee.name">
              <template #option="{ name }">
                <div>
                  <span class="text-right dark:text-textLight dark:bg-input">{{ name }}</span>
                </div>
              </template>
            </vSelect>
          </ICol>
          <ICol span="1" span-md="2" span-sm="4">
            <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
              {{ t("Promotion.DegreeStage") }}
            </div>
            <vSelect
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Promotion.DegreeStage" :options="PromotionStore.DegreeStages"
              :reduce="(DegreeStage: IDegreeStage) => DegreeStage" label="title"
              :getOptionLabel="(DegreeStage: IDegreeStage) => DegreeStage.title">
              <template #option="{ title, salery, yearlyBonus, yearlyService }">
                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                  <span>{{ title }} </span><br>
                  <span>{{ t('Bonus.salery') + ' :' + ConvertToMoneyFormat(salery) }} </span> -
                  <span>{{ t('Bonus.yearlyBonus') + ' :' + ConvertToMoneyFormat(yearlyBonus) }} </span>
                  <!-- <span>{{ t('Promotion.yearlyService') + ' :' + ConvertToMoneyFormat(yearlyService) }} </span> -->
                </div>
              </template>
            </vSelect>
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Date')" name="issueDate" v-model="Promotion.issueDate" :type="EnumInputType.Date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Promotion.number')" name="number" v-model="Promotion.number" :type="EnumInputType.Text" />
          </ICol>


        </IRow>
        <IRow>
          <ICol span="1" span-md="1" span-sm="1">
            <IButton2 :type="EnumButtonType.Outlined" :onClick="() => { Promotion.notes = ' ' }" :text="t('ShowNotes')"
              v-if="!Promotion.notes" />
            <IRichtext :label="t('Promotion.notes')" v-else name="notes" v-model="Promotion.notes" />
          </ICol>
        </IRow>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :isAdd="Promotion.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
<style></style>
