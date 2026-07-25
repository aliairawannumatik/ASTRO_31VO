import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PerbandinganSkalaPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.perbandingan.perbandinganSkala.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.perbandingan.perbandinganSkala.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.perbandingan.perbandinganSkala.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q1.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q1.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q1.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q1.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q1.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q2.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q2.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q2.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q2.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q2.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q3.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q3.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q3.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q3.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q3.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q4.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q4.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q4.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q4.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q4.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q5.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q5.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q5.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q5.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q5.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q6.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q6.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q6.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q6.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q6.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 7 — static image, two text paragraphs, options with m² */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q7.stemIntro')}</p>
                <div className="mb-3 flex justify-center">
                  <img
                    src={"/images/image_1777478280088.png"}
                    alt={t('practice.perbandingan.perbandinganSkala.q7.imgAlt')}
                    className="max-w-full md:max-w-md rounded-lg border border-border shadow-lg"
                  />
                </div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q7.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q7.optA')}<sup>2</sup></p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q7.optB')}<sup>2</sup></p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q7.optC')}<sup>2</sup></p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q7.optD')}<sup>2</sup></p>
                </div>
              </div>
            </div>

            {/* Soal 8 — stem with cm², options with m² */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-3">
                  {t('practice.perbandingan.perbandinganSkala.q8.stemPre')}<sup>2</sup>
                  {t('practice.perbandingan.perbandinganSkala.q8.stemPost')}
                </p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q8.optA')}<sup>2</sup></p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q8.optB')}<sup>2</sup></p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q8.optC')}<sup>2</sup></p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q8.optD')}<sup>2</sup></p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q9.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q9.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q9.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q9.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q9.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-3">{t('practice.perbandingan.perbandinganSkala.q10.stem')}</p>
                <div className="space-y-1 ml-4">
                  <p>{t('practice.perbandingan.perbandinganSkala.q10.optA')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q10.optB')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q10.optC')}</p>
                  <p>{t('practice.perbandingan.perbandinganSkala.q10.optD')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/perbandingan"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('practice.perbandingan.perbandinganSkala.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganSkalaPage;
