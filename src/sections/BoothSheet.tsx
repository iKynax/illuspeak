import { motion } from "motion/react";
import type { Booth } from "../data/booths";
import { Button } from "../components/Button";
import { Sparkle } from "../components/Doodles";

interface BoothSheetProps {
  booth: Booth;
  onClose: () => void;
}

// Bottom sheet shown when a map pin is tapped (PRD §5.2).
export function BoothSheet({ booth, onClose }: BoothSheetProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="pb-safe fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px]"
      >
        <div className="ink-outline relative rounded-t-3xl bg-paper px-5 pb-6 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />

          {booth.isGameTarget && (
            <Sparkle className="absolute right-5 top-4 h-7 w-7 rotate-12" color="#FFE53D" />
          )}

          <div className="flex gap-4">
            <img
              src={booth.posterUrl}
              alt={`${booth.name} poster`}
              className="ink-outline shadow-sticker-sm h-28 w-20 shrink-0 rotate-[-3deg] rounded-xl object-cover"
            />
            <div className="min-w-0 pt-1">
              <span className="ink-outline inline-block rounded-full bg-blue px-2.5 py-0.5 font-display text-xs text-ink">
                {booth.zone}
              </span>
              <h3 className="mt-1 font-display text-2xl leading-tight text-ink">
                {booth.name}
              </h3>
              <p className="font-body text-sm font-semibold text-ink/70">
                by {booth.student}
              </p>
            </div>
          </div>

          <p className="mt-3 font-body text-[15px] text-ink/85">{booth.blurb}</p>

          {booth.isGameTarget && (
            <p className="mt-3 rounded-xl bg-lemon/60 px-3 py-2 font-body text-sm font-semibold text-ink">
              ⭐ This is a stamp-rally target — scan it to collect a stamp!
            </p>
          )}

          <Button variant="secondary" className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </>
  );
}
