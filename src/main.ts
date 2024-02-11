import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/vue-select.css";
import "./assets/print.css";
import vSelect from "vue-select";
import "nprogress/nprogress.css";

import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { MotionPlugin } from "@vueuse/motion";
import { QuillEditor } from "@vueup/vue-quill";
const globalOptions = {
  modules: {
    toolbar: [
      "bold",
      "italic",
      "underline",
      { align: "right" },
      { direction: "rtl" },
      "blockquote",
      "code-block",
      { list: "ordered" },
      { list: "bullet" },
    ],
  },
  placeholder: "قم بملئ الملاحظات",
  readOnly: false,
};
// set default globalOptions prop
QuillEditor.props.globalOptions.default = () => globalOptions;
// register QuillEditor component

//import preset

const app = createApp(App);
app.component("vSelect", vSelect);
app.component("QuillEditor", QuillEditor);

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
//#region Permission

// app.config.globalProperties.$baseURL =
//   process.env.NODE_ENV === "production" ? "/10/" : "/";
//#region Permission Globally

// console.log(can("admin"));
//#endregion
//#endregion
app.mount("#app");
