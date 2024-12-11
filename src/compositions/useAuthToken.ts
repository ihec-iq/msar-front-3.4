import CryptoJS from 'crypto-js'

// Create a secret key for encryption (ideally from an environment variable)
 const secretKey: string = import.meta.env.VITE_SECRET_KEY || "default-dev-key"; // Load from environment or use fallback

export function useAuthToken() {
  // Encrypted token storage function
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
        removeSecureToken()
        return null
      }

      // Verify browser fingerprint
      if (fingerprint !== generateBrowserFingerprint()) {
        removeSecureToken()
        return null
      }

      // Decrypt the token
      const decryptedToken = CryptoJS.AES.decrypt(
        token, 
        secretKey
      ).toString(CryptoJS.enc.Utf8)

      return decryptedToken
    } catch (error) {
      removeSecureToken()
      return null
    }
  }

  // Remove token securely
  const removeSecureToken = () => {
    localStorage.removeItem('secure_token')
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
    setSecureToken,
    getSecureToken,
    removeSecureToken
  }
}