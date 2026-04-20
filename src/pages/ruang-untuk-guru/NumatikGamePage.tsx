import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gamepad2,
  Car,
  Layers,
  Zap,
  Rocket,
  ShoppingBasket,
  Worm,
  Crosshair,
  Sparkles,
  Hammer,
  Fish,
  Swords,
  Shield,
  Gem,
  Waves,
  ChevronsUp,
  Sword,
  Plane,
  Circle,
  Target,
  Disc,
  GraduationCap,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const games = [
  {
    label: "Turtle Run Math",
    emoji: "🐢",
    path: "/math-game-arena/umum/dino-run",
    desc: "Loncat dan tiarap hindari rintangan! Jawab soal untuk bonus skor!",
    icon: <Zap className="w-7 h-7 text-green-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Flappy Rocket",
    emoji: "🚀",
    path: "/math-game-arena/umum/flappy-rocket",
    desc: "Terbangkan roket melewati gerbang neon! Gerbang emas = soal bonus!",
    icon: <Rocket className="w-7 h-7 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Shoot Tank",
    emoji: "💥",
    path: "/math-game-arena/umum/tembak-tank",
    desc: "Arahkan meriam dan hancurkan target dengan jawaban matematika!",
    icon: <Swords className="w-7 h-7 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Space Impact Math",
    emoji: "🛸",
    path: "/math-game-arena/umum/space-impact",
    desc: "Tembak alien yang membawa jawaban benar, kumpulkan power-up!",
    icon: <Plane className="w-7 h-7 text-cyan-300 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Ninja Buah Math",
    emoji: "🍉",
    path: "/math-game-arena/umum/ninja-buah-math",
    desc: "Iris buah jawaban benar sebelum jatuh, hindari bom, dan bangun combo!",
    icon: <Sword className="w-7 h-7 text-pink-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Balap Mobil Matematika",
    emoji: "🏎️",
    path: "/math-game-arena/umum/balap-mobil",
    desc: "Jawab soal untuk mendapatkan turbo boost dan menangkan balapan!",
    icon: <Car className="w-7 h-7 text-yellow-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Tetris Numatik",
    emoji: "🧩",
    path: "/math-game-arena/umum/tetris",
    desc: "Susun blok warna-warni, kumpulkan skor tertinggi dan naiki level!",
    icon: <Layers className="w-7 h-7 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Tangkap Benda!",
    emoji: "🧺",
    path: "/math-game-arena/umum/tangkap-benda",
    desc: "Gerakkan keranjang kiri-kanan! Tangkap semua benda yang benar!",
    icon: <ShoppingBasket className="w-7 h-7 text-orange-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Snake Matematika",
    emoji: "🐍",
    path: "/math-game-arena/umum/snake-math",
    desc: "Arahkan ular ke jawaban yang benar! Salah → memendek, benar → makin panjang!",
    icon: <Worm className="w-7 h-7 text-lime-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Asteroid Blaster",
    emoji: "🌌",
    path: "/math-game-arena/umum/asteroid-blaster",
    desc: "Tembak asteroid dengan jawaban benar! Hindari yang salah!",
    icon: <Crosshair className="w-7 h-7 text-violet-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Bubble Pop",
    emoji: "🫧",
    path: "/math-game-arena/umum/bubble-pop",
    desc: "Pecahkan gelembung jawaban benar sebelum sampai ke atas!",
    icon: <Sparkles className="w-7 h-7 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Hajar Mol!",
    emoji: "🔨",
    path: "/math-game-arena/umum/hajar-mol",
    desc: "Pukul mol yang muncul hanya ketika membawa jawaban yang benar!",
    icon: <Hammer className="w-7 h-7 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Mancing Soal",
    emoji: "🎣",
    path: "/math-game-arena/umum/mancing-soal",
    desc: "Pancing ikan dengan jawaban benar, jangan tangkap yang salah!",
    icon: <Fish className="w-7 h-7 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Pecah Jawaban",
    emoji: "🧱",
    path: "/math-game-arena/umum/pecah-jawaban",
    desc: "Pantulkan bola untuk menghancurkan blok jawaban benar!",
    icon: <Disc className="w-7 h-7 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Kereta Koin Math",
    emoji: "🚂",
    path: "/math-game-arena/umum/kereta-koin-math",
    desc: "Pindah jalur untuk menangkap koin jawaban benar dan hindari bom!",
    icon: <ChevronsUp className="w-7 h-7 text-yellow-300 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Pulau Harta Math",
    emoji: "🏝️",
    path: "/math-game-arena/umum/pulau-harta-math",
    desc: "Kemudikan kapal menangkap harta jawaban benar dan hindari bom!",
    icon: <Gem className="w-7 h-7 text-pink-300 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Kapal Selam Math Battle",
    emoji: "🌊",
    path: "/math-game-arena/umum/kapal-selam-math-battle",
    desc: "Tembak pesawat di atas dan kapal selam musuh dari kanan-kiri!",
    icon: <Waves className="w-7 h-7 text-blue-300 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Lompat Jawaban",
    emoji: "🦸",
    path: "/math-game-arena/umum/lompat-jawaban",
    desc: "Lompat ke platform jawaban benar, jatuh ke platform salah = nyawa berkurang!",
    icon: <ChevronsUp className="w-7 h-7 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Ksatria Mat",
    emoji: "⚔️",
    path: "/math-game-arena/umum/ksatria-mat",
    desc: "Jadilah ksatria! Serang musuh dengan memilih jawaban yang benar!",
    icon: <Shield className="w-7 h-7 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Zuma Math",
    emoji: "🔮",
    path: "/math-game-arena/umum/zuma-math",
    desc: "Tembak bola ke rantai untuk membuat kluster dan jawab soal!",
    icon: <Circle className="w-7 h-7 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Pacman Math",
    emoji: "👾",
    path: "/math-game-arena/umum/pacman-math",
    desc: "Telan pelet jawaban benar, hindari hantu, dan kuasai labirin!",
    icon: <Target className="w-7 h-7 text-yellow-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Bounce Math",
    emoji: "⚽",
    path: "/math-game-arena/umum/bounce-math",
    desc: "Pantulkan bola menuju platform jawaban yang tepat!",
    icon: <Circle className="w-7 h-7 text-green-300 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Western Bar",
    emoji: "🤠",
    path: "/math-game-arena/umum/western-bar",
    desc: "Duel koboi! Tembak lebih dulu jika jawaban di papan itu benar!",
    icon: <Crosshair className="w-7 h-7 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />,
  },
  {
    label: "Pinball Math",
    emoji: "🎱",
    path: "/math-game-arena/umum/pinball-math",
    desc: "Pantulkan bola dengan flipper untuk mencetak skor tertinggi!",
    icon: <Gamepad2 className="w-7 h-7 text-fuchsia-400 shrink-0 group-hover:scale-110 transition-transform" />,
  },
];

const NumatikGamePage = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14">

        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <GraduationCap className="w-4 h-4" />
            Ruang untuk Guru
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            NUMATIK GAME
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto font-body">
            Koleksi lengkap game matematika interaktif NUMATIK. Gunakan sebagai media pembelajaran yang menyenangkan dan memotivasi siswa di kelas!
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/8 to-violet-500/10 p-5 mb-8 backdrop-blur text-center">
          <p className="text-sm text-white/65 font-body">
            <span className="text-cyan-300 font-bold">{games.length} game</span> tersedia &mdash; klik untuk langsung bermain bersama siswa
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {games.map((game, i) => (
            <button
              key={game.path}
              onClick={() => handleClick(game.path)}
              className="group relative bg-card/80 backdrop-blur border border-border rounded-xl p-4
                hover:border-primary/60 hover:box-glow-cyan transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex items-center gap-2 mb-2">
                {game.icon}
                <span className="text-xl">{game.emoji}</span>
              </div>
              <h3 className="font-display text-[11px] sm:text-xs font-bold text-foreground mb-1 leading-tight">
                {game.label}
              </h3>
              <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                {game.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumatikGamePage;
