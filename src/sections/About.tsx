import { FloatingMascot } from "../components/FloatingMascot";
import { DuotoneBackdrop } from "../components/DuotoneBackdrop";
import { eventInfo, sponsors } from "../data/booths";
import { Leaderboard } from "./Leaderboard";
import { Burst, FloatingDoodle, Sparkle, Squiggle } from "../components/Doodles";

const POSTERS = ["/assets/poster-1.png", "/assets/poster-2.png", "/assets/poster-3.png"];

// Phase 1 About: posters, sponsors, event info, privacy note.
// Phase 2 adds the swipeable carousel polish + the live leaderboard widget.
export function About() {
  return (
    <DuotoneBackdrop className="min-h-[100svh]" from="#BFE6FF" to="#E4D6FF">
      <div className="pt-safe relative overflow-hidden px-5 pb-28 pt-10">
        <FloatingMascot
          src="/assets/mascot-surfer.webp"
          className="absolute right-3 top-6 w-20"
          duration={4.2}
        />
        <FloatingDoodle className="left-2 top-40 w-9" duration={6}>
          <Sparkle color="#FF3DAE" />
        </FloatingDoodle>

        <div className="relative inline-block">
          <Burst className="absolute -left-6 -top-4 -z-0 w-20 opacity-40" color="#2BE3F2" />
          <h1 className="relative font-display text-4xl text-ink">About Illuspeak</h1>
        </div>
        <p className="mt-3 font-body text-base text-ink/85">{eventInfo.about}</p>

        <div className="ink-outline shadow-sticker mt-5 inline-block rotate-[-1deg] rounded-2xl bg-lemon px-4 py-2">
          <p className="font-display text-xl text-ink">{eventInfo.dates}</p>
          <p className="font-body text-sm font-semibold text-ink">{eventInfo.venue}</p>
        </div>

        <Squiggle className="mt-6 w-32 opacity-70" color="#8CFF3D" />

        {/* Poster carousel (horizontal scroll, snap) */}
        <h2 className="mt-6 font-display text-2xl text-ink">Posters</h2>
        <p className="font-body text-xs text-ink/55">swipe →</p>
        <div className="-mx-5 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POSTERS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Illuspeak poster ${i + 1}`}
              className={`ink-outline shadow-sticker h-64 w-auto shrink-0 snap-center rounded-2xl ${
                i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"
              }`}
            />
          ))}
        </div>

        {/* Live leaderboard (renders only when Supabase is configured) */}
        <Leaderboard />

        {/* Sponsors */}
        <h2 className="mt-8 font-display text-2xl text-ink">Sponsors</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="ink-outline flex h-16 items-center justify-center rounded-2xl bg-paper px-3 text-center font-display text-ink"
            >
              {s.name}
            </div>
          ))}
        </div>

        {/* Critters peeking at the bottom */}
        <div className="relative mt-10 h-24">
          <FloatingMascot
            src="/assets/cats-cluster-railing.webp"
            className="absolute left-1/2 top-0 w-44 -translate-x-1/2"
            duration={5}
            wobble={2}
          />
        </div>

        <p className="mt-2 font-body text-xs text-ink/50">
          Privacy: we store only a self-chosen username and your game timing. No
          accounts, no emails, no tracking. Progress lives on your phone.
        </p>
      </div>
    </DuotoneBackdrop>
  );
}
