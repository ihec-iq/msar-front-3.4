import { useCrypto } from "@/compositions/useCrypto";
export function  useLocalStorage () {
  const { encryptData, decryptData } = useCrypto();

  function get({
    key,
    withEncrypt = false,
  }: {
    key: string;
    withEncrypt: boolean;
  }) {
    const data = localStorage.getItem(key);
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
    value: string;
    withEncrypt: boolean;
  }) {
    if (withEncrypt) value = encryptData(value)?.toString() ?? value;
    localStorage.setItem(key, value);
  }

  return {
    get,
    set,
  };
};
