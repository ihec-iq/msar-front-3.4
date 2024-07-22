<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHrDocumentStore } from "../hrDocumentStore";
import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import type { IEmployeeLite } from "@/project/employee/IEmployee";
import type { IHrDocumentType  } from '../IHrDocument'
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import ISelect from "@/components/inputs/ISelect.vue";
import IPage from "@/components/ihec/IPage.vue";
import IButton2 from "@/components/ihec/IButton2.vue";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("HrDocumentAdd");
const route = useRoute();
const id = ref(Number(route.params.id));

const HrDocumentStore = useHrDocumentStore();
const { hrDocument, hrDocumentTypes, employees } = storeToRefs(
  useHrDocumentStore()
);
const sectionStore = useSectionStore();

const Loading = ref(false);

const router = useRouter();
const errors = ref<string | null>();
//#endregion
//#region CURD
const reset = () => {
  HrDocumentStore.resetData();
};
const filesDataInput = ref<File>();

function onFileChanged($event: Event) {
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    filesDataInput.value = target.files[0];
  }
}
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("addDays", String(hrDocument.value.addDays));
  formData.append("title", hrDocument.value.title.toString());
  formData.append("issueDate", hrDocument.value.issueDate.toString());
  formData.append("hrDocumentTypeId", hrDocument.value.Type.id.toString());
  formData.append("employeeId", hrDocument.value.Employee.id.toString());
  if (filesDataInput.value) formData.append("file", filesDataInput.value);

  HrDocumentStore
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
      errors.value = HrDocumentStore.getError(error);
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
  formData.append("addDays", String(hrDocument.value.addDays));
  formData.append("title", hrDocument.value.title.toString());
  formData.append("issueDate", hrDocument.value.issueDate.toString());
  formData.append("hrDocumentTypeId", hrDocument.value.Type.id.toString());
  formData.append("employeeId", hrDocument.value.Employee.id.toString());
  if (filesDataInput.value) formData.append("file", filesDataInput.value);

  HrDocumentStore
    .update(hrDocument.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your data has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = HrDocumentStore.getError(error);
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
        await HrDocumentStore._delete(hrDocument.value.id).then(() => {
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
  await HrDocumentStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        hrDocument.value.id = response.data.data.id;
        hrDocument.value.addDays = response.data.data.addDays;
        hrDocument.value.title = response.data.data.title;
        hrDocument.value.issueDate = response.data.data.issueDate;
        hrDocument.value.Type = response.data.data.Type;
        hrDocument.value.Employee = response.data.data.Employee;
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
  let userId = hrDocument.value.id;
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
  //await sectionStore.get_sections();
  await HrDocumentStore.get_employees();
  await HrDocumentStore.get_hrDocumentTypes();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "HrDocumentAdd";
    hrDocument.value.id = 0;
  } else {
    await showData();
    hrDocument.value.id = id.value;
    namePage.value = "HrDocumentUpdate";
  }
  isLoading.value = false;
});
const active = ref(0);
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
                  v-model="hrDocument.title"
                  type="text"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <input
                  type="file"
                  @change="onFileChanged($event)"
                  accept="image/*"
                  capture
                />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Employee.DateWork')"
                  name="EmployeeDateWork"
                  v-model="hrDocument.issueDate"
                  type="date"
              /></ICol>

               
              <ICol span="1" span-md="2" span-sm="4">
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t(".Title") }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="hrDocument.Type"
                  :options="hrDocumentTypes"
                  :reduce="(hrDocumentType: IHrDocumentType) => hrDocumentType"
                  label="name"
                  :getOptionLabel="(hrDocumentType: IHrDocumentType) => hrDocumentType.name"
                >
                  <template #option="{ name,addDays }">
                    <div class="dir:rtl text-right p-1 border-2 border-solid border-red-500">
                      <span>{{ name }}</span> <br/><span v-if="addDays>0" class="text-gray-100">يظاف عدد ايام  {{ addDays }}</span>
                    </div>
                  </template>
                </vSelect>
              </ICol>
              <ICol span="1" span-md="2" span-sm="4">
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("Employee.Title") }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="hrDocument.Employee"
                  :options="employees"
                  :reduce="(employee: IEmployeeLite) => employee"
                  label="name"
                  :getOptionLabel="(employee: IEmployeeLite) => employee.name"
                >
                  <template #option="{ name }">
                    <div>
                      <span>{{ name }}</span>
                    </div>
                  </template>
                </vSelect>
              </ICol>
            </IRow>
          </van-tab>
          <van-tab title="الملفات">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <ILabel title="Test"
              /></ICol>
            </IRow>
          </van-tab>
        </van-tabs>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :isAdd="hrDocument.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>
