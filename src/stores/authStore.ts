import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import { usePermissionsStore } from "@/project/core/permissionStore";
import type { IUser } from "@/project/user/IUser";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import { useLocalStorage } from "@/compositions/uselocalStorage";
const router = useRouter();
// Create a secret key for encryption (ideally from an environment variable)
export enum EnumNameToken {
  tokenENCRYPT = "TENCRYPT",
  userENCRYPT = "UENCRYPT",
  isAuthenticated = "isAuthenticated",
}
export const useAuthStore = defineStore("useAuthStore", () => {
  const secretKey: string =
    import.meta.env.VITE_SECRET_KEY || "default-dev-key";
  const isAuthenticated = ref<boolean | any>(false);
  const token = ref<string | any>("");
  const user = ref<IUser>();

  const { setPermissions } = usePermissionsStore();
  const login = async (payload: { email: string; password: string }) => {
    return await new Promise((resolve, reject) => {
      console.log(Api.defaults.headers.common["Authorization"]);
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
          setUser(response.data.data);
          return user;
        }
      })
      .catch((errors) => {
        console.log("in get User : " + errors);
      });
  }

  const setToken = async (_token: string) => {
    if (!_token || _token == "") return logout();
    token.value = _token;
    localStorage.setItem(EnumNameToken.isAuthenticated, "1");
    Api.defaults.headers.common["Authorization"] = `Bearer ${_token}`;
    isAuthenticated.value = true;
    setSecureToken(_token);
  };
  //const PermissionStore = usePermissionsStore();
  const setUser = (_user: IUser) => {
    user.value = _user;
    useLocalStorage().set({
      key: EnumNameToken.userENCRYPT,
      value: JSON.stringify(_user),
      withEncrypt: true,
    });
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
    const user = await useLocalStorage().get({
      key: EnumNameToken.userENCRYPT,
      withEncrypt: true,
    });
    return await JSON.parse(user?.toString() || "{}");
  };
  const logout = async () => {
    isAuthenticated.value = false;
    token.value = "";
    user.value = undefined;
    removeUnUsedLogin();
    router.push("/login");
  };
  const CheckAuth = async () => {
    isAuthenticated.value =
      (await localStorage.getItem(EnumNameToken.isAuthenticated)) == "1"
        ? true
        : false;
    token.value = await getSecureToken();
    user.value = await getUser();
    if (user.value) setPermissions(user.value.permissions);
  };

  //#region Encryption

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
    getSecureToken,
  };
});

export const removeUnUsedLogin = () => {
  localStorage.removeItem(EnumNameToken.tokenENCRYPT);
  localStorage.removeItem(EnumNameToken.userENCRYPT);
  localStorage.removeItem(EnumNameToken.isAuthenticated);
  router.push("/login");
};
export const setSecureToken = (token: string) => {
  // Add additional browser-specific identifier
  const browserFingerprint = generateBrowserFingerprint();
  useLocalStorage().set({
    key: EnumNameToken.tokenENCRYPT,
    value: JSON.stringify({
      token: token,
      fingerprint: browserFingerprint,
      timestamp: Date.now(),
    }),
    withEncrypt: true,
  });
};

// Retrieve and validate token
export const getSecureToken = async () => {
  const storedData = await useLocalStorage().get({
    key: EnumNameToken.tokenENCRYPT,
    withEncrypt: true,
  });
  if (!storedData) return null;
  try {
    const { token, fingerprint, timestamp } = JSON.parse(storedData.toString());
    // Check token age (e.g., expire after 7 days)
    const MAX_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - timestamp > MAX_TOKEN_AGE) {
      console.log("Token expired");
      removeUnUsedLogin();
      return null;
    }

    // Verify browser fingerprint
    if (fingerprint !== generateBrowserFingerprint()) {
      console.log("Fingerprint mismatch");
      removeUnUsedLogin();
      return null;
    }
    Api.defaults.headers.common["Authorization"] = "Bearer " + token;
    return token;
  } catch (error) {
    console.log("Decryption Error:", error);
    removeUnUsedLogin();
    return null;
  }
};

// Generate a unique browser fingerprint
export const generateBrowserFingerprint = () => {
  return CryptoJS.MD5(
    [
      navigator.userAgent,
      screen.width,
      screen.height,
      navigator.language,
      // Add more unique browser characteristics
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
    ].join("|")
  ).toString();
};
