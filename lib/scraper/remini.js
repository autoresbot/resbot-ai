import fs from 'fs';
import config from '../../config.js';
import ApiAutoresbot from 'api-autoresbot';
import axios from 'axios';
import FormData from 'form-data';

const api = new ApiAutoresbot(config.API_KEY);

async function ReminiV0(url) {
  try {
    const encodedUrl = url;
    const endpoint = `https://api.autoresbot.com/api/tools/remini`;

    // 1. request awal
    let res = await axios.get(endpoint, {
      params: {
        apikey: config.API_KEY,
        url: encodedUrl,
      },
    });

    let data = res.data;

    // 2. kalau masih processing → polling
    if (data.status === 'processing') {
      const jobId = data.job_id;

      let maxTry = 12;
      let delay = 5000;

      for (let i = 0; i < maxTry; i++) {
        await new Promise((r) => setTimeout(r, delay));

        const check = await axios.get(endpoint, {
          params: {
            apikey: config.API_KEY,
            job_id: jobId,
          },
        });

        data = check.data;

        if (data.status === 'done') break;
      }
    }

    // 3. jika sudah selesai
    if (data.status !== 'done' || !data.result) {
      throw new Error('Gagal memproses gambar.');
    }

    // 4. ambil gambar
    const img = await axios.get(data.result, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(img.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}
export { ReminiV0 };
