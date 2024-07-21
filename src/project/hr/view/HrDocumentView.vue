<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHrDomcumnetStore } from "../hrDocumentStore";
import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";

import { t } from "@/utilities/I18nPlugin";
import type { IUser } from "@/project/user/IUser";
import { useUserStore } from "@/project/user/userStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import ISelect from "@/components/inputs/ISelect.vue";
import IPage from "@/components/ihec/IPage.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import IVSelect from "@/components/inputs/IVSelect.vue";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("EmployeeAdd");
const route = useRoute();
const id = ref(Number(route.params.id));
const isPerson = ref(false);
const isMoveSection = ref(false);

const hrDomcumnetStore = useHrDomcumnetStore();
const { hrDocument, hrDocumentTypes } = storeToRefs(useHrDomcumnetStore());
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<string | null>();
const SelectedUsers = ref<Array<IUser>>([]);
//#endregion
//#region CURD
const reset = () => {
  hrDomcumnetStore.resetData();
};
const filesDataInput = ref<File>();

const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("addDays", String(hrDocument.value.addDays));
  formData.append("title", hrDocument.value.title.toString());
  formData.append("issueDate", hrDocument.value.issueDate.toString());
  formData.append("addDays", hrDocument.value.addDays.toString());
  formData.append("files", filesDataInput.value);

  hrDomcumnetStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your employee has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = hrDomcumnetStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  errors.value = null;
  const formData = new FormData();
  employee.value.isPerson = isPerson.value ? 1 : 0;
  employee.value.isMoveSection = isMoveSection.value ? 1 : 0;

  formData.append("name", employee.value.name.toString());
  formData.append("isPerson", employee.value.isPerson.toString());
  formData.append("sectionId", employee.value.Section.id.toString());
  formData.append("isMoveSection", employee.value.isMoveSection.toString());
  formData.append("MoveSectionId", employee.value.MoveSection.id.toString());
  formData.append("positionId", employee.value.Position.id.toString());
  formData.append("typeId", employee.value.Type.id.toString());
  formData.append("centerId", employee.value.Center.id.toString());
  formData.append("UserId", String(employee.value.User?.id));
  formData.append("number", String(employee.value.number));
  formData.append("telegramId", String(employee.value.telegramId));
  formData.append("dateWork", String(employee.value.dateWork));
  formData.append("idCard", String(employee.value.idCard));
  formData.append("initVacation", employee.value.initVacation.toString());
  formData.append("takeVacation", employee.value.takeVacation.toString());
  formData.append(
    "initVacationSick",
    employee.value.initVacationSick.toString()
  );
  formData.append(
    "takeVacationSick",
    employee.value.takeVacationSick.toString()
  );
  hrDomcumnetStore
    .update(employee.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your employee has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = hrDomcumnetStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "updating data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
}
const Delete = async () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: t("Are You Sure?"),
      text: t("You Won't Be Able To Revert This!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await hrDomcumnetStore._delete(employee.value.id).then(() => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          router.go(-1);
        });
      }
    });
};
const showData = async () => {
  Loading.value = true;
  await hrDomcumnetStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        employee.value.id = response.data.data.id;
        employee.value.name = response.data.data.name;
        employee.value.idCard = response.data.data.idCard;
        employee.value.number = response.data.data.number;
        employee.value.telegramId = response.data.data.telegramId;
        employee.value.dateWork = response.data.data.dateWork;
        employee.value.Section = response.data.data.Section;
        employee.value.MoveSection = response.data.data.MoveSection;
        employee.value.User = response.data.data.User;
        employee.value.Type = response.data.data.Type;
        employee.value.Center = response.data.data.Center;
        employee.value.Position = response.data.data.Position;
        employee.value.isPerson = response.data.data.isPerson;
        isPerson.value = response.data.data.isPerson == 0 ? false : true;
        isMoveSection.value =
          response.data.data.isMoveSection == 0 ? false : true;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        icon: "warning",
        title: "Your employee file not exist !!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.go(-1);
      });
    });
  Loading.value = false;
};
//#endregion
const back = () => {
  router.push({
    name: "employeeIndex",
  });
};
const ShowUser = () => {
  let userId = employee.value.User?.id;
  router.push({
    name: "userUpdate",
    params: { id: userId },
  });
};
const isLoading = ref(false);
onMounted(async () => {
  isLoading.value = true;
  //console.log(can("show employees1"));
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  await sectionStore.get_sections();
  await hrDomcumnetStore.get_employee_types();
  await hrDomcumnetStore.get_employee_positions();
  await hrDomcumnetStore.get_employee_centers();
  await useUserStore()
    .get_lite()
    .then((response) => {
      SelectedUsers.value = response.data.data;
    });
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "EmployeeAdd";
    employee.value.id = 0;
  } else {
    await showData();
    employee.value.id = id.value;
    namePage.value = "EmployeeUpdate";
  }
  isLoading.value = false;
});
const active = ref(0);

const fileObj = ref<{
  fileName: string;
  fileType: string;
}>();
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        type="outlined"
        pre-icon="view-grid-plus"
        :onClick="reset"
        :text="t('New')"
      />
    </template>
    <IPageContent>
      <IRow>
        <van-tabs v-model:active="active">
          <van-tab title="معلومات الموظف">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Name')"
                  name="Name"
                  v-model="employee.name"
                  type="text"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Employee.Number')"
                  name="Employee.Number"
                  v-model="employee.number"
                  type="text"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Employee.Telegram')"
                  name="EmployeeTelegram"
                  v-model="employee.telegramId"
                  type="text"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Employee.IdCard')"
                  name="EmployeeIdCard"
                  v-model="employee.idCard"
                  type="text"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Employee.DateWork')"
                  name="EmployeeDateWork"
                  v-model="employee.dateWork"
                  type="date"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ISelect
                  :label="t('Employee.Section')"
                  v-model="employee.Section.id"
                  name="archiveTypeId"
                  :options="sections"
                  :IsRequire="true"
              /></ICol>

              <ICol span="1" span-md="1" span-sm="1">
                <ISelect
                  :label="t('Employee.Position')"
                  v-model="employee.Position.id"
                  name="PostionId"
                  :options="employees_positions"
                  :IsRequire="true"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ISelect
                  :label="t('Employee.Type')"
                  v-model="employee.Type.id"
                  name="TypeId"
                  :options="employees_types"
                  :IsRequire="true"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ISelect
                  :label="t('Employee.Center')"
                  v-model="employee.Center.id"
                  name="CecnterId"
                  :options="employees_centers"
                  :IsRequire="true"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ICheckbox v-model="isPerson" :checked="isPerson">
                  {{ t("Employee.IsPerson") }} :
                  {{ isPerson ? " شخص " : " قسم " }}</ICheckbox
                >
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ICheckbox v-model="isMoveSection" :checked="isMoveSection">
                  {{ t("Employee.isMoveSection") }} :
                  {{ isMoveSection ? " نعم " : " كلا  " }}</ICheckbox
                >
              </ICol>

              <ICol span="1" span-md="1" span-sm="1" v-if="isMoveSection">
                <ISelect
                  :label="t('Employee.MoveSection')"
                  v-model="employee.MoveSection.id"
                  name="MoveSectionId"
                  :options="sections"
                  :IsRequire="true"
              /></ICol>
              <!-- :IsDisabled="!isMoveSection" -->

              <!-- <ICol span="1" span-md="2" span-sm="4">
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("OutputVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="vacationSick.Vacation"
                :options="vacations"
                :reduce="(vacation: IVacation) => vacation"
                label="name"
                :getOptionLabel="(vacation: IVacation) => vacation.Employee.name"
              >
                <template #option="{ Employee }">
                  <div>
                    <span>{{ Employee.name }}</span>
                  </div>
                </template>
              </vSelect>
            </ICol> -->
            </IRow>
            <IRow col-lg="3" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IVSelect
                  :label="t('User')"
                  v-model="employee.User"
                  name="archiveTypeId"
                  :options="SelectedUsers"
                  :IsRequire="true"
                />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IButton2
                  type="outlined"
                  class="mt-3"
                  v-if="employee.User?.id"
                  :on-click="ShowUser"
                  :text="t('Open')"
                />
              </ICol>
            </IRow>
          </van-tab>
          <van-tab title="الملفات">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('FileName')"
                  name="FileName"
                  v-model="employee.name"
                  type="text"
              /></ICol>
            </IRow>
          </van-tab>
        </van-tabs>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :isAdd="employee.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>
../hrDocumentStore
