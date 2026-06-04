import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { Gamepad2, BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const topics = [
  { label: "POLA BILANGAN", path: "/math-game-arena/kelas-8/pola-bilangan" },
  { label: "KOORDINAT KARTESIUS", path: "/math-game-arena/kelas-8/koordinat-cartesius" },
  { label: "RELASI DAN FUNGSI", path: "/math-game-arena/kelas-8/relasi-dan-fungsi" },
  { label: "SISTEM PERSAMAAN LINEAR DUA VARIABEL", path: "/math-game-arena/kelas-8/spldv" },
  { label: "PERSAMAAN GARIS LURUS", path: "/math-game-arena/kelas-8/persamaan-garis-lurus" },
  { label: "TEOREMA PYTHAGORAS", path: "/math-game-arena/kelas-8/teorema-pythagoras" },
  { label: "LINGKARAN", path: "/math-game-arena/kelas-8/lingkaran" },
  { label: "GARIS SINGGUNG LINGKARAN", path: "/math-game-arena/kelas-8/garis-singgung-lingkaran" },
  { label: "BANGUN RUANG SISI DATAR", path: "/math-game-arena/kelas-8/bangun-ruang-sisi-datar" },
];

const MathGameArenaKelas8Page = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light" || theme === "white";
  const isWhite = theme === "white";

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/math-game-arena" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Gamepad2 className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MATH GAME ARENA - KELAS 8
        </h1>
        <p className={`text-xs text-center mb-6 font-body ${isWhite ? "text-gray-400" : "text-white/50"}`}>Pilih topik untuk bermain</p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topics.map((topic, i) => (
            <button
              key={topic.label}
              onClick={() => { playPopSound(); navigate(topic.path); }}
              className={`group flex items-center gap-4 bg-card/80 border border-border rounded-xl px-5 py-4
                hover:border-primary/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up ${!isWhite ? "backdrop-blur" : ""}`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <BookOpen className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <span className={`font-body text-sm ${isWhite ? "text-gray-800" : "text-white"}`}>{topic.label}</span>
              <span className="ml-auto text-xs text-primary font-display font-bold">MAIN →</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/math-game-arena"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Math Game Arena
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathGameArenaKelas8Page;
