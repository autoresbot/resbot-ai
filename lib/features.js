import fs from 'fs';
import { ReminiV0 } from './scraper/remini.js';
import { tiktok, tiktokSlide } from './scraper/tiktok.js';
import config from '../config.js';
import ApiAutoresbot from 'api-autoresbot';
import { getBuffer } from './utils.js';

const api = new ApiAutoresbot(config.API_KEY);

async function HDR(content) {
  const filePath = content.filePath;
  const buffer = content.buffer;
  try {
    const FileUpload = await api.tmpUpload(filePath);
    if (!FileUpload) {
      throw new Error('File upload failed');
    }
    const originalFileUrl = FileUpload.data.url;

    // Coba ReminiV0
    try {
      const MediaBuffer = await ReminiV0(originalFileUrl);
      return MediaBuffer;
    } catch (error) {
      console.error('ReminiV0 failed:', error.message);
    }
  } catch (error) {
    console.error('Error in HDR function:', error);
    throw error; // Re-throw the error after logging it
  }
}

async function TIKTOK(url) {
  try {
    const data = await tiktok(url);
    let type;
    let resultData;

    if (data && data.no_watermark.includes('video')) {
      type = 'video';
      resultData = data; // Jika tipe video, gunakan data dari tiktok
    } else {
      type = 'slide';
      const slides = await tiktokSlide(url); // Ambil slide dari tiktokSlide
      resultData = slides[0].imgSrc; // Ambil data gambar dari slide
    }

    const result = {
      status: true,
      type: type,
      data: resultData,
    };
    return result; // Mengembalikan object result
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
}

async function SEARCH_IMAGE(content) {
  const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms, null)); // Fungsi timeout

  try {
    let response = await Promise.race([
      api.get('/api/search/pinterest', { text: content }),
      timeout(5000), // Timeout 10 detik
    ]);
    if (response?.data) {
      const media = await getBuffer(response.data);
      return {
        status: true,
        data: media,
      };
    }

    response = await Promise.race([
      api.get('/api/search/pixabay', { text: content }),
      timeout(5000),
    ]);

    if (response?.data?.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const randomImageUrl = response.data[randomIndex];
      const media = await getBuffer(randomImageUrl);
      return {
        status: true,
        data: media,
      };
    }

    response = await Promise.race([
      api.get('/api/search/unsplash', { text: content }),
      timeout(10000), // Timeout 10 detik
    ]);
    if (response?.data?.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const randomImageUrl = response.data[randomIndex];
      const media = await getBuffer(randomImageUrl);
      return {
        status: true,
        data: media,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: error,
    };
  }
}

async function FACEBOOK(url) {
  try {
    const media = await api.get('/api/downloader/facebook', { url });
    return media.data[0];
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
}

async function IG(url) {
  try {
    const media = await api.get('/api/downloader/instagram', { url });
    return media.data;
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
}

export { HDR, TIKTOK, SEARCH_IMAGE, FACEBOOK, IG };
