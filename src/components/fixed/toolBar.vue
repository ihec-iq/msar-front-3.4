<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "@/stores/i18n/useI18n";
import router from "@/router";
import { useRoute } from "vue-router";
import type IUser from "@/types/core/IUser";
const { t, setLocale, Languages } = useI18n();
const rtlStore = useRtlStore();
const { isRtl } = storeToRefs(rtlStore);
const { ChangeDirection } = useRtlStore();
const route = useRoute();
import { useConfigStore } from "@/stores/config";
const { Organization } = storeToRefs(useConfigStore());
const colorMode = useColorMode({
  modes: {
    red: "red",
    green: "green",
    yellow: "yellow",
    blue: "blue",
    amber: "amber",
  },
});

//#region Pops
const showPop = ref(false);
const showPopup = () => {
  showPop.value = true;
};
const closePopup = () => {
  showPop.value = false;
};
//#endregion
//#region Theme Setting
let isDark = useDark();
let themeDark = ref(false);
const loadRtl = ref(localStorage.getItem("isLtr"));
const toggleDark = useToggle(isDark);
const changeDark = () => {
  themeDark.value = !themeDark.value;
  toggleDark(themeDark.value);
};
// const user = ref<IUser>({
//   name: "Loading ...",
//   email: "",
//   last_login: "",
//   password: "",
//   any_device: 0,
//   active: 0,
//   roles: [],
//   permissions: [],
//   id: 0,
//   value: undefined,
//   user: undefined,
// });
const { user } = storeToRefs(useAuthStore());
const change = () => {
  ChangeDirection();
};

//#endregion
//#region Search
const searchInput = ref(false);
document.onkeydown = function (e) {
  if (
    (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
    (e.key === "K" && (e.ctrlKey || e.metaKey))
  ) {
    e.preventDefault(); // present "Save Page" from getting triggered.
    searchInput.value = true;
    document.getElementById("inputValue")?.focus();
  }
};
const valSearch = ref("");
const Search = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    // Enter key is pressed
    // Perform your desired action here
    console.log("Enter key is pressed");
    console.log(valSearch.value);
    if (route.name == "archiveIndex") {
      router.push({ params: { search: valSearch.value } });
    } else {
      router.push({
        name: "archiveIndex",
        params: { search: valSearch.value },
      });
    }
  }
};

// watch((valSearch)=>(old,new)=>{
const inputRefSearch = ref<HTMLInputElement | null>(null);

//#endregion

onMounted(async () => {
  themeDark.value = isDark.value;
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
  //user.value = await useAuthStore().getUser();
});
</script>
<template>
  <div
    class="print:hidden flex text-white bg-bgLeftNavLight dark:bg-[#22262A] shadow-md h-12 xs:mt-2 lg:mt-0 rounded-md bg-navLight sm:max-w-fit md:max-w-full xs:w-[97%] box-border ltr:ml-2 rtl:mr-2"
  >
    <div
      class="flex-1 flex items-center justify-between dark:border-b dark:border-gray-900 sm:px-1 px-4 xs:w-full"
    >
      <div class="flex items-center">
        <div class="text-gray-500 text-2xl">#</div>
        <div class="ml-2 text-sm text-text dark:text-textLight">
          <!-- {{ t("General") }} -->
          {{ Organization }} - {{ user?.Employee?.name }}
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
      <div
        class="relative w-56 duration-500 ease-in-out"
        :class="{ 'lg:w-[700px] xs:w-56': searchInput }"
      >
        <input
          type="text"
          id="inputValue"
          v-model="valSearch"
          ref="inputRefSearch"
          :placeholder="t('Search')"
          @focus="searchInput = true"
          @blur="searchInput = false"
          class="rounded w-full border-[1px] dark:border-[#505051] dark:hover:border-[#686869] dark:bg-[#3C3C3D] dark:hover:bg-[#424243] bg-LightTableHead text-gray-200 px-2 py-1 duration-300"
          :class="{
            'lg:py-2 xs:py-1 placeholder:text-sm text-lg': searchInput,
          }"
        />
        <span
          class="absolute ltr:right-0 rtl:left-0 mr-1 top-1.5"
          :class="{ 'top-[14px]': searchInput }"
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
      </div>
      <div class="flex items-center">
        <button
          is-link
          @click="showPopup"
          class="dark:text-textGray z-50 mx-2 dark:hover:text-iconHover dark:bg-sideNavSetting bg-transparent hover:bg-transparent text-iconLight hover:text-iconHoverLight inline-flex justify-center rounded-md smooth-hover"
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
    class="bg-customer h-screen z-[999999] lg:w-[30%] md:w-full xs:w-full dark:bg-content flex"
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
        <div class="flex items-center justify-around mx-6 w-full">
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
        <div class="flex items-center justify-around mx-6 w-full">
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
        <div class="flex items-center justify-around mx-6 w-full">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Language") }}
          </div>
          <div class="flex items-center">
            <div
              class="dropdown dropdown-bottom ltr:ml-5 rtl:mr-3 border-2 rounded border-[#3ABFF8] p-2"
            >
              <button href="#" class="items-center flex" tabindex="0">
                Languages
                <ul
                  tabindex="0"
                  class="dropdown-content ltr:right-0 rtl:left-0 menu p-2 shadow bg-settingLight dark:bg-setting text-text dark:text-textLight rounded-box mt-5"
                >
                  <li v-for="language in Languages" :key="language.code">
                    <button
                      @click="setLocale(language)"
                      class="flex justify-between"
                    >
                      {{ language.name }}
                    </button>
                  </li>
                </ul>
              </button>
            </div>
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
        <div
          @click="
            $router.push('/config');
            closePopup();
          "
          class="flex-auto sm:w-[95%] md:w-2/4 bg-amber-900 text-textLight mx-4 p-2 text-xl rounded-lg cursor-pointer"
        >
          {{ t("Setting") }}
        </div>
        <div
          @click="closePopup()"
          class="flex-auto sm:w-[95%] md:w-2/4 bg-back text-textLight mx-4 p-2 text-xl rounded-lg cursor-pointer"
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
    </div>
  </van-popup>
</template>

<!--  /* it's better to use a dark grey color instead of pure black */ -->
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
