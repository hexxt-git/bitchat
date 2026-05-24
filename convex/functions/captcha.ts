import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

type FontRow = number;
type FontData = Record<string, FontRow[]>;

const FONT: FontData = {
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  '3': [0b01110, 0b10001, 0b00001, 0b00110, 0b00001, 0b10001, 0b01110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  '6': [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  'A': [0b00100, 0b01010, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001],
  'B': [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  'C': [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  'D': [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  'E': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  'F': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  'G': [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  'H': [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'J': [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  'K': [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  'L': [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  'M': [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  'N': [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  'P': [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  'R': [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  'T': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'V': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  'W': [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  'X': [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  'Y': [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  'Z': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
};

const CAPTCHA_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CAPTCHA_LENGTH = 5;
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

function randomChar(): string {
  return CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
}

function generateCaptchaText(): string {
  let text = "";
  for (let i = 0; i < CAPTCHA_LENGTH; i++) {
    text += randomChar();
  }
  return text;
}

function generateSvgCaptcha(text: string): string {
  const PIXEL = 5;
  const COLS = 5;
  const ROWS = 7;
  const SPACING = 8;
  const PADDING_X = 15;
  const PADDING_Y = 15;

  const charW = COLS * PIXEL;
  const charH = ROWS * PIXEL;
  const totalW = text.length * charW + (text.length - 1) * SPACING + PADDING_X * 2;
  const totalH = charH + PADDING_Y * 2;

  const elements: string[] = [];

  elements.push(`<rect width="${totalW}" height="${totalH}" fill="white"/>`);

  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * totalW);
    const y = Math.floor(Math.random() * totalH);
    const size = 1 + Math.floor(Math.random() * 2);
    elements.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#ddd"/>`);
  }

  for (let i = 0; i < 3; i++) {
    const x1 = Math.floor(Math.random() * totalW);
    const y1 = Math.floor(Math.random() * totalH);
    const x2 = Math.floor(Math.random() * totalW);
    const y2 = Math.floor(Math.random() * totalH);
    elements.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#bbb" stroke-width="1.5" opacity="0.4"/>`);
  }

  text.split("").forEach((char, idx) => {
    const fontData = FONT[char];
    if (!fontData) return;

    const cx = PADDING_X + idx * (charW + SPACING) + charW / 2;
    const cy = PADDING_Y + charH / 2;
    const rotation = (Math.random() - 0.5) * 30;

    elements.push(`<g transform="translate(${cx}, ${cy}) rotate(${rotation})">`);

    fontData.forEach((row, rowIdx) => {
      for (let col = 0; col < COLS; col++) {
        if (row & (1 << (4 - col))) {
          const x = col * PIXEL - charW / 2;
          const y = rowIdx * PIXEL - charH / 2;
          elements.push(`<rect x="${x}" y="${y}" width="${PIXEL}" height="${PIXEL}" fill="black"/>`);
        }
      }
    });

    elements.push(`</g>`);
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">${elements.join("")}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const generateCaptcha = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    const expired = await ctx.db
      .query("captchas")
      .withIndex("by_expires", (q) => q.lte("expiresAt", now))
      .collect();
    await Promise.all(expired.map((c) => ctx.db.delete("captchas", c._id)));

    const text = generateCaptchaText();
    const captchaId = await ctx.db.insert("captchas", {
      text,
      expiresAt: now + CAPTCHA_TTL_MS,
    });

    const image = generateSvgCaptcha(text);

    return { captchaId, image };
  },
});

export const verifyCaptcha = mutation({
  args: {
    captchaId: v.id("captchas"),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const captcha = await ctx.db.get("captchas", args.captchaId);
    if (!captcha) {
      return { valid: false, reason: "Captcha not found" };
    }

    if (Date.now() > captcha.expiresAt) {
      await ctx.db.delete("captchas", args.captchaId);
      return { valid: false, reason: "Captcha expired" };
    }

    const isValid = captcha.text.toUpperCase() === args.answer.toUpperCase().trim();
    if (!isValid) {
      return { valid: false, reason: "Incorrect captcha" };
    }

    await ctx.db.delete("captchas", args.captchaId);
    return { valid: true };
  },
});
