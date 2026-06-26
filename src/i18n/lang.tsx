import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { UI, type Lang, type UIStrings } from "./ui";

// Lightweight i18n — no library (CLAUDE.md: lean deps). A context holds the
// active language; useUI() returns the matching string table; loc() picks a
// field off a bilingual data value. Choice persists in localStorage.

const STORAGE_KEY = "illuspeak_lang";

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "zh") return v;
  } catch {
    /* private mode / no storage — fall through */
  }
  return "en";
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }

  function toggle() {
    setLang(lang === "en" ? "zh" : "en");
  }

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}

// The active-language string table.
// eslint-disable-next-line react-refresh/only-export-components
export function useUI(): UIStrings {
  return UI[useLang().lang];
}

export type { Lang, UIStrings };
