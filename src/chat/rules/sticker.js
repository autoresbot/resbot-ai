import { text, sticker } from '../replies.js';
import { pick } from '../../utils/random.js';
import { getSession, updateSession } from '../../state/session.js';
import { downloadAndSaveMedia, downloadQuotedMedia } from '../../services/media.js';
import { STICKER_KEYWORDS, STICKER_REPLIES } from '../responses.js';

/** Perintah sticker yang harus cocok persis. */
const STICKER_COMMANDS = ['.s', 's', 'sticker', 'stiker', '.sticker', '.stiker', '.stick'];

/** Kata kunci sticker yang boleh muncul di tengah kalimat. */
const STICKER_WORDS = ['sticker', 'stiker', 'stikker'];

const isMedia = (messageType) =>
  messageType === 'imageMessage' || messageType === 'videoMessage';

/** Gambar/video dengan caption `s`, `sticker`, dst. */
async function stickerCommand(ctx) {
  if (!isMedia(ctx.messageType) || !STICKER_COMMANDS.includes(ctx.text)) return null;

  const media = await downloadAndSaveMedia(ctx.message, ctx.sock);
  return sticker(media.buffer);
}

/** Membalas sebuah media dengan kata "sticker". */
async function stickerFromQuoted(ctx) {
  if (!ctx.isQuoted || !STICKER_WORDS.some((keyword) => ctx.text.includes(keyword))) return null;

  // Pesan yang dibalas ternyata bukan media -> biarkan rule berikutnya yang menjawab.
  const media = await downloadQuotedMedia(ctx.message);
  if (!media) return null;

  return sticker(media.buffer);
}

/** Gambar/video yang captionnya menyinggung sticker. */
async function stickerFromKeyword(ctx) {
  if (!isMedia(ctx.messageType)) return null;
  if (!STICKER_KEYWORDS.some((keyword) => ctx.text.includes(keyword))) return null;

  const media = await downloadAndSaveMedia(ctx.message, ctx.sock);
  return sticker(media.buffer);
}

/** Gambar/video yang dikirim setelah bot meminta gambar untuk dijadikan sticker. */
async function stickerFromSession(ctx) {
  if (!isMedia(ctx.messageType) || !ctx.session) return null;

  const session = getSession(ctx.sender);
  if (session.action !== 'sticker') return null;

  updateSession(ctx.sender, 'sticker');
  const media = await downloadAndSaveMedia(ctx.message, ctx.sock);
  return sticker(media.buffer);
}

/** Permintaan sticker tanpa media - bot meminta gambarnya dulu. */
async function stickerPrompt(ctx) {
  if (!STICKER_WORDS.some((keyword) => ctx.text.includes(keyword))) return null;

  updateSession(ctx.sender, 'sticker');
  return text(pick(STICKER_REPLIES));
}

export {
  stickerCommand,
  stickerFromQuoted,
  stickerFromKeyword,
  stickerFromSession,
  stickerPrompt,
};
