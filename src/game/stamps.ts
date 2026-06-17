import { gameTargets } from "../data/booths";

// Visual identity for each of the 6 stamps (emoji motif + accent color),
// echoing the DESIGN.md stamp set: palette, megaphone, paintbrush, lightbulb,
// star, speech bubble. Assigned by game-target order so it stays stable.
const PALETTE = [
  { emoji: "🎨", color: "#FF3DAE" }, // hot pink
  { emoji: "📣", color: "#2BE3F2" }, // cyan
  { emoji: "🖌️", color: "#FFE53D" }, // lemon
  { emoji: "💡", color: "#8CFF3D" }, // lime
  { emoji: "⭐", color: "#FF3DAE" },
  { emoji: "💬", color: "#2BE3F2" },
];

export interface StampVisual {
  emoji: string;
  color: string;
}

export function stampVisual(boothId: string): StampVisual {
  const index = gameTargets.findIndex((b) => b.id === boothId);
  return PALETTE[index >= 0 ? index % PALETTE.length : 0];
}
