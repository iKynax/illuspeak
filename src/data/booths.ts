// All booth/sponsor content is editable placeholder data. The owner swaps these
// for real values later without touching any logic (see PRD §6).
//
// RULES:
// - Exactly 6 booths must have isGameTarget: true (the stamp-rally targets).
// - Game targets need a `game` block (hint + info). Their QR token is DERIVED
//   from the booth id (see lib/qr.ts) — you never hand-write tokens.

export type Zone =
  | "Culture"
  | "Social Awareness"
  | "Self-discovering"
  | "Human Relationship"
  | "Education"
  | "Awareness"
  | "Nostalgia";

export interface Booth {
  id: string;
  name: string; // exhibition / booth name
  student: string; // artist name
  zone: Zone;
  blurb: string; // one-line description
  posterUrl: string; // poster image path (public/)
  mapX: number; // pin position on the map, 0-100 (% of width)
  mapY: number; // 0-100 (% of height)
  isGameTarget: boolean;
  game?: {
    hint: string; // physical clue to find it
    info: string; // short description shown in the stamp box
  };
}

// Placeholder posters cycle through the three real key visuals for now.
const P = ["/assets/poster-1.png", "/assets/poster-2.png", "/assets/poster-3.png"];

export const booths: Booth[] = [
  {
    id: "b01",
    name: "Echoes of Home",
    student: "Aisyah Rahman",
    zone: "Culture",
    blurb: "Mixed-media memories of a kampung childhood.",
    posterUrl: P[0],
    mapX: 22,
    mapY: 30,
    isGameTarget: true,
    game: {
      hint: "Find the green zone near the top-left wall. Look for the wishing tree.",
      info: "A culture booth weaving textile scraps into a map of home.",
    },
  },
  {
    id: "b02",
    name: "Static Noise",
    student: "Marcus Tan",
    zone: "Social Awareness",
    blurb: "Posters on the things we scroll past.",
    posterUrl: P[1],
    mapX: 70,
    mapY: 24,
    isGameTarget: true,
    game: {
      hint: "Top-right magenta corner. The booth with the loud megaphone wall.",
      info: "Social-awareness prints about doom-scrolling and attention.",
    },
  },
  {
    id: "b03",
    name: "Soft Reset",
    student: "Priya Nair",
    zone: "Self-discovering",
    blurb: "Self-portraits made during a year of burnout.",
    posterUrl: P[2],
    mapX: 16,
    mapY: 55,
    isGameTarget: true,
    game: {
      hint: "Left wall, orange zone. Near the mirror installation.",
      info: "An intimate self-discovery series in ink and gouache.",
    },
  },
  {
    id: "b04",
    name: "Hold This",
    student: "Daniel Lim",
    zone: "Human Relationship",
    blurb: "Photo diptychs about hands and the people they hold.",
    posterUrl: P[0],
    mapX: 50,
    mapY: 78,
    isGameTarget: true,
    game: {
      hint: "Center-bottom, by the Opening Area stage. Yellow booth.",
      info: "Human-relationship photography on touch and distance.",
    },
  },
  {
    id: "b05",
    name: "Field Notes",
    student: "Hana Yusof",
    zone: "Education",
    blurb: "Illustrated zines that teach you something useless and lovely.",
    posterUrl: P[1],
    mapX: 84,
    mapY: 62,
    isGameTarget: true,
    game: {
      hint: "Far right, blue zone. The booth stacked with little zines.",
      info: "Education-zone risograph zines you can flip through.",
    },
  },
  {
    id: "b06",
    name: "Rerun",
    student: "Joey Wong",
    zone: "Nostalgia",
    blurb: "A shrine to the cartoons that raised us.",
    posterUrl: P[2],
    mapX: 60,
    mapY: 50,
    isGameTarget: true,
    game: {
      hint: "Dead center, red zone near the talk stage. CRT TVs glowing.",
      info: "A nostalgia installation of looping childhood TV.",
    },
  },

  // --- Non-target booths (map flavor; not part of the rally) ---
  {
    id: "b07",
    name: "Margins",
    student: "Sofia Idris",
    zone: "Awareness",
    blurb: "Quiet drawings about who gets left out of the frame.",
    posterUrl: P[0],
    mapX: 34,
    mapY: 42,
    isGameTarget: false,
  },
  {
    id: "b08",
    name: "Loud Quiet",
    student: "Kevin Cheah",
    zone: "Social Awareness",
    blurb: "Sound-reactive paintings.",
    posterUrl: P[1],
    mapX: 78,
    mapY: 40,
    isGameTarget: false,
  },
  {
    id: "b09",
    name: "Heirloom",
    student: "Mei Ling",
    zone: "Culture",
    blurb: "Ceramics glazed with family recipes.",
    posterUrl: P[2],
    mapX: 30,
    mapY: 18,
    isGameTarget: false,
  },
  {
    id: "b10",
    name: "Growing Pains",
    student: "Arif Hakim",
    zone: "Self-discovering",
    blurb: "A flipbook of every haircut he regretted.",
    posterUrl: P[0],
    mapX: 20,
    mapY: 70,
    isGameTarget: false,
  },
  {
    id: "b11",
    name: "Between Us",
    student: "Tasha Goh",
    zone: "Human Relationship",
    blurb: "Letters never sent, framed.",
    posterUrl: P[1],
    mapX: 44,
    mapY: 64,
    isGameTarget: false,
  },
  {
    id: "b12",
    name: "Replay Value",
    student: "Iqbal Zain",
    zone: "Nostalgia",
    blurb: "Hand-painted arcade cabinets.",
    posterUrl: P[2],
    mapX: 66,
    mapY: 66,
    isGameTarget: false,
  },
];

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string; // placeholder for now
}

export const sponsors: Sponsor[] = [
  { id: "s1", name: "GMBB" },
  { id: "s2", name: "Arts Council" },
  { id: "s3", name: "Local Coffee Co." },
  { id: "s4", name: "Riso Studio" },
  { id: "s5", name: "Paper Goods" },
  { id: "s6", name: "Campus Gallery" },
];

export const eventInfo = {
  name: "ILLUSPEAK",
  tagline: "An art graduate showcase. Walk in. Get lost. Collect stamps.",
  dates: "July 18–26",
  venue: "@GMBB, Level 5",
  about:
    "Illuspeak is an art graduate exhibition where students set up booths to show " +
    "work and sell merch. Scan stamps around the venue, finish the rally, and unlock " +
    "a prize. Made with love, halftone, and far too many stickers.",
};

// --- Derived helpers ---

export const gameTargets: Booth[] = booths.filter((b) => b.isGameTarget);

export const TARGET_COUNT = gameTargets.length;

export function getBooth(id: string): Booth | undefined {
  return booths.find((b) => b.id === id);
}

export function isGameTargetId(id: string): boolean {
  return gameTargets.some((b) => b.id === id);
}

// Loud guard: the game assumes exactly 6 targets. Fail fast in dev if data drifts.
// (Optional chaining so this module is also importable from plain Node tooling.)
if (import.meta.env?.DEV && TARGET_COUNT !== 6) {
  console.warn(
    `[illuspeak] Expected exactly 6 game targets, found ${TARGET_COUNT}. ` +
      `Fix isGameTarget flags in src/data/booths.ts.`,
  );
}
