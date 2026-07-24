import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const TOPICS = [
  { key: "bilanganBulat", path: "/materi-matematika/kelas-7/bilangan-bulat" },
  { key: "pecahan", path: "/materi-matematika/kelas-7/bilangan-rasional" },
  { key: "aljabar", path: "/materi-matematika/kelas-7/aljabar" },
  { key: "plsvPtlsv", path: "/materi-matematika/kelas-7/plsv-ptlsv" },
  { key: "perbandingan", path: "/materi-matematika/kelas-7/perbandingan" },
  { key: "aritmetikaSosial", path: "/materi-matematika/kelas-7/aritmetika-sosial" },
  { key: "garisDanSudut", path: "/materi-matematika/kelas-7/garis-dan-sudut" },
  { key: "segitigaDanSegiempat", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat" },
  { key: "himpunan", path: "/materi-matematika/kelas-7/himpunan" },
] as const;

const MateriMatematikaKelas7Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/buku-animasi-matematika" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t("materiMatematika.kelas7Title")}
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          {t("materiMatematika.topicSubtitle")}
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {TOPICS.map((topic, i) => (
            <button
              key={topic.key}
              onClick={() => { playPopSound(); navigate(topic.path); }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4
                hover:border-primary/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <BookOpen className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-body text-sm text-white">{t(`materiMatematika.topics.kelas7.${topic.key}`)}</span>
              <span className="ml-auto text-xs text-primary font-display">{t("materiMatematika.study")}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/buku-animasi-matematika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t("materiMatematika.backToAnimatedBook")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriMatematikaKelas7Page;
