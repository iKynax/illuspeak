import { motion } from "motion/react";
import { useMemo } from "react";

const ACCENTS = ["#FF3DAE", "#2BE3F2", "#FFE53D", "#8CFF3D"];

interface ConfettiProps {
  // Change `burstKey` to re-trigger the burst (e.g. on each stamp collect).
  burstKey: number | string;
  pieces?: number;
  // "small" for a single stamp thunk, "big" for the prize moment.
  size?: "small" | "big";
}

// Deterministic per-piece jitter (pure — no Math.random during render).
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Lightweight confetti — no library, just motion. Pieces radiate out and fade.
export function Confetti({ burstKey, pieces = 14, size = "small" }: ConfettiProps) {
  const spread = size === "big" ? 220 : 90;
  const bits = useMemo(() => {
    const base = typeof burstKey === "number" ? burstKey : burstKey.length;
    return Array.from({ length: pieces }, (_, i) => {
      const r1 = seeded(base + i * 1.3);
      const r2 = seeded(base + i * 2.7);
      const r3 = seeded(base + i * 5.1);
      const angle = (Math.PI * 2 * i) / pieces + r1 * 0.5;
      const dist = spread * (0.5 + r2 * 0.6);
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        color: ACCENTS[i % ACCENTS.length],
        rot: r3 * 360,
        s: 6 + r1 * 8,
        round: r2 > 0.5,
      };
    });
  }, [burstKey, pieces, spread]);

  return (
    <div
      key={burstKey}
      className="pointer-events-none absolute left-1/2 top-1/2 z-30"
      aria-hidden
    >
      {bits.map((b) => (
        <motion.span
          key={b.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: b.x, y: b.y, opacity: 0, scale: 0.4, rotate: b.rot }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: b.s,
            height: b.s,
            background: b.color,
            borderRadius: b.round ? "9999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
