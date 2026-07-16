import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import i18n from "@/i18n";

export type Language = "id" | "en" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasChosenLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "numatik_language";
const VALID_LANGS: Language[] = ["id", "en", "ja"];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const urlParam = new URLSearchParams(window.location.search).get("lang") as Language | null;
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial: Language = VALID_LANGS.includes(urlParam as Language) ? (urlParam as Language) : VALID_LANGS.includes(saved as Language) ? (saved as Language) : "id";
  const resolved: Language = initial;

  const [language, setLangState] = useState<Language>(resolved);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(!!saved);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLangState(lang);
    setHasChosenLanguage(true);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, hasChosenLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
