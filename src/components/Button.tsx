import { motion } from "motion/react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

const variants: Record<Variant, string> = {
  // Hot pink earns its place on the main action.
  primary: "bg-hotpink text-paper",
  secondary: "bg-blue text-ink",
  ghost: "bg-paper text-ink",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.94, y: 2, boxShadow: "2px 2px 0 #2A2140" }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
      className={`ink-outline shadow-sticker inline-flex min-h-[48px] items-center justify-center rounded-full px-6 py-3 font-display text-lg tracking-wide disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
