import type { App } from 'vue';
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";

export default {
  install(app: App) {
    app.component('IInput', IInput);
    // Make EnumInputType globally available
    app.config.globalProperties.EnumInputType = EnumInputType;
  }
};
