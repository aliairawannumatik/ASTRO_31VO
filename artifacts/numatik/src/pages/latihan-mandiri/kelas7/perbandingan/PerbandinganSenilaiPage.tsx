import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PerbandinganSenilaiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.perbandingan.perbandinganSenilai.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.perbandingan.perbandinganSenilai.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.perbandingan.perbandinganSenilai.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 — intro + 8 list items a–h */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">
                  {t('practice.perbandingan.perbandinganSenilai.q1.intro')}
                </p>
                <ol className="list-[lower-alpha] list-inside space-y-1 ml-2">
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.a')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.b')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.c')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.d')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.e')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.f')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.g')}</li>
                  <li>{t('practice.perbandingan.perbandinganSenilai.q1.h')}</li>
                </ol>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q2')}</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q3')}</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q4')}</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q5')}</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q6')}</p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q7')}</p>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q8')}</p>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q9')}</p>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <p>{t('practice.perbandingan.perbandinganSenilai.q10')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/perbandingan"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('practice.perbandingan.perbandinganSenilai.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganSenilaiPage;
