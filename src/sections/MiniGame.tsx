import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Game } from "../game/useGame";
import { gameTargets } from "../data/booths";
import { parseQrPayload } from "../lib/qr";
import { UsernameGate } from "../game/UsernameGate";
import { StampBox } from "../game/StampBox";
import { HintSheet } from "../game/HintSheet";
import { Scanner } from "../game/Scanner";
import { Prize } from "./Prize";
import { Toast, type ToastData } from "../components/Toast";
import { FloatingMascot } from "../components/FloatingMascot";
import { Burst, Star } from "../components/Doodles";
import { useUI } from "../i18n/lang";

interface MiniGameProps {
  game: Game;
}

let toastSeq = 0;

export function MiniGame({ game }: MiniGameProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [justCollectedId, setJustCollectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const ui = useUI();

  function showToast(message: string, tone: ToastData["tone"]) {
    const id = ++toastSeq;
    setToast({ id, message, tone });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2600);
  }

  // Testing-phase escape hatch: wipe the session (username + progress) so a
  // player can restart from the username gate. Also frees anyone wedged by a
  // denied-camera state to begin again. Deliberately low-key.
  function handleReset() {
    if (window.confirm(ui.session.resetConfirm)) game.reset();
  }

  function handleScanResult(text: string) {
    setScanning(false);
    const parsed = parseQrPayload(text);
    if (!parsed.ok) {
      showToast(
        parsed.reason === "foreign" ? ui.game.toastForeign : ui.game.toastInvalid,
        "bad",
      );
      return;
    }
    const result = game.collect(parsed.boothId);
    if (result.status === "duplicate") {
      showToast(ui.game.toastDuplicate, "info");
    } else if (result.status === "not-a-target") {
      showToast(ui.game.toastNotTarget, "info");
    } else {
      setJustCollectedId(result.boothId);
      setSelectedId(null);
      showToast(ui.game.toastCollected, "good");
      setTimeout(() => setJustCollectedId(null), 1200);
    }
  }

  // --- Gate: pick a username first ---
  if (!game.username) {
    return (
      <section className="flex min-h-[100svh] items-center justify-center bg-blue/40 px-5 py-16">
        <UsernameGate onSubmit={game.setUsername} />
      </section>
    );
  }

  // --- Complete: prize screen ---
  if (game.isComplete && game.completedAt && game.startedAt) {
    return (
      <Prize
        username={game.username}
        completedAt={game.completedAt}
        durationSeconds={Math.round((game.completedAt - game.startedAt) / 1000)}
        onReset={handleReset}
      />
    );
  }

  const selected = selectedId ? gameTargets.find((b) => b.id === selectedId) : null;

  // --- Active game ---
  const remaining = game.total - game.count;
  return (
    <section className="relative overflow-hidden bg-pink/50 px-5 pb-28 pt-12">
      <Toast toast={toast} />

      {/* Map->Game seam: the ghost drifting in at the top */}
      <FloatingMascot
        src="/assets/mascot-ghost.webp"
        className="absolute left-4 top-3 z-0 w-16"
        duration={3.8}
        wobble={5}
      />
      {/* The cutie snail near the header */}
      <FloatingMascot
        src="/assets/critter-snail-cutie.webp"
        className="absolute right-4 top-4 z-0 w-14 rotate-3"
        duration={4.6}
      />
      {/* Scattered character (was the pinned top-left corner). Sits in the empty
          lower padding, behind content, so it peeks without covering any text. */}
      <FloatingMascot
        src="/assets/corner-cats-topleft.webp"
        className="pointer-events-none absolute right-3 bottom-6 z-0 w-20 opacity-90"
        duration={5.2}
        wobble={3}
      />

      <header className="relative text-center">
        <Burst
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 w-40 -translate-x-1/2 -translate-y-1/2 opacity-50"
          color="#FFE53D"
        />
        <h2 className="relative font-display text-3xl text-ink">{ui.game.title}</h2>
        <p className="relative mt-1 font-body text-sm font-semibold text-ink/70">
          {ui.game.subtitle}
        </p>
      </header>

      {/* Progress */}
      <div className="mx-auto mt-5 max-w-[360px]">
        <div className="ink-outline relative h-6 overflow-hidden rounded-full bg-paper">
          <motion.div
            className="h-full bg-lime"
            initial={false}
            animate={{ width: `${(game.count / game.total) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
          <span className="absolute inset-0 flex items-center justify-center font-display text-sm text-ink">
            {game.count} / {game.total}
          </span>
        </div>
      </div>

      {/* Stamp grid */}
      <div className="mx-auto mt-6 grid max-w-[360px] grid-cols-3 gap-3">
        {gameTargets.map((booth, i) => (
          <StampBox
            key={booth.id}
            booth={booth}
            index={i}
            collected={game.collectedIds.has(booth.id)}
            justCollected={justCollectedId === booth.id}
            onTap={() => setSelectedId(booth.id)}
          />
        ))}
      </div>

      {/* Encouragement / status — fills the section so it never reads empty */}
      <div className="mx-auto mt-6 max-w-[360px] text-center">
        <p className="font-display text-lg text-ink">
          {remaining === 0 ? ui.game.allFound : ui.game.toGo(remaining)}
        </p>
        <p className="mt-1 font-body text-sm text-ink/70">{ui.game.wander}</p>
      </div>

      {/* How it works strip */}
      <div className="mx-auto mt-6 grid max-w-[360px] grid-cols-3 gap-3">
        {[
          { icon: "👀", label: ui.game.howTap },
          { icon: "📷", label: ui.game.howScan },
          { icon: "⭐", label: ui.game.howCollect },
        ].map((s) => (
          <div
            key={s.label}
            className="ink-outline rounded-2xl bg-paper/80 px-2 py-3 text-center"
          >
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-1 font-body text-[11px] font-semibold leading-tight text-ink/70">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-8 flex max-w-[360px] items-end justify-between">
        <p className="max-w-[200px] font-body text-xs text-ink/50">
          {ui.game.offline}
        </p>
        {/* one accent in the otherwise-bare lower area */}
        <Star className="w-12 shrink-0 opacity-80" color="#8CFF3D" />
      </div>

      {/* Subtle testing-phase reset (back to the username gate) */}
      <div className="mx-auto mt-5 max-w-[360px] text-center">
        <button
          onClick={handleReset}
          className="font-body text-[11px] text-ink/35 underline underline-offset-2"
        >
          {ui.session.reset}
        </button>
      </div>

      {/* Hint bottom sheet */}
      <AnimatePresence>
        {selected && (
          <HintSheet
            booth={selected}
            index={gameTargets.findIndex((b) => b.id === selected.id)}
            collected={game.collectedIds.has(selected.id)}
            onScan={() => { setSelectedId(null); setScanning(true); }}
            onClose={() => setSelectedId(null)}
            onDevScan={handleScanResult}
          />
        )}
      </AnimatePresence>

      {/* Camera scanner */}
      <AnimatePresence>
        {scanning && (
          <Scanner onResult={handleScanResult} onClose={() => setScanning(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
