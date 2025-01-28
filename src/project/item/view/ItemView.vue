<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemStore } from "../itemStore";
import { useItemCategoryStore } from "../itemCategoryStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";

import { t } from "@/utilities/I18nPlugin";
import type { IItem } from "../IItem";
import { EnumPermission } from "@/utilities/EnumSystem";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import IInput from "@/components/inputs/IInput.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { prepareFormData } from "@/utilities/crudTool";

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
  {
    field: "Category",
    caption: t("Item.Category"),
    rules: [isObject({ key: "id", message: "" })],
  }, 
];
import { WarningToast } from "@/utilities/Toast";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("Item");
const route = useRoute();
const id = ref(Number(route.params.id));

const itemStore = useItemStore();
const { item } = storeToRefs(useItemStore());
const itemCategoryStore = useItemCategoryStore();
const { categories } = storeToRefs(useItemCategoryStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  validationResult.value = validate(item.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const formData = prepareFormData(item.value);
  itemStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your item has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemStore.getError(error);
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
  const formData = prepareFormData(item.value);
  itemStore
    .update(item.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemStore.getError(error);
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
        await itemStore._delete(item.value.id).then(() => {
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
  await itemStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        item.value.name = response.data.data.name;
        item.value = response.data.data as IItem;
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
  Loading.value = false;
};
//#endregion
const back = () => {
  router.push({
    name: "itemIndex",
  });
};
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray([EnumPermission.ShowItems]);
  await itemCategoryStore.getFast();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "ItemAdd";
    item.value.id = 0;
  } else {
    await showData();
    item.value.id = id.value;
    namePage.value = "ItemUpdate";
  }
});
const reset = () => {
  namePage.value = "ItemAdd";

  itemStore.resetData();
};
</script>
<template>
  <IPage :HeaderTitle="t(namePage)">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" pre-icon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="1" span-sm="1">
              <IInput :label="t('Item.Name')" name="name" v-model="item.name" :type="EnumInputType.Text" />
            </ICol>
            <ICol span="1" span-md="1" span-sm="1">
              <IInput :label="t('Item.Code')" name="code" v-model="item.code" :type="EnumInputType.Text" />
            </ICol>
            <ICol span="1" span-md="1" span-sm="1">
              <ISelect :label="t('Item.Category')" v-model="item.Category.id" name="Item.Category" :options="categories"
                :IsRequire="true" />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('Item.Unit')" name="Item.Unit" v-model="item.measuringUnit"
                :type="EnumInputType.Text" />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <IInput :label="t('Description')" name="name" v-model="item.description" :type="EnumInputType.Text" />
            </ICol>
          </IRow>
        </IForm>
      </IRow>
      <IRow>
        <IErrorMessages :validationResult="validationResult" ref="someRefName" />
        <IFooterCrud :isAdd="item.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
      </IRow>
    </IPageContent>
  </IPage>
</template>
