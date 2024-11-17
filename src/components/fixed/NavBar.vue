<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import { Links } from "./FixedMenu";
import { usePermissionsStore } from "@/project/core/permissionStore";

import { t } from "@/utilities/I18nPlugin";
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
const { UserPermissions } = storeToRefs(usePermissionsStore());
const filteredLinks = computed(() =>
  Links.filter((link) => {
    // Check if any of the link's permissions are included in userPermissions
    if (UserPermissions.value == undefined) return;
    return link.permissions.some(
      (permission) =>
        UserPermissions.value.includes(permission) || permission == "public"
    );
  })
);
const checkPermission = (per: string) => {
  return UserPermissions.value.some(
    (permission) =>
      UserPermissions.value.includes(per) || permission == "public"
  );
};
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
  userData.value = JSON.parse(localStorage.getItem("user") || "{}");
});

const { user } = storeToRefs(useAuthStore());
</script>
<template>
  <div
    class="LeftNav flex-col  ltr:pl-2 rtl:pr-2 flex fixed h-full z-[999] bg-sideNav dark:bg-[#25293c] nav print:hidden duration-500 overflow-y-auto overflow-x-hidden"
    :class="[isClose ? 'lg:w-20 sm:w-20 xs:w-[68px]' : 'lg:w-64 sm:w-64  ']" @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <!-- little circule -->
    <div v-motion :initial="{ opacity: 0, x: -85 }" :enter="{ opacity: 1, x: 0 }" :variants="{ custom: { scale: 2 } }"
      :delay="300" v-if="!isClose"
      class="lg:fixed sm:fixed ltr:left-[225px] rtl:right-[225px] top-4 text-white lg:block xs:hidden">
      <button @click="changeStackSideBar()" v-if="isCloseStick">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-black">
          <path fill="currentColor"
            d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m0 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4Z" />
        </svg>
      </button>
      <button @click="changeStackSideBar()" v-if="!isCloseStick">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-textLight">
          <path fill="currentColor"
            d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
        </svg>
      </button>
    </div>
    <!-- logo and co Name  -->
    <div class="font-bold items-start flex flex-col text-black mt-5"
      :class="{ 'w-14': isClose, 'w-full lg:ml-0 xs:ml-1': !isClose }">
      <div class="flex items-center">
        <!-- ! the image in the assets is not rounded -->
        <!-- *Old source: @/assets/logo-512x512.png -->
        <img @click="isClose = !isClose" src="@/assets/ihec-logo.jpg" alt="Profile Picture"
          class="w-14 h-14  rounded-full align-middle" />
        <div class="text-lg mt-1 ml-1 duration-700 w-20 dark:text-textLight text-text"
          :class="{ hidden: isClose, block: !isClose }">
          <span class="mx-2">{{ user?.Employee?.name }}</span>
        </div>
      </div>
      <!-- !Bug: the line displayed over the photo (current: IHEC logo) -->
      <!-- <hr
            class="absolute top-14 left-5 duration-500"
            :class="{ 'lg:w-52 xs:w-40': !isClose, 'w-[40px] ': isClose }"
          /> -->
    </div>
    <!-- main list -->
    <nav class="flex pt-3 flex-col">
      <!-- main route -->
      <ul class="relative overflow-hidden">
        <li v-for="Link in filteredLinks" :key="Link.routerName" class="overflow-hidden flex items-center">
          <router-link :to="{ name: Link.routerName }" @click.prevent="tab = Link.tab" @mouseover="tab = Link.tab">
            <button
              class="bg-[#FEFEFE] shadow-md text-[#23A559] hover:text-[#FEFEFE] hover:bg-[#23A559] duration-500 fadeOut 2s ease-in-out btn-outline hover:rounded-2xl p-4 rounded-full border-none border-2 m-1"
              :title="Link.title" v-html="Link.icon"></button></router-link>
          <!-- children -->
          <div>
            <!-- <div
                  v-if="Link.children?.length ?? 0 > 0"
                  class="p-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap cursor-pointer"
                >
                  <div v-for="(child, index) in Link.children" :key="index">
                    <router-link
                      :to="{ name: child.routerName }"
                      v-if="
                        tab == Link.tab && checkPermission(child.permissions[0])
                      "
                      class="cursor-pointer duration-800 fadeOut 2s ease-in-out rounded-md p-2 border-2 my-2 border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800"
                      :class="{ 'flex ': !isClose, hidden: isClose }"
                    >
                      {{ child.title }}
                    </router-link>
                  </div>
                </div> -->
            <div v-if="tab == Link.tab && checkPermission(Link.permissions[0])"
              class="cursor-pointer duration-800  fadeOut 2s ease-in-out rounded-md m-2 border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400"
              :class="{ 'flex ': !isClose, hidden: isClose }">
              {{ Link.description }}
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>

</template>

<style scoped> 
 
.form-control:focus {
  box-shadow: none;
}

/* since nested groupes are not supported we have to use 
     regular css for the nested dropdowns 
  */
li>ul {
  transform: translatex(100%) scale(0);
}

li:hover>ul {
  transform: translatex(101%) scale(1);
}

li>button svg {
  transform: rotate(-90deg);
}

li:hover>button svg {
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
  box-shadow:
    0 0 1px 0 rgba(24, 94, 224, 0.15),
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

input[type="radio"]:checked+label {
  color: var(--primary-color);
}

input[type="radio"]:checked+label>.notification {
  background-color: var(--primary-color);
  color: #fff;
}

input[id="radio-1"]:checked~.glider {
  transform: translateX(0);
}

input[id="radio-2"]:checked~.glider {
  transform: translateX(100%);
}

input[id="radio-3"]:checked~.glider {
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