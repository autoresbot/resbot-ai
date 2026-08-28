import config from '../../../config.js';
import { searchImage } from '../../services/imageSearch.js';

/** Mencari gambar berdasarkan kata kunci lalu mengirimkannya. */
async function imageSearchAction({ sock, remoteJid, message, content }) {
  try {
    const media = await searchImage(content);

    if (!media?.status || !Buffer.isBuffer(media.data)) {
      throw new Error(
        media?.message || 'Media bukan buffer atau tidak valid, Silakan coba kembali',
      );
    }

    await sock.sendMessage(
      remoteJid,
      { image: media.data, caption: `Ini kak gambar *${content}* nya` },
      { quoted: message },
    );
  } catch (error) {
    await sock.sendMessage(
      remoteJid,
      { text: error.message || error || config.error.IMAGE_ERROR },
      { quoted: message },
    );
  }
}

export { imageSearchAction };
