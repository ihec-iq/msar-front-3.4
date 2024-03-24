<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemStore } from "../itemStore";
import { useItemCategoryStore } from "../itemCategoryStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/project/user/permissionStore";

import { t } from "@/utilities/I18nPlugin";
import type { IItem } from "../IItem";
import { EnumPermission } from "@/utilities/EnumSystem";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
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
  const formData = new FormData();
  formData.append("id", String(item.value.id));
  formData.append("name", item.value.name);
  formData.append("description", item.value.description);
  formData.append("code", item.value.code);
  formData.append("measuringUnit", item.value.measuringUnit);
  formData.append("Category", JSON.stringify(item.value.Category));
  itemStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
  const formData = new FormData();
  formData.append("name", item.value.name.toString());
  formData.append("description", item.value.description.toString());
  formData.append("code", item.value.code.toString());
  formData.append("measuringUnit", item.value.measuringUnit.toString());
  formData.append("Category", JSON.stringify(item.value.Category));
  itemStore
    .update(item.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
        position: "top-end",
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
  itemStore.resetData();
};
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
            <ICol span="1" span-md="1" span-sm="1">
              <IInput
                :label="t('Name')"
                name="name"
                v-model="item.name"
                type="text"
            /></ICol>
            <ICol span="1" span-md="1" span-sm="1">
              <IInput
                :label="t('ItemCode')"
                name="code"
                v-model="item.code"
                type="text"
            /></ICol>
             <ICol span="1" span-md="1" span-sm="1">
              <!-- <ISelect
                :label="t('ItemCategory')"
                v-model="item.Category.id"
                name="ItemCategory"
                :options="categories"
                :IsRequire="true"
              /> -->
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight _inputLabel"
              >
                {{ t("ItemCategory") }}
              </div>
              <select v-model="item.Category.id" class="_input">
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('ItemUnit')"
                name="ItemUnit"
                v-model="item.measuringUnit"
                type="text"
            /></ICol>
          </IRow> 
          <IRow>
            <ICol>
              <IInput
                :label="t('Description')"
                name="name"
                v-model="item.description"
                type="text"
            /></ICol>
          </IRow>
        </IForm>
      </IRow>
      <IRow>
        <IFooterCrud
          :isAdd="item.id == 0"
          :onCreate="store"
          :onUpdate="update"
          :onDelete="Delete"
        />
      </IRow>
    </IPageContent>
  </IPage>
</template>@/project/user/permissionStore@/utilities/I18nPlugin@/utilities/EnumSystem