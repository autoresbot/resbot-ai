import { limitGuard } from './limit.js';
import { exactCommands, menuAliases } from './commands.js';
import { ownerCommands } from './owner.js';
import { songQuestion, playSong } from './music.js';
import { incomingLink } from './link.js';
import { quotedChat, bratVideo, brat } from './maker.js';
import {
  stickerCommand,
  stickerFromQuoted,
  stickerFromKeyword,
  stickerFromSession,
  stickerPrompt,
} from './sticker.js';
import { greeting, identity, owner, tooShort } from './smalltalk.js';
import { enhance, search, received } from './image.js';

/**
 * Urutan rule menentukan prioritas: rule pertama yang mengembalikan balasan menang.
 * Untuk menambah fitur baru, buat file rule di folder ini lalu sisipkan di posisi yang tepat.
 */
const rules = [
  limitGuard,        // limit harian habis
  exactCommands,     // reset, limit, info, listprem, ...
  ownerCommands,     // addprem, delprem, editprem, resetdata
  menuAliases,       // menu, allmenu, tiktok
  songQuestion,      // "bisa carikan lagu?"
  playSong,          // "play <judul>"
  incomingLink,      // link tiktok/ig/fb/grup wa
  quotedChat,        // qc <teks>
  bratVideo,         // bratvid <teks>  (harus sebelum brat)
  brat,              // brat <teks>
  stickerCommand,    // media + caption "s"
  stickerFromQuoted, // reply media + "sticker"
  greeting,          // halo / hai / p
  identity,          // "kamu siapa"
  owner,             // "siapa pembuatmu"
  tooShort,          // pesan 1 karakter
  enhance,           // hd / remini
  search,            // pin / carikan gambar
  stickerFromKeyword,// media + kata "sticker"
  stickerFromSession,// media lanjutan setelah bot minta gambar
  stickerPrompt,     // "buatkan sticker" tanpa media
  received,          // gambar polos
];

export { rules };
