<script setup lang="ts">
import { onMounted, ref } from "vue";
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
import { IBonusDegreeStage, IBonusJobTitle } from "@/project/bonus/IBonus";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import { prepareFormData } from "@/utilities/crudTool";

const route = useRoute();
const router = useRouter();
const id = ref(Number(route.params.id));
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
    BonusStore.get_BonusJobTitle(),
    BonusStore.get_BonusStudy(),
    BonusStore.get_BonusDegreeStage(),
    BonusStore.get_Employees()
  ]);

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
  <IPage :headerTitle="t(namePage)" :isLoading="isLoading">
    <template #headerButtons>
      <IButton2 color="green" width="28" type="outlined" preIcon="view-grid-plus" :onClick="reset" :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <IRow col-lg="4" col-md="2" col-sm="1">
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Title')" name="Name" v-model="Bonus.title" type="text" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Date')" name="issueDate" v-model="Bonus.issueDate" type="date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.numberLastBonus')" name="numberLastBonus" v-model="Bonus.numberLastBonus"
              type="text" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.dateLastBonus')" name="dateLastBonus" v-model="Bonus.dateLastBonus"
              type="date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.dateLastWorth')" name="dateLastWorth" v-model="Bonus.dateLastWorth" type="date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.dateNextWorth')" name="dateNextWorth" v-model="Bonus.dateNextWorth" type="date" />
          </ICol>
          <ICol span="1" span-md="2" span-sm="4">
            <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
              {{ t("Bonus.JobTitle") }}
            </div>
            <vSelect
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Bonus.BonusJobTitle" :options="BonusStore.BonusJobTitles"
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
              {{ t("Bonus.Study") }}
            </div>
            <vSelect
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Bonus.BonusStudy" :options="BonusStore.BonusStudies" :reduce="(BonusStudy) => BonusStudy"
              label="name" :getOptionLabel="(BonusStudy) => BonusStudy.name">
              <template #option="{ name }">
                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
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
              v-model="Bonus.BonusDegreeStage" :options="BonusStore.BonusDegreeStages"
              :reduce="(BonusDegreeStage: IBonusDegreeStage) => BonusDegreeStage" label="title"
              :getOptionLabel="(BonusDegreeStage: IBonusDegreeStage) => BonusDegreeStage.title">
              <template #option="{ title, salery, yearlyBonus, yearlyService }">
                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                  <span>{{ title }} </span><br>
                  <span>{{ t('Bonus.salery') + ' :' + ConvertToMoneyFormat(salery) }} </span><br>
                  <span>{{ t('Bonus.yearlyBonus') + ' :' + ConvertToMoneyFormat(yearlyBonus) }} </span><br>
                  <span>{{ t('Bonus.yearlyService') + ' :' + ConvertToMoneyFormat(yearlyService) }} </span>
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
              v-model="Bonus.Employee" :options="BonusStore.Employees" :reduce="(employee: IEmployeeLite) => employee"
              label="name" :getOptionLabel="(employee: IEmployeeLite) => employee.name">
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
      <IFooterCrud :isAdd="Bonus.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
<style></style>
