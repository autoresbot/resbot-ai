import config from '../../../config.js';
import { text, action } from '../replies.js';
import { pick } from '../../utils/random.js';
import { updateSession } from '../../state/session.js';
import { getActiveFitur, setActiveFitur } from '../../state/activeFeatures.js';
import { reduceLimit } from '../../state/users.js';
import { SONG_QUESTIONS, SONG_QUESTION_REPLIES, SONG_KEYWORDS } from '../responses.js';

/** Pertanyaan seperti "bisa carikan lagu?" - dijawab dulu, lagunya menyusul. */
async function songQuestion(ctx) {
  if (!SONG_QUESTIONS.some((keyword) => ctx.text.includes(keyword))) return null;

  updateSession(ctx.sender, 'play');
  return text(pick(SONG_QUESTION_REPLIES));
}

/** Membersihkan kata kunci pemicu sehingga tersisa judul lagunya saja. */
function extractSongTitle(message) {
  const withoutKeywords = SONG_KEYWORDS.reduce(
    (result, keyword) => result.replace(new RegExp(keyword, 'gi'), '').trim(),
    message,
  );

  return withoutKeywords.replace(/carikan|cari|tolong/g, '').trim();
}

/** Permintaan putar lagu, mis. "play kangen band terbang". */
async function playSong(ctx) {
  if (!SONG_KEYWORDS.some((keyword) => ctx.text.includes(keyword))) return null;

  if (getActiveFitur(ctx.remoteJid, 'play')) return text(config.notification.waiting);

  setActiveFitur(ctx.sender, 'play');
  reduceLimit(ctx.sender);

  const title = extractSongTitle(ctx.text);
  if (title.length < 3) {
    return text(
      `Hai kak lagu apa yang ingin kamu dengar ? \n\nContoh : *play kangen band terbang*`,
    );
  }

  return text(
    `Mohon Tunggu Sebentar ya kak 😉, Saya akan mencarikan lagu *${title}*`,
    action('play', title),
  );
}

export { songQuestion, playSong };
