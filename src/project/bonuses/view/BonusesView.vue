<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import vSelect from "vue-select";
import { useBonusesStore } from "@/project/bonuses/bonusesStore";
import { SuccessToast } from "@/utilities/Toast";
import { IEmployeeLite } from "@/project/employee/IEmployee";

const route = useRoute();
const router = useRouter();
const id = ref(Number(route.params.id));
const { checkPermissionAccessArray } = usePermissionsStore();
const BonusesStore = useBonusesStore();
const { Bonuses } = storeToRefs(BonusesStore);

const isLoading = ref(false);
const errors = ref<string | null>(null);
const namePage = ref("Bonuses.Add");

const store = async () => {
  errors.value = null;
  const formData = new FormData();
  Object.entries(Bonuses.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  try {
    const response = await BonusesStore.store(formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.value = BonusesStore.getError(error as any);
      Swal.fire({
        icon: "error",
        title: "Create new data failed!",
        text: error.message,
      });
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
  const formData = new FormData();
  Object.entries(Bonuses.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  try {
    const response = await BonusesStore.update(Bonuses.value.id, formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    errors.value = BonusesStore.error;
    Swal.fire({
      icon: "error",
      title: "Updating data failed!",
      text: BonusesStore.error?.toString(),
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
      await BonusesStore._delete(Bonuses.value.id);
      Swal.fire(t("Deleted!"), t("Deleted Successfully."), "success");
      router.go(-1);
    } catch (error) {
      Swal.fire("Error", "Deletion failed", "error");
    }
  }
};

const showData = async () => {
  await BonusesStore.show(id.value).then((response) => {
    if (response.status === 200) {
      Object.assign(Bonuses.value, response.data.data);
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
  BonusesStore.resetData();
};
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);

  await Promise.all([
    BonusesStore.get_BonusJobTitle(),
    BonusesStore.get_BonusStudy(),
    BonusesStore.get_BonusDigreeStage(),
    BonusesStore.get_Employees()
  ]);

  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "Bonuses.Add";
    Bonuses.value.id = 0;
  } else {
    Bonuses.value.id = id.value;
    namePage.value = "Bonuses.Update";
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
            <IInput :label="t('Title')" name="Name" v-model="Bonuses.title" type="text" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Date')" name="issueDate" v-model="Bonuses.issueDate" type="date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.dateLastBounues')" name="dateLastBounues" v-model="Bonuses.dateLastBounues"
              type="date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.dateLastWorth')" name="dateLastWorth" v-model="Bonuses.dateLastWorth"
              type="date" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Bonus.dateNextWorth')" name="dateNextWorth" v-model="Bonuses.dateNextWorth"
              type="date" />
          </ICol>
          <ICol span="1" span-md="2" span-sm="4">
            <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
              {{ t("Bonus.JobTitle") }}
            </div>
            <vSelect
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Bonuses.BonusDigreeStage" :options="BonusesStore.BonusDigreeStage"
              :reduce="(BonusDigreeStage) => BonusDigreeStage" label="name"
              :getOptionLabel="(BonusDigreeStage) => BonusDigreeStage.name">
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
              v-model="Bonuses.BonusStudy" :options="BonusesStore.BonusStudy" :reduce="(BonusStudy) => BonusStudy"
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
              {{ t("Bonus.DigreeStage") }}
            </div>
            <vSelect
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              v-model="Bonuses.BonusDigreeStage" :options="BonusesStore.BonusDigreeStage"
              :reduce="(BonusDigreeStage) => BonusDigreeStage" label="name"
              :getOptionLabel="(BonusDigreeStage) => BonusDigreeStage.name">
              <template #option="{ name }">
                <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                  <span>{{ name }}</span>
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
              v-model="Bonuses.Employee" :options="BonusesStore.Employees"
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
      <IFooterCrud :isAdd="Bonuses.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
<style></style>
