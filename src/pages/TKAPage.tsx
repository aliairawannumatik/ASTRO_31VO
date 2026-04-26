import { useEffect } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Brain, ChevronRight, FileText, Lightbulb, BookOpen, Target, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const packages = [
  { id: 1, label: "Paket 1", path: "/tka/paket-1", soal: 30 },
  { id: 2, label: "Paket 2", path: "/tka/paket-2", soal: 30 },
  { id: 3, label: "Paket 3", path: "/tka/paket-3", soal: 30 },
  { id: 4, label: "Paket 4", path: "/tka/paket-4", soal: 30 },
  { id: 5, label: "Paket 5", path: "/tka/paket-5", soal: 30 },
];

const indikator = [
  { id: 1, label: "Uji Penguasaan Indikator 1", path: "/tka/indikator-1" },
  { id: 2, label: "Uji Penguasaan Indikator 2", path: "/tka/indikator-2" },
  { id: 3, label: "Uji Penguasaan Indikator 3", path: "/tka/indikator-3" },
  { id: 4, label: "Uji Penguasaan Indikator 4", path: "/tka/indikator-4" },
  { id: 5, label: "Uji Penguasaan Indikator 5", path: "/tka/indikator-5" },
];

const TKAPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center tracking-wide">
            TES KEMAMPUAN AKADEMIK
          </h1>
          <p className="text-white/50 text-xs text-center font-body max-w-xs">
            Pemantapan &amp; Persiapan TKA — Matematika Kelas IX
          </p>
          {/* Stats bar */}
          <div className="mt-4 flex gap-5 items-center">
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <FileText className="w-3.5 h-3.5" />
              <span>5 Paket Soal</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <Target className="w-3.5 h-3.5" />
              <span>150 Soal Total</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kelas IX</span>
            </div>
          </div>
        </div>

        {/* Paket Latihan Section */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/40 text-xs font-body font-semibold tracking-widest uppercase">Paket Latihan</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col gap-2.5">
            {packages.map((pkg, i) => (
              <button
                key={pkg.id}
                onClick={() => { playPopSound(); navigate(pkg.path); }}
                className="group flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5
                  hover:bg-cyan-500/8 hover:border-cyan-400/40 hover:shadow-md hover:shadow-cyan-500/5
                  transition-all duration-250 cursor-pointer text-left animate-slide-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Number Badge */}
                <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0
                  bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors">
                  <span className="font-display text-[10px] text-cyan-400/60 leading-none">No.</span>
                  <span className="font-display text-base font-bold text-cyan-300 leading-tight">{String(pkg.id).padStart(2, "0")}</span>
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-white/30 font-body uppercase tracking-wider">Latihan TKA</span>
                  <p className="font-body text-sm font-semibold text-white group-hover:text-cyan-100 transition-colors truncate">
                    {pkg.label}
                  </p>
                </div>

                {/* Soal count */}
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[10px] text-white/30 font-body">Jumlah Soal</span>
                  <span className="text-sm font-bold font-body text-cyan-300">{pkg.soal}</span>
                </div>

                <ChevronRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Uji Penguasaan Indikator Section */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.30s" }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-violet-400/60 text-xs font-body font-semibold tracking-widest uppercase">Uji Penguasaan Indikator</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col gap-2.5">
            {indikator.map((ind, i) => (
              <button
                key={ind.id}
                onClick={() => { playPopSound(); navigate(ind.path); }}
                className="group flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5
                  hover:bg-violet-500/8 hover:border-violet-400/40 hover:shadow-md hover:shadow-violet-500/5
                  transition-all duration-250 cursor-pointer text-left animate-slide-up"
                style={{ animationDelay: `${0.30 + i * 0.05}s` }}
              >
                {/* Number Badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                  bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-400/30 group-hover:border-violet-400/60 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-violet-300" />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-white/30 font-body uppercase tracking-wider">Indikator {ind.id}</span>
                  <p className="font-body text-sm font-semibold text-white group-hover:text-violet-100 transition-colors truncate">
                    {ind.label}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Divider + Tips Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.60s" }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400/50 text-xs font-body font-semibold tracking-widest uppercase">Tips &amp; Panduan</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => { playPopSound(); navigate("/tka/tips"); }}
            className="group w-full flex items-center gap-4
              bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-400/5
              border border-amber-400/35 rounded-xl px-5 py-4
              hover:from-amber-500/25 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10
              transition-all duration-300 cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              bg-gradient-to-br from-amber-400/25 to-yellow-500/10 border border-amber-400/40 group-hover:border-amber-400/70 transition-colors">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-amber-400/50 font-body uppercase tracking-wider">Panduan Ujian</span>
              <p className="font-body text-sm font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
                Tips Menghadapi TKA
              </p>
            </div>
            <span className="text-xs font-body text-amber-300/70 border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 rounded-full shrink-0">
              10 Tips
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 text-amber-400/50 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAPage;
