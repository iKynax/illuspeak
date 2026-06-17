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
React + Vite + TypeScript + Tailwind (v4). Motion (Framer Motion) for bouncy motion.
QR scan: jsQR + getUserMedia. Card export: html-to-image -> PNG 1080x1920.
Map zoom/pan: react-zoom-pan-pinch. No GIS map libraries.

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

## Asset note
Raw art lives in /assets (root). It ships as flat JPEGs with baked-in fake-transparency.
`npm run assets` processes those into true-alpha WebP/PNG in /public/assets. Reference the
processed files (e.g. /assets/paintbrush-kid.webp), never the raw root /assets JPEGs.
