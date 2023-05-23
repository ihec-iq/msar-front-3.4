import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/vue-select.css";
import vSelect from "vue-select";
import "nprogress/nprogress.css";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { MotionPlugin } from "@vueuse/motion";
import { createI18n } from "vue-i18n";

import en from "./locales/en";
import ar from "./locales/ar";

const i18n = createI18n({
  locale: "ar",
  fallbackLocale: "ar",
  messages: {
    en,
    ar,
  },
});

//import { i18n } from "@/utils/i18n";
const app = createApp(App);
app.component("vSelect", vSelect);
app.component("QuillEditor");
app.use(createPinia());
app.use(MotionPlugin);
app.use(router);
app.use(i18n);
//#region Permission
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
const { getUser } = useAuthStore();
const { setPermissions, can } = usePermissionStore();

//#region Permission Globally
const defaultPermissions: Array<string> = [""];
setPermissions(defaultPermissions.concat(getUser().permissions));
// console.log(can("admin"));
//#endregion
//#endregion
app.mount("#app");
