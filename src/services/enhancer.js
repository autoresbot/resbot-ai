import axios from 'axios';
import config from '../../config.js';
import api from './api.js';

const REMINI_ENDPOINT = 'https://api.autoresbot.com/api/tools/remini';
const POLL_MAX_TRY = 12;
const POLL_DELAY_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Memperjelas gambar lewat API remini (job + polling).
 * @param {string} url URL gambar yang sudah bisa diakses publik.
 * @returns {Promise<Buffer>} Buffer gambar hasil peningkatan kualitas.
 */
async function remini(url) {
  try {
    let { data } = await axios.get(REMINI_ENDPOINT, {
      params: { apikey: config.API_KEY, url },
    });

    if (data.status === 'processing') {
      const jobId = data.job_id;

      for (let attempt = 0; attempt < POLL_MAX_TRY; attempt += 1) {
        await wait(POLL_DELAY_MS);

        const check = await axios.get(REMINI_ENDPOINT, {
          params: { apikey: config.API_KEY, job_id: jobId },
        });

        data = check.data;
        if (data.status === 'done') break;
      }
    }

    if (data.status !== 'done' || !data.result) {
      throw new Error('Gagal memproses gambar.');
    }

    const img = await axios.get(data.result, { responseType: 'arraybuffer' });
    return Buffer.from(img.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Alur lengkap fitur HD: upload media ke tmp host lalu perjelas lewat remini.
 * @param {{buffer: Buffer, filePath: string}} media Hasil download media.
 * @returns {Promise<Buffer|undefined>} Buffer gambar HD.
 */
async function enhanceImage(media) {
  try {
    const upload = await api.tmpUpload(media.filePath);
    if (!upload) throw new Error('File upload failed');

    try {
      return await remini(upload.data.url);
    } catch (error) {
      console.error('ReminiV0 failed:', error.message);
      return undefined;
    }
  } catch (error) {
    console.error('Error in HDR function:', error);
    throw error;
  }
}

export { remini, enhanceImage };
