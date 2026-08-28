import Youtube from 'youtube-search-api';
import api from '../api.js';

const POLL_MAX_TRY = 12;
const POLL_DELAY_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mencari lagu di YouTube.
 * @returns {Promise<{title: string, image: string, url: string}|null>}
 */
async function searchSong(query) {
  try {
    const result = await Youtube.GetListByKeyword(query, false);
    const firstVideo = result.items?.[0];
    if (!firstVideo) return null;

    return {
      title: firstVideo.title,
      image: firstVideo.thumbnail.thumbnails[0].url,
      url: `https://www.youtube.com/watch?v=${firstVideo.id}`,
    };
  } catch (error) {
    console.error('Error searching song:', error);
    return null;
  }
}

/**
 * Meminta konversi audio ke API Autoresbot lalu menunggu (polling) sampai file siap.
 * @returns {Promise<string>} URL audio yang siap diunduh.
 */
async function fetchAudioUrl(videoUrl) {
  const createJob = await api.get('/api/downloader/ytplay', { url: videoUrl });
  if (!createJob.status) throw new Error('Gagal membuat job');

  for (let attempt = 0; attempt < POLL_MAX_TRY; attempt += 1) {
    await wait(POLL_DELAY_MS);

    const check = await api.get('/api/downloader/ytplay', { url: videoUrl });
    if (check?.data?.url) return check.data.url;
  }

  throw new Error('Timeout: file tidak siap');
}

export { searchSong, fetchAudioUrl };
