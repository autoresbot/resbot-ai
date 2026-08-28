/** Pemetaan tipe mentah Baileys ke nama tipe yang lebih pendek. */
const TYPE_ALIAS = {
  conversation: 'text',
  extendedTextMessage: 'text',
  senderKeyDistributionMessage: 'text',
  imageMessage: 'image',
  videoMessage: 'video',
  stickerMessage: 'sticker',
  audioMessage: 'audio',
  documentMessage: 'document',
  contactMessage: 'contact',
  locationMessage: 'location',
  reactionMessage: 'reaction',
  templateButtonReplyMessage: 'button_reply',
  viewOnceMessageV2: 'viewonce',
  pollCreationMessage: 'poll',
};

function getMessageType(rawMessageType) {
  return TYPE_ALIAS[rawMessageType] || 'unknown';
}

/**
 * Membaca informasi pesan yang dikutip (reply).
 * @returns objek detail quoted message, atau `false` bila bukan reply.
 */
function isQuotedMessage(message) {
  const contextInfo = message?.message?.extendedTextMessage?.contextInfo;
  const quoted = contextInfo?.quotedMessage;
  if (!quoted) return false;

  const sender = contextInfo.participant || null;
  if (!sender) return false;

  const rawMessageType = Object.keys(quoted)[0];
  const messageType = getMessageType(rawMessageType);

  return {
    sender,
    content: quoted[`${messageType}Message`],
    type: messageType,
    text: quoted[rawMessageType]?.text || quoted[rawMessageType] || '',
    id: contextInfo.stanzaId || null,
    rawMessageType: rawMessageType || '',
  };
}

/** Membuang spasi yang nyasar di karakter kedua, mis. `. halo` -> `.halo`. */
function removeSpace(input) {
  if (!input || typeof input !== 'string') return input;

  const characters = input.split('');
  if (characters[1] === ' ') characters.splice(1, 1);
  return characters.join('');
}

/** Memotong teks panjang untuk keperluan log. */
function truncate(text, maxLength = 10) {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export { getMessageType, isQuotedMessage, removeSpace, truncate };
