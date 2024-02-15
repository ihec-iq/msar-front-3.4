<script setup lang="ts">
//region"Basic Import"
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/stores/permission";
import { t } from "@/utils/I18nPlugin";
import IPage from "@/components/ihec/IPage.vue";
import IPageHeader from "@/components/ihec/IPageHeader.vue";
import IButton from "@/components/ihec/IButton.vue";
import { EnumPermission } from "@/utils/EnumSystem";

//#region Vars
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const Loading = ref(false);
const router = useRouter();
const errors = ref<String | null>();
const { checkPermissionAccessArray } = usePermissionStore();
//#endregion

//#endregion

//#region Stores
// import { useCustomStoreStore } from "@/stores/CustomStore";
// const customStoreStore = useCustomStoreStore();
// const { custom } = storeToRefs(customStoreStore());

//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  const formData = new FormData();
  // formData.append("id", custom.value.id.toString());
  // formData.append("title", custom.value.title.toString());
  // //console.log([...formData]);
  // CustomStore.store(formData)
  //   .then((response) => {
  //     if (response.status === 200) {
  //       Swal.fire({
  //         position: "top-end",
  //         icon: "success",
  //         title: "Your custom has been saved",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       filesDataInput.value = [];
  //       router.go(-1);
  //     }
  //   })
  //   .catch((error) => {
  //     //errors.value = Object.values(error.response.data.errors).flat().join();
  //     errors.value = customStoreStore.getError(error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "create new data fails!!!",
  //       text: error.response.data.message,
  //       footer: "",
  //     });
  //   });
};
function update() {
  errors.value = null;
  const formData = new FormData();
  // formData.append("id", custom.value.id.toString());
  // formData.append("title", custom.value.title.toString());

  // customStoreStore
  //   .update(custom.value.id, formData)
  //   .then((response) => {
  //     if (response.status === 200) {
  //       Swal.fire({
  //         position: "top-end",
  //         icon: "success",
  //         title: "Your custom has been updated",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       filesDataInput.value = [];
  //       showData();
  //     }
  //   })
  //   .catch((error) => {
  //     //errors.value = Object.values(error.response.data.errors).flat().join();
  //     errors.value = customStoreStore.getError(error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "updating data fails!!!",
  //       text: error.response.data.message,
  //       footer: "",
  //     });
  //   });
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
        // await customStoreStore._delete(custom.value.id).then(() => {
        //   swalWithBootstrapButtons.fire(
        //     t("Deleted!"),
        //     t("Deleted successfully ."),
        //     "success"
        //   );
        //   router.go(-1);
        // });
      }
    });
};
const showData = async () => {
  Loading.value = true;
  // await customStoreStore
  //   .show(id.value)
  //   .then((response) => {
  //     if (response.status == 200) {
  //       custom.value.id = response.data.data.id;
  //       custom.value.title = response.data.data.title;
  //     }
  //   })
  //   .catch((errors) => {
  //     console.log(errors);
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "warning",
  //       title: "Your custom file not exist !!!",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     }).then(() => {
  //       router.go(-1);
  //     });
  //   });
  Loading.value = false;
};
const updateList = () => {
  showData();
};
//#endregion
const back = () => {
  router.push({
    name: "customIndex",
  });
};

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.Addcustom]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("CustomAdd");
    //custom.value.id = 0;
  } else {
    await showData();
    //custom.value.id = id.value;
    namePage.value = t("CustomUpdate");
  }
  // load all dependances
  //await usecustomStoreStore().getcustomTypes();
});
</script>
<template>
  <IPage>
    <template v-slot:header>
      <IPageHeader :title="namePage" />
    </template>
    <template v-slot:content
      ><div class="w-full">
        <div class="w-full p-6 grid lg:grid-cols-3 xs:grid-cols-2">
          <div class="w-12/12 col-span-4">
            <div class="_inputLabel">{{ t("Title") }}</div>
            <input v-model="custom.title" type="text" class="_input" />
          </div>
          <div class="w-12/12 mx-2">
            <div class="_inputLabel">
              {{ t("NumberBook") }}
            </div>
            <input v-model="custom.number" type="text" class="_input" />
          </div>
          <div class="w-12/12 mx-2">
            <div class="_inputLabel">
              {{ t("Date") }}
            </div>
            <input v-model="custom.issueDate" type="date" class="_input" />
          </div>
          <div class="w-12/12 mx-2">
            <div class="_inputLabel">
              {{ t("Type") }}
            </div>
            <select v-model="custom.customTypeId" class="_input">
              <option
                v-for="customType in customTypes"
                :key="customType.id"
                :value="customType.id"
              >
                {{ customType.name }}
              </option>
            </select>
          </div>
          <div class="w-full col-span-4">
            <div class="_inputLabel">{{ t("Description") }}</div>
            <input v-model="custom.description" type="text" class="_input" />
          </div>
          <div class="w-12/12 my-5">
            <div class="_inputLabel">
              {{ t("TypeBook") }} : {{ isIn ? "داخل" : "خارج" }}
            </div>
            <input
              type="checkbox"
              v-model="isIn"
              class="toggle toggle-secondary"
              checked
            />
          </div>
        </div>

        <div class="flex end w-full flex-wrap items-center justify-between p-5">
          <div class="flex w-full flex-wrap items-center justify-between px-3">
            <IButton
              v-if="custom.id != 0"
              color="red"
              type="outlined"
              :text="t('Delete')"
              :onClick="Delete"
            />
            <IButton v-if="custom.id == 0" :text="t('Create')" :onClick="store" />
            <IButton v-else :text="t('Update')" :onClick="update" />
          </div>
        </div>
      </div>
    </template>
  </IPage>
</template>
<style scoped>
label {
  font-size: 36px;
  cursor: pointer;
  display: block;
}
label span {
  display: block;
}

label .smaller {
  font-size: 16px;
}

.upload-button {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 50px;
  padding: 0.75rem 3rem;
  margin: 1rem auto;
  font-size: 1.25rem;
  font-weight: bold;
  background: #369;
  color: #fff;
  text-transform: uppercase;
}
button {
  cursor: pointer;
}
html.dark {
  --w-e-textarea-bg-color: #333;
  --w-e-textarea-color: #fff;
  /* ...others... */
}
</style>
