import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const BungaTunggalPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.aritmetikaSosial.bungaTunggal.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.aritmetikaSosial.bungaTunggal.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.aritmetikaSosial.bungaTunggal.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q1.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q1.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q1.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q1.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q1.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q2.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q2.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q2.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q2.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q2.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q3.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q3.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q3.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q3.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q3.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q4.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q4.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q4.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q4.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q4.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q5.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q5.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q5.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q5.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q5.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q6.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q6.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q6.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q6.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q6.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q7.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q7.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q7.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q7.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q7.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q8.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q8.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q8.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q8.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q8.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q9.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q9.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q9.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q9.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q9.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q10.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q10.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q10.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q10.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q10.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q11.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q11.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q11.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q11.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q11.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q12.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q12.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q12.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q12.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q12.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 13 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">13.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q13.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q13.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q13.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q13.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q13.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 14 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">14.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q14.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q14.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q14.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q14.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q14.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 15 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">15.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q15.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q15.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q15.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q15.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q15.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 16 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">16.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q16.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q16.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q16.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q16.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q16.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 17 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">17.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q17.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q17.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q17.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q17.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q17.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 18 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">18.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q18.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q18.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q18.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q18.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q18.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 19 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">19.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q19.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q19.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q19.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q19.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q19.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 20 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">20.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q20.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q20.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q20.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q20.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q20.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 21 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">21.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q21.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q21.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q21.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q21.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q21.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 22 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">22.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.bungaTunggal.q22.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q22.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q22.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q22.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.bungaTunggal.q22.optD')}</p>
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
            {t('practice.aritmetikaSosial.bungaTunggal.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BungaTunggalPage;
