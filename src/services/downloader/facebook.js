import api from '../api.js';

/** Mengambil link video Facebook. */
async function downloadFacebook(url) {
  try {
    const media = await api.get('/api/downloader/facebook', { url });
    return media.data[0];
  } catch (error) {
    return { status: false, message: error };
  }
}

export { downloadFacebook };
