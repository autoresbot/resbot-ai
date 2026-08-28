import axios from 'axios';
import moment from 'moment';
import config from '../../../config.js';

const { AUTORESBOT } = config.AI;

/** Endpoint pemeriksa API key: mengembalikan sisa limit & masa aktif. */
const CHECK_URL = 'https://api.autoresbot.com/check_apikey';
const CHECK_TIMEOUT_MS = 15000;

/** Mengirim prompt ke API AI Autoresbot dan mengembalikan jawabannya. */
async function ask(prompt) {
  const res = await axios.get(AUTORESBOT.BASE_URL, {
    params: { apikey: AUTORESBOT.API_KEY, text: prompt },
  });

  if (!res.data.status) throw new Error('Autoresbot API returned status false');

  return res.data.data;
}

/** `6710` -> `6.710`. */
function formatLimit(value) {
  const limit = Number(value);
  return Number.isFinite(limit) ? limit.toLocaleString('id-ID') : 'tidak diketahui';
}

/** `2056-04-19 02:46:43` -> `19-04-2056 (sisa 10827 hari)`. */
function formatExpiry(value) {
  const expiry = moment(value);
  if (!value || !expiry.isValid()) return 'tidak diketahui';

  const days = expiry.diff(moment(), 'days');
  const sisa = days < 0 ? 'sudah lewat' : `sisa ${formatLimit(days)} hari`;

  return `${expiry.format('DD-MM-YYYY')} (${sisa})`;
}

/**
 * Cek API key Autoresbot lewat endpoint `check_apikey`.
 *
 * Endpoint ini dipakai karena tidak memotong kuota - berbeda dengan
 * mengirim prompt percobaan ke endpoint AI.
 *
 * @returns {Promise<{status: string, details?: [string, string][]}>}
 */
async function check() {
  if (!AUTORESBOT.API_KEY) return { status: '❌ Tidak valid (API Key kosong)' };

  try {
    const { data } = await axios.get(CHECK_URL, {
      params: { apikey: AUTORESBOT.API_KEY },
      timeout: CHECK_TIMEOUT_MS,
    });

    return {
      status: '✅ Valid',
      details: [
        ['Sisa limit', formatLimit(data.limit_apikey)],
        ['Masa aktif', formatExpiry(data.limit_key_tgl)],
      ],
    };
  } catch (error) {
    const message = error.response?.data?.message;
    return { status: message ? `❌ ${message}` : '❌ Tidak valid' };
  }
}

export default { name: 'Autoresbot', ask, check };
