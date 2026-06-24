import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const KELAS_OPTIONS = [
  { gradeKey: "grade7", path: "/materi-matematika/kelas-7" },
  { gradeKey: "grade8", path: "/materi-matematika/kelas-8" },
  { gradeKey: "grade9", path: "/materi-matematika/kelas-9" },
] as const;

const MateriMatematikaPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t("materiMatematika.title")}
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          {t("materiMatematika.subtitle")}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {KELAS_OPTIONS.map((kelas, i) => (
            <button
              key={kelas.path}
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
                <span className="font-display text-lg text-white">
                  {t(`materiMatematika.${kelas.gradeKey}`)}
                </span>
                <span className="font-body text-xs text-white/50">
                  {t(`materiMatematika.${kelas.gradeKey}desc`)}
                </span>
              </div>
              <span className="ml-auto text-xs text-primary font-display">
                {t("materiMatematika.study")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t("materiMatematika.backToMenu")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriMatematikaPage;
