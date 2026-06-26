import { FloatingMascot } from "../components/FloatingMascot";
import { DuotoneBackdrop } from "../components/DuotoneBackdrop";
import { eventInfo, loc, organizers, sponsors } from "../data/booths";
import { Leaderboard } from "./Leaderboard";
import { Burst, FloatingDoodle, Sparkle, Squiggle } from "../components/Doodles";
import { useLang, useUI } from "../i18n/lang";

// Placeholder posters: 50 numbered tiles in two auto-scrolling rows
// (1–25, then 26–50). The real artist posters drop in later; for now the only
// real key visual is the final poster, used as tile #1's backdrop.
const ROW1 = Array.from({ length: 25 }, (_, i) => i + 1);
const ROW2 = Array.from({ length: 25 }, (_, i) => i + 26);
const TILE_BG = ["#FFD6E8", "#BFE6FF", "#E4D6FF", "#FFE53D"];

function PosterTile({ n }: { n: number }) {
  const first = n === 1;
  return (
    <div
      className="ink-outline shadow-sticker relative flex h-40 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
      style={
        first
          ? undefined
          : { background: TILE_BG[n % TILE_BG.length], transform: `rotate(${n % 2 ? -2 : 2}deg)` }
      }
    >
      {first ? (
        <img
          src="/assets/poster-final.webp"
          alt="Illuspeak poster"
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      ) : (
        <span className="font-display text-3xl text-ink/70">{n}</span>
      )}
    </div>
  );
}

function PosterRow({ nums, seconds }: { nums: number[]; seconds: number }) {
  // Duplicate the tiles so the -50% marquee loops seamlessly. The row is also
  // horizontally scrollable; the animation pauses while the user interacts.
  return (
    <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="poster-track flex gap-4 py-3"
        style={{ animationDuration: `${seconds}s` }}
      >
        {[...nums, ...nums].map((n, i) => (
          <PosterTile key={i} n={n} />
        ))}
      </div>
    </div>
  );
}

export function About() {
  const { lang } = useLang();
  const ui = useUI();
  return (
    <DuotoneBackdrop className="min-h-[100svh]" from="#BFE6FF" to="#E4D6FF">
      <div className="pt-safe relative overflow-hidden px-5 pb-28 pt-10">
        <FloatingMascot
          src="/assets/mascot-surfer.webp"
          className="pointer-events-none absolute right-3 top-6 z-0 w-16"
          duration={4.2}
        />
        <FloatingDoodle className="left-2 top-40 w-9 z-0" duration={6}>
          <Sparkle color="#FF3DAE" />
        </FloatingDoodle>

        <div className="relative inline-block">
          <Burst className="absolute -left-6 -top-4 -z-0 w-20 opacity-40" color="#2BE3F2" />
          <h1 className="relative font-display text-4xl text-ink">{ui.about.title}</h1>
        </div>
        <p className="relative mt-3 font-body text-base text-ink/85">
          {loc(eventInfo.about, lang)}
        </p>

        <div className="ink-outline shadow-sticker relative mt-5 inline-block rotate-[-1deg] rounded-2xl bg-lemon px-4 py-2">
          <p className="font-display text-xl text-ink">{loc(eventInfo.dates, lang)}</p>
          <p className="font-body text-sm font-semibold text-ink">
            {loc(eventInfo.venue, lang)}
          </p>
        </div>

        {/* Brought to you by — organizers (not sponsors) */}
        <h2 className="relative mt-6 font-display text-lg text-ink/70">
          {ui.about.broughtBy}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-5">
          {organizers.map((o) => (
            <img
              key={o.id}
              src={o.logoUrl}
              alt={o.name}
              className="h-12 w-auto object-contain drop-shadow-[0_2px_5px_rgba(42,33,64,0.3)]"
              draggable={false}
            />
          ))}
        </div>

        <Squiggle className="mt-6 w-32 opacity-70" color="#8CFF3D" />

        {/* Poster carousel: two auto-scrolling rows of numbered placeholders */}
        <h2 className="mt-6 font-display text-2xl text-ink">{ui.about.posters}</h2>
        <p className="font-body text-xs text-ink/55">{ui.about.postersHint}</p>
        <div className="mt-2">
          <PosterRow nums={ROW1} seconds={90} />
          <PosterRow nums={ROW2} seconds={110} />
        </div>

        {/* Live leaderboard (renders only when Supabase is configured) */}
        <Leaderboard />

        {/* Sponsors — logos only, drop shadow for the light ones on light bg */}
        <h2 className="mt-8 font-display text-2xl text-ink">{ui.about.sponsors}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="ink-outline flex h-20 items-center justify-center rounded-2xl bg-paper p-3"
            >
              <img
                src={s.logoUrl}
                alt={s.name}
                className="max-h-full max-w-full object-contain drop-shadow-[0_2px_5px_rgba(42,33,64,0.28)]"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Critters peeking at the bottom */}
        <div className="relative mt-10 h-24">
          <FloatingMascot
            src="/assets/cats-cluster-railing.webp"
            className="pointer-events-none absolute left-1/2 top-0 z-0 w-36 -translate-x-1/2"
            duration={5}
            wobble={2}
          />
        </div>

        <p className="relative mt-2 font-body text-xs text-ink/50">{ui.about.privacy}</p>
      </div>
    </DuotoneBackdrop>
  );
}
