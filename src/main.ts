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
const app = createApp(App);
app.component("vSelect", vSelect);
app.component("QuillEditor");
app.use(createPinia());
app.use(MotionPlugin);
app.use(router);

//#region Permission
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
const { getUser } = useAuthStore();
const { setPermissions, can } = usePermissionStore();

//#region Permission Globally
let defaultPermissions: Array<string> =['']
setPermissions(defaultPermissions.concat(getUser().permissions));
// console.log(can("admin"));
//#endregion
//#endregion
app.mount("#app");
