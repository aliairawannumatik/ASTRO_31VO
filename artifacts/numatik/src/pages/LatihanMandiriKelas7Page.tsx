import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const topicsKelas7 = [
  { labelKey: "materiMatematika.topics.kelas7.bilanganBulat", path: "/latihan-mandiri/kelas-7/bilangan-bulat" },
  { labelKey: "materiMatematika.topics.kelas7.pecahan", path: "/latihan-mandiri/kelas-7/bilangan-rasional" },
  { labelKey: "materiMatematika.topics.kelas7.aljabar", path: "/latihan-mandiri/kelas-7/aljabar" },
  { labelKey: "materiMatematika.topics.kelas7.plsvPtlsv", path: "/latihan-mandiri/kelas-7/plsv-ptlsv" },
  { labelKey: "materiMatematika.topics.kelas7.perbandingan", path: "/latihan-mandiri/kelas-7/perbandingan" },
  { labelKey: "materiMatematika.topics.kelas7.aritmetikaSosial", path: "/latihan-mandiri/kelas-7/aritmetika-sosial" },
  { labelKey: "materiMatematika.topics.kelas7.garisDanSudut", path: "/latihan-mandiri/kelas-7/garis-dan-sudut" },
  { labelKey: "materiMatematika.topics.kelas7.segitigaDanSegiempat", path: "/latihan-mandiri/kelas-7/segitiga-dan-segiempat" },
  { labelKey: "materiMatematika.topics.kelas7.himpunan", path: "/latihan-mandiri/kelas-7/himpunan" },
];

const LatihanMandiriKelas7Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.titleGrade7')}
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          {t('practice.selectTopic')}
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topicsKelas7.map((topic, i) => (
            <button
              key={topic.path}
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
              <span className="font-body text-sm text-white">{t(topic.labelKey)}</span>
              <span className="ml-auto text-xs text-accent font-display">{t('practice.openButton')}</span>
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

export default LatihanMandiriKelas7Page;
