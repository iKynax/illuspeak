# Illuspeak — Redesign Polish Spec (Execution-Ready)

Hand this whole file to Claude Code. It covers asset housekeeping, then six visual upgrades. Mobile-only. Pastel blue/pink foundation with vibrant accents per DESIGN.md. Work through the steps in order; verify tap targets and legibility after each.

---

## STEP 0 — Asset housekeeping (do this first)

The new assets are currently in `assets/new_assets/`. Move them up into `assets/` alongside the rest, then rename for clarity.

### 0a. Move
Move every file from `assets/new_assets/` into `assets/`. Delete the now-empty `new_assets/` folder. Update any import paths accordingly.

### 0b. Identify and rename the critter files
Three files are named `Redraw_tiny_figure_transparent_b…` and one is `Isolate_and_redraw_creatures_…`. Open each image, identify the creature, and rename by content. Expected creatures: a snail, a bird riding a pencil, and one other unique critter. Rename to:
- `critter-snail-pink.png` (the original pink snail)
- `critter-bird-pencil.png` (bird on a pencil)
- `critter-[name].png` (whatever the third one is — name it by what you see)

Also rename these for clarity (keep the mapping in a comment or note):
- `A_small_cluster_of_cute_…`        → `corner-cats-topleft.png`
- `Bear_grabbing_brick_wall_…`       → `corner-bear-bottomright.png`
- `City_street_photography_backgro…` → `hero-backdrop.png`
- `Colour_snail_body_pastel_orange_…`→ `critter-snail-orange.png`
- `Lime_creatures_on_transparent_ba…`→ `critter-cat-lime.png`
- `Cartoon_character_with_blue_hair_…`→ `mascot-paintbrush-kid.png`
- `Floating_pink_ghost_…`            → `mascot-ghost.png`
- `Humanoid_character_holding_surf…` → open it, rename by content (likely a mascot variant)
- `ILLUSPEAK_logo_wordmark_…`        → `wordmark.png`
- `Pink_bear_head_character_alone_…` → `mascot-bear.png`
- `Rainbow_zigzag_slide_streak_…`    → `rainbow-streak.png`

Update all import paths in the code to the new names. Keep `Poster1/2/3.png` and `Map.png` as they are.

After renaming, you have this critter pool for scattering: `critter-snail-pink`, `critter-bird-pencil`, `critter-[third]`, `critter-snail-orange`, `critter-cat-lime`, plus `mascot-ghost`. The pink/orange snails, lime cat, bird, and third critter are the floating accents. The ghost floats once mid-page. The bear is reserved for the prize screen.

---

## STEP 1 — Sticky corner characters (peeking)

Two fixed, non-blocking peeking characters.

- `corner-cats-topleft.png` pinned top-left; `corner-bear-bottomright.png` pinned bottom-right.
- Render once at app root, `position: fixed`, OUTSIDE scroll flow.
- `pointer-events: none` (critical — must never eat a tap).
- z-index above backdrops but BELOW the bottom tab bar, the win-game button, and any bottom-sheet/modal.
- Size ~110-140px; shrink on smaller widths. Respect safe-area insets.
- Gentle idle bob: top-left cats bob slightly down, bottom-right bear bobs slightly UP (sells "peeking up over the ledge").

```jsx
<motion.img src="/assets/corner-cats-topleft.png" alt="" aria-hidden
  className="fixed top-0 left-0 w-32 pointer-events-none z-30"
  animate={{ y: [0, 3, 0] }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
<motion.img src="/assets/corner-bear-bottomright.png" alt="" aria-hidden
  className="fixed bottom-0 right-0 w-32 pointer-events-none z-30"
  animate={{ y: [0, -3, 0] }}
  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
```

Guard: confirm the bottom-right bear clears the bottom tab bar. If it crowds it, shrink or nudge up.

---

## STEP 2 — Sticky "Play the game" button (top-right)

A persistent floating button, top-right, always visible while scrolling. Tapping it smooth-scrolls to the mini-game section (the core feature). The button should have no text in it and only a controller icon that you provide yourself.

- `position: fixed`, top-right, z-index ABOVE the corner characters and content, but below modals/bottom-sheets and the QR scanner overlay.
- Respect safe-area inset (top + right) so it clears the notch.
- On-brand: chunky pill or round button, hot pink fill (vibrant accent earns the primary action), thick ink outline, hard offset shadow, springy tap (scale 0.95). A small game/stamp/controller icon + short label like "Play" or a stamp icon.
- Tap → smooth-scroll to the mini-game section (`scrollIntoView({ behavior: "smooth" })` on the game section ref/id).
- Don't let it overlap the top-left cats — it's on the opposite side, but verify on a 360px width.
- Hide it (or no-op) when the QR scanner is open full-screen so it doesn't sit over the camera.

```jsx
<motion.button
  onClick={() => document.getElementById("minigame")?.scrollIntoView({ behavior: "smooth" })}
  className="fixed top-3 right-3 z-40 flex items-center gap-1.5 rounded-full
             bg-[#FF3DAE] text-white font-bold px-4 py-2
             border-2 border-[#2A2140] shadow-[3px_3px_0_#2A2140]
             [padding-top:max(0.5rem,env(safe-area-inset-top))]"
  whileTap={{ scale: 0.95 }}
  aria-label="Play the stamp rally game">
  <StampIcon className="w-4 h-4" /> Play
</motion.button>
```
Use whatever icon library is already in the project. If the safe-area padding makes it sit oddly, wrap in a container that handles the inset instead.

---

## STEP 3 — Landing section rebuild

Current hero is the mascot on a flat wash — too sparse. Add depth via layering. Layer stack back-to-front:

1. **Hero backdrop:** `hero-backdrop.png` (the KL aerial), `object-cover`, covering the hero. Crop/position so the shophouse rooftops and street level are the focal area (mask off excess sky/scaffolding at the very top).
2. **Duotone tint:** soft pastel pink→blue gradient over the photo, `mix-blend-mode: multiply`, ~0.7 opacity, so it becomes a quiet blue-pink wash, never competing with the foreground.
3. **Bottom fade:** gradient from transparent to the page wash color at the hero's bottom edge, so the photo blends into the page seamlessly.
4. **Halftone:** the CSS halftone dot layer, low opacity, for texture.
5. **Rainbow:** `rainbow-streak.png` arcing behind the wordmark (or rely on the STEP 5 weaving rainbow — your call; keep the streak if it reads well in the hero).
6. **Wordmark:** `wordmark.png`, slight rotation, entrance pop.
7. **Mascot:** `mascot-paintbrush-kid.png`, existing float, now with real depth behind it.
8. **A FEW doodles** around the wordmark/kid (see STEP 4 for spacing rules — only 1-2 here, not a cluster).
9. **Date pill + tagline + CTA** on top.

```css
.hero { position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(1) contrast(1.05) brightness(1.1); }
.hero-bg-tint { position: absolute; inset: 0;
  background: linear-gradient(135deg, #FFD6E8, #BFE6FF);
  mix-blend-mode: multiply; opacity: 0.7; }
.hero-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 35%;
  background: linear-gradient(to bottom, transparent, #FFD6E8); }
.hero-halftone { position: absolute; inset: 0; opacity: 0.22;
  background-image: radial-gradient(circle, rgba(42,33,64,0.18) 1.2px, transparent 1.3px);
  background-size: 8px 8px; }
```

Legibility guard: tagline + date now sit over a photo. Keep solid pill / ink text; if contrast dips, add a subtle paper scrim behind the text block. The words must win over the backdrop.

---

## STEP 4 — Spread the doodles out (fix the clustered landing)

Problem: the 3 pink critters are bunched together under the tagline on the landing. Fix: spread the critter pool across the WHOLE page, well-spaced, never obstructing content.

Rules for every scattered critter:
- `position: absolute`, `pointer-events: none`, low z-index (above section bg, below interactive UI and text).
- NEVER overlap text, buttons, the username input, stamp boxes, map pins, the tab bar, or the win-game button.
- Vary size and rotation so each looks hand-placed, not gridded.
- Gentle idle float, staggered durations so they don't pulse in sync.
- Balance color: if a section skews pink, drop the lime cat or orange snail there.

Distribution plan (one critter per spot, spaced out):
- **Hero:** at most 1-2 small accents near the wordmark/kid (e.g. a sparkle + the orange snail off to one side). NOT the 3-in-a-row under the tagline — remove that cluster.
- **Hero→Map seam:** one critter (e.g. lime cat) near the section break.
- **Map section:** `critter-snail-pink` in one corner (keep existing), add the bird-pencil on the opposite side for balance.
- **Map→Game seam:** the ghost (`mascot-ghost`) floating once, drifting near the boundary so it feels alive across the scroll.
- **Game section:** the third critter near the header, plus one accent in the currently-bare lower area.
- **Bear:** NOT scattered — reserved for the prize/completion screen.

Reusable component:
```jsx
function FloatAccent({ src, className, dur = 4, delay = 0 }) {
  return (
    <motion.img src={src} alt="" aria-hidden
      className={`absolute pointer-events-none ${className}`}
      animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }} />
  );
}
```
Replace the clustered landing critters with this spaced distribution. Where the same critter currently appears twice in the layout, replace one instance with `critter-cat-lime` (the green cat) so the same creature isn't shown twice.

---

## STEP 5 — Scroll-driven weaving rainbow spine

A continuous hand-drawn rainbow that weaves left-right down the WHOLE page, threading the sections together, drawing itself as you scroll. Do this LAST so final section heights are known.

- One full-page-height SVG, absolutely positioned spanning hero→map→game, low z-index (behind content, above section bg washes), `pointer-events: none`.
- Wobbly path meanders side to side and dips at section boundaries to "stitch" sections. Not a straight line.
- Multiple colored strokes offset slightly = rainbow band.
- Scroll progress drives `stroke-dashoffset` so it grows downward as you scroll.

```jsx
import { useScroll, useTransform, motion } from "framer-motion";
export function RainbowSpine() {
  const { scrollYProgress } = useScroll();
  const dashOffset = useTransform(scrollYProgress, [0, 1], [4000, 0]);
  const d = "M 80 0 C 300 200, 40 500, 200 760 S 360 1200, 120 1500 S 40 2000, 260 2300 S 320 2800, 160 3200";
  const colors = ["#FF3DAE", "#FFB13D", "#FFE53D", "#8CFF3D", "#2BE3F2", "#9B6BFF"];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0"
         viewBox="0 0 390 3200" preserveAspectRatio="none" aria-hidden>
      {colors.map((c, i) => (
        <motion.path key={c} d={d} fill="none" stroke={c} strokeWidth={10}
          strokeLinecap="round" strokeDasharray="4000"
          style={{ strokeDashoffset: dashOffset }}
          transform={`translate(${(i - 2.5) * 7}, 0)`} opacity={0.9} />
      ))}
    </svg>
  );
}
```
Tune the `d` path control points to your real section heights so the weave crosses BETWEEN sections. If dynamic height measurement is fiddly, use an oversized viewBox height that exceeds the page with `preserveAspectRatio="none"`. Keep it behind content but above section backgrounds so sections sit "on" the thread. Perf: only animate dashoffset.

---

## STEP 6 — Final checks

After all steps, verify on a real phone (360-430px):
- No decoration intercepts taps (every accent + corner is `pointer-events: none`).
- Win-game button always visible, clears notch, scrolls to the game, doesn't sit over the camera during scanning.
- Corners don't crowd the tab bar.
- Text legible over the hero backdrop.
- Doodles spaced out, none overlapping content, color balanced across sections.
- Smooth scroll; rainbow weave lines up with section breaks.
- Mini-game still fully works offline (unchanged by this pass).

---

## Build order recap
0. Asset move + rename
1. Corners
2. Win-game button
3. Landing rebuild
4. Spread doodles
5. Weaving rainbow (last)
6. Checks
