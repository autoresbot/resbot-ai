import chalk from 'chalk';
import Boom from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { DisconnectReason } from 'baileys';
import config from '../../../config.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Perlakuan untuk tiap alasan terputusnya koneksi.
 * `reconnect: false` berarti bot berhenti dan butuh tindakan manual.
 */
const DISCONNECT_HANDLING = {
  [DisconnectReason.badSession]: { message: 'Bad Session File, Start Again ...', reconnect: true },
  [DisconnectReason.connectionClosed]: { message: 'Connection closed, reconnecting...', reconnect: true },
  [DisconnectReason.connectionLost]: { message: 'Connection lost from server, reconnecting...', reconnect: true },
  [DisconnectReason.connectionReplaced]: {
    message: 'Connection replaced by another session. Please restart bot.',
    reconnect: true,
  },
  [DisconnectReason.loggedOut]: {
    message: 'Perangkat logout. Hapus Folder session lalu restart server.',
    reconnect: false,
  },
  [DisconnectReason.restartRequired]: {
    message: 'Restart required. Restarting...',
    reconnect: true,
    delay: 3000,
  },
  [DisconnectReason.timedOut]: { message: 'Connection timed out. Reconnecting...', reconnect: true },
};

async function handleConnectionUpdate(update, sock, reconnect) {
  const { connection, lastDisconnect, qr } = update;

  // Tampilkan QR bila mode koneksi memakai QR.
  if (qr != null && config.type_connection.toLowerCase() === 'qr') {
    console.log(chalk.yellowBright('Menampilkan QR'));
    qrcode.generate(qr, { small: true }, (qrcodeStr) => console.log(qrcodeStr));
  }

  if (connection === 'open') {
    global.sock = sock;

    await wait(1000);
    await sock.sendMessage(`${config.phone_number_bot}@s.whatsapp.net`, { text: 'Bot Connected' });

    console.log(chalk.greenBright(`✅ [${config.phone_number_bot}] Koneksi Terhubung`));
    return;
  }

  if (connection !== 'close') return;

  const reason = new Boom.Boom(lastDisconnect?.error)?.output?.statusCode;
  const handling = DISCONNECT_HANDLING[reason];

  if (!handling) {
    console.log(chalk.redBright(`Unknown disconnect reason: ${reason} | ${connection}`));
    return reconnect();
  }

  console.log(chalk.redBright(handling.message));
  if (!handling.reconnect) return;

  if (handling.delay) await wait(handling.delay);
  return reconnect();
}

export { handleConnectionUpdate };
