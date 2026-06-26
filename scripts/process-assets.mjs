// One-time asset pipeline: turn the raw event art into web-ready files.
//
// The new hand-drawn art (in /NewAssets) already ships as true-alpha PNGs, so it
// only needs trim + resize + WebP encode. We deliberately reuse the SAME output
// filenames the app already references, so swapping the art needs no code changes.
// The one retained legacy asset (rainbow-streak) is still a flat JPEG with a baked
// checkerboard, so it keeps the flood-fill background removal. The map is copied.
//
// Run: npm run assets

import { readdir, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NEW = path.join(ROOT, "NewAssets"); // new hand-drawn art (true alpha)
const LEGACY = path.join(ROOT, "assets"); // retained legacy raw art
const OUT = path.join(ROOT, "public", "assets");

// True-alpha PNGs -> trim transparent margins, resize, encode WebP.
// Output names mirror what the code already imports (see /src), so most swaps
// are zero-code. Decorative critter assignments are chosen from the new pool.
const ALPHA = [
  // --- Mandated swaps ---
  { src: "Tittle 2.png", out: "wordmark.webp", maxWidth: 1200 }, // landing logo
  { src: "Mascot.png", out: "mascot-paintbrush-kid.webp", maxWidth: 900 }, // hero mascot
  { src: "1 2.png", out: "mascot-bear.webp", maxWidth: 900 }, // victory creature
  // --- Floating critters / corner characters (reused filenames) ---
  { src: "Lizard_thing_.png", out: "mascot-ghost.webp", maxWidth: 700 },
  { src: "Pink_Color_Guy.png", out: "mascot-surfer.webp", maxWidth: 600 },
  { src: "3_Cat.png", out: "corner-cats-topleft.webp", maxWidth: 700 },
  { src: "mascot 2.png", out: "corner-bear-bottomright.webp", maxWidth: 700 },
  { src: "6.png", out: "cats-cluster-railing.webp", maxWidth: 800 },
  { src: "Bird.png", out: "critter-snail-pink.webp", maxWidth: 500 },
  { src: "5.png", out: "critter-snail-orange.webp", maxWidth: 500 },
  { src: "7.png", out: "critter-snail-cutie.webp", maxWidth: 500 },
  { src: "4.png", out: "critter-bird-pencil.webp", maxWidth: 500 },
  { src: "10.png", out: "critter-cat-lime.webp", maxWidth: 500 },
  // --- New decorative stars + final-poster tile background ---
  { src: "Star 1.PNG", out: "star-1.webp", maxWidth: 400 },
  { src: "Star 2.PNG", out: "star-2.webp", maxWidth: 400 },
  { src: "Star 3.PNG", out: "star-3.webp", maxWidth: 400 },
  { src: "Star 4.PNG", out: "star-4.webp", maxWidth: 400 },
  { src: "Final Poster.png", out: "poster-final.webp", maxWidth: 700 },
];

// Large illustrated backdrops -> resize hard + encode (sources are 40-61 MB).
const BACKDROPS = [
  { src: "Background.PNG", out: "hero-backdrop.webp", maxWidth: 1200 },
  { src: "Clouds.PNG", out: "clouds.webp", maxWidth: 1200 },
];

// Retained legacy JPEG with a baked checkerboard -> flood-fill removal.
const LEGACY_KEYED = [
  { src: "rainbow-streak.jpeg", out: "rainbow-streak.webp", maxWidth: 1000 },
];

// Already-clean PNG -> straight copy.
const COPIES = [{ src: "Map.png", out: "floorplan.png" }];

// --- Flood-fill checkerboard removal (legacy rainbow only) ---
function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function keyOutCheckerboard(data, width, height, chromaThreshold) {
  const n = width * height;
  const bg = new Uint8Array(n);
  const stack = [];
  const isGray = (i) =>
    chroma(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) < chromaThreshold;
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (!bg[i] && isGray(i)) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < width; x++) {
    pushIf(x, 0);
    pushIf(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIf(0, y);
    pushIf(width - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) pushIf(x - 1, y);
    if (x < width - 1) pushIf(x + 1, y);
    if (y > 0) pushIf(x, y - 1);
    if (y < height - 1) pushIf(x, y + 1);
  }
  const lum = (i) => (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  const passable = (i) => !bg[i] && isGray(i) && lum(i) > 150;
  const isSeedGray = (i) => isGray(i) && lum(i) > 150 && lum(i) < 210;
  const pocket = (start) => {
    const s = [start];
    bg[start] = 1;
    while (s.length) {
      const i = s.pop();
      const x = i % width;
      const y = (i / width) | 0;
      const tryN = (nx, ny) => {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) return;
        const j = ny * width + nx;
        if (passable(j)) {
          bg[j] = 1;
          s.push(j);
        }
      };
      tryN(x - 1, y);
      tryN(x + 1, y);
      tryN(x, y - 1);
      tryN(x, y + 1);
    }
  };
  for (let i = 0; i < n; i++) if (isSeedGray(i)) pocket(i);
  for (let i = 0; i < n; i++) if (bg[i]) data[i * 4 + 3] = 0;
  return bg;
}

// --- Encoders ---
async function trimResizeEncode(srcPath, outPath, maxWidth, quality = 82) {
  await sharp(srcPath)
    .trim() // crop away the big transparent artboard margins
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(outPath);
}

async function resizeEncode(srcPath, outPath, maxWidth, quality = 78) {
  await sharp(srcPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(outPath);
}

async function removeAndEncode(srcPath, outPath, maxWidth) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  keyOutCheckerboard(data, info.width, info.height, 30);
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath);
}

async function run(group, dir, encoder, label) {
  for (const { src, out, maxWidth } of group) {
    const srcPath = path.join(dir, src);
    if (!existsSync(srcPath)) {
      console.warn(`! no source for ${out} (${src}) — skipped`);
      continue;
    }
    try {
      console.log(`~ ${src} -> ${out} (${label})`);
      await encoder(srcPath, path.join(OUT, out), maxWidth);
      console.log(`  done ${out}`);
    } catch (err) {
      console.error(`  FAILED ${out}:`, err.message);
    }
  }
}

async function main() {
  // Refresh top-level files so stale, no-longer-used assets don't linger, but
  // keep subdirectories (sponsors/, org/) produced by the logo pipeline.
  await mkdir(OUT, { recursive: true });
  for (const entry of await readdir(OUT)) {
    const p = path.join(OUT, entry);
    if (statSync(p).isFile()) await rm(p, { force: true });
  }

  await run(ALPHA, NEW, (s, o, w) => trimResizeEncode(s, o, w), "alpha trim");
  await run(BACKDROPS, NEW, (s, o, w) => resizeEncode(s, o, w), "backdrop");
  await run(LEGACY_KEYED, LEGACY, (s, o, w) => removeAndEncode(s, o, w), "checkerboard");

  for (const { src, out } of COPIES) {
    const srcPath = path.join(LEGACY, src);
    if (!existsSync(srcPath)) {
      console.warn(`! missing ${src} — skipped`);
      continue;
    }
    await copyFile(srcPath, path.join(OUT, out));
    console.log(`= ${src} -> ${out}`);
  }

  const produced = await readdir(OUT);
  await writeFile(
    path.join(OUT, "MANIFEST.json"),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), files: produced.sort() },
      null,
      2,
    ),
  );
  console.log(`\nDone. ${produced.length} files in public/assets.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
