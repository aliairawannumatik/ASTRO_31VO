import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import SpaceObjects from "@/components/SpaceObjects";
import ExitDialog from "@/components/ExitDialog";
import ThemePickerModal from "@/components/ThemePickerModal";
import LanguagePickerModal from "@/components/LanguagePickerModal";
import { spaceBg } from "@/assets/placeholder";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { hasChosenLanguage } = useLanguage();
  const isLight = ["light", "white", "forest", "sunset"].includes(theme);
  const isSunset = theme === "sunset";
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleThemeContinue = () => {
    setShowThemePicker(false);
    if (hasChosenLanguage) {
      navigate("/menu");
    } else {
      setShowLangPicker(true);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${
        isSunset ? "gradient-sunset" : isLight ? "gradient-snow" : ""
      }`}
    >
      {!isLight && (
        <>
          <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/40" />
        </>
      )}

      {!isLight && <SpaceObjects />}

      <Starfield />

      <div
        className="fixed right-0 top-0 z-50 p-4"
        style={{
          paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        }}
      >
        <ExitDialog />
      </div>

      <div className="relative z-10 text-center w-full max-w-2xl flex flex-col items-center px-4 py-16 sm:px-6">

        <p
          className={`font-display text-2xl sm:text-3xl font-bold tracking-widest mb-6 animate-fade-in ${
            isLight ? "" : "text-cyan-400"
          }`}
          style={isLight ? { color: "var(--text-primary)" } : undefined}
        >
          {t("welcome")}
        </p>

        <h1
          className={`font-display text-5xl sm:text-7xl font-black mb-8 drop-shadow-lg ${
            isSunset ? "text-yellow-400" : isLight ? "text-cyan-500" : "text-yellow-400"
          }`}
          style={
            isSunset
              ? { textShadow: "0 0 16px rgba(253,224,71,0.9), 0 0 32px rgba(250,204,21,0.8), 0 0 60px rgba(234,179,8,0.6), 0 0 90px rgba(234,179,8,0.35)" }
              : isLight
              ? { textShadow: "0 0 24px rgba(6,182,212,0.5), 0 0 48px rgba(14,165,233,0.35), 0 2px 8px rgba(6,182,212,0.25)" }
              : { textShadow: "0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.3), 0 0 60px rgba(59,130,246,0.2)" }
          }
        >
          {t("appName")}
        </h1>

        <p
          className={`font-display text-sm sm:text-base font-semibold mb-12 leading-relaxed ${
            isLight ? "" : "text-cyan-300"
          }`}
          style={isLight ? { color: "var(--text-primary)" } : undefined}
        >
          {t("subtitle").split("\n").map((line: string, i: number) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </p>

        <div className="relative mb-10 animate-fade-in">
          <div
            className="absolute inset-0 rounded-full blur-lg opacity-60"
            style={{
              background: isSunset
                ? "linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b)"
                : isLight
                ? "linear-gradient(90deg, #6366f1, #06b6d4, #6366f1)"
                : "linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6)",
            }}
          />
          <div
            className="relative flex items-center gap-3 px-6 py-3 rounded-full font-display font-bold text-sm sm:text-base tracking-widest text-white border"
            style={{
              background: isSunset
                ? "linear-gradient(90deg, rgba(245,158,11,0.25), rgba(239,68,68,0.25), rgba(245,158,11,0.25))"
                : isLight
                ? "linear-gradient(90deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2), rgba(99,102,241,0.2))"
                : "linear-gradient(90deg, rgba(139,92,246,0.25), rgba(6,182,212,0.25), rgba(139,92,246,0.25))",
              borderColor: isSunset
                ? "rgba(245,158,11,0.6)"
                : isLight
                ? "rgba(99,102,241,0.5)"
                : "rgba(139,92,246,0.6)",
              boxShadow: isSunset
                ? "inset 0 1px 0 rgba(255,255,255,0.15)"
                : "inset 0 1px 0 rgba(255,255,255,0.1)",
              color: isSunset
                ? "#fde68a"
                : isLight
                ? "#4f46e5"
                : "#c4b5fd",
            }}
          >
            <span className="text-base">🗓️</span>
            <span>{t("schoolYear")}</span>
            <span className="text-base">🗓️</span>
          </div>
        </div>

        <div className="relative mb-16">
          <div
            className={`absolute inset-0 rounded-2xl blur-xl opacity-50 animate-button-pulse ${
              isLight
                ? "bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400"
                : "bg-gradient-to-r from-cyan-500 to-blue-600"
            }`}
          />
          <button
            onClick={() => { playPopSound(); setShowThemePicker(true); }}
            className={`relative font-display text-xl sm:text-2xl px-12 py-6 rounded-2xl font-bold tracking-widest shadow-2xl transition-all duration-300 cursor-pointer animate-button-pulse text-white border-2 active:scale-95 ${
              isLight
                ? "bg-gradient-to-r from-indigo-500 via-cyan-400 to-sky-400 border-cyan-200 hover:border-white hover:shadow-cyan-300/60"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-300 hover:border-cyan-200 hover:shadow-cyan-500/50"
            }`}
          >
            {t("start")}
          </button>
        </div>

        <div className="mt-8 mb-12">
          <div className="relative w-28 h-28 mx-auto" style={{ overflow: "visible" }}>
            {isSunset ? (
              <>
                <div className="absolute rounded-full animate-pulse" style={{
                  inset: "-28px",
                  background: "radial-gradient(circle, rgba(255,255,240,0.52) 22%, rgba(255,230,80,0.22) 52%, transparent 72%)"
                }} />
                <div className="absolute rounded-full animate-rotate-slow" style={{
                  inset: "-10px",
                  background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,252,200,0.55) 5deg, transparent 10deg, transparent 40deg, rgba(255,252,200,0.55) 45deg, transparent 50deg, transparent 85deg, rgba(255,252,200,0.55) 90deg, transparent 95deg, transparent 130deg, rgba(255,252,200,0.55) 135deg, transparent 140deg, transparent 175deg, rgba(255,252,200,0.55) 180deg, transparent 185deg, transparent 220deg, rgba(255,252,200,0.55) 225deg, transparent 230deg, transparent 265deg, rgba(255,252,200,0.55) 270deg, transparent 275deg, transparent 310deg, rgba(255,252,200,0.55) 315deg, transparent 320deg)",
                  filter: "blur(4px)"
                }} />
                <div className="absolute rounded-full" style={{
                  inset: "4px",
                  background: "radial-gradient(circle at 38% 32%, #ffffff 0%, #fffde7 26%, #fff9c4 50%, #ffd740 80%)",
                  boxShadow: "0 0 10px #fff, 0 0 24px rgba(255,252,180,1), 0 0 50px rgba(255,228,80,0.85), 0 0 85px rgba(255,200,40,0.60), 0 0 130px rgba(255,165,0,0.35)"
                }} />
              </>
            ) : isLight ? (
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

      <ThemePickerModal
        open={showThemePicker}
        onClose={() => setShowThemePicker(false)}
        onContinue={handleThemeContinue}
      />
      <LanguagePickerModal
        open={showLangPicker}
        onClose={() => setShowLangPicker(false)}
      />

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
              {t("marquee")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
