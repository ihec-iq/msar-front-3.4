// Import necessary modules and dependencies
import axios from "axios";
import Swal from "sweetalert2";
import router from "@/router";
import envConfig from "./envConfig";
import { useToast, POSITION } from "vue-toastification";
import { useAuthStore, getSecureToken } from "@/stores/authStore";

// Initialize Axios instance
const Api = axios.create({
  baseURL: envConfig._baseURL,
});

// Set default Axios configurations
Api.defaults.withCredentials = true;
Api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Api.defaults.headers.common["Access-Control-Allow-Methods"] = "DELETE, POST, GET, PUT";
Api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Attach authorization token lazily
// Api.interceptors.request.use((config) => {
//   const token = getSecureToken(); // Get the token when needed
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// Axios response interceptor for error handling
Api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    error.handleGlobally = composeErrorHandler(error);
    return Promise.reject(error);
  }
);

// Compose a global error handler function
const composeErrorHandler = (error : any) => {
  const statusCode = error.response ? error.response.status : null;
  const authStore = useAuthStore();

  switch (statusCode) {
    case 404:
      console.error("The requested resource does not exist or has been deleted.");
      router.back();
      break;

    case 401:
      showErrorToast("Your session has expired. Redirecting to the login page.");
      authStore.logout();
      router.push("/login");
      break;

    default:
      handleNetworkErrors(error);
      break;
  }
};

// Handle specific network-related errors
const handleNetworkErrors = (error : any) => {
  const authStore = useAuthStore();

  switch (error.code) {
    case "ERR_NETWORK":
      showErrorToast("Server connection is unavailable. Please contact technical support.");
      authStore.logout();
      router.push("/login");
      break;

    case "ERR_CONNECTION_REFUSED":
      showErrorToast("Connection refused by the server. Redirecting to login.");
      authStore.logout();
      router.push("/login");
      break;

    default:
      console.error("An unexpected error occurred:", error);
      break;
  }
};

// Utility function to show error toasts
const toast = useToast();
const showErrorToast = (message = "") => {
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
};

export default Api;
