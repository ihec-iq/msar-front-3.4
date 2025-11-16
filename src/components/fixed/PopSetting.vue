<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { t, setLocale, Languages, currentLocale } from "@/utilities/I18nPlugin";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { useAuthStore } from "@/stores/authStore";
import IButton2 from "../ihec/IButton2.vue";
import { Icon } from "@iconify/vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

// --- Theme (Dark/Light) ---
const isDark = useDark(); // reactive dark mode ref bound to <html class="dark">
const toggleDark = useToggle(isDark);
const toggleTheme = () => toggleDark();

// --- RTL Direction ---
const rtlStore = useRtlStore();
const { isRtl } = storeToRefs(rtlStore);
const toggleDirection = () => {
  rtlStore.ChangeDirection(); // triggers your store logic (adds/removes rtl class)
};

// --- Auth ---
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const logout = () => authStore.logout();

// --- Popup state ---
const showPop = ref(false);
const openPopup = () => (showPop.value = true);
const closePopup = () => (showPop.value = false);

// --- Color mode (future use) ---
const colorMode = useColorMode({
  modes: { red: "red", green: "green", yellow: "yellow", blue: "blue", amber: "amber" },
});
// const innerWidth = ref(window.innerWidth);

// const onResize = () => {
//   innerWidth.value = window.innerWidth;
// };

// onMounted(() => window.addEventListener("resize", onResize));
// onUnmounted(() => window.removeEventListener("resize", onResize));
import ToggleDirectionSwitch from "./setting/ToggleDirectionSwitch.vue";
import LanguageSelect from "./setting/LanguageSelect.vue";

</script>

<template>
  <div class="flex items-center">
    <button @click="openPopup" class="mx-2 rounded-md text-iconLight hover:text-iconHoverLight dark:text-textGray dark:hover:text-iconHover
             bg-transparent transition duration-200" aria-label="Open settings">
      <Icon icon="mdi-cog-outline" class="text-[25px]" />
    </button>
  </div>
  <!-- Popup --> 
  <van-popup v-model:show="showPop" class="bg-customer dark:bg-content w-full sm:w-[80%] md:w-[50%] lg:w-[35%] xl:w-[30%]
           h-screen flex flex-col justify-between overflow-hidden z-[999999] rounded-t-xl" round lock-scroll>
      <!-- Header -->
      <div class="p-4 border-b border-gray-300 dark:border-gray-700 text-center">
        <h2 class="text-2xl font-bold text-text dark:text-textLight">
          {{ t("Setting.Name") }}
        </h2>
      </div> 
      <!-- Body -->
      <div class="flex-1 overflow-y-auto py-4 space-y-6 px-6 text-text dark:text-textLight">
        <!-- Theme -->
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">{{ t("Change Theme") }}</span>
          <label class="switch4 cursor-pointer">
            <input type="checkbox" :checked="isDark" @change="toggleTheme" />
            <span class="slider"></span>
          </label>
        </div>

        <!-- RTL / LTR --> xxx
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">{{ t("Change Direction") }}</span>
          <div class="flex items-center gap-4">
            <ToggleDirectionSwitch :checked="isRtl" size="md" rtlLabel="RTL" ltrLabel="LTR" @toggle="toggleDirection" />
          </div>
        </div>

        <!-- Language -->
        <div class="flex items-center justify-between">
          <span class="font-bold text-lg">{{ t('Change Language') }}</span>
          <LanguageSelect />
        </div>

        <!-- Logout -->
        <div v-if="isAuthenticated" class="flex justify-between items-center">
          <span class="font-bold text-lg">{{ t("Logout") }}</span>
          <IButton2 :variant="EnumButtonType.Outlined" pre-icon="logout" color="red" :text="t('Logout')"
            :on-click="logout" width="32" />
        </div>
      </div> 
      <!-- Footer -->
      <div class="flex justify-between gap-3 p-4 border-t border-gray-300 dark:border-gray-700">
        <button @click="
          $router.push('/config');
        closePopup();
        " class="flex-1 bg-amber-900 text-white py-2 rounded-lg text-lg font-semibold hover:opacity-90">
          {{ t('Setting.Name') }}
        </button>
        <button @click="closePopup"
          class="flex-1 bg-red-500 text-white py-2 rounded-lg text-lg font-semibold hover:opacity-90">
          {{ t('Close') }}
        </button>
      </div>  
  </van-popup>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

/* ---- THEME TOGGLE SWITCH ---- */
.switch4,
.switch4 input {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.switch4 input {
  display: none;
}

.slider {
  width: 55px;
  height: 30px;
  background-color: white;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s;
}

.slider::before {
  content: "☼";
  position: absolute;
  top: 4px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: yellow;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

input:checked+.slider {
  background-color: black;
}

input:checked+.slider::before {
  transform: translateX(24px);
  content: "☾";
  background: white;
  color: pink;
}
</style>
