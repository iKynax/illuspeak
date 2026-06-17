// One-time asset pipeline: turn the raw event art into web-ready files.
//
// The raw character/wordmark art (in /assets) ships as flat JPEGs with a baked-in
// fake-transparency checkerboard. JPEG has no alpha, so we run AI background removal
// to recover true transparency, then trim + resize + encode to WebP.
// The map and posters are already real PNGs, so we just copy them.
//
// Run: npm run assets

import { readdir, mkdir, copyFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "assets");
const OUT = path.join(ROOT, "public", "assets");

// Characters/wordmark/critters -> remove the fake-transparency checkerboard,
// output transparent WebP. Source files now have clean descriptive names
// (renamed in STEP 0), so the output base name just mirrors the source.
const CHARACTERS = [
  { src: "wordmark.jpeg", out: "wordmark.webp", maxWidth: 1200 },
  { src: "mascot-paintbrush-kid.jpeg", out: "mascot-paintbrush-kid.webp", maxWidth: 900 },
  { src: "mascot-ghost.jpeg", out: "mascot-ghost.webp", maxWidth: 700 },
  { src: "mascot-bear.jpeg", out: "mascot-bear.webp", maxWidth: 1000 },
  { src: "mascot-surfer.jpeg", out: "mascot-surfer.webp", maxWidth: 600 },
  { src: "rainbow-streak.jpeg", out: "rainbow-streak.webp", maxWidth: 1000 },
  { src: "corner-cats-topleft.jpeg", out: "corner-cats-topleft.webp", maxWidth: 700 },
  { src: "corner-bear-bottomright.jpeg", out: "corner-bear-bottomright.webp", maxWidth: 700 },
  { src: "cats-cluster-railing.jpeg", out: "cats-cluster-railing.webp", maxWidth: 800 },
  // Scattered critters (the floating accents).
  { src: "critter-snail-pink.jpeg", out: "critter-snail-pink.webp", maxWidth: 500 },
  { src: "critter-snail-orange.jpeg", out: "critter-snail-orange.webp", maxWidth: 500 },
  { src: "critter-snail-cutie.jpeg", out: "critter-snail-cutie.webp", maxWidth: 500 },
  { src: "critter-bird-pencil.jpeg", out: "critter-bird-pencil.webp", maxWidth: 500 },
  { src: "critter-cat-lime.jpeg", out: "critter-cat-lime.webp", maxWidth: 500 },
];

// Real photographs -> NO background removal (they have no checkerboard, and the
// flood-fill would eat the sky). Just resize + encode. The hero applies its
// duotone/grayscale treatment in CSS, not baked into the asset.
const PHOTOS = [
  { src: "hero-backdrop.jpeg", out: "hero-backdrop.webp", maxWidth: 1080 },
];

// Already-clean PNGs -> straight copy.
const COPIES = [
  { src: "Map.png", out: "floorplan.png" },
  { src: "Poster1.png", out: "poster-1.png" },
  { src: "Poster2.png", out: "poster-2.png" },
  { src: "Poster3.png", out: "poster-3.png" },
];

// Per-pixel chroma (saturation proxy). The checkerboard background is gray
// (R~=G~=B -> low chroma); every character is vibrant (high chroma).
function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

// Flood-fill from the image border through "background-like" gray pixels and
// knock out their alpha. Stops at the bold colored outlines, so interior whites
// (gloves, eyes) are preserved because the fill can't reach them.
function keyOutCheckerboard(data, width, height, chromaThreshold) {
  const n = width * height;
  const bg = new Uint8Array(n); // 1 = background
  const stack = [];

  const isGray = (i) =>
    chroma(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) < chromaThreshold;

  // Seed from every border pixel that looks like background.
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

  // 4-connected flood fill.
  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) pushIf(x - 1, y);
    if (x < width - 1) pushIf(x + 1, y);
    if (y > 0) pushIf(x, y - 1);
    if (y < height - 1) pushIf(x, y + 1);
  }

  // Second pass: trapped checkerboard pockets the border fill can't reach
  // (e.g. gaps between railing bars). The checkerboard is gray ~177 + white 255;
  // pure white is ambiguous with gloves, but the GRAY 177 is unique to the
  // background. So we seed ONLY from mid-gray pixels and flood through the whole
  // connected gray+white pocket. The dark ink outlines (low luminance) wall it
  // off, so foreground whites are never reached.
  const lum = (i) =>
    (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  // traversable = light, low-chroma (gray or white), and not already bg
  const passable = (i) => !bg[i] && isGray(i) && lum(i) > 150;
  // seed = specifically the checkerboard's mid-gray (not white, not ink)
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
  for (let i = 0; i < n; i++) {
    if (isSeedGray(i)) pocket(i);
  }

  // Knock out background alpha.
  for (let i = 0; i < n; i++) {
    if (bg[i]) data[i * 4 + 3] = 0;
  }
  return bg;
}

// Photos: resize + encode only, keep the pixels intact.
async function resizeAndEncode(srcPath, outPath, maxWidth) {
  await sharp(srcPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
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
    .trim() // crop away fully-transparent margins
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath);
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Source folder not found: ${SRC}`);
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });

  // 1. Characters / wordmark / critters -> background removed
  for (const { src, out, maxWidth } of CHARACTERS) {
    const srcPath = path.join(SRC, src);
    if (!existsSync(srcPath)) {
      console.warn(`! no source for ${out} (${src}) — skipped`);
      continue;
    }
    const outPath = path.join(OUT, out);
    try {
      console.log(`~ ${src} -> ${out} (removing background)`);
      await removeAndEncode(srcPath, outPath, maxWidth);
      console.log(`  done ${out}`);
    } catch (err) {
      console.error(`  FAILED ${out}:`, err.message);
    }
  }

  // 2. Photos -> resize + encode only (no background removal)
  for (const { src, out, maxWidth } of PHOTOS) {
    const srcPath = path.join(SRC, src);
    if (!existsSync(srcPath)) {
      console.warn(`! no source for ${out} (${src}) — skipped`);
      continue;
    }
    const outPath = path.join(OUT, out);
    try {
      console.log(`~ ${src} -> ${out} (photo, resize only)`);
      await resizeAndEncode(srcPath, outPath, maxWidth);
      console.log(`  done ${out}`);
    } catch (err) {
      console.error(`  FAILED ${out}:`, err.message);
    }
  }

  // 3. Straight copies (map + posters)
  for (const { src, out } of COPIES) {
    const srcPath = path.join(SRC, src);
    if (!existsSync(srcPath)) {
      console.warn(`! missing ${src} — skipped`);
      continue;
    }
    await copyFile(srcPath, path.join(OUT, out));
    console.log(`= ${src} -> ${out}`);
  }

  // 4. Manifest so the app and humans know what exists.
  const produced = await readdir(OUT);
  await writeFile(
    path.join(OUT, "MANIFEST.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), files: produced.sort() }, null, 2),
  );
  console.log(`\nDone. ${produced.length} files in public/assets.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
