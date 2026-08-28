import config from '../../../config.js';
import { text } from '../replies.js';
import { displayMenu } from '../menus.js';
import { usageText } from './owner.js';
import { DIVIDER, heading, item, block } from '../../utils/format.js';
import { providerStatus } from '../../ai/index.js';
import { clearHistory } from '../../ai/history.js';
import { resetSession } from '../../state/session.js';
import { getUserPremium, getAllUsers } from '../../state/users.js';

const CHANNEL_URL = 'https://www.whatsapp.com/channel/0029VaDSRuf05MUekJbazP1D';
const DOWNLOAD_URL = 'https://autoresbot.com/download';

/** Tampilan perintah `info`. */
function botInfo() {
  return block([
    heading('ℹ️', 'Informasi Bot'),
    '',
    item('Nama', config.name_bot),
    item('Owner', config.owner_website),
    item('Versi', config.version),
    '',
    DIVIDER,
    '',
    `Script gratis, unduh di:\n${DOWNLOAD_URL}`,
    '',
    `Saluran resmi:\n${CHANNEL_URL}`,
  ]);
}

/**
 * Perintah dengan kecocokan persis (tanpa argumen).
 * Setiap handler menerima `ctx` dan mengembalikan objek balasan.
 */
const COMMANDS = {
  reset: ({ sender }) => {
    resetSession(sender);
    clearHistory(sender);
    return text(config.notification.reset);
  },

  limit: ({ limit }) => text(block([heading('📊', 'Sisa Limit'), '', item('Hari ini', limit)])),

  apikey: async () => text(await providerStatus()),

  ig: () => text(config.notification.ig),
  tt: () => text(config.notification.tt),
  fb: () => text(config.notification.fb),

  info: () => text(botInfo()),

  id: ({ sender }) => text(block([heading('🆔', 'ID Pengguna'), '', `\`${sender}\``])),

  addprem: () => text(usageText('addprem')),
  delprem: () => text(usageText('delprem')),
  editprem: () => text(usageText('editprem')),

  listprem: () => text(getUserPremium()),
  listuser: () => text(getAllUsers()),
  listusers: () => text(getAllUsers()),
};

/** Alias perintah yang menghasilkan balasan yang sama. */
const ALIASES = {
  menu: ({ sender }) => text(displayMenu(sender)),
  allmenu: ({ sender }) => text(displayMenu(sender)),
  tiktok: () => text(config.notification.tt),
};

/** Perintah persis: `reset`, `limit`, `info`, `listprem`, dst. */
async function exactCommands(ctx) {
  const handler = COMMANDS[ctx.text];
  return handler ? handler(ctx) : null;
}

/** Alias menu: `menu`, `allmenu`, `tiktok`. */
async function menuAliases(ctx) {
  const handler = ALIASES[ctx.text.replace(/^[.#]/, '')];
  return handler ? handler(ctx) : null;
}

export { exactCommands, menuAliases };
