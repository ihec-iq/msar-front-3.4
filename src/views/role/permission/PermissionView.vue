<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import { useRoleStore } from "@/stores/roles/roleStore";
import Swal from "sweetalert2";
import type IRole from "@/types/role/IRole.js";
import { usePermissionsStore } from "@/stores/roles/permissionStore";
import type IPermission from "@/types/role/IPermission";
import { useRoute, useRouter } from "vue-router";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useI18n } from "@/stores/i18n/useI18n";

const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
const { t } = useI18n();

const permissionsStore = usePermissionsStore();
const namePage = ref("Add Role");
const router = useRouter();
const back = () => {
  router.go(-1);
};
const checkedPermission = ref<Array<string>>([]);
const CheckAll = ref(false);
const toggleCheck = () => {
  if (CheckAll.value) {
    checkedPermission.value = [];
    permissionsStore.permissions.forEach((element: IPermission) => {
      checkedPermission.value.push(element.name);
    });
    console.log(checkedPermission.value);
  } else {
    checkedPermission.value = [];
  }
};
//#endregion
const fastSearch = ref("");
const filterByIDName = (item: IPermission) => {
  if (item.name.includes(fastSearch.value)) {
    return true;
  }
  return false;
};
const makeFastSearch = () => {
  if (fastSearch.value == "")
    permissionsStore.permissions = permissionsStore.permissionsBase;
  else {
    permissionsStore.permissions =
      permissionsStore.permissionsBase.filter(filterByIDName);
  }
};
const role = reactive<IRole>({
  id: 0,
  name: "",
  checkedPermission: [],
  permissions: [],
});
function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn?.classList.add("invalid");
  setTimeout(() => {
    submitBtn?.classList.remove("invalid");
  }, 1000);
}
const schema = Yup.object().shape({
  name: Yup.string().min(3).max(50).required(),
});

const onSubmit = (values: any) => {
  // checkedPermission.value = values.checkedPermission;
  role.name = values.name;
  if (role.id == 0) store();
  else update();
  // else update();
};
const errors = ref<String | null>();
const roleStore = useRoleStore();
const store = () => {
  role.checkedPermission = checkedPermission.value;
  errors.value = null;
  roleStore
    .store(role)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Role has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
        // role.id = response.data.data.id;
      }
    })
    .catch((error) => {
      errors.value = roleStore.getError(error);
      Swal.fire({
        icon: "error",
        title: t("create new data fails!!!"),
        text: error.response.data.message,
        footer: "",
      });
    });
};
const update = () => {
  errors.value = null;
  //role.permissions = checkedPermission.value;
  role.checkedPermission = checkedPermission.value;
  roleStore
    .update(role, role.id)
    .then((response) => {
      // console.log(response.data.data);
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your group has been Update",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-2);
      }
    })
    .catch((error) => {
      errors.value = roleStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "update data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
const route = useRoute();
const id = Number(route.params.id);
onMounted(() => {
  if (Number.isNaN(id)) {
    namePage.value = "Add Role";
  } else {
    role.id = id;
    namePage.value = "Update Role";
    roleStore.show(role.id).then((response) => {
      if (response.status == 200) {
        role.id = response.data.data.id;
        role.name = response.data.data.name;
        role.permissions = response.data.data.permissions;
        //checkedPermission.value = response.data.data.permissions;
        response.data.data.permissions.forEach((element: any) => {
          checkedPermission.value.push(element.name);
        });
      }
    });
  }
  permissionsStore.permissions = permissionsStore.permissionsBase;
});
</script>

<template>
  <Form
    :initial-values="role"
    @submit="onSubmit"
    :validation-schema="schema"
    @invalid-submit="onInvalidSubmit"
  >
    <div class="w-full">
      <PageTitle> {{ t(namePage) }}</PageTitle>
      <div class="px-4">
        <div
          class="mb-1 ml-2 capitalize focus:outline-none focus:border focus:border-gray-700 sm:text-sm text-base text-text dark:text-textLight font-bold"
        ></div>
        <div class="flex">
          <div class="w-1/3">
            <InputText
              v-model="role.name"
              type="text"
              name="name"
              :label="t('Role Name')"
            />
          </div>

          <!--  -->
          <div class="w-1/3 flex justify-end">
            <button
              v-if="role.id == 0"
              type="submit"
              class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
            >
              {{ t("Create") }}
            </button>
            <button
              v-if="role.id > 0"
              type="submit"
              class="bg-update hover:bg-updateHover duration-500 h-10 w-32 rounded-lg text-white"
            >
              {{ t("Update") }}
            </button>
            <!--  -->
          </div>
        </div>
      </div>

      <div class="flex mt-2">
        <input
          type="checkbox"
          v-model="CheckAll"
          @change="toggleCheck"
          class="checkbox checkbox-md ml-4 checkbox-success"
        />
        <label class="dark:text-gray-300 text-gray-800 mb-2 ml-1 mr-4">
          {{ CheckAll ? t("Un Check") : t("Check All") }}
        </label>
      </div>
      <div>
        <h2
          class="text-text dark:text-textLight font-semibold text-xl ltr:text-left rtl:text-right ltr:pl-8 rtl:pr-8"
        >
          {{ t("Permissions") }}:
        </h2>
      </div>
      <div
        class="grid grid-cols-12 gap-4 text-text dark:text-textLight font-black p-2 leading-8 ltr:text-left rtl:text-right px-4"
      >
        <span
          v-for="permission in checkedPermission"
          :key="permission"
          class="relative z-10 w-28 text-center p-2 m-2 text-xs rounded-md leading-none text-white whitespace-no-wrap bg-green-600 shadow-lg"
        >
          {{ permission }}
        </span>
      </div>
      <div class="flex justify-between">
        <div
          class="mb-4 text-center text-text dark:text-textLight bg-namePage dark:bg-title w-64 p-2 ml-4 rounded-lg text-lg"
        >
          {{ t("Set Permissions") }}
        </div>
        <label for="table-search" class="sr-only">{{ t("Search F") }}</label>
        <div class="relative ltr:pr-4 rtl:pl-4">
          <div
            class="flex absolute bottom-8 ltr:left-0 rtl:right-0 items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            v-model="fastSearch"
            @input="makeFastSearch()"
            class="block p-2 ltr:pl-10 rtl:pr-8 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('Search For Permission')"
          />
        </div>
      </div>
      <div class="mb-10 flex w-full flex-wrap p-4">
        <div
          class="flex mb-4 bg-[#35587087] p-2 mr-2 rounded-md text-gray-200"
          v-for="permission in permissionsStore.permissions"
          :key="permission.id"
        >
          <input
            type="checkbox"
            :value="permission.name"
            v-model="checkedPermission"
            class="checkbox checkbox-md checkbox-success"
          />
          <label class="text-gray-200 ml-1 mr-4 capitalize">
            {{ permission.name }}
          </label>
          <div class="relative flex flex-col items-center group">
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
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>

            <div
              class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex"
            >
              <span
                class="relative z-10 w-28 text-center p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                >{{ permission.name }}</span
              >
              <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Form>
  <div
    :class="{
      'w-[95%] bottom': isClose,
      'w-10/12 bottom ': !isClose,
    }"
    class="dark:bg-bottomTool duration-700 bg-sideNavLight p-2 rounded-lg flex items-center justify-between fixed bottom-0"
  >
    <!-- back button -->
    <div class="backBtn">
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
  .bottom {
    width: 121%;
  }
  .backBtn {
    margin-left: 1%;
  }
  .roles {
    display: grid;
    margin-left: 128px;
    width: 250px;
  }
  .fastSearch {
    display: table;
    margin-left: 23%;
    margin-top: 17px;
  }
  .checkAll {
    margin-left: 100px;
    margin-top: 25px;
  }
  .addRole {
    margin-left: 85px;
  }
}
.disable {
  visibility: hidden;
}

.enable {
  visibility: visible;
}
</style>
