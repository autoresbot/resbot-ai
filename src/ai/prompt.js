import config from '../../config.js';
import { getHistory } from './history.js';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Waktu sekarang dalam zona WIB, siap dibaca manusia. */
function currentTimeWIB() {
  const now = new Date();
  const wib = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 7 * 60 * 60 * 1000);

  const hours = String(wib.getHours()).padStart(2, '0');
  const minutes = String(wib.getMinutes()).padStart(2, '0');

  return `${wib.getDate()} ${MONTHS[wib.getMonth()]} ${wib.getFullYear()} jam ${hours}:${minutes} WIB`;
}

/** Menyusun prompt lengkap: persona bot + riwayat percakapan + pesan terbaru. */
function buildPrompt(userId, prompt) {
  return `
Kamu adalah ${config.name_bot} buatan ${config.owner_name}.
Website: ${config.owner_website}
Waktu sekarang: ${currentTimeWIB()}
Jawab singkat, ramah, dan jelas.

${getHistory(userId).join('\n')}
User: ${prompt}
AI:
`.trim();
}

export { buildPrompt, currentTimeWIB };
