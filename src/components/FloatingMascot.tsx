import { motion } from "motion/react";
import type { CSSProperties } from "react";

interface FloatingMascotProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  // Seconds for one float cycle; vary per mascot so they don't bob in lockstep.
  duration?: number;
  // Degrees of gentle wobble.
  wobble?: number;
}

// A transparent character PNG/WebP that idly floats and bobs. Keep these OUT of
// tap zones — they're decoration (see Asset_Extraction.md route A).
export function FloatingMascot({
  src,
  alt = "",
  className = "",
  style,
  duration = 4,
  wobble = 3,
}: FloatingMascotProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      aria-hidden={alt === ""}
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
      style={style}
      animate={{ y: [0, -12, 0], rotate: [-wobble, wobble, -wobble] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
