import config from '../../../config.js';
import { enhanceImage } from '../../services/enhancer.js';

/** Memperjelas gambar lalu mengirimkan hasilnya. */
async function enhanceAction({ sock, remoteJid, message, content }) {
  try {
    const media = await enhanceImage(content);
    if (!media) throw new Error('HDR media returned undefined or null');

    await sock.sendMessage(
      remoteJid,
      { image: media, caption: config.success.hd },
      { quoted: message },
    );
  } catch (error) {
    await sock.sendMessage(
      remoteJid,
      { text: error.message || error || config.error.HD_ERROR },
      { quoted: message },
    );
  }
}

export { enhanceAction };
