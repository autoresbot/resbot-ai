import path from 'path';
import config from '../../config.js';
import { isValidJid } from '../utils/jid.js';
import { sendImageAsSticker } from '../services/sticker.js';
import { resetActiveFitur } from '../state/activeFeatures.js';
import { runAction, ALL_FEATURES } from './actions/index.js';

/** MIME type untuk pengiriman dokumen berdasarkan ekstensi file. */
const MIME_BY_EXTENSION = {
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const lookupMime = (fileName) =>
  MIME_BY_EXTENSION[path.extname(fileName).toLowerCase()] || 'application/octet-stream';

/* --------------------------- Pengirim per tipe --------------------------- */

const SENDERS = {
  async text({ sock, remoteJid, message, rule }) {
    await sock.sendMessage(remoteJid, { text: rule.reply_text }, { quoted: message });
  },

  async image({ sock, remoteJid, message, rule }) {
    if (!rule.image_url) return;
    await sock.sendMessage(
      remoteJid,
      { image: { url: rule.image_url }, caption: rule.reply_text || '' },
      { quoted: message },
    );
  },

  async document({ sock, remoteJid, message, rule }) {
    if (!rule.image_url) return;

    const fileName = path.basename(rule.image_url);

    if (rule.reply_text && rule.reply_text.trim() !== '') {
      await sock.sendMessage(remoteJid, { text: rule.reply_text }, { quoted: message });
    }

    await sock.sendMessage(
      remoteJid,
      { document: { url: rule.image_url }, fileName, mimetype: lookupMime(fileName) },
      { quoted: message },
    );
  },

  async button({ sock, remoteJid, message, rule }) {
    if (!rule.button_data || !rule.footer) return;

    // Format `button_data`: JSON array berisi string "Teks|id".
    const buttons = JSON.parse(rule.button_data).map((button) => {
      const [displayText, id] = button.split('|');
      return { buttonId: id, buttonText: { displayText }, type: 1 };
    });

    await sock.sendMessage(
      remoteJid,
      { text: rule.reply_text, footer: rule.footer, buttons },
      { quoted: message },
    );
  },

  async sticker({ sock, remoteJid, message, rule }) {
    if (!rule.image_url) return;
    await sendImageAsSticker(
      sock,
      remoteJid,
      rule.image_url,
      { packname: config.sticker_packname, author: config.sticker_author },
      message,
    );
  },

  async vn({ sock, remoteJid, message, rule }) {
    if (!rule.image_url) return;
    await sock.sendMessage(
      remoteJid,
      { audio: rule.image_url, mimetype: 'audio/mp4', ptt: true },
      { quoted: message },
    );
  },
};

/* -------------------------------- Publik --------------------------------- */

/**
 * Mengirim hasil sebuah rule ke user, lalu menjalankan aksi lanjutannya.
 * @param {object} rule Hasil dari router (message_type, reply_text, action, ...).
 */
async function sendReply(sock, remoteJid, rule, message) {
  if (!isValidJid(remoteJid)) {
    console.log('JID tidak valid, tidak mengirim:', remoteJid);
    return;
  }

  try {
    await SENDERS[rule.message_type]?.({ sock, remoteJid, message, rule });
    await runAction(rule, { sock, remoteJid, message });
  } catch (error) {
    for (const feature of ALL_FEATURES) {
      resetActiveFitur(remoteJid, feature);
    }

    await sock.sendMessage(
      remoteJid,
      { text: `${config.error.THROW} \n\n_*${error}*_` },
      { quoted: message },
    );
  }
}

export { sendReply };
