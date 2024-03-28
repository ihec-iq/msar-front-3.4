import { useToast, POSITION } from "vue-toastification";
import { t } from "@/utilities/I18nPlugin";
import { useRtlStore } from "@/stores/i18n/rtlPi";

const { isRtl } = useRtlStore();

const timeout: number = 2500;
const toast = useToast();

function SuccessToast(message: String = t("ToastMessages.Success")) {
  toast.success(message, {
    position: POSITION.TOP_CENTER,
    timeout: timeout,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: isRtl,
  });
}

function ErrorToast(message: String = t("ToastMessages.Error")) {
  toast.error(message, {
    position: POSITION.TOP_CENTER,
    timeout: timeout,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: isRtl,
  });
}

function WarningToast(message: String = t("ToastMessages.Warning")) {
  toast.warning(message, {
    position: POSITION.TOP_CENTER,
    timeout: timeout,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: isRtl,
  });
}

export { SuccessToast, ErrorToast, WarningToast };
