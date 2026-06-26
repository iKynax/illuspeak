// Sponsor + organizer logo pipeline: trim, resize, encode to WebP.
//
// Sources live in /LOGO (mixed sizes; the 3 originally-PDF/PSD logos were
// pre-converted to PNG via scripts/convert-logos.py). Output:
//   public/assets/sponsors/<slug>.webp   (event sponsors)
//   public/assets/org/<slug>.webp        ("Brought to you by" organizers)
//
// Run: npm run logos   (after npm run assets)

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "LOGO");
const OUT_SPONSORS = path.join(ROOT, "public", "assets", "sponsors");
const OUT_ORG = path.join(ROOT, "public", "assets", "org");

// slug -> source filename in /LOGO. Slugs match sponsors[].id usage in src/data.
const SPONSORS = [
  { slug: "lafayette", src: "Lafayette.png" }, // converted from PDF
  { slug: "bumi", src: "Bumi.png" }, // converted from PSD
  { slug: "faber-castell", src: "FC-AG.png" }, // converted from PDF
  { slug: "huak-huak", src: "Huak Huak.png" },
  { slug: "monin", src: "LOGO_MONIN_WITH PANACHE versions_RGB_OK_Brown.png" },
  { slug: "gmbb", src: "Logo_GMBB_Space (Light background).png" },
  { slug: "playtee", src: "Playtee Cropped .png" },
  { slug: "rtist", src: "Rtist-logo-blue-png (1).png" },
  { slug: "weststar", src: "Weststar Printing Logo_2D.png" },
  { slug: "lostgens", src: "lostgens logo - grey.png" },
  { slug: "lostprint", src: "lostprint logo-01.png" },
];

const ORG = [
  { slug: "illus", src: "Logo Illus (1).png" },
  { slug: "mia", src: "Logo Mia (1).png" },
];

async function encode(srcPath, outPath, maxWidth) {
  await sharp(srcPath)
    .trim()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 90, effort: 5 })
    .toFile(outPath);
}

async function run(group, outDir, maxWidth) {
  await mkdir(outDir, { recursive: true });
  const produced = [];
  for (const { slug, src } of group) {
    const srcPath = path.join(SRC, src);
    if (!existsSync(srcPath)) {
      console.warn(`! missing ${src} — skipped ${slug}`);
      continue;
    }
    const out = `${slug}.webp`;
    try {
      await encode(srcPath, path.join(outDir, out), maxWidth);
      produced.push(out);
      console.log(`~ ${src} -> ${path.basename(outDir)}/${out}`);
    } catch (err) {
      console.error(`  FAILED ${slug}:`, err.message);
    }
  }
  return produced;
}

async function main() {
  const s = await run(SPONSORS, OUT_SPONSORS, 600);
  const o = await run(ORG, OUT_ORG, 600);
  await writeFile(
    path.join(OUT_SPONSORS, "MANIFEST.json"),
    JSON.stringify({ sponsors: s.sort(), organizers: o.sort() }, null, 2),
  );
  console.log(`\nDone. ${s.length} sponsor + ${o.length} organizer logos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
