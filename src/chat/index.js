import config from '../../config.js';
import { AI_TEXT } from '../ai/index.js';
import { getSession } from '../state/session.js';
import { getUser, checkLimit, reduceLimit } from '../state/users.js';
import { route } from './router.js';
import { sendReply } from './reply.js';

/** Prefix perintah yang boleh dipakai user. */
const COMMAND_PREFIX = /^[.#!]/;

/** Bentuk balasan baku yang diterima `sendReply`. */
function createRule(reply) {
  return {
    message_type: reply.message_type || null,
    reply_text: reply.reply_text || null,
    image_url: reply.image_url || null,
    footer: reply.footer || null,
    button_data: reply.button_data || null,
    action: reply.action || null,
  };
}

/** Menyusun konteks yang dipakai seluruh rule. */
function buildContext(incoming) {
  const user = getUser(incoming.sender);

  return {
    ...incoming,
    text: incoming.content.toLowerCase().replace(COMMAND_PREFIX, '').trim(),
    session: getSession(incoming.sender),
    user,
    limit: checkLimit(user),
    isOwner: config.owner_number.includes(incoming.sender),
  };
}

/** Fallback ke AI eksternal ketika tidak ada rule lokal yang cocok. */
async function askExternalAi({ sender, content }) {
  try {
    reduceLimit(sender);
    return {
      status: true,
      message_type: 'text',
      reply_text: await AI_TEXT(sender, content),
    };
  } catch {
    return {
      status: false,
      message_type: 'error',
      reply_text: 'Something went wrong while processing the message.',
    };
  }
}

/**
 * Alur utama sebuah pesan masuk:
 * rule lokal -> (bila tidak ada yang cocok) AI eksternal -> kirim balasan.
 */
async function handleChat(incoming) {
  const { sock, remoteJid, message } = incoming;

  try {
    const ctx = buildContext(incoming);
    let rule;

    // 1. Coba jawab dengan rule lokal.
    let localReply;
    try {
      localReply = await route(ctx);
    } catch (error) {
      console.error('ERROR route:', error);
    }

    if (localReply?.status) rule = createRule(localReply);

    // 2. Tidak ada rule yang cocok -> serahkan ke AI eksternal.
    if (!localReply) {
      try {
        await sock.sendPresenceUpdate('composing', remoteJid);
      } catch (error) {
        console.error('ERROR sendPresenceUpdate:', error);
      }

      const aiReply = await askExternalAi(ctx);
      if (!aiReply.status) {
        console.log('Error AI, Periksa Apikey AI Anda');
        return;
      }

      rule = createRule(aiReply);
    }

    // 3. Kirim balasan lewat socket aktif (bisa berubah setelah reconnect).
    return await sendReply(global.sock ?? sock, remoteJid, rule, message);
  } catch (error) {
    console.error('FATAL handleChat ERROR:', error);
  }
}

export { handleChat };
