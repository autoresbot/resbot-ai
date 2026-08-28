import { playAction } from './play.js';
import { enhanceAction } from './enhance.js';
import { imageSearchAction } from './imageSearch.js';
import { linkAction } from './link.js';
import { resetActiveFitur } from '../../state/activeFeatures.js';

/**
 * Aksi lanjutan yang dijalankan setelah balasan teks terkirim.
 * `release` adalah nama penanda fitur yang dibebaskan setelah aksi selesai.
 */
const ACTIONS = {
  play: { run: playAction, release: 'play' },
  hd: { run: enhanceAction, release: 'hd' },
  pin: { run: imageSearchAction, release: 'pin' },
  detect_link: { run: linkAction, release: 'download' },
};

/** Semua penanda fitur, dibebaskan sekaligus bila terjadi error. */
const ALL_FEATURES = Object.values(ACTIONS).map(({ release }) => release);

/** Menjalankan aksi lanjutan dari sebuah rule, bila ada. */
async function runAction(rule, { sock, remoteJid, message }) {
  const { features, content } = rule.action ?? {};
  if (!features || !content) return;

  const entry = ACTIONS[features];
  if (!entry) return;

  await entry.run({ sock, remoteJid, message, content });
  resetActiveFitur(remoteJid, entry.release);
}

export { runAction, ALL_FEATURES };
