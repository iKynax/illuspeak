import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

// A continuous hand-drawn rainbow that weaves left<->right down the whole page,
// stitching the sections together and drawing itself as you scroll. It starts at
// the very top of the hero (path begins at y=0) and runs through hero -> map ->
// game. Rendered behind the content: it weaves OVER the hero's -z-10 wash and
// shows through the translucent map/game washes. pointer-events-none.
//
// preserveAspectRatio="none" stretches the oversized viewBox to the real page
// height, so we don't have to measure section heights — the path just meanders
// and dips between sections.
const PATH =
  "M 80 0 C 300 200, 40 500, 200 760 S 360 1200, 120 1500 S 40 2000, 260 2300 S 320 2800, 160 3200";
const COLORS = ["#FF3DAE", "#FFB13D", "#FFE53D", "#8CFF3D", "#2BE3F2", "#9B6BFF"];

export function RainbowSpine() {
  // Measure the real path length so the draw maps exactly across the full scroll
  // (rather than finishing early against a guessed dash length).
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(4000);
  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  const { scrollYProgress } = useScroll();
  // Spring the scroll progress so the draw trails behind the scroll and eases to
  // catch up a beat later (low stiffness + heavy damping = gentle, no overshoot).
  const smooth = useSpring(scrollYProgress, {
    stiffness: 28,
    damping: 18,
    restDelta: 0.0004,
  });
  // Reveal the stroke from the top down as the trailing progress grows.
  const dashOffset = useTransform(smooth, [0, 1], [len, 0]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 390 3200"
      preserveAspectRatio="none"
      aria-hidden
    >
      {COLORS.map((c, i) => (
        <motion.path
          key={c}
          ref={i === 0 ? pathRef : undefined}
          d={PATH}
          fill="none"
          stroke={c}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={len}
          style={{ strokeDashoffset: dashOffset }}
          transform={`translate(${(i - 2.5) * 7}, 0)`}
          opacity={0.95}
        />
      ))}
    </svg>
  );
}
