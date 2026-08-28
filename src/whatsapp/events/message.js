import chalk from 'chalk';
import config from '../../../config.js';
import serializeMessage from '../serialize.js';
import { handleChat } from '../../chat/index.js';
import { writeLog } from '../../utils/fileLogger.js';
import { logWithTime } from '../../utils/logger.js';
import { truncate } from '../../utils/message.js';
import { addUser, getUser } from '../../state/users.js';

/** Waktu pesan terakhir per chat, dipakai untuk rate limit. */
const lastMessageTime = new Map();

/** Menolak pesan yang tidak sesuai `config.bot_destination`. */
function isWrongDestination(isGroup) {
  const destination = config.bot_destination.toLowerCase();
  return (isGroup && destination === 'private') || (!isGroup && destination === 'group');
}

/** True bila chat ini mengirim pesan terlalu cepat sejak pesan sebelumnya. */
function isRateLimited(remoteJid) {
  const previous = lastMessageTime.get(remoteJid);
  return previous !== undefined && Date.now() - previous < config.rate_limit;
}

async function handleMessageUpsert(sock, m) {
  try {
    const result = serializeMessage(m);
    if (!result) return;

    const { isGroup, content, messageType, message, isQuoted, pushName, sender, remoteJid } = result;

    if (remoteJid === 'status@broadcast') {
      console.log(chalk.yellowBright('Status message skipped'));
      return;
    }

    if (isWrongDestination(isGroup)) {
      const reason = isGroup ? 'Only Chat (Private)' : 'Only Group';
      console.log(chalk.yellowBright(`[SKIP] ${reason} → Message ignored`));
      return;
    }

    const preview = truncate(content);

    if (content && isRateLimited(remoteJid)) {
      console.log(chalk.redBright(`Rate limit : ${preview} - ${remoteJid}`));
      return;
    }

    if (content) {
      lastMessageTime.set(remoteJid, Date.now());
      logWithTime(pushName, preview);
    }

    writeLog('INFO', `${remoteJid}: ${content}`);

    // Daftarkan pengirim baru sebagai user biasa.
    if (!getUser(sender)) addUser(sender, -1);

    try {
      await handleChat({
        sock,
        content,
        sender,
        remoteJid,
        message,
        messageType,
        pushName,
        isQuoted,
      });
    } catch (error) {
      console.error('Terjadi kesalahan saat memproses pesan:', error);
    }
  } catch (error) {
    console.log(chalk.redBright(`Error dalam message upsert: ${error.message}`));
  }
}

export { handleMessageUpsert };
