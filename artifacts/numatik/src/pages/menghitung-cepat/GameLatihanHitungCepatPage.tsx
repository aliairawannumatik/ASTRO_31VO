import { useNavigate } from "react-router-dom";
import { Hammer, Rocket, Sparkles, Gamepad2, ArrowLeft } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const games = [
  {
    label: "Hajar Mol!",
    emoji: "🔨",
    path: "/math-game-arena/umum/hajar-mol",
    desc: "Pukul mol yang muncul hanya ketika membawa jawaban yang benar!",
    icon: <Hammer className="w-7 h-7 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />,
    border: "border-amber-500/30 hover:border-amber-400/60",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    label: "Galaksi Defender Math",
    emoji: "👽",
    path: "/math-game-arena/umum/galaxy-defender",
    desc: "Pertahankan Bumi! Tembak alien jawaban benar yang turun dari luar angkasa!",
    icon: <Rocket className="w-7 h-7 text-fuchsia-400 shrink-0 group-hover:scale-110 transition-transform" />,
    border: "border-fuchsia-500/30 hover:border-fuchsia-400/60",
    gradient: "from-fuchsia-500/10 to-violet-500/10",
  },
  {
    label: "Bubble Pop",
    emoji: "🫧",
    path: "/math-game-arena/umum/bubble-pop",
    desc: "Pecahkan gelembung jawaban benar sebelum sampai ke atas!",
    icon: <Sparkles className="w-7 h-7 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />,
    border: "border-sky-500/30 hover:border-sky-400/60",
    gradient: "from-sky-500/10 to-cyan-500/10",
  },
];

const GameLatihanHitungCepatPage = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/menghitung-cepat" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-14">

        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-200 mb-4">
            <Gamepad2 className="w-4 h-4" />
            Menghitung Cepat
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-yellow-300 text-glow-cyan leading-tight">
            GAME LATIHAN HITUNG CEPAT
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-xl mx-auto font-body">
            Asah kemampuan menghitung cepat lewat game seru! Soal-soal dirancang untuk melatih reflek berhitung dan mental math.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-amber-500/8 to-orange-500/10 p-4 mb-8 backdrop-blur text-center">
          <p className="text-sm text-white/65 font-body">
            <span className="text-yellow-300 font-bold">{games.length} game</span> tersedia &mdash; bermain sambil mengasah hitung cepat di kepala!
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          {games.map((game, i) => (
            <button
              key={game.path}
              onClick={() => handleClick(game.path)}
              className={`group relative bg-gradient-to-r ${game.gradient} backdrop-blur border ${game.border} rounded-2xl p-5
                hover:box-glow-cyan transition-all duration-300 cursor-pointer text-left animate-slide-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {game.icon}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-3xl">{game.emoji}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground mb-1 leading-tight">
                    {game.label}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-snug">
                    {game.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menghitung-cepat"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menghitung Cepat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameLatihanHitungCepatPage;
