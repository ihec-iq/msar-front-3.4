<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { useArchiveTypeStore } from "../archiveTypeStore";
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { ErrorToast, SuccessToast, WarningToast } from "@/utilities/Toast";
import IForm from "@/components/ihec/IForm.vue";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
const { validate, min, required, max } = useValidation();

const rules: Array<IFieldValidation> = [
  {
    field: "name",
    caption: t("Name"),
    rules: [required(), min(3), max(32)],
  },
];

const archiveTypeStore = useArchiveTypeStore();
const { archiveType } = useArchiveTypeStore();
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("");
const route = useRoute();
const id = ref(Number(route.params.id));
const Loading = ref(false);
const router = useRouter();
const errors = ref<string | null>();

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowArchiveTypes]);

  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("Add") + " " + t("archiveType");
  } else {
    await getObject();
    namePage.value = t("Update") + " " + t("archiveType");
  }
});

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

//#region CURD
const storeObject = () => {
  validationResult.value = validate(archiveType, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }

  errors.value = null;
  const formData = new FormData();
  formData.append("id", archiveType.id.toString());
  formData.append("name", archiveType.name.toString());
  formData.append("description", String(archiveType.description));

  archiveTypeStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        router.go(-1);
      }
    })
    .catch((error) => {
      ErrorToast();
    });
};

function updateObject() {
  validationResult.value = validate(archiveType, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }

  errors.value = null;
  const formData = new FormData();
  formData.append("name", archiveType.name.toString());
  formData.append("description", String(archiveType.description));

  archiveTypeStore
    .update(archiveType.id, formData)
    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        router.go(-1);
      }
    })
    .catch((error) => {
      ErrorToast();
    });
}

const deleteObject = async () => {
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
        await archiveTypeStore._delete(archiveType.id).then(() => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          router.go(-1);
        });
      }
    })
    .catch((error) => {
      ErrorToast();
    });
};

const getObject = async () => {
  Loading.value = true;
  await archiveTypeStore
    .getById(id.value)
    .then((response) => {
      if (response.status === 200) {
        archiveType.id = response.data.data.id;
        archiveType.name = response.data.data.name;
        archiveType.description = response.data.data.description;
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

const reset = () => {
  useArchiveTypeStore().resetData();
};
</script>
<template>
  <IPage :HeaderTitle="namePage">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        :type="EnumButtonType.Outlined"
        pre-icon="view-grid-plus"
        :onClick="reset"
        :text="t('New')"
      />
    </template>
    <IPageContent>
      <IRow>
        
          <IRow col-lg="2" col="2" col-md="2">
            <ICol>
              <IInput
                :label="t('Name')"
                name="name"
                v-model="archiveType.name"
                type="text"
            /></ICol>
            <ICol>
              <IInput
                :label="t('Description')"
                name="description"
                v-model="archiveType.description"
                type="text"
            /></ICol>
          </IRow>
          <IErrorMessages :validationResult="validationResult" />

          <IFooterCrud
            :isAdd="archiveType.id == 0"
            :onCreate="storeObject"
            :onUpdate="updateObject"
            :onDelete="deleteObject"
          />
         
      </IRow>
    </IPageContent>
  </IPage>
</template>