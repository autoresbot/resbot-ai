/**
 * Penanda fitur yang sedang berjalan per user.
 * Mencegah user memicu proses berat (play/hd/pin/download) dua kali sekaligus.
 */

const activeFeatures = new Map();

function setActiveFitur(userId, fitur) {
  if (!userId || !fitur) return;

  const current = activeFeatures.get(userId) ?? [];
  if (!current.includes(fitur)) {
    current.push(fitur);
    activeFeatures.set(userId, current);
  }
}

/** Mengembalikan nama fitur bila sedang aktif, selain itu `null`. */
function getActiveFitur(userId, fitur) {
  if (!userId || !fitur) return;

  return activeFeatures.get(userId)?.includes(fitur) ? fitur : null;
}

function resetActiveFitur(userId, fitur) {
  if (!userId || !fitur) return;

  const current = activeFeatures.get(userId);
  if (current?.includes(fitur)) {
    activeFeatures.set(
      userId,
      current.filter((item) => item !== fitur),
    );
  }
}

export { setActiveFitur, getActiveFitur, resetActiveFitur };
