import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const kelasOptions = [
  { label: "KELAS 7", path: "/materi-matematika/kelas-7", desc: "Buku Animasi Matematika kelas 7 SMP" },
  { label: "KELAS 8", path: "/materi-matematika/kelas-8", desc: "Buku Animasi Matematika kelas 8 SMP" },
  { label: "KELAS 9", path: "/materi-matematika/kelas-9", desc: "Buku Animasi Matematika kelas 9 SMP" },
];

const MateriMatematikaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BUKU ANIMASI MATEMATIKA
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Pilih kelas untuk mempelajari materi matematika
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
                hover:border-primary/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <GraduationCap className="w-8 h-8 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-display text-lg text-white">{kelas.label}</span>
                <span className="font-body text-xs text-white/50">{kelas.desc}</span>
              </div>
              <span className="ml-auto text-xs text-primary font-display">BELAJAR</span>
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

export default MateriMatematikaPage;
