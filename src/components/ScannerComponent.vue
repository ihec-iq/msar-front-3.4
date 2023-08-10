<script setup></script>
<template>//Test</template>
<!-- <script setup lang="ts">
import * as Scanner from "@/assets/scannerjs.js";

/** Processes the scan result */
function displayImagesOnPage(successful: any, message: any, response: any) {
  if (!successful) {
    // On error
    console.error("Failed: " + message);
    return;
  }

  if (
    successful &&
    message != null &&
    message.toLowerCase().indexOf("user cancel") >= 0
  ) {
    // User cancelled.
    console.info("User cancelled");
    return;
  }

  var scannedImages = Scanner.scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
  for (
    var i = 0;
    scannedImages instanceof Array && i < scannedImages.length;
    i++
  ) {
    var scannedImage = scannedImages[i];
    processScannedImage(scannedImage);
  }
}

/** Images scanned so far. */
var imagesScanned = [];

/** Processes a ScannedImage */
function processScannedImage(scannedImage: { src: any }) {
  imagesScanned.push(scannedImage);
  var elementImg = Scanner.scanner.createDomElementFromModel({
    name: "img",
    attributes: {
      class: "scanned",
      src: scannedImage.src,
    },
  });
  document.getElementById("images")?.appendChild(elementImg);
}
const scanToJpg = () => {
  Scanner.scanner.scan(displayImagesOnPage, {
    output_settings: [
      {
        type: "return-base64",
        format: "jpg",
      },
    ],
  });
};
</script>
<template>
  <button type="button" @click="scanToJpg()">Scan</button>

  <div id="images"></div>
</template> -->
