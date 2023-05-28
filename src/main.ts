import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/vue-select.css";
import vSelect from "vue-select";
import "nprogress/nprogress.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { MotionPlugin } from "@vueuse/motion";

const app = createApp(App);
app.component("vSelect", vSelect);
app.component("QuillEditor");
app.use(createPinia());
app.use(MotionPlugin);
app.use(router);
// app.use(i18n);
//#region Permission
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
import type IPermission from "./types/role/IPermission";
const { getUser } = useAuthStore();
const { setPermissions } = usePermissionStore();
app.config.globalProperties.$baseURL =
  process.env.NODE_ENV === "production" ? "/10/" : "/";
//#region Permission Globally
const defaultPermissions: Array<IPermission> = [];
setPermissions(defaultPermissions.concat(getUser().Permissions));
// console.log(can("admin"));
//#endregion
//#endregion
app.mount("#app");
