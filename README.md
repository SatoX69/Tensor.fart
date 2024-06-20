# tensor.fart

## Overview

`tensor.fart` is a Node.js module that interfaces with the Tensor.art API to generate images based on textual prompts. This module simplifies the process of creating images by handling image uploads, task creation, and result retrieval.

## Features

- **Text-to-Image Generation**: Create images from text descriptions.
- **Image Upload**: Supports uploading from both URLs and local file paths.
- **Customizable Parameters**: Adjust various parameters such as image dimensions, steps, and more.
- **Task Monitoring**: Continuously checks and retrieves the generated image upon completion.

## Installation

To install the `tensor.fart` module, use npm:

```bash
npm install tensor.fart
```

## Usage

### Importing and Instantiating

First, import the `GenerateImage` class from the module and instantiate it with your API token:

```javascript
import GenerateImage from 'tensor.fart';

const token = "your-api-token";
const generateImage = new GenerateImage(token);
```

### Generating an Image

Call the `generate` method with the required parameters to generate an image:

```javascript
(async () => {
  const params = {
    prompt: "A serene landscape with rolling hills and a clear sky",
    height: 512,
    width: 512,
    image: "path-or-url-to-image", // Optional: specify an image path or URL
    imageCount: 1,
    steps: 20,
    samplerName: "Euler a",
    cfgScale: 7.0,
    seed: 12345,
    clipSkip: 1,
    workEngine: "Tensor",
    etaNoiseSeedDelta: 0
  };

  try {
    const response = await generateImage.generate(params);
    console.log("Generated Image URL:", response.result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

### Parameters

- **prompt**: A string describing the desired image.
- **negativePrompt**: A string specifying elements to avoid in the image.
- **height**: Image height in pixels.
- **width**: Image width in pixels.
- **image**: A path to a local image or a URL for the input image.
- **imageCount**: Number of images to generate.
- **steps**: Number of steps for the generation process.
- **samplerName**: The name of the sampling method.
- **cfgScale**: Configuration scale for adjusting the fidelity of the generated image.
- **seed**: Seed value for random number generation, ensuring reproducibility.
- **clipSkip**: Value to fine-tune the clip model's usage.
- **workEngine**: The engine to be used for image generation.
- **etaNoiseSeedDelta**: Value to control the noise seed during generation.

### Return Value

The `generate` method returns an object containing the URL of the generated image:

```json
{
  "result": "https://path-to-the-generated-image"
}
```

## Example

Here is a complete example demonstrating the usage of the `tensor.fart` module:

```javascript
import GenerateImage from 'tensor.fart';

(async () => {
  const token = "your-api-token";
  const generateImage = new GenerateImage(token);
  const params = {
    prompt: "A futuristic city with neon lights",
    height: 1024,
    width: 768,
    image: "https://example.com/sample.jpg", // or local path "path/to/your/image.jpg"
    steps: 30,
    cfgScale: 8.0
  };

  try {
    const response = await generateImage.generate(params);
    console.log("Generated Image URL:", response.result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

## More Methods
[Check this out](https://github.com/SatoX69/Tensor.fart/tree/main/example/extended_examples)


## Contributing

To contribute to the `tensor.fart` module, fork the repository and use a feature branch. Pull requests are welcome and appreciated.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tensor.art](https://tensor.art) for the API