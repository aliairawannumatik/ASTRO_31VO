import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light" | "white" | "forest" | "ocean" | "sunset";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_THEMES: Theme[] = ["dark", "ocean"];
const VALID_THEMES: Theme[] = ["dark", "light", "white", "forest", "ocean", "sunset"];
const STORAGE_KEY = "numatik-theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Initial load from localStorage — sets data-theme on <html> before first paint
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || "dark";
    const resolved = VALID_THEMES.includes(saved as Theme) ? (saved as Theme) : "dark";
    applyTheme(resolved);
    setThemeState(resolved);
  }, []);

  // Apply theme whenever state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (t: Theme) => {
    const html = document.documentElement;
    // data-theme drives all CSS variable blocks in index.css
    html.setAttribute("data-theme", t);
    localStorage.setItem(STORAGE_KEY, t);

    // Legacy class system — kept for backward compat with existing Tailwind conditionals
    html.classList.remove("light-mode", "theme-white", "theme-ocean", "theme-forest", "theme-sunset");
    if (!DARK_THEMES.includes(t)) html.classList.add("light-mode");
    if (t === "white")  html.classList.add("theme-white");
    if (t === "ocean")  html.classList.add("theme-ocean");
    if (t === "forest") html.classList.add("theme-forest");
    if (t === "sunset") html.classList.add("theme-sunset");
  };

  const setTheme = (t: Theme) => setThemeState(t);

  // Reads directly from document.documentElement — always in sync with real DOM state
  const toggleTheme = () => {
    const html = document.documentElement;
    const isLight = html.getAttribute("data-theme") === "light";
    const next: Theme = isLight ? "dark" : "light";
    setThemeState(next);
  };

  const isDark = DARK_THEMES.includes(theme);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
