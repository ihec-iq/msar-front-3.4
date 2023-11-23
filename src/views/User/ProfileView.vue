<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import type IUser from "@/types/core/IUser";
import { Form } from "vee-validate";
import * as Yup from "yup";
import { useRoleStore } from "@/stores/roles/roleStore";
import type IRole from "@/types/role/IRole";
import { useI18n } from "@/stores/i18n/useI18n";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import InputText from "@/components/inputs/InputText.vue";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/auth";
const user = useAuthStore();
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
const { t } = useI18n();

const roleStore = useRoleStore();
const permissions = () => {
  router.push({
    name: "permissions",
  });
};
const back = () => {
  router.push({
    name: "userIndex",
  });
};

//#region "validations"

//#endregion
const check_any_device = ref(false);
const check_active = ref(false);
const router = useRouter();
const route = useRoute();
const id = ref(0);
const errors = ref<any>(null);
const userStore = useUserStore();
const isLoading = ref(false);
const namePage = ref("Add New User");
const userInfo = reactive<IUser>({
  id: 1,
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  any_device: 1,
  roles: [],
  permissions: [],
  active: 1,
  last_login: "",
});
const random = Math.floor(Math.random() * 10)
  .toString()
  .repeat(8);

onMounted(async () => {
  isLoading.value = true;
  id.value = Number(user.user?.id);
  if (Number.isNaN(id.value) || id.value == 0) {
    router.push({ name: "Dashboard" });
  } else {
    namePage.value = "Profile";
    userInfo.id = id.value;
    userStore.show(userInfo.id).then((response) => {
      if (response.status == 200) {
        userInfo.name = response.data.data.name;
        userInfo.email = response.data.data.email;
        userInfo.roles = response.data.data.roles;
        check_any_device.value = userInfo.any_device == 1 ? true : false;
        check_active.value = userInfo.active == 1 ? true : false;
      }
    });
  }
  isLoading.value = false;
  await roleStore.getRole();
});
</script>
<template>
  <div class="sun">
    <Form
      :initial-values="user"
      @submit="onSubmit"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
    >
      <div>
        <loadingFull v-if="isLoading == true" />

        <PageTitle> {{ t(namePage) }} </PageTitle>

        <div class="moon">
          <!-- Row.1 -->
          <div class="row w-full flex justify-around my-10">
            <div class="w-1/5">
              <InputText
                v-model="userInfo.name"
                type="text"
                name="name"
                :label="t('User Name')"
              />
            </div>
            <div class="w-1/5">
              <InputText
                v-model="userInfo.password"
                type="password"
                name="password"
                :label="t('Password')"
              />
            </div>
          </div>

          <!-- Row.2 -->
          <div class="row2 w-full mb-10 flex justify-around">
            <div class="w-1/5">
              <InputText
                v-model="userInfo.email"
                name="email"
                :label="t('Email')"
                type="text"
              />
            </div>
            <div class="w-1/5">
              <InputText
                v-model="userInfo.password_confirmation"
                name="password_confirmation"
                :label="t('Rewrite Password')"
                type="password"
              />
            </div>
          </div>
          <!-- row 3 -->
          <div class="row3 flex justify-around">
            <div class="w-1/5">
              <div
                class="mb-1 ml-2 capitalize focus:outline-none focus:border focus:border-gray-700 sm:text-sm text-base text-text dark:text-textLight font-bold"
              >
                {{ t("Role") }}
              </div>
              <vSelect
                multiple
                class="w-full h-10 rounded-sm text-text dark:text-textLight bg-selectLight dark:bg-select"
                v-model="userInfo.roles"
                label="name"
                :options="roleStore.roles"
                :reduce="(role: IRole) => role.id"
              ></vSelect>
              <!-- add role page -->
              <div
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
              </div>
            </div>
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
        </div>
      </div>
      <!-- <div class="text-white">{{ t("error.user_failed") }}</div> -->
      <!-- error  -->
      <div class="flex justify-center mb-12" v-if="errors != null">
        <div
          class="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
          role="alert"
        >
          {{ t(errors) }}
        </div>
      </div>

      <!-- bottom tool bar -->
      <div
        :class="{
          'w-[95%] bottom': isClose,
          'w-10/12 bottom': !isClose,
        }"
        class="dark:bg-bottomTool duration-700 bg-sideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0"
      >
        <!-- create -->
        <div class="flex">
          <div class="items-center ml-2">
            <button
              type="submit"
              v-if="userInfo.id == 0"
              class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
            >
              {{ t("Create") }}
            </button>
            <button
              v-if="userInfo.id != 0"
              type="submit"
              class="bg-update hover:bg-updateHover duration-500 h-12 w-32 rounded-lg text-white"
            >
              {{ t("Update") }}
            </button>
          </div>
        </div>
      </div>
    </Form>

    <!-- backBtn -->
    <div class="backBtn z-10 fixed bottom-2 ml-3">
      <button
        @click="back()"
        class="bg-back hover:bg-backHover h-10 duration-500 w-32 p-2 rounded-md text-white"
      >
        {{ t("Back") }}
      </button>
    </div>
  </div>
</template>
<style scoped>
@media (max-width: 390px) {
  .row {
    display: table;
    margin-left: 18%;
  }
  .row2 {
    display: table;
    margin-left: 30%;
  }
  .row3 {
    display: table;
    margin-left: 30%;
  }
  .row .w-1\/5 {
    width: 65%;
    margin-left: 0;
    margin-right: 0;
  }
  .row2 .w-1\/5 {
    width: 65%;
    margin-left: -45px;
    margin-right: 0;
  }
  .row3 .w-1\/5 {
    width: 300px;
    margin-left: -45px;
    margin-right: 0;
  }
  .toggles {
    margin-left: 85%;
  }
  .bottom {
    width: 103%;
  }
  .backBtn {
    margin-left: 3%;
  }
}
</style>
