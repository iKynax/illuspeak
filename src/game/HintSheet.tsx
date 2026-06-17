import { motion } from "motion/react";
import type { Booth } from "../data/booths";
import { stampVisual } from "./stamps";
import { Button } from "../components/Button";
import { makeQrPayload } from "../lib/qr";

interface HintSheetProps {
  booth: Booth;
  index: number;
  collected: boolean;
  onScan: () => void;
  onClose: () => void;
  // Dev-only shortcut to test the collect flow without a physical QR.
  onDevScan?: (payload: string) => void;
}

export function HintSheet({
  booth,
  index,
  collected,
  onScan,
  onClose,
  onDevScan,
}: HintSheetProps) {
  const v = stampVisual(booth.id);

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
        <div className="ink-outline rounded-t-3xl bg-paper px-5 pb-6 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />

          <div className="flex items-center gap-3">
            <span
              className="ink-outline flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{ background: v.color }}
            >
              {v.emoji}
            </span>
            <div>
              <p className="font-display text-xl leading-tight text-ink">
                Stamp #{index + 1}
              </p>
              <p className="font-body text-sm font-semibold text-ink/60">
                {collected ? "Collected ✓" : "Not collected yet"}
              </p>
            </div>
          </div>

          {booth.game && (
            <div className="mt-4 space-y-3">
              <div className="ink-outline rounded-2xl bg-lemon/60 px-4 py-3">
                <p className="font-display text-sm uppercase tracking-wide text-ink/70">
                  Find it
                </p>
                <p className="font-body text-[15px] text-ink">
                  {booth.game.hint}
                </p>
              </div>
              <p className="px-1 font-body text-sm text-ink/80">
                {booth.game.info}
              </p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            {collected ? (
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Nice, done!
              </Button>
            ) : (
              <Button variant="primary" className="flex-1" onClick={onScan}>
                📷 Scan to collect
              </Button>
            )}
          </div>

          {/* Dev-only: simulate scanning this booth's QR. */}
          {import.meta.env.DEV && !collected && onDevScan && (
            <button
              onClick={() => onDevScan(makeQrPayload(booth.id))}
              className="mt-3 w-full font-body text-xs text-ink/40 underline"
            >
              dev: fake-scan this stamp
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
