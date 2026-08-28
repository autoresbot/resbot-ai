/**
 * Blok bangunan tampilan bot.
 *
 * Semua teks yang ditampilkan ke user (menu, info, daftar, status) disusun
 * dari helper di sini supaya gayanya seragam dan gampang diubah di satu tempat.
 */

/** Garis pemisah antar bagian. */
const DIVIDER = '━━━━━━━━━━━━━━━━━━';

/** Judul utama sebuah tampilan, mis. `🤖 *RESBOT AI*`. */
const heading = (emoji, title) => `${emoji} *${String(title).toUpperCase()}*`;

/** Satu baris daftar: `› label — keterangan`. */
const item = (label, description) => (description ? `› ${label} — ${description}` : `› ${label}`);

/** Satu baris perintah: `› \`.play <judul>\` — Cari lagu`. */
const command = (usage, description) => item(`\`${usage}\``, description);

/**
 * Satu kelompok baris dengan judul kecil.
 * @param {string} title Judul kelompok, mis. `DOWNLOADER`.
 * @param {string[]} lines Baris-baris hasil `item()` / `command()`.
 */
const section = (title, lines) => [`*${title}*`, ...lines].join('\n');

/**
 * Menggabungkan potongan teks menjadi satu blok.
 * `null`/`undefined` dibuang (bagian opsional), string kosong dipertahankan
 * karena dipakai sebagai baris pemisah.
 */
const block = (parts) => parts.filter((part) => part !== null && part !== undefined).join('\n');

export { DIVIDER, heading, item, command, section, block };
