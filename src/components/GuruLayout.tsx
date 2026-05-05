import { Outlet } from "react-router-dom";
import { Sun, Moon, MonitorCog } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

const GuruLayout = () => {
  const { setTheme, isDark } = useTheme();
  const isLight = !isDark;

  const handleToggle = () => {
    playPopSound();
    setTheme(isDark ? "white" : "dark");
  };

  return (
    <>
      {/* ── Theme toggle bar — fixed top-center, always visible, print-hidden ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] print:hidden no-print pt-2">
        <button
          onClick={handleToggle}
          aria-label={isLight ? "Ganti ke Tema Gelap" : "Ganti ke Tema Putih Bersih"}
          className={`
            group relative flex items-center gap-0 rounded-2xl overflow-hidden
            shadow-xl border-2 transition-all duration-300 cursor-pointer select-none
            active:scale-95
            ${isLight
              ? "border-slate-700 shadow-slate-900/60"
              : "border-amber-300/70 shadow-amber-200/40"
            }
          `}
          style={{ minWidth: 260 }}
        >
          {/* Left — Label section */}
          <div className={`
            flex items-center gap-2 px-3 py-2.5
            ${isLight ? "bg-slate-800 text-slate-300" : "bg-amber-50 text-slate-500"}
          `}>
            <MonitorCog className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-bold tracking-widest uppercase leading-none">
              Tampilan
            </span>
          </div>

          {/* Divider */}
          <div className={`w-px self-stretch ${isLight ? "bg-slate-600" : "bg-amber-200"}`} />

          {/* Right — Active theme + call to action */}
          <div className={`
            flex items-center gap-2 px-4 py-2.5 flex-1
            transition-colors duration-300
            ${isLight
              ? "bg-slate-700 group-hover:bg-slate-600 text-white"
              : "bg-white group-hover:bg-amber-50 text-slate-800"
            }
          `}>
            {isLight ? (
              <Moon className="w-4 h-4 shrink-0 text-cyan-400" />
            ) : (
              <Sun className="w-5 h-5 shrink-0 text-amber-500 animate-spin-slow" />
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold">
                {isLight ? "Tema Gelap" : "Tema Putih Bersih"}
              </span>
              <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-400"}`}>
                ketuk untuk berganti
              </span>
            </div>

            {/* Arrow indicator */}
            <svg
              className={`
                w-4 h-4 ml-auto shrink-0 transition-transform duration-300
                group-hover:translate-x-0.5
                ${isLight ? "text-slate-400" : "text-slate-400"}
              `}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Subtle attention ring on dark mode (shows when user hasn't switched yet) */}
          {!isLight && (
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-amber-300/50 animate-ping-slow" />
          )}
        </button>
      </div>

      <Outlet />
    </>
  );
};

export default GuruLayout;
