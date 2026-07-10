import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const topicsKelas8 = [
  { label: "POLA BILANGAN", path: "/latihan-mandiri/kelas-8/pola-bilangan", soal: 50 },
  { label: "KOORDINAT KARTESIUS", path: "/latihan-mandiri/kelas-8/koordinat-cartesius", soal: 55 },
  { label: "RELASI DAN FUNGSI", path: "/latihan-mandiri/kelas-8/relasi-dan-fungsi", soal: 200 },
  { label: "SISTEM PERSAMAAN LINEAR DUA VARIABEL", path: "/latihan-mandiri/kelas-8/spldv", soal: 128 },
  { label: "PERSAMAAN GARIS LURUS", path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus", soal: 200 },
  { label: "TEOREMA PYTHAGORAS", path: "/latihan-mandiri/kelas-8/teorema-pythagoras", soal: 240 },
  { label: "LINGKARAN", path: "/latihan-mandiri/kelas-8/lingkaran", soal: 240 },
  { label: "GARIS SINGGUNG LINGKARAN (PENGAYAAN)", path: "/latihan-mandiri/kelas-8/garis-singgung-lingkaran", soal: 200 },
  { label: "BANGUN RUANG SISI DATAR", path: "/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar", soal: 80 },
];

const LatihanMandiriKelas8Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.titleGrade8')}
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          {t('practice.selectTopic')}
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
              <span className="font-body text-sm text-white flex-1">{topic.label}</span>
              <span className="text-xs text-accent font-display shrink-0">{t('practice.openButton')}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backToPractice')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatihanMandiriKelas8Page;
