import { ref, provide } from "vue";
import { createI18n } from "vue-i18n";
//import fs from "fs";

import en from "@/locales/en";
import ar from "@/locales/ar";
//import axios from "axios";

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
  const currentLocale = ref<ILanguage>({
    name: "عربي",
    code: "ar",
    flag: "iq",
  });
  const Languages: ILanguage[] = [
    { name: "عربي", code: "ar", flag: "iq" },
    { name: "English", code: "en", flag: "uk" },
  ];
  // Retrieve the locale from localStorage, or use the default locale
  const stringLocale = localStorage.getItem("locale")?.toString() || "{}";
  const savedLocale: ILanguage = JSON.parse(stringLocale);
  if (
    stringLocale != null &&
    stringLocale != undefined &&
    stringLocale != "{}"
  ) {
    currentLocale.value = savedLocale;
    setLocale(currentLocale.value);
  }

  //#region "Test Read Files from Locale"
  // function getAllFilesInFolder(folderPath: string): string[] {
  //   // Read the contents of the folder
  //   const files = fs.readdirSync(folderPath);

  //   // Filter out non-files (directories, subfolders, etc.)
  //   const filteredFiles = files.filter((file) => {
  //     const filePath = `${folderPath}/${file}`;
  //     return fs.statSync(filePath).isFile();
  //   });

  //   return filteredFiles;
  // }
  //console.log(getAllFilesInFolder("/src/locales"));
  // axios
  //   .get<Record<string, string>>(`/src/locales/ar.ts`)
  //   .then((r) => {
  //     console.log(r.data as Record<string, string>);
  //   })
  //   .catch(() => {
  //     console.log("fail to load ar.ts");
  //   });
  //#endregion
  i18n.global.locale = currentLocale.value.code as "ar" | "en";
  // Set the locale and store it in localStorage
  function setLocale(locale: ILanguage) {
    currentLocale.value = locale;
    localStorage.setItem("locale", JSON.stringify(locale));
    i18n.global.locale = currentLocale.value.code as "ar" | "en";
    const htmlEl = document.querySelector("html");
    htmlEl?.setAttribute("lang", currentLocale.value.code);
  }
  provide("i18n", i18n);
  provide("currentLocale", currentLocale);

  return { setLocale, t: i18n.global.t, currentLocale, Languages };
}

export const i18nInstance = i18n;

export interface ILanguage {
  name: string;
  code: string;
  flag: string;
}
