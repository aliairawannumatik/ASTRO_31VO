import { Outlet } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

const GuruLayout = () => {
  const { theme, setTheme, isDark } = useTheme();

  const handleToggle = () => {
    playPopSound();
    if (isDark) {
      setTheme("white");
    } else {
      setTheme("dark");
    }
  };

  const isLight = !isDark;

  return (
    <>
      {/* ── Prominent theme toggle — fixed at top-center, always visible ── */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] no-print print:hidden">
        <button
          onClick={handleToggle}
          title={isLight ? "Ganti ke Tema Gelap" : "Ganti ke Tema Putih Bersih"}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
            shadow-lg border transition-all duration-300 select-none cursor-pointer
            ${isLight
              ? "bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:border-slate-500"
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-slate-200/60"
            }
          `}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 shrink-0" />
              <span>Tema Gelap</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Tema Putih Bersih</span>
            </>
          )}
        </button>
      </div>

      <Outlet />
    </>
  );
};

export default GuruLayout;
