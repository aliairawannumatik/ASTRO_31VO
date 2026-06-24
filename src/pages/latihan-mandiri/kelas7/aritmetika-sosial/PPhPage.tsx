import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PPhPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PAJAK PENGHASILAN (PPH)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Aritmetika Sosial</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Ayah menerima gaji sebesar Rp5.000.000. Jika gaji tersebut dipotong Pajak Penghasilan (PPh) sebesar 5%, berapa potongan pajaknya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp50.000</p>
                  <p>B. Rp200.000</p>
                  <p>C. Rp250.000</p>
                  <p>D. Rp500.000</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Pak Rahmat memenangkan kuis berhadiah Rp10.000.000. Hadiah tersebut dikenakan PPh final sebesar 20%. Berapa uang tunai yang diterima Pak Rahmat?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp2.000.000</p>
                  <p>B. Rp8.000.000</p>
                  <p>C. Rp9.800.000</p>
                  <p>D. Rp12.000.000</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">Jika potongan PPh dari gaji seorang karyawan adalah Rp150.000 dan gaji bersih yang diterimanya adalah Rp2.850.000, berapakah gaji kotor karyawan tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp2.700.000</p>
                  <p>B. Rp3.000.000</p>
                  <p>C. Rp3.150.000</p>
                  <p>D. Rp3.300.000</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Seorang karyawan menerima gaji bersih Rp4.750.000 setelah dipotong PPh 5%. Berapakah gaji kotor (gaji sebelum pajak) karyawan tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp4.500.000</p>
                  <p>B. Rp4.987.500</p>
                  <p>C. Rp5.000.000</p>
                  <p>D. Rp5.250.000</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Gaji awal Kakak adalah Rp8.000.000. Namun, negara memberikan kebijakan bebas pajak (Penghasilan Tidak Kena Pajak/PTKP) untuk Rp3.000.000 pertama. Jika sisa gajinya dikenakan PPh 5%, berapa pajak yang harus dibayar Kakak?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp150.000</p>
                  <p>B. Rp250.000</p>
                  <p>C. Rp400.000</p>
                  <p>D. Rp550.000</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Potongan PPh gaji seorang karyawan sebuah PT adalah Rp400.000, yang merupakan 10% dari gaji totalnya. Berapakah gaji bersih yang dibawa pulang karyawan PT tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp3.600.000</p>
                  <p>B. Rp4.000.000</p>
                  <p>C. Rp4.400.000</p>
                  <p>D. Rp4.600.000</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">Anton mendapat bonus tahunan Rp2.500.000 dan dipotong PPh 15%. Berapa total uang bonus bersih yang Anton terima?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp375.000</p>
                  <p>B. Rp2.125.000</p>
                  <p>C. Rp2.350.000</p>
                  <p>D. Rp2.875.000</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">Gaji kotor Pak Anton adalah Rp7.000.000 per bulan. Diketahui Penghasilan Tidak Kena Pajak (PTKP) adalah Rp4.000.000. Jika atas Penghasilan Kena Pajaknya dikenakan tarif PPh 5%, berapakah total gaji bersih Pak Anton dalam 1 tahun?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp81.600.000</p>
                  <p>B. Rp82.200.000</p>
                  <p>C. Rp83.800.000</p>
                  <p>D. Rp84.000.000</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Tante Siska menerima gaji bersih Rp6.650.000. Jika gaji tersebut telah dipotong PPh 5% dari Penghasilan Kena Pajak, dan diketahui Penghasilan Tidak Kena Pajak (PTKP) Tante Siska adalah Rp3.000.000, berapakah gaji kotornya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp6.800.000</p>
                  <p>B. Rp6.900.000</p>
                  <p>C. Rp7.000.000</p>
                  <p>D. Rp7.150.000</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">Fajar ditawari dua pekerjaan. Perusahaan A menawarkan gaji Rp8.000.000 dengan PPh 5%. Perusahaan B menawarkan gaji Rp8.500.000 dengan PPh 10%. Perusahaan mana yang memberikan gaji bersih lebih besar dan berapa selisihnya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Perusahaan A lebih besar Rp50.000</p>
                  <p>B. Perusahaan B lebih besar Rp50.000</p>
                  <p>C. Perusahaan A lebih besar Rp100.000</p>
                  <p>D. Perusahaan B lebih besar Rp100.000</p>
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
            Kembali ke Aritmetika Sosial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PPhPage;
