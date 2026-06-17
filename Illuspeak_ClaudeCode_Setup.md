# Illuspeak — Claude Code Environment Setup

How to set up the best Claude Code workspace for building the Illuspeak site with Opus 4.8. Covers `CLAUDE.md`, `DESIGN.md`, skills/plugins/connectors, and the AI asset-generation prompts.

---

## 1. Project structure to start with

```
illuspeak/
  CLAUDE.md              # agent operating rules (below)
  DESIGN.md              # visual system (below)
  PRD.md                 # the product spec (separate file)
  .env.local             # SUPABASE_URL, SUPABASE_ANON_KEY (gitignored)
  src/
    data/
      booths.ts          # placeholder booth + game target data
    components/
    sections/            # Hero, Map, MiniGame
    game/                # scan, progress, storage logic
    lib/                 # supabase client, card export
  public/
    assets/              # AI-generated hero + mascots, floor plan
```

---

## 2. CLAUDE.md (drop into project root)

```markdown
# CLAUDE.md — Illuspeak

## What this is
Mobile-only web app for the Illuspeak art event (Jul 18-26, @GMBB L5).
Single main page (hero -> interactive map -> stamp-rally mini-game) + an About tab.
The mini-game is the primary feature. Visual richness is the second priority.

## Hard rules
- MOBILE ONLY. Portrait smartphone. Never write desktop layouts or breakpoints above mobile. Design at ~390px width.
- NO end-user auth. Players set a username only. Never add login/signup.
- The mini-game must work fully OFFLINE. localStorage is the source of truth for progress and prize unlock. Network (Supabase) is optional decoration only, always wrapped in try/catch.
- Stay free. Only allowed paid-adjacent dependency is a free-tier Supabase project.
- Keep the dependency tree lean. Prefer native browser APIs (camera/getUserMedia, canvas, localStorage) over libraries when reasonable.

## Stack
React + Vite + TypeScript + Tailwind. Framer Motion for bouncy motion.
QR scan: html5-qrcode (or jsQR). Card export: html-to-image -> PNG 1080x1920.
Map zoom/pan: react-zoom-pan-pinch or CSS transforms. No GIS map libraries.

## Design
Follow DESIGN.md for all tokens, type, color, motion. The vibe is playful, hand-drawn,
cartoon-mascots-over-street-photography. Built on a SOFT PASTEL BLUE + PASTEL PINK
foundation (backgrounds, surfaces, highlights) with LOUD vibrant colors as accents only
(CTAs, stamps, celebration). Default pastel, pop vibrant on purpose. NOT minimal, NOT dark
editorial, NOT saturated-everywhere. Bouncy spring motion, not slow fades.

## Data
All booth/sponsor/poster content lives in src/data/ as editable files.
Placeholders for now; owner swaps real data later. Exactly 6 booths have isGameTarget: true.

## Anti-cheat posture
Casual event game. QR tokens are salted so URLs can't be forged. Prize screen has a
live element to discourage screenshot reuse. Leaderboard inserts rate-limited + profanity-filtered.
Do not over-engineer security beyond this.

## Working style
- Build Phase 1 first (mini-game core), see PRD build phases.
- Produce complete, production-ready files, not drafts or stubs.
- Natural, concise code comments. No flowery noise.
- When a decision is ambiguous, prefer the simplest thing that fully works.
```

---

## 3. DESIGN.md (drop into project root)

This uses the VoltAgent `awesome-design-md` 9-section structure, written custom for Illuspeak (none of their presets fit — they're all dark/minimal). Tune the hex values once you sample your final posters.

```markdown
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
- Display (headings, "ILLUSPEAK"): a chunky hand-lettered / marker font.
  Candidates (free): "Chewy", "Lilita One", "Bagel Fat One", or a custom lettered SVG for the wordmark.
- Body / UI: a clean geometric sans. Candidates: "Inter", "Plus Jakarta Sans".
- Hierarchy: hero 48-64px tight, section titles 28-36px, body 16px, captions 13px.
- Headings can sit at slight rotation (-3 to +3deg) for sticker feel.

## 4. Component stylings
- Buttons: pill or chunky rounded-rect, thick ink outline (2-3px), hard offset drop-shadow,
  springy scale on tap (0.95). Primary CTA = hot pink fill (the vibrant accent earns its
  place on the main action); secondary buttons = pastel fill (blue/pink) with ink text.
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
```

---

## 4. Skills, plugins & connectors

### Install / use

**ponytail** (token discipline) — install but run on `lite`.
```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
/ponytail lite
```
Why `lite`: ponytail trims dependency bloat and over-engineering, which you want. But on `full`/`ultra` it may fight intended richness (Framer Motion, the map lib, the card-export lib). On `lite` it keeps you from installing a date-picker-sized library for a one-liner, without nagging you out of the libraries the design actually needs. Use `/ponytail-review` on diffs before commits to catch bloat.

**awesome-design-md** (design format) — don't install as a skill; use as a *reference format*. You already have a custom `DESIGN.md` (above) built on its 9-section structure. None of their presets match Illuspeak (all dark/minimal), so copying one would mislead the agent. Keep your custom file.

### Additional skills worth considering
- **frontend-design** (already available in this environment's public skills): genuinely useful here for distinctive, non-templated UI and typography decisions. Lean on it for the hero and component polish.
- A **shadcn/ui**-style component skill is NOT a strong fit — shadcn's aesthetic is clean/neutral, the opposite of Illuspeak. You'd spend more time overriding it than it saves. Skip.

### Connectors
- **Supabase**: you don't strictly need an MCP connector. The simplest path is the Supabase JS client with your project URL + anon key in `.env.local`. One table, one insert. A connector only helps if you want the agent to create/inspect the table for you; otherwise create the table in the Supabase dashboard (2 minutes) and keep the agent focused on code.
- **GitHub**: optional, for repo + deploy. Useful but not required for the build.

### Recommended workflow loop (matches how you like to work)
1. Keep `CLAUDE.md` + `DESIGN.md` + `PRD.md` in root so every session is grounded.
2. Build Phase 1 (mini-game core) end to end before touching map/leaderboard.
3. Use a PostToolUse-style check (lint/typecheck on save) so the agent self-corrects.
4. Run `/ponytail-review` before each commit to keep the tree lean.
5. Swap placeholders for real assets in Phase 3.

---

## 5. AI asset-generation prompts

You want AI for the hero + mascots, code for UI accents. Generate these with your image tool (nano banana / similar), then image-to-video for any you want looping. All should be **transparent PNG** where possible so they layer over photo backdrops.

### Hero wordmark + mascot (the centerpiece)
> A chunky hand-lettered "ILLUSPEAK" wordmark in a playful marker style, hot pink and cyan with a thick ink outline and a comic halftone burst behind it. Beside it, a cartoon mascot with a paintbrush-shaped head, expressive eyes, white-gloved hands, mid-leap. Sticker-collage style, slight rotation, hard offset drop shadow. Transparent background. Vibrant, high-saturation, indie art-zine energy.

### Pink ghost mascot (secondary character)
> A friendly pink ghost-like cartoon mascot with rosy cheeks, a small green leaf sprout on its head, floating, trailing tiny sparkles. Bold ink outline, flat vibrant fill, sticker style. Transparent background. Suitable as a small floating UI accent on a mobile screen.

### Stamp / sticker set (for the 6 game stamps)
> A set of 6 distinct playful rubber-stamp / sticker icons in a hand-drawn comic style: paint palette, megaphone, paintbrush, lightbulb, star burst, speech bubble. Each in a single bold accent color (pink, cyan, lemon, lime) with a thick ink outline and halftone texture. Transparent background, square framing, consistent set.

### Street-photo backdrop treatment (if generating rather than shooting)
> A Kuala Lumpur street scene (shophouses, signage, overhead walkway) rendered as a high-contrast duotone in cyan and pink, with subtle halftone dot texture, designed to sit behind colorful cartoon overlays. Slightly desaturated so foreground stickers pop.

### Completion / confetti burst
> A celebratory confetti and sparkle burst in pink, cyan, lemon, and lime, comic-style with bold shapes and halftone accents, radiating outward. Transparent background, centered, for a mobile "you won" screen.

### Image-to-video (optional loops)
For any of the above you want subtly animated: prompt the image-to-video model for "gentle idle float and bob, subtle sparkle shimmer, seamless loop, no camera movement, transparent or solid background." Keep loops short (2-4s) and small in file size for mobile.

---

## 6. Quick start checklist

1. Create the Vite + React + TS project, add Tailwind.
2. Drop in `CLAUDE.md`, `DESIGN.md`, `PRD.md`.
3. Install ponytail, set `/ponytail lite`.
4. Create the free Supabase project, make the `leaderboard` table, put URL + anon key in `.env.local`.
5. Generate the hero + stamp assets, drop in `public/assets/`.
6. Build Phase 1: the mini-game core, offline-first.
7. Iterate from there per the PRD phases.
