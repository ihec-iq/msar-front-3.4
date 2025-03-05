import { t } from "@/utilities/I18nPlugin";
export const getError = (error: {
  data: { [s: string]: unknown } |
  { code: string; message: string } |
  ArrayLike<unknown> |
  string;

  status: any;
  headers: any;
  config: { url: any };
}
  | string
) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  let errorMessage = t("Server is down, please try again.");
  if (typeof error === 'object') {
    if (!error.data) {
      console.error(`API ${error.config} not found`);
      //window.location.reload(); 
      return errorMessage;
    }
    if (typeof error.data === 'object' && 'message' in error.data) {
      errorMessage = error.data.message as string;
    }
    else if (typeof error.data === 'object') {
      errorMessage = Object.values(error.data).flat().join();
    } else if (typeof error.data === 'string') {
      errorMessage = error.data;
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



