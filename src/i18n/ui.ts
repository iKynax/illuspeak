// All user-facing UI chrome strings, EN + 中. Booth/sponsor/event *content* is
// localized in src/data/booths.ts (via the Loc shape); this file is the app shell.
//
// The owner can edit the Chinese freely here. Strings that splice in dynamic
// values (names, counts) are split into before/after fragments or functions so
// callers can keep their styled spans.

export type Lang = "en" | "zh";

export interface Zones {
  Culture: string;
  "Social Awareness": string;
  "Self-discovering": string;
  "Human Relationship": string;
  Education: string;
  Awareness: string;
  Nostalgia: string;
}

export interface UIStrings {
  tabs: { play: string; about: string };
  hero: { start: string };
  game: {
    title: string;
    subtitle: string;
    allFound: string;
    toGo: (n: number) => string;
    wander: string;
    howTap: string;
    howScan: string;
    howCollect: string;
    offline: string;
    toastForeign: string;
    toastInvalid: string;
    toastDuplicate: string;
    toastNotTarget: string;
    toastCollected: string;
  };
  prize: {
    unlocked: string;
    niceBefore: string;
    niceAfter: string;
    finisher: (rank: number) => string;
    showStaff: string;
    handOverBefore: string; // "They'll hand over your prize. This page is live — unlocked "
    handOverAfter: string; // "."
    shareButton: string;
    rallyComplete: string; // share card
    statTime: string;
    statFinisher: string;
  };
  map: {
    title: string;
    instructions: string;
    legendTarget: string;
    legendBooth: string;
  };
  about: {
    title: string;
    broughtBy: string;
    posters: string;
    postersHint: string;
    sponsors: string;
    privacy: string;
  };
  gate: {
    title: string;
    subtitle: string;
    placeholder: string;
    validation: string;
    submit: string;
  };
  hint: {
    stampN: (n: number) => string;
    collected: string;
    notCollected: string;
    findIt: string;
    doneButton: string;
    scanButton: string;
  };
  booth: { targetBadge: string; close: string };
  leaderboard: { title: string; loading: string; empty: string };
  scanner: {
    opening: string;
    deniedTitle: string;
    deniedBody: string;
    error: string;
    aim: string;
    goBack: string;
  };
  zones: Zones;
  lang: { label: string; en: string; zh: string };
  session: { reset: string; resetConfirm: string };
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    tabs: { play: "Play", about: "About" },
    hero: { start: "Start the hunt →" },
    game: {
      title: "Stamp Rally",
      subtitle: "Find all 6 stamps around L5. Tap a box for a clue.",
      allFound: "All stamps found! 🎉",
      toGo: (n) => `${n} stamp${n === 1 ? "" : "s"} to go!`,
      wander: "Wander the floor, find the QR at each spot, and scan to collect.",
      howTap: "Tap a box for a clue",
      howScan: "Scan the booth's QR",
      howCollect: "Collect all 6 → prize",
      offline: "Progress is saved on this phone and works fully offline.",
      toastForeign: "That's not an Illuspeak stamp 🤔",
      toastInvalid: "That stamp didn't check out 🚫",
      toastDuplicate: "You already got this one! ✨",
      toastNotTarget: "Cool booth — but not a stamp target!",
      toastCollected: "Stamp collected! 🎉",
    },
    prize: {
      unlocked: "Prize unlocked!",
      niceBefore: "Nice work, ",
      niceAfter: " — all 6 stamps.",
      finisher: (rank) => `#${rank} to finish`,
      showStaff: "Show this screen to staff",
      handOverBefore:
        "They'll hand over your prize. This page is live — unlocked ",
      handOverAfter: ".",
      shareButton: "Save my card",
      rallyComplete: "RALLY COMPLETE!",
      statTime: "TIME",
      statFinisher: "FINISHER",
    },
    map: {
      title: "Booth Map",
      instructions: "GMBB Level 5. Pinch to zoom, drag to pan, tap a pin.",
      legendTarget: "stamp target",
      legendBooth: "booth",
    },
    about: {
      title: "About Illuspeak",
      broughtBy: "Brought to you by",
      posters: "Posters",
      postersHint: "auto-scrolling — swipe to browse",
      sponsors: "Sponsors",
      privacy:
        "Privacy: we store only a self-chosen username and your game timing. No accounts, no emails, no tracking. Progress lives on your phone.",
    },
    gate: {
      title: "Pick a name",
      subtitle: "No sign-up. Just something to call you on the leaderboard.",
      placeholder: "e.g. brushgoblin",
      validation: "2–18 characters",
      submit: "Let's go →",
    },
    hint: {
      stampN: (n) => `Stamp #${n}`,
      collected: "Collected ✓",
      notCollected: "Not collected yet",
      findIt: "Find it",
      doneButton: "Nice, done!",
      scanButton: "📷 Scan to collect",
    },
    booth: {
      targetBadge: "⭐ This is a stamp-rally target — scan it to collect a stamp!",
      close: "Close",
    },
    leaderboard: {
      title: "Fastest finishers",
      loading: "Loading…",
      empty: "No finishers yet — be the first! 🏁",
    },
    scanner: {
      opening: "Opening camera…",
      deniedTitle: "Camera permission needed",
      deniedBody:
        "Allow camera access in your browser settings, then tap Scan again to collect this stamp.",
      error: "Couldn't start the camera on this device.",
      aim: "Point at an Illuspeak stamp QR code.",
      goBack: "Go back",
    },
    zones: {
      Culture: "Culture",
      "Social Awareness": "Social Awareness",
      "Self-discovering": "Self-discovering",
      "Human Relationship": "Human Relationship",
      Education: "Education",
      Awareness: "Awareness",
      Nostalgia: "Nostalgia",
    },
    lang: { label: "Language", en: "EN", zh: "中" },
    session: {
      reset: "Reset session",
      resetConfirm:
        "Reset your session? This clears your username and stamp progress on this phone.",
    },
  },

  zh: {
    tabs: { play: "游戏", about: "关于" },
    hero: { start: "开始寻宝 →" },
    game: {
      title: "集章寻宝",
      subtitle: "在五楼找齐全部 6 枚印章。点一格查看线索。",
      allFound: "全部印章已集齐！🎉",
      toGo: (n) => `还差 ${n} 枚印章！`,
      wander: "在场内走走，找到每个摊位的二维码，扫码即可集章。",
      howTap: "点一格看线索",
      howScan: "扫摊位二维码",
      howCollect: "集齐 6 枚 → 领奖",
      offline: "进度保存在本机，完全离线也能玩。",
      toastForeign: "这不是 Illuspeak 的印章 🤔",
      toastInvalid: "这个印章验证不通过 🚫",
      toastDuplicate: "这枚你已经集过啦！✨",
      toastNotTarget: "很酷的摊位 —— 但不是集章点！",
      toastCollected: "成功集章！🎉",
    },
    prize: {
      unlocked: "奖励解锁！",
      niceBefore: "干得漂亮，",
      niceAfter: " —— 6 枚印章全到手。",
      finisher: (rank) => `第 ${rank} 位完成`,
      showStaff: "把此画面出示给工作人员",
      handOverBefore: "他们会把奖品交给你。本页面为实时显示 —— 解锁于 ",
      handOverAfter: "。",
      shareButton: "保存我的卡片",
      rallyComplete: "寻宝完成！",
      statTime: "用时",
      statFinisher: "完成排名",
    },
    map: {
      title: "摊位地图",
      instructions: "GMBB 五楼。双指缩放、拖动平移、点击图钉。",
      legendTarget: "集章点",
      legendBooth: "摊位",
    },
    about: {
      title: "关于 Illuspeak",
      broughtBy: "主办单位",
      posters: "海报",
      postersHint: "自动滚动 —— 可滑动浏览",
      sponsors: "赞助商",
      privacy:
        "隐私：我们只保存你自定义的用户名和游戏用时。无账号、无邮箱、无追踪。进度只存在你的手机上。",
    },
    gate: {
      title: "取个名字",
      subtitle: "无需注册，只是排行榜上对你的称呼。",
      placeholder: "例如 brushgoblin",
      validation: "2–18 个字符",
      submit: "出发 →",
    },
    hint: {
      stampN: (n) => `第 ${n} 枚印章`,
      collected: "已集齐 ✓",
      notCollected: "尚未集到",
      findIt: "去哪找",
      doneButton: "搞定！",
      scanButton: "📷 扫码集章",
    },
    booth: {
      targetBadge: "⭐ 这是集章点 —— 扫码即可集到一枚印章！",
      close: "关闭",
    },
    leaderboard: {
      title: "最快完成榜",
      loading: "加载中…",
      empty: "还没有人完成 —— 来抢第一吧！🏁",
    },
    scanner: {
      opening: "正在打开相机…",
      deniedTitle: "需要相机权限",
      deniedBody: "请在浏览器设置中允许使用相机，然后再次点击扫描来集章。",
      error: "无法在此设备上启动相机。",
      aim: "对准 Illuspeak 的印章二维码。",
      goBack: "返回",
    },
    zones: {
      Culture: "文化",
      "Social Awareness": "社会意识",
      "Self-discovering": "自我探索",
      "Human Relationship": "人际关系",
      Education: "教育",
      Awareness: "觉察",
      Nostalgia: "怀旧",
    },
    lang: { label: "语言", en: "EN", zh: "中" },
    session: {
      reset: "重置进度",
      resetConfirm: "确定要重置进度吗？这会清除本机的用户名和集章进度。",
    },
  },
};
