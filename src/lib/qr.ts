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

// Decode + verify a scanned string. Returns the booth id only if the token checks out.
export function parseQrPayload(text: string): ParsedScan {
  const trimmed = text.trim();
  const parts = trimmed.split("|");
  if (parts.length !== 3 || parts[0] !== QR_PREFIX) {
    return { ok: false, reason: "foreign" };
  }
  const [, boothId, token] = parts;
  if (token !== tokenFor(boothId)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, boothId };
}
