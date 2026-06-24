import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN",
    path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran/pengertian",
    soal: 40,
    gradient: "from-emerald-900/40 to-teal-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-teal-500",
    desc: "Definisi, sifat tegak lurus, 1 atau 2 garis singgung, PA = PB dari titik luar",
    emoji: "⭕",
  },
  {
    label: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN",
    path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran/menghitung-panjang",
    soal: 40,
    gradient: "from-orange-900/40 to-amber-900/30",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    iconColor: "text-orange-400",
    leftBar: "from-orange-400 to-amber-500",
    desc: "PT = √(OP² − r²), mencari r, mencari OP, soal cerita kontekstual",
    emoji: "📏",
  },
  {
    label: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)",
    path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran/gspl",
    soal: 40,
    gradient: "from-cyan-900/40 to-blue-900/30",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    iconColor: "text-cyan-400",
    leftBar: "from-cyan-400 to-blue-500",
    desc: "d_GSPL = √(p² − (R−r)²), mencari p, R, r, soal sabuk luar",
    emoji: "↔️",
  },
  {
    label: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)",
    path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran/gspd",
    soal: 40,
    gradient: "from-rose-900/40 to-pink-900/30",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    iconColor: "text-rose-400",
    leftBar: "from-rose-400 to-pink-500",
    desc: "d_GSPD = √(p² − (R+r)²), titik silang, sabuk silang (rantai)",
    emoji: "✖️",
  },
  {
    label: "SABUK LILITAN MINIMAL (PENERAPAN)",
    path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran/sabuk-lilitan",
    soal: 40,
    gradient: "from-violet-900/40 to-purple-900/30",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    iconColor: "text-violet-400",
    leftBar: "from-violet-400 to-purple-500",
    desc: "L = 2d + 2πr (sama besar), L ≈ 2d + π(R+r) (beda besar), 3+ lingkaran",
    emoji: "🔗",
  },
];

const GarisSinggungLingkaranPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center mb-4">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center">
            GARIS SINGGUNG LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 8 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">200 {t('practice.suffixSoalTotal')} · Dilengkapi Diagram SVG & LaTeX</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => (
            <button
              key={s.label}
              onClick={() => { playPopSound(); navigate(s.path); }}
              className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${s.border} rounded-2xl group-hover:border-opacity-60 transition-colors`} />
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
              <div className="relative px-5 py-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${s.border} flex items-center justify-center shrink-0`}>
                  <span className="text-2xl">{s.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-display text-sm font-bold text-white">{s.label}</span>
                  </div>
                  <p className="text-white/40 text-xs font-body">{s.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>
                    {s.soal} {t('practice.suffixSoal')}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">🎯 Rumus-Rumus Penting</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { f: "PT = √(OP²−r²)", l: "Garis singgung dari luar" },
              { f: "PA = PB", l: "Dua singgung dari satu titik" },
              { f: "d_GSPL = √(p²−(R−r)²)", l: "Persekutuan luar" },
              { f: "d_GSPD = √(p²−(R+r)²)", l: "Persekutuan dalam" },
            ].map(x => (
              <div key={x.f} className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-cyan-300 font-bold text-[10px]">{x.f}</p>
                <p className="text-white/40 text-[10px]">{x.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backToGrade8')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarisSinggungLingkaranPage;
