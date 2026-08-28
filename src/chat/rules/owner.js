import config from '../../../config.js';
import { text } from '../replies.js';
import { block, item } from '../../utils/format.js';
import { toJid, isValidPhoneNumber } from '../../utils/jid.js';
import { addUser, editUser, deleteUser, resetUsersJson } from '../../state/users.js';

const INVALID_NUMBER = block([
  '*NOMOR TIDAK VALID*',
  '',
  'Tulis nomor lengkap 10-15 digit angka saja, tanpa spasi atau simbol.',
]);

/** Format & contoh pemakaian tiap perintah owner, dipakai juga oleh menu bantuan. */
const USAGE = {
  addprem: { format: '.addprem <nomor> <hari>', example: '.addprem 6285246154386 30' },
  delprem: { format: '.delprem <nomor>', example: '.delprem 6285246154386' },
  editprem: { format: '.editprem <nomor> <hari>', example: '.editprem 6285246154386 15' },
};

/** Teks bantuan sebuah perintah owner. */
function usageText(name) {
  const { format, example } = USAGE[name];

  return block([
    `*${name.toUpperCase()}*`,
    '',
    item('Format', `\`${format}\``),
    item('Contoh', `\`${example}\``),
  ]);
}

/** Membaca argumen nomor (boleh diawali `@`) dan memvalidasinya. */
function parseNumber(rawNumber) {
  const number = String(rawNumber ?? '').replace(/^@/, '');
  return isValidPhoneNumber(number) ? toJid(number) : null;
}

/** Hasil sukses dengan gaya seragam. */
const done = (message) => text(block(['*BERHASIL*', '', message]));

/** Perintah owner beserta handler-nya. */
const OWNER_COMMANDS = {
  addprem: ([, rawNumber, day]) => {
    if (!rawNumber || !day) return text(usageText('addprem'));

    const jid = parseNumber(rawNumber);
    if (!jid) return text(INVALID_NUMBER);

    addUser(jid, day);
    return done(`${jid} kini premium selama ${day} hari.`);
  },

  delprem: ([, rawNumber]) => {
    if (!rawNumber) return text(usageText('delprem'));

    const jid = parseNumber(rawNumber);
    if (!jid) return text(INVALID_NUMBER);

    deleteUser(jid);
    return done(`${jid} dihapus dari daftar premium.`);
  },

  editprem: ([, rawNumber, day]) => {
    if (!rawNumber || !day) return text(usageText('editprem'));

    const jid = parseNumber(rawNumber);
    if (!jid) return text(INVALID_NUMBER);

    editUser(jid, day);
    return done(`Masa premium ${jid} diubah menjadi ${day} hari.`);
  },

  resetdata: () => {
    resetUsersJson();
    return done('Seluruh data users telah direset.');
  },
};

/** Perintah manajemen user: `addprem`, `delprem`, `editprem`, `resetdata`. */
async function ownerCommands(ctx) {
  const name = Object.keys(OWNER_COMMANDS).find((cmd) => ctx.text.startsWith(cmd));
  if (!name) return null;

  if (!ctx.isOwner) return text(config.notification.only_owner);

  return OWNER_COMMANDS[name](ctx.text.split(' '));
}

export { ownerCommands, usageText };
