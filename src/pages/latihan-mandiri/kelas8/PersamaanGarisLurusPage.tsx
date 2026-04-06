import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const subtopics = [
  { label: "GRAFIK PERSAMAAN GARIS LURUS", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/grafik", color: "from-pink-500 to-purple-600", border: "border-pink-500/30 hover:border-pink-400/60" },
  { label: "GRADIEN (KEMIRINGAN GARIS)", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/gradien", color: "from-blue-500 to-cyan-600", border: "border-blue-500/30 hover:border-blue-400/60" },
  { label: "MENENTUKAN PERSAMAAN GARIS LURUS", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/menentukan-pgl", color: "from-green-500 to-teal-600", border: "border-green-500/30 hover:border-green-400/60" },
  { label: "HUBUNGAN 2 GARIS", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/hubungan-2-garis", color: "from-orange-500 to-yellow-600", border: "border-orange-500/30 hover:border-orange-400/60" },
  { label: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual", color: "from-purple-500 to-violet-600", border: "border-purple-500/30 hover:border-purple-400/60" },
];

const PersamaanGarisLurusPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
            PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs text-center mb-1 font-body">Kelas 8 — Latihan Mandiri</p>
          <p className="text-white/30 text-xs text-center font-body">Pilih sub topik • 40 soal per bagian • UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {subtopics.map((subtopic, i) => (
            <button
              key={subtopic.label}
              onClick={() => { playPopSound(); navigate(subtopic.path); }}
              className={`group flex items-center gap-4 bg-card/80 backdrop-blur border ${subtopic.border} rounded-xl px-5 py-4 hover:scale-[1.01] transition-all duration-300 cursor-pointer text-left animate-slide-up`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${subtopic.color} flex items-center justify-center text-white text-xs font-bold shadow`}>
                {i + 1}
              </div>
              <span className="font-body text-sm text-white flex-1">{subtopic.label}</span>
              <ChevronRight className="w-4 h-4 text-accent shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Kelas 8
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersamaanGarisLurusPage;
