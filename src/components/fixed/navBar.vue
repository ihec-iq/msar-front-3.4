<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
// import { useUserStore } from "@/stores/accounting/accounts/user";
// import type IUser from "@/types/accounting/accounts/IUser";
// const { get } = useUserStore();
const data = ref<any>({});
// data.value = JSON.parse(localStorage.getItem("user")?.toString() || "{}");
// const filter = reactive({
//   name: "",
//   email: "",
//   limit: 50,
// });
// const getData = async () => {
//   await get(filter).then((response) => {
//     data.value = response.data.data.data;
//   });
// };
// const getUser = () => {
//   data.value = localStorage.getItem("user");
// };
// console.log(data.value);
const showPop = ref(false);
const showPopup = () => {
  showPop.value = true;
};
const closePopup = () => {
  showPop.value = false;
};
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
//#region authorization
const { can } = usePermissionStore();
//#endregion
const block = false;
const tab = ref<string>("Feature Admin");
const settingMenu = ref<string>("MainSetting");
const secondTab = ref("2");
const secondTab1 = ref("1");
const router = useRouter();
const activeNames = ref(["1"]);
const isSidebarOpen = false;
const currentSidebarTab = null;
const isSettingsPanelOpen = false;
const isSubHeaderOpen = false;
const { is } = storeToRefs(rtlStore);

//const route = useRoute()
// const nav = computed(()=> route.meta.nav?.toString())
// watch(nav, newSearchQuery => {
//   if(nav.value != "undefined" || nav.value != undefined ){
//     tab.value=nav.value?.toString()
//   }
// } )
const showPopover = ref(false);
const authStore = useAuthStore();
const logout = () => {
  console.log("Log out");
  authStore.logout();
};
const userIndex = () => {
  router.push({
    name: "userIndex",
  });
};
const setting = () => {
  router.push({
    name: "setting",
  });
};
// const data = ref<any>();
onMounted(() => {
  data.value = JSON.parse(localStorage.getItem("user")?.toString() || "{}");
  //   // getData();
  //   data.value = localStorage.getItem("user");
});
</script>
<template>
  <div class="flex fixed h-full bg-bgLeftNavLight dark:bg-bgLeftNav">
    <div
      :class="[
        is ? ' duration-0 ltr:-ml-[80px] rtl:-mr-[80px]' : ' duration-0',
      ]"
      class="LeftNav bg-bgLeftNavLight ltr:pl-2 rtl:pr-2 z-50 dark:bg-bgLeftNav w-20 flex-none flex flex-col h-full py-2"
    >
      <div
        class="sideNav bg-[#0099ff] dark:bg-sideNav h-full md:min-h-screen md:h-screen px-4 py-10 sm:rounded-xl flex flex-col justify-between"
      >
        <nav class="flex items-center space-x-0 flex-col space-y-2">
          <button
            v-if="!is"
            @click="isClose = !isClose"
            class="cursor-pointer lg:block xs:hidden fixed border border-gray-500 rounded-full p-2 top-2 ltr:left-14 rtl:right-14"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 text-textLight duration-700 b-t1"
              :class="{ 'rotate-180': isClose }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            @click="is = !is"
            :class="{ 'ltr:left-2 rtl:right-2': is }"
            class="cursor-pointer fixed border border-gray-500 rounded-full p-2 top-500 ltr:left-14 rtl:right-14"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 text-textLight duration-700 b-t1"
              :class="{ 'rotate-180': is }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <!-- Active: bg-gray-800 text-white, Not active: text-white/50 -->
          <!--  -->
          <!-- Reports -->
          <!--  -->
          <router-link
            :to="{ name: 'archiveIndex' }"
            @click.prevent="tab = 'Feature Admin'"
            >{{ is }}
            <a
              title="Feature"
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
            </a>
            {{ isClose }}
          </router-link>

          <!-- <router-link
            :to="{ name: 'companyIndex' }"
            @click.prevent="tab = 'Company'"
          >
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </a>
          </router-link>

          <router-link
            :to="{ name: 'computerCardIndex' }"
            @click.prevent="tab = 'Computer'"
          >
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </a>
          </router-link>

          <router-link
            :to="{ name: 'activeIndex' }"
            @click.prevent="tab = 'Active'"
          >
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </a>
          </router-link>

          <router-link :to="{ name: 'news' }" @click.prevent="tab = 'User'">
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                />
              </svg>
            </a>
          </router-link>

          <router-link
            :to="{ name: 'generalIndex' }"
            @click.prevent="tab = 'general'"
          >
            <a
              class="text-iconLight dark:text-icon p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
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
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
            </a>
          </router-link> -->
        </nav>
        <!-- setting and log out -->
        <div
          class="flex items-center space-x-2 lg:space-x-0 flex-col space-y-2"
        >
          <a
            is-link
            @click="showPopup"
            class="dark:text-textGray z-50 dark:hover:text-iconHover dark:bg-sideNavSetting bg-transparent hover:bg-transparent text-iconLight hover:text-iconHoverLight p-4 inline-flex justify-center rounded-md smooth-hover"
            href="#"
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </a>
          <div class="dropdown relative">
            <!-- start fly setting -->
            <label
              class="btn dark:text-textGray border-none dark:hover:text-iconHover bg-transparent p-4 inline-flex justify-center rounded-md hover:bg-transparent text-iconLight hover:text-iconHoverLight smooth-hover"
              tabindex="0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </label>

            <div
              tabindex="0"
              class="dropdown-content menu p-2 rounded-box w-52 bottom-2"
            >
              <div
                class="border-none fixed xs:bottom-4 min-w-max w-[300px] text-base h-[500px] z-[10000] float-left py-2 list-none text-left rounded-lg mt-1 m-0 bg-clip-padding"
              >
                <div
                  class="rounded-lg h-full shadow-lg w-full bg-settingLight dark:bg-setting flex z-[10000] ring-1 ring-black ring-opacity-5 overflow-hidden"
                >
                  <!-- main setting -->
                  <div
                    class="relative flex flex-col justify-between border-r border-gray-900 w-[160px] gap-6 bg-settingLight dark:bg-setting z-[10000] pl-2 pr-1 py-6"
                  >
                    <!-- main up setting -->
                    <div>
                      <!-- <div
                        @click.prevent="settingMenu = 'account'"
                        class="-mr-3 mb-9 h-14 p-3 w-full z-[100000] cursor-pointer dropdown-item flex items-start rounded-lg dark:hover:bg-sideNavHover hover:bg-sideNavLightHover transition ease-in-out duration-150"
                        :class="{
                          ' text-white  border-l-2 border-blue-500 ':
                            settingMenu === 'account',
                        }"
                      >
                        <img
                          src="@/assets/image/accounts.svg"
                          class="h-6 w-6"
                          alt=""
                        />
                        <div class="ml-4">
                          <p
                            class="text-base font-medium text-text dark:text-textLight"
                          >
                            {{ t("Accounts") }}
                          </p>
                        </div>
                      </div> -->
                      <!-- <div
                        @click.prevent="settingMenu = 'hotel'"
                        class="-mr-3 mb-9 h-14 p-3 w-full cursor-pointer dropdown-item z-[10000] flex items-start rounded-lg dark:hover:bg-sideNavHover hover:bg-sideNavLightHover transition ease-in-out duration-150"
                        :class="{
                          ' text-white border-l-2 border-blue-500 ':
                            settingMenu === 'hotel',
                        }"
                      >
                        <img
                          src="@/assets/image/hotelSetting.svg"
                          class="h-6 w-6"
                          alt=""
                        />
                        <div class="ml-4">
                          <p
                            class="text-base font-medium text-text dark:text-textLight"
                          >
                            {{ t("Hotel") }}
                          </p>
                        </div>
                      </div> -->
                      <div
                        @click.prevent="settingMenu = 'MainSetting'"
                        class="-mr-3 p-3 mb-9 h-14 w-full cursor-pointer z-[10000] flex items-start rounded-lg dark:hover:bg-sideNavHover hover:bg-sideNavLightHover transition ease-in-out duration-150"
                        :class="{
                          ' text-white  border-l-2 border-blue-500 ':
                            settingMenu === 'MainSetting',
                        }"
                      >
                        <!-- Heroicon name: outline/shield-check -->
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6 text-[#0099ff]"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>

                        <div class="ml-4">
                          <p
                            class="text-base font-medium text-text dark:text-textLight"
                          >
                            {{ t("Setting") }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- log out -->
                    <div>
                      <div
                        @click="logout()"
                        class="p-2 cursor-pointer font-bold text-delete hover:text-text dark:hover:text-textLight flex rounded-lg duration-300 hover:bg-deleteHover mb-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ t("Log Out") }}
                      </div>
                    </div>
                  </div>
                  <!-- side setting -->
                  <!-- <div
                    class="h-full w-[130px] p-2"
                    v-if="settingMenu === 'account'"
                  > -->
                  <!-- <div
                      @click="userIndex()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("User") }}
                    </div>
                    <div
                      @click="accountIndex()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("Account") }}
                    </div>
                    <div
                      @click="agentIndex()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("Agent") }}
                    </div>
                    <div
                      @click="supplierIndex()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("Supplier") }}
                    </div>-->
                  <!-- <div
                      @click="creatorIndex()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("Creator") }}
                    </div>
                    <div
                      @click="packageIndex()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("Packages") }}
                    </div> -->
                  <!-- </div> -->
                  <div
                    class="h-full w-[130px] p-2"
                    v-if="settingMenu === 'MainSetting'"
                  >
                    <div
                      @click="setting()"
                      class="p-2 cursor-pointer text-text dark:text-textLight rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      {{ t("Setting") }}
                    </div>
                    <!-- <div
                      @click="logout()"
                      class="p-2 cursor-pointer text-text dark:text-textLight flex rounded-lg duration-300 dark:hover:bg-sideNavHover hover:bg-sideNavLightHover mb-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ t("Log Out") }}
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- EXPLORER -->
    <div
      :class="[
        isClose
          ? 'transOff ltr:-ml-[224px] rtl:-mr-[624px]'
          : 'transOn xs:w-full',
        is ? 'transOff ltr:-ml-[224px] rtl:-mr-[624px]' : 'transOn',
      ]"
      class="bg-sideNavLight mt-4 dark:bg-nav lg:w-56 flex-none lg:flex flex-col justify-between `hidden`"
    >
      <!-- Feature Admin icon -->
      <div
        class="hashtag-bar text-sm leading-relaxed overflow-y-auto main"
        v-if="tab === 'Feature Admin'"
      >
        <ul class="px-2 py-3">
          <li
            class="text-text dark:text-textLight px-2 dark:hover:text-textGray dark:hover:bg-sideNavHover hover:bg-sideNavLightHover"
          >
            <a href="#" class="flex items-center justify-between">
              <span class="ml-2">{{ t("EXPLORER") }}</span>
              <span class="text-xl">...</span>
            </a>
            <hr />
          </li>
        </ul>

        <button
          class="flex items-center text-text dark:text-textLight dark:hover:text-textGray"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              class="heroicon-ui"
              d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
            ></path>
          </svg>
          <h3 class="uppercase tracking-wide font-semibold text-xs">
            {{ t("Archive") }}
          </h3>
        </button>

        <ul class="px-2 py-3 pt-2">
          <li
            class="text-text dark:text-textLight hover:bg-sideNavLightHover dark:hover:bg-sideNavHover mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          >
            <router-link
              :to="{ name: 'archiveIndex' }"
              @click.prevent="secondTab === 'Companies'"
              class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
            >
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
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                />
              </svg>
              <span class="ml-2">{{ t("All Archives") }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Companies -->
      <div
        class="hashtag-bar text-sm leading-relaxed overflow-y-auto bills"
        v-if="tab === 'Company'"
      >
        <ul class="px-2 py-3 pt-2">
          <li
            class="text-text dark:text-textLight px-2 dark:hover:text-textGray dark:hover:bg-sideNavHover hover:bg-sideNavLightHover"
          >
            <a href="#" class="flex items-center justify-between">
              <span class="ml-2">{{ t("EXPLORER") }}</span>
              <span class="text-xl">...</span>
            </a>
          </li>
          <li
            class="text-text dark:text-textLight mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          >
            <van-collapse v-model="activeNames">
              <van-collapse-item :title="t('Companies')" name="3">
                <ul class="px-2 py-3 pt-2">
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'companyIndex' }"
                      @click.prevent="secondTab === 'Companies'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                      <span class="ml-2">{{ t("Companies") }}</span>
                    </router-link>
                  </li>
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'companyAccess' }"
                      @click.prevent="secondTab === 'company access'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                      <span class="ml-2">{{ t("Companies By Access") }}</span>
                    </router-link>
                  </li>
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'companyExpire' }"
                      @click.prevent="secondTab === 'company expire'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 6h.008v.008H6V6z"
                        />
                      </svg>
                      <span class="ml-1">{{ t("Companies By Expire") }}</span>
                    </router-link>
                  </li>
                </ul>
              </van-collapse-item>
            </van-collapse>
          </li>
        </ul>
      </div>

      <!-- Computers -->
      <div
        class="hashtag-bar text-sm leading-relaxed overflow-y-auto bills"
        v-if="tab === 'Computer'"
      >
        <ul class="px-2 py-3">
          <li
            class="text-text dark:text-textLight px-2 dark:hover:text-textGray dark:hover:bg-sideNavHover hover:bg-sideNavLightHover"
          >
            <a href="#" class="flex items-center justify-between">
              <span class="ml-2">{{ t("EXPLORER") }}</span>
              <span class="text-xl">...</span>
            </a>
            <hr />
          </li>
        </ul>

        <button
          class="flex items-center text-text dark:text-textLight dark:hover:text-textGray"
        >
          <h3 class="uppercase p-2 pl-4 tracking-wide font-semibold text-xs">
            {{ t("Computers") }}
          </h3>
        </button>

        <ul class="px-2 py-3 pt-2">
          <li
            class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          >
            <router-link
              :to="{ name: 'computerCardIndex' }"
              @click.prevent="secondTab === 'Companies'"
              class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
            >
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
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                />
              </svg>
              <span class="ml-2">{{ t("Card Computer") }}</span>
            </router-link>
          </li>
          <li
            class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          >
            <router-link
              :to="{ name: 'computerIndex' }"
              @click.prevent="secondTab === 'Companies'"
              class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
            >
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
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                />
              </svg>
              <span class="ml-2">{{ t("Table Computer") }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- active -->
      <div
        class="hashtag-bar text-sm leading-relaxed overflow-y-auto bills"
        v-if="tab === 'Active'"
      >
        <ul class="px-2 py-3 pt-2">
          <li
            class="text-text dark:text-textLight px-2 dark:hover:text-textGray dark:hover:bg-sideNavHover hover:bg-sideNavLightHover"
          >
            <a href="#" class="flex items-center justify-between">
              <span class="ml-2">{{ t("EXPLORER") }}</span>
              <span class="text-xl">...</span>
            </a>
          </li>
          <li
            class="text-text dark:text-textLight mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          >
            <van-collapse v-model="activeNames">
              <van-collapse-item :title="t('Active')" name="3">
                <ul class="px-2 py-3 pt-2">
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'activeIndex' }"
                      @click.prevent="secondTab === 'Companies'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                      <span class="ml-2">{{ t("Active Computer") }}</span>
                    </router-link>
                  </li>
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'activeUserIndex' }"
                      @click.prevent="secondTab === 'Companies'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                      <span class="ml-2">{{ t("Active User") }}</span>
                    </router-link>
                  </li>
                </ul>
              </van-collapse-item>
            </van-collapse>
          </li>
        </ul>
      </div>
      <!-- General -->
      <div
        class="hashtag-bar text-sm leading-relaxed overflow-y-auto bills"
        v-if="tab === 'general'"
      >
        <ul class="px-2 py-3 pt-2">
          <li
            class="text-text dark:text-textLight px-2 dark:hover:text-textGray dark:hover:bg-sideNavHover hover:bg-sideNavLightHover"
          >
            <a href="#" class="flex items-center justify-between">
              <span class="ml-2">{{ t("See whats going on") }}</span>
              <span class="text-xl">...</span>
            </a>
          </li>
          <li
            class="text-text dark:text-textLight mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          >
            <van-collapse v-model="activeNames">
              <van-collapse-item :title="t('General')" name="3">
                <ul class="px-2 py-3 pt-2">
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'allSupport' }"
                      @click.prevent="secondTab === 'generalIndex'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                      <span class="ml-2">{{ t("All Supports") }}</span>
                    </router-link>
                  </li>
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    <router-link
                      :to="{ name: 'allBugs' }"
                      @click.prevent="secondTab === 'generalIndex'"
                      class="flex items-center text-text dark:text-textLight dark:hover:bg-sideNavHover hover:bg-sideNavLightHover px-2 py-1"
                    >
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
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                      <span class="ml-2">{{ t("All Bugs") }}</span>
                    </router-link>
                  </li>
                </ul>
              </van-collapse-item>
            </van-collapse>
          </li>
        </ul>
      </div>

      <!-- search -->
      <div
        class="hashtag-bar text-sm leading-relaxed overflow-y-auto search"
        v-if="tab === 'User'"
      >
        <div class="flex justify-center mx-2">
          <div class="mb-3">
            <div class="input-group relative flex mt-4">
              <!-- <button
                class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-1.5"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button> -->

              <div
                class="offcanvas offcanvas-end fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 top-0 right-0 border-none w-96"
                tabindex="-1"
                id="offcanvasRight1"
                aria-labelledby="offcanvasRightLabel"
              >
                <div
                  class="offcanvas-header flex items-center justify-between p-4"
                >
                  <h5
                    class="offcanvas-title mb-0 leading-normal font-semibold"
                    id="offcanvasRightLabel"
                  >
                    Offcanvas right
                  </h5>
                  <button
                    type="button"
                    class="btn-close box-content w-4 h-4 p-2 -my-5 -mr-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="offcanvas-body flex-grow p-4 overflow-y-auto">
                  ...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- for Footer Support -->
      <div class="bg-gray-850 px-3 py-2 flex items-center justify-between">
        <div class="flex items-center">
          <a href="#"
            ><img
              src="@/assets/20220323_095012.png"
              alt="avatar"
              class="w-8 h-8 rounded-full"
          /></a>
          <div class="text-xs ml-1 mb-4">
            <div class="text-text dark:text-textLight">{{ t("Support") }}</div>
            <div class="text-textGray text-xs w-full mr-1">0772 572 6027</div>
          </div>
        </div>
        <div class="flex items-center text-iconLight dark:text-icon">
          <a
            href="#"
            class="dark:hover:text-iconHover hover:text-iconHoverLight"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"
              ></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </svg>
          </a>
          <a
            href="#"
            class="ml-3 dark:hover:text-iconHover hover:text-iconHoverLight"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" opacity=".1" fill="none"></path>
              <path
                d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            class="ml-3 dark:hover:text-iconHover hover:text-iconHoverLight"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- end EXPLORER -->
  </div>
  <van-popup
    class="bg-customer ltr:left-[9.5rem] rtl:-right-[8.5rem] h-screen z-[999999] lg:w-[15%] xs:w-[78%] dark:bg-content flex"
    v-model:show="showPop"
    round
    ><div class="dark:text-textLight w-full">
      <div class="text-2xl text-center p-2 font-bold mt-6">
        {{ t("User Info") }}
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: -15 }"
        :enter="{ opacity: 1, y: 0 }"
        :variants="{ custom: { scale: 2 } }"
        :delay="200"
      >
        <div class="flex justify-between mx-8 mt-5">
          <div class="flex items-center">
            <div class="text-xl font-bold">{{ t("Name") }}:</div>
            <div class="ltr:ml-1 text-lg rtl:mr-1">{{ data.name }}</div>
          </div>
          <div class="avatar online">
            <div class="w-20 rounded-full">
              <img src="http://placekitten.com/192/192" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mx-8 mt-5">
          <div class="text-xl font-bold">{{ t("Email") }}:</div>
          <div class="ltr:ml-1 text-lg rtl:mr-1">{{ data.email }}</div>
        </div>
      </div>
      <div
        @click="closePopup()"
        class="bg-back w-64 mx-4 p-2 text-xl rounded-lg absolute bottom-2 cursor-pointer"
      >
        {{ t("Close") }}
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
:root {
  --primary-color: #92b8ff;
  --secondary-color: #e6eef9;
}
.transOff {
  transform: translateX(-400px);
}
.transOn {
  transform: translateX(1);
}
.spinn {
  animation: spin 2s linear infinite;
}
@keyframes spinn {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.form-control:focus {
  box-shadow: none;
}
/* since nested groupes are not supported we have to use 
     regular css for the nested dropdowns 
  */
li > ul {
  transform: translatex(100%) scale(0);
}
li:hover > ul {
  transform: translatex(101%) scale(1);
}
li > button svg {
  transform: rotate(-90deg);
}
li:hover > button svg {
  transform: rotate(-270deg);
}
/* Below styles fake what can be achieved with the tailwind config
     you need to add the group-hover variant to scale and define your custom
     min width style.
  	 See https://codesandbox.io/s/tailwindcss-multilevel-dropdown-y91j7?file=/index.html
  	 for implementation with config file
  */
.group:hover .group-hover\:scale-100 {
  transform: scale(1);
}
.group:hover .group-hover\:-rotate-180 {
  transform: rotate(180deg);
}
.scale-0 {
  transform: scale(0);
}
.min-w-32 {
  min-width: 8rem;
}
.tabs {
  display: flex;
  position: relative;
  background-color: #6b7280;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15),
    0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.75rem;
  border-radius: 20px;
}
.tabs * {
  z-index: 2;
}
input[type="radio"] {
  display: none;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 200px;
  font-size: 1.25rem;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
  color: #fff;
}
.notification {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-left: 0.75rem;
  border-radius: 50%;
  background-color: var(--secondary-color);
  transition: 0.15s ease-in;
}
input[type="radio"]:checked + label {
  color: var(--primary-color);
}
input[type="radio"]:checked + label > .notification {
  background-color: var(--primary-color);
  color: #fff;
}
input[id="radio-1"]:checked ~ .glider {
  transform: translateX(0);
}
input[id="radio-2"]:checked ~ .glider {
  transform: translateX(100%);
}
input[id="radio-3"]:checked ~ .glider {
  transform: translateX(200%);
}
.glider {
  position: absolute;
  display: flex;
  height: 54px;
  width: 200px;
  background-color: var(--secondary-color);
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}
@media (max-width: 700px) {
  .tabs {
    transform: scale(0.6);
  }
}
/* @media (min-width: 390px) {
  .user-info {
    width: 70% !important;
  }
} */
</style>
