import config from '../../../config.js';
import { text, action } from '../replies.js';
import { pick } from '../../utils/random.js';
import { detectLink } from '../../utils/link.js';
import { getActiveFitur, setActiveFitur } from '../../state/activeFeatures.js';
import { reduceLimit } from '../../state/users.js';
import { LINK_DETECTED_REPLIES } from '../responses.js';

/** Mendeteksi link di dalam pesan lalu menyerahkannya ke aksi `detect_link`. */
async function incomingLink(ctx) {
  const detected = detectLink(ctx.content);
  if (!detected) return null;

  if (getActiveFitur(ctx.remoteJid, 'download')) return text(config.notification.waiting);

  setActiveFitur(ctx.sender, 'download');
  reduceLimit(ctx.sender);

  return text(
    pick(LINK_DETECTED_REPLIES),
    action('detect_link', detected.link, { name: detected.name }),
  );
}

export { incomingLink };
