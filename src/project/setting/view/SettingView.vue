<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
 import Swal from "sweetalert2";
 import { usePermissionsStore } from "@/project/core/permissionStore";
 import { useRoute, useRouter } from "vue-router";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import { t } from "@/utilities/I18nPlugin";
import IInput from "@/components/inputs/IInput.vue";
import type IPermission from "@/project/role/IPermission";
import type IRole from "@/project/role/IRole";
import { useRoleStore } from "@/project/role/roleStore";
const rtlStore = useRtlStore();
 
const permissionsStore = usePermissionsStore();
const namePage = ref("Add Role");
const router = useRouter();
const back = () => {
  router.go(-1);
};
const checkedPermission = ref<Array<IPermission>>([]);
const CheckAll = ref(false);
const toggleCheck = () => {
  if (CheckAll.value) {
    checkedPermission.value = [];
    permissionsStore.permissions.forEach((element: IPermission) => {
      checkedPermission.value.push(element);
    });
    //console.log(checkedPermission.value);
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

const Save = () => {
  // checkedPermission.value = values.checkedPermission;
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
  role.checkedPermission = checkedPermission.value;
  roleStore
    .update(role, role.id)
    .then((response) => {
      // console.log(response.data.data);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your group has been Update",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.go(-1);
        });
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
});
</script>

<template>
  <IPage :HeaderTitle="t(namePage)">
    <IPageContent>
      <IRow>
        <ICol>
          <IInput
            v-model="role.name"
            :label="t('Role Name')"
            placeholder="Role Name"
          ></IInput>
        </ICol>
      </IRow>
      <IRow>
        <span class="text-start mb-4">{{ t("Permissions") }}</span>
        <ICol>
          <IInput
            v-model="fastSearch"
            @input="makeFastSearch()"
            :placeholder="t('Search For Permission')"
          ></IInput>
        </ICol>
      </IRow>
      <IRow>
        <div class="flex">
          <input
            type="checkbox"
            v-model="CheckAll"
            @change="toggleCheck"
            class="checkbox checkbox-md ml-4 checkbox-success"
          />
          <label class="text-gray-300 mb-2 ml-1 mr-4">
            {{ CheckAll ? t("Un Check") : t("Check All") }}
          </label>
        </div>
        <div class="mb-10 flex w-full flex-wrap p-4">
          <!-- chip -->
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
      </IRow>
      <IRow> </IRow>
    </IPageContent>
    <template #Footer>
      <IFooterCrud
        :showDelete="false"
        :isAdd="role.id == 0"
        :onCreate="store"
        :onUpdate="update"
      />
    </template>
  </IPage>
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
@/utilities/I18nPlugin
