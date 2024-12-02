import axios from "axios";
import Swal from "sweetalert2";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";
import envConfig from "./envConfig";
 import { useToast, POSITION } from "vue-toastification";

const Api = axios.create({
  //baseURL: "http://10.9.8.7/workflow_ihec/public/api",
  // baseURL: "http://10.10.10.10/workflow_ihec/public/api",
  baseURL: envConfig._baseURL,
});
Api.defaults.withCredentials = true;
Api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Api.defaults.headers.common["Access-Control-Allow-Methods"] =
  "DELETE, POST, GET, PUT";
Api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
Api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;
Api.interceptors.response.use(
  (response) => response,
  (error) => {

    error.handleGlobally = errorComposer(error);
    return Promise.reject(error);
  }
);
// errorComposer will compose a handleGlobally function
const errorComposer = (error: any) => {
  const statusCode = error.response ? error.response.status : null;
  // request not Found
  if (statusCode === 404) {
    console.log("The requested resource does not exist or has been deleted");
    router.back();
  }
  // request unAuthorize
  if (statusCode === 401) {
    ErrorToast("Your session has expired. Would you like to be redirected to the login page.");
    useAuthStore().logout();
    router.push("/login");
  }
  // ERR_NETWORK == server not work
  else if (error.code == "ERR_NETWORK") {

    ErrorToast("الاتصال بالسيرفر غير متوفر , الرجاء التواصل مع الدعم الفني");
    useAuthStore().logout();
    router.push("/login");
  } else if (error.code == "ERR_CONNECTION_REFUSED") {
    useAuthStore().logout();
    router.push("/login");
  }
};
const toast = useToast();
function ErrorToast(message: String = "") {
  toast.error(message, {
    position: POSITION.TOP_CENTER,
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });
}

export default Api;
