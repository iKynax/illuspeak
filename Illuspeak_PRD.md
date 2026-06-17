# Illuspeak — Event Website PRD

**Version:** 1.0
**Owner:** Justin
**Build target:** Claude Code (Opus 4.8)
**Platform:** Mobile web only (smartphone, portrait)
**Event:** Illuspeak — art graduate exhibition. July 18–26, @GMBB, Level 5.

---

## 1. Overview

Illuspeak is an art event where graduate art students set up booths to exhibit work and sell merchandise. Visitors scan a QR code at the venue entrance to open this website on their phone. The site is the visitor's companion: it introduces the event, lets them navigate booths via an interactive map, and runs a stamp-rally mini-game that rewards them with a redeemable prize and an Instagram-shareable achievement card.

The **mini-game is the primary feature.** The visual design is the second priority: loud, vibrant, artsy, cartoon-mascots-over-real-street-photography, matching the Illuspeak key visuals (paintbrush-head character, pink ghost mascot, halftone comic textures, hand-lettered sticker type).

This is a mobile-exclusive experience. Every layout, tap target, and interaction is designed for a phone held in one hand. Desktop is explicitly out of scope.

---

## 2. Goals & non-goals

### Goals
1. A vibrant landing experience that communicates what Illuspeak is, when, and where, on-brand with the posters.
2. An interactive, zoomable, stylized booth map where tapping a booth shows a brief profile + poster.
3. A stamp-rally mini-game: scan 6 QR targets around the venue, track progress, unlock a prize screen.
4. A shareable, Instagram-story-worthy achievement moment on completion.
5. Zero-friction entry: no signup, no login. Players set a username for the session only.
6. Stay free to build and host. The only paid-tier-adjacent dependency is a free Supabase project.

### Non-goals
- No desktop layout.
- No end-user authentication (no signup/login/passwords).
- No e-commerce. Merch is sold at physical booths, not online.
- No CMS. Booth content is static data the owner edits in a file.
- No native app. This is a web app opened in the phone browser.

---

## 3. Information architecture

Two tabs, mobile bottom tab bar:

**Tab 1 — Main (primary)**
- Section A: Landing / hero
- Section B: Interactive booth map
- Section C: Mini-game (stamp rally)

**Tab 2 — About (secondary)**
- Poster carousel (one per booth)
- Event sponsors
- About the event (description, dates, venue, credits)

Navigation: fixed bottom tab bar with two items. Thumb-reachable. Active state uses a brand accent.

---

## 4. Visual design direction

Pulled from the Illuspeak posters. Full token spec lives in `DESIGN.md` (separate file). Summary:

- **Mood:** maximalist, playful, hand-drawn, high-saturation. Cartoon mascots layered over real city/street photography with halftone and marker-doodle overlays.
- **Color:** hot pink, cyan, lemon yellow, lime green as primaries, against photographic backdrops. High contrast, sticker energy.
- **Type:** a chunky hand-lettered / marker display face for headings (echoing the "ILLUSPEAK" lettering), paired with a clean geometric sans for body and UI.
- **Texture:** halftone dots, marker outlines, sticker drop-shadows, slight rotation on cards for a collaged feel.
- **Motion:** bouncy, springy (not the slow editorial fades of the Mindloop reference). Stamps "thunk" in. Confetti / sparkle on completion.
- **Reference build quality:** the Mindloop landing page is the bar for *polish and structure* (scroll-reveal, component cleanliness, video hero), NOT for aesthetic. Illuspeak is the opposite mood: loud, not minimal.

---

## 5. Feature detail

### 5.1 Landing / hero (Section A)

**Purpose:** instant identity + key info.

Contents:
- Event name "ILLUSPEAK" as the hero, hand-lettered style (AI-generated hero asset, see asset list).
- Dates: July 18–26. Venue: @GMBB, Level 5.
- One short line about the event (e.g. "An art graduate showcase. Walk in. Get lost. Collect stamps.").
- A primary CTA scrolling down to the mini-game ("Start the hunt").
- Animated mascot element (AI-generated hero, ideally a looping subtle motion or a static PNG with CSS float animation).

Behavior: hero fills the first viewport. Springy entrance animation on load. Scroll cue to indicate more below.

### 5.2 Interactive booth map (Section B)

**Purpose:** help visitors navigate and discover booths.

- **Base:** a stylized illustrated map drawn to match the real GMBB L5 floor plan. For initial build, use the real floor plan image as the base layer; swap for the illustrated version later. The layout (zones, walkways, opening area, storage) follows the provided floor plan.
- **Zones from floor plan:** Culture, Social Awareness, Self-discovering, Human Relationship, Education, Awareness, Nostalgia, plus the central Opening Area (Sharing/Talk) and Sponsor backdrop.
- **Interaction:** pinch-to-zoom and pan. Booths are tappable pins/markers.
- **Booth detail:** tapping a booth opens a card (bottom sheet on mobile) with: booth name, student name, a one-line blurb, and that booth's poster image.
- **Data:** placeholder booths for now, structured so the owner swaps in real data later (see Data Model). Many booths shown; only 6 are mini-game targets.

### 5.3 Mini-game — stamp rally (Section C, PRIMARY)

**Flow:**
1. Player scrolls to the mini-game section on the main page (also reachable by hero CTA).
2. First time: prompt to set a **username** (stored in localStorage + session). No password, no account.
3. The game shows **6 stamp "boxes"** in a grid. Each box is a target.
4. Tapping a box (before completion) shows a **hint + info** about that target: a clue to find it physically, and a short description. It does not auto-complete.
5. To complete a box, the player taps "Scan" → camera opens → they scan that booth's QR code at the physical location.
6. On a valid scan, the box flips to a **completed state** (tick / stamp icon "thunks" in with a spring animation + small celebration).
7. Players must complete **all 6, in any order.**
8. When all 6 are done → **prize unlock screen** appears.

**Scan mechanism:**
- Camera-based QR scanning in-browser (getUserMedia + a lightweight QR decode library, e.g. `jsQR` or `html5-qrcode`).
- Each QR encodes a **booth target ID plus a verification token** (booth ID hashed with a project secret salt). This prevents trivially typing `?booth=1` to fake a scan.
- On scan: decode → validate token against the known target set → if valid and not already collected, mark collected in localStorage.
- Graceful failures: camera permission denied → show instructions; invalid/foreign QR → friendly "that's not an Illuspeak stamp" message; already-scanned → "you already got this one!".

**Progress storage (source of truth = localStorage):**
- `illuspeak_username`
- `illuspeak_progress`: which of the 6 target IDs are collected, with timestamps
- `illuspeak_started_at`, `illuspeak_completed_at`
- All game logic works fully **offline.** No network needed to play, progress, or unlock the prize.

**Prize unlock + redemption:**
- Completing all 6 reveals an "unlocked" screen: the source of truth is localStorage.
- Redemption is **show-to-staff**: the player shows the live unlocked screen to event staff, who hand over the prize. No code-scanning by staff required.
- Anti-screenshot-reuse touch: the live screen carries a moving element (live clock / animated shimmer / the player's username + a ticking "unlocked Xm ago") so a recycled screenshot looks obviously static/stale vs. the live page. Low-stakes, just discourages casual reuse.

**Leaderboard + rank (Supabase, optional decoration):**
- On completion, the site makes **one** insert to a free Supabase table: `{ username, completed_at, duration_seconds }`.
- Supabase returns the row, from which we derive **"you were the Nth to finish."**
- A live leaderboard (recent finishers / fastest times) can render on the About tab.
- **No end-user auth.** The site uses Supabase's public anon key baked into the client. Players never log in; they only set a username.
- **Degrades gracefully:** the Supabase call is wrapped in try/catch. If venue wifi fails or the call errors, the player still gets the full achievement screen, minus the rank number. The core experience never depends on the network.
- **Light guards:** username length cap, basic profanity filter, client-side rate-limit on insert. This is a fun leaderboard, not a secure identity system — usernames are not unique or owned. Documented as accepted risk.

### 5.4 Share moment (IG story)

- A polished, designed completion screen (on-brand, mascots, confetti, the 6 stamps revealed, username, finish time, rank if available).
- A **"Save my card" button** that generates a downloadable image (render the card to canvas, e.g. via `html-to-image` or canvas draw) sized for Instagram story (1080×1920). The player saves it and posts manually.
- The card includes Illuspeak branding, the player's username, completion stats, and the 6 collected stamps.

### 5.5 About tab

- **Poster carousel:** horizontally swipeable, one poster per booth (placeholder posters initially).
- **Sponsors:** logo row / grid (placeholders initially; floor plan and posters reference sponsor slots).
- **About the event:** description, dates (Jul 18–26), venue (@GMBB L5), and credits.
- Optional: the live leaderboard widget here.

---

## 6. Data model

All static content lives in editable data files (e.g. `src/data/booths.ts`) so the owner swaps placeholders without touching logic.

```
Booth {
  id: string
  name: string            // booth / exhibition name
  student: string         // artist name
  zone: string            // Culture | Social Awareness | ... (from floor plan)
  blurb: string           // one-line description
  posterUrl: string       // poster image path
  mapX: number            // pin position on map (relative %)
  mapY: number
  isGameTarget: boolean    // true for the 6 stamp-rally targets
}

GameTarget (derived: booths where isGameTarget === true, must be exactly 6) {
  id: string              // matches Booth.id
  hint: string            // physical clue for the rally
  info: string            // short description shown in the box
  qrToken: string         // the verification token this booth's QR must carry
}

LeaderboardEntry (Supabase) {
  id: uuid
  username: string
  completed_at: timestamp
  duration_seconds: int
}
```

---

## 7. Tech stack

- **Framework:** React + Vite + TypeScript.
- **Styling:** Tailwind CSS. Custom design tokens from `DESIGN.md`.
- **Animation:** a spring/motion library (Framer Motion) for bouncy stamp/confetti/entrance motion.
- **QR scanning:** `html5-qrcode` or `jsQR` + getUserMedia.
- **Card export:** `html-to-image` or canvas render → PNG download.
- **Map:** zoom/pan via a lightweight pan-zoom approach (CSS transforms + a small gesture handler, or `react-zoom-pan-pinch`). Avoid heavy GIS map libs — it's an illustrated floor plan, not geographic.
- **Leaderboard:** Supabase JS client, anon key, single table, no auth.
- **Hosting:** any free static host (Netlify / Vercel / Cloudflare Pages). Vite build is fully static.

> Note on dependencies: keep the tree lean. Prefer native browser APIs (camera, canvas, localStorage) over libraries where reasonable. See the ponytail note in the environment guide — run it on `lite` so it trims bloat without fighting the intended visual richness.

---

## 8. Privacy & data

- No personal data collected beyond a self-chosen username and game timing.
- localStorage is per-device; clearing browser data resets progress.
- Supabase stores only username + completion time. No emails, no tracking.
- A one-line privacy note on the About tab is sufficient.

---

## 9. Anti-cheat posture (accepted level)

This is a casual art-event game. Defenses are "discourage casual cheating," not "secure system":
- QR tokens are salted so URLs can't be trivially forged.
- Prize screen has a live element to discourage screenshot reuse.
- Leaderboard inserts are rate-limited and profanity-filtered.
- Accepted risks (documented, not fixed): a determined user with dev tools can manipulate localStorage or spam the leaderboard. Fine for this context.

---

## 10. Build phases

**Phase 1 (15–23 Jun, first development window):**
1. Project scaffold, design tokens, fonts, bottom tab nav.
2. Landing hero with placeholder/AI hero asset.
3. Mini-game core: username, 6 boxes, hint/info, QR scan, completion state, localStorage progress, prize unlock screen — fully working offline. **This is the priority.**
4. Share card + "Save my card" download.

**Phase 2:**
5. Interactive map (real floor plan base + pins + booth bottom sheet).
6. About tab (carousel, sponsors, about).
7. Supabase leaderboard + rank, wired as graceful decoration.

**Phase 3:**
8. Swap placeholder booths/posters for real data.
9. Swap real floor plan for stylized illustrated map.
10. Polish pass: motion, confetti, textures, final AI assets.

---

## 11. Open items for owner

- Provide the 6 chosen stamp-target booths/zones and their physical hint text.
- Generate and print the 6 QR codes (tokens defined in data file).
- Provide real booth data, posters, sponsor logos when ready.
- Provide the illustrated map when drawn.
- Confirm the actual prize and where staff hand it out.
- Create the free Supabase project; drop its URL + anon key into env.
