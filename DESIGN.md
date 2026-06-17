# DESIGN.md — Illuspeak

## 1. Visual theme & atmosphere
Maximalist, playful, hand-drawn. Cartoon mascots layered over real city/street
photography, with halftone dots and marker-doodle linework. Sticker-collage energy:
elements slightly rotated, drop-shadowed, overlapping.
The base undertone is PASTEL BLUE + PASTEL PINK (soft, dreamy, like the posters'
washed backdrops). On top of that calm base sit LOUD vibrant accents. So: soft
pastel foundation, vibrant pops — not vibrant everywhere. Think indie art-zine meets
Y2K sticker sheet, with a soft blue-pink wash underneath.

## 2. Color palette & roles
Two tiers. The pastels are the FOUNDATION (backgrounds, surfaces, large fields,
section washes, highlights). The vibrant colors are ACCENTS only (CTAs, stamps,
celebration, small emphasis). Default to pastel; reach for vibrant on purpose.

FOUNDATION (dominant — use most):
- Pastel Pink   #FFD6E8  — primary background wash, soft surfaces
- Pastel Blue   #BFE6FF  — secondary background wash, alternating sections
- Pastel Lilac  #E4D6FF  — optional third wash for variety
- Paper         #FFF8FB  — lightest surface, card bg (very faint pink-white)
- Ink           #2A2140  — text on light, outlines (soft near-black, not harsh)

ACCENTS (vibrant — use sparingly, on purpose):
- Hot Pink      #FF3DAE  — primary CTA, active states, key emphasis
- Cyan          #2BE3F2  — secondary accent, highlights
- Lemon         #FFE53D  — stamps / celebration pops
- Lime          #8CFF3D  — success / completed state

Backdrops: real street photography pushed to a soft blue-pink duotone (not the
harsh hot duotone), sitting quietly under doodles and mascots so it never fights
the foreground.

Rule of thumb: a section reads as soft pastel blue or pink at a glance, with a few
vibrant accents punching through. If the whole screen is saturated, pull it back.

## 3. Typography rules
- Display (headings, "ILLUSPEAK"): a chunky hand-lettered / marker font ("Lilita One").
  The wordmark itself is the AI art asset; Lilita One covers other headings.
- Body / UI: a clean geometric sans ("Plus Jakarta Sans").
- Hierarchy: hero 48-64px tight, section titles 28-36px, body 16px, captions 13px.
- Headings can sit at slight rotation (-3 to +3deg) for sticker feel.

## 4. Component stylings
- Buttons: pill or chunky rounded-rect, thick ink outline (2-3px), hard offset drop-shadow,
  springy scale on tap (0.95). Primary CTA = hot pink fill; secondary = pastel fill with ink text.
- Cards / bottom sheets: paper or pastel bg, thick rounded corners, ink outline, slight
  rotation, halftone or sticker accent. Bottom sheets slide up for booth detail.
- Stamp boxes (game): square, dashed/outlined empty state on pastel; on complete, a colored
  stamp + tick "thunks" in with spring + tiny confetti (this is where vibrant pops).
- Inputs (username): chunky outlined field, pastel fill, playful placeholder.

## 5. Layout principles
- Single column, mobile portrait, ~390px design width.
- Generous tap targets (min 44px). Thumb-zone aware: primary actions reachable low on screen.
- Vertical rhythm with bold section breaks. Sections can overlap edges for collage feel.
- Bottom tab bar (Main / About), fixed.

## 6. Depth & elevation
- Hard offset shadows (sticker style), not soft blurs. e.g. 4px 4px 0 ink.
- Layering: photo backdrop < doodle overlay < content cards < floating mascots < UI chrome.

## 7. Do's and don'ts
DO: build on a soft pastel blue/pink foundation, then add vibrant pops on purpose.
DO: lean into rotation, halftone, bounce, sticker drop-shadows. Keep it fun and tactile.
DO: keep text legible over busy backdrops (use scrims/outlines).
DON'T: saturate the whole screen — if everything is vibrant, pull back to pastel.
DON'T: go minimal, dark, or corporate. DON'T use slow editorial fades.
DON'T: let decoration hurt tap targets or the game's clarity.

## 8. Responsive behavior
Mobile only. Design at 390px. No desktop breakpoints. Test at 360-430px widths.
Safe-area insets for notches / home indicator. Camera view fills width.

## 9. Agent prompt guide
Foundation (use most): pastel pink #FFD6E8, pastel blue #BFE6FF, pastel lilac #E4D6FF, paper #FFF8FB, ink #2A2140.
Accents (sparingly): hot pink #FF3DAE, cyan #2BE3F2, lemon #FFE53D, lime #8CFF3D.
Default ask: "Build a mobile section on a soft pastel blue/pink wash, chunky outlined
components, hard offset shadows, slight rotation, springy motion, a few vibrant accent pops.
Mascots over a soft blue-pink duotone street-photo backdrop."

## Tailwind v4 token mapping
Tokens live in `src/index.css` under `@theme`. Use them as utilities:
- Colors: `bg-pink bg-blue bg-lilac bg-paper text-ink bg-hotpink text-cyan bg-lemon bg-lime`
- Fonts: `font-display` (Lilita One), `font-body` (Plus Jakarta Sans)
- Shadows: `shadow-sticker shadow-sticker-sm shadow-sticker-lg`
- Helpers: `ink-outline halftone pb-safe pt-safe`
