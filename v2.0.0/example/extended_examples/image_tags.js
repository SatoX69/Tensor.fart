const GenerateImage = require("../../src/cjs/index.js");

const Authorization_Token = "";
const xsign = "";
const headers = {
  authorization: `Bearer ${Authorization_Token}`,
  'content-type': 'application/json',
  'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'x-echoing-env': '',
  'x-request-package-id': '3000',
  'x-request-package-sign-version': '0.0.1',
  'x-request-sign': xsign,
  'x-request-sign-type': 'HMAC_SHA256',
  'x-request-sign-version': 'v1',
  'x-request-timestamp': Date.now(),
  Referer: 'https://tensor.art/sd-studio?modal=true&',
  'Referrer-Policy': 'unsafe-url'
}


// Copied from v1.0.0
const generateImage = new GenerateImage(Authorization_Token, { headers })

const imagePath = '../../../assets/cat_neutral.jpg'
// or use an Image Link

try {
  await generateImage.getUploadUrl();
  const uploadedImageUrl = await generateImage.uploadImage(imagePath);
  console.log('Uploaded Image URL:', uploadedImageUrl);

  const tags = await generateImage.getTags(
    /*uploadedImageUrl*/
    // Providing the uploaded CDN is optional, since it's all inside a class, it's natively embedded 
  );
  console.log('Image Tags:', tags.join(' ,'));
} catch (error) {
  console.error(error);
}