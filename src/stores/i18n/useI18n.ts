import { ref, provide } from "vue";
import { createI18n } from "vue-i18n";

import en from "@/locales/en";
import ar from "@/locales/ar";

// Define the available locales and their translations
const messages = {
  en,
  ar,
};

// Create the i18n instance
const i18n = createI18n({
  locale: "ar",
  fallbackLocale: "ar",
  messages,
  //   legacy: true,
  //   globalInjection: true,
  //   global: true,
});

// Define the composition function
export function useI18n() {
  const currentLocale = ref("");

  // Retrieve the locale from localStorage, or use the default locale
  const savedLocale = localStorage.getItem("locale");
  if (savedLocale == null || savedLocale == undefined) {
    currentLocale.value = "ar";
  } else currentLocale.value = savedLocale;
  i18n.global.locale = currentLocale.value;
  // Set the locale and store it in localStorage
  function setLocale(locale: string) {
    currentLocale.value = locale;
    localStorage.setItem("locale", locale);
    i18n.global.locale = currentLocale.value;
  }

  provide("i18n", i18n);
  provide("currentLocale", currentLocale);

  return { setLocale, t: i18n.global.t, currentLocale };
}

export const i18nInstance = i18n;
