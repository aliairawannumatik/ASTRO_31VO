import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const PerbandinganBertingkatPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.perbandingan.perbandinganBertingkat.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.perbandingan.perbandinganBertingkat.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.perbandingan.perbandinganBertingkat.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">

            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q1.pre')}
                <InlineMath math="2 : 3" />
                {t('practice.perbandingan.perbandinganBertingkat.q1.mid')}
                <InlineMath math="3 : 5" />
                {t('practice.perbandingan.perbandinganBertingkat.q1.post')}
              </p>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q2.pre')}
                <InlineMath math="2 : 5" />
                {t('practice.perbandingan.perbandinganBertingkat.q2.mid')}
                <InlineMath math="4 : 3" />
                {t('practice.perbandingan.perbandinganBertingkat.q2.post')}
              </p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q3.pre')}
                <InlineMath math="5 : 3" />
                {t('practice.perbandingan.perbandinganBertingkat.q3.mid')}
                <InlineMath math="6 : 7" />
                {t('practice.perbandingan.perbandinganBertingkat.q3.post')}
              </p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q4.pre')}
                <InlineMath math="4 : 5" />
                {t('practice.perbandingan.perbandinganBertingkat.q4.mid')}
                <InlineMath math="5 : 6" />
                {t('practice.perbandingan.perbandinganBertingkat.q4.post')}
              </p>
            </div>

            {/* Soal 5 — sub-items split per line */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q5.pre')}
                <InlineMath math="3 : 5" />
                {t('practice.perbandingan.perbandinganBertingkat.q5.mid')}
                <InlineMath math="2 : 3" />
                {t('practice.perbandingan.perbandinganBertingkat.q5.intro')}
                <br />{t('practice.perbandingan.perbandinganBertingkat.q5.a')}
                <br />{t('practice.perbandingan.perbandinganBertingkat.q5.b')}
              </p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q6.pre')}
                <InlineMath math="3 : 4" />
                {t('practice.perbandingan.perbandinganBertingkat.q6.mid')}
                <InlineMath math="2 : 5" />
                {t('practice.perbandingan.perbandinganBertingkat.q6.post')}
              </p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q7.pre')}
                <InlineMath math="2 : 3" />
                {t('practice.perbandingan.perbandinganBertingkat.q7.mid')}
                <InlineMath math="4 : 5" />
                {t('practice.perbandingan.perbandinganBertingkat.q7.post')}
              </p>
            </div>

            {/* Soal 8 — sub-items split per line */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <p>
                {t('practice.perbandingan.perbandinganBertingkat.q8.pre')}
                <InlineMath math="5 : 7" />
                {t('practice.perbandingan.perbandinganBertingkat.q8.mid')}
                <InlineMath math="3 : 4" />
                {t('practice.perbandingan.perbandinganBertingkat.q8.intro')}
                <br />{t('practice.perbandingan.perbandinganBertingkat.q8.a')}
                <br />{t('practice.perbandingan.perbandinganBertingkat.q8.b')}
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
            {t('practice.perbandingan.perbandinganBertingkat.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganBertingkatPage;
