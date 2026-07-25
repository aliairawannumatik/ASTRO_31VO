import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const PerbandinganUmumPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.perbandingan.perbandinganUmum.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.perbandingan.perbandinganUmum.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.perbandingan.perbandinganUmum.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <p>{t('practice.perbandingan.perbandinganUmum.q1')}</p>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <p>{t('practice.perbandingan.perbandinganUmum.q2')}</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <p>{t('practice.perbandingan.perbandinganUmum.q3')}</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <p>{t('practice.perbandingan.perbandinganUmum.q4')}</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <p>{t('practice.perbandingan.perbandinganUmum.q5')}</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <p>{t('practice.perbandingan.perbandinganUmum.q6')}</p>
            </div>

            {/* Soal 7 — m² appears twice, split around <sup> */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <p>
                {t('practice.perbandingan.perbandinganUmum.q7.pre')}<sup>2</sup>
                {t('practice.perbandingan.perbandinganUmum.q7.mid')}<sup>2</sup>
                {t('practice.perbandingan.perbandinganUmum.q7.end')}
              </p>
            </div>

            {/* Soal 8 — InlineMath in the middle */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <p>
                {t('practice.perbandingan.perbandinganUmum.q8.pre')}
                <InlineMath math="5 : 3" />
                {t('practice.perbandingan.perbandinganUmum.q8.post')}
              </p>
            </div>

            {/* Soal 9 — InlineMath + cm³ */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <p>
                {t('practice.perbandingan.perbandinganUmum.q9.pre')}
                <InlineMath math="4 : 3 : 2" />
                {t('practice.perbandingan.perbandinganUmum.q9.mid')}<sup>3</sup>
                {t('practice.perbandingan.perbandinganUmum.q9.end')}
              </p>
            </div>

            {/* Soal 10 — InlineMath in the middle */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <p>
                {t('practice.perbandingan.perbandinganUmum.q10.pre')}
                <InlineMath math="4 : 5 : 7" />
                {t('practice.perbandingan.perbandinganUmum.q10.post')}
              </p>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/perbandingan"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('practice.perbandingan.perbandinganUmum.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganUmumPage;
