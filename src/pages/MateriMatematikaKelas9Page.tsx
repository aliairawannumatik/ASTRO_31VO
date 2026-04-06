import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const topics = [
  { label: "BILANGAN BERPANGKAT", path: "/materi-matematika/kelas-9/bilangan-berpangkat" },
  { label: "KESEBANGUNAN DAN KEKONGRUENAN", path: "/materi-matematika/kelas-9/kesebangunan-kekongruenan" },
  { label: "TRANSFORMASI GEOMETRI", path: "/materi-matematika/kelas-9/transformasi-geometri" },
  { label: "BANGUN RUANG SISI LENGKUNG", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung" },
  { label: "STATISTIKA", path: "/materi-matematika/kelas-9/statistika" },
  { label: "PELUANG", path: "/materi-matematika/kelas-9/peluang" },
  { label: "PERSAMAAN KUADRAT (PENGAYAAN)", path: "/materi-matematika/kelas-9/persamaan-kuadrat" },
  { label: "FUNGSI KUADRAT (PENGAYAAN)", path: "/materi-matematika/kelas-9/fungsi-kuadrat" },
];

const MateriMatematikaKelas9Page = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/materi-matematika" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MATERI MATEMATIKA - KELAS 9
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Pilih topik untuk mempelajari materi
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topics.map((topic, i) => (
            <button
              key={topic.label}
              onClick={() => { playPopSound(); navigate(topic.path); }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4
                hover:border-primary/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <BookOpen className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-body text-sm text-white">{topic.label}</span>
              <span className="ml-auto text-xs text-primary font-display">BELAJAR</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Materi Matematika
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriMatematikaKelas9Page;
