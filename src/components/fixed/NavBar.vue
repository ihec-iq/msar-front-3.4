<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import { type IconLink, Links } from "./FixedMenu";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { Icon } from "@iconify/vue";

// ---------------------------
// state
// ---------------------------
const userData = ref<any>({});
const showMobileMenu = ref(false);
const showPop = ref(false);

const toggleMobileMenu = () => (showMobileMenu.value = !showMobileMenu.value);
const closeMobileMenu = () => (showMobileMenu.value = false);

const showPopup = () => (showPop.value = true);
const closePopup = () => (showPop.value = false);

const tab = ref<string>("Feature Admin");
const settingMenu = ref<string>("MainSetting");
const secondTab = ref("2");
const activeNames = ref(["1"]);

// router + close drawer on route change
const router = useRouter();
watch(
  () => router.currentRoute.value.fullPath,
  () => closeMobileMenu()
);

// ---------------------------
// stores
// ---------------------------
const authStore = useAuthStore();
const { user } = storeToRefs(useAuthStore());

const rtlStore = useRtlStore();
const { isClose, isCloseStick } = storeToRefs(rtlStore);

// safe wrapper for your existing click target in the template
const changeStackSideBar = () => {
  // if store exposes an action, use it; otherwise flip the flag
  // @ts-ignore
  if (typeof rtlStore.changeStackSideBar === "function") {
    // @ts-ignore
    rtlStore.changeStackSideBar();
  } else {
    isCloseStick.value = !isCloseStick.value;
  }
};

// hover handlers (desktop only)
const handleMouseEnter = () => {
  if (isCloseStick.value) return;
  isClose.value = false;
};
const handleMouseLeave = () => {
  if (isCloseStick.value) return;
  isClose.value = true;
};

// permissions
const { UserPermissions } = storeToRefs(usePermissionsStore());

const filteredLinks = computed<Array<IconLink>>(() =>
  (Links ?? []).filter((link) => {
    if (!link?.permissions) return true;
    if (!UserPermissions.value) return link.permissions.includes("public");
    return link.permissions.some(
      (p) => p === "public" || UserPermissions.value!.includes(p)
    );
  })
);

const checkPermission = (per: string) => {
  if (per === "public") return true;
  return !!UserPermissions.value && UserPermissions.value.includes(per);
};

// esc to close mobile drawer
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeMobileMenu();
};

// mount
onMounted(() => {
  userData.value = authStore.user;
  document.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="bg-sideNav dark:bg-[#2c3147] h-full">
    <!-- Mobile hamburger (hidden on lg+) -->
    <div class="lg:hidden fixed top-0 ltr:left-3 rtl:right-1 z-[1001]">
      <button
        @click="toggleMobileMenu"
        class="p-2 rounded-xl shadow bg-white/90 dark:bg-[#2b2f42]"
        aria-label="Open menu"
        aria-controls="mobile-drawer"
        :aria-expanded="showMobileMenu"
      >
        <Icon icon="mdi:menu" class="text-2xl" />
      </button>
    </div>

    <!-- Desktop sidebar (unchanged behavior; only visible on lg+) -->
    <div
      class="LeftNav hidden lg:flex flex-col ltr:pl-2 rtl:pr-2 fixed h-full z-[999] bg-sideNav dark:bg-[#2c3147] nav print:hidden duration-500 overflow-y-auto overflow-x-hidden"
      :class="[
        isClose ? 'lg:w-20 sm:w-20 xs:w-[68px]' : 'lg:w-120 md:w-120 sm:w-64',
      ]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- little circle toggle -->
      <div
        v-motion
        :initial="{ opacity: 0, x: -85 }"
        :enter="{ opacity: 1, x: 0 }"
        :variants="{ custom: { scale: 2 } }"
        :delay="300"
        v-if="!isClose"
        class="lg:fixed sm:fixed ltr:left-[225px] rtl:right-[225px] top-4 text-white lg:block xs:hidden"
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
        <button @click="changeStackSideBar()" v-else>
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

      <!-- logo and user -->
      <div
        class="font-bold items-start flex flex-col text-black mt-5"
        :class="{ 'w-14': isClose, 'w-full lg:ml-0 xs:ml-1': !isClose }"
      >
        <div class="flex items-center">
          <img
            @click="isClose = !isClose"
            src="@/assets/ihec-logo.jpg"
            alt="Profile Picture"
            class="w-14 h-14 cursor-pointer rounded-full align-middle"
          />
          <div
            class="text-lg mt-1 ml-1 duration-700 w-20 dark:text-textLight text-text"
            :class="{ hidden: isClose, block: !isClose }"
          >
            <span class="mx-2">{{ user?.Employee?.name }}</span>
          </div>
        </div>
      </div>

      <!-- main links -->
      <nav class="flex pt-3 flex-col">
        <ul class="relative overflow-hidden">
          <li
            v-for="link in filteredLinks"
            :key="link.routerName"
            class="overflow-hidden flex items-center"
          >
            <router-link
              :to="{ name: link.routerName }"
              @click.prevent="tab = link.tab"
              @mouseover="tab = link.tab"
            >
              <button
                class="bg-[#FEFEFE] shadow-md text-[#23A559] hover:text-[#FEFEFE] hover:bg-[#23A559] duration-500 btn-outline hover:rounded-2xl p-4 rounded-full border-none border-2 m-1"
                :title="link.title"
                v-if="link?.mdi"
              >
                <Icon :icon="link.mdi" class="text-[24px]" />
              </button>
              <button
                v-else
                class="bg-[#FEFEFE] shadow-md text-[#23A559] hover:text-[#FEFEFE] hover:bg-[#23A559] duration-500 btn-outline hover:rounded-2xl p-4 rounded-full border-none border-2 m-1"
                :title="link.title"
                v-html="link.icon"
              />
            </router-link>

            <div
              v-if="
                tab === link.tab &&
                checkPermission(link.permissions?.[0] ?? 'public')
              "
              class="cursor-pointer duration-800 fadeOut 2s ease-in-out rounded-md m-2 border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400"
              :class="{ 'flex ': !isClose, hidden: isClose }"
            >
              {{ link.description }}
            </div>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Mobile drawer (overlay + slide-in) -->
    <transition name="fade">
      <div
        v-show="showMobileMenu"
        class="lg:hidden fixed inset-0 z-[1000]"
        @click.self="closeMobileMenu"
      >
        <!-- overlay -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="showMobileMenu = false"
        ></div>
        <!-- drawer -->
        <transition name="slide-left">
          <aside
            id="mobile-drawer"
            v-show="showMobileMenu"
            class="absolute top-0 ltr:left-0 rtl:right-0 h-full w-72 bg-sideNav dark:bg-[#25293c] shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center gap-2">
                <img
                  src="@/assets/ihec-logo.jpg"
                  class="w-10 h-10 rounded-full"
                  alt="Logo"
                />
                <span
                  class="text-text dark:text-textLight font-medium truncate max-w-[9rem]"
                >
                  {{ user?.Employee?.name }}
                </span>
              </div>
              <button
                @click="closeMobileMenu"
                class="p-2 rounded-lg"
                aria-label="Close menu"
              >
                <Icon icon="mdi:close" class="text-xl" />
              </button>
            </div>

            <nav class="px-2 pb-6">
              <ul>
                <li
                  v-for="link in filteredLinks"
                  :key="link.routerName"
                  class="flex items-center"
                >
                  <router-link
                    :to="{ name: link.routerName }"
                    class="flex items-center gap-3 w-full p-3 my-1 rounded-lg bg-[#FEFEFE] text-[#23A559] hover:bg-[#23A559] hover:text-white shadow"
                    :title="link.title"
                    @click="tab = link.tab"
                  >
                    <Icon
                      v-if="link?.mdi"
                      :icon="link.mdi"
                      class="text-[20px]"
                    />
                    <span v-else v-html="link.icon" class="text-[20px]"></span>
                    <span class="flex-1 text-sm text-left">{{
                      link.title
                    }}</span>
                  </router-link>
                </li>
              </ul>

              <!-- optional: show description when allowed -->
              <!-- optional: show description when allowed -->
              <template
                v-for="link in filteredLinks"
                :key="link.routerName + '-desc-mobile'"
              >
                <div
                  v-if="
                    tab === link.tab &&
                    checkPermission(link.permissions?.[0] ?? 'public')
                  "
                  class="mt-2 mx-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{ link.description }}
                </div>
              </template>
            </nav>
          </aside>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.form-control:focus {
  box-shadow: none;
}

/* nested groups (kept from your original) */
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

/* tabs (kept) */
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

/* overlay fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* drawer slide (LTR/RTL aware) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.25s ease;
}

/* If your app adds .ltr/.rtl on <html> or a wrapper, these work as-is. Otherwise swap to your RTL root class. */
.ltr .slide-left-enter-from,
.ltr .slide-left-leave-to {
  transform: translateX(-100%);
}

.rtl .slide-left-enter-from,
.rtl .slide-left-leave-to {
  transform: translateX(100%);
}
</style>
