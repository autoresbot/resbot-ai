/**
 * Pembungkus bentuk balasan yang dipakai seluruh rule.
 * Setiap rule mengembalikan objek hasil helper di bawah ini (atau `null` bila tidak cocok).
 */

/** Balasan teks biasa. `extra` dipakai untuk menyisipkan `action` lanjutan. */
const text = (reply_text, extra = {}) => ({
  status: true,
  message_type: 'text',
  reply_text,
  ...extra,
});

/** Balasan berupa sticker dari buffer/URL gambar. */
const sticker = (image_url) => ({
  status: true,
  message_type: 'sticker',
  image_url,
});

/**
 * Aksi lanjutan yang dijalankan setelah balasan teks terkirim,
 * mis. mengunduh lagu atau memproses gambar HD.
 */
const action = (features, content, extra = {}) => ({ action: { features, content, ...extra } });

export { text, sticker, action };
