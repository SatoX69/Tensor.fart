import axios from "axios"
import fs from "fs"

class GenerateImage {
  constructor(token, obj) {
    if (!token) throw new Error("Token is required");
    if (!obj?.stfu) console.warn("May need for fixes")
    this.token = token;
    this.headers = {
      authorization: `Bearer ${this.token}`,
      'content-type': 'application/json',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      Referer: 'https://tensor.art/',
      'Referrer-Policy': 'unsafe-url',
    };
  }

  async generate(params) {
    if (!params.prompt) throw new Error('Prompt is required.');

    const {
      prompt,
      negativePrompt = "Bad Quality",
      height = 512,
      width = 512,
      imageCount = 1,
      steps = 20,
      samplerName = "Euler a",
      images = [],
      cfgScale = 7,
      seed = Date.now(),
      clipSkip = 2,
      workEngine = "TAMS_V2",
      etaNoiseSeedDelta = 3749,
      image
    } = params;

    try {
      let uploadedImage;
      if (image) {
        await this.getUploadUrl();
        uploadedImage = await this.uploadImage(image);
      }
      await this.createTask({
        prompt,
        negativePrompt,
        height,
        width,
        imageCount,
        steps,
        samplerName,
        images,
        cfgScale,
        seed,
        clipSkip,
        workEngine,
        etaNoiseSeedDelta,
        uploadedImage
      });
      return { result: await this.waitForTaskCompletion() };
    } catch (error) {
      throw error;
    }
  }

  async getTags() {
    try {
      const response = await axios.post(
        "https://api.tensor.art/train-web/v1/train-task/tag-other-image",
        { imageUrl: this.dbUrl },
        { headers: this.headers }
      );
      return response.data.data.tags;
    } catch (error) {
      throw error;
    }
  }

  async getUploadUrl() {
    const response = await axios.post(
      "https://api.tensor.art/community-web/v1/cloudflare/upload/pre_sign",
      { scene: "IMAGE_TO_IMAGE", fileNameSuffix: "jpg" },
      { headers: this.headers }
    );
    this.uploadURL = response.data.data.uploadUrl;
    return this.uploadURL;
  }

  async uploadImage(imagePathOrUrl) {
    let buffer;
    try {
      if (fs.existsSync(imagePathOrUrl)) {
        buffer = fs.readFileSync(imagePathOrUrl);
      } else {
        const response = await axios.get(imagePathOrUrl, { responseType: 'arraybuffer' });
        buffer = Buffer.from(response.data);
      }
      const uploadResponse = await axios.put(this.uploadURL, buffer, {
        headers: { 'Content-Type': "image/jpeg" },
      });

      if (uploadResponse.status !== 200) throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      
      this.dbUrl = uploadResponse.config.url;
      return this.dbUrl;
    } catch (err) {
      throw err;
    }
  }

  async createTask(params) {
    const { uploadedImage, ...rest } = params;
    const taskResponse = await axios.post(
      'https://api.tensor.art/works/v1/works/task',
      {
        params: {
          images: uploadedImage ? [uploadedImage] : [],
          ...rest,
        },
        taskType: 'TXT2IMG',
        credits: 1.0,
      },
      { headers: this.headers }
    );
    this.taskId = taskResponse.data.data.task.taskId;
    return this.taskId;
  }

  async waitForTaskCompletion() {
    const timeout = 250000;
    const interval = 2000;
    const endTime = Date.now() + timeout;

    while (Date.now() < endTime) {
      const taskResponse = await axios.post(
        'https://api.tensor.art/works/v1/works/mget_task',
        { ids: [this.taskId] },
        { headers: this.headers }
      );
      const task = taskResponse.data.data.tasks[this.taskId];
      if (task.status === 'FINISH') return task.items[0].url;

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Task completion timeout');
  }
}

export default GenerateImage