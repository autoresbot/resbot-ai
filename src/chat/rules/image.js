import config from '../../../config.js';
import { text, action } from '../replies.js';
import { pick } from '../../utils/random.js';
import { getActiveFitur, setActiveFitur } from '../../state/activeFeatures.js';
import { reduceLimit } from '../../state/users.js';
import { hasMedia, downloadAndSaveMedia, downloadQuotedMedia } from '../../services/media.js';
import { HD_KEYWORDS, HD_REPLIES, IMAGE_RECEIVED_REPLIES, HD_NO_MEDIA } from '../responses.js';

/** Kata pengiring yang dibuang saat mengambil kata kunci pencarian gambar. */
const SEARCH_NOISE = /carikan|cari|kirimkan|kirim|bisa|foto|tolong|berikan|mohon|gambar|image/g;

/** Permintaan memperjelas gambar: "hd", "remini", "jernih", dst. */
async function enhance(ctx) {
  const wantsHd = HD_KEYWORDS.some((keyword) => ctx.text.includes(keyword));

  // Cek dulu apakah medianya ada; mengunduh pesan teks biasa akan melempar error.
  let media = null;
  if (wantsHd && ctx.isQuoted) {
    media = await downloadQuotedMedia(ctx.message);
  } else if (wantsHd && hasMedia(ctx.message)) {
    media = await downloadAndSaveMedia(ctx.message, ctx.sock);
  }

  if (wantsHd && !media) return text(HD_NO_MEDIA);
  if (!wantsHd && ctx.session?.action !== 'remini') return null;

  if (getActiveFitur(ctx.remoteJid, 'hd')) return text(config.notification.waiting);

  setActiveFitur(ctx.remoteJid, 'hd');
  reduceLimit(ctx.sender);

  return text(pick(HD_REPLIES), action('hd', media));
}

/** Permintaan mencari gambar: "pin kucing", "carikan gambar kucing", dst. */
async function search(ctx) {
  const isPinCommand = /^pin\s+/i.test(ctx.text);
  const isSearchPhrase = ['cari', 'gambar'].some((keyword) => ctx.text.includes(keyword));
  if (!isPinCommand && !isSearchPhrase) return null;

  const keyword = ctx.text.replace(/^pin\s+/i, '').replace(SEARCH_NOISE, '').trim();
  if (!keyword) return null;

  if (getActiveFitur(ctx.remoteJid, 'pin')) return text(config.notification.waiting);

  setActiveFitur(ctx.remoteJid, 'pin');
  reduceLimit(ctx.sender);

  return text(
    `Mohon Tunggu Sebentar ya kak 😉, Saya akan mencarikan gambar *${keyword}*`,
    action('pin', keyword),
  );
}

/** Gambar polos tanpa perintah apa pun - bot menanyakan maunya diapakan. */
async function received(ctx) {
  if (ctx.messageType !== 'imageMessage') return null;
  return text(pick(IMAGE_RECEIVED_REPLIES));
}

export { enhance, search, received };
