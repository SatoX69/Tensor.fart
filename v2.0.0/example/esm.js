import GenerateImage from "../src/esm/index.js";

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
};

const payload = {
  baseModel: {
    modelId: '603269903807549991',
    modelFileId: '603269903806501416'
  },
  sdxl: {
    refiner: false
  },

  // Lora, 3 at most
  models: [],
  embeddingModels: [],
  sdVae: 'Automatic',
  prompt: 'Cute cat, sitting down',
  negativePrompt: 'EasyNegative',
  height: 768,
  width: 512,
  imageCount: 1,
  steps: 20,

  // Just pass one image for now, will fix it next time
  // Pass an Image link or Image path as a string
  // If any unexpected behavior occurs, open an issue
  images: [],
  cfgScale: 7,
  seed: '-1',
  clipSkip: 2,
  etaNoiseSeedDelta: 31337,
  v1Clip: false,
  guidance: 3.5,
  samplerName: 'Euler a'
};

// test block
try {
  const generate = new GenerateImage(Authorization_Token, { headers });
  const processed = await generate.generate(payload);
  console.log(processed);
} catch (error) {
  console.error(error);
}