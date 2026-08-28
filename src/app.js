import config from '../config.js';
import { validateConfig } from './validateConfig.js';
import { TMP_DIR, clearDirectory } from './utils/files.js';
import { connectToWhatsApp } from './whatsapp/connection.js';

/**
 * Titik masuk bot: validasi config, bersihkan file sementara,
 * cek update (opsional), lalu buka koneksi WhatsApp.
 */
async function start() {
  // Berhenti sebelum menyentuh WhatsApp bila nomornya belum lengkap.
  if (!validateConfig()) {
    process.exitCode = 1;
    return;
  }

  await clearDirectory(TMP_DIR);

  if (config.AutoUpdate === 'on') {
    const { cloneOrUpdateRepo } = await import('./updater.js');
    await cloneOrUpdateRepo();
  }

  await connectToWhatsApp();
}

export { start };
