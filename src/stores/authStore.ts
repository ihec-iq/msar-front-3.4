import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import { getError } from "@/utilities/helpers";
import { usePermissionsStore } from "@/project/core/permissionStore";
import type { IUser } from "@/project/user/IUser";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import { useLocalStorageStore } from "@/project/core/localStorageStore";
// Create a secret key for encryption (ideally from an environment variable)
export enum EnumNameToken {
  tokenENCRYPT = "TENCRYPT",
  userENCRYPT = "UENCRYPT",
  isAuthenticated = "isAuthenticated",
}
export const useAuthStore = defineStore("useAuthStore", () => {
  const secretKey: string = import.meta.env.VITE_SECRET_KEY || "default-dev-key";
  const isAuthenticated = ref<boolean | any>(false);
  const token = ref<string | any>("");
  const user = ref<IUser>();
  const router = useRouter();
  const { setPermissions } = usePermissionsStore();
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
    useLocalStorageStore().set({
      key: EnumNameToken.tokenENCRYPT,
      value: _token,
      withEncrypt: true,
    });
  };
  //const PermissionStore = usePermissionsStore();
  const setUser = (_user: IUser) => {
    user.value = _user;
    useLocalStorageStore().set({
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
    const user = await useLocalStorageStore().get({
      key: EnumNameToken.userENCRYPT,
      withEncrypt: true,
    });
    return await JSON.parse(user?.toString() || "{}");
  };
  const logout = async () => {
    isAuthenticated.value = false;
    token.value = "";
    user.value = undefined;
    localStorage.removeItem(EnumNameToken.tokenENCRYPT);
    localStorage.removeItem(EnumNameToken.userENCRYPT);
    localStorage.removeItem(EnumNameToken.isAuthenticated);
    Api.defaults.headers.common["Authorization"] = "";
    router.push("/login");
  };
  const CheckAuth = async () => {
    isAuthenticated.value = (await localStorage.getItem(EnumNameToken.isAuthenticated)) == "1" ? true : false;
    token.value = await useLocalStorageStore().get({
      key: EnumNameToken.tokenENCRYPT,
      withEncrypt: true,
    });
    user.value = await getUser();
    if (user.value) setPermissions(user.value.permissions);
  };


  //#region Encryption
  const setSecureToken = (token: string) => {
    // Encrypt the token
    console.log("token: ", token)
    console.log("secretKey: ", secretKey)
    const encryptedToken = CryptoJS.AES.encrypt(
      JSON.stringify(token), 
      secretKey
    ).toString()

    // Add additional browser-specific identifier
    const browserFingerprint = generateBrowserFingerprint()
    console.log("browserFingerprint: ", browserFingerprint)
    localStorage.setItem('secure_token', JSON.stringify({
      token: encryptedToken,
      fingerprint: browserFingerprint,
      timestamp: Date.now()
    }))
  }

  // Retrieve and validate token
  const getSecureToken = () => {
    const storedData = localStorage.getItem('secure_token')
    if (!storedData) return null

    try {
      const { token, fingerprint, timestamp } = JSON.parse(storedData)
      
      // Check token age (e.g., expire after 7 days)
      const MAX_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      if (Date.now() - timestamp > MAX_TOKEN_AGE) {
        logout()
        return null
      }

      // Verify browser fingerprint
      if (fingerprint !== generateBrowserFingerprint()) {
        logout()
        return null
      }

      // Decrypt the token
      const decryptedToken = CryptoJS.AES.decrypt(
        token, 
        secretKey
      ).toString(CryptoJS.enc.Utf8)

      return decryptedToken
    } catch (error) {
        logout()
      return null
    }
  }

  

  // Generate a unique browser fingerprint
  const generateBrowserFingerprint = () => {
    return CryptoJS.MD5([
      navigator.userAgent,
      screen.width,
      screen.height,
      navigator.language,
      // Add more unique browser characteristics
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency
    ].join('|')).toString()
  }


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
