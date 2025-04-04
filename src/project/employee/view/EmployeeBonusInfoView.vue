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
import ISelect from "@/components/inputs/ISelect.vue";
import IPage from "@/components/ihec/IPage.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import IVSelect from "@/components/inputs/IVSelect.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { useHrDocumentStore } from "@/project/hr/hrDocumentStore";
import type { IHrDocument, IHrDocumentFilter } from "@/project/hr/IHrDocument";
import type { ITableHeader } from "@/types/core/components/ITable";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import type {
  IBonus,
  IDegreeStage,
  IBonusJobTitle,
  ICertificate,
  IStudy,
  IBonusFilter,
} from "@/project/bonus/IBonus";
import { prepareFormData } from "@/utilities/crudTool";
import { ErrorToast, SuccessToast } from "@/utilities/Toast";
import EditButton from "@/components/dropDown/EditButton.vue";
import { Icon } from "@iconify/vue";
import { getError } from "@/utilities/helpers";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("Employee.Add");
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
import OpenButton from "@/components/dropDown/OpenButton.vue";
import IRow from "@/components/ihec/IRow.vue";
import IRow2 from "@/components/ihec/IRow2.vue";
import ICol2 from "@/components/ihec/ICol2.vue";
import ICol from "@/components/ihec/ICol.vue";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";

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
    field: "DegreeStage",
    caption: t("Bonus.DegreeStage"),
    rules: [isObject({ key: "id", message: "" })],
  },
  {
    field: "Study",
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
    const response = await employeeStore.updateBonus(
      employee.value.id,
      formData
    );
    console.log(response);
    if (response.status === 200) {
      SuccessToast();
      showData();
      //router.go(-1);
    }
  } catch (error) {
    errors.value = employeeStore.error;
    console.error("An unknown error occurred:", error);
    ErrorToast("Update data failed!");
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
          swalWithBootstrapButtons
            .fire(t("Deleted!"), t("Deleted successfully ."), "success")
            .then(() => {
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
        Object.assign(employee.value, response.data.data);
        isPerson.value = employee.value.isPerson == 0 ? false : true;
        isMoveSection.value = employee.value.isMoveSection == 0 ? false : true;
        getFiles()
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
    name: "Employee.Index",
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
    BonusStore.get_BonusJobTitle(),
    BonusStore.get_Study(),
    BonusStore.get_Certificate(),
    BonusStore.get_DegreeStage(),
  ]);

  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "Employee.Add";
    employee.value.id = 0;
  } else {
    await showData();
    employee.value.id = id.value;
    namePage.value = "Employee.Update";
  }
  isLoading.value = false;
});

//#region

const dataBaseFiles = ref<Array<IHrDocument>>([]);
const dataBaseBonus = ref<Array<IBonus>>([]);
const searchFilter = ref<IHrDocumentFilter>({
  title: "",
  limit: 10,
  employeeName: "",
});
const getFiles = async (page = 1) => {
  searchFilter.value.employeeId = employee.value.id;
  if (Number(searchFilter.value.employeeId) < 1) return;
  isLoading.value = true;
  //searchFilter.value.title = fastSearch.value.toString();
  await useHrDocumentStore()
    .get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200 && response.data.data) {
        dataBaseFiles.value = response.data.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};

const recheckFilter = ref<IBonusFilter>({
  employeeName: "",
  employeeId: 0,
  limit: 10,
  title: "",
  isBound: true,
  bound: 0,
});

const { get_checkBonus, calculateBonus } = useBonusStore();
const recheckBonus = async () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-green-600 dark:bg-green-900",
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
      confirmButtonText: t("Yes, do it"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        isLoading.value = true;
        recheckFilter.value.employeeId = employee.value.id;
        SuccessToast();
        await calculateBonus(recheckFilter.value);
        await getFiles();
        isLoading.value = false;
      }
    });
};
const ChangeDegreeStage = async () => {
  if (employee.value.DegreeStage?.Degree) {
    await useBonusStore()
      .get_BonusJobTitle({
        bonusDegreeId: employee.value.DegreeStage.Degree.id,
      })
      .then((response) => {});
  }
};
const getBonus = async (page = 1) => {
  searchFilter.value.employeeId = employee.value.id;
  if (Number(searchFilter.value.employeeId) < 1) return;
  isLoading.value = true;

  //searchFilter.value.title = fastSearch.value.toString();
  await useBonusStore()
    .get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataBaseBonus.value = response.data.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};
const headerFiles = ref<Array<ITableHeader>>([
  { caption: t("Title"), value: "title" },
  { caption: t("Details"), value: "actions" },
  { caption: t("IsActive"), value: "isActive" },
  { caption: t("Date"), value: "issueDate" },
  { caption: t("HrDocument.Type"), value: "HrDocumentype" },
  { caption: t("HrDocument.AddMonths"), value: "addMonths" },
  { caption: t("HrDocument.AddDayes"), value: "addDays" },
  { caption: t("Notes"), value: "notes" },
]);
const headerBonus = ref<Array<ITableHeader>>([
  { caption: t("Bonus.number"), value: "number" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Date"), value: "issueDate" },
]);
const openFileHrDocument = (id: number) => {
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
const openFileBonus = (id: number) => {
  router.push({
    name: "bonusUpdate",
    params: { id: id },
  });
};
const addBonus = (id: number) => {
  router.push({
    name: "bonusAddByEmployee",
    params: { employeeId: id },
  });
};
const openBonus = (id: number) => {
  router.push({
    name: "bonusIndex",
    params: { employeeId: id },
  });
};
const loadData = (tab: any) => {
  // if (tab.name == "files") getFiles();
  if (tab.name == "bonus") getBonus();
};
//#endregion
const active = ref(0);
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading">
    <template #HeaderButtons>
      <!-- <IButton2
        color="green"
        width="28"
        :type="EnumButtonType.Outlined"
        pre-icon="view-grid-plus"
        :onClick="reset"
        :text="t('New')"
      /> -->
    </template>
    <IPageContent>
      <IRow>
        <van-tabs v-model:active="active" @click-tab="loadData" sticky>
          <van-tab title="معلومات العلاوات" name="employee">
            <IRow
              title="معلومات العلاوة الحالية"
              col-lg="4"
              col-md="2"
              col-sm="1"
            >
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Name')"
                  name="Name"
                  v-model="employee.name"
                  :type="EnumInputType.Text"
                  :disabled="true"
                />
              </ICol>

              <ICol span="1" span-md="1" span-sm="1">
                <ISelect
                  :label="t('Employee.Section')"
                  v-model="employee.Section.id"
                  name="archiveTypeId"
                  :options="sections"
                  :IsRequire="true"
                  class="focus:border-red-200"
                />
              </ICol>
            </IRow>
            <IRow col-lg="4" col-md="2" col-sm="1">
              <ICol span="1" span-md="2" span-sm="4">
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("Bonus.DegreeStageCurrent") }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="employee.DegreeStage"
                  :options="BonusStore.DegreeStages"
                  :reduce="(DegreeStage: IDegreeStage) => DegreeStage"
                  label="title"
                  :getOptionLabel="
                    (DegreeStage: IDegreeStage) => DegreeStage.title
                  "
                  @update:model-value="ChangeDegreeStage"
                >
                  <template
                    #option="{ title, salary, yearlyBonus, yearlyService }"
                  >
                    <div
                      class="dir-rtl text-right p-1 border-2 border-solid border-red-700"
                    >
                      <span>{{ title }} </span><br />
                      <span
                        >{{
                          t("Bonus.salary") +
                          " :" +
                          ConvertToMoneyFormat(salary)
                        }}
                      </span>
                      -
                      <span
                        >{{
                          t("Bonus.yearlyBonus") +
                          " :" +
                          ConvertToMoneyFormat(yearlyBonus)
                        }}
                      </span>
                      <!-- <span>{{ t('Bonus.yearlyService') + ' :' + ConvertToMoneyFormat(yearlyService) }} </span> -->
                    </div>
                  </template>
                </vSelect>
                <div
                  class="dir-rtl text-right p-1 border-2 border-solid border-red-700"
                >
                  <span
                    >{{
                      t("Bonus.salary") +
                      " :" +
                      ConvertToMoneyFormat(String(employee.DegreeStage?.salary))
                    }}
                  </span>
                  -
                  <span
                    >{{
                      t("Bonus.yearlyBonus") +
                      " :" +
                      ConvertToMoneyFormat(
                        String(employee.DegreeStage?.yearlyBonus)
                      )
                    }}
                  </span>
                  <!-- <span>{{ t('Bonus.yearlyService') + ' :' + ConvertToMoneyFormat(yearlyService) }} </span> -->
                </div>
              </ICol>
              <ICol span="1" span-md="2" span-sm="4">
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("Bonus.JobTitleCurrent") }}
                </div>
                <vSelect
                  class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="employee.BonusJobTitle"
                  :options="BonusStore.BonusJobTitles"
                  :reduce="(BonusJobTitle: IBonusJobTitle) => BonusJobTitle"
                  :getOptionLabel="
                    (BonusJobTitle: IBonusJobTitle) => BonusJobTitle.name
                  "
                >
                  <template #option="{ name }">
                    <div
                      class="dir-rtl text-right p-1 border-2 border-solid border-red-700"
                    >
                      <span>{{ name }}</span>
                    </div>
                  </template>
                </vSelect>
              </ICol>
              <ICol>
                <div class="flex justify-between">
                  <div class="w-[49%]">
                    <IInput
                      :label="t('Bonus.numberLastBonusCurrent')"
                      name="numberLastBonus"
                      v-model="employee.numberLastBonus"
                      :type="EnumInputType.Text"
                    />
                  </div>
                  <div class="w-[49%]">
                    <IInput
                      :label="t('Bonus.dateLastBonusCurrent')"
                      name="dateLastBonus"
                      v-model="employee.dateLastBonus"
                      :type="EnumInputType.Date"
                    />
                  </div>
                </div>
              </ICol>
              <ICol span="1" span-md="1" span-sm="1">
                <IInput
                  :label="t('Bonus.dateNextBonus')"
                  name="dateNextBonus"
                  disabled
                  v-model="employee.dateNextBonus"
                  :type="EnumInputType.Date"
                />
              </ICol>
            </IRow>
            <IRow class="flex justify-between spin-out-1 overflow-auto">
              <div class="flex">
                <EditButton
                  class="mt-3 border-gray border-2 ml-2"
                  v-if="employee.id != 0"
                  @click="addHrDocument(employee.id)"
                  title="HrDocument.Add"
                  icon="mdi-plus-box"
                />

                <EditButton
                  class="mt-3 border-gray border-2 ml-2"
                  v-if="employee.id != 0"
                  @click="openHrDocument(employee.id)"
                  title="HrDocument.Open"
                  icon="mdi-open-in-new"
                />
                <EditButton
                  class="mt-3 border-gray border-2 ml-2"
                  v-if="employee.id != 0"
                  @click="getFiles"
                  title="Refresh"
                  icon="mdi-refresh"
                />
                <EditButton
                  class="mt-3 border-gray border-2 ml-2"
                  v-if="employee.id != 0"
                  @click="recheckBonus"
                  title="Bonus.ReCalculate"
                  icon="mdi-refresh"
                />
              </div>
            </IRow>
            <IRow col-lg="1" col-md="1" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <ITable :items="dataBaseFiles" :headers="headerFiles">
                  <template v-slot:isActive="{ row }">
                    <span
                      v-if="row.isActive"
                      class="flex justify-center w-full items-center border-2 rounded-md dark:text-textLight text-text border-green-400 bg-green-100 dark:bg-green-950 p-0"
                    >
                      <Icon
                        icon="mdi-check-circle"
                        class="text-green-600"
                      ></Icon>
                      مفعل
                    </span>
                    <span
                      v-else
                      class="flex justify-center w-full items-center border-2 dark:text-textLight text-text border-red-400 rounded-md bg-red-100 dark:bg-red-950 p-0"
                    >
                      <Icon
                        icon="mdi-pause-octagon"
                        class="text-red-600"
                      ></Icon>
                      <span>غير مفعل</span>
                    </span>
                  </template>
                  <template v-slot:HrDocumentype="{ row }">
                    <span>{{ row.Type.name }}</span>
                  </template>
                  <template v-slot:actions="{ row }">
                    <OpenButton
                      title="Open"
                      @click="openFileHrDocument(row.id)"
                      class="m-1"
                    />
                  </template>
                </ITable>
              </ICol>
            </IRow>
          </van-tab>
          <van-tab
            title="العلاوات والترفيعات"
            v-if="employee.id > 0"
            name="bonus"
          >
            <IRow class="flex justify-between spin-out-3">
              <div class="flex">
                <EditButton
                  class="mt-3 border-gray border-2 ml-2"
                  v-if="employee.id != 0"
                  @click="addBonus(employee.id)"
                  title="Bonus.Add"
                  icon="mdi-plus-box"
                />
                <EditButton
                  class="mt-3 border-gray border-2 ml-2"
                  v-if="employee.id != 0"
                  @click="getBonus"
                  :title="t('Refresh')"
                  icon="mdi-refresh"
                />
                <EditButton
                  class="mt-3 border-gray border-2"
                  v-if="employee.id != 0"
                  @click="openBonus(employee.id)"
                  title="Bonus.Open"
                  icon="mdi-open-in-new"
                />
              </div>
            </IRow>
            <IRow col-lg="1" col-md="1" col-sm="1">
              <ICol span="1" span-md="1" span-sm="1">
                <ITable :items="dataBaseBonus" :headers="headerBonus">
                  <template v-slot:actions="{ row }">
                    <OpenButton
                      title="Open"
                      @click="openFileBonus(row.id)"
                      class="m-1"
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
      <IErrorMessages :validationResult="validationResult" ref="someRefName" />
      <IFooterCrud :is-add="false" :onUpdate="update" :show-delete="false" />
    </template>
  </IPage>
</template>
