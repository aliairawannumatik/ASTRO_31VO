import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const subtopics = [
  { label: "TABUNG", path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/tabung", emoji: "🧴", color: "cyan" },
  { label: "KERUCUT", path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/kerucut", emoji: "🔺", color: "orange" },
  { label: "BOLA", path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/bola", emoji: "🔮", color: "indigo" },
  { label: "PERUBAHAN LUAS PERMUKAAN DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume", emoji: "🔄", color: "purple" },
  { label: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/gabungan", emoji: "🧩", color: "emerald" },
];

const colorMap: Record<string, string> = {
  cyan: "border-cyan-500/40 hover:border-cyan-400/70 text-cyan-300",
  orange: "border-orange-500/40 hover:border-orange-400/70 text-orange-300",
  indigo: "border-indigo-500/40 hover:border-indigo-400/70 text-indigo-300",
  purple: "border-purple-500/40 hover:border-purple-400/70 text-purple-300",
  emerald: "border-emerald-500/40 hover:border-emerald-400/70 text-emerald-300",
};

const BangunRuangSisiLengkungPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BANGUN RUANG SISI LENGKUNG
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 - Latihan Mandiri</p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {subtopics.map((sub, i) => (
            <button
              key={sub.label}
              onClick={() => { playPopSound(); navigate(sub.path); }}
              className={`group flex items-center gap-4 bg-card/80 backdrop-blur border rounded-xl px-5 py-4
                transition-all duration-300 cursor-pointer text-left animate-slide-up ${colorMap[sub.color]}`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <span className="text-2xl">{sub.emoji}</span>
              <span className="font-body text-sm text-white flex-1">{sub.label}</span>
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform opacity-50" />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Kelas 9
          </button>
        </div>
      </div>
    </div>
  );
};

export default BangunRuangSisiLengkungPage;
