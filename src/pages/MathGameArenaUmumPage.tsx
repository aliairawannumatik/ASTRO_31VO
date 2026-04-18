import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { Gamepad2, Car, Layers, Zap, Rocket, ShoppingBasket, Worm } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const games = [
  {
    label: "Balap Mobil Matematika",
    emoji: "🏎️",
    path: "/math-game-arena/umum/balap-mobil",
    desc: "Jawab soal untuk mendapatkan turbo boost dan menangkan balapan!",
    icon: <Car className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Tetris Numatik",
    emoji: "🧩",
    path: "/math-game-arena/umum/tetris",
    desc: "Susun blok warna-warni, kumpulkan skor tertinggi dan naiki level!",
    icon: <Layers className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Lari Matematika",
    emoji: "🦕",
    path: "/math-game-arena/umum/dino-run",
    desc: "Loncat dan tiarap hindari rintangan! Jawab soal untuk bonus skor!",
    icon: <Zap className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Flappy Rocket",
    emoji: "🚀",
    path: "/math-game-arena/umum/flappy-rocket",
    desc: "Terbangkan roket melewati gerbang neon! Gerbang emas = soal bonus + perisai!",
    icon: <Rocket className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Tangkap Benda!",
    emoji: "🧺",
    path: "/math-game-arena/umum/tangkap-benda",
    desc: "Gerakkan keranjang kiri-kanan! Tangkap semua benda, jangan ada yang terlewat!",
    icon: <ShoppingBasket className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Snake Matematika",
    emoji: "🐍",
    path: "/math-game-arena/umum/snake-math",
    desc: "Arahkan ular ke jawaban yang benar! Salah → memendek, makin benar → makin cepat!",
    icon: <Worm className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
];

const MathGameArenaUmumPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/math-game-arena" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Gamepad2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          GAME ARENA — UMUM
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Game seru untuk semua tingkatan!
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {games.map((game, i) => (
            <button
              key={game.path}
              onClick={() => {
                playPopSound();
                navigate(game.path);
              }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-6 py-5
                hover:border-accent/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {game.icon}
              <div className="flex flex-col flex-1">
                <span className="font-display text-lg text-white">{game.emoji} {game.label}</span>
                <span className="font-body text-xs text-white/50 mt-1">{game.desc}</span>
              </div>
              {game.badge && (
                <span className="bg-accent text-black text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                  {game.badge}
                </span>
              )}
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

export default MathGameArenaUmumPage;
