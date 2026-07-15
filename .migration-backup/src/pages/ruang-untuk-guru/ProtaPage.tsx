import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarRange, ChevronRight } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const tahunList = [
  {
    label: "2025 / 2026",
    slug: "2025-2026",
    sem1: "Juli 2025 – Desember 2025",
    sem2: "Januari 2026 – Juni 2026",
    color: "from-cyan-600/70 to-teal-600/60",
    border: "border-cyan-400/80",
    badge: "bg-cyan-400/30 text-cyan-100",
  },
  {
    label: "2026 / 2027",
    slug: "2026-2027",
    sem1: "Juli 2026 – Desember 2026",
    sem2: "Januari 2027 – Juni 2027",
    color: "from-violet-600/70 to-purple-600/60",
    border: "border-violet-400/80",
    badge: "bg-violet-400/30 text-violet-100",
  },
];

const ProtaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <CalendarRange className="w-4 h-4" />
            Perangkat Pembelajaran
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PROGRAM TAHUNAN (PROTA)
          </h1>
          <p className="mt-4 text-sm text-white/70 max-w-2xl mx-auto font-body">
            Rencana distribusi materi pembelajaran matematika SMP selama satu tahun penuh berdasarkan kalender pendidikan yang berlaku. Pilih tahun pelajaran untuk melihat program tahunan.
          </p>
        </div>

        <div className="grid gap-5 mb-10">
          {tahunList.map((t, i) => (
            <button
              key={t.slug}
              onClick={() => { playPopSound(); navigate(`/ruang-untuk-guru/prota/${t.slug}`); }}
              className={`group relative bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-6
                hover:scale-[1.02] transition-all duration-300 text-left animate-slide-up cursor-pointer`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-3 ${t.badge}`}>
                    TAHUN PELAJARAN
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white mb-4">{t.label}</h2>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current opacity-70 shrink-0" />
                      <span className="text-xs text-white/70 font-body">Semester Ganjil: {t.sem1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current opacity-70 shrink-0" />
                      <span className="text-xs text-white/70 font-body">Semester Genap: {t.sem2}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {["Kelas 7", "Kelas 8", "Kelas 9"].map(k => (
                      <span key={k} className="text-[10px] font-semibold px-2 py-1 rounded bg-white/10 text-white/80">{k}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang Untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtaPage;
