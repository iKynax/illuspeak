import type { ReactNode } from "react";

interface DuotoneBackdropProps {
  children?: ReactNode;
  className?: string;
  // Soft pastel wash gradient sitting under the foreground.
  from?: string;
  to?: string;
}

// A soft blue-pink duotone wash + halftone overlay, recreated entirely in CSS
// (see Asset_Extraction.md — textures are code, not AI cutouts). Drop real street
// photography in later as a faint <img> layer; for now the gradient alone reads right.
export function DuotoneBackdrop({
  children,
  className = "",
  from = "#FFD6E8",
  to = "#BFE6FF",
}: DuotoneBackdropProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />
      <div className="halftone absolute inset-0 opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
}
