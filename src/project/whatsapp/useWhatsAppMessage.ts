// composables/useWhatsAppMessage.ts
interface WhatsAppMessageOptions {
    phoneNumber: string
    message: string
    countryCode?: string
  }
  
  export function useWhatsAppMessage() {
    // Validate phone number format
    const validatePhoneNumber = (phoneNumber: string, countryCode = '+') => {
      // Remove non-digit characters
      const cleanedNumber = phoneNumber.replace(/\D/g, '')
      
      // Basic validation (adjust regex as needed)
      const phoneRegex = /^[1-9]\d{9,14}$/
      
      if (!phoneRegex.test(cleanedNumber)) {
        throw new Error('Invalid phone number format')
      }
      
      return `${countryCode}${cleanedNumber}`
    }
  
    // Send message method
    const sendWhatsAppMessage = ({
      phoneNumber, 
      message, 
      countryCode = '+' 
    }: WhatsAppMessageOptions) => {
      try {
        // Validate and clean phone number
        const validatedNumber = validatePhoneNumber(phoneNumber, countryCode)
        
        // Construct WhatsApp URL
        const whatsappUrl = `https://wa.me/${validatedNumber}?text=${encodeURIComponent(message)}`
        
        // Open WhatsApp in a new window/tab
        window.open(whatsappUrl, '_blank')
      } catch (error) {
        // Handle validation errors
        console.error('WhatsApp Message Error:', error)
        // Optionally show user-friendly error
        throw error
      }
    }
  
    return {
      sendWhatsAppMessage
    }
  }