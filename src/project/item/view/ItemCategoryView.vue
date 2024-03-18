<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemCategoryStore } from "../itemCategoryStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permissionStore";
import { t } from "@/utils/I18nPlugin";
import { EnumPermission } from "@/utils/EnumSystem";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const { category } = storeToRefs(useItemCategoryStore());
const itemCategoryStore = useItemCategoryStore();

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("id", category.value.id.toString());
  formData.append("name", category.value.name.toString());
  formData.append("description", String(category.value.description));

  itemCategoryStore
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
  const formData = new FormData();
  formData.append("name", category.value.name.toString());
  formData.append("description", String(category.value.description));
  itemCategoryStore
    .update(category.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
  Loading.value = true;
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
  checkPermissionAccessArray([EnumPermission.ShowCategoriesItem]);
  await itemCategoryStore.getFast();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("Add") + " " + t("ItemCategory");
    category.value.id = 0;
  } else {
    await showData();
    category.value.id = id.value;
    namePage.value = t("Update") + " " + t("ItemCategory");
  }
});
const reset = () => {
  useItemCategoryStore().resetData();
};
</script>
<template>
  <IPage :HeaderTitle="namePage">
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
          <IRow col-lg="2" col="2" col-md="2">
            <ICol>
              <IInput
                :label="t('Name')"
                name="name"
                v-model="category.name"
                type="text"
            /></ICol>
            <ICol>
              <IInput
                :label="t('Description')"
                name="description"
                v-model="category.description"
                type="text"
            /></ICol>
          </IRow>
          <IFooterCrud
            :isAdd="category.id == 0"
            :onCreate="store"
            :onUpdate="update"
            :onDelete="Delete"
          />
        </IForm>
      </IRow>
    </IPageContent>
  </IPage>
</template>
@/project/item/itemCategoryStore@/project/user/permissionStore