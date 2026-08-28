import { text } from '../replies.js';
import { pick } from '../../utils/random.js';
import {
  GREETINGS,
  GREETING_REPLIES,
  IDENTITY_QUESTIONS,
  IDENTITY_REPLIES,
  OWNER_QUESTIONS,
  OWNER_REPLIES,
} from '../responses.js';

/** Sapaan singkat: "halo", "hai", "bot", dst. */
async function greeting(ctx) {
  if (!GREETINGS.includes(ctx.text)) return null;
  return text(pick(GREETING_REPLIES));
}

/** Pertanyaan seputar identitas bot. */
async function identity(ctx) {
  if (!IDENTITY_QUESTIONS.some((keyword) => ctx.text.includes(keyword))) return null;
  return text(pick(IDENTITY_REPLIES));
}

/** Pertanyaan seputar pembuat bot. */
async function owner(ctx) {
  if (!OWNER_QUESTIONS.some((keyword) => ctx.text.includes(keyword))) return null;
  return text(pick(OWNER_REPLIES));
}

/** Pesan super pendek dianggap sapaan. */
async function tooShort(ctx) {
  if (ctx.text.length >= 2) return null;
  return text(pick(GREETING_REPLIES));
}

export { greeting, identity, owner, tooShort };
