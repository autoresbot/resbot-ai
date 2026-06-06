import axios from 'axios';
import config from '../config.js';

const {
  AI: { DEFAULT_PROVIDER, GEMINI, GROQ, AUTORESBOT, HISTORY_LIMIT },
} = config;

global.conversationHistories ||= {};

/* =========================
 * Helper
 * ========================= */
function getWaktuWIB() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 60 * 60 * 1000);

  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return `${wib.getDate()} ${bulan[wib.getMonth()]} ${wib.getFullYear()} jam ${String(
    wib.getHours(),
  ).padStart(2, '0')}:${String(wib.getMinutes()).padStart(2, '0')} WIB`;
}

function buildPrompt(id_user, prompt) {
  conversationHistories[id_user] ||= [];

  return `
Kamu adalah Resbot AI buatan Autoresbot.
Website: autoresbot.com
Waktu sekarang: ${getWaktuWIB()}
Jawab singkat, ramah, dan jelas.

${conversationHistories[id_user].join('\n')}
User: ${prompt}
AI:
`.trim();
}

function saveHistory(id_user, prompt, reply) {
  conversationHistories[id_user].push(`User: ${prompt}`);
  conversationHistories[id_user].push(`AI: ${reply}`);

  if (conversationHistories[id_user].length > HISTORY_LIMIT) {
    conversationHistories[id_user] = conversationHistories[id_user].slice(-HISTORY_LIMIT);
  }
}

/* =========================
 * Providers
 * ========================= */
async function askGemini(prompt) {
  const url = `${GEMINI.BASE_URL}/${GEMINI.MODEL}:generateContent?key=${GEMINI.API_KEY}`;

  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return res.data.candidates[0].content.parts[0].text;
}

async function askGroq(prompt) {
  const res = await axios.post(
    GROQ.BASE_URL,
    {
      model: GROQ.MODEL,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ.API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data.choices[0].message.content;
}

async function askAutoresbot(prompt) {
  const res = await axios.get(AUTORESBOT.BASE_URL, {
    params: {
      apikey: AUTORESBOT.API_KEY,
      text: prompt,
    },
  });

  if (!res.data.status) {
    throw new Error('Autoresbot API returned status false');
  }

  return res.data.data;
}

/* =========================
 * Main (Auto Fallback)
 * ========================= */
async function AI_TEXT(id_user, prompt) {
  const fullPrompt = buildPrompt(id_user, prompt);

  try {
    const primary =
      DEFAULT_PROVIDER === 'groq' ? await askGroq(fullPrompt) : await askGemini(fullPrompt);

    saveHistory(id_user, prompt, primary);
    return primary;
  } catch (err) {
    console.warn('[Primary AI Error] fallback → backup');

    try {
      const backup =
        DEFAULT_PROVIDER === 'groq' ? await askGemini(fullPrompt) : await askGroq(fullPrompt);

      saveHistory(id_user, prompt, backup);
      return backup;
    } catch (e) {
      console.warn('[Backup AI Error] fallback → autoresbot');

      try {
        const lastResort = await askAutoresbot(prompt);
        saveHistory(id_user, prompt, lastResort);
        return lastResort;
      } catch (e2) {
        console.error('[Autoresbot AI Error] semua provider gagal');
        return 'AI sedang limit atau error. Coba lagi nanti. \n\nPastikan API Key dan konfigurasi AI sudah benar.';
      }
    }
  }
}

export { AI_TEXT };
