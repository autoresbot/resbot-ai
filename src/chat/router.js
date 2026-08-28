import { rules } from './rules/index.js';

/**
 * Menjalankan seluruh rule secara berurutan.
 * @returns balasan dari rule pertama yang cocok, atau `null` bila tidak ada
 *          (artinya pesan diserahkan ke AI eksternal).
 */
async function route(ctx) {
  for (const rule of rules) {
    const reply = await rule(ctx);
    if (reply) return reply;
  }

  return null;
}

export { route };
