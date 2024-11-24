<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import vSelect from "vue-select";
import { useBonusStore } from "@/project/bonus/bonusStore";
import { SuccessToast } from "@/utilities/Toast";
import { IEmployeeLite } from "@/project/employee/IEmployee";
import { IDegreeStage, IBonusJobTitle } from "@/project/bonus/IBonus";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import { prepareFormData } from "@/utilities/crudTool";
import { useEmployeeStore } from "@/project/employee/employeeStore";
import IRow from "@/components/ihec/IRow.vue";
import IRichtext from "@/components/ihec/IRichtext.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import Button from "@/components/ui/button/Button.vue";
import IBasis from "@/components/ihec/IBasis.vue";
import IFlex from "@/components/ihec/IFlex.vue";
import ICol from "@/components/ihec/ICol.vue";
import IRow2 from "@/components/ihec/IRow2.vue";
import ICol2 from "@/components/ihec/ICol2.vue";
import ILabel from "@/components/ihec/ILabel.vue";

const route = useRoute();
const router = useRouter();
const id = ref(Number(route.params.id));
const employeeId = ref(Number(route.params.employeeId));
const disabledChangeEmployee = ref(false);

const { checkPermissionAccessArray } = usePermissionsStore();
const BonusStore = useBonusStore();
const { Bonus } = storeToRefs(BonusStore);
const isLoading = ref(false);
const errors = ref<string | null>(null);
const namePage = ref("Bonus.Add");


const store = async () => {
  errors.value = null;
  const formData = prepareFormData(Bonus.value);
  try {
    const response = await BonusStore.store(formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.value = BonusStore.getError(error as any);
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
  const formData = prepareFormData(Bonus.value);
  try {
    const response = await BonusStore.update(Bonus.value.id, formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    errors.value = BonusStore.error;
    Swal.fire({
      icon: "error",
      title: "Updating data failed!",
      text: BonusStore.error?.toString(),

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
      await BonusStore._delete(Bonus.value.id);
      Swal.fire(t("Deleted!"), t("Deleted Successfully."), "success");
      router.go(-1);
    } catch (error) {
      Swal.fire("Error", "Deletion failed", "error");
    }
  }
};

const showData = async () => {
  await BonusStore.show(id.value).then((response) => {
    if (response.status === 200) {
      Object.assign(Bonus.value, response.data.data);
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
  BonusStore.resetDataBonus();
};
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);

  await Promise.all([
    BonusStore.get_BonusStudy(),
    BonusStore.get_DegreeStage(),
    BonusStore.get_Employees()
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
      Object.assign(Bonus.value.Employee, response.data.data)
      Bonus.value.DegreeStage = response.data.data.DegreeStage
    })
  }
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "Bonus.Add";
    Bonus.value.id = 0;
  } else {
    Bonus.value.id = id.value;
    namePage.value = "Bonus.Update";
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
        <IRow2 v-else-if="Bonus.Employee.BonusJobTitle.id != 0 && isLoading" :title="t('Bonus.currentEmployeeData')" :gap="2" 
          class="rounded-sm border-2 border-solid border-red-400">
          <ICol2 :md="6" :lg="6" >
            <ILabel :title="t('Bonus.JobTitle')" >
              {{ Bonus.Employee.BonusJobTitle.name }}
            </ILabel>
          </ICol2>
          <ICol2 :md="6" :lg="6"  >
            <ILabel :title="t('Bonus.dateWorth')" >
              {{ Bonus.Employee.dateNextBonus }}
            </ILabel>
          </ICol2>
          <ICol2 :md="6" :lg="6" >
            <ILabel :title="t('Bonus.numberLastBonus')" >
              {{ Bonus.Employee.numberLastBonus }}
            </ILabel>
          </ICol2>
          <ICol2 :md="6" :lg="6" >
            <ILabel :title="t('Bonus.DegreeStage')" >
              {{ Bonus.Employee.DegreeStage.title }}
            </ILabel>
          </ICol2>
        </IRow2>

        <!-- for new Bonus of employee -->
        <IRow col-lg="4" col-md="2" col-sm="1">
          <ICol span="1" span-md="2" span-sm="4">
            <div class=" md:text-sm text-base mr-3 mb-2 font-bold text-text dark:text-textLight">
              {{ t("Employee.Title") }}
            </div>
            <vSelect :disabled="disabledChangeEmployee"
              class="w-full outline-none h-10 p-1 rounded-md  bg-lightInput dark:bg-input text-text dark:text-textLight disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
              v-model="Bonus.Employee" :options="BonusStore.Employees" :reduce="(employee: IEmployeeLite) => employee"
              label="name" :getOptionLabel="(employee: IEmployeeLite) => employee.name">
              <template #option="{ name }">
                <div class="text-right border-2 p-2 border-solid border-red-400">
                  <span>{{ name }}</span>
                </div>
              </template>
            </vSelect>
          </ICol>
          <ICol span="1" span-md="2" span-sm="4">
            <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
              {{ t("Bonus.DegreeStage") }}
            </div>
            <vSelect
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Bonus.DegreeStage" :options="BonusStore.DegreeStages"
              :reduce="(DegreeStage: IDegreeStage) => DegreeStage" label="title"
              :getOptionLabel="(DegreeStage: IDegreeStage) => DegreeStage.title">
              <template #option="{ title, salery, yearlyBonus, yearlyService }">
                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                  <span>{{ title }} </span><br>
                  <span>{{ t('Bonus.salery') + ' :' + ConvertToMoneyFormat(salery) }} </span> -
                  <span>{{ t('Bonus.yearlyBonus') + ' :' + ConvertToMoneyFormat(yearlyBonus) }} </span>
                  <!-- <span>{{ t('Bonus.yearlyService') + ' :' + ConvertToMoneyFormat(yearlyService) }} </span> -->
                </div>
              </template>
            </vSelect>
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Date')" name="issueDate" v-model="Bonus.issueDate" :type="EnumInputType.Date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.number')" name="number" v-model="Bonus.number" :type="EnumInputType.Text" />
          </ICol>


        </IRow>
        <IRow>
          <ICol span="1" span-md="1" span-sm="1">
            <IButton2 :type="EnumButtonType.Outlined" :onClick="() => { Bonus.notes = ' ' }" :text="t('ShowNotes')"
              v-if="!Bonus.notes" class="w-full" />
            <IRichtext :label="t('Bonus.notes')" v-else name="notes" v-model="Bonus.notes" />
          </ICol>
        </IRow>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :isAdd="Bonus.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
<style></style>
