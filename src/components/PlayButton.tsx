import { motion } from "motion/react";

// Persistent floating "play the game" button, top-right, always visible while
// scrolling the main page. Icon-only (no text). Hot pink fill earns the primary
// action; chunky ink outline + hard offset shadow + springy tap stay on-brand.
// Positioned absolutely against the centered column frame in App so it hugs the
// content column's right edge on both mobile and desktop. pointer-events-auto
// re-enables taps inside the click-through frame; z-10 keeps it above the
// corner cats. The frame's z-30 keeps the whole group below the tab bar / sheets
// / scanner, so it never covers a modal or the camera.
export function PlayButton() {
  function scrollToGame() {
    document.getElementById("minigame")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <motion.button
      type="button"
      onClick={scrollToGame}
      aria-label="Play the stamp rally game"
      whileTap={{ scale: 0.95 }}
      className="pointer-events-auto absolute right-3 z-10 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-hotpink text-paper shadow-sticker"
      style={{ top: "calc(env(safe-area-inset-top) + 0.75rem)" }}
    >
      <ControllerIcon className="h-7 w-7" />
    </motion.button>
  );
}

// Hand-drawn gamepad, matching the project's inline-SVG doodle approach.
function ControllerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="6" y1="11" x2="10" y2="11" />
      <line x1="8" y1="9" x2="8" y2="13" />
      <line x1="15" y1="12" x2="15.01" y2="12" />
      <line x1="18" y1="10" x2="18.01" y2="10" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.152A4 4 0 0 0 17.32 5z" />
    </svg>
  );
}
