import axios from 'axios';
import config from '../../../config.js';

const { GEMINI } = config.AI;

const endpoint = () =>
  `${GEMINI.BASE_URL}/${GEMINI.MODEL}:generateContent?key=${GEMINI.API_KEY}`;

/** Mengirim prompt ke Gemini dan mengembalikan jawabannya. */
async function ask(prompt) {
  const res = await axios.post(endpoint(), {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return res.data.candidates[0].content.parts[0].text;
}

/**
 * Cek cepat apakah API key Gemini masih valid.
 * @returns {Promise<{status: string}>}
 */
async function check() {
  if (!GEMINI.API_KEY) return { status: '❌ Tidak valid (API Key kosong)' };

  try {
    await axios.post(endpoint(), { contents: [{ role: 'user', parts: [{ text: 'test' }] }] });
    return { status: '✅ Valid' };
  } catch {
    return { status: '❌ Tidak valid' };
  }
}

export default { name: 'Gemini', ask, check };
