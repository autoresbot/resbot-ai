import config from '../../../config.js';
import { text, sticker } from '../replies.js';
import { block, heading, item } from '../../utils/format.js';
import api from '../../services/api.js';

const DEFAULT_PP = 'https://api.autoresbot.com/api/maker/pp-default';
const PROFILE_PICTURE_TIMEOUT_MS = 10000;

/** Mengambil argumen di belakang nama perintah, mis. `brat halo` -> `halo`. */
const argsOf = (input, command) => input.slice(command.length).trim();

/** Teks bantuan seragam untuk perintah pembuat sticker. */
const usage = (name, example) =>
  block([heading('🎨', name), '', item('Format', `\`.${name} <teks>\``), item('Contoh', `\`${example}\``)]);

/** Foto profil pengirim, dengan fallback bila WhatsApp lambat / foto disembunyikan. */
async function profilePicture(sock, sender) {
  return Promise.race([
    sock.profilePictureUrl(sender, 'image'),
    new Promise((resolve) => setTimeout(() => resolve(DEFAULT_PP), PROFILE_PICTURE_TIMEOUT_MS)),
  ]).catch(() => DEFAULT_PP);
}

/**
 * Memanggil endpoint maker dan membungkus hasilnya jadi sticker.
 * @param {string} endpoint Endpoint API Autoresbot.
 * @param {object} params Parameter query.
 * @param {string} errorText Pesan bila API gagal.
 */
async function makeSticker(endpoint, params, errorText) {
  try {
    return sticker(await api.getBuffer(endpoint, params));
  } catch {
    return text(errorText);
  }
}

/** `qc <teks>` - sticker quoted chat memakai nama & foto profil pengirim. */
async function quotedChat(ctx) {
  if (!ctx.text.startsWith('qc')) return null;

  const pp = await profilePicture(ctx.sock, ctx.sender);
  const content = argsOf(ctx.text, 'qc');

  if (!content) return text(config.notification.qc_help);

  return makeSticker(
    '/api/maker/qc',
    { name: ctx.pushName, text: content, pp },
    config.error.qc,
  );
}

/** `bratvid <teks>` - sticker brat versi bergerak. */
async function bratVideo(ctx) {
  if (!ctx.text.startsWith('bratvid')) return null;

  const content = argsOf(ctx.text, 'bratvid');
  if (!content) return text(usage('bratvid', '.bratvid resbot ai'));

  return makeSticker(
    '/api/maker/bratvid',
    { name: ctx.pushName, text: content },
    config.error.bratvid,
  );
}

/** `brat <teks>` - sticker bergaya brat. */
async function brat(ctx) {
  // `bratvid` ditangani rule tersendiri di atas.
  if (!ctx.text.startsWith('brat') || ctx.text.startsWith('bratvid')) return null;

  const content = argsOf(ctx.text, 'brat');
  if (!content) return text(usage('brat', '.brat resbot'));

  return makeSticker(
    '/api/maker/brat',
    { name: ctx.pushName, text: content },
    config.error.brat,
  );
}

export { quotedChat, bratVideo, brat };
