import CryptoJS from "crypto-js";

// Define the secretKey locally
const secretKey: string = import.meta.env.VITE_SECRET_KEY || "default-dev-key"; // Load from environment or use fallback

type EncryptFunction = (data: Record<string, unknown> | string) => string | null;
type DecryptFunction = (
  encryptedData: string
) => Record<string, unknown> | null;

export function useCrypto() {
  // Encrypt data
  const encryptData: EncryptFunction = (data : string | Record<string, unknown>) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        secretKey
      ).toString();
      return encrypted;
    } catch (error) {
      console.error("Encryption Error:", error);
      return null;
    }
  };

  // Decrypt data
  const decryptData: DecryptFunction = (encryptedData) => {
    try { 
      if (!encryptedData) {
        return null;
      }
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decrypted;
    } catch (error) {
      console.error("Decryption Error:", error);
      return null;
    }
  };

  return {
    encryptData,
    decryptData,
  };
}
