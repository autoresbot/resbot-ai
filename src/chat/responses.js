import config from '../../config.js';
import { heading, block } from '../utils/format.js';

/** Kumpulan teks balasan bawaan bot. Ubah di sini untuk mengganti gaya bicara bot. */

const GREETINGS = ['halo', 'p', 'hay', 'hai', 'bot', 'ai'];

const GREETING_REPLIES = [
  `Halo! Perkenalkan saya ${config.name_bot}, ada yang bisa saya bantu?`,
  `Hai, saya ${config.name_bot}. Bagaimana saya bisa membantu Anda hari ini?`,
  `Halo! ${config.name_bot} di sini, ada yang bisa saya bantu?`,
  `Salam! Saya ${config.name_bot}, siap membantu Anda.`,
  `Hai! ${config.name_bot} di sini, butuh bantuan?`,
];

const IDENTITY_QUESTIONS = [
  'nama kamu siapa',
  'siapa kamu',
  'apakah kamu bot',
  'kamu siapa',
  'ap kamu bot',
];

const IDENTITY_REPLIES = [
  `Saya adalah AI sederhana bernama ${config.name_bot}.`,
  `Nama saya ${config.name_bot}, saya di sini untuk membantu Anda.`,
  `Saya ${config.name_bot}, bot sederhana yang siap membantu.`,
  `Panggil saya ${config.name_bot}, saya adalah asisten virtual Anda.`,
  `Hai, saya ${config.name_bot}, bot yang dibuat untuk membantu Anda.`,
];

const OWNER_QUESTIONS = ['owner', 'pembuat', 'pencipta'];

const OWNER_REPLIES = [
  `Bot ini dibuat oleh tim di ${config.owner_website}.`,
  `Owner saya adalah ${config.owner_name}, Anda bisa cek lebih lanjut di ${config.owner_website}.`,
  `Bot ini diciptakan oleh ${config.owner_name}, kunjungi ${config.owner_website} untuk info lebih lanjut.`,
  `Saya diciptakan oleh ${config.owner_name}, kunjungi situsnya di ${config.owner_website}.`,
  `Pembuat saya adalah ${config.owner_name}, lebih banyak info di ${config.owner_website}.`,
];

const STICKER_KEYWORDS = ['s', 'sticker', 'stiker', 'stikker'];

const STICKER_REPLIES = [
  `Hai! Saya bisa bantu buatkan sticker khusus untuk Anda. Yuk, kirimkan gambarnya dan saya akan segera memprosesnya! 😄`,
  `Ingin sticker keren? Silakan kirim gambar Anda, dan saya akan buatkan stickernya! 😉`,
  `Sticker yang unik hanya untuk Anda! Kirim gambarnya dan saya akan jadikan sticker dalam sekejap! 🎨`,
  `Buat sticker dari gambar Anda? Mudah! Kirim gambarnya, saya siap membuat sticker untuk Anda! 👍`,
];

const SONG_QUESTIONS = [
  'bisa carikan lagu',
  'apa bisa putar music',
  'bisa play',
  'apakah bisa putar lagu',
  'apakah bisa mutar lagu',
];

const SONG_QUESTION_REPLIES = ['Tentu Saya bisa mencarikan anda lagu. Silakan tulis judulnya'];

const SONG_KEYWORDS = ['lagu', 'music', 'musik', 'sound', 'mp3', 'play', 'putarkan', 'putar', 'mutar'];

const LINK_DETECTED_REPLIES = [
  `Sepertinya kamu mengirimkan sebuah link, saya akan coba memprosesnya.`,
  `Saya melihat ada link di pesanmu. Sedang diproses...`,
  `Oh, ada link nih! Saya akan coba cek lebih lanjut.`,
  `Terima kasih, saya menemukan sebuah link, mari kita lihat.`,
  `Link terdeteksi! Sedang saya proses ya...`,
];

const HD_KEYWORDS = ['hd', 'remini', 'jernih', 'clear', 'hdr'];

const HD_REPLIES = [
  'Tunggu sebentar ya, kak. Saya akan coba membuat gambar itu jadi lebih jernih.',
  'Baik, kak! Sedang diproses untuk memperjelas gambar ini.',
  'Sabar ya, kak! Saya sedang mencoba memperbaiki gambar tersebut agar lebih tajam.',
  'Proses peningkatan kualitas gambar sedang berjalan. Silakan tunggu beberapa saat, kak.',
  'Saya sedang bekerja untuk membuat gambar ini lebih HD. Tunggu sebentar ya, kak!',
];

const HD_NO_MEDIA = block([
  heading('🖼️', 'Perjelas Gambar'),
  '',
  'Kirim gambarnya dulu ya kak, lalu beri caption `.hd`.',
  'Bisa juga balas gambar yang sudah terkirim dengan `.hd`.',
]);

const IMAGE_RECEIVED_REPLIES = [
  'Hai, apa yang bisa saya bantu dengan gambar itu?',
  'Gambar yang menarik! Ada yang bisa saya lakukan?',
  'Terima kasih atas gambar tersebut, apa yang ingin kamu lakukan selanjutnya?',
  'Hmm, gambar ini terlihat keren! Ada permintaan khusus?',
  'Gambar diterima! Apa yang perlu saya lakukan dengan itu?',
];

const LINK_INVALID =
  'Hai Kak, sepertinya link yang kamu bagikan tidak valid. Coba cek lagi, ya!';

const LINK_TIKTOK_FAILED =
  'Hai Kak, sepertinya link tiktok yang kamu bagikan tidak bisa saya download. Coba cek lagi, ya!';

const LINK_UNSUPPORTED =
  'Hai Kak, sepertinya link yang kamu bagikan tidak dapat di proses sementara waktu. Link yang dapat saya proses berupa link grup whatsapp, link saluran whatsapp dan link tiktok.';

export {
  GREETINGS,
  GREETING_REPLIES,
  IDENTITY_QUESTIONS,
  IDENTITY_REPLIES,
  OWNER_QUESTIONS,
  OWNER_REPLIES,
  STICKER_KEYWORDS,
  STICKER_REPLIES,
  SONG_QUESTIONS,
  SONG_QUESTION_REPLIES,
  SONG_KEYWORDS,
  LINK_DETECTED_REPLIES,
  HD_KEYWORDS,
  HD_REPLIES,
  HD_NO_MEDIA,
  IMAGE_RECEIVED_REPLIES,
  LINK_INVALID,
  LINK_TIKTOK_FAILED,
  LINK_UNSUPPORTED,
};
