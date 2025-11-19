import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/index.css";
import "./assets/tailwind.css";
import "./assets/vue-select.css";
import "./assets/print.css";
import { t } from "./utilities/I18nPlugin";
import VueSelect from "vue-select";
import { MotionPlugin } from "@vueuse/motion";
import { Icon } from "@iconify/vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";

const app = createApp(App);
app.component("vSelect", VueSelect as any);
app.component("MdiIcon", Icon);
app.use(createPinia());
app.use(MotionPlugin);
app.use(router);
app.use(Toast, {
  transition: "Vue-Toastification__fade",
});

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
app.config.globalProperties.$trns = t;

app.mount("#app");
