# ResBot AI

ResBot AI adalah bot WhatsApp berbasis AI yang mendukung **multi-provider AI (Gemini & Groq)** dengan sistem **auto fallback**.  
Jika Gemini terkena limit atau error, bot otomatis beralih ke Groq tanpa memutus percakapan.

Bot ini dikembangkan menggunakan **Node.js (ESM)** dan cocok untuk penggunaan pribadi maupun skala kecil–menengah.

---

## ✨ Fitur Utama

- 🤖 AI Chat (Gemini & Groq)
- 🔁 Auto fallback (Gemini → Groq)
- 🧠 History percakapan per user
- ⚙️ Konfigurasi terpusat via `config.js`
- 🧩 Mudah dikembangkan & modular
- 💬 Cocok untuk bot WhatsApp (Baileys)

---

## 📦 Teknologi

- Node.js (ES Module)
- Axios
- WhatsApp Baileys
- Google Gemini API
- Groq API (LLaMA)

---

## 🚀 Instalasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/autoresbot/resbot-ai.git
cd resbot-ai
```

Mendapatkan API Key AI
Bot ini membutuhkan 2 API Key:

1. Gemini (AI utama)
2. Groq (AI cadangan)

Cara Mendapatkan API Key Gemini

- Buka website Google AI Studio
  👉 https://aistudio.google.com/

- Login menggunakan akun Google

- Klik Get API Key

- Buat API Key baru

- Salin API Key tersebut

Cara Mendapatkan API Key Groq (Backup AI)
👉 Groq digunakan otomatis jika Gemini: Error, kena limit (429)

- Langkah-langkah:

-Buka website Groq
👉 https://groq.com/

- Login atau daftar akun

- Masuk ke menu API Keys

- Klik Create API Key

- Salin API Key

Konfigurasi AI (config.js)

Buka file config.js
dan isi bagian `AI`:

```js
AI: {
  DEFAULT_PROVIDER: 'groq',        // gemini | groq
  GROQ:   { API_KEY: '...', MODEL: 'llama-3.3-70b-versatile', ... },
  GEMINI: { API_KEY: '...', MODEL: 'gemini-2.5-flash', ... },
  HISTORY_LIMIT: 10,
}
```

### 2️⃣ Jalankan Bot

```bash
npm install
npm start
```

> ⚠️ `phone_number_bot` (dan setiap entri `owner_number`) wajib berupa nomor
> lengkap 10-15 digit angka saja — tanpa `+`, spasi, atau tanda hubung.
> Kalau masih `628xxx` atau kurang digit, bot berhenti sebelum menyambung
> ke WhatsApp dan menampilkan bagian mana yang perlu diperbaiki.

---

## 📁 Struktur Proyek

```
index.js                  Titik masuk: pasang filter log, panggil src/app.js
config.js                 Semua pengaturan bot (nomor, owner, API key, teks notifikasi)
database/users.json       Data user & masa premium

src/
├── app.js                Bootstrap: bersihkan tmp → cek update → connect
├── updater.js            Auto update dari GitHub (config.AutoUpdate)
│
├── whatsapp/             Semua yang menyentuh Baileys
│   ├── connection.js     Membuat socket, pairing code, pasang event handler
│   ├── serialize.js      Payload mentah WhatsApp → objek pesan seragam
│   ├── store.js          Cache kontak + event bus internal
│   └── events/           messages.upsert, connection.update, contacts.update
│
├── chat/                 Otak percakapan
│   ├── index.js          Alur: rule lokal → AI eksternal → kirim balasan
│   ├── router.js         Menjalankan rule secara berurutan
│   ├── rules/            Satu file per kelompok fitur (index.js = urutan prioritas)
│   ├── actions/          Kerja berat setelah balasan terkirim (play, hd, pin, link)
│   ├── reply.js          Mengirim balasan sesuai message_type
│   ├── replies.js        Helper bentuk balasan: text() / sticker() / action()
│   ├── responses.js      Kumpulan teks & kata kunci balasan bot
│   └── menus.js          Menu utama & menu owner
│
├── ai/                   AI eksternal
│   ├── index.js          AI_TEXT() dengan auto fallback antar provider
│   ├── prompt.js         Penyusun prompt (persona + waktu + riwayat)
│   ├── history.js        Riwayat percakapan per user
│   └── providers/        groq.js, gemini.js, autoresbot.js
│
├── services/             Integrasi ke dunia luar
│   ├── api.js            Instance ApiAutoresbot bersama
│   ├── media.js          Download media pesan / pesan yang dikutip
│   ├── sticker.js        Konversi gambar & video → sticker (ffmpeg + exif)
│   ├── enhancer.js       Perjelas gambar (remini)
│   ├── imageSearch.js    Cari gambar (pinterest → pixabay → unsplash)
│   └── downloader/       tiktok.js, facebook.js, instagram.js, youtube.js
│
├── state/                Data yang berumur panjang
│   ├── users.js          CRUD user, limit harian, premium
│   ├── session.js        Sesi percakapan singkat (60 detik)
│   └── activeFeatures.js Penanda fitur yang sedang berjalan
│
└── utils/                Helper murni tanpa efek samping bisnis
    ├── consoleFilter.js  Menyaring log bising Baileys
    ├── logger.js         Logger pino senyap + log terminal berwarna
    ├── fileLogger.js     Menulis log ke session/log_<nomor>.txt
    ├── files.js          Path proyek (tmp/session/database) + helper folder
    ├── http.js           getBuffer(), checkUrlType()
    ├── jid.js            Validasi & normalisasi JID
    ├── link.js           Deteksi link di dalam pesan
    ├── message.js        Tipe pesan, quoted message, potong teks
    └── random.js         pick()
```

---

## 🧩 Menambah Fitur Baru

1. Buat file rule baru di `src/chat/rules/`, mis. `cuaca.js`:

```js
import { text } from '../replies.js';

async function cuaca(ctx) {
  if (!ctx.text.startsWith('cuaca')) return null;
  return text('Cuaca hari ini cerah ☀️');
}

export { cuaca };
```

2. Daftarkan di `src/chat/rules/index.js` pada posisi prioritas yang diinginkan.
   Rule pertama yang mengembalikan balasan yang menang; rule yang mengembalikan
   `null` menyerahkan pesan ke rule berikutnya (dan akhirnya ke AI).

3. Butuh kerja berat setelah balasan terkirim (download, konversi, dll)?
   Kembalikan `text('Tunggu ya...', action('namafitur', isiKonten))` lalu daftarkan
   handler-nya di `src/chat/actions/index.js`.
