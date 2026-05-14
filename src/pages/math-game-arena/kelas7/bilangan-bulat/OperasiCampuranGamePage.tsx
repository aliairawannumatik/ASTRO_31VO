import { useNavigate } from "react-router-dom";
  import Starfield from "@/components/Starfield";
  import Snowfall from "@/components/Snowfall";
  import PageNavigation from "@/components/PageNavigation";
  import { playPopSound } from "@/hooks/useAudio";
  import { useTheme } from "@/contexts/ThemeContext";
  import { Play } from "lucide-react";

  interface GameVariant {
    name: string;
    emoji: string;
    description: string;
    path: string;
    from: string;
    to: string;
    glow: string;
  }

  const variants: GameVariant[] = [
    {
      name: "Pesawat Tembak Meteor",
      emoji: "☄️",
      description: "Tembak meteor berisi jawaban yang benar dari pesawat luar angkasamu.",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/pesawat-tembak-meteor",
      from: "#06b6d4",
      to: "#7c3aed",
      glow: "rgba(124,58,237,0.4)",
    },
    {
      name: "Galaksi Tempur",
      emoji: "🌌",
      description: "Tembak musuh alien & jawab soal materi setiap 25 detik untuk poin bonus!",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/galaksi-tempur",
      from: "#7c3aed",
      to: "#ec4899",
      glow: "rgba(236,72,153,0.4)",
    },
    {
      name: "Flappy Rocket",
      emoji: "🚀",
      description: "Terbangkan roket lewati gerbang. Tiap gerbang khusus = soal!",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/flappy-rocket",
      from: "#f59e0b",
      to: "#ef4444",
      glow: "rgba(239,68,68,0.4)",
    },
    {
      name: "Shoot Tank",
      emoji: "💥",
      description: "Bertempur lawan tank musuh! Jawab soal bonus untuk hadiah waktu & poin.",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/tembak-tank",
      from: "#dc2626",
      to: "#9333ea",
      glow: "rgba(147,51,234,0.4)",
    },
    {
      name: "Space Impact Math",
      emoji: "🛸",
      description: "Tembak hanya pesawat musuh berlabel jawaban yang BENAR!",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/space-impact",
      from: "#0ea5e9",
      to: "#8b5cf6",
      glow: "rgba(14,165,233,0.4)",
    },
    {
      name: "Turtle Run Math",
      emoji: "🐢",
      description: "Lari, lompat, dan tiarap! Jawab soal bonus untuk skor tambahan.",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/turtle-run",
      from: "#10b981",
      to: "#06b6d4",
      glow: "rgba(16,185,129,0.4)",
    },
    {
      name: "Tetris Numatik",
      emoji: "🧩",
      description: "Susun blok agar tidak menumpuk! Jawab soal bonus untuk skor tambahan.",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/tetris",
      from: "#06b6d4",
      to: "#a855f7",
      glow: "rgba(168,85,247,0.4)",
    },
    {
      name: "Snake Matematika",
      emoji: "🐍",
      description: "Makan jawaban yang benar dan hindari jawaban salah!",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/snake-math",
      from: "#22c55e",
      to: "#0ea5e9",
      glow: "rgba(34,197,94,0.4)",
    },
    {
      name: "Meteor Pantul NUMATIK",
      emoji: "☄️",
      description: "Pantulkan meteor dengan pesawatmu dan hancurkan kristal asteroid! Jawab soal bonus untuk skor besar.",
      path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran/meteor-pantul",
      from: "#f97316",
      to: "#a855f7",
      glow: "rgba(249,115,22,0.4)",
    },
  ];

  const OperasiCampuranGamePage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
      <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
        {isLight ? <Snowfall /> : <Starfield />}
        <PageNavigation prevPath="/math-game-arena/kelas-7/bilangan-bulat" />

        <div className="relative z-10 max-w-3xl w-full px-4 py-10">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
              <span className="text-4xl relative z-10">🧮</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black text-primary text-glow-cyan mb-1">
              OPERASI HITUNG CAMPURAN BILANGAN BULAT
            </h1>
            <p className="text-cyan-400/60 text-xs font-body tracking-widest uppercase">
              Kelas 7 · Math Game Arena
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-white/40 text-[11px] font-body">
              <span>🎮</span>
              <span>Pilih game favoritmu untuk berlatih operasi hitung campuran bilangan bulat!</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {variants.map((v, i) => (
              <button
                key={v.name}
                onClick={() => { playPopSound(); navigate(v.path); }}
                className="group relative flex items-stretch overflow-hidden rounded-2xl text-left
                  transition-all duration-300 animate-slide-up cursor-pointer hover:scale-[1.015]"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  boxShadow: `0 2px 20px rgba(0,0,0,0.4)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    `0 4px 30px ${v.glow}, 0 2px 10px rgba(0,0,0,0.5)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    `0 2px 20px rgba(0,0,0,0.4)`;
                }}
              >
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${v.from}14, ${v.to}14)` }}
                />
                <div
                  className="absolute inset-0 opacity-[0.10] group-hover:opacity-[0.18] transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}
                />
                <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-50"
                  style={{ background: `linear-gradient(90deg, transparent, ${v.from}, ${v.to}, transparent)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                <div
                  className="relative flex-shrink-0 flex items-center justify-center w-20 border-r border-white/10"
                  style={{ background: `linear-gradient(180deg, ${v.from}22, ${v.to}22)` }}
                >
                  {v.path.endsWith("/pesawat-tembak-meteor") ? (
                    <img
                      src="/pesawat.png"
                      alt="Pesawat"
                      className="w-10 h-12 drop-shadow-[0_0_12px_rgba(0,200,255,0.6)]"
                    />
                  ) : (
                    <span className="text-4xl">{v.emoji}</span>
                  )}
                </div>

                <div className="relative flex-1 flex items-center gap-3 px-4 py-4 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-bold text-white leading-tight mb-1">
                      {v.name}
                    </div>
                    <div className="text-[11px] text-white/50 font-body leading-snug">
                      {v.description}
                    </div>
                  </div>
                </div>

                <div className="relative flex-shrink-0 flex items-center pr-4">
                  <div
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[11px] text-white transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${v.from}, ${v.to})`,
                      boxShadow: `0 2px 12px ${v.glow}`,
                    }}
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>MAIN!</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/math-game-arena/kelas-7/bilangan-bulat"); }}
              className="text-sm text-white/40 hover:text-cyan-400 transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Bilangan Bulat
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default OperasiCampuranGamePage;
  