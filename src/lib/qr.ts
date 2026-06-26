// QR payload format + salted verification token.
//
// Anti-cheat posture (see CLAUDE.md / PRD §9): casual event game. The salt lives
// in the client — a determined user with dev tools can derive tokens; that's an
// accepted, documented risk. The salt only stops someone trivially typing
// `?booth=1` to fake a scan.
//
// NOTE: keep SALT + tokenFor() in sync with scripts/generate-qr.mjs, which prints
// the printable QR strings for the owner.

export const QR_SALT = "illuspeak-2026-gmbb-l5";
export const QR_PREFIX = "ILSP";

// Small deterministic string hash (cyrb53-lite) -> base36. Not cryptographic;
// good enough to make tokens non-obvious for a casual game.
function hash(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return n.toString(36);
}

export function tokenFor(boothId: string): string {
  return hash(`${boothId}:${QR_SALT}`);
}

// The exact string each physical QR code should encode.
export function makeQrPayload(boothId: string): string {
  return `${QR_PREFIX}|${boothId}|${tokenFor(boothId)}`;
}

export type ParsedScan =
  | { ok: true; boothId: string }
  | { ok: false; reason: "foreign" | "invalid" };

// Pull the raw payload out of a scanned string. The printed QR codes encode a
// deep link (`https://site/?s=ILSP|b01|token`) so a phone's native camera can
// open the app. The in-app scanner sees that whole URL, so unwrap the ?s= param
// first; otherwise treat the text as a bare payload. Percent-decode if needed.
function unwrapPayload(text: string): string {
  let raw = text.trim();
  if (/^https?:\/\//i.test(raw) || raw.includes("?s=") || raw.includes("&s=")) {
    try {
      const s = new URL(raw, "https://illuspeak.netlify.app").searchParams.get("s");
      if (s) raw = s;
    } catch {
      /* not a parseable URL — fall through and use the raw text */
    }
  }
  if (raw.includes("%")) {
    try {
      raw = decodeURIComponent(raw);
    } catch {
      /* leave as-is */
    }
  }
  return raw.trim();
}

// Decode + verify a scanned string (bare payload OR deep-link URL). Returns the
// booth id only if the token checks out.
export function parseQrPayload(text: string): ParsedScan {
  const parts = unwrapPayload(text).split("|");
  if (parts.length !== 3 || parts[0] !== QR_PREFIX) {
    return { ok: false, reason: "foreign" };
  }
  const [, boothId, token] = parts;
  if (token !== tokenFor(boothId)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, boothId };
}
