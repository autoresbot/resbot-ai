import config from '../../config.js';
import groq from './providers/groq.js';
import gemini from './providers/gemini.js';
import autoresbot from './providers/autoresbot.js';
import { DIVIDER, heading, item, section, block } from '../utils/format.js';
import { buildPrompt } from './prompt.js';
import { saveHistory } from './history.js';

const { DEFAULT_PROVIDER } = config.AI;

/**
 * Urutan provider yang dicoba: provider utama sesuai config, lalu cadangannya,
 * dan terakhir API Autoresbot.
 */
function providerChain() {
  return DEFAULT_PROVIDER === 'groq' ? [groq, gemini, autoresbot] : [gemini, groq, autoresbot];
}

/**
 * Bertanya ke AI dengan auto fallback antar provider.
 * @param {string} userId JID pengirim, dipakai sebagai kunci riwayat percakapan.
 * @param {string} prompt Pesan mentah dari user.
 * @returns {Promise<string>} Jawaban AI, atau pesan error ramah bila semua provider gagal.
 */
async function AI_TEXT(userId, prompt) {
  const fullPrompt = buildPrompt(userId, prompt);
  const chain = providerChain();

  for (const [index, provider] of chain.entries()) {
    try {
      // Provider terakhir (Autoresbot) menerima prompt polos tanpa riwayat.
      const isLast = index === chain.length - 1;
      const reply = await provider.ask(isLast ? prompt : fullPrompt);

      saveHistory(userId, prompt, reply);
      return reply;
    } catch {
      const next = chain[index + 1];
      console.warn(
        next
          ? `[${provider.name} AI Error] fallback → ${next.name}`
          : `[${provider.name} AI Error] semua provider gagal`,
      );
    }
  }

  return 'AI sedang limit atau error. Coba lagi nanti. \n\nPastikan API Key dan konfigurasi AI sudah benar.';
}

/**
 * Ringkasan status semua provider AI, dipakai perintah `apikey`.
 *
 * Provider boleh mengembalikan `details` berisi pasangan `[label, nilai]`
 * (mis. sisa limit & masa aktif); bagian itu ditampilkan sebagai blok sendiri.
 */
async function providerStatus() {
  const providers = [groq, gemini, autoresbot];

  const results = await Promise.all(
    providers.map(async (provider) => ({ name: provider.name, ...(await provider.check()) })),
  );

  const detailBlocks = results
    .filter((result) => result.details?.length)
    .flatMap((result) => [
      '',
      section(
        `LIMIT ${result.name.toUpperCase()}`,
        result.details.map(([label, value]) => item(label, value)),
      ),
    ]);

  return block([
    heading('🔑', 'Status API Key'),
    '',
    ...results.map((result) => item(result.name, result.status)),
    ...detailBlocks,
    '',
    DIVIDER,
    '',
    `Provider utama: *${DEFAULT_PROVIDER}*`,
  ]);
}

export { AI_TEXT, providerStatus };
