<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// Default values
const countryCode = ref('+964')
const phoneNumber = ref('7725726027')
const message = ref('Send message')
const whatsappWindow = ref<Window | null>(null)

// Computed property for form validation
const isValidForm = computed(() => {
  return phoneNumber.value.trim() !== '' && 
         message.value.trim() !== ''
})

// Method to send WhatsApp message
const sendWhatsAppMessage = () => {
  const frm = new FormData()
  frm.append('number', phoneNumber.value)
  frm.append('message', message.value)  
  
  // Remove non-digit characters from phone number
  const cleanedNumber = phoneNumber.value.replace(/\D/g, '')

  // Construct full phone number with country code
  const fullPhoneNumber = `${countryCode.value}${cleanedNumber}`

  // Construct WhatsApp URL
  const whatsappUrl = `https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(message.value)}`
  console.log(whatsappUrl)
  // Open WhatsApp in a new window
  whatsappWindow.value = window.open(whatsappUrl, '_blank')
  setupMessageSender()
}
// Method to setup message sending
const setupMessageSender = () => {
  const checkAndSendMessage = () =>  {
    // Check if window is still open
    if (!whatsappWindow.value || whatsappWindow.value.closed) {
      removeMessageListener()
      return
    }

    try {
      // Try to access the window's document
      const doc = whatsappWindow.value.document

      // Check if WhatsApp Web is fully loaded
      const messageInput = doc.querySelector('[data-testid="compose-input"]') as HTMLDivElement
      const sendButton = doc.querySelector('[data-testid="send"]') as HTMLButtonElement

      if (messageInput && sendButton) {
        // Set the message
        messageInput.innerHTML = message.value

        // Trigger input event to ensure message is registered
        const event = new Event('input', { bubbles: true })
        messageInput.dispatchEvent(event)

        // Click send button
        sendButton.click()

        // Close the listener
        removeMessageListener()
      }
    } catch (error) {
      console.log('Waiting for WhatsApp Web to load...')
    }
  }

  // Start checking periodically
  const checkInterval = setInterval(checkAndSendMessage, 1000)

  // Method to remove listener
  const removeMessageListener = () => {
    clearInterval(checkInterval)
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    removeMessageListener()
  })
}
</script>

<template>
  <div class="whatsapp-message-container">
    <div class="form-group">
      <label>Country Code</label>
      <select v-model="countryCode" class="bg-lightInput dark:bg-input text-text dark:text-textLight text-lg">
        <option value="+1">🇺🇸 +1 (USA)</option>
        <option value="+44">🇬🇧 +44 (UK)</option>
        <option value="+91">🇮🇳 +91 (India)</option>
        <option value="+964">🇮🇶 +964 (Iraq)</option>
      </select>
    </div>

    <div class="form-group">
      <label>Phone Number</label>
      <input 
        v-model="phoneNumber" 
        type="text" 
        placeholder="Enter phone number"
        class="bg-lightInput dark:bg-input text-text dark:text-textLight text-lg"
      />
    </div>

    <div class="form-group">
      <label>Message</label>
      <textarea 
        v-model="message" 
        placeholder="Type your message"
        rows="4"
        class="bg-lightInput dark:bg-input text-text dark:text-textLight text-lg"
      ></textarea>
    </div>

    <button 
      @click="sendWhatsAppMessage" 
      :disabled="!isValidForm"
      class="bg-green-500 text-white text-lg py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Send WhatsApp Message
    </button>
  </div>
</template>

<style scoped>
.whatsapp-message-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}
</style>
