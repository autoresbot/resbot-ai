import api from '../api.js';

/** Mengambil link media Instagram. */
async function downloadInstagram(url) {
  try {
    const media = await api.get('/api/downloader/instagram', { url });
    return media.data;
  } catch (error) {
    return { status: false, message: error };
  }
}

export { downloadInstagram };
