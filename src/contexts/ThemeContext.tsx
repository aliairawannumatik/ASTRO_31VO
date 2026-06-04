import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light" | "white" | "forest" | "ocean" | "sunset";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_THEMES: Theme[] = ["dark", "ocean", "sunset"];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("numatik-theme");
    const valid: Theme[] = ["dark", "light", "white", "forest", "ocean", "sunset"];
    return valid.includes(saved as Theme) ? (saved as Theme) : "dark";
  });

  useEffect(() => {
    localStorage.setItem("numatik-theme", theme);

    const root = document.documentElement;

    // data-theme attribute — drives CSS variable blocks in index.css
    root.setAttribute("data-theme", theme);

    // Legacy class system — kept for backward compat with existing Tailwind conditionals
    root.classList.remove("light-mode", "theme-white", "theme-ocean", "theme-forest", "theme-sunset");
    if (!DARK_THEMES.includes(theme)) {
      root.classList.add("light-mode");
    }
    if (theme === "white")  root.classList.add("theme-white");
    if (theme === "ocean")  root.classList.add("theme-ocean");
    if (theme === "forest") root.classList.add("theme-forest");
    if (theme === "sunset") root.classList.add("theme-sunset");
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => prev === "dark" ? "light" : "dark");
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
