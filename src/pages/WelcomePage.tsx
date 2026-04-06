import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import SpaceObjects from "@/components/SpaceObjects";
import ExitDialog from "@/components/ExitDialog";
import { spaceBg } from "@/assets/placeholder";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${
        isLight ? "gradient-snow" : ""
      }`}
    >
      {/* Background — space image only in dark mode */}
      {!isLight && (
        <>
          <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/40" />
        </>
      )}

      {/* Space objects only in dark mode */}
      {!isLight && <SpaceObjects />}

      {/* Starfield (dark) or Snowfall (light) */}
      <Starfield />

      {/* Exit button — top right */}
      <div
        className="fixed right-0 top-0 z-50 p-4"
        style={{
          paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        }}
      >
        <ExitDialog />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center w-full max-w-2xl flex flex-col items-center px-4 py-16 sm:px-6">

        {/* Welcome text */}
        <p
          className={`font-display text-2xl sm:text-3xl font-bold tracking-widest mb-6 animate-fade-in ${
            isLight ? "text-cyan-500" : "text-cyan-400"
          }`}
        >
          Selamat Datang di Aplikasi
        </p>

        {/* Main title */}
        <h1
          className={`font-display text-5xl sm:text-7xl font-black mb-8 drop-shadow-lg ${
            isLight ? "text-cyan-500" : "text-yellow-400"
          }`}
          style={
            isLight
              ? { textShadow: "0 0 24px rgba(6,182,212,0.5), 0 0 48px rgba(14,165,233,0.35), 0 2px 8px rgba(6,182,212,0.25)" }
              : { textShadow: "0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.3), 0 0 60px rgba(59,130,246,0.2)" }
          }
        >
          NUMATIK
        </h1>

        {/* Subtitle */}
        <p
          className={`font-display text-sm sm:text-base font-semibold mb-12 leading-relaxed ${
            isLight ? "text-slate-400" : "text-cyan-300"
          }`}
        >
          Numerasi Aktif dengan Teknologi<br />Informasi dan Komunikasi
        </p>

        {/* Main button */}
        <div className="relative mb-16">
          <div
            className={`absolute inset-0 rounded-2xl blur-xl opacity-50 animate-button-pulse ${
              isLight
                ? "bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400"
                : "bg-gradient-to-r from-cyan-500 to-blue-600"
            }`}
          />
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className={`relative font-display text-xl sm:text-2xl px-12 py-6 rounded-2xl font-bold tracking-widest shadow-2xl transition-all duration-300 cursor-pointer animate-button-pulse text-white border-2 active:scale-95 ${
              isLight
                ? "bg-gradient-to-r from-indigo-500 via-cyan-400 to-sky-400 border-cyan-200 hover:border-white hover:shadow-cyan-300/60"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-300 hover:border-cyan-200 hover:shadow-cyan-500/50"
            }`}
          >
            🚀 MULAI
          </button>
        </div>

        {/* Sun (dark mode) or Crystal Ball (light mode) */}
        <div className="mt-8 mb-12">
          <div className="relative w-28 h-28 mx-auto">
            {isLight ? (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-300 opacity-30 blur-2xl animate-pulse scale-125" />
                <img
                  src="/salju.png"
                  alt="Salju"
                  className="relative w-28 h-28 mx-auto object-contain animate-rotate-slow drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 0 16px rgba(147,197,253,0.8)) drop-shadow(0 0 32px rgba(59,130,246,0.4))" }}
                />
              </>
            ) : (
              <>
                <div className="absolute inset-0 rounded-full bg-orange-400 opacity-30 blur-2xl animate-pulse scale-125" />
                <img
                  src="/sun.png"
                  alt="Matahari"
                  className="relative w-28 h-28 mx-auto object-contain animate-rotate-slow drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 0 16px rgba(251,146,60,0.8)) drop-shadow(0 0 32px rgba(234,88,12,0.4))" }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Marquee text */}
      <div
        className={`absolute bottom-8 left-0 right-0 z-20 overflow-hidden border-t backdrop-blur-sm py-4 ${
          isLight
            ? "bg-white/60 border-cyan-200/50"
            : "bg-background/60 border-cyan-500/30"
        }`}
      >
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className={`font-body font-semibold inline-block px-8 ${
                isLight ? "text-indigo-400" : "text-cyan-300"
              }`}
            >
              ✨ APLIKASI MULTIMEDIA PEMBELAJARAN INTERAKTIF MATEMATIKA SMP ✨
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
