/*
⚠️ PERINGATAN:
Script ini **TIDAK BOLEH DIPERJUALBELIKAN** dalam bentuk apa pun!

╔══════════════════════════════════════════════╗
║                🛠️ INFORMASI SCRIPT           ║
╠══════════════════════════════════════════════╣
║ 📦 Version   : 2.0.1
║ 👨‍💻 Developer  : Azhari Creative              ║
║ 🌐 Website    : https://autoresbot.com       ║
║ 💻 GitHub     : github.com/autoresbot/resbot-ai
╚══════════════════════════════════════════════╝

📌 Mulai 11 April 2025,
Script **Autoresbot** resmi menjadi **Open Source** dan dapat digunakan secara gratis:
🔗 https://autoresbot.com
*/
global.version = '2.0.1';

import config from './config.js';
import { clearDirectory } from './lib/utils.js';
import { connectToWhatsApp } from './src/connection.js';

// Bersihkan directory tmp saat start
clearDirectory('./tmp');

async function checkAndUpdate() {
  if (config.AutoUpdate == 'on') {
    const { cloneOrUpdateRepo } = await import('./lib/cekUpdate.js');
    await cloneOrUpdateRepo();
  }
  await connectToWhatsApp();
}

checkAndUpdate();
