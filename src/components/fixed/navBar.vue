<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import { Links } from "./FixedMenu";
import { usePermissionStore } from "@/stores/permissionStore";

import { t } from "@/utils/I18nPlugin";
// import { useUserStore } from "@/stores/accounting/accounts/user";
// import type IUser from "@/types/accounting/accounts/IUser";
// const { get } = useUserStore();

const userData = ref<any>({});
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

//#region nav menu
const { permissions } = storeToRefs(usePermissionStore());
const filteredLinks = computed(() =>
  Links.filter((link) => {
    // Check if any of the link's permissions are included in userPermissions
    if (permissions.value == undefined) return;
    return link.permissions.some(
      (permission) => permissions.value.includes(permission) || permission == "public"
    );
  })
);
// watch(nav, newSearchQuery => {
//   if(nav.value != "undefined" || nav.value != undefined ){
//     tab.value=nav.value?.toString()
//   }
// } )

//#endregion

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
onMounted(() => {
  userData.value = JSON.parse(localStorage.getItem("user")?.toString() || "{}");
});
</script>
<template>
  <div
    class="flex fixed h-full z-[999] bg-white dark:bg-darkNav nav print:hidden duration-500 overflow-y-auto overflow-x-hidden"
    :class="[isClose ? 'absolute lg:w-20 xs:w-[66px]' : 'lg:w-64  ']"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="LeftNav z-50 bg-white dark:bg-darkNav flex flex-col h-full">
      <div
        class="bg-white dark:bg-darkNav h-full md:min-h-screen md:h-screen flex flex-col justify-between ltr:pl-2 rtl:pr-2"
      >
        <div
          v-motion
          :initial="{ opacity: 0, x: -85 }"
          :enter="{ opacity: 1, x: 0 }"
          :variants="{ custom: { scale: 2 } }"
          :delay="300"
          v-if="!isClose"
          class="lg:fixed ltr:left-[225px] rtl:right-[225px] top-4 text-white lg:block xs:hidden"
        >
          <button @click="changeStackSideBar()" v-if="isCloseStick">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="text-black"
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
        <div
          class="font-bold items-center flex flex-col justify-center text-black mt-5"
          :class="{ 'w-14': isClose, 'w-full lg:ml-0 xs:ml-1': !isClose }"
        >
          <div class="flex ml-4">
            <img
              @click="isClose = !isClose"
              src="./../../assets/logo-512x512.png"
              alt=""
              class="w-8 h-8 rounded-full"
            />
            <div
              class="text-lg mt-1 ml-1 duration-700 w-32 dark:text-textLight text-text"
              :class="{ hidden: isClose, block: !isClose }"
            >
              IHEC
            </div>
          </div>
          <hr
            class="absolute top-14 left-5 duration-500"
            :class="{ 'lg:w-52 xs:w-40': !isClose, 'w-[40px] ': isClose }"
          />
        </div>
        <nav class="flex flex-col">
          <!-- main route -->
          <ul class="relative overflow-hidden">
            <li
              v-for="Link in filteredLinks"
              :key="Link.routerName"
              class="overflow-hidden flex items-center"
            >
              <router-link
                :to="{ name: Link.routerName }"
                @click.prevent="tab = Link.tab"
                class=""
              >
                <button
                  class="dark:text-navIconColoDark dark:hover:text-navIconColorHoverDark hover:text-[#444] p-4 inline-flex justify-center rounded-md smooth-hover"
                >
                  <i :title="Link.title" v-html="Link.icon" /></button
              ></router-link>
              <div>
                <div
                  v-if="Link.children?.length ?? 0 > 0"
                  class="p-4 text-base whitespace-pre-wrap cursor-pointer duration-500"
                >
                  <div
                    v-for="child in Link.children"
                    :key="child.routerName"
                    :class="{ 'flex ': !isClose, hidden: isClose }"
                  >
                    <router-link
                      :to="{ name: child.routerName }"
                      v-if="tab == Link.tab"
                      class="p-2 cursor-pointer"
                    >
                      {{ child.title }}
                    </router-link>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <!-- setting and log out -->
        <div class="">
          <!-- #region setting icon -->
          <button
            @click="settingPop = !settingPop"
            class="dark:text-textGray border-none dark:hover:text-navIconColorHoverDark bg-transparent p-4 inline-flex justify-center rounded-md hover:bg-transparent text-iconLight hover:text-iconHoverLight smooth-hover"
            :class="{ 'float-left ': !isClose, 'mr-8': isClose }"
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
      <!-- <div v-if="!isClose" class="w-full"></div> -->
    </div>
    <!-- EXPLORER
    transOff ltr:-ml-[224px] rtl:-mr-[624px] -->
    <!-- <div
      class="bg-red-900 w-56"
      :class="[isClose ? 'absolute z-[9999999] right-32' : '']"
    ></div> -->
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
            <div class="ltr:ml-1 text-lg rtl:mr-1">{{ userData.name }}</div>
          </div>
          <div class="avatar online">
            <div class="w-20 rounded-full">
              <img src="http://placekitten.com/192/192" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mx-8 mt-5">
          <div class="text-xl font-bold">{{ t("Email") }}:</div>
          <div class="ltr:ml-1 text-lg rtl:mr-1">{{ userData.email }}</div>
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
    class="bg-settingLight dark:bg-setting fixed rtl:right-14 ltr:left-14 bottom-10 h-[350px] w-[300px] rounded-xl z-[9999999] flex overflow-hidden"
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
            ' text-white  border-l-2 border-blue-500 ': settingMenu === 'MainSetting',
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
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
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
@/stores/permissionStore