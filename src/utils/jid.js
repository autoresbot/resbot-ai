/** JID yang boleh dikirimi pesan oleh bot. */
function isValidJid(jid) {
  return jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us') || jid.endsWith('@lid');
}

/** Membuang suffix `@s.whatsapp.net` sehingga tersisa nomornya saja. */
function normalizeJid(jid) {
  return jid.replace(/@s\.whatsapp\.net$/, '');
}

/** Mengubah nomor mentah (boleh diawali `@`) menjadi JID WhatsApp. */
function toJid(rawNumber) {
  return `${String(rawNumber).replace(/^@/, '')}@s.whatsapp.net`;
}

/** Validasi nomor telepon polos: 10-15 digit tanpa spasi/simbol. */
function isValidPhoneNumber(rawNumber) {
  return /^[0-9]{10,15}$/.test(rawNumber);
}

export { isValidJid, normalizeJid, toJid, isValidPhoneNumber };
