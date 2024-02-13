<script setup lang="ts">
//#region "imports"
// import { useAccountStore } from "@/stores/accounting/accounts/account";
import Swal from "sweetalert2";
import { onBeforeMount, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import SkeletonLoading from "./AccountTableSkeleton.vue";
import EditButton from "@/components/dropDown/EditButton.vue";
import ShowButton from "@/components/dropDown/ShowButton.vue";
import DeleteButton from "@/components/dropDown/DeleteButton.vue";
import { useI18n } from "@/stores/i18n/useI18n";
import type IUser from "@/types/core/IUser";
import { useUserStore } from "@/stores/userStore";

const { t } = useI18n();

//#endregion
const filter = reactive({
  name: "",
  email: "",
  limit: 50,
});

const limits = reactive([
  { name: "12", val: 12 },
  { name: "24", val: 24 },
  { name: "50", val: 50 },
  { name: t("All"), val: 99999 },
]);
//#region "ROUTER"
const userUpdate = (id: number) => {
  router.push({
    name: "userUpdate",
    params: { id: id },
  });
};
const userShow = (id: number) => {
  router.push({
    name: "userShow",
    params: { id: id },
  });
};
//#endregion

const router = useRouter();
const isLoading = ref(false);
const data = ref<Array<IUser>>([]);
const { get, _delete } = useUserStore();

const Delete = async (id: number) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn btn-danger",
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
        await _delete(id).then(() => {
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

const getData = async () => {
  await get(filter).then((response) => {
    data.value = response.data.data;
  });
  isLoading.value = false;
};
onBeforeMount(() => {
  isLoading.value = true;
}),
  onMounted(async () => {
    await getData();
  });
</script>
<template>
  <div
    class="text-text dark:text-textLight text-left bg-reportCheckLight dark:bg-reportCheck p-10 mb-9 mx-9 rounded-md"
  >
    <div class="filter items-center h-full px-5 rounded-md flex justify-around">
      <!-- User Name -->
      <div class="user items-center px-5 ml-8 mt-5">
        <div class="text-text dark:text-textLight text-center text-lg">
          {{ t("User Name") }}
        </div>
        <div class="flex">
          <input
            v-model="filter.name"
            type="text"
            :placeholder="t('Write User Name')"
            class="rounded-md h-10 focus:outline-none focus:border focus:border-gray-700 bg-lightInput dark:bg-input text-white mb-10 font-bold"
          />
        </div>
      </div>
      <!-- email Number -->
      <div class="email items-center px-5 ml-8 mt-5">
        <div class="text-text dark:text-textLight text-center text-lg">
          {{ t("Email") }}
        </div>
        <div class="flex">
          <input
            v-model="filter.email"
            type="text"
            :placeholder="t('Search By Email')"
            class="rounded-md h-10 focus:outline-none focus:border focus:border-gray-700 bg-lightInput dark:bg-input text-white mb-10 font-bold"
          />
        </div>
      </div>
      <!-- limit -->
      <div
        class="limit py-3 px-4 flex items-center text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
      >
        <p>{{ t("Sort By") }}:</p>
        <select
          aria-label="select"
          v-model="filter.limit"
          class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
        >
          <option
            v-for="limit in limits"
            :key="limit.val"
            :value="limit.val"
            class="text-sm text-indigo-800"
          >
            {{ limit.name }}
          </option>
        </select>
      </div>
      <!-- search button -->
      <div class="search">
        <button
          @click="getData()"
          type="button"
          class="flex items-center px-6 py-2 border-2 border-searchFilterBorderLight dark:border-searchFilterBorder text-text dark:text-textLight font-medium text-xs leading-tight capitalize rounded-full hover:bg-opacity-6 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
        >
          {{ t("Search") }}
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <section class="py-1 bg-blueGray-50">
    <div class="sm:px-6 w-full">
      <div class="mx-6 px-1">
        <SkeletonLoading v-if="isLoading" />
        <div class="mt-7 xs:overflow-auto">
          <div v-if="isLoading == false">
            <table class="w-full whitespace-nowrap">
              <thead
                v-motion
                :initial="{ opacity: 0, y: -15 }"
                :enter="{ opacity: 1, y: 0 }"
                :variants="{ custom: { scale: 2 } }"
                :delay="200"
                class="dark:bg-designTableHead bg-LightTableHead"
              >
                <tr class="text-center">
                  <th
                    scope="col"
                    class="rounded-tl-md rounded-bl-md text-sm font-medium text-text dark:text-textLight px-6 py-1"
                  >
                    {{ t("User Name") }}
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("Email") }}
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("Last LogIn") }}
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("Role") }}
                  </th>
                  <th
                    scope="col"
                    class="rounded-tr-md rounded-br-md text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("Action") }}
                  </th>
                </tr>
              </thead>

              <tbody class="dark:bg-designTableHead bg-LightTableHead">
                <tr
                  tabindex="0"
                  class="focus:outline-none h-16 dark:hover:bg-tableBodyHover bg-designTableTrLight dark:bg-designTableTr hover:bg-designTableTrHover duration-300 border-b border-gray-500 border-t justify-center"
                  v-for="(user, index) in data"
                  :key="index"
                >
                  <td class="pl-5">
                    <div class="flex pl-5 justify-center">
                      <p
                        class="text-base font-medium leading-none text-text dark:text-textLight mr-2"
                      >
                        {{ user.name }}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="flex justify-center">
                      <p
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ user.email }}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="flex justify-center">
                      <p
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ user.last_login }}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5 justify-center">
                    <div class="flex justify-center">
                      <p
                        v-for="role in user.roles.slice(0, 3)"
                        :key="role.id"
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ role.name }},
                      </p>
                    </div>
                  </td>
                  <td class="text-sm text-gray-900 font-light">
                    <div
                      class="card-actions flex justify-center text-text dark:text-textLight"
                    >
                      <div class="flex justify-center relative mt-2">
                        <button
                          class="peer mr-45 px-6 py-2.5 text-text dark:text-textLight font-medium rounded-md text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                          type="button"
                          id="dropdownMenuButton2"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img
                            src="https://img.icons8.com/office/344/menu-2.png"
                            class="w-4 float-left"
                            alt=""
                          />
                        </button>
                        <ul
                          class="dropdown-menu peer-hover:block hover:block -top-28 min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
                          aria-labelledby="dropdownMenuButton2"
                        >
                          <li>
                            <ShowButton @click="userShow(user.id)" />
                          </li>
                          <li>
                            <EditButton @click="userUpdate(user.id)" />
                          </li>
                          <li>
                            <DeleteButton @click="Delete(user.id)" />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
@media (max-width: 390px) {
  .filter {
    display: block;
    /* margin-left: 50px; */
  }
  .limit {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .email {
    margin-top: -25px;
    margin-left: 0px;
  }
  .user {
    margin-top: -10px;
    margin-left: 0px;
  }
  .search {
    margin-left: 35%;
    margin-top: 20px;
  }
  .mt-7 {
    margin-left: 10px;
  }
}
</style>
