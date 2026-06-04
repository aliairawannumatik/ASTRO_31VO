import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { Gamepad2, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const kelasOptions = [
  { label: "KELAS 7", path: "/math-game-arena/kelas-7", desc: "Game matematika kelas 7 SMP" },
  { label: "KELAS 8", path: "/math-game-arena/kelas-8", desc: "Game matematika kelas 8 SMP" },
  { label: "KELAS 9", path: "/math-game-arena/kelas-9", desc: "Game matematika kelas 9 SMP" },
];

const MathGameArenaPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light" || theme === "white";
  const isWhite = theme === "white";

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Gamepad2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MATH GAME ARENA
        </h1>
        <p className={`text-sm text-center mb-8 font-body ${isWhite ? "text-gray-500" : "text-white/60"}`}>
          Pilih kelas untuk bermain game matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {kelasOptions.map((kelas, i) => (
            <button
              key={kelas.label}
              onClick={() => {
                playPopSound();
                navigate(kelas.path);
              }}
              className={`group flex items-center gap-4 bg-card/80 border border-border rounded-xl px-6 py-5
                hover:border-primary/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up ${!isWhite ? "backdrop-blur" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <GraduationCap className="w-8 h-8 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className={`font-display text-lg ${isWhite ? "text-gray-800" : "text-white"}`}>{kelas.label}</span>
                <span className={`font-body text-xs ${isWhite ? "text-gray-400" : "text-white/50"}`}>{kelas.desc}</span>
              </div>
              <span className="ml-auto text-xs text-primary font-display font-bold">MAIN →</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathGameArenaPage;
