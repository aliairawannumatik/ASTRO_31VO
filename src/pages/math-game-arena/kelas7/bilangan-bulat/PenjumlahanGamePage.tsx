import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import { Play, Sparkles } from "lucide-react";

interface GameVariant {
  name: string;
  tagline: string;
  emoji: string;
  description: string;
  path: string;
  genre: string;
  soalCount: string;
  control: string;
  difficulty: 1 | 2 | 3;
  from: string;
  to: string;
  glow: string;
  accent: string;
}

const variants: GameVariant[] = [
  {
    name: "Pesawat Tembak Meteor",
    tagline: "ASTRO CLASSIC",
    emoji: "☄️",
    description: "Tembak meteor berisi jawaban yang BENAR dari pesawat luar angkasamu. Cocok untuk pemula!",
    path: "/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/pesawat-tembak-meteor",
    genre: "Shooter",
    soalCount: "5 SOAL",
    control: "🖱️ Klik",
    difficulty: 1,
    from: "#06b6d4",
    to: "#7c3aed",
    glow: "rgba(124,58,237,0.55)",
    accent: "#a78bfa",
  },
  {
    name: "Turtle Run Math",
    tagline: "ENDLESS RUNNER",
    emoji: "🐢",
    description: "Lari, lompat, dan tiarap menghindari rintangan! Jawab soal bonus tiap 40 detik untuk skor tambahan.",
    path: "/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/turtle-run",
    genre: "Runner",
    soalCount: "8 SOAL BONUS",
    control: "⌨️ Spasi/↑/↓",
    difficulty: 2,
    from: "#10b981",
    to: "#06b6d4",
    glow: "rgba(16,185,129,0.55)",
    accent: "#6ee7b7",
  },
  {
    name: "Flappy Rocket",
    tagline: "FLY & SOLVE",
    emoji: "🚀",
    description: "Terbangkan roket lewati gerbang sempit. Tiap gerbang khusus muncul soal untuk dijawab cepat!",
    path: "/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/flappy-rocket",
    genre: "Arcade",
    soalCount: "8 SOAL",
    control: "👆 Tap/Klik",
    difficulty: 2,
    from: "#f59e0b",
    to: "#ef4444",
    glow: "rgba(239,68,68,0.55)",
    accent: "#fca5a5",
  },
  {
    name: "Shoot Tank",
    tagline: "BATTLE ARENA",
    emoji: "💥",
    description: "Bertempur lawan tank musuh! Jawab soal bonus untuk hadiah waktu, peluru, dan poin ekstra.",
    path: "/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/tembak-tank",
    genre: "Action",
    soalCount: "12 SOAL",
    control: "🎯 Mouse",
    difficulty: 3,
    from: "#dc2626",
    to: "#9333ea",
    glow: "rgba(147,51,234,0.55)",
    accent: "#f0abfc",
  },
  {
    name: "Space Impact Math",
    tagline: "GALACTIC FIGHTER",
    emoji: "🛸",
    description: "Tembak HANYA pesawat musuh berlabel jawaban yang BENAR! Salah pilih, kurang nyawa.",
    path: "/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/space-impact",
    genre: "Shoot 'em up",
    soalCount: "12 SOAL",
    control: "⌨️ WASD + Space",
    difficulty: 3,
    from: "#0ea5e9",
    to: "#8b5cf6",
    glow: "rgba(14,165,233,0.55)",
    accent: "#7dd3fc",
  },
];

const DifficultyBadge = ({ level, accent }: { level: 1 | 2 | 3; accent: string }) => {
  const labels = { 1: "MUDAH", 2: "SEDANG", 3: "SULIT" };
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] font-black tracking-widest text-white/50">{labels[level]}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="block w-1 h-2 rounded-full"
            style={{
              background: i <= level ? accent : "rgba(255,255,255,0.12)",
              boxShadow: i <= level ? `0 0 6px ${accent}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const PenjumlahanGamePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/math-game-arena/kelas-7/bilangan-bulat" />

      <div className="relative z-10 w-full max-w-4xl px-4 py-10 md:py-14">
        {/* HEADER ───────────────────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-5">
            {/* Orbital ring 1 */}
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/30"
              style={{ animation: "spin 18s linear infinite" }}
            >
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            </div>
            {/* Orbital ring 2 */}
            <div
              className="absolute inset-2 rounded-full border border-purple-400/30"
              style={{ animation: "spin 12s linear infinite reverse" }}
            >
              <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
            </div>
            {/* Glow */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-500/40 to-purple-500/40 blur-xl animate-pulse" />
            {/* Icon */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(124,58,237,0.6)]">
              ➕
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-cyan-400/20 mb-3">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-black tracking-[0.25em] text-cyan-300 uppercase">
              Math Game Arena · Kelas 7
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black text-primary text-glow-cyan leading-tight">
            PENJUMLAHAN
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              BILANGAN BULAT
            </span>
          </h1>

          <p className="mt-4 text-white/60 text-sm md:text-base font-body max-w-md mx-auto">
            Pilih salah satu dari <span className="text-cyan-300 font-bold">5 game seru</span> untuk
            menguasai operasi penjumlahan bilangan bulat!
          </p>

          {/* Stats strip */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-body">
              <span className="text-lg">🎮</span>
              <span className="text-white/50">5 Game</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-[11px] font-body">
              <span className="text-lg">🧮</span>
              <span className="text-white/50">45+ Soal</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-[11px] font-body">
              <span className="text-lg">⚡</span>
              <span className="text-white/50">3 Tingkat</span>
            </div>
          </div>
        </div>

        {/* GAME CARDS ───────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {variants.map((v, i) => (
            <button
              key={v.name}
              onClick={() => { playPopSound(); navigate(v.path); }}
              className="group relative w-full text-left rounded-3xl overflow-hidden
                transition-all duration-500 animate-slide-up cursor-pointer
                hover:scale-[1.02] active:scale-[0.99]"
              style={{
                animationDelay: `${i * 0.08}s`,
                boxShadow: `0 4px 30px rgba(0,0,0,0.4)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 8px 50px ${v.glow}, 0 4px 20px rgba(0,0,0,0.5)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 4px 30px rgba(0,0,0,0.4)`;
              }}
            >
              {/* Background layers */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${v.from}26, ${v.to}26)` }}
              />
              <div
                className="absolute inset-0 opacity-[0.18] group-hover:opacity-[0.28] transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}
              />
              {/* Aurora blob bg */}
              <div
                className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: v.from }}
              />
              <div
                className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: v.to }}
              />
              {/* Border */}
              <div className="absolute inset-0 rounded-3xl border border-white/15 group-hover:border-white/30 transition-colors duration-500" />
              {/* Top edge highlight */}
              <div
                className="absolute top-0 left-6 right-6 h-px opacity-60"
                style={{
                  background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)`,
                }}
              />
              {/* Shine sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              {/* CONTENT GRID */}
              <div className="relative flex flex-col sm:flex-row items-stretch min-h-[140px]">
                {/* LEFT: emoji panel */}
                <div
                  className="relative shrink-0 flex items-center justify-center w-full sm:w-32 md:w-40 p-4 sm:p-6 sm:border-r border-white/10 overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at center, ${v.from}33 0%, transparent 70%)`,
                  }}
                >
                  {/* Decorative ring */}
                  <div
                    className="absolute inset-4 rounded-full border opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                    style={{
                      borderColor: v.accent,
                      animation: "spin 20s linear infinite",
                    }}
                  />
                  {/* Glow behind emoji */}
                  <div
                    className="absolute w-16 h-16 rounded-full blur-2xl opacity-60"
                    style={{ background: v.accent }}
                  />
                  {/* Emoji */}
                  <span
                    className="relative text-5xl md:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
                    style={{ animation: "float 3s ease-in-out infinite" }}
                  >
                    {v.emoji}
                  </span>
                </div>

                {/* MIDDLE: info */}
                <div className="relative flex-1 flex flex-col justify-center px-5 py-4 sm:py-5 min-w-0">
                  {/* Genre tag */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[9px] font-black tracking-[0.2em] px-2 py-0.5 rounded-full border"
                      style={{
                        color: v.accent,
                        borderColor: `${v.accent}55`,
                        background: `${v.from}22`,
                      }}
                    >
                      {v.tagline}
                    </span>
                    <DifficultyBadge level={v.difficulty} accent={v.accent} />
                  </div>

                  {/* Game name */}
                  <h2
                    className="font-display text-xl md:text-2xl font-black leading-tight mb-1.5"
                    style={{
                      background: `linear-gradient(135deg, #ffffff, ${v.accent})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {v.name}
                  </h2>

                  {/* Description */}
                  <p className="text-[12px] md:text-[13px] text-white/70 font-body leading-snug mb-3 line-clamp-2">
                    {v.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-white/70">
                      🎯 {v.soalCount}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-white/70">
                      {v.control}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        background: `${v.from}1f`,
                        borderColor: `${v.accent}44`,
                        color: v.accent,
                      }}
                    >
                      {v.genre}
                    </span>
                  </div>
                </div>

                {/* RIGHT: CTA */}
                <div className="relative shrink-0 flex items-center justify-center sm:justify-end px-5 pb-5 sm:pb-0 sm:pr-6">
                  <div
                    className="relative flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm text-white
                      transition-all duration-300 group-hover:scale-110 group-hover:rotate-1"
                    style={{
                      background: `linear-gradient(135deg, ${v.from}, ${v.to})`,
                      boxShadow: `0 4px 20px ${v.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    }}
                  >
                    {/* Inner shine */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                    <Play className="relative w-4 h-4 fill-white" />
                    <span className="relative tracking-wider">MAIN!</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* FOOTER ───────────────────────────────────────────── */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/math-game-arena/kelas-7/bilangan-bulat"); }}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition-colors cursor-pointer font-body group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PenjumlahanGamePage;
