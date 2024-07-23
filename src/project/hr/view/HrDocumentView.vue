<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHrDocumentStore } from "../hrDocumentStore";
import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import type { IEmployeeLite } from "@/project/employee/IEmployee";
import type { IHrDocumentType } from "../IHrDocument";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import ISelect from "@/components/inputs/ISelect.vue";
import IPage from "@/components/ihec/IPage.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import FilePreview from "@/project/archive/view/FilePreview.vue";
import DragDrop from "@/project/archive/view/DragDrop.vue";
import { useDragDropStore } from "@/project/archive/dragDrop";

const { filesDataInput } = storeToRefs(useDragDropStore());
import { SuccessToast, ErrorToast, WarningToast } from "@/utilities/Toast";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("HrDocument.Add");
const route = useRoute();
const id = ref(Number(route.params.id));

const HrDocumentStore = useHrDocumentStore();
const { hrDocument, hrDocumentTypes, employees } =
  storeToRefs(useHrDocumentStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<string | null>();
//#endregion
//#region CURD
const reset = () => {
  HrDocumentStore.resetData();
};

const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("addDays", String(hrDocument.value.addDays));
  formData.append("title", hrDocument.value.title.toString());
  formData.append("issueDate", hrDocument.value.issueDate.toString());
  formData.append("hrDocumentTypeId", hrDocument.value.Type.id.toString());
  formData.append("employeeId", hrDocument.value.Employee.id.toString());
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }
  HrDocumentStore.store(formData)
    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        filesDataInput.value = [];
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
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }
  HrDocumentStore.update(hrDocument.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        //filesDataInput.value = [];
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
  await HrDocumentStore.show(id.value)
    .then((response) => {
      if (response.status == 200) {
        hrDocument.value.id = response.data.data.id;
        hrDocument.value.addDays = response.data.data.addDays;
        hrDocument.value.title = response.data.data.title;
        hrDocument.value.issueDate = response.data.data.issueDate;
        hrDocument.value.Type = response.data.data.Type;
        hrDocument.value.Employee = response.data.data.Employee;
        hrDocument.value.Files = response.data.data.Files;
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

const isLoading = ref(false);

//#region Multi Files && Sections
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());
const SelectedSectionId = ref(0);
const ChosePushBy = ref(0);

//#endregion

const ActiveTab = ref(0);
const updateList = () => showData();

onMounted(async () => {
  isLoading.value = true;
  //console.log(can("show employees1"));
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  await sectionStore.get_sections();
  await HrDocumentStore.get_employees();
  await HrDocumentStore.get_hrDocumentTypes();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "HrDocument.Add";
    hrDocument.value.id = 0;
  } else {
    await showData();
    hrDocument.value.id = id.value;
    namePage.value = "HrDocument.Update";
  }
  isLoading.value = false;
});
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
        <van-tabs v-model:active="ActiveTab">
          <van-tab title="معلومات الكتاب">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Name')"
                  name="Name"
                  v-model="hrDocument.title"
                  type="text"
              /></ICol>
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
                  {{ t("Title") }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="hrDocument.Type"
                  :options="hrDocumentTypes"
                  :reduce="(hrDocumentType: IHrDocumentType) => hrDocumentType"
                  label="name"
                  :getOptionLabel="
                    (hrDocumentType: IHrDocumentType) => hrDocumentType.name
                  "
                >
                  <template #option="{ name, addDays }">
                    <div
                      class="dir:rtl text-right p-1 border-2 border-solid border-red-500"
                    >
                      <span>{{ name }}</span> <br /><span
                        v-if="addDays > 0"
                        class="text-gray-100"
                        >يظاف عدد ايام {{ addDays }}</span
                      >
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
            <!-- file -->
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol
                span="1"
                span-md="2"
                span-sm="1"
                class=""
                v-for="document in hrDocument.Files"
                :key="document.name"
              >
                <FilePreview :file="document" @updateList="updateList">
                </FilePreview>
              </ICol>
            </IRow>
            <DragDrop></DragDrop>
            <div class="px-6">
              <div id="showFiles" class="p-0 flex flex-col w-full list-none">
                <div class="w-64 content-center" v-if="isLoading">
                  <div
                    class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span
                      class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                    >
                  </div>
                </div>
              </div>
              <div id="DropZone"></div>
            </div>
          </van-tab>
          <van-tab title="توزيع متعدد">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IRadio
                  label="توزيع مفرد  "
                  name="ChosePushBy"
                  v-model="ChosePushBy"
                  value="0"
                  checked="true"
                />
              </ICol>
            </IRow>
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IRadio
                  label="توزيع حسب القسم"
                  name="ChosePushBy"
                  v-model="ChosePushBy"
                  value="1"
                />
              </ICol>

              <ICol span="1" span-md="1" span-sm="1">
                <ISelect
                  :label="t('Employee.Section')"
                  v-model="SelectedSectionId"
                  name="archiveTypeId"
                  :options="sections"
                  :IsRequire="true"
                  :-is-disabled="ChosePushBy != 1"
                />
              </ICol>
            </IRow>

            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IRadio
                  label="توزيع لجميع الموظفين"
                  name="ChosePushBy"
                  v-model="ChosePushBy"
                  value="2"
                />
              </ICol>
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
