const GenerateImage = require("../../src/cjs/index.js");
const token = 'Authorization Bearer';

const generateImage = new GenerateImage(token);

const imagePath = '../../assets/cat_neutral.jpg'
// or use a URL

try {
  await generateImage.getUploadUrl();
  const uploadedImageUrl = await generateImage.uploadImage(imagePath);
  console.log('Uploaded Image URL:', uploadedImageUrl);

  const tags = await generateImage.getTags();
  console.log('Image Tags:', tags.join(' ,'));
} catch (error) {
  console.error('Error getting tags:', error);
}