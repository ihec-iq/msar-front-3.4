<script setup lang="ts">
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import type { IUser } from "../IUser";
import { useRoleStore } from "@/project/role/roleStore";
import { t } from "@/utilities/I18nPlugin";
import { useUserStore } from "../userStore";
import { useAuthStore } from "@/stores/authStore";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import IInput from "@/components/inputs/IInput.vue";
import IVSelect from "@/components/inputs/IVSelect.vue";
import IFlex from "@/components/ihec/IFlex.vue";
import IBasis from "@/components/ihec/IBasis.vue";
import ISection from "@/components/ihec/ISection.vue";
import IPage from "@/components/ihec/IPage.vue";
const user = useAuthStore();

const roleStore = useRoleStore();

const check_any_device = ref(false);
const check_active = ref(false);
const UserPassword = ref({ password: "", rePassword: "" });
const router = useRouter();
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
          <IFlex>
            <IBasis base="1/2">
              <IInput
                :label="t('Name')"
                name="Name"
                v-model="userInfo.name"
                type="text"
                :disabled="true"
              />
            </IBasis>
            <IBasis base="1/2">
              <IInput
                :label="t('Email')"
                name="email"
                v-model="userInfo.email"
                type="text"
                :disabled="true"
              />
            </IBasis>
          </IFlex>
          <IFlex>
            <IBasis base="1/3">
              <IVSelect
                :label="t('Role')"
                v-model="userInfo.roles"
                name="roles"
                :options="roleStore.roles"
                :IsRequire="true"
                :multiple="true"
                :disabled="true"
              />
            </IBasis>
            <IBasis base="1/3">
              <ICheckbox v-model="check_any_device" :checked="check_any_device">
                {{ t("AnyDevice") }} :
                {{ check_any_device ? " مفعل " : " غير مفعل " }}</ICheckbox
              >
            </IBasis>

            <IBasis base="1/3">
              <ICheckbox
                v-model="check_active"
                :checked="check_active"
                :disabled="true"
              >
                {{ t("Active") }} :
                {{ check_active ? " مفعل " : " غير مفعل " }}</ICheckbox
              ></IBasis
            >
          </IFlex>
          <ISection :title="t('Change Password')"></ISection>
          <IFlex>
            <IBasis base="1/3">
              <IInput
                :label="t('Password')"
                name="Name"
                v-model="UserPassword.password"
                type="password"
            /></IBasis>
            <IBasis base="1/3">
              <IInput
                :label="t('Rewrite Password')"
                name="Name"
                v-model="UserPassword.rePassword"
                type="password"
            /></IBasis>
          </IFlex>
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
@/views/role/role/roles/roleStore
@/utilities/I18nPlugin