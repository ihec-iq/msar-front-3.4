<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHrDocumentStore } from "../bonusesDocumentStore";
import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import type { IEmployeeLite } from "@/project/employee/IEmployee";
import type { IBonusesType } from "../IBonuses";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import ISelectObject from "@/components/inputs/ISelectObject.vue";
import IPage from "@/components/ihec/IPage.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import FilePreview from "@/project/archive/view/FilePreview.vue";
import DragDrop from "@/project/archive/view/DragDrop.vue";
import { useDragDropStore } from "@/project/archive/dragDrop";
import { Icon } from "@iconify/vue";
import { ToNumber } from "@/utilities/tools";

const { filesDataInput } = storeToRefs(useDragDropStore());
import { SuccessToast, ErrorToast, WarningToast } from "@/utilities/Toast";

//region"Drag and Drop"
import vSelect from "vue-select";

const isLoading = ref(false);

const ActiveTab = ref(0);
const openSectionDocument = ref(true);
function onChange(event: any) {
  addSelectedEmployee();
}
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

//#region Custom Employee select
const SelectedEmployee = ref<IEmployeeLite>({
  id: 0,
  name: "",
});
const SelectedEmployeesHeaders = ref<Array<ITableHeader>>([
  { caption: t("id"), value: "id" },
  { caption: t("Delete"), value: "delete" },
  { caption: t("Employee.Title"), value: "name" },
]);
const SelectedEmployeesData = ref<Array<IEmployeeLite>>([]);
const deleteSelectedEmployee = (emplyeeName: string): undefined => {
  if (SelectedEmployeesData.value.length == 1) {
    SelectedEmployeesData.value = [];
    return;
  }
  SelectedEmployeesData.value = SelectedEmployeesData.value.filter(
    (item) => item.name !== emplyeeName
  );
};
const addSelectedEmployee = () => {
  const newEmployee = <IEmployeeLite>{
    id: SelectedEmployee.value.id,
    name: SelectedEmployee.value.name,
  };
  if (newEmployee.name == "") return;
  const exists = SelectedEmployeesData.value.find(
    (emp) => emp.name === newEmployee.name
  );
  if (!exists) {
    SelectedEmployeesData.value.push(newEmployee);
    SelectedEmployeesData.value = [...SelectedEmployeesData.value];
    SelectedEmployee.value = { id: 0, name: "" };
  }
  let HtmlSelectedEmployee = document.getElementById("SelectedEmployee");
  HtmlSelectedEmployee?.focus();
};

//#endregion
//#region Multi Files && Sections
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());
import type { ISection } from "@/project/section/ISection";
import type { ITableHeader } from "@/types/core/components/ITable";
const SelectedSection = ref<ISection>({ id: 0, name: "" });
const ChosePushBy = ref(0);
enum EnumTypeChoseShareDocument {
  none = 0,
  toSection = 1,
  toAllEmployees = 2,
  toCustom = 3,
  toEmployee = 4,
}
//#endregion
const result = ref(false);

const store = async () => {
  errors.value = null;
 
  await conforimShareDocumnet().then((response) => {
    result.value = Boolean(response);
  });

  if (result.value === false || result.value === undefined) return;

  const formData = new FormData();
  formData.append("addDays", String(hrDocument.value.addDays));
  formData.append("title", hrDocument.value.title.toString());
  formData.append("issueDate", hrDocument.value.issueDate.toString());
  formData.append("hrDocumentTypeId", hrDocument.value.Type.id.toString());
  formData.append("employeeId", hrDocument.value.Employee.id.toString());

  formData.append("chosePushBy", ChosePushBy.value.toString());
  if (ChosePushBy.value == EnumTypeChoseShareDocument.toSection)
    formData.append("selectedSectionId", SelectedSection.value.id.toString());
  if (ChosePushBy.value == EnumTypeChoseShareDocument.toCustom)
    formData.append(
      "SelectedEmployeesData",
      JSON.stringify(SelectedEmployeesData.value)
    );

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
const update = async () => {
  errors.value = null;
  await conforimShareDocumnet().then((response) => {
    result.value = Boolean(response);
  });

  if (result.value === false || result.value === undefined) return;

  const formData = new FormData();
  formData.append("addDays", String(hrDocument.value.addDays));
  formData.append("title", hrDocument.value.title.toString());
  formData.append("issueDate", hrDocument.value.issueDate.toString());
  formData.append("hrDocumentTypeId", hrDocument.value.Type.id.toString());
  formData.append("employeeId", hrDocument.value.Employee.id.toString());
  formData.append("chosePushBy", ChosePushBy.value.toString());
  if (ChosePushBy.value == EnumTypeChoseShareDocument.toSection)
    formData.append("selectedSectionId", SelectedSection.value.id.toString());
  if (ChosePushBy.value == EnumTypeChoseShareDocument.toCustom)
    formData.append(
      "SelectedEmployeesData",
      JSON.stringify(SelectedEmployeesData.value)
    );
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }
  HrDocumentStore.update(hrDocument.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        filesDataInput.value = [];
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
};
const conforimShareDocumnet = async () => {
   const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });
  // defualt check is 2 = select all employees
  let msg = "";  
  if (ChosePushBy.value == EnumTypeChoseShareDocument.toSection) {
    if (SelectedSection.value.id < 1) {
      swalWithBootstrapButtons.fire(
        t("تنبيه !"),
        t("يجب ان تقوم بأختيار قسم محدد"),
        "warning"
      );
      return false;
    }
    msg = "اضاف الكتاب الى قسم " + SelectedSection.value.name;
  } else if (ChosePushBy.value == EnumTypeChoseShareDocument.toCustom) {
    if (SelectedEmployeesData.value.length < 1) {
      swalWithBootstrapButtons.fire(
        t("تنبيه !"),
        t("يجب ان تقوم بأختيار موظفين"),
        "warning"
      );
      return false;
    }
    msg = "اضاف الكتاب الى مجموعة الموظفين " + SelectedSection.value.name;
  } else if (ChosePushBy.value == EnumTypeChoseShareDocument.toAllEmployees) {
    msg = "اضافة الكتاب الى جميع الموظفين";
  } else {
    // that mean it for one employee
    if (Number(hrDocument.value.Employee.id) < 1) {
      swalWithBootstrapButtons.fire(
        t("تنبيه !"),
        t("يجب ان تقوم بأختيار الموظف"),
        "warning"
      );
      ActiveTab.value = 0;
      return false;
    }
    return true;
  }

  let re = false;
  await swalWithBootstrapButtons
    .fire({
      title: "تأكيد من توزيع الكتاب",
      text: "هل انت متأكد من " + msg,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, do it"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary m-2",
        cancelButton: "btn btn-danger",
      },
    })
    .then(async (result) => {
      re = result.isConfirmed;
    })
    .catch((error) => {
      console.log("error from dailog is ", error);
    });
  return re;

  //return Promise.resolve(false);
};
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
      title: t("تأكيد عملية الحذف"),
      text: t("Confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Are You Sure?"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await HrDocumentStore._delete(hrDocument.value.id).then(() => {
          swalWithBootstrapButtons.fire(
            t("Delete!"),
            t("Deleted Successfully ."),
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
        ChosePushBy.value = EnumTypeChoseShareDocument.toEmployee;
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

onMounted(async () => {
  isLoading.value = true;
  //console.log(can("show employees1"));
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  filesDataInput.value = [];

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
    ChosePushBy.value = 0;
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
                  :label="t('Title')"
                  name="Name"
                  v-model="hrDocument.title"
                  type="text"
              /></ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Date')"
                  name="EmployeeDateWork"
                  v-model="hrDocument.issueDate"
                  type="date"
                />
              </ICol>
              <ICol span="1" span-md="2" span-sm="4">
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("TypeBook") }}
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
                      class="dir:rtl text-right p-1 border-2 border-solid border-red-700"
                    >
                      <span>{{ name }}</span> <br /><span
                        v-if="addDays > 0"
                        class="dark:text-gray-100 text-gray-600"
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
            <IRow col-lg="1" col-md="1" col-sm="1">
              <div
                class="collapse align-middle w-full"
                v-if="ToNumber(hrDocument.Files?.length) > 0"
              >
                <input
                  type="checkbox"
                  class=""
                  v-model="openSectionDocument"
                  checked
                />
                <div
                  class="collapse-title align-middle content-center items-center flex border-dotted border-gray-200 border-2"
                >
                  <span class="mx-2 px-2">
                    لديك {{ hrDocument.Files?.length }} ملفات مرفقة , اضغط للعرض
                    الملفات
                  </span>
                  <Icon icon="mingcute:attachment-fill" />
                </div>
                <div class="collapse-content grid grid-cols-4">
                  <div class="mt-5"></div>
                  <ICol
                    span="1"
                    span-md="2"
                    span-sm="1"
                    class=""
                    v-for="document in hrDocument.Files"
                    :key="document.name"
                  >
                    <FilePreview :file="document" @updateList="showData" />
                  </ICol>
                </div>
              </div>
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
          <van-tab title="توزيع متعدد" v-if="hrDocument.id == 0">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IRadio
                  label="توزيع مفرد  "
                  name="ChosePushBy"
                  v-model="ChosePushBy"
                  value="0"
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
                <ISelectObject
                  :label="t('Employee.Section')"
                  v-model="SelectedSection"
                  name="selectedSection"
                  :options="sections"
                  :IsRequire="true"
                  :-is-disabled="
                    ChosePushBy != EnumTypeChoseShareDocument.toSection
                  "
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
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IRadio
                  label="توزيع محدد"
                  name="ChosePushBy"
                  v-model="ChosePushBy"
                  value="3"
                />
              </ICol>
              <ICol
                span="1"
                span-md="1"
                span-sm="1"
                :disabled="ChosePushBy != EnumTypeChoseShareDocument.toCustom"
              >
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("Employee.Title") }} قم بأختيار
                </div>
                <div class="flex pb-2">
                  <div class="flex w-full">
                    <vSelect
                      id="SelectedEmployee"
                      class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                      v-model="SelectedEmployee"
                      :options="employees"
                      :reduce="(employee: IEmployeeLite) => employee"
                      label="name"
                      @change="onChange($event)"
                      :getOptionLabel="
                        (employee: IEmployeeLite) => employee.name
                      "
                    >
                      <template #option="{ name }">
                        <div>
                          <span>{{ name }}</span>
                        </div>
                      </template>
                    </vSelect>
                  </div>
                  <div class="flex w-1/4">
                    <IButton2
                      @click="addSelectedEmployee"
                      id="SelectedEmployeeButton"
                      :text="t('Add')"
                    />
                  </div>
                </div>

                <ITable
                  :items="SelectedEmployeesData"
                  :headers="SelectedEmployeesHeaders"
                >
                  <template v-slot:name="{ row }">
                    <span>{{ row.name }}</span>
                  </template>
                  <template v-slot:id="{ row }">
                    <span>{{ row.id }}</span>
                  </template>
                  <template v-slot:delete="{ row }">
                    <IButton2
                      @click="deleteSelectedEmployee(row.name)"
                      :text="t('Delete')"
                    />
                  </template>
                </ITable>
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
<style></style>
