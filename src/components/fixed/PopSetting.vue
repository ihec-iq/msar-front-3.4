<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";

import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { t, setLocale, Languages, currentLocale } from "@/utilities/I18nPlugin";
import { useRtlStore } from "@/stores/i18n/rtlPi";
const rtlStore = useRtlStore();
const { isRtl } = storeToRefs(rtlStore);
let isDark = useDark();
const toggleDark = useToggle(isDark);
const changeDark = () => {
  isDark.value = !isDark.value;
  toggleDark(isDark.value);
};
const { ChangeDirection } = useRtlStore();
const change = () => {
  ChangeDirection();
};

import { useAuthStore } from "@/stores/authStore";
import IButton2 from "../ihec/IButton2.vue";
import { Icon } from "@iconify/vue";
const AuthStore = useAuthStore();
const { isAuthenticated } = storeToRefs(useAuthStore());
const logout = () => {
  AuthStore.logout();
};

const showPop = ref(false);
const closePopup = () => {
  showPop.value = false;
};
const showPopup = () => {
  showPop.value = true;
};
const colorMode = useColorMode({
  modes: {
    red: "red",
    green: "green",
    yellow: "yellow",
    blue: "blue",
    amber: "amber",
  },
});
</script>
<template>
  <div class="flex items-center">
    <!-- Old Settings -->
    <button is-link @click="showPopup"
      class="dark:text-textGray z-50 mx-2 dark:hover:text-iconHover dark:bg-sideNavSetting bg-transparent hover:bg-transparent text-iconLight hover:text-iconHoverLight inline-flex justify-center rounded-md smooth-hover">
      <Icon icon="mdi-cog-outline" class="text-[25px]"></Icon>
    </button>
  </div>
  <van-popup class="bg-customer h-screen z-[999999] lg:w-[30%] md:w-full xs:w-full dark:bg-content flex overflow-hidden"
    v-model:show="showPop" round>
    <div class="dark:text-textLight w-full">
      <div class="text-2xl text-center text-text dark:text-textLight p-2 font-bold mt-6">
        {{ t("Setting.Name") }}
      </div>
      <div v-motion :initial="{ opacity: 0, y: -15 }" :enter="{ opacity: 1, y: 0 }" :variants="{ custom: { scale: 2 } }"
        :delay="200">
        <div class="flex items-center justify-around mx-6 w-full">
          <div class="text-text dark:text-textLight  font-bold text-lg">
            {{ t("Change Theme") }} {{ isDark ? "مظلم" : "فاتح" }}
          </div>
          <div class="switch4">
            <label class="switch">
              <input type="checkbox" @input="changeDark()" v-model="isDark" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-around mx-6 w-full">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Direction") }}
          </div>
          <div class="flex items-center">
            <div class="dark:text-white mb-6 text-black mt-6 ml-3 rtl:ml-3 ltr:mr-3">
              {{ isRtl ? "RTL" : "LTR" }}
            </div>
            <input type="checkbox" @click="change()" v-model="isRtl" class="toggle toggle-info" />
          </div>
        </div>
        <div class="flex items-center justify-around mx-6 w-full">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Language") }}
          </div>
          <div class="flex items-center">
            <div class="dropdown dropdown-bottom ltr:ml-5 rtl:mr-3 border-2 rounded border-[#3ABFF8] p-2">
              <button href="#" class="items-center flex" tabindex="0">
                <span class="text-text dark:text-textLight flex items-center">
                  <Icon icon="mdi-web"></Icon>{{ currentLocale.name }}
                </span>

                <ul tabindex="0"
                  class="dropdown-content ltr:right-0 rtl:left-0 menu p-2 shadow bg-settingLight dark:bg-setting text-text dark:text-textLight rounded-box mt-5">
                  <li v-for="language in Languages" :key="language.code">
                    <button @click="setLocale(language)" class="flex justify-between">
                      {{ language.name }}
                    </button>
                  </li>
                </ul>
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-around mx-6 w-full mt-5" v-if="isAuthenticated">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Logout") }}
          </div>
          <div class="flex items-center">
            <IButton2 type="outlined" pre-icon="logout" color="red" :text="t('Logout')" :on-click="logout" width="32" />
          </div>
        </div>
        <!-- <div class="mt-10 flex item-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Color") }}
          </div>
          <div class="w-1/2">
            <div class="flex justify-between w-full mb-2">
              <div class="w-1/3">
                <div
                  class="w-10 h-10 cursor-pointer rounded-lg border-none bg-red-500"
                  @click="colorMode = 'red'"
                ></div>
              </div>
              <div class="w-1/3">
                <div
                  class="w-10 h-10 cursor-pointer rounded-lg border-none bg-green-500"
                  @click="colorMode = 'green'"
                ></div>
              </div>
              <div class="w-1/3">
                <div
                  class="w-10 h-10 cursor-pointer rounded-lg border-none bg-yellow-500"
                  @click="colorMode = 'yellow'"
                ></div>
              </div>
            </div>
            <div class="flex justify-between w-full">
              <div class="w-1/3">
                <div
                  class="w-10 h-10 cursor-pointer rounded-lg border-none bg-blue-500"
                  @click="colorMode = 'blue'"
                ></div>
              </div>
              <div class="w-1/3">
                <div
                  class="w-10 h-10 cursor-pointer rounded-lg border-none bg-amber-900"
                  @click="colorMode = 'amber'"
                ></div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="flex absolute bottom-14 w-full">
        <div @click="
          $router.push('/config');
        closePopup();
        "
          class="flex-auto sm:w-[95%] md:w-2/4 bg-amber-900 text-textLight mx-4 p-2 text-xl rounded-lg cursor-pointer">
          {{ t("Setting.Name") }}
        </div>
        <div @click="closePopup()"
          class="flex-auto sm:w-[95%] md:w-2/4 bg-back text-textLight mx-4 p-2 text-xl rounded-lg cursor-pointer"
          :class="{
            'bg-red-500': colorMode == 'red',
            'bg-green-500': colorMode == 'green',
            'bg-blue-500': colorMode == 'blue',
            'bg-yellow-500': colorMode == 'yellow',
            'bg-amber-900': colorMode == 'amber',
          }">
          {{ t("Close") }}
        </div>
      </div>
    </div>
  </van-popup>
</template>
<style scoped>
:is.red {
  background: rgb(239 68 68);
  color: green;
}

.green {
  background: rgb(34 197 94);
}

.yellow {
  background: rgb(234 179 8);
}

.blue {
  background: rgb(59 130 246);
}

.amber {
  background: #78350f;
}

.rtl {
  direction: rtl;
}

.checkbox {
  opacity: 0;
  position: absolute;
}

.dark .label {
  width: 40px;
  height: 16px;
  background-color: #111;
  display: flex;
  border-radius: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  transform: scale(1.5);
}

.label {
  width: 40px;
  height: 16px;
  background-color: #fff;
  display: flex;
  border-radius: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  transform: scale(1.5);
}

.dark .ball {
  width: 13px;
  height: 13px;
  background-color: #fff;
  position: absolute;
  top: 1.4px;
  left: 0px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}

.ball {
  width: 13px;
  height: 13px;
  background-color: #141c2a;
  position: absolute;
  top: 1.4px;
  left: 5px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}

/*  target the elemenent after the label*/
.checkbox:checked+.label .ball {
  transform: translateX(24px);
}

.switch4,
.switch input {
  width: min-content;
  padding: 5px;
  /*flex*/
  display: flex;
  justify-content: center;
  align-items: center;
  /* Position */
  position: relative;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

.switch input {
  display: none;
}

.slider {
  width: 55px;
  height: 30px;
  background-color: white;
  display: block;
  border-radius: 50px;
  position: relative;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  cursor: pointer;
}

.slider::before {
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 50px;
  display: block;
  position: absolute;
  top: 4px;
  left: 2px;
  transition:
    transform 0.8s,
    background-color 1s;
}

input:checked+.slider {
  background-color: black;
}

input:checked+.slider::before {
  transform: translateX(calc(60px - 24px - 8px));
}

.switch3 input:checked+.slider::before {
  transform: translateX(calc(70px - 24px));
}

.switch4 .slider::before {
  content: "☼";
  color: rgb(255, 221, 0);
  background: black;
}

.switch4 input:checked+.slider::before {
  content: "☾";
  color: pink;
  font: 900;
  text-align: center;
  background: white;
}

.fa-moon {
  color: pink;
}

.fa-sun {
  color: yellow;
}
</style>
