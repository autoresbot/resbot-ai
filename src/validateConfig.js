import chalk from 'chalk';
import config from '../config.js';
import { normalizeJid, isValidPhoneNumber } from './utils/jid.js';

/**
 * Memeriksa `config.js` sebelum bot menyambung ke WhatsApp.
 *
 * Nomor yang belum diisi atau tidak lengkap (mis. masih `628xxx`) membuat
 * pairing code gagal dan sesi tersimpan setengah jalan, jadi lebih baik
 * dihentikan lebih awal dengan pesan yang jelas.
 */

const PHONE_EXAMPLE = '6285124002201';

/** Memeriksa satu nomor dan mengembalikan alasan kesalahannya, atau `null` bila valid. */
function checkPhoneNumber(value, label) {
  const number = String(value ?? '').trim();

  if (!number) {
    return `${label} masih kosong. Isi nomor lengkap, contoh: ${PHONE_EXAMPLE}`;
  }

  if (!/^[0-9]+$/.test(number)) {
    return `${label} masih berisi karakter selain angka: "${number}". Tulis nomor lengkap tanpa +, spasi, atau tanda hubung, contoh: ${PHONE_EXAMPLE}`;
  }

  if (!isValidPhoneNumber(number)) {
    const masalah = number.length < 10 ? 'belum lengkap' : 'kepanjangan';
    return `${label} ${masalah}: "${number}" terdiri dari ${number.length} digit. Nomor harus 10-15 digit, contoh: ${PHONE_EXAMPLE}`;
  }

  return null;
}

/** Mengumpulkan seluruh kesalahan konfigurasi yang membuat bot tidak bisa jalan. */
function collectErrors() {
  const errors = [];

  const phoneError = checkPhoneNumber(config.phone_number_bot, '`phone_number_bot`');
  if (phoneError) errors.push(phoneError);

  config.owner_number.forEach((owner, index) => {
    const ownerError = checkPhoneNumber(
      normalizeJid(String(owner ?? '')).split('@')[0],
      `\`owner_number[${index}]\``,
    );
    if (ownerError) errors.push(ownerError);
  });

  return errors;
}

/**
 * Menjalankan validasi config.
 * @returns {boolean} `true` bila config aman untuk dilanjutkan.
 */
function validateConfig() {
  const errors = collectErrors();
  if (errors.length === 0) return true;

  console.log(chalk.redBright('\n❌ Konfigurasi belum benar, bot tidak dijalankan.\n'));
  for (const error of errors) {
    console.log(chalk.redBright(`   • ${error}`));
  }
  console.log(chalk.yellow('\n   Perbaiki file config.js lalu jalankan ulang: npm start\n'));

  return false;
}

export { validateConfig, checkPhoneNumber };
