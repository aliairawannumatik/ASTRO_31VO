import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light" | "white" | "forest" | "ocean" | "sunset";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void; // kept for backward compat
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// "dark" and "ocean" use dark UI variable set; all others use light
const DARK_THEMES: Theme[] = ["dark", "ocean"];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("numatik-theme");
    const valid: Theme[] = ["dark", "light", "white", "forest", "ocean", "sunset"];
    return valid.includes(saved as Theme) ? (saved as Theme) : "dark";
  });

  useEffect(() => {
    localStorage.setItem("numatik-theme", theme);
    // Apply CSS variable class
    document.documentElement.classList.remove("light-mode");
    if (!DARK_THEMES.includes(theme)) {
      document.documentElement.classList.add("light-mode");
    }
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
