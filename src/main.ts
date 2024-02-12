import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/vue-select.css";
import "./assets/print.css";
import vSelect from "vue-select";
import { MotionPlugin } from "@vueuse/motion";

const app = createApp(App);
app.component("vSelect", vSelect);
app.use(createPinia());
app.use(MotionPlugin);
app.use(router);
app.directive("focus", {
  // When the bound element is mounted into the DOM...
  mounted(el) {
    // Focus the element
    el.focus();
  },
});

app.mount("#app");
