# Illuspeak — Extracting Components from the Key Visuals

Pulling isolated, web-ready elements out of the three poster key visuals using Google Flow + Nano Banana 2 / Nano Banana Pro, then using them in the site.

---

## Principle

Extract **objects**, recreate **textures**.

- Extract (AI isolate + clean redraw): characters, mascots, the wordmark, discrete critters. These have clear edges and read as standalone things.
- Recreate (code/CSS, not AI): halftone dot fields, duotone street-photo backdrops, scratchy doodle bleed. These are textures; cutting them out produces fringing and hallucinated edges. CSS does them better and lighter.

This matches the "AI for hero/mascots, code for UI accents" decision.

---

## Your actual extracted assets (from Google Flow)

You've now generated these. Inventory and intended use:

| Asset | Status | Use in site |
|---|---|---|
| ILLUSPEAK wordmark | Clean, transparent | Hero logo, share card |
| Paintbrush-head kid | Clean, transparent | Main hero mascot, share card |
| Pink bear + crown | Check alpha (may have white fill) | Big hero/celebration moment, completion screen |
| Floating pink ghost | Check alpha (may have white fill) | Floating accent across sections |
| Rainbow zigzag streak | Clean, transparent | Hero/section decorative streak, progress flourish |
| Snail critter | Clean, transparent | Floating accent, map pin flavor |
| Bird-on-pencil critter | Clean, transparent | Floating accent, empty-state flavor |

Two cleanup notes:
- The **bear** and **ghost** came back over a faint white/checker — confirm the PNGs have
  true alpha, not a baked white background. If white is real pixels, re-run that one with
  "fully transparent background, no white fill, alpha channel only."
- Compress all of them (tinypng / webp) before dropping in `public/assets/` — transparent
  character PNGs get heavy, and this loads on venue wifi.

---

## The extraction target list

From the three posters:

1. **ILLUSPEAK wordmark** — the hand-lettered logo. Your hero logo asset.
2. **Paintbrush-head kid** (Poster 1) — the climbing character with the blue paintbrush hair, yellow tee, gloves. Main mascot.
3. **Pink ghost/sprite** (Poster 2) — the floating pink character with the green leaf sprout.
4. **Pink bear + rainbow slide** (Poster 3) — the big bear face with the rainbow tongue-slide. Big hero moment; can also split the bear head and the rainbow as two assets.
5. **Side critters** — small bird, snail/creature, tiny figures. Decorative floating accents.

Each comes out as a **transparent PNG**, redrawn clean at higher resolution in the same style.

---

## Key technique: isolate AND redraw, don't just background-remove

The uploaded posters are low-res. A plain background removal gives you a small blurry cutout. Instead, prompt for a faithful higher-resolution redraw in the identical style, on transparent background. You're asking the model to "re-illustrate this exact character cleanly and isolated," not "erase the background."

---

## Prompts (Nano Banana Pro, image + text)

Feed the relevant poster as the image input alongside each prompt.

### 1. Wordmark
> Isolate only the hand-lettered "ILLUSPEAK" logo text from this image. Redraw it cleanly and faithfully in the exact same playful marker lettering style, same colors and thick ink outline and comic burst, at high resolution. Output the wordmark alone on a fully transparent background. Do not include any other elements, photography, or texture.

### 2. Paintbrush-head kid (input: Poster 1)
> Isolate only the cartoon character with the blue paintbrush-shaped hair, yellow t-shirt and white gloves from this poster. Redraw the full character faithfully in the exact same style, line weight, and colors, at high resolution, complete and uncropped. Output the character alone on a fully transparent background. Remove all background photography, halftone, text, and other elements.

### 3. Pink ghost/sprite (input: Poster 2)
> Isolate only the floating pink ghost-like character with the small green leaf sprout on its head and rosy cheeks. Redraw it faithfully in the same style and colors at high resolution, complete. Output the character alone on a fully transparent background, nothing else.

### 4. Pink bear (input: Poster 3)
> Isolate only the large pink bear head character. Redraw it faithfully in the same hand-drawn style and colors at high resolution. Output the bear alone on a fully transparent background, no rainbow, no background, no text.

### 4b. Rainbow slide (input: Poster 3, separate pass)
> Isolate only the rainbow zigzag slide/streak element. Redraw it cleanly in the same colors and style at high resolution. Output it alone on a fully transparent background.

### 5. Side critters (one pass each)
> Isolate only the small [bird / snail creature / tiny figure] from this poster. Redraw it faithfully in the same style and colors at high resolution. Output it alone on a fully transparent background, nothing else.

### Tips for clean output
- Add "complete and uncropped, full body in frame" to avoid cut-off limbs.
- If it grabs background scraps, add "no photographic texture, no halftone dots, no other characters."
- Generate a couple of variants and keep the cleanest. Edges matter most where the asset will sit over busy backdrops.
- Ask for the largest resolution your tool allows; you can downscale for the web but can't upscale a blurry one.

---

## Recreate these in code (not AI)

### Halftone dot overlay (CSS)
```css
.halftone {
  background-image: radial-gradient(circle, rgba(0,0,0,0.18) 1.2px, transparent 1.3px);
  background-size: 8px 8px;
  mix-blend-mode: multiply; /* or overlay over color */
}
```

### Duotone street-photo backdrop (CSS filter / SVG)
Use a real photo, push it to a SOFT pastel pink/blue duotone (the calm undertone, not a
harsh hot wash) so it sits quietly behind the foreground:
```css
.duotone {
  filter: grayscale(1) contrast(1.05) brightness(1.1);
}
.duotone-wrap { position: relative; }
.duotone-wrap::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(135deg, #FFD6E8, #BFE6FF);
  mix-blend-mode: multiply; opacity: 0.75;
}
```
Keep it muted. The backdrop should read as a soft blue-pink wash, never compete with the
mascots and vibrant accents on top.

### Doodle accents
Draw simple marker squiggles/stars as inline SVG paths. Cheap, scalable, animatable, and they keep the hand-drawn energy without cutting from posters.

---

## Animating extracted assets (optional)

Two routes:

**A. CSS/Framer Motion (lighter, recommended for most).**
Float, bob, wobble, sparkle on the transparent PNGs. No video weight.
```jsx
<motion.img
  src="/assets/paintbrush-kid.png"
  animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
/>
```

**B. Image-to-video (for one or two "wow" moments only).**
Feed an extracted PNG to an image-to-video model:
> Gentle idle float and bob, subtle sparkle shimmer, hair/cloth sways slightly, seamless loop, no camera movement, character stays centered, transparent or solid background.
Keep loops 2-4s. Export webm/mp4 small. Use sparingly; video is heavy on mobile data at a venue.

For most of the site, route A is better: lighter, crisper, no buffering on venue wifi.

---

## Using the assets in the site

1. Drop cleaned PNGs in `public/assets/` with clear names:
   `wordmark.png, paintbrush-kid.png, pink-ghost.png, bear.png, rainbow.png, critter-bird.png ...`

2. **Hero:** wordmark + paintbrush-kid layered over a duotone photo backdrop with a halftone overlay. Kid gets a CSS float.
```jsx
<section className="hero">
  <div className="duotone-wrap"> <img src="/photo-bg.jpg" className="duotone" /> </div>
  <div className="halftone absolute inset-0" />
  <img src="/assets/wordmark.png" className="wordmark" />
  <motion.img src="/assets/paintbrush-kid.png" className="mascot"
    animate={{ y: [0,-12,0] }} transition={{ duration:4, repeat:Infinity }} />
</section>
```

3. **Floating accents:** pink ghost + critters as small `position: absolute` PNGs with idle float, scattered across sections for the collage feel. Keep them out of tap zones.

4. **Game stamps:** if you want the 6 stamps to feel hand-drawn, either extract small motifs or draw simple SVG stamp icons. On completion the stamp PNG "thunks" in with a spring.

5. **Share card:** composite wordmark + a mascot + the 6 stamps onto the 1080x1920 canvas so the saved IG card carries the real key-visual identity.

### Performance notes (mobile venue wifi)
- Compress PNGs (tinypng-style) and/or serve `.webp`. Transparent characters can be heavy.
- Lazy-load below-the-fold assets.
- Prefer CSS motion over video. Reserve video for at most one hero loop.
- Total hero asset weight target: keep it light enough to open fast on 4G.

---

## Workflow summary

1. Extract each object with the prompts above (isolate + clean redraw, transparent PNG, max res).
2. Recreate halftone + duotone + doodles in CSS, not AI.
3. Compress, drop in `public/assets/`.
4. Layer in the hero, scatter accents, build stamps, composite the share card.
5. Animate with CSS/Framer Motion; reserve image-to-video for one showcase loop at most.
