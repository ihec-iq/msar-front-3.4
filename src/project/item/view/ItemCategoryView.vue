<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemCategoryStore } from "../itemCategoryStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
//region"Validation"
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
const { validate, required, isObject } = useValidation();
let validationResult = ref<IValidationResult>({ success: true, errors: [] });
const rules: Array<IFieldValidation> = [
  {
    field: "name",
    caption: t("Item.Name"),
    rules: [required()],
  }, 
];
import { WarningToast } from "@/utilities/Toast";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import { prepareFormData } from "@/utilities/crudTool";
//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("Item.Category");
const route = useRoute();
const id = ref(Number(route.params.id));

const { category } = storeToRefs(useItemCategoryStore());
const itemCategoryStore = useItemCategoryStore();

const isLoding = ref(false);

const router = useRouter();
const errors = ref<string | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  validationResult.value = validate(category.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const formData = prepareFormData(category.value);

  itemCategoryStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your item has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        //router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemCategoryStore.getError(error);
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
  validationResult.value = validate(category.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const formData = prepareFormData(category.value);

  itemCategoryStore
    .update(category.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your Category has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemCategoryStore.getError(error);
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
        await itemCategoryStore._delete(category.value.id).then(() => {
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
  isLoding.value = true;
  await itemCategoryStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        category.value.id = response.data.data.id;
        category.value.name = response.data.data.name;
        category.value.description = response.data.data.description;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        icon: "warning",
        title: "Your Item file not exist !!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.go(-1);
      });
    });
  isLoding.value = false;
};
//#endregion
onMounted(async () => {
  isLoding.value = true;
  checkPermissionAccessArray([EnumPermission.ShowCategoriesItem]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("Add") + " " + t("Item.Category");
    category.value.id = 0;
    reset();
  } else {
    category.value.id = id.value;
    await showData();
    namePage.value = t("Update") + " " + t("Item.Category");
  }
  isLoding.value = false;
});
const reset = () => {
  useItemCategoryStore().resetData();
};
</script>
<template>
  <IPage :HeaderTitle="namePage" :islo="isLoding">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" pre-icon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <IRow col-lg="2" col="2" col-md="2">
          <ICol>
            <IInput :label="t('Name')" name="name" v-model="category.name" :type="EnumInputType.Text" />
          </ICol>
          <ICol>
            <IInput :label="t('Description')" name="description" v-model="category.description"
              :type="EnumInputType.Text" />
          </ICol>
        </IRow>
        <IErrorMessages :validationResult="validationResult" ref="someRefName" />
        <IFooterCrud :isAdd="category.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
      </IRow>
    </IPageContent>
  </IPage>
</template>
