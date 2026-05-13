import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { Gamepad2, Car, Layers, Zap, Rocket, ShoppingBasket, Worm, Crosshair, Sparkles, Hammer, Fish, Swords, Shield, Gem, Trophy, Waves, ChevronsUp, Sword, Plane, Circle, Target, Disc } from "lucide-react";
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
  {
    label: "Cosmic Fury",
    emoji: "🌌",
    path: "/math-game-arena/umum/asteroid-blaster",
    desc: "Tembak pesawat musuh beserta rajanya dan jawablah pertanyaan matematika yang muncul",
    icon: <Crosshair className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Pop Soal!",
    emoji: "🫧",
    path: "/math-game-arena/umum/bubble-pop",
    desc: "Gelembung warna-warni naik ke atas! Klik jawaban yang benar sebelum kabur!",
    icon: <Sparkles className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Hajar Mol!",
    emoji: "🔨",
    path: "/math-game-arena/umum/hajar-mol",
    desc: "Mol neon naik membawa angka! Hajar mol yang punya jawaban benar sebelum kabur!",
    icon: <Hammer className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Mancing Soal!",
    emoji: "🎣",
    path: "/math-game-arena/umum/mancing-soal",
    desc: "Ikan-ikan neon berenang membawa angka! Klik ikan dengan jawaban benar sebelum kabur!",
    icon: <Fish className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Tembak Tank!",
    emoji: "🪖",
    path: "/math-game-arena/umum/tembak-tank",
    desc: "Tankmu vs tank-tank musuh! Tembak tank yang membawa jawaban benar, hindari serangan balik!",
    icon: <Shield className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Kereta Koin Math",
    emoji: "🚆",
    path: "/math-game-arena/umum/kereta-koin-math",
    desc: "Pindah jalur untuk mengambil koin jawaban benar, kumpulkan combo, dan hindari bom neon!",
    icon: <Gem className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Ninja Buah Math",
    emoji: "🍉",
    path: "/math-game-arena/umum/ninja-buah-math",
    desc: "Iris buah yang membawa jawaban benar sebelum jatuh, kumpulkan combo, dan jangan kena bom!",
    icon: <Sparkles className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Pulau Harta Math",
    emoji: "🏝️",
    path: "/math-game-arena/umum/pulau-harta-math",
    desc: "Kemudikan kapal ke peti jawaban benar, kumpulkan harta, combo, dan hindari bom laut!",
    icon: <Trophy className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Kapal Selam Math Battle",
    emoji: "🚢",
    path: "/math-game-arena/umum/kapal-selam-math-battle",
    desc: "Tembak pesawat pembom di atas dan kapal selam musuh dari kiri-kanan dengan torpedo!",
    icon: <Waves className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Lompat Jawaban",
    emoji: "🪐",
    path: "/math-game-arena/umum/lompat-jawaban",
    desc: "Kendalikan astronot neon! Lompat ke platform dengan jawaban benar, double jump, dan kejar combo!",
    icon: <ChevronsUp className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Ksatria Matematika",
    emoji: "⚔️",
    path: "/math-game-arena/umum/ksatria-mat",
    desc: "RPG petualangan epik! Lawan slime, goblin, kerangka & naga boss lewat 3 lantai dengan jawab soal!",
    icon: <Sword className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Space Impact Math",
    emoji: "🛩️",
    path: "/math-game-arena/umum/space-impact",
    desc: "Tembak musuh yang membawa jawaban benar! Kumpulkan power-up, hadapi gelombang musuh luar angkasa!",
    icon: <Plane className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Meteor Pantul NUMATIK",
    emoji: "🛸☄️",
    path: "/math-game-arena/umum/pecah-jawaban",
    desc: "Game Meteor! Pantulkan meteor ke kristal yang membawa jawaban benar untuk menghancurkannya!",
    icon: <Swords className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Pacman Math",
    emoji: "👾",
    path: "/math-game-arena/umum/pacman-math",
    desc: "Makan semua titik di labirin! Temukan pelet warna jawaban BENAR untuk skor besar & hantu ketakutan!",
    icon: <Gamepad2 className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Zuma Math",
    emoji: "🔮",
    path: "/math-game-arena/umum/zuma-math",
    desc: "Tembak bola warna dari meriam! Cocokkan 3+ bola warna yang sama. Warna jawaban benar = BONUS besar!",
    icon: <Sparkles className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Bounce Math",
    emoji: "🎱",
    path: "/math-game-arena/umum/bounce-math",
    desc: "Bola-bola neon memantul ke mana-mana! Klik bola yang membawa jawaban benar sebelum kabur!",
    icon: <Circle className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Western Bar Math",
    emoji: "🤠",
    path: "/math-game-arena/umum/western-bar",
    desc: "Tembak botol & kaleng di bar koboi! Bidik target dengan jawaban benar sebelum mereka kabur!",
    icon: <Target className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    badge: "BARU",
  },
  {
    label: "Pinball Math",
    emoji: "🎰",
    path: "/math-game-arena/umum/pinball-math",
    desc: "Pinball neon seru! Pantulkan bola ke bumper jawaban benar, gunakan flipper kiri & kanan!",
    icon: <Disc className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
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
              style={{ animationDelay: `${i * 0.08}s` }}
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
