import { motion } from "motion/react";

// Two peeking characters, pure decoration (pointer-events-none so they never eat
// a tap). Positioned ABSOLUTELY against the centered column frame in App, so they
// hug the content column's edges on both mobile and desktop. Sizes scale with
// viewport width (clamped) and respect the safe-area insets.
export function CornerCharacters() {
  return (
    <>
      {/* Top-left cats, peeking down over the edge (gentle downward bob). */}
      <motion.img
        src="/assets/corner-cats-topleft.webp"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute left-0 w-[clamp(80px,25vw,120px)]"
        style={{ top: "env(safe-area-inset-top)" }}
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-right bear, peeking UP over the ledge (gentle upward bob).
          Nudged above the bottom tab bar so it never crowds it. */}
      <motion.img
        src="/assets/corner-bear-bottomright.webp"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute right-0 w-[clamp(60px,19vw,86px)]"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 4.75rem)" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
