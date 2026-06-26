// Generate the 6 printable stamp QR codes for the owner.
//
// Imports the REAL game data + token logic (via Node type-stripping) so the
// printed codes always match what the app verifies — no drift.
//
// Each QR encodes a NATIVE-CAMERA DEEP LINK:
//   <SITE_URL>/?s=<encodeURIComponent(payload)>
// Scanning with the phone's normal camera opens the live site, which reads ?s=,
// verifies the token, and auto-collects that stamp (order-independent). The
// in-app scanner still works because the same payload is embedded in the URL.
//
// Run:  SITE_URL=https://illuspeak.netlify.app npm run qr
// Output: qr/stamp-<id>.png  +  qr/print-sheet.html (open & print)

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { gameTargets, loc } from "../src/data/booths.ts";
import { makeQrPayload } from "../src/lib/qr.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "qr");

// Where the deployed app lives. Override per environment.
const SITE_URL = (process.env.SITE_URL || "https://illuspeak.netlify.app").replace(
  /\/+$/,
  "",
);

function deepLink(boothId) {
  return `${SITE_URL}/?s=${encodeURIComponent(makeQrPayload(boothId))}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Site URL: ${SITE_URL}\n`);

  const cards = [];
  for (let i = 0; i < gameTargets.length; i++) {
    const booth = gameTargets[i];
    const payload = deepLink(booth.id);
    const file = `stamp-${booth.id}.png`;
    await QRCode.toFile(path.join(OUT, file), payload, {
      width: 800,
      margin: 2,
      color: { dark: "#2A2140", light: "#FFFFFF" },
    });
    const name = loc(booth.name, "en");
    cards.push({ n: i + 1, booth, name, hint: booth.game ? loc(booth.game.hint, "en") : "", payload, file });
    console.log(`#${i + 1} ${name} (${booth.id}) -> qr/${file}`);
    console.log(`     url: ${payload}`);
  }

  // Printable contact sheet.
  const html = `<!doctype html><meta charset="utf-8">
<title>Illuspeak — Stamp QR codes</title>
<style>
  body{font-family:sans-serif;padding:24px;color:#2A2140}
  h1{margin:0 0 4px}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:16px}
  .card{border:3px solid #2A2140;border-radius:16px;padding:16px;text-align:center;break-inside:avoid}
  .card img{width:100%;max-width:300px}
  .name{font-size:20px;font-weight:800;margin-top:8px}
  .hint{font-size:13px;color:#555;margin-top:4px}
  @media print{.note{display:none}}
</style>
<h1>Illuspeak — Stamp Rally QR codes</h1>
<p class="note">Print this, cut out each code, and place it at the matching booth.</p>
<div class="grid">
${cards
  .map(
    (c) => `  <div class="card">
    <img src="${c.file}" alt="">
    <div class="name">#${c.n} · ${c.name}</div>
    <div class="hint">${c.hint}</div>
  </div>`,
  )
  .join("\n")}
</div>`;
  await writeFile(path.join(OUT, "print-sheet.html"), html);
  console.log(`\nDone. Open qr/print-sheet.html and print.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
