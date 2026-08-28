import crypto from 'crypto';
import path from 'path';
import { writeFile } from 'fs/promises';
import { downloadMediaMessage, downloadContentFromMessage } from 'baileys';
import { TMP_DIR } from '../utils/files.js';
import { silentLogger } from '../utils/logger.js';

/** Ekstensi default per jenis media. */
const EXTENSION_BY_TYPE = {
  image: '.jpg',
  video: '.mp4',
  audio: '.mp3',
  sticker: '.webp',
};

/** Tipe pesan yang isinya media dan bisa diunduh. */
const MEDIA_MESSAGE_TYPES = [
  'imageMessage',
  'videoMessage',
  'audioMessage',
  'documentMessage',
  'stickerMessage',
];

/**
 * Memeriksa apakah sebuah pesan benar-benar membawa media.
 * Dipakai untuk memberi pesan bantuan yang jelas sebelum mencoba mengunduh,
 * karena `downloadAndSaveMedia` akan melempar error pada pesan teks biasa.
 */
function hasMedia(message) {
  const msg = message?.message;
  if (!msg) return false;

  if (MEDIA_MESSAGE_TYPES.some((type) => msg[type])) return true;

  const viewOnce = msg.viewOnceMessage?.message ?? msg.viewOnceMessageV2?.message;
  return Boolean(viewOnce && MEDIA_MESSAGE_TYPES.some((type) => viewOnce[type]));
}

function randomFileName(extension) {
  return `${crypto.randomBytes(16).toString('hex')}${extension}`;
}

/**
 * Mengunduh media dari sebuah pesan, menyimpannya ke folder tmp.
 * @returns {Promise<{buffer: Buffer, filePath: string}>}
 */
async function downloadAndSaveMedia(message, sock) {
  try {
    const filePath = path.join(TMP_DIR, randomFileName('.jpg'));

    const buffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger: silentLogger,
        reuploadRequest: sock.updateMediaMessage,
      },
    );

    await writeFile(filePath, buffer);

    return { buffer, filePath };
  } catch (error) {
    console.error('Error downloading and saving media:', error);
    throw new Error(`Error downloading and saving media: ${error.message}`);
  }
}

/** Menentukan jenis media dan payload dari sebuah pesan yang dikutip. */
function resolveQuotedMedia(quotedMessage) {
  if (quotedMessage.imageMessage) return { mediaType: 'image', mediaMessage: quotedMessage.imageMessage };
  if (quotedMessage.videoMessage) return { mediaType: 'video', mediaMessage: quotedMessage.videoMessage };
  if (quotedMessage.audioMessage) return { mediaType: 'audio', mediaMessage: quotedMessage.audioMessage };
  if (quotedMessage.documentMessage) return { mediaType: 'document', mediaMessage: quotedMessage.documentMessage };
  if (quotedMessage.stickerMessage) return { mediaType: 'sticker', mediaMessage: quotedMessage.stickerMessage };
  if (quotedMessage.viewOnceMessageV2) {
    return { mediaType: 'image', mediaMessage: quotedMessage.viewOnceMessageV2.message.imageMessage };
  }
  return null;
}

/**
 * Mengunduh media dari pesan yang dikutip (reply).
 * @returns {Promise<{buffer: Buffer, filePath: string}|null>} `null` bila pesan tidak mengutip media.
 */
async function downloadQuotedMedia(message) {
  try {
    const quotedMessage = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMessage) return null;

    const resolved = resolveQuotedMedia(quotedMessage);
    if (!resolved) return null;

    const { mediaType, mediaMessage } = resolved;
    const stream = await downloadContentFromMessage(mediaMessage, mediaType);

    const fileName = mediaMessage.fileName || `${mediaType}_${Date.now()}`;
    const fileExtension =
      mediaType === 'document'
        ? path.extname(mediaMessage.fileName || '.bin')
        : EXTENSION_BY_TYPE[mediaType] || '';

    const finalFileName = fileName.endsWith(fileExtension) ? fileName : `${fileName}${fileExtension}`;
    const filePath = path.join(TMP_DIR, finalFileName);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    await writeFile(filePath, buffer);

    return { buffer, filePath };
  } catch (error) {
    console.error('Gagal mengunduh media:', error);
    return null;
  }
}

export { hasMedia, downloadAndSaveMedia, downloadQuotedMedia };
