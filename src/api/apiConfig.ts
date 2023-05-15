import axios from "axios";
import Swal from "sweetalert2";
const Api = axios.create({
  baseURL: "http://localhost/workflow_ihec/public/api",
  // baseURL: "http://192.168.0.120/AccountXApi-flowUp/public/api",
});
Api.defaults.withCredentials = true;
Api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Api.defaults.headers.common["Access-Control-Allow-Methods"] =
  "DELETE, POST, GET, PUT";
Api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
Api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

// errorComposer will compose a handleGlobally function
const errorComposer = (error: any) => {
  const statusCode = error.response ? error.response.status : null;
  // request not Found
  if (statusCode === 404) {
    console.log("The requested resource does not exist or has been deleted");
  }
  // request unAuthorize
  if (statusCode === 401) {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title:
        "Your session has expired. Would you like to be redirected to the login page.",
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      window.location.href = "/login";
    });
  }
  // ERR_NETWORK == server not work
  else if (error.code == "ERR_NETWORK") {
    window.location.href = "/login";
  } else if (error.code == "ERR_CONNECTION_REFUSED") {
    window.location.href = "/login";
  }
};

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.handleGlobally = errorComposer(error);

    return Promise.reject(error);
  }
);
export default Api;
