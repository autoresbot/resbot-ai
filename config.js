/*
⚠️ PERINGATAN:
Script ini **TIDAK BOLEH DIPERJUALBELIKAN** dalam bentuk apa pun!

╔══════════════════════════════════════════════╗
║                🛠️ INFORMASI SCRIPT           ║
╠══════════════════════════════════════════════╣
║ 👨‍💻 Developer  : Azhari Creative              ║
║ 🌐 Website    : https://autoresbot.com       ║
║ 💻 GitHub     : github.com/autoresbot/resbot-ai
╚══════════════════════════════════════════════╝

📌 Mulai 11 April 2025,
Script **Autoresbot** resmi menjadi **Open Source** dan dapat digunakan secara gratis:
🔗 https://autoresbot.com
*/

import { createRequire } from 'module';
import moment from 'moment-timezone';

// Versi bot dibaca langsung dari package.json agar hanya ada satu sumber kebenaran.
const { version } = createRequire(import.meta.url)('./package.json');

const APIKEY_AUTORESBOT = ''; // APIKEY BELI AMBIL DI autoresbot.com

const config = {
  AutoUpdate: 'off', // on atau off
  phone_number_bot: '628xxx', // WAJIB: nomor BOT lengkap, 10-15 digit angka saja. CONTOH : 6285124002201
  type_connection: 'pairing', // qr atau pairing
  bot_destination: 'group', // group , private, both
  name_bot: 'Resbot Ai',
  owner_name: 'Autoresbot',
  owner_number: [], // '6282154365238@s.whatsapp.net'
  owner_website: 'autoresbot.com',
  version,
  rate_limit: 3000, // 3 detik
  total_limit: 100, // limit perhari -  user biasa || kalo premium unlimited
  sticker_packname: 'Autoresbot',
  API_KEY: APIKEY_AUTORESBOT,
  sticker_author: `Date: ${moment
    .tz('Asia/Jakarta')
    .format('DD/MM/YY')}\nYouTube: Azhari Creative\nBot: 0852-4615-4386`,
  notification: {
    limit:
      'Hai kak, Limit harian anda sudah habis silakan tunggu besok ya atau berlangganan premium untuk menikmati fitur tanpa limit',
    reset:
      'Dialog berhasil dihapus. Semua percakapan kita telah di-reset dan siap memulai dari awal!',
    ig: 'kirimkan link instagramnya ya kak',
    fb: 'kirimkan link facebooknya ya kak',
    tt: 'kirimkan link tiktoknya ya kak',
    waiting: 'Hai kak mohon tunggu beberapa saat lagi ya, proses sebelumnya belum selesai',
    qc_help: 'Tulis textnya ya kak, misal *qc halo*',
    only_owner: '_❗Perintah Ini Hanya Bisa Digunakan Oleh Owner !_',
  },
  success: {
    hd: 'Ini kak hasil gambarnya, Maaf kalau masih blur',
  },
  error: {
    FILE_TOO_LARGE: `File terlalu besar. Maksimal ukuran file adalah 99 Mb`,
    THROW: '_Ada masalah saat terhubung ke server autoresbot_',
    PLAY_ERROR: 'Yahh Gagal, Sepertinya ada masalah saat mendowload audio',
    HD_ERROR: 'Yahh Gagal, Mohon maaf kak, tidak bisa hd in gambar',
    IMAGE_ERROR: 'Yahh Gagal, Mohon maaf kak, tidak bisa carikan kamu gambar',
    qc: 'Yah gagal bikin qc nya kak',
    brat: 'Yah gagal bikin brat nya kak',
    bratvid: 'Yah gagal bikin brat video nya kak',
  },
  AI: {
    DEFAULT_PROVIDER: 'groq', // gemini | groq
    GROQ: {
      API_KEY: '', // Apikey dari groq.com
      MODEL: 'openai/gpt-oss-20b',
      BASE_URL: 'https://api.groq.com/openai/v1/chat/completions',
    },
    GEMINI: {
      API_KEY: '', // apikey dari aistudio.google.com
      MODEL: 'gemini-3.6-flash',
      BASE_URL: 'https://generativelanguage.googleapis.com/v1/models',
    },
    AUTORESBOT: {
      API_KEY: APIKEY_AUTORESBOT,
      BASE_URL: 'https://api.autoresbot.com/api/ai',
    },
    HISTORY_LIMIT: 10, // CHAT HISTORY LIMIT YANG TERSIMPAN
  },
};

export default config;
