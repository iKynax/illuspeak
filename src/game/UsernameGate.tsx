import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { FloatingMascot } from "../components/FloatingMascot";
import { useUI } from "../i18n/lang";

interface UsernameGateProps {
  onSubmit: (name: string) => void;
}

const MAX_LEN = 18;

export function UsernameGate({ onSubmit }: UsernameGateProps) {
  const [value, setValue] = useState("");
  const ui = useUI();
  const clean = value.trim();
  const valid = clean.length >= 2 && clean.length <= MAX_LEN;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="ink-outline shadow-sticker-lg relative mx-auto max-w-[360px] rounded-3xl bg-paper px-6 pb-6 pt-8 text-center"
    >
      <FloatingMascot
        src="/assets/mascot-ghost.webp"
        className="absolute -right-4 -top-12 w-24"
        duration={3.6}
      />
      <h2 className="font-display text-3xl text-ink">{ui.gate.title}</h2>
      <p className="mt-1 font-body text-sm text-ink/70">{ui.gate.subtitle}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit(clean);
        }}
        className="mt-5"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LEN))}
          placeholder={ui.gate.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="ink-outline w-full rounded-2xl bg-blue/50 px-4 py-3 text-center font-display text-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-hotpink/40"
        />
        <p className="mt-1 h-4 font-body text-xs text-ink/50">
          {clean.length > 0 && !valid ? ui.gate.validation : " "}
        </p>
        <Button type="submit" variant="primary" disabled={!valid} className="mt-2 w-full">
          {ui.gate.submit}
        </Button>
      </form>
    </motion.div>
  );
}
