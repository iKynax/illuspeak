import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

export interface ToastData {
  id: number;
  message: string;
  tone: "good" | "bad" | "info";
}

const TONES: Record<ToastData["tone"], string> = {
  good: "bg-lime",
  bad: "bg-hotpink text-paper",
  info: "bg-blue",
};

// Portaled to <body> so it escapes the App's `isolate` stacking context (where a
// z-index would otherwise be trapped below the corner controls). z-[9000] keeps
// it above all chrome — toasts must always be the focus when they pop.
export function Toast({ toast }: { toast: ToastData | null }) {
  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 z-[9000] flex justify-center px-4"
      style={{ top: "calc(env(safe-area-inset-top) + 4.5rem)" }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className={`ink-outline shadow-sticker max-w-[90%] rounded-full px-5 py-2.5 text-center font-display text-base ${TONES[toast.tone]}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
