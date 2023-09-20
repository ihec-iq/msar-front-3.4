<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
// import { useUserStore } from "@/stores/accounting/accounts/user";
// import type IUser from "@/types/accounting/accounts/IUser";
// const { get } = useUserStore();
const data = ref<any>({});
const changeStackSideBar = () => {
  isCloseStick.value = !isCloseStick.value;
};

const handleMouseEnter = () => {
  if (isCloseStick.value) return;
  isClose.value = false;
};

const handleMouseLeave = () => {
  if (isCloseStick.value) return;
  isClose.value = true;
};
const showPop = ref(false);
const showPopup = () => {
  showPop.value = true;
};
const closePopup = () => {
  showPop.value = false;
};
const rtlStore = useRtlStore();
const { isClose, isCloseStick } = storeToRefs(rtlStore);
//#region authorization
//#endregion
const tab = ref<string>("Feature Admin");
const settingMenu = ref<string>("MainSetting");
const secondTab = ref("2");
const router = useRouter();
const activeNames = ref(["1"]);

//const route = useRoute()
// const nav = computed(()=> route.meta.nav?.toString())
// watch(nav, newSearchQuery => {
//   if(nav.value != "undefined" || nav.value != undefined ){
//     tab.value=nav.value?.toString()
//   }
// } )
const authStore = useAuthStore();
const logout = () => {
  authStore.logout();
};
const settingPop = ref<boolean>(false);

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
  <div
    class="flex fixed h-full bg-bgLeftNavLight dark:bg-bgLeftNav nav print:hidden duration-500"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="LeftNav bg-bgLeftNavLight ltr:pl-2 rtl:pr-2 z-50 dark:bg-bgLeftNav w-20 flex-none flex flex-col h-full py-2"
    >
      <div
        class="shadow-md shadow-slate-500 bg-white dark:bg-sideNav h-full md:min-h-screen md:h-screen px-4 py-10 sm:rounded-xl flex flex-col justify-between"
      >
        <div
          v-motion
          :initial="{ opacity: 0, x: -85 }"
          :enter="{ opacity: 1, x: 0 }"
          :variants="{ custom: { scale: 2 } }"
          :delay="300"
          v-if="!isClose"
          class="fixed ltr:left-[275px] rtl:right-[275px] top-4 text-white"
        >
          <button @click="changeStackSideBar()" v-if="isCloseStick">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="text-textLight"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m0 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4Z"
              />
            </svg>
          </button>
          <button @click="changeStackSideBar()" v-if="!isCloseStick">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="text-textLight"
            >
              <path
                fill="currentColor"
                d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"
              />
            </svg>
          </button>
        </div>
        <nav class="flex items-center space-x-0 flex-col space-y-2">
          <!-- feature -->
          <router-link
            :to="{ name: 'Dashboard' }"
            @click.prevent="tab = 'Feature Admin'"
          >
            <button
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="الواجهة الاساسية"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
            </button>
          </router-link>
          <!-- Company -->
          <router-link
            :to="{ name: 'archiveIndex' }"
            @click.prevent="tab = 'Company'"
          >
            <button
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="الارشيف"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 20 20"
                stroke-width="1.5"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  fill="currentColor"
                  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"
                />
              </svg>
            </button>
          </router-link>
          <!--  -->
          <!-- Computer -->
          <router-link
            :to="{ name: 'itemIndex' }"
            @click.prevent="tab = 'Computer'"
          >
            <button
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="المواد"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  fill="currentColor"
                  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"
                />
              </svg>
            </button>
          </router-link>
          <!-- Active -->
          <router-link
            :to="{ name: 'inputVoucherIndex' }"
            @click.prevent="tab = 'Active'"
          >
            <button
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="الادخال المخزني"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  fill="currentColor"
                  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"
                />
              </svg>
            </button>
          </router-link>
          <!-- news -->
          <router-link
            :to="{ name: 'storeIndex' }"
            @click.prevent="tab = 'News'"
          >
            <button
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="المخزنية"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                class="h-5 w-5 sm:h-6 sm:w-6 text-gray-600"
              >
                <path
                  fill="currentColor"
                  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"
                />
              </svg>
            </button>
          </router-link>
          <!-- general -->
          <router-link
            :to="{ name: 'outputVoucherIndex' }"
            @click.prevent="tab = 'general'"
          >
            <button
              class="text-iconLight dark:text-icon p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="الاخراج المخزني"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  fill="currentColor"
                  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"
                />
              </svg>
            </button>
          </router-link>
          <!-- general -->
          <router-link
            :to="{ name: 'directVoucherIndex' }"
            @click.prevent="tab = 'general'"
          >
            <button
              class="text-iconLight dark:text-icon p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="الصرف المباشر- اضرب واهرب"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  fill="currentColor"
                  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"
                />
              </svg>
            </button>
          </router-link>
          <!-- general -->
          <router-link
            :to="{ name: 'employeeIndex' }"
            @click.prevent="tab = 'general1'"
          >
            <button
              class="text-iconLight dark:text-icon p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
              title="الموظفين ولد الحلال"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                stroke-width="1.5"
                stroke="currentColor"
                viewBox="0 0 256 256"
                class="w-6 h-6 text-gray-700"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M128 18a94.11 94.11 0 0 0-94 94c0 23.6 12.41 54.2 33.21 81.83C83.27 215.18 107.68 238 128 238s44.73-22.82 60.79-44.17C209.59 166.2 222 135.6 222 112a94.11 94.11 0 0 0-94-94Zm51.21 168.62C161.48 210.17 140.91 226 128 226s-33.48-15.83-51.21-39.38C57.8 161.37 46 132.78 46 112a82 82 0 0 1 164 0c0 20.78-11.8 49.37-30.79 74.62ZM118 136a38 38 0 0 0-38-38a14 14 0 0 0-14 14a38 38 0 0 0 38 38a14 14 0 0 0 14-14Zm-14 2a26 26 0 0 1-26-26a2 2 0 0 1 2-2a26 26 0 0 1 26 26a2 2 0 0 1-2 2Zm72-40a38 38 0 0 0-38 38a14 14 0 0 0 14 14a38 38 0 0 0 38-38a14 14 0 0 0-14-14Zm-24 40a2 2 0 0 1-2-2a26 26 0 0 1 26-26a2 2 0 0 1 2 2a26 26 0 0 1-26 26Zm-2 46a6 6 0 0 1-6 6h-32a6 6 0 0 1 0-12h32a6 6 0 0 1 6 6Z"
                />
              </svg>
            </button>
          </router-link>
          <!-- searcg -->
          <button
            class="text-white/50 p-4 inline-flex justify-center rounded-md text-iconLight hover:text-iconHoverLight dark:text-icon dark:hover:bg-sideNavHover dark:hover:text-iconHover smooth-hover"
            :class="{
              'bg-gray-800 text-white  border-l-2 border-red-300 ':
                tab === 'search',
            }"
            href="#"
          >
            <div class="input-group relative flex mt-4">
              <button
                class="inline-block text-iconLight hover:text-iconHoverLight dark:text-icon dark:hover:bg-sideNavHover dark:hover:text-iconHover font-medium text-xs leading-tight uppercase rounded transition duration-150 ease-in-out mr-1.5"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight1"
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
              </button>
            </div>

            <!-- <svg
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
            </svg> -->
          </button>
        </nav>
        <!-- setting and log out -->
        <div class="">
          <!-- #region setting icon -->
          <button
            @click="settingPop = !settingPop"
            class="dark:text-textGray border-none dark:hover:text-iconHover bg-transparent p-4 inline-flex justify-center rounded-md hover:bg-transparent text-iconLight hover:text-iconHoverLight smooth-hover"
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
          </button>
          <!-- #endregion -->
        </div>
      </div>
    </div>
    <!-- EXPLORER -->
    <div
      :class="[
        isClose ? 'transOff ltr:-ml-[224px] rtl:-mr-[624px]' : 'transOn',
      ]"
      class="shadow-md shadow-slate-500 bg-white mt-4 dark:bg-nav w-56 flex-none lg:flex flex-col justify-between duration-500"
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
              <span class="ml-2">{{ t("AllArchives") }}</span>
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
              <van-collapse-item :title="t('Here')" name="3">
                <ul class="px-2 py-3 pt-2">
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  >
                    Here
                  </li>
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  ></li>
                  <li
                    class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
                  ></li>
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
          ></li>
          <li
            class="text-gray-200 hover:bg-gray-700 mb-2 cursor-pointer hover:text-gray-200 bg-gray-750 rounded"
          ></li>
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
            <div class="text-text dark:text-textLight">{{ t("Help") }}</div>
            <!-- <div class="text-textGray text-xs w-full mr-1">0772 572 6027</div> -->
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
  <!--! #region user info -->
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
  <!--? #endregion -->
  <!--! #region setting pop -->
  <div
    v-if="settingPop == true"
    class="bg-settingLight dark:bg-setting fixed rtl:right-14 ltr:left-14 bottom-10 h-[350px] w-[300px] rounded-xl z-50 flex overflow-hidden"
  >
    <!-- main setting -->
    <div
      class="relative flex flex-col justify-between border-r border-gray-900 w-[160px] gap-6 bg-settingLight dark:bg-setting z-50 pl-2 pr-1 py-6"
    >
      <!-- main up setting -->
      <div>
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
            <p class="text-base font-medium text-text dark:text-textLight">
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
    <div class="h-full w-[130px] p-2" v-if="settingMenu === 'MainSetting'">
      <div
        @click="setting()"
        class="-mr-3 mt-4 p-3 mb-9 h-14 w-full cursor-pointer z-[10000] flex items-start rounded-lg dark:hover:bg-sideNavHover hover:bg-sideNavLightHover transition ease-in-out duration-150"
      >
        <div class="ml-4">
          <p class="text-base font-medium text-text dark:text-textLight">
            {{ t("setting") }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!--? #endregion -->
</template>

<style scoped>
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
