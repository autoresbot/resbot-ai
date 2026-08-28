import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

/** Root proyek, dihitung dari lokasi file ini agar tidak bergantung pada cwd. */
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Folder penampung file sementara (hasil download media, konversi sticker, dll). */
const TMP_DIR = path.join(ROOT_DIR, 'tmp');

/** Folder kredensial WhatsApp sekaligus tempat file log. */
const SESSION_DIR = path.join(ROOT_DIR, 'session');

/** Folder database JSON. */
const DATABASE_DIR = path.join(ROOT_DIR, 'database');

/** Membuat folder bila belum ada. Aman dipanggil berkali-kali. */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

/** Menghapus seluruh isi sebuah folder tanpa menghapus foldernya. */
async function clearDirectory(dirPath) {
  try {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
      await fs.promises.unlink(path.join(dirPath, file));
    }
    console.log(`Semua isi folder ${dirPath} telah dihapus.`);
  } catch {
    // Folder belum ada / sedang terkunci - tidak perlu menghentikan bot.
  }
}

if (ensureDir(TMP_DIR)) {
  console.log(chalk.green('[INFO] Folder "tmp" berhasil dibuat.'));
}

export { ROOT_DIR, TMP_DIR, SESSION_DIR, DATABASE_DIR, ensureDir, clearDirectory };
