<template>
  <Menu as="div" class="relative inline-block rtl:text-right ltr:text-left">
    <div>
      <MenuButton
        class="dark:text-gray-200 inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900"
      >
        <svg
          class="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute rtl:left-0 ltr:right-0 z-10 mt-2 w-56 ltr:origin-top-right rtl:origin-top-left divide-y dark:divide-gray-600 divide-gray-100 rounded-md dark:bg-slate-700 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              @click="changeDark"
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 dark:bg-slate-600 dark:text-white text-gray-900'
                  : 'text-gray-700 dark:text-white',
                'block px-4 py-2 text-sm',
              ]"
              >{{ t("Change Theme") }}</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="changeLanguage"
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 dark:bg-slate-600 dark:text-white text-gray-900'
                  : 'text-gray-700 dark:text-white',
                'block px-4 py-2 text-sm',
              ]"
              >{{ t("Change Language") }}</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="changeDir"
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 dark:bg-slate-600 dark:text-white text-gray-900'
                  : 'text-gray-700 dark:text-white',
                'block px-4 py-2 text-sm',
              ]"
              >{{ t("Change Direction") }}</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="$router.push('/config')"
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 dark:bg-slate-600 dark:text-white text-gray-900'
                  : 'text-gray-700 dark:text-white',
                'block px-4 py-2 text-sm',
              ]"
              >{{ t("Settings") }}</a
            >
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              @click="logout"
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 dark:bg-slate-600 text-red-500'
                  : 'text-red-500 ',
                'block px-4 py-2 text-sm',
              ]"
              >{{ t("Log Out") }}</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { t, setLocale, Languages, currentLocale } from "@/utils/I18nPlugin";
import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { ref } from "vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
const { ChangeDirection } = useRtlStore();
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};

const changeDir = () => {
  ChangeDirection();
};

const changeLanguage = () => {
  var lang = Languages.find((x) => x.code !== currentLocale.value.code);
  setLocale(lang);
};

//#region Dark Mode
let isDark = useDark();
let themeDark = ref(false);
const toggleDark = useToggle(isDark);
const changeDark = () => {
  themeDark.value = !themeDark.value;
  toggleDark(themeDark.value);
};
//#endregion
</script>
