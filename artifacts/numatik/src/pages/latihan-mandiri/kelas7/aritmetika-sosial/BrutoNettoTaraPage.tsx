import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const BrutoNettoTaraPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.aritmetikaSosial.brutoNettoTara.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.aritmetikaSosial.brutoNettoTara.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.aritmetikaSosial.brutoNettoTara.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q1.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q1.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q1.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q1.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q1.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q2.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q2.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q2.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q2.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q2.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q3.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q3.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q3.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q3.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q3.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q4.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q4.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q4.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q4.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q4.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q5.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q5.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q5.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q5.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q5.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q6.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q6.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q6.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q6.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q6.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q7.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q7.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q7.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q7.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q7.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q8.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q8.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q8.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q8.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q8.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q9.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q9.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q9.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q9.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q9.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q10.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q10.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q10.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q10.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q10.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q11.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q11.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q11.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q11.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q11.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q12.stem')}</p>
                <ul className="list-disc ml-6 mb-2">
                  <li>{t('practice.aritmetikaSosial.brutoNettoTara.q12.itemA')}</li>
                  <li>{t('practice.aritmetikaSosial.brutoNettoTara.q12.itemB')}</li>
                </ul>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q12.question')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q12.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q12.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q12.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q12.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 13 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">13.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q13.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q13.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q13.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q13.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q13.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 14 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">14.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q14.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q14.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q14.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q14.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q14.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 15 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">15.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.brutoNettoTara.q15.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q15.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q15.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q15.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.brutoNettoTara.q15.optD')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/aritmetika-sosial"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('practice.aritmetikaSosial.brutoNettoTara.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrutoNettoTaraPage;
