/**
 * Menyaring log bising dari Baileys (session/ratchet) agar terminal tetap bersih.
 *
 * Modul ini hanya punya efek samping, jadi harus di-import paling awal
 * (lihat `index.js`) supaya patch terpasang sebelum ada output apa pun.
 */

const BLOCKED_KEYWORDS = [
  'Closing session: SessionEntry',
  'Decrypted message with closed session',
  'SessionEntry',
  'currentRatchet',
  '_chains',
];

const isNoise = (text) => BLOCKED_KEYWORDS.some((keyword) => text.includes(keyword));

// Saring console.log / warn / error / info
for (const level of ['log', 'warn', 'error', 'info']) {
  const original = console[level];
  console[level] = (...args) => {
    if (isNoise(args.join(' '))) return;
    original(...args);
  };
}

// Saring stdout secara langsung (pino menulis ke sini)
const originalWrite = process.stdout.write;
process.stdout.write = function write(chunk, ...rest) {
  if (isNoise(chunk.toString())) return true;
  return originalWrite.apply(this, [chunk, ...rest]);
};
