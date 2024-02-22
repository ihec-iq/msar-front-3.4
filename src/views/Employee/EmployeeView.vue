<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useSectionStore } from "@/stores/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/stores/permissionStore";

import { t } from "@/utils/I18nPlugin";
import type { IUser } from "@/types/core/IUser";
import { useUserStore } from "@/stores/userStore";
import { EnumPermission } from "@/utils/EnumSystem";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("EmployeeAdd");
const route = useRoute();
const id = ref(Number(route.params.id));
const isPerson = ref(false);

const employeeStore = useEmployeeStore();
const { employee } = storeToRefs(useEmployeeStore());
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
const SelectedUsers = ref<Array<IUser>>([]);
//#endregion
//#region CURD
const reset = () => {
  employeeStore.resetData();
};
const store = () => {
  errors.value = null;
  const formData = new FormData();
  employee.value.isPerson = isPerson.value ? 1 : 0;
  formData.append("id", employee.value.id.toString());
  formData.append("name", employee.value.name.toString());
  formData.append("isPerson", employee.value.isPerson.toString());
  formData.append("sectionId", employee.value.Section.id.toString());
  formData.append("UserId", String(employee.value.User?.id));
  formData.append("number", employee.value.number.toString());
  formData.append("idCard", employee.value.idCard.toString());
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

  employeeStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
      errors.value = employeeStore.getError(error);
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
  formData.append("name", employee.value.name.toString());
  formData.append("isPerson", employee.value.isPerson.toString());
  formData.append("sectionId", employee.value.Section.id.toString());
  formData.append("UserId", String(employee.value.User?.id));
  formData.append("number", employee.value.number.toString());
  formData.append("idCard", employee.value.idCard.toString());
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
  employeeStore
    .update(employee.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
      errors.value = employeeStore.getError(error);
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
        await employeeStore._delete(employee.value.id).then(() => {
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
  await employeeStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        employee.value.id = response.data.data.id;
        employee.value.name = response.data.data.name;
        employee.value.idCard = response.data.data.idCard;
        employee.value.number = response.data.data.number;
        employee.value.Section.id = response.data.data.Section.id;
        employee.value.Section.name = response.data.data.Section.name;
        employee.value.User = response.data.data.User;
        employee.value.isPerson = response.data.data.isPerson;
        isPerson.value = response.data.data.isPerson == 0 ? false : true;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        position: "top-end",
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
onMounted(async () => {
  //console.log(can("show employees1"));
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  await sectionStore.get_sections();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "EmployeeAdd";
    employee.value.id = 0;
  } else {
    await showData();
    employee.value.id = id.value;
    namePage.value = "EmployeeUpdate";
  }
  await useUserStore()
    .get({})
    .then((response) => {
      SelectedUsers.value = response.data.data;
    });
});
</script>
<template>
  <IPage :HeaderTitle="t(namePage)">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        type="outlined"
        pre-icon="autorenew"
        :onClick="reset"
        :text="t('New')"
      />
    </template>
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="3" span-md="2" span-sm="1">
              <IInput
                :label="t('Name')"
                name="Name"
                v-model="employee.name"
                type="text"
            /></ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IInput
                :label="t('EmployeeNumber')"
                name="EmployeeNumer"
                v-model="employee.number"
                type="text"
            /></ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IInput
                :label="t('EmployeeIdCard')"
                name="EmployeeIdCard"
                v-model="employee.idCard"
                type="text"
            /></ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <ISelect
                :label="t('Section')"
                v-model="employee.Section.id"
                name="archiveTypeId"
                :options="sections"
                :IsRequire="true"
            /></ICol>
            <ICol span="1" span-md="2" span-sm="4">
              <IVSelect
                :label="t('User')"
                v-model="employee.User"
                name="archiveTypeId"
                :options="SelectedUsers"
                :IsRequire="true"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="4">
              <ICheckbox v-model="isPerson" :checked="isPerson">
                {{ t("EmployeeIsPerson") }} :
                {{ isPerson ? " شخص " : " قسم " }}</ICheckbox
              >
            </ICol>
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
        </IForm>
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
