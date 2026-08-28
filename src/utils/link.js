/** Domain yang dikenali bot beserta pola URL-nya. */
const DOMAINS = [
  { name: 'TikTok', patterns: ['tiktok.com'] },
  { name: 'Google', patterns: ['google.com'] },
  { name: 'YouTube', patterns: ['youtube.com', 'youtu.be'] },
  { name: 'Whatsapp', patterns: ['whatsapp.com'] },
  { name: 'Facebook', patterns: ['facebook.com'] },
  { name: 'Instagram', patterns: ['instagram.com'] },
];

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/**
 * Mencari link di dalam sebuah pesan.
 * @returns `{ link, name }` bila ketemu (name = 'undefined' untuk domain tak dikenal), selain itu `null`.
 */
function detectLink(message) {
  const foundLinks = message.match(URL_PATTERN);
  if (!foundLinks) return null;

  for (const link of foundLinks) {
    for (const domain of DOMAINS) {
      if (domain.patterns.some((pattern) => link.includes(pattern))) {
        return { link, name: domain.name };
      }
    }
  }

  return { link: foundLinks, name: 'undefined' };
}

export { detectLink };
