import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { Gamepad2, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const MathGameArenaPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isLight = theme === "light";

  const kelasOptions = [
    { labelKey: "kelas7Label", path: "/math-game-arena/kelas-7", descKey: "kelas7Desc" },
    { labelKey: "kelas8Label", path: "/math-game-arena/kelas-8", descKey: "kelas8Desc" },
    { labelKey: "kelas9Label", path: "/math-game-arena/kelas-9", descKey: "kelas9Desc" },
  ];

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Gamepad2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MATH GAME ARENA
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          {t('gameArena.subtitle')}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {kelasOptions.map((kelas, i) => (
            <button
              key={kelas.labelKey}
              onClick={() => {
                playPopSound();
                navigate(kelas.path);
              }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-6 py-5
                hover:border-accent/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <GraduationCap className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-display text-lg text-white">{t(`gameArena.${kelas.labelKey}`)}</span>
                <span className="font-body text-xs text-white/50">{t(`gameArena.${kelas.descKey}`)}</span>
              </div>
              <span className="ml-auto text-xs text-accent font-display">{t('gameArena.playBtn')}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('gameArena.backToMenu')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathGameArenaPage;
