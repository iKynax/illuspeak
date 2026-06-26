import { useEffect, useRef, useState } from "react";
import { BottomTabBar, type Tab } from "./components/BottomTabBar";
import { PlayButton } from "./components/PlayButton";
import { LangToggle } from "./components/LangToggle";
import { RainbowSpine } from "./components/RainbowSpine";
import { Hero } from "./sections/Hero";
import { MapSection } from "./sections/MapSection";
import { MiniGame } from "./sections/MiniGame";
import { About } from "./sections/About";
import { useGame } from "./game/useGame";
import { parseQrPayload } from "./lib/qr";
import { Toast, type ToastData } from "./components/Toast";
import { useUI } from "./i18n/lang";

export default function App() {
  const [tab, setTab] = useState<Tab>("main");
  const game = useGame();
  const gameRef = useRef<HTMLDivElement>(null);
  const ui = useUI();
  const [toast, setToast] = useState<ToastData | null>(null);

  function scrollToGame() {
    gameRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Native-camera deep link: a scanned QR opens <site>/?s=<payload>. Read it on
  // load, verify + auto-collect the stamp, surface a toast, then strip the param
  // so a refresh doesn't re-trigger. Works before a username is set — collect
  // persists progress regardless. Order-independent.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("s");
    if (!s) return;

    // Strip ?s= from the URL immediately so a refresh can't re-trigger.
    const url = new URL(window.location.href);
    url.searchParams.delete("s");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);

    // Defer the collect + UI updates out of the effect body (no synchronous
    // setState in an effect) — runs once on mount.
    const timer = setTimeout(() => {
      const parsed = parseQrPayload(s);
      let message: string;
      let tone: ToastData["tone"];
      if (!parsed.ok) {
        message =
          parsed.reason === "foreign" ? ui.game.toastForeign : ui.game.toastInvalid;
        tone = "bad";
      } else {
        const result = game.collect(parsed.boothId);
        if (result.status === "duplicate") {
          message = ui.game.toastDuplicate;
          tone = "info";
        } else if (result.status === "not-a-target") {
          message = ui.game.toastNotTarget;
          tone = "info";
        } else {
          message = ui.game.toastCollected;
          tone = "good";
        }
      }
      setTab("main");
      setToast({ id: Date.now(), message, tone });
      setTimeout(() => setToast(null), 3000);
      setTimeout(scrollToGame, 200);
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto min-h-[100svh] max-w-[430px] bg-paper">
      <Toast toast={toast} />

      {tab === "main" ? (
        <main className="relative isolate">
          {/* Scroll-driven rainbow: weaves over the hero wash (-z-10 backdrop)
              and behind the translucent map/game washes. isolate keeps the
              negative-z hero backdrop contained to this stacking context. */}
          <RainbowSpine />
          <Hero onStart={scrollToGame} />
          <MapSection />
          <div id="minigame" ref={gameRef}>
            <MiniGame game={game} />
          </div>
        </main>
      ) : (
        <main>
          <About />
        </main>
      )}

      {/* Top-right controls pinned to the content column. The frame is
          click-through; the controls re-enable taps. z-30 keeps them below the
          tab bar / sheets / scanner. The language toggle shows on every tab; the
          peeking characters + play button are scoped to the main page. */}
      <div className="pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2">
        {/* Subtle EN/中 toggle — left of the play button on the main tab. */}
        <LangToggle className={tab === "main" ? "right-[4.75rem]" : "right-3"} />
        {tab === "main" && <PlayButton />}
      </div>

      <BottomTabBar active={tab} onChange={setTab} />
    </div>
  );
}
