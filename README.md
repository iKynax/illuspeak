# Illuspeak

Mobile-only web app for the **Illuspeak** art graduate exhibition (Jul 18–26 @GMBB L5).
Hero → interactive booth map → stamp-rally mini-game, plus an About tab. The mini-game is the
primary feature and works fully **offline** (localStorage is the source of truth).

Built with React + Vite + TypeScript + Tailwind v4 + Motion. See `CLAUDE.md` (agent rules),
`DESIGN.md` (visual system), and `PRD.md` (product spec).

## Quick start

```bash
npm install
npm run dev        # opens on http://localhost:5173 — also printed as a Network URL
```

To test on your **phone** (the real target): open the printed **Network** URL on a phone
connected to the same wifi. Note: the camera scanner needs HTTPS or `localhost`; on a phone over
plain http the browser may block the camera. For full camera testing on a device, use the
deployed HTTPS URL, or a tunnel (e.g. `npx localtunnel --port 5173`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (LAN-exposed). |
| `npm run build` | Type-check + production build into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | ESLint. |
| `npm run assets` | Re-process raw art in `/assets` → web-ready files in `/public/assets`. |
| `npm run qr` | Generate the 6 stamp QR codes + a printable sheet into `/qr`. |

## Editing event content

All content is placeholder and lives in **`src/data/booths.ts`** — edit it without touching logic:

- `booths[]` — every booth (name, student, zone, blurb, poster, map pin position).
- Exactly **6** booths have `isGameTarget: true`; those are the stamp-rally targets and carry a
  `game` block (`hint`, `info`). Keep it at exactly 6.
- `sponsors[]` and `eventInfo` for the About tab.

QR tokens are **derived** from each booth id (`src/lib/qr.ts`) — you never hand-write them.

## Printing the stamp QR codes

```bash
npm run qr
```

This writes `qr/stamp-b01.png … stamp-b06.png` and `qr/print-sheet.html`. Open the HTML sheet,
print it, cut out each code, and place it at the matching booth. The codes are salted so a visitor
can't fake a scan by guessing a URL (casual anti-cheat — see `PRD.md` §9).

## Assets

Raw event art is in `/assets` (flat JPEGs with baked-in fake transparency). `npm run assets`
runs a deterministic background-removal pipeline (`scripts/process-assets.mjs`) that recovers true
transparency and writes optimized WebP/PNG into `/public/assets`. The app references the processed
files (e.g. `/assets/paintbrush-kid.webp`). Re-run it whenever you drop new raw art in `/assets`.

## Leaderboard (optional, Phase 2)

The game is fully playable offline with no backend. To enable the optional finisher leaderboard,
create a free Supabase project, then copy `.env.local.example` → `.env.local` and fill in
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. If unset or offline, the game silently skips it.

## Deploy

`npm run build` produces a fully static `dist/`. Deploy to any free static host
(Netlify / Vercel / Cloudflare Pages). Point the host at this repo with build command
`npm run build` and output dir `dist`.

## Build status

- ✅ Phase 1: scaffold, design tokens/fonts, bottom-tab nav, hero, the full mini-game
  (username → 6 stamp boxes → hint sheet → camera QR scan → stamp thunk + confetti → prize screen
  with live anti-screenshot element), offline localStorage progress, and the 1080×1920 share-card export.
- ✅ Phase 2: interactive booth **map** (real floor plan, pinch/pan, tappable pins → booth bottom
  sheet); **Supabase leaderboard** (lazy-loaded, graceful offline) with finisher rank on the prize
  screen + share card; About **leaderboard widget** + poster carousel polish. Main page order is now
  Hero → Map → Mini-game.
- ✅ Code-generated art: an inline-SVG doodle set (`src/components/Doodles.tsx` — stars, sparkles,
  squiggles, comic bursts, blobs) plus CSS halftone/duotone, scattered across every section. All
  12 processed character assets are now used.
- ⏭️ Phase 3: real data swap; illustrated map; final motion/texture polish.
