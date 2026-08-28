/**
 * Sesi percakapan sederhana di memori.
 * Dipakai untuk mengingat "aksi terakhir" user, mis. sedang menunggu gambar sticker.
 */

const SESSION_TTL_SECONDS = 60;

const sessions = new Map();

/** Mengambil sesi user. Sesi yang lebih tua dari TTL akan diperbarui ke `action` baru. */
function getSession(remoteJid, action = '') {
  const session = sessions.get(remoteJid);
  if (!session) return null;

  const elapsedSeconds = (Date.now() - session.startTime) / 1000;
  if (elapsedSeconds > SESSION_TTL_SECONDS) {
    session.startTime = new Date();
    session.action = action;
    sessions.set(remoteJid, session);
  }

  return session;
}

/** Membuat sesi baru bila belum ada, lalu mengembalikan sesi terkini. */
function updateSession(remoteJid, action = '') {
  if (!sessions.has(remoteJid)) {
    sessions.set(remoteJid, { startTime: new Date(), remoteJid, action });
  }

  return getSession(remoteJid, action);
}

/** Menghapus sesi user (dipakai perintah `reset`). */
function resetSession(remoteJid) {
  sessions.delete(remoteJid);
}

export { getSession, updateSession, resetSession };
