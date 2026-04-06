import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Box, Layers, Triangle, Mountain, BookOpen, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "KUBUS",
    path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/kubus",
    soal: 40,
    icon: Box,
    gradient: "from-sky-900/40 to-cyan-900/30",
    border: "border-sky-500/30",
    badge: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
    leftBar: "from-sky-400 to-cyan-500",
    desc: "Unsur-unsur, luas permukaan, volume, jaring-jaring kubus",
    emoji: "🧊",
  },
  {
    label: "BALOK",
    path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/balok",
    soal: 40,
    icon: Layers,
    gradient: "from-emerald-900/40 to-teal-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-teal-500",
    desc: "Unsur-unsur, luas permukaan, volume, jaring-jaring balok",
    emoji: "📦",
  },
  {
    label: "PRISMA",
    path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/prisma",
    soal: 40,
    icon: Triangle,
    gradient: "from-amber-900/40 to-orange-900/30",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    leftBar: "from-amber-400 to-orange-500",
    desc: "Prisma segitiga & segiempat, luas permukaan, volume, kontekstual",
    emoji: "🔷",
  },
  {
    label: "LIMAS",
    path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/limas",
    soal: 40,
    icon: Mountain,
    gradient: "from-violet-900/40 to-purple-900/30",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    leftBar: "from-violet-400 to-purple-500",
    desc: "Limas segitiga & segiempat, apotema, luas permukaan, volume, kontekstual",
    emoji: "🔺",
  },
  {
    label: "BANGUN RUANG GABUNGAN",
    path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar-gabungan",
    soal: 40,
    icon: Layers,
    gradient: "from-indigo-900/40 to-blue-900/30",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    leftBar: "from-indigo-400 to-blue-500",
    desc: "Balok+Limas, Kubus+Prisma, benda gabungan, limas terpancung, benda berlubang",
    emoji: "🏗️",
  },
  {
    label: "MASALAH KONTEKSTUAL",
    path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/masalah-kontekstual",
    soal: 40,
    icon: BookOpen,
    gradient: "from-orange-900/40 to-amber-900/30",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    leftBar: "from-orange-400 to-amber-500",
    desc: "Soal cerita UN/ANBK/TKA: balok, kubus, prisma, limas dalam kehidupan nyata",
    emoji: "📝",
  },
];

const BangunRuangSisiDatarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 border-2 border-sky-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🏛️</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-sky-300 mb-1 text-center"
            style={{ textShadow: '0 0 24px rgba(56,189,248,0.6)' }}>
            BANGUN RUANG SISI DATAR
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 8 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">240 Soal Total · Gambar Diagram & LaTeX</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => { playPopSound(); navigate(s.path); }}
                className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
                <div className={`absolute inset-0 border ${s.border} rounded-2xl`} />
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
                <div className="relative px-5 py-4 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${s.iconBg} border ${s.border} flex items-center justify-center shrink-0`}>
                    <span className="text-3xl">{s.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-display text-sm font-bold text-white">{s.label}</span>
                    </div>
                    <p className="text-white/40 text-xs font-body">{s.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>
                      {s.soal} Soal
                    </span>
                    <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📐 Fitur Visual</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Setiap soal dilengkapi dengan gambar diagram bangun ruang 3D yang jelas, rumus LaTeX, dan soal-soal kontekstual UN/ANBK/TKA untuk persiapan ujian resmi.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 8
          </button>
        </div>
      </div>
    </div>
  );
};

export default BangunRuangSisiDatarPage;
