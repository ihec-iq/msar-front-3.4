const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function sendWhatsAppMessage() {
  // Path to ChromeDriver (update if needed)
  const driverPath = 'C:\\chromedriver\\chromedriver.exe';
  const service = new chrome.ServiceBuilder(driverPath);

  // Initialize WebDriver
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeService(service)
    .build();
  try {
    // Define the phone number and message
    const phoneNumber = '9647725726027';
    const message = 'Send message';
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

    // Navigate to the WhatsApp URL
    await driver.get(whatsappUrl);

    // Wait for the "Continue to Chat" button to appear
    await driver.sleep(5000); // Adjust sleep time if needed
    const continueButton = await driver.findElement(
      By.xpath("//a[contains(text(), 'Continue to Chat')]")
    );

    // Click the "Continue to Chat" button
    await continueButton.click();
    console.log('Clicked "Continue to Chat" button.');

    // Wait for WhatsApp Web to load
    await driver.sleep(10000); // Wait for WhatsApp Web to load
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Quit the WebDriver
    await driver.quit();
  }
})();
