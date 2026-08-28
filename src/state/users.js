import fs from 'fs';
import path from 'path';
import moment from 'moment';
import config from '../../config.js';
import { DATABASE_DIR } from '../utils/files.js';
import { heading, item, block } from '../utils/format.js';

const FILE_PATH = path.join(DATABASE_DIR, 'users.json');

/* ------------------------------ Penyimpanan ------------------------------ */

function readData() {
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/** Mengosongkan seluruh database user. */
function resetUsersJson() {
  fs.writeFile(FILE_PATH, JSON.stringify({ users: [] }, null, 2), (err) => {
    if (err) console.error('Gagal mereset users.json:', err);
  });
}

/* -------------------------------- Premium -------------------------------- */

/** Menghitung `premium_end` berdasarkan durasi hari. `-1` berarti user biasa. */
function premiumPeriod(days) {
  const premiumStart = moment();
  const premiumEnd =
    Number(days) === -1 ? moment().subtract(1, 'days') : premiumStart.clone().add(days, 'days');

  return { premiumStart, premiumEnd };
}

function isPremiumUser(user) {
  return moment(user.premium_end).isAfter(moment());
}

/* --------------------------------- Limit --------------------------------- */

/**
 * Sisa limit harian user.
 * @returns {number|'Unlimited'} `'Unlimited'` untuk premium, `0` bila user tidak valid.
 */
function checkLimit(user) {
  if (!user || typeof user !== 'object') return 0;
  if (isPremiumUser(user)) return 'Unlimited';

  const currentDate = moment().format('YYYY-MM-DD');

  if (user.limit === undefined) {
    user.limit = config.total_limit;
    user.last_reset = currentDate;
  }

  if (user.last_reset !== currentDate) {
    user.limit = config.total_limit;
    user.last_reset = currentDate;
  }

  return user.limit;
}

/** Mengurangi satu limit harian. User premium tidak terpengaruh. */
function reduceLimit(id) {
  const data = readData();
  const user = data.users.find((u) => u.id === id);
  if (!user || isPremiumUser(user)) return;

  if (checkLimit(user) > 0) {
    user.limit -= 1;
    writeData(data);
  }
}

/* ---------------------------------- CRUD --------------------------------- */

/** Menambah user baru atau memperbarui masa premium bila sudah ada. */
function addUser(id, premiumDurationDays) {
  const data = readData();
  const { premiumStart, premiumEnd } = premiumPeriod(premiumDurationDays);
  const user = data.users.find((u) => u.id === id);

  if (user) {
    console.log(`User with ID ${id} already exists. Updating premium duration.`);
    user.premium_start = premiumStart.format();
    user.premium_end = premiumEnd.format();
  } else {
    data.users.push({
      id,
      premium_start: premiumStart.format(),
      premium_end: premiumEnd.format(),
    });
  }

  writeData(data);
}

/** Mengubah masa premium user yang sudah terdaftar. */
function editUser(id, premiumDurationDays) {
  const data = readData();
  const user = data.users.find((u) => u.id === id);
  if (!user) return;

  const premiumStart = moment();
  user.premium_start = premiumStart.format();
  user.premium_end = premiumStart.clone().add(premiumDurationDays, 'days').format();

  writeData(data);
}

function deleteUser(id) {
  const data = readData();
  const updatedUsers = data.users.filter((u) => u.id !== id);
  if (updatedUsers.length === data.users.length) return;

  data.users = updatedUsers;
  writeData(data);
}

/** Mengambil data user; otomatis mendaftarkan user baru bila belum ada. */
function getUser(id) {
  const data = readData();
  let user = data.users.find((u) => u.id === id);

  if (!user) {
    user = {
      id,
      limit: config.total_limit,
      last_reset: moment().format('YYYY-MM-DD'),
      premium_start: null,
      premium_end: moment().subtract(1, 'day').format(),
    };
    data.users.push(user);
    writeData(data);
  }

  return user;
}

/* -------------------------------- Laporan -------------------------------- */

/** Daftar user dalam gaya tampilan yang sama dengan menu. */
function formatUserList(emoji, title, users) {
  const sorted = [...users].sort((a, b) => new Date(a.premium_end) - new Date(b.premium_end));

  const rows = sorted.map((user) =>
    item(user.id.split('@')[0], moment(user.premium_end).format('YYYY-MM-DD')),
  );

  return block([
    `${heading(emoji, title)} (${users.length})`,
    '',
    ...(rows.length ? rows : ['Belum ada data.']),
  ]);
}

function getUserPremium() {
  const data = readData();
  const premiumUsers = data.users.filter((user) =>
    moment(user.premium_end).isSameOrAfter(moment()),
  );

  return formatUserList('👑', 'Daftar Premium', premiumUsers);
}

function getAllUsers() {
  return formatUserList('👥', 'Daftar Pengguna', readData().users);
}

export {
  addUser,
  editUser,
  deleteUser,
  getUser,
  isPremiumUser,
  checkLimit,
  reduceLimit,
  getUserPremium,
  getAllUsers,
  resetUsersJson,
};
