import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { loc, type Booth } from "../data/booths";
import { stampVisual } from "./stamps";
import { Button } from "../components/Button";
import { makeQrPayload } from "../lib/qr";
import { useLang, useUI } from "../i18n/lang";

interface HintSheetProps {
  booth: Booth;
  index: number;
  collected: boolean;
  onScan: () => void;
  onClose: () => void;
  // Dev-only shortcut to test the collect flow without a physical QR.
  onDevScan?: (payload: string) => void;
}

// Rendered via portal so it escapes the `isolate` stacking context in App.tsx
// and always layers above the BottomTabBar.
export function HintSheet({
  booth,
  index,
  collected,
  onScan,
  onClose,
  onDevScan,
}: HintSheetProps) {
  const v = stampVisual(booth.id);
  const { lang } = useLang();
  const ui = useUI();

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-ink/40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="pb-safe fixed inset-x-0 bottom-0 z-[9999] mx-auto max-w-[430px]"
      >
        <div className="ink-outline relative rounded-t-3xl bg-paper px-5 pb-6 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/8 font-body text-base text-ink/60 transition-colors hover:bg-ink/15"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span
              className="ink-outline flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{ background: v.color }}
            >
              {v.emoji}
            </span>
            <div>
              <p className="font-display text-xl leading-tight text-ink">
                {ui.hint.stampN(index + 1)}
              </p>
              <p className="font-body text-sm font-semibold text-ink/60">
                {collected ? ui.hint.collected : ui.hint.notCollected}
              </p>
            </div>
          </div>

          {booth.game && (
            <div className="mt-4 space-y-3">
              <div className="ink-outline rounded-2xl bg-lemon/60 px-4 py-3">
                <p className="font-display text-sm uppercase tracking-wide text-ink/70">
                  {ui.hint.findIt}
                </p>
                <p className="font-body text-[15px] text-ink">
                  {loc(booth.game.hint, lang)}
                </p>
              </div>
              <p className="px-1 font-body text-sm text-ink/80">
                {loc(booth.game.info, lang)}
              </p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            {collected ? (
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                {ui.hint.doneButton}
              </Button>
            ) : (
              <Button variant="primary" className="flex-1" onClick={onScan}>
                {ui.hint.scanButton}
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
    </>,
    document.body,
  );
}
