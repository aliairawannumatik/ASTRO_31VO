import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const SifatSudutDuaGarisSejajarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.garisDanSudut.sifatSudutSejajar.title1')}<br />
          {t('practice.garisDanSudut.sifatSudutSejajar.title2')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.garisDanSudut.sifatSudutSejajar.pageSubtitle')}
        </p>

        {/* Bagian I */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-accent text-sm font-bold mb-2 font-display">Bagian I — {t('practice.multipleChoice')}</p>
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.garisDanSudut.sifatSudutSejajar.instruction')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">

            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q1.stem')}</p>
                <img src={"/images/NO_1_1774842809807.png"} alt="Soal 1" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q1.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q1.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q1.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q1.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q2.stem')}</p>
                <img src={"/images/NO_2_1774842809808.png"} alt="Soal 2" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 mb-2 space-y-1 text-white/70">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.item1')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.item2')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.item3')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.item4')}</p>
                </div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q2.question')}</p>
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q2.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q3.stem')}</p>
                <img src={"/images/NO_3_1774842809808.png"} alt="Soal 3" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q3.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q3.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q3.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q3.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q4.stem')}</p>
                <img src={"/images/NO_4_1774842809809.png"} alt="Soal 4" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q4.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q4.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q4.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q4.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q5.stem')}</p>
                <img src={"/images/NO_5_1774842809809.png"} alt="Soal 5" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q5.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q5.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q5.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q5.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q6.stem')}</p>
                <img src={"/images/NO_6_1774842809810.png"} alt="Soal 6" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q6.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q6.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q6.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q6.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q7.stem')}</p>
                <img src={"/images/NO_7_1774842809810.png"} alt="Soal 7" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q7.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q7.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q7.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q7.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q8.stem')}</p>
                <img src={"/images/NO_8_1774842809810.png"} alt="Soal 8" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q8.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q8.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q8.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q8.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q9.stem')}</p>
                <img src={"/images/NO_9_1774842809811.png"} alt="Soal 9" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q9.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q9.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q9.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q9.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">{t('practice.garisDanSudut.sifatSudutSejajar.q10.stem')}</p>
                <img src={"/images/NO_10_1774842809811.png"} alt="Soal 10" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q10.optA')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q10.optB')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q10.optC')}</p>
                  <p>{t('practice.garisDanSudut.sifatSudutSejajar.q10.optD')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/garis-dan-sudut"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('practice.garisDanSudut.sifatSudutSejajar.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SifatSudutDuaGarisSejajarPage;
