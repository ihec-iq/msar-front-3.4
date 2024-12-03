import { t } from "@/utilities/I18nPlugin";
export const getError = (error: {
  response: {
    data: { errors: { [s: string]: unknown } | ArrayLike<unknown> };
    status: any;
    headers: any;
  };
  config: { url: any };
} | string) => {
  const errorMessage = t("Server is down, please try again.");
  if (typeof error === 'object') {
    if (!error.response) {
      console.error(`API ${error.config} not found`);
      return errorMessage;
    }
    if (process.env.NODE_ENV === "development") {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    }
    if (error.response.data && error.response.data.errors) {
      return Object.values(error.response.data.errors).flat().join();
    }
  } else {
    window.location.reload();
    return error; 
  }
  

  return errorMessage;
};

export async function generateKey() {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  const keyString = Array.from(new Uint8Array(exportedKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return keyString;
}



