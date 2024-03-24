<script setup lang="ts">
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import { t } from "@/utilities/I18nPlugin";
import { useUserStore } from "../userStore";
import loadingFull from "@/components/general/loadingFull.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import type IRole from "@/project/role/IRole";
import type { IUser } from "../IUser";

import { usePermissionStore } from "../permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();

import { useRoleStore } from "@/project/role/roleStore";
const roleStore = useRoleStore();

//#endregion
const check_any_device = ref(false);
const check_active = ref(false);
const router = useRouter();
const route = useRoute();
const id = Number(route.params.id);
const errors = ref<any>(null);
const userStore = useUserStore();
const isLoading = ref(false);
const namePage = ref("Add New User");
const user = ref<IUser>({
  id: 1,
  name: "",
  user_name: "",
  email: "",
  phone: "",
  code: "",
  created: "",
  expire_date: "",
  roles: [],
  permissions: [],
});

const store = () => {
  user.value.any_device = check_any_device.value ? 1 : 0;
  user.value.active = check_active.value ? 1 : 0;
  errors.value = null;
  userStore
    .store(user.value)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: t("User has been add"),
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
      }
    })
    .catch((error: any) => {
      errors.value = userStore.getError(error);
      Swal.fire({
        icon: "error",
        title: t("create new data fails!!!"),
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  errors.value = null;
  if (user.value.password == random) user.value.password = "";
  if (user.value.password_confirmation == random)
    user.value.password_confirmation = "";
  userStore
    .update(user.value, id)
    .then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: t("User Card has been updated"),
        showConfirmButton: false,
        timer: 1500,
      });
      router.go(-1);
    })
    .catch((error) => {
      errors.value = userStore.getError(error);
      Swal.fire({
        icon: "error",
        title: t("create new data fails!!!"),
        text: error.response.data.message,
        footer: "",
      });
    });
}
const random = Math.floor(Math.random() * 10)
  .toString()
  .repeat(8);
const showData = async () => {
  isLoading.value = true;
  await userStore
    .show(user.value.id)
    .then((response) => {
      if (response.status == 200) {
        user.value = response.data.data as IUser;
        check_any_device.value = user.value.any_device == 1 ? true : false;
        check_active.value = user.value.active == 1 ? true : false;
        user.value.password = random;
        user.value.password_confirmation = random;
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
  isLoading.value = false;
};

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowUsers]);

  if (Number.isNaN(id)) {
    namePage.value = "Add User Card";
    user.value.id = 0;
  } else {
    namePage.value = "Update User Card";
    user.value.id = id;
    showData();
  }
  await roleStore.getRole();
});
</script>
<template>
  <IPage :HeaderTitle="t(namePage)">
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col="2" col-lg="2" col-md="1" col-sm="1">
            <ICol>
              <IInput
                :label="t('Name')"
                v-model="user.name"
                name="title"
                type="text"
                :IsRequire="true"
            /></ICol>
            <ICol>
              <IInput
                :label="t('User Name(for login)')"
                v-model="user.user_name"
                name="title"
                type="text"
                :IsRequire="true"
            /></ICol>
            <ICol>
              <IInput
                :label="t('Email')"
                v-model="user.email"
                name="title"
                type="text"
                :IsRequire="true"
            /></ICol>
            <ICol>
              <IInput
                :label="t('Password')"
                v-model="user.password"
                name="title"
                type="password"
                :IsRequire="true"
            /></ICol>
            <ICol>
              <IInput
                :label="t('Rewrite Password')"
                v-model="user.password_confirmation"
                name="title"
                type="password"
                :IsRequire="true"
            /></ICol>
            <ICol>
              <div
                class="mb-1 ml-2 capitalize focus:outline-none focus:border focus:border-gray-700 sm:text-sm text-base text-text dark:text-textLight font-bold"
              >
                {{ t("Role") }}
              </div>
              <vSelect
                multiple
                class="w-full h-10 rounded-sm text-text dark:text-textLight bg-selectLight dark:bg-select"
                v-model="user.roles"
                label="name"
                :options="roleStore.roles"
                :reduce="(role: IRole) => role.id"
              ></vSelect>
              <!-- add role page -->
              <!-- <div
                  :class="{
                    'ltr:right-1/2 rtl:left-1/2': !isClose,
                    'ltr:right-[58%] rtl:left-[58%]': isClose,
                  }"
                  class="m-5 relative bottom-[56.9%] duration-700"
                >
                  <button
                    @click="permissions()"
                    class="flex p-2.5 float-right bg-create rounded-xl hover:rounded-3xl md:mr-5 lg:mr-[-262px] lg:mt-[24px] transition-all duration-300 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div> -->
            </ICol>
            <ICol>
              <div class="moon p-3">
                <div class="row3 flex justify-around">
                  <div class="toggles flex w-1/5 mt-10">
                    <div class="flex ltr:mr-3 rtl:ml-3">
                      <input
                        type="checkbox"
                        v-model="check_any_device"
                        class="toggle toggle-info"
                      />
                      <div
                        class="ltr:ml-3 rtl:mr-3 text-text dark:text-textLight duration-300 font-medium"
                      >
                        {{ t("Any Device") }}
                      </div>
                    </div>
                    <div class="flex justify-center">
                      <input
                        type="checkbox"
                        v-model="check_active"
                        class="toggle toggle-info"
                      />
                      <div
                        class="ltr:ml-3 rtl:mr-3 text-text dark:text-textLight duration-300 font-medium"
                      >
                        {{ t("Active") }}
                      </div>
                    </div>
                  </div>
                </div>
              </div></ICol
            >
          </IRow>
        </IForm>
      </IRow>
    </IPageContent>
    <template #Footer>
      <IFooterCrud
        :isAdd="user.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :showDelete="false"
      />
    </template>

    <loadingFull v-if="isLoading == true" />
  </IPage>
</template>
@/utilities/I18nPlugin@/utilities/EnumSystem