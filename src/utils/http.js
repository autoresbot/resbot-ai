import axios from 'axios';

/**
 * Mengunduh sebuah URL menjadi Buffer.
 * @returns {Promise<Buffer|false>} Buffer bila berhasil, `false` bila gagal.
 */
async function getBuffer(url, options = {}) {
  try {
    const res = await axios({
      method: 'get',
      url,
      headers: {
        DNT: 1,
        'Upgrade-Insecure-Request': 1,
      },
      timeout: 45000,
      ...options,
      responseType: 'arraybuffer',
    });

    return Buffer.from(res.data);
  } catch (err) {
    console.error('Error in getBuffer function:', err.message || err);
    return false;
  }
}

/** Menebak jenis konten sebuah URL lewat header `content-type`. */
async function checkUrlType(url) {
  try {
    const response = await axios.head(url);
    const contentType = response.headers['content-type'];

    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('video/')) return 'video';
    return 'unknown';
  } catch (err) {
    console.error('Error checking URL:', err.message);
    return 'error';
  }
}

export { getBuffer, checkUrlType };
