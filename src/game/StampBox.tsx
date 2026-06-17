import { motion } from "motion/react";
import type { Booth } from "../data/booths";
import { stampVisual } from "./stamps";
import { Confetti } from "../components/Confetti";

interface StampBoxProps {
  booth: Booth;
  index: number;
  collected: boolean;
  // Set when this box was just collected, to fire the thunk + confetti once.
  justCollected: boolean;
  onTap: () => void;
}

export function StampBox({
  booth,
  index,
  collected,
  justCollected,
  onTap,
}: StampBoxProps) {
  const v = stampVisual(booth.id);

  return (
    <button onClick={onTap} className="relative aspect-square">
      {/* Empty slot */}
      <div
        className={`flex h-full w-full flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-ink/40 bg-paper/70 transition-opacity ${
          collected ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-3xl grayscale opacity-40">{v.emoji}</span>
        <span className="mt-1 font-display text-sm text-ink/50">
          #{index + 1}
        </span>
      </div>

      {/* Collected stamp — thunks in with a spring */}
      {collected && (
        <motion.div
          initial={
            justCollected
              ? { scale: 2.2, rotate: -25, opacity: 0 }
              : { scale: 1, rotate: -4, opacity: 1 }
          }
          animate={{ scale: 1, rotate: -4, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          className="ink-outline shadow-sticker absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
          style={{ background: v.color }}
        >
          <span className="text-3xl drop-shadow-[1px_1px_0_rgba(42,33,64,0.4)]">
            {v.emoji}
          </span>
          <span className="mt-0.5 font-display text-base text-ink">✓</span>
        </motion.div>
      )}

      {justCollected && <Confetti burstKey={booth.id} pieces={16} />}
    </button>
  );
}
