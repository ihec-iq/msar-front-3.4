<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import { useBonusStore } from "@/project/bonus/bonusStore";
import { SuccessToast } from "@/utilities/Toast";
import {   IBonusJobTitle } from "@/project/bonus/IBonus";
import BonusJobTitleIndexView from "./BonusJobTitleIndexView.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
const route = useRoute();
const router = useRouter();
const id = ref(Number(route.params.id));
const { checkPermissionAccessArray } = usePermissionsStore();
const BonusStore = useBonusStore();
const { BonusJobTitle } = storeToRefs(BonusStore);

const isLoading = ref(false);
const errors = ref<string | null>(null);
const namePage = ref("Bonus.JobTitle");

const store = async () => {
  errors.value = null;
  const formData = new FormData();
  Object.entries(BonusJobTitle.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  try {
    const response = await BonusStore.store_BonusJobTitle(formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.value = BonusStore.getError(error as any);
      Swal.fire({
        icon: "error",
        title: "Create new data failed!",
        text: error.message,
      });
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
  const formData = new FormData();
  Object.entries(BonusJobTitle.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  try {
    const response = await BonusStore.update_BonusJobTitle(BonusJobTitle.value.id, formData);
    if (response.status === 200) {
      SuccessToast();
      router.go(-1);
    }
  } catch (error) {
    errors.value = BonusStore.error;
    Swal.fire({
      icon: "error",
      title: "Updating data failed!",
      text: BonusStore.error?.toString(),
    });
  }
};

const Delete = async () => {
  const result = await Swal.fire({
    title: t("Confirm deletion"),
    text: t("Are you sure?"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("Yes, delete it!"),
    cancelButtonText: t("No, cancel!"),
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await BonusStore.delete_BonusJobTitle(BonusJobTitle.value.id);
      Swal.fire(t("Deleted!"), t("Deleted Successfully."), "success");
      router.go(-1);
    } catch (error) {
      Swal.fire("Error", "Deletion failed", "error");
    }
  }
};

const showData = async () => {
  await BonusStore.show_BonusJobTitle(id.value).then((response) => {
    if (response.status === 200) {
      Object.assign(BonusJobTitle.value, response.data.data);
    }
  }).catch((error) => {
    console.error(error);
    Swal.fire({
      icon: "warning",
      title: "Employee file does not exist!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.go(-1);
    });
  });
};
const reset = () => {
  BonusStore.resetDataBonusJobTitle();
};
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);

  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "Bonus.JobTitleAdd";
    BonusJobTitle.value.id = 0;
  } else {
    BonusJobTitle.value.id = id.value;
    namePage.value = "Bonus.JobTitleUpdate";
    await showData();
  }
  isLoading.value = false;
});

</script>

<template>
  <IPage :HeaderTitle="t(namePage)" :isLoading="isLoading">
    <template #headerButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" preIcon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <IRow col-lg="4" col-md="2" col-sm="1">
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Name')" name="Name" v-model="BonusJobTitle.name" :type="EnumInputType.Text" />
          </ICol>
          <ICol span="1" span-md="1" span-sm="1">
            <IInput :label="t('Description')" name="Description" v-model="BonusJobTitle.description"
              :type="EnumInputType.Text" />
          </ICol>
        </IRow>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :isAdd="BonusJobTitle.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
