<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import type { IUser } from "@/types/core/IUser";
import { Form } from "vee-validate";
import * as Yup from "yup";
import { useRoleStore } from "@/stores/roles/roleStore";
import type IRole from "@/types/role/IRole";
import { t } from "@/utils/I18nPlugin";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import InputText from "@/components/inputs/InputText.vue";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import IInput from "@/components/inputs/IInput.vue";
import IVSelect from "@/components/inputs/IVSelect.vue";
const user = useAuthStore();
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);

const roleStore = useRoleStore();
const permissions = () => {
  router.push({
    name: "permissions",
  });
};
const back = () => {
  router.back();
};

//#region "validations"

//#endregion
const check_any_device = ref(false);
const check_active = ref(false);
const UserPassword = ref({ password: "", rePassword: "" });
const router = useRouter();
const route = useRoute();
const id = ref(0);
const errors = ref<any>(null);
const userStore = useUserStore();
const authStore = useAuthStore();
const isLoading = ref(false);
const userInfo = ref<IUser>({
  id: 1,
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  roles: [],
  permissions: [],
  active: 1,
  user_name: "",
  phone: "",
  code: "",
  created: "",
  expire_date: "",
});
const random = Math.floor(Math.random() * 10)
  .toString()
  .repeat(8);
const update = () => {
  if (
    UserPassword.value.password == "" ||
    UserPassword.value.rePassword == "" ||
    UserPassword.value.password != UserPassword.value.rePassword
  )
    return;
  userStore
    .updateMyPasspord(UserPassword.value)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: t("OperationSuccessfully"),
          showConfirmButton: false,
          timer: 1500,
        });
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
onMounted(async () => {
  isLoading.value = true;
  //router.push({ name: "Dashboard" });
  if (authStore.user) {
    userInfo.value = authStore.user as IUser;
  } else {
    router.push({ name: "Dashboard" });
  }
  check_active.value = userInfo.value.active?.toString() == "1";
  check_any_device.value = userInfo.value.any_device?.toString() == "1";
  isLoading.value = false;
});
</script>
<template>
  <IPage :HeaderTitle="t('Profile')">
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col-lg="3" col-md="2" col-sm="1">
            <ICol span="3" span-md="2" span-sm="1">
              <IInput
                :label="t('Name')"
                name="Name"
                v-model="userInfo.name"
                type="text"
                :disabled="true"
            /></ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IInput
                :label="t('Email')"
                name="email"
                v-model="userInfo.email"
                type="text"
                :disabled="true"
            /></ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IVSelect
                :label="t('Role')"
                v-model="userInfo.roles"
                name="roles"
                :options="roleStore.roles"
                :IsRequire="true"
                :multiple="true"
                :disabled="true"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="4">
              <ICheckbox v-model="check_any_device" :checked="check_any_device">
                {{ t("AnyDevice") }} :
                {{ check_any_device ? " مفعل " : " غير مفعل " }}</ICheckbox
              >
            </ICol>
            <ICol span="1" span-md="2" span-sm="4">
              <ICheckbox
                v-model="check_active"
                :checked="check_active"
                :disabled="true"
              >
                {{ t("Active") }} :
                {{ check_active ? " مفعل " : " غير مفعل " }}</ICheckbox
              >
            </ICol>
          </IRow>
          <IRow :col="2" :col-lg="2">
            <ICol :span-lg="2"
              ><IInput
                :label="t('Password')"
                name="Name"
                v-model="UserPassword.password"
                type="password"
            /></ICol>
            <ICol :span-lg="2"
              ><IInput
                :label="t('Rewrite Password')"
                name="Name"
                v-model="UserPassword.rePassword"
                type="password"
            /></ICol>
          </IRow>
        </IForm>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :isAdd="userInfo.id == 0"
        :show-add="false"
        :show-delete="false"
        :on-update="update"
      />
    </template>
  </IPage>
</template>
