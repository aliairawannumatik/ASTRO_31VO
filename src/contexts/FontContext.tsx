import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FontKey =
  | "space-classic"
  | "space-grotesk"
  | "poppins"
  | "nunito"
  | "rajdhani"
  | "fredoka"
  | "quicksand"
  | "inter";

export interface FontOption {
  key: FontKey;
  label: string;
  description: string;
  displayFont: string;
  bodyFont: string;
  emoji: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    key: "space-classic",
    label: "Space Classic",
    description: "Font bawaan NUMATIK",
    displayFont: "'Orbitron'",
    bodyFont: "'Exo 2'",
    emoji: "🚀",
  },
  {
    key: "space-grotesk",
    label: "Space Grotesk",
    description: "Modern & luar angkasa",
    displayFont: "'Space Grotesk'",
    bodyFont: "'Space Grotesk'",
    emoji: "🌌",
  },
  {
    key: "poppins",
    label: "Poppins",
    description: "Bersih & kontemporer",
    displayFont: "'Poppins'",
    bodyFont: "'Poppins'",
    emoji: "✨",
  },
  {
    key: "nunito",
    label: "Nunito",
    description: "Ramah & mudah dibaca",
    displayFont: "'Nunito'",
    bodyFont: "'Nunito'",
    emoji: "😊",
  },
  {
    key: "rajdhani",
    label: "Rajdhani",
    description: "Tegas & teknis",
    displayFont: "'Rajdhani'",
    bodyFont: "'Rajdhani'",
    emoji: "⚡",
  },
  {
    key: "fredoka",
    label: "Fredoka",
    description: "Playful & menyenangkan",
    displayFont: "'Fredoka'",
    bodyFont: "'Nunito'",
    emoji: "🎉",
  },
  {
    key: "quicksand",
    label: "Quicksand",
    description: "Elegan & bulat",
    displayFont: "'Quicksand'",
    bodyFont: "'Quicksand'",
    emoji: "💫",
  },
  {
    key: "inter",
    label: "Inter",
    description: "Profesional & tajam",
    displayFont: "'Inter'",
    bodyFont: "'Inter'",
    emoji: "📐",
  },
];

interface FontContextType {
  fontKey: FontKey;
  setFont: (key: FontKey) => void;
  currentFont: FontOption;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [fontKey, setFontKey] = useState<FontKey>(() => {
    const saved = localStorage.getItem("numatik-font");
    const valid = FONT_OPTIONS.map(f => f.key);
    return valid.includes(saved as FontKey) ? (saved as FontKey) : "nunito";
  });

  const currentFont = FONT_OPTIONS.find(f => f.key === fontKey) || FONT_OPTIONS[0];

  useEffect(() => {
    localStorage.setItem("numatik-font", fontKey);
    document.documentElement.style.setProperty("--font-display", currentFont.displayFont);
    document.documentElement.style.setProperty("--font-body", currentFont.bodyFont);
  }, [fontKey, currentFont]);

  const setFont = (key: FontKey) => setFontKey(key);

  return (
    <FontContext.Provider value={{ fontKey, setFont, currentFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within FontProvider");
  }
  return context;
};
