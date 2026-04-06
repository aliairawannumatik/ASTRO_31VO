import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const topicsKelas9 = [
  { label: "BILANGAN BERPANGKAT", path: "/latihan-mandiri/kelas-9/bilangan-berpangkat" },
  { label: "KESEBANGUNAN DAN KEKONGRUENAN", path: "/latihan-mandiri/kelas-9/kesebangunan-kekongruenan" },
  { label: "TRANSFORMASI GEOMETRI", path: "/latihan-mandiri/kelas-9/transformasi-geometri" },
  { label: "BANGUN RUANG SISI LENGKUNG", path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung" },
  { label: "STATISTIKA", path: "/latihan-mandiri/kelas-9/statistika" },
  { label: "PELUANG", path: "/latihan-mandiri/kelas-9/peluang" },
  { label: "PERSAMAAN KUADRAT (PENGAYAAN)", path: "/latihan-mandiri/kelas-9/persamaan-kuadrat" },
  { label: "FUNGSI KUADRAT (PENGAYAAN)", path: "/latihan-mandiri/kelas-9/fungsi-kuadrat" },
];

const LatihanMandiriKelas9Page = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          LATIHAN MANDIRI - KELAS 9
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Pilih topik untuk memulai latihan
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topicsKelas9.map((topic, i) => (
            <button
              key={topic.label}
              onClick={() => {
                playPopSound();
                navigate(topic.path);
              }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4
                hover:border-accent/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <BookOpen className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-body text-sm text-white">{topic.label}</span>
              <span className="ml-auto text-xs text-accent font-display">BUKA</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Latihan Mandiri
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatihanMandiriKelas9Page;
