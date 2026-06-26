// All booth/sponsor content is editable placeholder data. The owner swaps these
// for real values later without touching any logic (see PRD §6).
//
// RULES:
// - Exactly 6 booths must have isGameTarget: true (the stamp-rally targets).
// - Game targets need a `game` block (hint + info). Their QR token is DERIVED
//   from the booth id (see lib/qr.ts) — you never hand-write tokens.
// - User-facing text is bilingual via the Loc shape ({ en, zh }). Read it with
//   loc(value, lang). `zone` stays an English key; its label is translated in
//   src/i18n/ui.ts (UI.zones).

import type { Lang } from "../i18n/ui";

export type Loc = { en: string; zh: string };

// Pick the active-language string off a bilingual value.
export function loc(value: Loc, lang: Lang): string {
  return value[lang] ?? value.en;
}

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
  name: Loc; // exhibition / booth name
  student: Loc; // artist name
  zone: Zone;
  blurb: Loc; // one-line description
  posterUrl: string; // poster image path (public/)
  mapX: number; // pin position on the map, 0-100 (% of width)
  mapY: number; // 0-100 (% of height)
  isGameTarget: boolean;
  game?: {
    hint: Loc; // physical clue to find it
    info: Loc; // short description shown in the stamp box
  };
}

// Posters are now placeholder tiles rendered in About; booth thumbnails reuse
// the final-poster key visual for now.
const POSTER = "/assets/poster-final.webp";

export const booths: Booth[] = [
  {
    id: "b01",
    name: { en: "Echoes of Home", zh: "家的回响" },
    student: { en: "Aisyah Rahman", zh: "Aisyah Rahman" },
    zone: "Culture",
    blurb: {
      en: "Mixed-media memories of a kampung childhood.",
      zh: "以综合媒材描绘的甘榜童年记忆。",
    },
    posterUrl: POSTER,
    mapX: 22,
    mapY: 30,
    isGameTarget: true,
    game: {
      hint: {
        en: "Find the green zone near the top-left wall. Look for the wishing tree.",
        zh: "在左上角墙边的绿色区域，找那棵许愿树。",
      },
      info: {
        en: "A culture booth weaving textile scraps into a map of home.",
        zh: "一个文化摊位，用布料碎片织出一张家的地图。",
      },
    },
  },
  {
    id: "b02",
    name: { en: "Static Noise", zh: "静电杂讯" },
    student: { en: "Marcus Tan", zh: "Marcus Tan" },
    zone: "Social Awareness",
    blurb: {
      en: "Posters on the things we scroll past.",
      zh: "关于我们随手滑过的事物的海报。",
    },
    posterUrl: POSTER,
    mapX: 70,
    mapY: 24,
    isGameTarget: true,
    game: {
      hint: {
        en: "Top-right magenta corner. The booth with the loud megaphone wall.",
        zh: "右上角的洋红色角落，那个有大喇叭墙的摊位。",
      },
      info: {
        en: "Social-awareness prints about doom-scrolling and attention.",
        zh: "关于无尽刷屏与注意力的社会意识版画。",
      },
    },
  },
  {
    id: "b03",
    name: { en: "Soft Reset", zh: "轻轻重启" },
    student: { en: "Priya Nair", zh: "Priya Nair" },
    zone: "Self-discovering",
    blurb: {
      en: "Self-portraits made during a year of burnout.",
      zh: "在倦怠的一年里画下的自画像。",
    },
    posterUrl: POSTER,
    mapX: 16,
    mapY: 55,
    isGameTarget: true,
    game: {
      hint: {
        en: "Left wall, orange zone. Near the mirror installation.",
        zh: "左侧墙边的橙色区域，靠近那件镜子装置。",
      },
      info: {
        en: "An intimate self-discovery series in ink and gouache.",
        zh: "一组以墨水与水粉绘成的私密自我探索系列。",
      },
    },
  },
  {
    id: "b04",
    name: { en: "Hold This", zh: "替我拿着" },
    student: { en: "Daniel Lim", zh: "Daniel Lim" },
    zone: "Human Relationship",
    blurb: {
      en: "Photo diptychs about hands and the people they hold.",
      zh: "关于手、以及手所牵之人的双联摄影。",
    },
    posterUrl: POSTER,
    mapX: 50,
    mapY: 78,
    isGameTarget: true,
    game: {
      hint: {
        en: "Center-bottom, by the Opening Area stage. Yellow booth.",
        zh: "中下方、开幕区舞台旁的黄色摊位。",
      },
      info: {
        en: "Human-relationship photography on touch and distance.",
        zh: "关于触碰与距离的人际关系摄影。",
      },
    },
  },
  {
    id: "b05",
    name: { en: "Field Notes", zh: "田野笔记" },
    student: { en: "Hana Yusof", zh: "Hana Yusof" },
    zone: "Education",
    blurb: {
      en: "Illustrated zines that teach you something useless and lovely.",
      zh: "插画小志，教你一些无用却可爱的小知识。",
    },
    posterUrl: POSTER,
    mapX: 84,
    mapY: 62,
    isGameTarget: true,
    game: {
      hint: {
        en: "Far right, blue zone. The booth stacked with little zines.",
        zh: "最右侧的蓝色区域，那个堆满小志的摊位。",
      },
      info: {
        en: "Education-zone risograph zines you can flip through.",
        zh: "教育区可随手翻阅的孔版印刷小志。",
      },
    },
  },
  {
    id: "b06",
    name: { en: "Rerun", zh: "重播" },
    student: { en: "Joey Wong", zh: "Joey Wong" },
    zone: "Nostalgia",
    blurb: {
      en: "A shrine to the cartoons that raised us.",
      zh: "献给陪我们长大的那些卡通的小神龛。",
    },
    posterUrl: POSTER,
    mapX: 60,
    mapY: 50,
    isGameTarget: true,
    game: {
      hint: {
        en: "Dead center, red zone near the talk stage. CRT TVs glowing.",
        zh: "正中央、讲座舞台旁的红色区域，一台台亮着的老电视。",
      },
      info: {
        en: "A nostalgia installation of looping childhood TV.",
        zh: "循环播放童年电视的怀旧装置。",
      },
    },
  },

  // --- Non-target booths (map flavor; not part of the rally) ---
  {
    id: "b07",
    name: { en: "Margins", zh: "边缘" },
    student: { en: "Sofia Idris", zh: "Sofia Idris" },
    zone: "Awareness",
    blurb: {
      en: "Quiet drawings about who gets left out of the frame.",
      zh: "关于谁被排除在画面之外的安静素描。",
    },
    posterUrl: POSTER,
    mapX: 34,
    mapY: 42,
    isGameTarget: false,
  },
  {
    id: "b08",
    name: { en: "Loud Quiet", zh: "喧嚣的安静" },
    student: { en: "Kevin Cheah", zh: "Kevin Cheah" },
    zone: "Social Awareness",
    blurb: { en: "Sound-reactive paintings.", zh: "随声音变化的绘画。" },
    posterUrl: POSTER,
    mapX: 78,
    mapY: 40,
    isGameTarget: false,
  },
  {
    id: "b09",
    name: { en: "Heirloom", zh: "传家之物" },
    student: { en: "Mei Ling", zh: "Mei Ling" },
    zone: "Culture",
    blurb: {
      en: "Ceramics glazed with family recipes.",
      zh: "以家传配方上釉的陶艺。",
    },
    posterUrl: POSTER,
    mapX: 30,
    mapY: 18,
    isGameTarget: false,
  },
  {
    id: "b10",
    name: { en: "Growing Pains", zh: "成长的烦恼" },
    student: { en: "Arif Hakim", zh: "Arif Hakim" },
    zone: "Self-discovering",
    blurb: {
      en: "A flipbook of every haircut he regretted.",
      zh: "一本翻页书，记录他后悔过的每一次发型。",
    },
    posterUrl: POSTER,
    mapX: 20,
    mapY: 70,
    isGameTarget: false,
  },
  {
    id: "b11",
    name: { en: "Between Us", zh: "你我之间" },
    student: { en: "Tasha Goh", zh: "Tasha Goh" },
    zone: "Human Relationship",
    blurb: { en: "Letters never sent, framed.", zh: "从未寄出的信，被装裱起来。" },
    posterUrl: POSTER,
    mapX: 44,
    mapY: 64,
    isGameTarget: false,
  },
  {
    id: "b12",
    name: { en: "Replay Value", zh: "重玩价值" },
    student: { en: "Iqbal Zain", zh: "Iqbal Zain" },
    zone: "Nostalgia",
    blurb: { en: "Hand-painted arcade cabinets.", zh: "手绘的街机机台。" },
    posterUrl: POSTER,
    mapX: 66,
    mapY: 66,
    isGameTarget: false,
  },
];

// --- Sponsors (logos only; see public/assets/sponsors) ---
export interface Sponsor {
  id: string;
  name: string; // used for alt text
  logoUrl: string;
}

export const sponsors: Sponsor[] = [
  { id: "lafayette", name: "Lafayette", logoUrl: "/assets/sponsors/lafayette.webp" },
  { id: "bumi", name: "Bumi Studio", logoUrl: "/assets/sponsors/bumi.webp" },
  { id: "faber-castell", name: "Faber-Castell", logoUrl: "/assets/sponsors/faber-castell.webp" },
  { id: "huak-huak", name: "Huak Huak", logoUrl: "/assets/sponsors/huak-huak.webp" },
  { id: "monin", name: "Monin", logoUrl: "/assets/sponsors/monin.webp" },
  { id: "gmbb", name: "GMBB", logoUrl: "/assets/sponsors/gmbb.webp" },
  { id: "playtee", name: "Playtee", logoUrl: "/assets/sponsors/playtee.webp" },
  { id: "rtist", name: "Rtist", logoUrl: "/assets/sponsors/rtist.webp" },
  { id: "weststar", name: "Weststar Printing", logoUrl: "/assets/sponsors/weststar.webp" },
  { id: "lostgens", name: "Lostgens", logoUrl: "/assets/sponsors/lostgens.webp" },
  { id: "lostprint", name: "Lost Print", logoUrl: "/assets/sponsors/lostprint.webp" },
];

// --- Organizers ("Brought to you by", under the About title) ---
export interface Organizer {
  id: string;
  name: string;
  logoUrl: string;
}

export const organizers: Organizer[] = [
  { id: "illus", name: "Illus", logoUrl: "/assets/org/illus.webp" },
  { id: "mia", name: "Mia", logoUrl: "/assets/org/mia.webp" },
];

export const eventInfo = {
  name: "ILLUSPEAK",
  tagline: {
    en: "An art graduate showcase. Walk in. Get lost. Collect stamps.",
    zh: "一场艺术毕业生展。走进来，迷个路，集满印章。",
  } as Loc,
  dates: { en: "July 18–26", zh: "7月18–26日" } as Loc,
  venue: { en: "@GMBB, Level 5", zh: "@GMBB 五楼" } as Loc,
  about: {
    en:
      "Illuspeak is an art graduate exhibition where students set up booths to show " +
      "work and sell merch. Scan stamps around the venue, finish the rally, and unlock " +
      "a prize. Made with love, halftone, and far too many stickers.",
    zh:
      "Illuspeak 是一场艺术毕业生展览，学生们设摊展示作品、贩售周边。" +
      "在场内扫描印章、完成寻宝，即可解锁奖励。满载爱、网点与多到爆的贴纸。",
  } as Loc,
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
