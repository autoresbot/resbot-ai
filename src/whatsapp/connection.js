import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from 'baileys';
import config from '../../config.js';
import { silentLogger } from '../utils/logger.js';
import { SESSION_DIR, ensureDir } from '../utils/files.js';
import { handleMessageUpsert } from './events/message.js';
import { handleConnectionUpdate } from './events/connection.js';
import { handleContactsUpdate } from './events/contacts.js';

const PAIRING_DELAY_MS = 4000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Bot dianggap masih hidup bila socket-nya sudah login dan WS-nya terbuka. */
function isConnected() {
  return Boolean(global.sock?.user && global.sock?.ws?.readyState === 1);
}

/** Meminta kode pairing dan menampilkannya di terminal. */
async function requestPairingCode(sock) {
  const phoneNumber = config.phone_number_bot;

  await wait(PAIRING_DELAY_MS);
  const code = await sock.requestPairingCode(phoneNumber.trim());

  console.log(chalk.blue('PHONE NUMBER: '), chalk.yellow(phoneNumber));
  console.log(chalk.blue('CODE PAIRING: '), chalk.yellow(code.match(/.{1,4}/g).join('-')));
}

/** Melonggarkan permission folder session (diabaikan pada OS yang tidak mendukung). */
function relaxSessionPermissions() {
  try {
    fs.chmodSync(SESSION_DIR, 0o755);

    for (const file of fs.readdirSync(SESSION_DIR)) {
      fs.chmodSync(path.join(SESSION_DIR, file), 0o644);
    }
  } catch {
    // Windows / filesystem tertentu tidak mendukung chmod - aman untuk diabaikan.
  }
}

/**
 * Membuat (atau memakai ulang) koneksi ke WhatsApp beserta seluruh event handler-nya.
 * @returns {Promise<import('baileys').WASocket>}
 */
async function connectToWhatsApp() {
  if (isConnected()) {
    console.log(chalk.yellow('⚠️ Bot sudah terkoneksi dan aktif. Tidak membuat koneksi baru.'));
    return global.sock;
  }

  ensureDir(SESSION_DIR);

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: silentLogger,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  });

  global.sock = sock;

  if (!sock.authState.creds.registered && config.type_connection.toLowerCase() === 'pairing') {
    await requestPairingCode(sock);
  }

  sock.ev.on('creds.update', saveCreds);

  relaxSessionPermissions();

  sock.ev.on('contacts.update', handleContactsUpdate);
  sock.ev.on('messages.upsert', (m) => handleMessageUpsert(sock, m));
  sock.ev.on('connection.update', (update) =>
    handleConnectionUpdate(update, sock, connectToWhatsApp),
  );

  return sock;
}

export { connectToWhatsApp };
