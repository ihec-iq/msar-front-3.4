import { defineAsyncComponent } from "vue";

const IButton = defineAsyncComponent(
  () => import("@/components/ihec/IButton.vue")
);
const ICol = defineAsyncComponent(() => import("@/components/ihec/ICol.vue"));

export default {
  install: (app: any) => {
    app.component("IButton", IButton);
    app.component("ICol", ICol);
  },
};
