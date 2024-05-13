import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/vue-select.css";
import "./assets/print.css";
import { t } from "./utilities/I18nPlugin";
import vSelect from "vue-select";
import { MotionPlugin } from "@vueuse/motion";
import { Icon } from "@iconify/vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const app = createApp(App);
app.component("vSelect", vSelect);
app.component("MdiIcon", Icon);
app.use(createPinia());
app.use(MotionPlugin);
app.use(router);
app.use(Toast, {
  transition: "Vue-Toastification__fade",
});

app.directive("focus", {
  // When the bound element is mounted into the DOM...
  mounted(el) {
    // Focus the element
    el.focus();
  },
});
app.config.globalProperties.$trns = t;

//registerComponents(app);
app.mount("#app");
