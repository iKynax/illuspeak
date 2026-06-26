import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Confetti } from "../components/Confetti";
import { ShareCard } from "../share/ShareCard";
import { saveShareCard } from "../share/exportCard";
import { submitCompletion } from "../lib/supabase";
import { formatAgo, formatDuration } from "../lib/format";
import { FloatingMascot } from "../components/FloatingMascot";
import { FloatingDoodle, Sparkle, Star } from "../components/Doodles";
import { useLang, useUI } from "../i18n/lang";

interface PrizeProps {
  username: string;
  durationSeconds: number;
  completedAt: number;
  onReset: () => void;
}

export function Prize({ username, durationSeconds, completedAt, onReset }: PrizeProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Seed from a pure prop; the live clock updates from the effect below.
  const [now, setNow] = useState(completedAt);
  const [saving, setSaving] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const { lang } = useLang();
  const ui = useUI();

  // Live ticking element — a recycled screenshot looks obviously stale next to
  // this. Low-stakes anti-reuse touch (PRD §5.3).
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Optional leaderboard submit — graceful, never blocks the prize (PRD §5.3).
  useEffect(() => {
    let alive = true;
    submitCompletion({ username, durationSeconds, completedAt }).then((r) => {
      if (alive && r != null) setRank(r);
    });
    return () => {
      alive = false;
    };
  }, [username, durationSeconds, completedAt]);

  async function handleSave() {
    if (!cardRef.current) return;
    setSaving(true);
    await saveShareCard(cardRef.current, username);
    setSaving(false);
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-pink/40 px-5 py-12 text-center">
      <Confetti burstKey="prize" pieces={40} size="big" />

      {/* code-art + mascot scatter */}
      <FloatingDoodle className="left-4 top-16 w-10" duration={6}>
        <Star color="#FFE53D" />
      </FloatingDoodle>
      <FloatingDoodle className="right-5 top-24 w-8" duration={5} drift={14}>
        <Sparkle color="#2BE3F2" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-6 w-9" duration={7} drift={8}>
        <Sparkle color="#FF3DAE" />
      </FloatingDoodle>
      <FloatingMascot
        src="/assets/critter-cat-lime.webp"
        className="absolute bottom-4 right-2 w-28 opacity-90"
        duration={5}
      />

      <motion.img
        src="/assets/mascot-bear.webp"
        alt=""
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="relative z-10 w-[62%] max-w-[260px] drop-shadow-[5px_6px_0_rgba(42,33,64,0.2)]"
      />

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mt-3 font-display text-4xl text-ink"
      >
        {ui.prize.unlocked}
      </motion.h1>

      <p className="relative z-10 mt-1 font-body text-base font-semibold text-ink/80">
        {ui.prize.niceBefore}
        <span className="text-hotpink">{username}</span>
        {ui.prize.niceAfter}
      </p>

      <div className="relative z-10 mt-5 flex gap-3">
        <span className="ink-outline shadow-sticker rounded-2xl bg-cyan px-4 py-2 font-display text-ink">
          ⏱ {formatDuration(durationSeconds)}
        </span>
        {rank != null && (
          <span className="ink-outline shadow-sticker rounded-2xl bg-lime px-4 py-2 font-display text-ink">
            {ui.prize.finisher(rank)}
          </span>
        )}
      </div>

      <div className="ink-outline relative z-10 mt-6 max-w-[320px] rounded-2xl bg-paper/90 px-5 py-4">
        <p className="font-display text-lg text-ink">{ui.prize.showStaff}</p>
        <p className="mt-1 font-body text-sm text-ink/70">
          {ui.prize.handOverBefore}
          <span className="font-semibold text-hotpink">
            {formatAgo(completedAt, now)}
          </span>
          {ui.prize.handOverAfter}
        </p>
        {/* live tick so a screenshot looks stale */}
        <p className="mt-1 font-body text-xs tabular-nums text-ink/40">
          {new Date(now).toLocaleTimeString()}
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <Button variant="primary" onClick={handleSave} disabled={saving} className="text-lg">
          {saving ? "…" : `📸 ${ui.prize.shareButton}`}
        </Button>
      </div>

      {/* Subtle testing-phase reset (back to the username gate) */}
      <button
        onClick={onReset}
        className="relative z-10 mt-5 font-body text-[11px] text-ink/40 underline underline-offset-2"
      >
        {ui.session.reset}
      </button>

      {/* Off-screen full-res card for export. */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }}
      >
        <ShareCard
          ref={cardRef}
          username={username}
          durationSeconds={durationSeconds}
          rank={rank}
          lang={lang}
        />
      </div>
    </div>
  );
}
