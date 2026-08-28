import fs from 'fs';
import path from 'path';
import config from '../../config.js';
import { SESSION_DIR, ensureDir } from './files.js';

ensureDir(SESSION_DIR);

const logFile = fs.createWriteStream(
  path.join(SESSION_DIR, `log_${config.phone_number_bot}.txt`),
  { flags: 'a' },
);

logFile.on('error', (err) => {
  console.error('Error saat menulis log ke file:', err);
});

/** Menulis satu baris log ke `session/log_<nomor>.txt`. */
function writeLog(level, message) {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] [${level}] ${message}\n`, (err) => {
    if (err) console.error('Gagal menulis log:', err);
  });
}

export { writeLog };
