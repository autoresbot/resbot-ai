import api from './api.js';
import { getBuffer } from '../utils/http.js';
import { pick } from '../utils/random.js';

/** Sumber gambar yang dicoba berurutan sampai ada yang membalas. */
const SOURCES = [
  { endpoint: '/api/search/pinterest', timeout: 5000, multiple: false },
  { endpoint: '/api/search/pixabay', timeout: 5000, multiple: true },
  { endpoint: '/api/search/unsplash', timeout: 10000, multiple: true },
];

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms, null))]);

/**
 * Mencari satu gambar berdasarkan kata kunci.
 * @returns `{ status: true, data: Buffer }`, `null` bila tidak ketemu, atau `{ status: false, message }`.
 */
async function searchImage(keyword) {
  try {
    for (const { endpoint, timeout, multiple } of SOURCES) {
      const response = await withTimeout(api.get(endpoint, { text: keyword }), timeout);

      if (!multiple && response?.data) {
        return { status: true, data: await getBuffer(response.data) };
      }

      if (multiple && response?.data?.length > 0) {
        return { status: true, data: await getBuffer(pick(response.data)) };
      }
    }

    return null;
  } catch (error) {
    console.log(error);
    return { status: false, message: error };
  }
}

export { searchImage };
