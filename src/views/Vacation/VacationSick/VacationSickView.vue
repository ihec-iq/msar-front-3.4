<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permissionStore";

import { useI18n } from "@/stores/i18n/useI18n";
import type { IVacationSick } from "@/types/vacation/IVacationSick";
import { useVacationSickStore } from "@/stores/vacations/vacationSickStore";
import { useVacationStore } from "@/stores/vacations/vacationStore";
import type { IVacation } from "@/types/vacation/IVacation";

const { t } = useI18n();

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const itemStore = useVacationSickStore();
const { vacationSick } = storeToRefs(useVacationSickStore());
const { vacations } = storeToRefs(useVacationStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("dayFrom", vacationSick.value.dayFrom);
  formData.append("dayTo", vacationSick.value.dayTo);
  formData.append("record", vacationSick.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationSick.value.Vacation));
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
  formData.append("dayFrom", vacationSick.value.dayFrom);
  formData.append("dayTo", vacationSick.value.dayTo);
  formData.append("record", vacationSick.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationSick.value.Vacation));

  itemStore
    .update(vacationSick.value.id, formData)
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
        await itemStore._delete(vacationSick.value.id).then(() => {
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
  await useVacationSickStore()
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        vacationSick.value.dayFrom = response.data.data.dayFrom;
        vacationSick.value.dayTo = response.data.data.dayTo;
        vacationSick.value.record = response.data.data.record;
        vacationSick.value.Vacation = response.data.data.Vacation;

        vacationSick.value = response.data.data as IVacationSick;
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
    name: "vacationSickIndex",
  });
};
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray(["show vacations sick"]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("VacationSickAdd");
    vacationSick.value.id = 0;
  } else {
    await showData();
    vacationSick.value.id = id.value;
    namePage.value = t("VacationSickUpdate");
  }
  await useVacationStore().get_vacations();
});
const ChangeDate = () => {
  if (vacationSick.value.dayFrom >= vacationSick.value.dayTo) {
    vacationSick.value.record = 1;
    ChangeDateRecord();
    return;
  }
  const oneDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (new Date(vacationSick.value.dayTo).valueOf() -
      new Date(vacationSick.value.dayFrom).valueOf()) /
      oneDay
  );
  vacationSick.value.record = days;
};
const ChangeDateRecord = () => {
  let d = new Date(vacationSick.value.dayFrom);
  d.setDate(d.getDate() + vacationSick.value.record);
  vacationSick.value.dayTo = d.toISOString().split("T")[0];
};
</script>
<template>
  <IPage>
    <template #header>
      <IPageHeader :title="t(namePage)"> </IPageHeader>
    </template>
    <template #content>
      <IRow>
        <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
          <div class="w-11/12 mr-2">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("DateFrom") }}
            </div>
            <input
              v-model="vacationSick.dayFrom"
              type="date"
              @change="ChangeDate()"
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
            />
          </div>
          <div class="w-11/12 mr-2">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("DateTo") }}
            </div>
            <input
              v-model="vacationSick.dayTo"
              type="date"
              @change="ChangeDate()"
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
            />
          </div>
          <div class="w-11/12 mr-2">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("RecordSick") }}
            </div>
            <input
              v-model="vacationSick.record"
              type="number"
              @input="ChangeDateRecord()"
              min="1"
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
            />
          </div>
          <div class="w-11/12 mr-2">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("OutputVoucherEmployeeRequest") }}
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
          </div>
        </div>
      </IRow>
    </template>
    <template #footer>
      <div
        class="max-w-screen-xl flex flex-wrap flex-row-reverse justify-between p-4"
      >
        <!-- end -->
        <IButton
          v-if="vacationSick.id == 0"
          :text="t('Create')"
          :onClick="store"
        />
        <IButton v-else :text="t('Update')" :onClick="update" />
        <!-- start -->
        <!-- <IButton :text="t('Back')" :onClick="back" /> -->
        <IButton
          v-if="vacationSick.id != 0"
          color="red"
          type="outlined"
          :text="t('Delete')"
          :onClick="Delete"
        />
      </div>
    </template>
  </IPage>
</template>
<style scoped>
.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background: rgba(255, 255, 255, 0.333);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}
.drop-area[data-active="true"] {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.8);
}
label {
  font-size: 36px;
  cursor: pointer;
  display: block;
}
label span {
  display: block;
}
label input[type="file"]:not(:focus-visible) {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
label .smaller {
  font-size: 16px;
}
.image-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  padding: 0;
  margin-bottom: 35px;
}
.preview-card {
  display: flex;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin: 5px;
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
</style>
@/stores/vacations/vacationStore@/stores/permissionStore
