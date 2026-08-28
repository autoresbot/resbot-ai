import config from '../../config.js';

const { HISTORY_LIMIT } = config.AI;

/** Riwayat percakapan per user, disimpan di memori (hilang saat bot restart). */
const histories = new Map();

/** Mengambil riwayat percakapan user sebagai array baris teks. */
function getHistory(userId) {
  return histories.get(userId) ?? [];
}

/** Menyimpan satu putaran percakapan dan memangkasnya sesuai `AI.HISTORY_LIMIT`. */
function saveHistory(userId, prompt, reply) {
  const history = getHistory(userId);
  history.push(`User: ${prompt}`, `AI: ${reply}`);

  histories.set(userId, history.length > HISTORY_LIMIT ? history.slice(-HISTORY_LIMIT) : history);
}

/** Menghapus riwayat percakapan user (dipakai perintah `reset`). */
function clearHistory(userId) {
  histories.delete(userId);
}

export { getHistory, saveHistory, clearHistory };
