import { AnimatePresence, motion } from "motion/react";

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

export function Toast({ toast }: { toast: ToastData | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center pt-3">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className={`ink-outline shadow-sticker max-w-[90%] rounded-full px-5 py-2.5 font-display text-base ${TONES[toast.tone]}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
