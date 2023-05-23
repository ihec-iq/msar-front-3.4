import { createI18n } from "vue-i18n";
import en from "@/locales/en";
import ar from "@/locales/ar";

export const i18n = createI18n({
  fallbackWarn: false,
  locale: "ar",
  fallbackLocale: ["ar", "en"],
  messages: {
    en,
    ar,
  },
  // // Rename the $t method to t
  // legacy: true,
  // globalInjection: true,
  // global: true,
  // // Set the name for the translation method
  // // Change 't' to any other name you prefer
  // __l: "t",
});
