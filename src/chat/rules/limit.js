import config from '../../../config.js';
import { text } from '../replies.js';

/** Menghentikan pemrosesan bila limit harian user sudah habis (owner dikecualikan). */
function limitGuard({ limit, isOwner }) {
  if (!limit && !isOwner) return text(config.notification.limit);
  return null;
}

export { limitGuard };
