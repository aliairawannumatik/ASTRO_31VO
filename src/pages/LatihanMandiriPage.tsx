import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ClipboardList, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const kelasOptions = [
  { label: "KELAS 7", path: "/latihan-mandiri/kelas-7", desc: "Materi kelas 7 SMP" },
  { label: "KELAS 8", path: "/latihan-mandiri/kelas-8", desc: "Materi kelas 8 SMP" },
  { label: "KELAS 9", path: "/latihan-mandiri/kelas-9", desc: "Materi kelas 9 SMP" },
];

const LatihanMandiriPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <ClipboardList className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          LATIHAN MANDIRI
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Pilih kelas untuk memulai latihan
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {kelasOptions.map((kelas, i) => (
            <button
              key={kelas.label}
              onClick={() => {
                playPopSound();
                navigate(kelas.path);
              }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-6 py-5
                hover:border-accent/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <GraduationCap className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-display text-lg text-white">{kelas.label}</span>
                <span className="font-body text-xs text-white/50">{kelas.desc}</span>
              </div>
              <span className="ml-auto text-xs text-accent font-display">BUKA</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatihanMandiriPage;
