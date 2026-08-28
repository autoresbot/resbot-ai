import moment from 'moment-timezone';
import api from '../../services/api.js';
import { downloadTiktok } from '../../services/downloader/tiktok.js';
import { downloadFacebook } from '../../services/downloader/facebook.js';
import { downloadInstagram } from '../../services/downloader/instagram.js';
import { LINK_INVALID, LINK_TIKTOK_FAILED, LINK_UNSUPPORTED } from '../responses.js';

const TIMEZONE = 'Asia/Jakarta';
const MAX_SLIDE_IMAGES = 8;

const formatTimestamp = (seconds) =>
  seconds ? moment(seconds * 1000).tz(TIMEZONE).format('DD-MM-YYYY, HH:mm:ss') : 'undefined';

/* ------------------------------- Handler ------------------------------- */

/** Info saluran (channel) WhatsApp. */
async function handleWhatsappChannel({ sendText, content }) {
  const data = await api.get('/api/stalker/whatsapp-group', { url: content });
  const totalFollower = data.channelDesc.match(/\d+/g) || [];

  await sendText(
    `Hai Kak, berikut informasi channel yang kamu kirimkan. Channel ini bernama *${data.groupName}* dengan memiliki *${totalFollower}* follower.`,
  );
}

/** Info grup WhatsApp dari link undangan. */
async function handleWhatsappGroup({ sock, sendText, sendInvalid, content }) {
  const res = await sock.query({
    tag: 'iq',
    attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' },
    content: [{ tag: 'invite', attrs: { code: content.split('/').pop() } }],
  });

  const attrs = res?.content?.[0]?.attrs;
  if (!attrs) return sendInvalid();

  const nameGroup = attrs.subject || 'undefined';
  const ownerCreated = attrs.creator ? `@${attrs.creator.split('@')[0]}` : 'undefined';

  await sendText(
    `Hai Kak, berikut informasi grup yang kamu kirimkan. Grup ini bernama *${nameGroup}* dengan total *${attrs.size || 'undefined'}* anggota. \n\nInformasi lengkapnya:\n - ID Grup: ${attrs.id || 'undefined'}\n - Dibuat pada: ${formatTimestamp(attrs.creation)}\n - Pembuat Grup: *${ownerCreated}*`,
  );
}

/** Video atau slide gambar TikTok. */
async function handleTiktok({ sock, remoteJid, message, sendText, content }) {
  try {
    const res = await downloadTiktok(content);

    if (res.type === 'video') {
      await sock.sendMessage(remoteJid, {
        video: { url: res.data.no_watermark },
        caption: res.data.title,
      });
      return;
    }

    if (res.type === 'slide') {
      for (const image of res.data.slice(0, MAX_SLIDE_IMAGES)) {
        await sock.sendMessage(remoteJid, { image: { url: image } });
      }
    }
  } catch {
    await sendText(LINK_TIKTOK_FAILED, { quoted: message });
  }
}

/** Video Facebook. */
async function handleFacebook({ sock, remoteJid, content }) {
  const res = await downloadFacebook(content);
  if (res && res.message) throw new Error(res.message);

  await sock.sendMessage(remoteJid, { video: { url: res }, caption: '' });
}

/** Media Instagram. */
async function handleInstagram({ sock, remoteJid, sendInvalid, content }) {
  try {
    const res = await downloadInstagram(content);

    if (content.includes('gambar')) {
      await sock.sendMessage(remoteJid, { image: { url: res }, caption: 'ini kak gambarnya' });
    } else {
      await sock.sendMessage(remoteJid, { video: { url: res }, caption: 'ini kak videonya' });
    }
  } catch {
    await sendInvalid();
  }
}

/** Pemetaan pola URL ke handler-nya, dicek berurutan. */
const HANDLERS = [
  { match: 'whatsapp.com/channel', handler: handleWhatsappChannel, guarded: true },
  { match: 'chat.whatsapp.com', handler: handleWhatsappGroup, guarded: true },
  { match: 'tiktok.com', handler: handleTiktok, guarded: false },
  { match: 'facebook.com', handler: handleFacebook, guarded: false },
  { match: 'instagram.com', handler: handleInstagram, guarded: false },
];

/** Memproses link yang dikirim user sesuai domainnya. */
async function linkAction({ sock, remoteJid, message, content }) {
  const sendText = (text, options = {}) => sock.sendMessage(remoteJid, { text }, options);
  const sendInvalid = (reason) => sendText(reason || LINK_INVALID, { quoted: message });

  const ctx = { sock, remoteJid, message, content, sendText, sendInvalid };
  const entry = HANDLERS.find(({ match }) => content.includes(match));

  if (!entry) {
    await sendText(LINK_UNSUPPORTED, { quoted: message });
    return;
  }

  // Handler ber-`guarded` menampilkan pesan "link tidak valid" bila API-nya gagal.
  if (!entry.guarded) {
    await entry.handler(ctx);
    return;
  }

  try {
    await entry.handler(ctx);
  } catch (error) {
    await sendInvalid(error);
  }
}

export { linkAction };
