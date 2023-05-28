<script setup lang="ts">
import { useCreatorStore } from "@/stores/setting/creator";
import type ICreator from "@/types/setting/ICreator";
import { ref, onMounted, onBeforeMount } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { storeToRefs } from "pinia";
const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
const router = useRouter();
const isLoading = ref(false);
const data = ref<Array<ICreator>>([]);
const { get } = useCreatorStore();
const { creator } = storeToRefs(useCreatorStore());
const getData = async () => {
  await get().then((response) => {
    if (response.status == 200) data.value = response.data.data;
  });
  isLoading.value = false;
};
const update = (data: any) => {
  creator.value.id = data.id;
  creator.value.name = data.name;
  creator.value.company = data.company;
  creator.value.job = data.address;
  creator.value.requests_count = data.requests_count;
  creator.value.rank = data.rank;
  router.push({
    name: "creatorUpdate",
    params: { id: data.id },
  });
};
const show = (data: any) => {
  creator.value.id = data.id;
  creator.value.name = data.name;
  creator.value.company = data.company;
  creator.value.job = data.address;
  creator.value.requests_count = data.requests_count;
  creator.value.rank = data.rank;
  router.push({
    name: "creatorShow",
    params: { id: data.id },
  });
};
onBeforeMount(() => {
  isLoading.value = true;
}),
  onMounted(async () => {
    getData();
  });
</script>
<template>
  <!-- table -->
  <section class="py-1 bg-blueGray-50">
    <div class="sm:px-6 w-full">
      <div class="mx-6 px-1">
        <SkeletonLoading v-if="isLoading" />
        <div class="mt-7 lg:overflow-visible xs:overflow-auto">
          <div v-if="isLoading == false">
            <table
              v-motion
              :initial="{ opacity: 0, y: -15 }"
              :enter="{ opacity: 1, y: 0 }"
              :variants="{ custom: { scale: 2 } }"
              :delay="200"
              class="w-full whitespace-nowrap"
              v-if="data.length > 0"
            >
              <thead class="dark:bg-designTableHead bg-LightTableHead">
                <tr class="text-center">
                  <th
                    scope="col"
                    class="rounded-tl-md rounded-bl-md text-sm font-medium text-text dark:text-textLight px-6 py-1"
                  >
                    {{ t("Account Name") }}
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("company") }}
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("job") }}
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("requests_count") }}
                  </th>
                  <th
                    scope="col"
                    class="rounded-tr-md rounded-br-md text-sm font-medium text-text dark:text-textLight px-6 py-4"
                  >
                    {{ t("rank") }}
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
                  v-for="(creator, index) in data"
                  :key="index"
                >
                  <td class="justify-center text-center">
                    <div class="flex items-center pl-5">
                      <p
                        class="text-base font-medium leading-none text-text dark:text-textLight mr-2"
                      >
                        {{ creator.name }}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6.66669 9.33342C6.88394 9.55515 7.14325 9.73131 7.42944 9.85156C7.71562 9.97182 8.02293 10.0338 8.33335 10.0338C8.64378 10.0338 8.95108 9.97182 9.23727 9.85156C9.52345 9.73131 9.78277 9.55515 10 9.33342L12.6667 6.66676C13.1087 6.22473 13.357 5.62521 13.357 5.00009C13.357 4.37497 13.1087 3.77545 12.6667 3.33342C12.2247 2.89139 11.6251 2.64307 11 2.64307C10.3749 2.64307 9.77538 2.89139 9.33335 3.33342L9.00002 3.66676"
                          stroke="#3B82F6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M9.33336 6.66665C9.11611 6.44492 8.8568 6.26876 8.57061 6.14851C8.28442 6.02825 7.97712 5.96631 7.66669 5.96631C7.35627 5.96631 7.04897 6.02825 6.76278 6.14851C6.47659 6.26876 6.21728 6.44492 6.00003 6.66665L3.33336 9.33332C2.89133 9.77534 2.64301 10.3749 2.64301 11C2.64301 11.6251 2.89133 12.2246 3.33336 12.6666C3.77539 13.1087 4.37491 13.357 5.00003 13.357C5.62515 13.357 6.22467 13.1087 6.66669 12.6666L7.00003 12.3333"
                          stroke="#3B82F6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                  </td>
                  <td class="pl-24">
                    <div class="flex justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M9.16667 2.5L16.6667 10C17.0911 10.4745 17.0911 11.1922 16.6667 11.6667L11.6667 16.6667C11.1922 17.0911 10.4745 17.0911 10 16.6667L2.5 9.16667V5.83333C2.5 3.99238 3.99238 2.5 5.83333 2.5H9.16667"
                          stroke="#52525B"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <circle
                          cx="7.50004"
                          cy="7.49967"
                          r="1.66667"
                          stroke="#52525B"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></circle>
                      </svg>
                      <p
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ creator.company }}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="flex justify-center">
                      <p
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ creator.job }}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="flex justify-center">
                      <p
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ creator.requests_count }}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="flex justify-center">
                      <p
                        class="text-sm leading-none text-text dark:text-textLight ml-2"
                      >
                        {{ creator.rank }}
                      </p>
                    </div>
                  </td>
                  <!-- <td class="pl-5">
                                            <button class="py-3 px-3 text-sm focus:outline-none leading-none text-red-700 bg-[#0d121d] rounded">Due today at 18:00</button>
                                        </td>
                                        <td class="pl-4">
                                            <button class="focus:ring-2 focus:ring-offset-2 focus:ring-red-300 text-sm leading-none text-text dark:text-textLight py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none">View</button>
                                        </td> -->
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
                          class="dropdown-menu peer-hover:block hover:block -top-20 min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
                          aria-labelledby="dropdownMenuButton2"
                        >
                          <li>
                            <button
                              @click="show(creator)"
                              class="flex justify-between dropdown-item text-sm py-2 px-4 font-normal w-full whitespace-nowrap bg-transparent hover:bg-lightDropDownHover dark:hover:bg-dropDownHover hover:text-text dark:hover:text-textLight"
                              href="#"
                            >
                              <div class="mr-6">{{ t("Show") }}</div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                />
                              </svg>
                            </button>
                          </li>
                          <li>
                            <button
                              @click="update(creator)"
                              class="flex dropdown-item text-sm py-2 px-4 font-normal w-full whitespace-nowrap bg-transparent hover:bg-lightDropDownHover dark:hover:bg-dropDownHover hover:text-text dark:hover:text-textLight"
                              href="#"
                            >
                              <div class="mr-4">{{ t("Update") }}</div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                                />
                              </svg>
                            </button>
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
  .filters {
    margin-left: 24%;
  }
  .filter {
    display: block;
    /* margin-left: 50px; */
  }
  .limit {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .phone {
    margin-top: -25px;
    margin-left: -15px;
  }
  .accountName {
    margin-top: -10px;
    margin-left: -15px;
  }
  .accountType {
    margin-top: -18px;
  }
  .search {
    margin-left: 25%;
    margin-top: 20px;
  }
  .mt-7 {
    margin-left: 80px;
  }
}
</style>
