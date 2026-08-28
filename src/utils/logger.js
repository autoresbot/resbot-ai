import chalk from 'chalk';
import pino from 'pino';

/** Logger senyap yang dipakai Baileys agar log internalnya tidak membanjiri terminal. */
const silentLogger = pino({ level: 'silent' });

function currentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Log satu baris pesan masuk: `[HH:MM] Nama : isi pesan`. */
function logWithTime(pushName, content) {
  console.log(
    `${chalk.blue(`[${currentTime()}]`)} ${chalk.yellow(pushName)} : ${chalk.greenBright(content)}`,
  );
}

/** Log satu baris umum: `[HH:MM] : isi`. */
function log(content) {
  console.log(`${chalk.blue(`[${currentTime()}]`)} : ${chalk.greenBright(content)}`);
}

export { silentLogger, logWithTime, log };
