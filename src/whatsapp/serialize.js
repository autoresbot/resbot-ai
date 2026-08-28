import { isQuotedMessage } from '../utils/message.js';

/**
 * Mengubah payload mentah `messages.upsert` dari Baileys menjadi objek pesan
 * yang seragam dan mudah dipakai handler.
 *
 * Mengembalikan `null` untuk pesan yang memang tidak perlu diproses
 * (reaction, polling, pesan yang di-pin/diedit, pesan tanpa isi teks, dst).
 */

/** Isi pesan berdasarkan tipe utamanya. */
function baseContent(msg, messageType) {
  switch (messageType) {
    case 'conversation':
      return msg.conversation;
    case 'extendedTextMessage':
      return msg.extendedTextMessage.text;
    case 'senderKeyDistributionMessage':
      return msg.conversation;
    case 'imageMessage':
      return msg.imageMessage.caption || 'No caption';
    case 'videoMessage':
      return msg.videoMessage.caption || 'No caption';
    case 'stickerMessage':
      return 'stickerMessage';
    case 'audioMessage':
      return 'audioMessage';
    case 'templateButtonReplyMessage':
      return msg.templateButtonReplyMessage.selectedId;
    default:
      return '';
  }
}

/** Pesan yang selalu diabaikan bot. */
function isIgnored(msg) {
  return Boolean(
    msg.reactionMessage ||
      msg.pollUpdateMessage ||
      msg.pinInChatMessage ||
      msg.editedMessage?.message ||
      msg.protocolMessage?.editedMessage?.message ||
      msg.protocolMessage?.type === 17,
  );
}

/**
 * Menyempurnakan tipe & isi pesan untuk kasus-kasus khusus
 * (media dengan caption, polling, album, dokumen, pesan terenkripsi grup, ...).
 */
function refine(msg, messageType, content) {
  let type = messageType;
  let body = content;

  const set = (newType, newBody) => {
    type = newType;
    body = newBody;
  };

  // Pesan grup terenkripsi: isi aslinya menempel di field lain.
  if (type === 'senderKeyDistributionMessage') {
    const text = msg.extendedTextMessage?.text;
    if (text) set('conversation', text);
  }

  if (msg.imageMessage?.caption) set('imageMessage', msg.imageMessage.caption);
  if (msg.stickerMessage) set('stickerMessage', 'stickerMessage');
  if (msg.pollResultSnapshotMessage) {
    set('pollResultSnapshotMessage', msg.pollResultSnapshotMessage.name);
  }

  if (msg.senderKeyDistributionMessage && !body) {
    body = msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || null;
    if (body) type = 'conversation';

    if (msg.stickerMessage) set('stickerMessage', 'stickerMessage');
    if (msg.videoMessage) set('videoMessage', msg.videoMessage.caption || '');
  }

  if (msg.imageMessage && !body) set('imageMessage', msg.imageMessage.caption || body);
  if (msg.extendedTextMessage && !body) set('extendedTextMessage', msg.extendedTextMessage.text);

  if (type === 'messageContextInfo') {
    type = 'pollCreationMessage';
    const name = msg.pollCreationMessageV3?.name;
    if (name) body = name;
  }

  const viewOnceCaption = msg.viewOnceMessage?.message?.buttonsMessage?.documentMessage?.caption;
  if (viewOnceCaption) set('viewOnceMessage', viewOnceCaption);

  if (msg.albumMessage) type = 'albumMessage';

  if (msg.buttonsMessage?.contentText) set('buttonsMessage', msg.buttonsMessage.contentText);

  if (type === 'viewOnceMessage') {
    const contentText = msg.viewOnceMessage?.message?.buttonsMessage?.contentText;
    if (contentText) body = contentText;
  }

  const editedText =
    msg.protocolMessage?.type === 14 ? msg.protocolMessage?.editedMessage?.conversation : null;
  if (editedText) set('editedMessage', editedText);

  if (msg.documentMessage) set('documentMessage', msg.documentMessage.fileName || 'Tidak diketahui');

  return { messageType: type, content: body };
}

function serializeMessage(m) {
  try {
    const message = m?.messages?.[0];
    if (!message || m.type === 'append') return null;

    const msg = message.message;
    if (!msg) {
      console.log('message.message null!');
      return null;
    }

    if (isIgnored(msg)) return null;

    const rawType = Object.keys(msg)[0];
    const { messageType, content } = refine(msg, rawType, baseContent(msg, rawType));

    if (!content) return null;
    if (messageType === 'senderKeyDistributionMessage') return null;

    const key = message.key || {};
    const remoteJid = key.remoteJidAlt || key.remoteJid || '';
    const participant = key.participantAlt || key.participant || message.participant || '';
    const isGroup = typeof remoteJid === 'string' && remoteJid.endsWith('@g.us');
    const isQuoted = isQuotedMessage(message);
    const contextInfo = msg.extendedTextMessage?.contextInfo;

    return {
      id: key.id || '',
      timestamp: message.messageTimestamp,
      sender: isGroup ? participant : remoteJid,
      pushName: message.pushName || '',
      isGroup,
      fromMe: key.fromMe || false,
      remoteJid,
      messageType,
      content,
      message,
      fullText: content,
      isQuoted,
      quotedMessage: isQuoted
        ? {
            text: contextInfo.quotedMessage?.conversation || '',
            sender: contextInfo.participant || '',
            id: contextInfo.stanzaId || '',
          }
        : null,
    };
  } catch {
    return null;
  }
}

export default serializeMessage;
