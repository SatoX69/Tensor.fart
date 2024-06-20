import GenerateImage from "../src/cjs/index.js";
// import GenerateImage from "tensor.fart";

const generate = new GenerateImage("Authorization_Bearer", { stfu: true });
// {stfu} disables the warning message

const data = {
  baseModel: {
    modelId: "681308059685024766",
    modelFileId: "681308059683976191"
  },
  sdxl: {
    refiner: true
  },
  sdVae: 'Automatic',
  prompt: "Cute Cat, smiling",
  negativePrompt: "Bad Quality, Low Quality",
  height: 512,
  width: 512,
  imageCount: 1,
  steps: 20
};

const response = await generate.generate(data);
console.log(response);