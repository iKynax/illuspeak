import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { booths, type Booth } from "../data/booths";
import { BoothSheet } from "./BoothSheet";
import { stampVisual } from "../game/stamps";
import { FloatingMascot } from "../components/FloatingMascot";
import { Squiggle, Star } from "../components/Doodles";
import { useUI } from "../i18n/lang";

// Interactive booth map (PRD §5.2). Real GMBB L5 floor plan as the base layer
// (swap for the illustrated version later), pinch/pan via react-zoom-pan-pinch,
// tappable pins, bottom-sheet booth detail.
export function MapSection() {
  const [selected, setSelected] = useState<Booth | null>(null);
  const ui = useUI();

  return (
    <section className="relative overflow-hidden bg-lilac/50 px-5 pb-12 pt-12">
      <Squiggle className="absolute right-4 top-4 w-24 opacity-70" color="#FF3DAE" />

      {/* Hero->Map seam: the lime cat peeking in at the top */}
      <FloatingMascot
        src="/assets/critter-cat-lime.webp"
        className="absolute left-3 top-2 z-0 w-14 -rotate-3"
        duration={4.4}
      />
      {/* Balance the bottom-left snail with the bird-pencil on the opposite side */}
      <FloatingMascot
        src="/assets/critter-bird-pencil.webp"
        className="absolute bottom-6 right-3 z-0 w-16"
        duration={4.8}
        wobble={5}
      />

      <header className="relative text-center">
        <h2 className="font-display text-3xl text-ink">{ui.map.title}</h2>
        <p className="mt-1 font-body text-sm font-semibold text-ink/70">
          {ui.map.instructions}
        </p>
      </header>

      <div className="ink-outline shadow-sticker relative mx-auto mt-5 max-w-[400px] overflow-hidden rounded-3xl bg-paper">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          doubleClick={{ disabled: false, step: 0.8 }}
          wheel={{ step: 0.08 }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%" }}
          >
            <div className="relative w-full">
              <img
                src="/assets/floorplan.png"
                alt="GMBB Level 5 floor plan"
                className="block w-full select-none"
                draggable={false}
              />
              {/* halftone wash over the plan to fit the brand */}
              <div className="halftone pointer-events-none absolute inset-0 opacity-30" />

              {booths.map((b) => (
                <MapPin key={b.id} booth={b} onTap={() => setSelected(b)} />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 font-body text-xs font-semibold text-ink/70">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4" color="#FFE53D" /> {ui.map.legendTarget}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-ink bg-hotpink" />{" "}
          {ui.map.legendBooth}
        </span>
      </div>

      <FloatingMascot
        src="/assets/critter-snail-pink.webp"
        className="mt-2 ml-2 w-16"
        duration={5}
      />

      <AnimatePresence>
        {selected && (
          <BoothSheet booth={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function MapPin({ booth, onTap }: { booth: Booth; onTap: () => void }) {
  const v = stampVisual(booth.id);
  return (
    <motion.button
      onClick={onTap}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${booth.mapX}%`, top: `${booth.mapY}%` }}
      whileTap={{ scale: 0.85 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {booth.isGameTarget ? (
        <span
          className="ink-outline flex h-7 w-7 items-center justify-center rounded-full text-sm shadow-[2px_2px_0_#2A2140]"
          style={{ background: v.color }}
        >
          {v.emoji}
        </span>
      ) : (
        <span className="block h-4 w-4 rounded-full border-[3px] border-ink bg-hotpink shadow-[1px_1px_0_#2A2140]" />
      )}
    </motion.button>
  );
}
