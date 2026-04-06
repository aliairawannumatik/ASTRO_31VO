import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Layers, TrendingUp, Replace, Minus, Shuffle, FileText, Rocket } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const subtopics = [
  {
    label: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV",
    route: "/latihan-mandiri/kelas-8/spldv/definisi",
    icon: Layers,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
    badge: "40 Soal",
  },
  {
    label: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK",
    route: "/latihan-mandiri/kelas-8/spldv/metode-grafik",
    icon: TrendingUp,
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    badge: "40 Soal",
  },
  {
    label: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI",
    route: "/latihan-mandiri/kelas-8/spldv/metode-substitusi",
    icon: Replace,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.3)",
    badge: "40 Soal",
  },
  {
    label: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI",
    route: "/latihan-mandiri/kelas-8/spldv/metode-eliminasi",
    icon: Minus,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.3)",
    badge: "40 Soal",
  },
  {
    label: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN",
    route: "/latihan-mandiri/kelas-8/spldv/metode-campuran",
    icon: Shuffle,
    color: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
    border: "rgba(244,114,182,0.3)",
    badge: "40 Soal",
  },
  {
    label: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV",
    route: "/latihan-mandiri/kelas-8/spldv/model-spldv",
    icon: FileText,
    color: "#facc15",
    bg: "rgba(250,204,21,0.10)",
    border: "rgba(250,204,21,0.3)",
    badge: "40 Soal",
  },
  {
    label: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV",
    route: "/latihan-mandiri/kelas-8/spldv/penyelesaian-masalah",
    icon: Rocket,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
    badge: "40 Soal",
  },
];

const SPLDVPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "rgba(167,139,250,0.15)", border: "1.5px solid rgba(167,139,250,0.35)" }}>
            <BookOpen className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: "#a78bfa", textShadow: "0 0 24px #a78bfa88" }}>
            SISTEM PERSAMAAN LINEAR DUA VARIABEL
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · Latihan Mandiri · 7 Sub Topik · 280 Soal UN/ANBK/TKA</p>
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.route}
                onClick={() => { playPopSound(); navigate(s.route); }}
                className="group flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300 cursor-pointer border"
                style={{
                  background: s.bg,
                  borderColor: s.border,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: s.color + "25", border: `1.5px solid ${s.border}` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white/90 leading-snug">{s.label}</p>
                  <span className="text-[11px] font-bold mt-0.5 inline-block" style={{ color: s.color }}>{s.badge}</span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: s.color }} />
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 8
          </button>
        </div>
      </div>
    </div>
  );
};

export default SPLDVPage;
