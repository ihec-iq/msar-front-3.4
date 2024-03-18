<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { usePermissionStore } from "@/stores/permissionStore";
import { t } from "@/utils/I18nPlugin";
import { EnumPermission } from "@/utils/EnumSystem";
import { useArchiveTypeStore } from "@/views/Archive/archiveType/archiveTypeStore";

const archiveTypeStore = useArchiveTypeStore();
const { archiveType } = useArchiveTypeStore();
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("");
const route = useRoute();
const id = ref(Number(route.params.id));
const Loading = ref(false);
const router = useRouter();
const errors = ref<String | null>();

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowArchiveTypes]);

  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("Add") + " " + t("archiveType");
  } else {
    await getObject();
    namePage.value = t("Update") + " " + t("archiveType");
  }
});

//#region CURD
const storeObject = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("id", archiveType.id.toString());
  formData.append("name", archiveType.name.toString());
  formData.append("description", String(archiveType.description));

  archiveTypeStore
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
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};

function updateObject() {
  errors.value = null;
  const formData = new FormData();
  formData.append("name", archiveType.name.toString());
  formData.append("description", String(archiveType.description));

  archiveTypeStore
    .update(archiveType.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Category has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "updating data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
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
      Swal.fire({
        icon: "error",
        title: "deleting data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
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
          <IFooterCrud
            :isAdd="archiveType.id == 0"
            :onCreate="storeObject"
            :onUpdate="updateObject"
            :onDelete="deleteObject"
          />
        </IForm>
      </IRow>
    </IPageContent>
  </IPage>
</template>
