import { motion } from "motion/react";
import type { CSSProperties } from "react";

// Hand-drawn marker doodles, generated entirely in code (no AI cutouts —
// see Asset_Extraction.md: "Draw simple marker squiggles/stars as inline SVG").
// Cheap, scalable, animatable; they keep the sticker/zine energy everywhere.

interface DoodleProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  stroke?: string; // ink outline color
}

const INK = "#2A2140";

// A four-point sparkle / twinkle.
export function Sparkle({ className = "", style, color = "#FFE53D", stroke = INK }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <path
        d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A chunky 5-point marker star.
export function Star({ className = "", style, color = "#FF3DAE", stroke = INK }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-hidden>
      <path
        d="M24 3 L30 18 L46 19 L33 29 L38 45 L24 36 L10 45 L15 29 L2 19 L18 18 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A loose marker squiggle stroke.
export function Squiggle({ className = "", style, color = "#2BE3F2" }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 30" className={className} style={style} aria-hidden fill="none">
      <path
        d="M4 18 C16 2 24 2 34 16 S54 30 64 14 S86 2 96 16 S114 26 116 12"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Comic halftone burst (radiating spikes) — great behind a heading.
export function Burst({ className = "", style, color = "#FFE53D", stroke = INK }: DoodleProps) {
  const spikes = 14;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 48 : 33;
    const a = (Math.PI * i) / spikes;
    pts.push(`${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`);
  }
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <polygon
        points={pts.join(" ")}
        fill={color}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A wobbly hand-drawn blob (sticker backdrop shape).
export function Blob({ className = "", style, color = "#E4D6FF", stroke = INK }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M51 6 C70 4 92 16 93 38 C94 58 86 72 68 84 C50 96 24 95 12 78 C1 62 5 38 16 24 C25 12 36 7 51 6 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
    </svg>
  );
}

// A curved marker arrow (for "scroll / this way" cues).
export function ArcArrow({ className = "", style, color = INK }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 60" className={className} style={style} aria-hidden fill="none">
      <path d="M8 12 C28 4 60 8 70 38" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M58 34 L70 40 L66 26" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Floating, gently bobbing wrapper for any doodle — keep OUT of tap zones.
export function FloatingDoodle({
  children,
  className = "",
  style,
  duration = 5,
  drift = 10,
  spin = 6,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  duration?: number;
  drift?: number;
  spin?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={style}
      animate={{ y: [0, -drift, 0], rotate: [-spin, spin, -spin] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
