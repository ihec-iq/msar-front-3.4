import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  fallbackWarn: false,
  locale: navigator?.language?.slice(0, 2) || "ar",
  fallbackLocale: ["en", "ar"],
  messages: {
    en,
    ar,
  },
});
