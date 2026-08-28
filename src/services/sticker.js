import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import webp from 'node-webpmux';
import fileType from 'file-type';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/* --------------------------- Helper file sementara ------------------------ */

function tmpFile(extension) {
  const name = crypto.randomBytes(6).readUIntLE(0, 6).toString(36);
  return path.join(os.tmpdir(), `${name}.${extension}`);
}

/** Menjalankan ffmpeg dan menunggu sampai selesai. */
function runFfmpeg(inputPath, outputPath, outputOptions, format) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .on('error', reject)
      .on('end', () => resolve(true))
      .addOutputOptions(outputOptions)
      .toFormat(format)
      .save(outputPath);
  });
}

/** Konversi buffer -> buffer lewat ffmpeg, membersihkan file sementara setelahnya. */
async function convert(media, inputExt, outputExt, outputOptions, format) {
  const tmpFileIn = tmpFile(inputExt);
  const tmpFileOut = tmpFile(outputExt);

  fs.writeFileSync(tmpFileIn, media);

  try {
    await runFfmpeg(tmpFileIn, tmpFileOut, outputOptions, format);
    return fs.readFileSync(tmpFileOut);
  } finally {
    fs.rmSync(tmpFileIn, { force: true });
    fs.rmSync(tmpFileOut, { force: true });
  }
}

/* ------------------------------- Konversi -------------------------------- */

const WEBP_FILTER =
  "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse";

/** Opsi ffmpeg untuk webp bergerak: berulang terus, dipotong maksimal 5 detik. */
const ANIMATED_WEBP_OPTIONS = [
  '-vcodec', 'libwebp',
  '-vf', WEBP_FILTER,
  '-loop', '0',
  '-ss', '00:00:00',
  '-t', '00:00:05',
  '-preset', 'default',
  '-an',
  '-vsync', '0',
];

/**
 * Konversi sumber bergerak (GIF/video) menjadi sticker webp beranimasi.
 * @param {string} inputExt Ekstensi file sementara agar ffmpeg mengenali formatnya.
 */
function animatedToWebp(media, inputExt) {
  return convert(media, inputExt, 'webp', ANIMATED_WEBP_OPTIONS, 'webp');
}

/** GIF (mis. hasil `bratvid`) -> sticker bergerak. */
function gifToWebp(media) {
  return animatedToWebp(media, 'gif');
}

/** Video -> sticker bergerak. */
function videoToWebp(media) {
  return animatedToWebp(media, 'mp4');
}

function imageToWebp(media) {
  return convert(media, 'jpg', 'webp', ['-vcodec', 'libwebp', '-vf', WEBP_FILTER], 'webp');
}

function webpToImage(webpData) {
  return convert(
    webpData,
    'webp',
    'jpg',
    ['-vcodec', 'mjpeg', '-q:v', '2', '-vf', 'fps=15'],
    'image2',
  );
}

/* --------------------------------- EXIF ---------------------------------- */

const EXIF_HEADER = Buffer.from([
  0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
]);

function buildExif(metadata) {
  const json = {
    'sticker-pack-id': 'https://github.com/DikaArdnt/Hisoka-Morou',
    'sticker-pack-name': metadata.packname,
    'sticker-pack-publisher': metadata.author,
    emojis: metadata.categories ? metadata.categories : [''],
  };

  const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
  const exif = Buffer.concat([EXIF_HEADER, jsonBuff]);
  exif.writeUIntLE(jsonBuff.length, 14, 4);

  return exif;
}

/**
 * Menempelkan metadata pack/author ke sebuah buffer WebP.
 * @returns {Promise<string|undefined>} Path file sticker, atau `undefined` bila metadata kosong.
 */
async function attachExif(webpBuffer, metadata) {
  if (!metadata.packname && !metadata.author) return undefined;

  const tmpFileIn = tmpFile('webp');
  const tmpFileOut = tmpFile('webp');
  fs.writeFileSync(tmpFileIn, webpBuffer);

  const img = new webp.Image();
  await img.load(tmpFileIn);
  fs.rmSync(tmpFileIn, { force: true });

  img.exif = buildExif(metadata);
  await img.save(tmpFileOut);

  return tmpFileOut;
}

async function writeExifImg(media, metadata) {
  return attachExif(await imageToWebp(media), metadata);
}

async function writeExifVid(media, metadata) {
  return attachExif(await videoToWebp(media), metadata);
}

async function writeExifGif(media, metadata) {
  return attachExif(await gifToWebp(media), metadata);
}

/** Versi generik: menerima `{ data, mimetype }` dan memilih konversi yang sesuai. */
async function writeExif(media, metadata) {
  let webpBuffer = '';
  if (/webp/.test(media.mimetype)) webpBuffer = media.data;
  else if (/gif/.test(media.mimetype)) webpBuffer = await gifToWebp(media.data);
  else if (/image/.test(media.mimetype)) webpBuffer = await imageToWebp(media.data);
  else if (/video/.test(media.mimetype)) webpBuffer = await videoToWebp(media.data);

  return attachExif(webpBuffer, metadata);
}

/* ------------------------------- Pengiriman ------------------------------ */

/**
 * Menyiapkan buffer mentah menjadi sticker sesuai jenis filenya.
 * @returns {Promise<string|Buffer>} Path file webp, atau buffer webp siap kirim.
 */
async function buildSticker(imageBuffer, mime, hasMetadata, options) {
  // WebP diteruskan apa adanya (hanya ditempeli exif) supaya sticker yang
  // sudah bergerak - mis. hasil bratvid - tidak kehilangan animasinya.
  if (mime === 'image/webp') {
    return hasMetadata ? writeExif({ data: imageBuffer, mimetype: mime }, options) : imageBuffer;
  }

  // GIF harus lewat jalur animasi; kalau ikut jalur gambar biasa, geraknya hilang.
  if (mime === 'image/gif') {
    return hasMetadata ? writeExifGif(imageBuffer, options) : gifToWebp(imageBuffer);
  }

  if (mime.startsWith('image/')) {
    return hasMetadata ? writeExifImg(imageBuffer, options) : imageToWebp(imageBuffer);
  }

  if (mime.startsWith('video/')) {
    return hasMetadata ? writeExifVid(imageBuffer, options) : videoToWebp(imageBuffer);
  }

  throw new Error(`Tipe file tidak didukung: ${mime}`);
}

/**
 * Mengubah buffer gambar/video menjadi sticker lalu mengirimkannya.
 * @returns {Promise<string|Buffer>} Sticker yang dikirim (path file atau buffer).
 */
async function sendImageAsSticker(sock, remoteJid, imageBuffer, options = {}, message) {
  const type = await fileType.fromBuffer(imageBuffer);
  if (!type) throw new Error('Tidak dapat menentukan tipe file');

  const hasMetadata = Boolean(options.packname || options.author);
  const result = await buildSticker(imageBuffer, type.mime, hasMetadata, options);

  await sock.sendMessage(
    remoteJid,
    { sticker: Buffer.isBuffer(result) ? result : { url: result }, ...options },
    { quoted: message },
  );

  return result;
}

export {
  gifToWebp,
  imageToWebp,
  webpToImage,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExifGif,
  writeExif,
  sendImageAsSticker,
};
