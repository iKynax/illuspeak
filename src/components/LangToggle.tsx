import { motion } from "motion/react";
import { useLang } from "../i18n/lang";

// Subtle EN/中 switch. Intentionally low-key vs the hot-pink PlayButton: small
// pill, paper surface, thin ink outline. Mounted top-right in App (both tabs),
// sitting just left of the PlayButton on the main tab.
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
      whileTap={{ scale: 0.92 }}
      style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
      className={`pointer-events-auto absolute z-10 flex h-9 items-center gap-1 rounded-full border-2 border-ink/70 bg-paper/85 px-3 font-display text-sm text-ink/80 shadow-[2px_2px_0_rgba(42,33,64,0.35)] backdrop-blur-sm ${className}`}
    >
      <span className={lang === "en" ? "text-hotpink" : "text-ink/40"}>EN</span>
      <span className="text-ink/30">/</span>
      <span className={lang === "zh" ? "text-hotpink" : "text-ink/40"}>中</span>
    </motion.button>
  );
}
