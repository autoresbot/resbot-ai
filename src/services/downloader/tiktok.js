import axios from 'axios';
import * as cheerio from 'cheerio';

const TIKWM_ENDPOINT = 'https://tikwm.com/api/';
const DLPANDA_ENDPOINT = 'https://dlpanda.com/id';

/** Mengambil metadata & link video TikTok tanpa watermark. */
async function fetchVideo(url) {
  const params = new URLSearchParams();
  params.set('url', url);
  params.set('hd', '1');

  const response = await axios.post(TIKWM_ENDPOINT, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: 'current_language=en',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    },
  });

  const data = response.data.data || {};

  return {
    title: data.title,
    cover: data.cover,
    origin_cover: data.origin_cover,
    no_watermark: data.play,
    watermark: data.wmplay,
    music: data.music,
  };
}

/** Mengambil daftar gambar dari postingan TikTok bertipe slide/photo. */
async function fetchSlide(url) {
  const response = await axios.get(`${DLPANDA_ENDPOINT}?url=${url}&token=G7eRpMaa`);
  const $ = cheerio.load(response.data);

  const images = [];
  $('div.col-md-12 > img').each((_, el) => {
    images.push($(el).attr('src'));
  });

  return [{ creator: 'Jikarinka', imgSrc: images }];
}

/**
 * Mengunduh konten TikTok, otomatis mendeteksi video atau slide gambar.
 * @returns `{ status, type: 'video'|'slide', data }` atau `{ status: false, message }`.
 */
async function downloadTiktok(url) {
  try {
    const data = await fetchVideo(url);

    if (data && data.no_watermark.includes('video')) {
      return { status: true, type: 'video', data };
    }

    const slides = await fetchSlide(url);
    return { status: true, type: 'slide', data: slides[0].imgSrc };
  } catch (error) {
    return { status: false, message: error };
  }
}

export { fetchVideo, fetchSlide, downloadTiktok };
