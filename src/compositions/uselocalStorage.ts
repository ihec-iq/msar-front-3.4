import { useCrypto } from "@/compositions/useCrypto";
export function useLocalStorage() {
  const { encryptData, decryptData } = useCrypto();
  const APP_PREFIX = "" + getAppInstanceId();

  function getAppInstanceId() {
  const STORAGE_KEY = "ali7med";

  // Check if key exists
  let id = localStorage.getItem(STORAGE_KEY);

  // If not exist → generate new UUID and save it
  if (!id) {
    id = crypto.randomUUID();  // Generates unique ID
    localStorage.setItem(STORAGE_KEY, id);
  }

  return id;
}
  function get({
    key,
    withEncrypt = false,
  }: {
    key: string;
    withEncrypt: boolean;
  }) {
    const data = localStorage.getItem(`${APP_PREFIX}_${key}`);
    if (!data) return null;
    if (withEncrypt) return decryptData(data);
    return data;
  }
  async function set({
    key,
    value,
    withEncrypt = false,
  }: {
    key: string;
    value: string | number | boolean | any;
    withEncrypt: boolean;
  }) {
    if (withEncrypt) value = encryptData(value)?.toString() ?? value;
    localStorage.setItem(`${APP_PREFIX}_${key}`, value);
  }
  function remove(key: string) {
    localStorage.removeItem(`${APP_PREFIX}_${key}`);
  }

  return {
    get,
    set,
    remove,
  };
}
