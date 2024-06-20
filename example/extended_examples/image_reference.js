const generateImage = require("../src/cjs/index.js");
// const generateImage = require("tensor.fart");

const generate = new generateImage("Authorization_Bearer");

const data = {
  baseModel: {
    modelId: "681308059685024766",
    modelFileId: "681308059683976191"
  },
  sdxl: {
    refiner: true
  },
  prompt: "A Bald Man",
  image: "../../assets/bald.jpeg"
  // image: "https://example.com/image.jpg"
}

const response = await generate.generate(data)
console.log(response)