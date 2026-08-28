import config from '../../config.js';
import { normalizeJid } from '../utils/jid.js';
import { DIVIDER, heading, command, section, block } from '../utils/format.js';

/**
 * Isi menu bot.
 *
 * Menambah perintah baru = tambah satu baris `[usage, keterangan]` di grup
 * yang sesuai. Tampilannya otomatis mengikuti gaya yang sama.
 */

const MAIN_SECTIONS = [
  ['AI', [['.ai <pesan>', 'Chat dengan AI']]],
  [
    'DOWNLOADER',
    [
      ['.fb <link>', 'Facebook'],
      ['.ig <link>', 'Instagram'],
      ['.tiktok <link>', 'TikTok'],
      ['.play <judul>', 'Cari lagu'],
    ],
  ],
  [
    'MEDIA',
    [
      ['.hd <foto>', 'Perjelas gambar'],
      ['.sticker <foto>', 'Buat stiker'],
      ['.qc <teks>', 'Quoted creator'],
      ['.brat <teks>', 'Brat sticker'],
      ['.bratvid <teks>', 'Brat sticker bergerak'],
    ],
  ],
  [
    'INFORMASI',
    [
      ['.info', 'Informasi bot'],
      ['.id', 'ID pengguna'],
      ['.limit', 'Cek limit'],
      ['.apikey', 'Kelola API Key'],
      ['.reset', 'Reset percakapan'],
    ],
  ],
];

const OWNER_SECTIONS = [
  [
    'OWNER',
    [
      ['.addprem <nomor> <hari>', 'Tambah premium'],
      ['.delprem <nomor>', 'Hapus premium'],
      ['.editprem <nomor> <hari>', 'Ubah masa premium'],
      ['.listprem', 'Daftar premium'],
      ['.listusers', 'Semua pengguna'],
      ['.resetdata', 'Reset semua data'],
    ],
  ],
];

/** Merangkai daftar section menjadi teks, dipisah baris kosong. */
function renderSections(sections) {
  return sections
    .map(([title, commands]) => section(title, commands.map(([usage, desc]) => command(usage, desc))))
    .join('\n\n');
}

/** Menu utama. `sections` bisa ditambah bagian owner bila perlu. */
function menuMain(botName, sections = MAIN_SECTIONS) {
  return block([
    heading('🤖', botName),
    'Asisten WhatsApp yang siap membantu.',
    '',
    DIVIDER,
    renderSections(sections),
    DIVIDER,
    '',
    'Ketik perintah sesuai format.',
    'Contoh: `.ai Apa itu teknologi AI?`',
  ]);
}

/** Menu khusus owner, berdiri sendiri. */
const menuOwner = block([
  heading('👑', 'Menu Owner'),
  'Akses khusus pemilik bot.',
  '',
  DIVIDER,
  renderSections(OWNER_SECTIONS),
  DIVIDER,
  '',
  'Contoh: `.addprem 6285246154386 30`',
]);

/** Menu utama; bagian owner ikut tampil bila pengirimnya owner. */
function displayMenu(remoteJid) {
  const number = normalizeJid(remoteJid);
  const isOwner = config.owner_number.some((owner) => normalizeJid(owner) === number);

  return menuMain(config.name_bot, isOwner ? [...MAIN_SECTIONS, ...OWNER_SECTIONS] : MAIN_SECTIONS);
}

export { menuMain, menuOwner, displayMenu, MAIN_SECTIONS, OWNER_SECTIONS };
