import { useRef, useState } from "react";
import { BottomTabBar, type Tab } from "./components/BottomTabBar";
import { CornerCharacters } from "./components/CornerCharacters";
import { PlayButton } from "./components/PlayButton";
import { RainbowSpine } from "./components/RainbowSpine";
import { Hero } from "./sections/Hero";
import { MapSection } from "./sections/MapSection";
import { MiniGame } from "./sections/MiniGame";
import { About } from "./sections/About";
import { useGame } from "./game/useGame";

export default function App() {
  const [tab, setTab] = useState<Tab>("main");
  const game = useGame();
  const gameRef = useRef<HTMLDivElement>(null);

  function scrollToGame() {
    gameRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="mx-auto min-h-[100svh] max-w-[430px] bg-paper">
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

      {/* Peeking characters + jump-to-game button, scoped to the main page.
          A fixed, centered, column-width frame pins them to the CONTENT column's
          edges (not the viewport), so they hug the phone-width column on both
          mobile and desktop. z-30 keeps the group below the tab bar / sheets /
          scanner. The frame itself is click-through; the button re-enables taps. */}
      {tab === "main" && (
        <div className="pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2">
          <CornerCharacters />
          <PlayButton />
        </div>
      )}

      <BottomTabBar active={tab} onChange={setTab} />
    </div>
  );
}
