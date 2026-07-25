import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const DiskonPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.aritmetikaSosial.diskon.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.aritmetikaSosial.diskon.pageSubtitle')}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.aritmetikaSosial.diskon.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q1.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q1.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q1.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q1.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q1.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q2.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q2.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q2.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q2.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q2.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q3.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q3.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q3.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q3.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q3.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q4.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q4.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q4.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q4.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q4.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q5.stem')}</p>
                <div className="mb-2">
                  <table className="w-full text-xs border border-white/20">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-2 py-1 text-left">{t('practice.aritmetikaSosial.diskon.q5.colStore')}</th>
                        <th className="border border-white/20 px-2 py-1 text-center">{t('practice.aritmetikaSosial.diskon.q5.colShoes')}<br/><span className="font-normal text-white/60">Rp140.000</span></th>
                        <th className="border border-white/20 px-2 py-1 text-center">{t('practice.aritmetikaSosial.diskon.q5.colTshirt')}<br/><span className="font-normal text-white/60">Rp100.000</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-white/20 px-2 py-1 font-semibold">Toko Damai</td>
                        <td className="border border-white/20 px-2 py-1 text-center">20%</td>
                        <td className="border border-white/20 px-2 py-1 text-center">25%</td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="border border-white/20 px-2 py-1 font-semibold">Toko Tentram</td>
                        <td className="border border-white/20 px-2 py-1 text-center">25%</td>
                        <td className="border border-white/20 px-2 py-1 text-center">20%</td>
                      </tr>
                      <tr>
                        <td className="border border-white/20 px-2 py-1 font-semibold">Toko Rukun</td>
                        <td className="border border-white/20 px-2 py-1 text-center">15%</td>
                        <td className="border border-white/20 px-2 py-1 text-center">30%</td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="border border-white/20 px-2 py-1 font-semibold">Toko Sentosa</td>
                        <td className="border border-white/20 px-2 py-1 text-center">30%</td>
                        <td className="border border-white/20 px-2 py-1 text-center">15%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q5.question')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q5.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q5.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q5.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q5.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q6.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q6.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q6.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q6.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q6.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q7.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q7.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q7.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q7.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q7.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q8.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q8.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q8.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q8.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q8.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q9.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q9.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q9.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q9.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q9.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q10.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q10.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q10.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q10.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q10.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q11.stem')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q11.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q11.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q11.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q11.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">{t('practice.aritmetikaSosial.diskon.q12.stem')}</p>
                <div className="bg-white/10 px-3 py-2 rounded mb-2 inline-block">
                  <p className="font-bold">{t('practice.aritmetikaSosial.diskon.q12.highlightBox')}</p>
                </div>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.aritmetikaSosial.diskon.q12.optA')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q12.optB')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q12.optC')}</p>
                  <p>{t('practice.aritmetikaSosial.diskon.q12.optD')}</p>
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
            {t('practice.aritmetikaSosial.diskon.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiskonPage;
