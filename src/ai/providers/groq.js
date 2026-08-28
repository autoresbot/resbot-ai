import axios from 'axios';
import config from '../../../config.js';

const { GROQ } = config.AI;

function headers() {
  return {
    Authorization: `Bearer ${GROQ.API_KEY}`,
    'Content-Type': 'application/json',
  };
}

/** Mengirim prompt ke Groq dan mengembalikan jawabannya. */
async function ask(prompt) {
  const res = await axios.post(
    GROQ.BASE_URL,
    { model: GROQ.MODEL, messages: [{ role: 'user', content: prompt }] },
    { headers: headers() },
  );

  return res.data.choices[0].message.content;
}

/**
 * Cek cepat apakah API key Groq masih valid.
 * @returns {Promise<{status: string}>}
 */
async function check() {
  if (!GROQ.API_KEY) return { status: '❌ Tidak valid (API Key kosong)' };

  try {
    await axios.post(
      GROQ.BASE_URL,
      { model: GROQ.MODEL, messages: [{ role: 'user', content: 'test' }], max_tokens: 5 },
      { headers: headers() },
    );
    return { status: '✅ Valid' };
  } catch {
    return { status: '❌ Tidak valid' };
  }
}

export default { name: 'Groq', ask, check };
