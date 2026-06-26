import { motion } from "motion/react";
import { useUI } from "../i18n/lang";

export type Tab = "main" | "about";

interface BottomTabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  const ui = useUI();
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "main", label: ui.tabs.play, icon: "✦" },
    { id: "about", label: ui.tabs.about, icon: "♥" },
  ];
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pt-2">
      <div className="ink-outline shadow-sticker flex w-full max-w-[430px] items-center gap-2 rounded-full bg-paper p-1.5">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-full py-2.5"
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-hotpink"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 font-display text-lg tracking-wide ${
                  isActive ? "text-paper" : "text-ink"
                }`}
              >
                {tab.icon} {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
