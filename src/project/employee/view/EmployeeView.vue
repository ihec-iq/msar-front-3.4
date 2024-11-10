<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "../employeeStore";
import { useBonusStore } from "@/project/bonus/bonusStore";

import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";

import { t } from "@/utilities/I18nPlugin";
import type { IUser } from "@/project/user/IUser";
import { useUserStore } from "@/project/user/userStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import { EnumButtonType } from "@/components/ihec/IButton2.vue";
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
const showUserPanel = ref(false);
const isMoveSection = ref(false);

const employeeStore = useEmployeeStore();
const BonusStore = useBonusStore();

const { employee, employees_types, employees_positions, employees_centers } =
  storeToRefs(useEmployeeStore());
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<string | null>();
const SelectedUsers = ref<Array<IUser>>([]);
//#endregion
//region"Validation"
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { WarningToast } from "@/utilities/Toast";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import { makeFormDataFromObject } from "@/utilities/tools";

const { validate, isArray, required, isObject } = useValidation();

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const rules: Array<IFieldValidation> = [
  {
    field: "Section",
    caption: t("InputVoucherNumber"),
    rules: [required()],
  },
  // {
  //   field: "Employee",
  //   caption: t("OutputVoucherEmployeeRequest"),
  //   rules: [isObject({ key: "id", message: "" })],
  // },
  {
    field: "Section",
    caption: t("Section"),
    rules: [isObject({ key: "id", message: "" })],
  },
  {
    field: "BonusDegreeStage",
    caption: t("Bonus.DegreeStage"),
    rules: [isObject({ key: "id", message: "" })],
  },
  {
    field: "BonusStudy",
    caption: t("Bonus.Study"),
    rules: [isObject({ key: "id", message: "" })],
  },
  {
    field: "BonusJobTitle",
    caption: t("Bonus.JobTitle"),
    rules: [isObject({ key: "id", message: "" })],
  },
];
//#endregion
//#region CURD
const reset = () => {
  employeeStore.resetData();
  isPerson.value = true;
};
const store = async () => {
  errors.value = null;
  validationResult.value = validate(employee.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    const someElement = ref() // assigned to some element in the template
    const element = someElement.value
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - 60 // 60px offset from top

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    return;
  }
  errors.value = null;
  const formData = prepareFormData(employee.value);
  try {
    const response = await employeeStore.store(formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.value = employeeStore.getError(error as any);
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
  validationResult.value = validate(employee.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  employee.value.isPerson = isPerson.value ? 1 : 0;
  employee.value.isMoveSection = isMoveSection.value ? 1 : 0;
  const formData = prepareFormData(employee.value);
  try {
    const response = await employeeStore.update(employee.value.id, formData);
    console.log(response)
    if (response.status === 200) {
      SuccessToast();
      //router.go(-1);
    }
  } catch (error) {
    errors.value = employeeStore.error;
    console.log(error)
    Swal.fire({
      icon: "error",
      title: "Updating data failed!",
      text: employeeStore.error?.toString(),
    });
  }
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
      title: t('Are You Sure?'),
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
          ).then(() => {
            router.back();
          });
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
        // employee.value.id = response.data.data.id;
        // employee.value.name = response.data.data.name;
        // employee.value.idCard = response.data.data.idCard;
        // employee.value.number = response.data.data.number;
        // employee.value.telegram = response.data.data.telegram;
        // employee.value.dateWork = response.data.data.dateWork;
        // employee.value.Section = response.data.data.Section;
        // employee.value.MoveSection = response.data.data.MoveSection;
        // employee.value.User = response.data.data.User;
        // employee.value.EmployeeType = response.data.data.EmployeeType;
        // employee.value.EmployeeCenter = response.data.data.EmployeeCenter;
        // employee.value.EmployeePosition = response.data.data.EmployeePosition;
        // employee.value.isPerson = response.data.data.isPerson;
        Object.assign(employee.value, response.data.data); console.log(response.data)
        isPerson.value = response.data.data.isPerson == 0 ? false : true;
        isMoveSection.value =
          response.data.data.isMoveSection == 0 ? false : true;
      }
    })
    .catch((errors) => {
      console.log(errors);
      let error = getError(errors);
      console.log(error);
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


  await Promise.all([
    sectionStore.get_sections(),
    employeeStore.get_employee_types(),
    employeeStore.get_employee_positions(),
    employeeStore.get_employee_centers(),
    BonusStore.get_BonusJobTitle(),
    BonusStore.get_BonusStudy(),
    BonusStore.get_BonusDegreeStage(),
    BonusStore.get_EmployeesLite()
  ]);

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

//#region
import { useHrDocumentStore } from "@/project/hr/hrDocumentStore";
import type { IHrDocument, IHrDocumentFilter } from "@/project/hr/IHrDocument";
import type { ITableHeader } from "@/types/core/components/ITable";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import { IBonusDegreeStage, IBonusJobTitle } from "@/project/bonus/IBonus";
import { prepareFormData } from "@/utilities/crudTool";
import { SuccessToast } from "@/utilities/Toast";
import EditButton from "@/components/dropDown/EditButton.vue";
import { Icon } from "@iconify/vue";
import { getError } from "@/utilities/helpers";

const { get_filter } = useHrDocumentStore();

const dataBaseFiles = ref<Array<IHrDocument>>([]);

const searchFilter = ref<IHrDocumentFilter>({
  title: "",
  limit: 10,
  employeeName: "",
});
const getFilterData = async (page = 1) => {
  if (active.value == 1) {
    searchFilter.value.employeeId = employee.value.id;
    if (Number(searchFilter.value.employeeId) < 1) return;
    isLoading.value = true;

    //searchFilter.value.title = fastSearch.value.toString();
    await get_filter(searchFilter.value, page)
      .then((response) => {
        if (response.status == 200) {
          dataBaseFiles.value = response.data.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    isLoading.value = false;
  }
};
const headers = ref<Array<ITableHeader>>([
  { caption: t('Title'), value: "title" },
  { caption: t('Details'), value: "actions" },
  { caption: t('IsActive'), value: "isActive" },
  { caption: t('Employee.Title'), value: "EmployeeName" },
  { caption: t('Date'), value: "issueDate" },
  { caption: t('HrDocument.Type'), value: "HrDocumentype" },
  { caption: t('HrDocument.AddDayes'), value: "addDays" },
]);
const openFile = (id: number) => {
  router.push({
    name: "hrDocumentUpdate",
    params: { id: id },
  });
};
const addHrDocument = (id: number) => {
  router.push({
    name: "hrDocumentAddByEmployee",
    params: { employeeId: id },
  });
};
const openHrDocument = (id: number) => {
  router.push({
    name: "hrDocumentIndex",
    params: { employeeId: id },
  });
};
//#endregion
const active = ref(0);
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" pre-icon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <van-tabs v-model:active="active" @click-tab="getFilterData">
          <van-tab title="معلومات الموظف">
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Name')" name="Name" v-model="employee.name" type="text" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Employee.Number')" name="Employee.Number" v-model="employee.number" type="text" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Employee.Telegram')" name="EmployeeTelegram" v-model="employee.telegram"
                  type="text" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Employee.IdCard')" name="EmployeeIdCard" v-model="employee.idCard" type="text" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Employee.DateWork')" name="EmployeeDateWork" v-model="employee.dateWork"
                  type="date" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ISelect :label="t('Employee.Section')" v-model="employee.Section.id" name="archiveTypeId"
                  :options="sections" :IsRequire="true" class="focus:border-gray-200 focus:border-red-200" />
              </ICol>

              <ICol span="1" span-md="1" span-sm="1">
                <ISelect :label="t('Employee.Position')" v-model="employee.EmployeePosition.id" name="PostionId"
                  :options="employees_positions" :IsRequire="true" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ISelect :label="t('Employee.Type')" v-model="employee.EmployeeType.id" name="TypeId"
                  :options="employees_types" :IsRequire="true" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ISelect :label="t('Employee.Center')" v-model="employee.EmployeeCenter.id" name="CecnterId"
                  :options="employees_centers" :IsRequire="true" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <ICheckbox v-model="isPerson" :checked="isPerson">
                  {{ t('Employee.IsPerson') }} :
                  {{ isPerson ? " شخص " : " قسم " }}</ICheckbox>
              </ICol>
              <ICol span="1" span-md="1" span-sm="1" class="mt-5">
                <ICheckbox v-model="isMoveSection" :checked="isMoveSection" class="">
                  {{ t('Employee.isMoveSection') }} :
                  {{ isMoveSection ? " نعم " : " كلا " }}</ICheckbox>
              </ICol>

              <ICol span="1" span-md="1" span-sm="1" v-if="isMoveSection">
                <ISelect :label="t('Employee.MoveSection')" v-model="employee.MoveSection.id" name="MoveSectionId"
                  :options="sections" :IsRequire="true" />
              </ICol>
              <!-- :IsDisabled="!isMoveSection" -->

              <!-- <ICol span="1" span-md="2" span-sm="4">
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t('OutputVoucherEmployeeRequest') }}
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
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Bonus.numberLastBonus')" name="numberLastBonus" v-model="employee.numberLastBonus"
                  type="text" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Bonus.dateLastBonus')" name="dateLastBonus" v-model="employee.dateLastBonus"
                  type="date" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput :label="t('Bonus.dateNextBonus')" name="dateNextBonus" disabled v-model="employee.dateNextBonus"
                  type="date" />
              </ICol>
              <ICol span="1" span-md="2" span-sm="4">
                <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
                  {{ t('Bonus.JobTitle') }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="employee.BonusJobTitle" :options="BonusStore.BonusJobTitles"
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
                  {{ t('Bonus.Study') }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="employee.BonusStudy" :options="BonusStore.BonusStudies" :reduce="(BonusStudy) => BonusStudy"
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
                  {{ t('Bonus.DegreeStage') }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="employee.BonusDegreeStage" :options="BonusStore.BonusDegreeStages"
                  :reduce="(BonusDegreeStage: IBonusDegreeStage) => BonusDegreeStage" label="title"
                  :getOptionLabel="(BonusDegreeStage: IBonusDegreeStage) => BonusDegreeStage.title">
                  <template #option="{ title, salery, yearlyBonus, yearlyService }">
                    <div class="dir-rtl text-right p-1 border-2 border-solid border-red-700">
                      <span>{{ title }} </span><br>
                      <span>{{ t('Employee.salery') + ' :' + ConvertToMoneyFormat(salery) }} </span><br>
                      <span>{{ t('Employee.yearlyBonus') + ' :' + ConvertToMoneyFormat(yearlyBonus) }} </span><br>
                      <span>{{ t('Employee.yearlyService') + ' :' + ConvertToMoneyFormat(yearlyService) }} </span>
                    </div>
                  </template>
                </vSelect>
              </ICol>
            </IRow>
            <div class="mt-2">
              <label for="showUserPanel">اظهار معلومات المستخدم</label>
              <input class="right-0" type="checkbox" id="showUserPanel" v-model="showUserPanel">
            </div>
            <IRow col-lg="3" col-md="2" col-sm="1" class="bg-[#C2D7FB]" v-if="showUserPanel">
              <ICol span="1" span-md="1" span-sm="1">
                <IVSelect :label="t('User')" v-model="employee.User" name="archiveTypeId" :options="SelectedUsers"
                  :IsRequire="true" />
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IButton2 :type="EnumButtonType.Outlined" class="mt-3" v-if="employee.User?.id" :on-click="ShowUser"
                  :text="t('Open')" />
              </ICol>
            </IRow>
          </van-tab>
          <van-tab title="ملفات الضبارة" v-if="employee.id > 0">
            <IRow col-lg="2" col-md="2" col-sm="2">
              <ICol span="2" span-md="2" span-sm="2">
                <EditButton class="mt-3  border-gray border-2" v-if="employee.id != 0"
                  @click="addHrDocument(employee.id)" title="HrDocument.Add" icon="mdi-plus-box" />
              </ICol>
              <ICol span="2" span-md="2" span-sm="2">
                <EditButton class="mt-3  border-gray border-2" v-if="employee.id != 0"
                  @click="openHrDocument(employee.id)" title="HrDocument.Open" icon="mdi-open-in-new" />
              </ICol>
            </IRow>

            <IRow col-lg="1" col-md="1" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <ITable :items="dataBaseFiles" :headers="headers">
                  <template v-slot:EmployeeName="{ row }">
                    <span>{{ row.Employee.name }}</span>
                  </template>
                  <template v-slot:isActive="{ row }">
                    <span v-if="row.isActive"
                      class="flex justify-center items-center border-2 border-green-400 rounded-md bg-green-100 p-0">
                      <Icon icon="mdi-check-circle" class="text-green-600"></Icon> مفعل
                    </span>
                    <span v-else
                      class="flex justify-center items-center border-2 border-red-400 rounded-md bg-red-100 p-0">
                      <Icon icon="mdi-pause-octagon" class="text-red-600"></Icon>
                      <span>غير مفعل</span>
                    </span>
                  </template>
                  <template v-slot:HrDocumentype="{ row }">
                    <span>{{ row.Type.name }}</span>
                  </template>
                  <template v-slot:actions="{ row }">
                    <EditButton title="Open" @click="openFile(row.id)" class="m-1" />
                  </template>
                </ITable>
              </ICol>

            </IRow>
          </van-tab>
        </van-tabs>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IErrorMessages :validationResult="validationResult" ref="someRefName" />
      <IFooterCrud :isAdd="employee.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
