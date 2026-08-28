import config from '../../../config.js';
import { searchSong, fetchAudioUrl } from '../../services/downloader/youtube.js';

/** Mencari lagu di YouTube lalu mengirimkan audionya. */
async function playAction({ sock, remoteJid, message, content }) {
  const songInfo = await searchSong(content);

  if (!songInfo) {
    await sock.sendMessage(remoteJid, { text: config.error.PLAY_ERROR }, { quoted: message });
    return;
  }

  const audioUrl = await fetchAudioUrl(songInfo.url);

  await sock.sendMessage(
    remoteJid,
    {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: songInfo.title || 'Untitled',
          body: config.owner_name,
          sourceUrl: songInfo.url,
          thumbnailUrl: songInfo.image || 'https://example.com/default_thumbnail.jpg',
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      },
    },
    { quoted: message },
  );
}

export { playAction };
