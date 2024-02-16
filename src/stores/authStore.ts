import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utils/helpers";
import { usePermissionStore } from "./permissionStore";
import type { IUser } from "@/types/core/IUser";;
import { useRouter } from "vue-router";
export const useAuthStore = defineStore("useAuthStore", () => {
  const isAuthenticated = ref<boolean | any>(false);
  const token = ref<string | any>("");
  const user = ref<IUser>();
  const router = useRouter();
  const { setPermissions } = usePermissionStore();
  const login = async (payload: { email: string; password: string }) => {
    return await new Promise((resolve, reject) => {
      Api.post("/login", payload)
        .then((response) => {
          if (response.status == 200) {
            checkToken(response.data.token);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  async function get_profile() {
    await Api.get(`/profile`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data.data);
          setUser(response.data.data);
          return user;
        }
      })
      .catch((errors) => {
        console.log("in get employee : " + errors);
      });
  }
  const setToken = (_token: string) => {
    if (!_token || _token == "") return logout();
    token.value = _token;
    localStorage.setItem("isAuthenticated", "1");
    localStorage.setItem("token", _token);
    Api.defaults.headers.common["Authorization"] = `Bearer ${_token}`;
  };
  //const PermissionStore = usePermissionStore();
  const setUser = (_user: IUser) => {
    user.value = _user;
    localStorage.setItem("user", JSON.stringify(_user));
    //PermissionStore.permissions = _user.permissions;
    setPermissions(user.value.permissions);
  };
  const checkToken = async (_token: string) => {
    if (_token) setToken(_token);
    if (!_token) return;

    await Api.get("/me")
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        logout();
      });
  };
  const getUser = async () => {
    return await JSON.parse(localStorage.getItem("user")?.toString() || "{}");
  };
  const logout = async () => {
    isAuthenticated.value = false;
    token.value = "";
    user.value = undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    Api.defaults.headers.common["Authorization"] = "";
    router.push("/login");
  };
  const CheckAuth = async () => {
    isAuthenticated.value =
      (await localStorage.getItem("isAuthenticated")) == "1" ? true : false;
    token.value = await localStorage.getItem("token")?.toString();
    user.value = JSON.parse(
      (await localStorage.getItem("user")?.toString()) || "{}"
    );
    if (user.value) setPermissions(user.value.permissions);
  };
  return {
    isAuthenticated,
    token,
    login,
    logout,
    getError,
    user,
    getUser,
    CheckAuth,
    get_profile,
  };
});
