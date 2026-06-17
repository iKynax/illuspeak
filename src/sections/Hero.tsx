import { motion } from "motion/react";
import { Button } from "../components/Button";
import { FloatingMascot } from "../components/FloatingMascot";
import { eventInfo } from "../data/booths";
import { FloatingDoodle, Sparkle } from "../components/Doodles";

interface HeroProps {
  onStart: () => void;
}

const PAGE_WASH = "#FFD6E8"; // soft pink the hero fades into at its bottom edge

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pb-10 pt-10 text-center">
      {/* ---- Layered backdrop: photo -> blue-pink duotone -> halftone dots ----
          All pinned to -z-10 so the scroll-driven rainbow spine can weave OVER
          the wash while staying behind the content. Mirrors the About page's
          pastel, dotted treatment so the two sections feel consistent. */}
      {/* 1. KL street photo, kept as soft texture (no longer black-and-white) */}
      <img
        src="/assets/hero-backdrop.webp"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[center_62%] [filter:saturate(0.9)_brightness(1.05)]"
      />
      {/* 2. Blue->pink pastel wash so the photo reads as a soft duotone, like About */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.72]"
        style={{ background: "linear-gradient(135deg, #BFE6FF, #FFD6E8)" }}
      />
      {/* 3. Bottom fade so the backdrop dissolves into the page wash */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/5"
        style={{ background: `linear-gradient(to bottom, transparent, ${PAGE_WASH})` }}
      />
      {/* 4. Halftone dots, matched to the About section's texture (opacity-60) */}
      <div className="halftone pointer-events-none absolute inset-0 -z-10 opacity-60" />

      {/* 5. Rainbow streak arcing behind the wordmark */}
      <motion.img
        src="/assets/rainbow-streak.webp"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute -left-6 top-2 w-44 -rotate-6 opacity-90"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* A FEW accents only (NOT a cluster): one sparkle + the orange snail */}
      <FloatingDoodle className="left-6 top-40 w-7 z-0" duration={6} drift={14}>
        <Sparkle color="#2BE3F2" />
      </FloatingDoodle>
      <FloatingMascot
        src="/assets/critter-snail-orange.webp"
        className="absolute right-4 top-28 z-0 w-14 -rotate-6"
        duration={5}
      />

      {/* ---- Foreground content ---- */}
      {/* Wordmark */}
      <motion.img
        src="/assets/wordmark.webp"
        alt="Illuspeak"
        draggable={false}
        className="relative z-10 mt-8 w-[78%] max-w-[320px] drop-shadow-[3px_3px_0_rgba(42,33,64,0.25)]"
        initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: -2, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      />

      {/* Mascot mid-leap, now with real depth behind it */}
      <FloatingMascot
        src="/assets/mascot-paintbrush-kid.webp"
        className="relative z-10 mt-2 w-[58%] max-w-[240px] drop-shadow-[4px_6px_0_rgba(42,33,64,0.18)]"
        duration={4.5}
      />

      {/* Date + venue sticker */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 20 }}
        className="ink-outline shadow-sticker relative z-10 mt-3 rotate-[-2deg] rounded-2xl bg-lemon px-5 py-2"
      >
        <p className="font-display text-2xl leading-none text-ink">
          {eventInfo.dates}
        </p>
        <p className="font-body text-sm font-semibold text-ink">
          {eventInfo.venue}
        </p>
      </motion.div>

      {/* Tagline — paper scrim keeps it legible over the photo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-5 max-w-[300px] rounded-2xl bg-paper/70 px-4 py-2 font-body text-base font-semibold text-ink backdrop-blur-[2px]"
      >
        {eventInfo.tagline}
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 18 }}
        className="relative z-10 mt-auto pt-8"
      >
        <Button onClick={onStart} variant="primary" className="text-xl">
          Start the hunt →
        </Button>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="relative z-10 mt-6 font-display text-2xl text-ink/70"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        ↓
      </motion.div>
    </section>
  );
}
