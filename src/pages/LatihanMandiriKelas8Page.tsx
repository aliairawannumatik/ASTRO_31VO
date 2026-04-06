import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const topicsKelas8 = [
  { label: "POLA BILANGAN", path: "/latihan-mandiri/kelas-8/pola-bilangan" },
  { label: "KOORDINAT CARTESIUS", path: "/latihan-mandiri/kelas-8/koordinat-cartesius" },
  { label: "RELASI DAN FUNGSI", path: "/latihan-mandiri/kelas-8/relasi-dan-fungsi" },
  { label: "SISTEM PERSAMAAN LINEAR DUA VARIABEL", path: "/latihan-mandiri/kelas-8/spldv" },
  { label: "PERSAMAAN GARIS LURUS", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus" },
  { label: "TEOREMA PYTHAGORAS", path: "/latihan-mandiri/kelas-8/teorema-pythagoras" },
  { label: "LINGKARAN", path: "/latihan-mandiri/kelas-8/lingkaran" },
  { label: "GARIS SINGGUNG LINGKARAN", path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran" },
  { label: "BANGUN RUANG SISI DATAR", path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar" },
];

const LatihanMandiriKelas8Page = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          LATIHAN MANDIRI - KELAS 8
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Pilih topik untuk memulai latihan
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topicsKelas8.map((topic, i) => (
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

export default LatihanMandiriKelas8Page;
