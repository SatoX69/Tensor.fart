const axios = require('axios');

class GenerateImage {
  constructor(token, obj) {
    if (!token) throw new Error("Token is required");
    if (typeof obj?.headers !== "object" || obj?.headers === null) {
      throw new Error("The 'headers' property must be a non-null object.");
    }

    this.token = token;
    this.headers = obj.headers;
  }

  async generate(params) {
    params.models = params.models || [];
    params.sdVae = params.sdVae || 'Automatic'; // "None"
    params.negativePrompt = params.negativePrompt || 'EasyNegative';
    params.height = params.height || 768;
    params.width = params.width || 512;
    params.imageCount = params.imageCount || 1;
    params.steps = params.steps || 20;
    params.images = params.images || [];
    params.cfgScale = params.cfgScale || 7;
    params.seed = params.seed || '-1';
    params.clipSkip = params.clipSkip || 2;
    params.etaNoiseSeedDelta = params.etaNoiseSeedDelta || 31337;
    params.v1Clip = params.v1Clip || false;
    params.guidance = params.guidance || 3.5;
    params.samplerName = params.samplerName || 'Euler a';

    if (typeof params.baseModel !== "object" || params.baseModel === null) {
      throw new Error("The 'params.baseModel' property must be a non-null object.");
    }
    if (!params.prompt) {
      throw new Error("Prompt must be provided")
    }

    try {
      let uploadedImage;
      if (params.images[0]) {
        await this.getUploadUrl();
        uploadedImage = await this.uploadImage(image);
        params.images = [uploadedImage]
      }

      const response = await axios.post(
        'https://api.tensor.art/works/v1/works/task',
        {
          params,
          credits: 0.8,
          taskType: 'TXT2IMG',
          isRemix: false,
          captchaType: 'CLOUDFLARE_TURNSTILE',
        }, { headers: this.headers }
      );

      const responseID = response.data.data.task.taskId;
      return await this.waitForTaskCompletion(responseID);
    } catch (err) {
      throw err;
    }
  }

  async waitForTaskCompletion(taskId) {
    const timeout = 250000;
    const interval = 2000;
    const endTime = Date.now() + timeout;

    try {
      while (Date.now() < endTime) {
        const taskResponse = await axios.post(
          'https://api.tensor.art/works/v1/works/mget_task', { ids: [taskId] }, { headers: this.headers }
        );

        const task = taskResponse.data.data.tasks[taskId];
        if (task?.status === 'FINISH') return task.items[0].url;

        await new Promise(resolve => setTimeout(resolve, interval));
      }

      throw new Error('Task completion timeout');
    } catch (err) {
      throw err;
    }
  }

  // copied from v1.0.0
  async getTags(dbUrl) {
    try {
      const response = await axios.post(
        "https://api.tensor.art/train-web/v1/train-task/tag-other-image", { imageUrl: dbUrl || this.dbUrl }, { headers: this.headers }
      );
      return response.data.data.tags;
    } catch (error) {
      throw error;
    }
  }

  async getUploadUrl() {
    const response = await axios.post(
      "https://api.tensor.art/community-web/v1/cloudflare/upload/pre_sign", { scene: "IMAGE_TO_IMAGE", fileNameSuffix: "jpg" }, { headers: this.headers }
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
      return uploadResponse.config.url
    } catch (err) {
      throw err;
    }
  }
}

module.exports = GenerateImage;