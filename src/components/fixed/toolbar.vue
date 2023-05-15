<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
const rtlStore = useRtlStore();
const { isRtl } = storeToRefs(rtlStore);
const { ChangeDirection } = useRtlStore();
const colorMode = useColorMode({
  modes: {
    red: "red",
    green: "green",
    yellow: "yellow",
    blue: "blue",
    amber: "amber",
  },
});
const change = () => {
  ChangeDirection();
};
const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
const chgLang = (lang: "en" | "ar") => {
  let htmlEl = document.querySelector("html");
  if (st.info.lang === "en") {
    htmlEl?.setAttribute("lang", "en");
    localStorage.setItem("lang", "en");
  } else if (st.info.lang === "ar") {
    htmlEl?.setAttribute("lang", "ar");
    localStorage.setItem("lang", "ar");
  }
  i18nRepository.setLanguage(lang);
};
const showPop = ref(false);
const showPopup = () => {
  showPop.value = true;
};
const closePopup = () => {
  showPop.value = false;
};
let isDark = useDark();
let themeDark = ref(false);
const loadRtl = ref(localStorage.getItem("isLtr"));
const toggleDark = useToggle(isDark);
const changeDark = () => {
  themeDark.value = !themeDark.value;
  toggleDark(themeDark.value);
};
onMounted(() => {
  themeDark.value = isDark.value;
});
</script>
<template>
  <div
    class="print:hidden flex text-white bg-sideNavLight dark:bg-toolBar h-12 xs:mt-2 lg:mt-0 rounded-md bg-navLight sm:max-w-fit md:max-w-full box-border ltr:ml-1 rtl:mr-1"
  >
    <div
      class="flex-1 flex items-center justify-between dark:border-b dark:border-gray-900 sm:px-1 px-4"
    >
      <div class="flex items-center flex-grow">
        <div class="text-gray-500 text-2xl">#</div>
        <div class="ml-2 text-sm text-text dark:text-textLight">
          {{ t("General") }}
        </div>
        <!-- <div
          class="border-l flex-grow xs:hidden sm:hidden lg:block pl-3 ml-3 border-gray-600 text-xs text-gray-400"
        >
          <van-notice-bar
            class="bg-transparent text-lg text-text dark:text-textLight"
            scrollable
            >رفعك <span class="text-red-700"> على البرانج الخاص فيك </span>ومن
            ثمه رفعه ع الستيجنك يقيك من ضياع البيانات واعاده<span
              class="text-red-500"
            >
              العمل مرة ثانيه
            </span></van-notice-bar
          >
        </div> -->
      </div>
      <div class="flex items-center">
        <!-- <div class="rtl:ml-4">
          <input
            @input="changeDark()"
            v-model="themeDark"
            type="checkbox"
            class="checkbox cursor-pointer"
            id="checkbox"
          />
          <label for="checkbox" class="label cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3 h-3 fa-moon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3 h-3 fa_sun text-yellow-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>

            <div class="ball" />
          </label>
        </div> -->
        <a href="#" class="ml-4">
          <form action="#" class="relative">
            <input
              type="text"
              :placeholder="t('Search')"
              class="rounded dark:bg-designTableHead bg-LightTableHead text-gray-200 text-xs px-2 py-1"
            />
            <span
              class="absolute ltr:right-0 rtl:left-0 top-0 mr-1"
              style="top: 6px"
            >
              <svg
                class="w-4 h-4 text-iconLight hover:text-iconHoverLight dark:text-icon dark:hover:text-iconHover"
                fill="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  class="heroicon-ui"
                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                ></path>
              </svg>
            </span>
          </form>
        </a>
        <button
          is-link
          @click="showPopup"
          class="dark:text-textGray z-50 mx-2 dark:hover:text-iconHover dark:bg-sideNavSetting bg-transparent hover:bg-transparent text-iconLight hover:text-iconHoverLight inline-flex justify-center rounded-md smooth-hover"
          href="#"
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
        </button>
      </div>
    </div>
  </div>
  <van-popup
    class="bg-customer xl:ltr:left-[1723px] rtl:left-[12.5rem] h-screen z-[999999] xl:w-[20%] xs:w-full xs:ltr:left-[195px] dark:bg-content flex"
    v-model:show="showPop"
    round
    ><div class="dark:text-textLight w-full">
      <div class="text-2xl text-center p-2 font-bold mt-6">
        {{ t("Setting") }}
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: -15 }"
        :enter="{ opacity: 1, y: 0 }"
        :variants="{ custom: { scale: 2 } }"
        :delay="200"
      >
        <div class="flex items-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Theme") }}
          </div>
          <div class="switch4">
            <label class="switch">
              <input
                type="checkbox"
                @input="changeDark()"
                v-model="themeDark"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Direction") }}
          </div>
          <div class="flex items-center">
            <!-- :class="{ 'rtl; bg-red-900 ': isLtr, 'bg-green-900': !isLtr }" -->
            <div
              class="dark:text-white mb-6 text-black mt-6 ml-3 rtl:ml-3 ltr:mr-3"
            >
              {{ isRtl ? "RTL" : "LTR" }}
            </div>
            <input
              type="checkbox"
              @click="change()"
              v-model="isRtl"
              class="toggle toggle-info"
            />
          </div>
        </div>
        <div class="flex items-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Language") }}
          </div>
          <div class="flex items-center">
            <div class="dropdown dropdown-bottom ltr:ml-5 rtl:mr-3">
              <button href="#" class="items-center flex" tabindex="0">
                <h2 v-if="st.info.lang === 'en'">En</h2>
                <svg
                  v-if="st.info.lang === 'en'"
                  width="42.67"
                  height="20"
                  viewBox="0 0 640 480"
                >
                  <path fill="#012169" d="M0 0h640v480H0z" />
                  <path
                    fill="#FFF"
                    d="m75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301L81 480H0v-60l239-178L0 64V0h75z"
                  />
                  <path
                    fill="#C8102E"
                    d="m424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
                  />
                  <path
                    fill="#FFF"
                    d="M241 0v480h160V0H241zM0 160v160h640V160H0z"
                  />
                  <path
                    fill="#C8102E"
                    d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"
                  />
                </svg>
                <h2 v-if="st.info.lang === 'ar'">Ar</h2>

                <svg
                  v-if="st.info.lang === 'ar'"
                  width="42.67"
                  height="20"
                  viewBox="0 0 640 480"
                >
                  <path fill="#fff" d="M0 160h640v160H0z" />
                  <path fill="#ce1126" d="M0 0h640v160H0z" />
                  <path d="M0 320h640v160H0z" />
                  <g
                    fill="#007a3d"
                    transform="translate(-179.3 -92.8) scale(1.75182)"
                  >
                    <path
                      d="M325.5 173.2a5 5 0 0 1-1.4-1c-.3-.5-.1-.5 1.2-.2c2.3.7 3.8.4 5.3-.8l1.3-1.1l1.5.7c.9.5 1.8.8 2 .7c.7-.2 2.1-2 2-2.6c0-.7.6-.5 1 .3c.6 1.6-.3 3.5-2 3.9c-.7.2-1.4.1-2.6-.3c-1.4-.5-1.7-.5-2.4 0a5.4 5.4 0 0 1-5.9.4zm5.8-5.3a8 8 0 0 1-1-4c.1-.6.3-.8.8-.6c1 .3 1.2 1 1 3c0 1.8-.3 2.3-.8 1.6zm-67.6-1.9c-.1 1.3 2.4 4.6 3.5 5.2c-.8.3-1.7.2-2.4.5c-4 4-18.4 18-21 21.4c7.8.2 16.4-.1 23.7-.4c0-5.3 5-5.6 8.4-7.5c1.7 2.7 6 2.5 6.6 6.6v17.6H216a9.7 9.7 0 0 1-12.3 7.5c2-2 5.4-2.8 6.6-5.7c1-6.4-2-10.3-4-14a24 24 0 0 0 7-3.6c-2.3 7 6.2 6.3 12.4 6.1c.2-2.4.1-5.2-1.7-5.6c2.3-.9 2.7-1.2 6.6-4.4v9.6l46.1-.1c0-3 .8-7.9-1.6-7.9c-2.2 0 0 6.2-1.8 6.2h-35.7v-6c1.5-1.6 1.3-1.5 11.6-11.8c1-1 8.3-7.6 14.6-13.7zm89.1-.3c2.5 1.4 4.5 3.2 7.5 4c-.3 1.3-1.5 1.8-1.8 3.1v27c3.4.7 4.2-1.3 5.8-2.3c.4 4.3 3.2 8.5 3 12h-14.5v-43.7zm-19.4 14.5s5.3-4.5 5.3-4.7V199h3.8l-.1-26.3c1.5-1.6 4.6-3.8 5.3-5.4v42h-33.4c-.5-8.7-.6-17.7 9.6-15.8V190c-.3-.6-.9.1-1-.7c1.6-1.6 2.1-2 6.5-5.8l.1 15.5h3.9v-18.8zm-12.6 18.6c.7 1 3.2 1 3-.8c-.3-1.5-3.5-1-3 .8z"
                    />
                    <circle cx="224" cy="214.4" r="2" />
                    <path
                      d="M287 165.8c2.5 1.3 4.5 3.2 7.6 4c-.4 1.2-1.5 1.7-1.8 3v27c3.4.7 4.1-1.2 5.7-2.3c.5 4.3 3.2 8.6 3.1 12H287v-43.7z"
                    />
                  </g>
                </svg>
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
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>

                <ul
                  tabindex="0"
                  class="dropdown-content ltr:right-0 rtl:left-0 menu p-2 shadow bg-settingLight dark:bg-setting text-text dark:text-textLight rounded-box mt-5"
                >
                  <li>
                    <button @click="chgLang('ar')" class="flex justify-between">
                      العربية
                      <svg width="42.67" height="20" viewBox="0 0 640 480">
                        <path fill="#fff" d="M0 160h640v160H0z" />
                        <path fill="#ce1126" d="M0 0h640v160H0z" />
                        <path d="M0 320h640v160H0z" />
                        <g
                          fill="#007a3d"
                          transform="translate(-179.3 -92.8) scale(1.75182)"
                        >
                          <path
                            d="M325.5 173.2a5 5 0 0 1-1.4-1c-.3-.5-.1-.5 1.2-.2c2.3.7 3.8.4 5.3-.8l1.3-1.1l1.5.7c.9.5 1.8.8 2 .7c.7-.2 2.1-2 2-2.6c0-.7.6-.5 1 .3c.6 1.6-.3 3.5-2 3.9c-.7.2-1.4.1-2.6-.3c-1.4-.5-1.7-.5-2.4 0a5.4 5.4 0 0 1-5.9.4zm5.8-5.3a8 8 0 0 1-1-4c.1-.6.3-.8.8-.6c1 .3 1.2 1 1 3c0 1.8-.3 2.3-.8 1.6zm-67.6-1.9c-.1 1.3 2.4 4.6 3.5 5.2c-.8.3-1.7.2-2.4.5c-4 4-18.4 18-21 21.4c7.8.2 16.4-.1 23.7-.4c0-5.3 5-5.6 8.4-7.5c1.7 2.7 6 2.5 6.6 6.6v17.6H216a9.7 9.7 0 0 1-12.3 7.5c2-2 5.4-2.8 6.6-5.7c1-6.4-2-10.3-4-14a24 24 0 0 0 7-3.6c-2.3 7 6.2 6.3 12.4 6.1c.2-2.4.1-5.2-1.7-5.6c2.3-.9 2.7-1.2 6.6-4.4v9.6l46.1-.1c0-3 .8-7.9-1.6-7.9c-2.2 0 0 6.2-1.8 6.2h-35.7v-6c1.5-1.6 1.3-1.5 11.6-11.8c1-1 8.3-7.6 14.6-13.7zm89.1-.3c2.5 1.4 4.5 3.2 7.5 4c-.3 1.3-1.5 1.8-1.8 3.1v27c3.4.7 4.2-1.3 5.8-2.3c.4 4.3 3.2 8.5 3 12h-14.5v-43.7zm-19.4 14.5s5.3-4.5 5.3-4.7V199h3.8l-.1-26.3c1.5-1.6 4.6-3.8 5.3-5.4v42h-33.4c-.5-8.7-.6-17.7 9.6-15.8V190c-.3-.6-.9.1-1-.7c1.6-1.6 2.1-2 6.5-5.8l.1 15.5h3.9v-18.8zm-12.6 18.6c.7 1 3.2 1 3-.8c-.3-1.5-3.5-1-3 .8z"
                          />
                          <circle cx="224" cy="214.4" r="2" />
                          <path
                            d="M287 165.8c2.5 1.3 4.5 3.2 7.6 4c-.4 1.2-1.5 1.7-1.8 3v27c3.4.7 4.1-1.2 5.7-2.3c.5 4.3 3.2 8.6 3.1 12H287v-43.7z"
                          />
                        </g>
                      </svg>
                    </button>
                  </li>
                  <li>
                    <button @click="chgLang('en')" class="flex justify-between">
                      English<svg
                        width="42.67"
                        height="20"
                        viewBox="0 0 640 480"
                      >
                        <path fill="#012169" d="M0 0h640v480H0z" />
                        <path
                          fill="#FFF"
                          d="m75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301L81 480H0v-60l239-178L0 64V0h75z"
                        />
                        <path
                          fill="#C8102E"
                          d="m424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
                        />
                        <path
                          fill="#FFF"
                          d="M241 0v480h160V0H241zM0 160v160h640V160H0z"
                        />
                        <path
                          fill="#C8102E"
                          d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </button>
            </div>
          </div>
        </div>
        <div class="mt-10 flex item-center justify-between mx-6">
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
        </div>
      </div>
      <div
        @click="closePopup()"
        class="bg-back w-[350px] text-textLight mx-4 p-2 text-xl rounded-lg absolute bottom-2 cursor-pointer"
        :class="{
          'bg-red-500': colorMode == 'red',
          'bg-green-500': colorMode == 'green',
          'bg-blue-500': colorMode == 'blue',
          'bg-yellow-500': colorMode == 'yellow',
          'bg-amber-900': colorMode == 'amber',
        }"
      >
        {{ t("Close") }}
      </div>
    </div>
  </van-popup>
</template>

<!-- /* it's better to use a dark grey color instead of pure black */ -->
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
.checkbox:checked + .label .ball {
  transform: translateX(24px);
}

.switch4,
.switch input {
  width: min-content;
  padding: 50px;
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
  transition: transform 0.8s, background-color 1s;
}
input:checked + .slider {
  background-color: black;
}
input:checked + .slider::before {
  transform: translateX(calc(60px - 24px - 8px));
}
.switch3 input:checked + .slider::before {
  transform: translateX(calc(70px - 24px));
}
.switch4 .slider::before {
  content: "☼";
  color: rgb(255, 221, 0);
  background: black;
}
.switch4 input:checked + .slider::before {
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
