import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PPNPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PAJAK PERTAMBAHAN NILAI (PPN)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Aritmetika Sosial</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Sebuah televisi dijual dengan harga Rp2.000.000. Jika pembeli dikenakan PPN sebesar 11%, berapakah nominal PPN yang harus dibayar?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp200.000</p>
                  <p>B. Rp211.000</p>
                  <p>C. Rp220.000</p>
                  <p>D. Rp2.220.000</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Ayah membeli kulkas seharga Rp3.000.000. Karena dikenakan PPN 10%, berapakah total uang yang harus dibayarkan ayah?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp3.000.000</p>
                  <p>B. Rp3.100.000</p>
                  <p>C. Rp3.300.000</p>
                  <p>D. Rp3.500.000</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">PPN sebesar 11% dari sebuah barang adalah Rp55.000. Berapakah harga awal barang tersebut sebelum dikenakan PPN?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp500.000</p>
                  <p>B. Rp550.000</p>
                  <p>C. Rp600.000</p>
                  <p>D. Rp605.000</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Andi membeli laptop dan membayar total sebesar Rp4.440.000. Jika harga tersebut sudah termasuk PPN 11%, berapakah harga laptop sebelum PPN?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp3.900.000</p>
                  <p>B. Rp4.000.000</p>
                  <p>C. Rp4.100.000</p>
                  <p>D. Rp4.400.000</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Rina membeli sepatu seharga Rp250.000. Saat di kasir, ia harus membayar Rp275.000. Berapa persentase PPN yang dibebankan kepada Rina?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 5%</p>
                  <p>B. 10%</p>
                  <p>C. 11%</p>
                  <p>D. 12%</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Budi membeli buku dengan harga Rp100.000 dan dikenakan PPN 11%. Jika ia membayar dengan uang selembar Rp150.000, berapakah uang kembaliannya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp39.000</p>
                  <p>B. Rp40.000</p>
                  <p>C. Rp45.000</p>
                  <p>D. Rp50.000</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">Sebuah jaket harganya Rp500.000. Toko memberikan diskon 20%, namun setelah diskon dikenakan PPN 10%. Berapakah harga akhir yang harus dibayar?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp350.000</p>
                  <p>B. Rp400.000</p>
                  <p>C. Rp440.000</p>
                  <p>D. Rp450.000</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">Pak Rahmat memborong 5 lusin buku tulis. Harga 1 lusin adalah Rp30.000 belum termasuk PPN 11%. Jika Pak Rahmat mendapat potongan harga total Rp15.000 sebelum pajak, berapakah yang harus ia bayar?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp145.000</p>
                  <p>B. Rp149.850</p>
                  <p>C. Rp151.500</p>
                  <p>D. Rp166.500</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Toko A menjual sepeda seharga Rp1.000.000 dengan diskon 20% (tanpa PPN). Toko B menjual sepeda yang sama seharga Rp900.000 dengan diskon 10% namun dikenakan PPN 11% setelah diskon. Jika kamu ingin membeli sepeda yang paling murah, selisih harga dari kedua toko tersebut adalah...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Toko A lebih murah Rp99.100</p>
                  <p>B. Toko A lebih murah Rp89.100</p>
                  <p>C. Toko B lebih murah Rp10.000</p>
                  <p>D. Toko B lebih murah Rp11.100</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">Pemerintah mengumumkan kenaikan tarif PPN dari 10% menjadi 11%. Jika Dimas rutin berbelanja bulanan dengan nilai Rp2.000.000 (sebelum PPN), berapa tambahan pengeluaran ekstra yang harus ditanggung Dimas dalam setahun hanya karena kenaikan tarif PPN tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp20.000</p>
                  <p>B. Rp120.000</p>
                  <p>C. Rp240.000</p>
                  <p>D. Rp440.000</p>
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

export default PPNPage;
