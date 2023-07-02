<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoleStore } from "@/stores/roles/role";
import type IRole from "@/types/role/IRole.js";
import Swal from "sweetalert2";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import EditButton from "@/components/dropDown/EditButton.vue";
import ShowButton from "@/components/dropDown/ShowButton.vue";
import DeleteButton from "@/components/dropDown/DeleteButton.vue";
import DuplicateButton from "@/components/dropDown/DuplicateButton.vue";
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);

const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
const router = useRouter();
const data = ref<Array<IRole>>([]);
const isLoading = ref(false);
const { get, _delete } = useRoleStore();
const permissions = () => {
  router.push({
    name: "permissions",
  });
};
const back = () => {
  router.push({
    name: "setting",
  });
};
// const showRole = () => {
//   router.push({
//     name: "showRole",
//   });
// };
const update = (idRole: number) => {
  router.push({
    name: "roleUpdate",
    params: { id: idRole },
  });
};
const show = (idRole: number) => {
  router.push({
    name: "roleShow",
    params: { id: idRole },
  });
};
// const updateRole = (id: number) => {
//   router.push({
//     name: "updateRole",
//     params: { role.id },
//   });
// };
const getData = async () => {
  await get().then((response) => {
    if (response.status == 200) {
      data.value = response.data.data;
    }
  });
  isLoading.value = false;
};

const Delete = async (id: number) => {
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
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await _delete(id).then((response) => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          getData();
        });
      }
    });
};
onMounted(async () => {
  getData();
});
</script>
<template>
  <div class="w-full mb-12">
    <PageTitle> {{ t("Role") }}</PageTitle>

    <div class="max-w-full px-8 ro">
      <div class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
        <div
          v-for="role in data"
          :key="role.id"
          class="bg-cardLight role dark:bg-card flex w-full p-5 rounded-lg border border-gray-700 shadow-md shadow-gray-900 duration-300 hover:border hover:border-gray-600 hover:shadow-lg hover:shadow-gray-800"
        >
          <div class="w-11/12 overflow-hidden">
            <div class="ml-2 text-left">
              <div class="text-2xl text-text dark:text-textLight mb-2">
                {{ t("Role Name") }}: {{ role.name }}
              </div>
              <div
                class="transition-all m-auto justify-center rounded-md p-2 text-text dark:text-textLight"
              >
                {{ t("Permissions Count") }}: {{ role.permissions.length }}
              </div>
              <div class="text-text dark:text-textLight flex">
                <div
                  v-for="item in role.permissions.slice(0, 3)"
                  :key="item.id"
                  class="text-text dark:text-textLight w-36 text-center capitalize m-auto ml-2 rounded-md p-1 bg-blue-500 hover:bg-backHover transition-all"
                >
                  {{ item.name }}
                </div>
                <!-- {{ role.permissions.slice(0, 2) }} -->
              </div>
            </div>
          </div>

          <div class="w-1/12">
            <button
              class="peer p-1 text-text dark:text-textLight font-medium rounded-md text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://img.icons8.com/office/344/menu--v1.png "
                class="w-8 float-left"
                alt=""
              />
            </button>

            <ul
              class="dropdown-menu peer-hover:block hover:block top-40 min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
              aria-labelledby="dropdownMenuButton2"
            >
              <li>
                <EditButton @click="update(role.id)" />
              </li>
              <li>
                <DeleteButton @click="Delete(role.id)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- bottom tool bar -->
  <div
    :class="{
      'w-[95%] bottom': isClose,
      'w-10/12 bottom': !isClose,
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
    <!-- create -->
    <div class="flex">
      <div class="items-center ml-2">
        <button
          @click="permissions()"
          class="flex p-2.5 float-right items-center bg-create rounded-xl hover:rounded-3xl transition-all duration-300 text-white"
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
  </div>
</template>
<style scoped>
@media (max-width: 390px) {
  .bottom {
    width: 103%;
  }
  .backBtn {
    margin-left: 1%;
  }
  .role {
    margin-bottom: 15px;
  }
}
</style>
