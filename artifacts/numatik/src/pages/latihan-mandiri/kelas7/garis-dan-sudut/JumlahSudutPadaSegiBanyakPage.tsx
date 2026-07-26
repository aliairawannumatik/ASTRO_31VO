import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const isianPendek = [
  { label: "a", img: "/images/a_1774854403970.png" },
  { label: "b", img: "/images/b_1774854403971.png" },
  { label: "c", img: "/images/c_1774854403971.png" },
  { label: "d", img: "/images/d_1774854403971.png" },
  { label: "e", img: "/images/e_1774854403972.png" },
  { label: "f", img: "/images/f_1774854403972.png" },
  { label: "g", img: "/images/g_1774854403972.png" },
  { label: "h", img: "/images/h_1774854403972.png" },
];

const JumlahSudutPadaSegiBanyakPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.garisDanSudut.jumlahSudutSegiBanyak.title')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.garisDanSudut.jumlahSudutSegiBanyak.pageSubtitle')}
        </p>

        {/* Bagian I */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-accent text-sm font-bold mb-2 font-display">
            {t('practice.garisDanSudut.jumlahSudutSegiBanyak.sectionI')}
          </p>
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.garisDanSudut.jumlahSudutSegiBanyak.instructionI')}
          </p>

          <div className="space-y-8 text-white/90 font-body text-sm leading-relaxed">
            {isianPendek.map((soal) => (
              <div key={soal.label} className="border-l-2 border-accent/50 pl-4 flex gap-3 items-start">
                <span className="font-semibold text-accent shrink-0 mt-2">{soal.label})</span>
                <div className="py-1">
                  <img
                    src={soal.img}
                    alt={`Soal ${soal.label}`}
                    className="w-full max-w-[260px] object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian II */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-accent text-sm font-bold mb-2 font-display">Bagian II — {t('practice.multipleChoice')}</p>
          <p className="text-yellow-400 text-sm mb-6 font-body">
            {t('practice.garisDanSudut.jumlahSudutSegiBanyak.instructionII')}
          </p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">

            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q1.stem')}</p>
                <img src={"/images/no_1_1774856118751.png"} alt="Soal nomor 1" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q1.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q1.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q1.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q1.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q2.stem')}</p>
                <img src={"/images/no_2_1774856118751.png"} alt="Soal nomor 2" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q2.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q2.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q2.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q2.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q3.stem')}</p>
                <img src={"/images/no_3_1774856118752.png"} alt="Soal nomor 3" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q3.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q3.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q3.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q3.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q4.stem')}</p>
                <img src={"/images/no_4_1774856118752.png"} alt="Soal nomor 4" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q4.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q4.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q4.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q4.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q5.stem')}</p>
                <img src={"/images/no_5_1774856118752.png"} alt="Soal nomor 5" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q5.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q5.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q5.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q5.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q6.stem')}</p>
                <img src={"/images/no_6_1774856118752.png"} alt="Soal nomor 6" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q6.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q6.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q6.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q6.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q7.stem')}</p>
                <img src={"/images/no_7_1774856118753.png"} alt="Soal nomor 7" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q7.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q7.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q7.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q7.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q8.stem')}</p>
                <img src={"/images/no_8_1774856118753.png"} alt="Soal nomor 8" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q8.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q8.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q8.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q8.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q9.stem')}</p>
                <img src={"/images/no_9_1774856118753.png"} alt="Soal nomor 9" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q9.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q9.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q9.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q9.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q10.stem')}</p>
                <img src={"/images/no_10_1774856118754.png"} alt="Soal nomor 10" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q10.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q10.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q10.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q10.optD')}</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-3">{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q11.stem')}</p>
                <img src={"/images/no_11_1774856118754.png"} alt="Soal nomor 11" className="w-full max-w-[320px] object-contain mb-3" />
                <div className="ml-4 space-y-1">
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q11.optA')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q11.optB')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q11.optC')}</p>
                  <p>{t('practice.garisDanSudut.jumlahSudutSegiBanyak.q11.optD')}</p>
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
            {t('practice.garisDanSudut.jumlahSudutSegiBanyak.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JumlahSudutPadaSegiBanyakPage;
