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
          BRUTO, NETTO DAN TARA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Aritmetika Sosial</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Apa yang dimaksud dengan Netto dalam istilah perdagangan?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Potongan harga dari suatu barang.</p>
                  <p>B. Berat kemasan suatu barang.</p>
                  <p>C. Berat kotor barang beserta kemasannya.</p>
                  <p>D. Berat bersih barang tanpa kemasannya.</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Sekarung beras memiliki Bruto 50 kg dan Tara 1 kg. Berapakah Netto beras tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 50 kg</p>
                  <p>B. 51 kg</p>
                  <p>C. 48 kg</p>
                  <p>D. 49 kg</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">Sekotak buah jeruk memiliki Bruto 25 kg dan Netto 24 kg. Berapa persentase Tara kotak jeruk tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 10%</p>
                  <p>B. 2%</p>
                  <p>C. 5%</p>
                  <p>D. 4%</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Sebuah peti telur memiliki Bruto 20 kg dengan Tara 5%. Berapakah Netto telur tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 21 kg</p>
                  <p>B. 15 kg</p>
                  <p>C. 19 kg</p>
                  <p>D. 18 kg</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Sebuah drum berisi minyak goreng memiliki Netto 95 liter. Jika diketahui Tara drum tersebut adalah 5%, berapakah Bruto drum beserta isinya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 110 liter</p>
                  <p>B. 105 liter</p>
                  <p>C. 90 liter</p>
                  <p>D. 100 liter</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Ibu membeli sekarung gula pasir dengan Bruto 50 kg dan Tara 2%. Jika harga gula pasir Rp12.000,00 per kg, berapa uang yang harus dibayarkan Ibu untuk gula tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp588.000,00</p>
                  <p>B. Rp500.000,00</p>
                  <p>C. Rp600.000,00</p>
                  <p>D. Rp576.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">Sebuah toko memberi diskon 10% untuk pembelian 1 peti mangga. Peti memiliki Bruto 40 kg dan Tara 5%. Harga mangga (berdasarkan Netto) sebelum diskon adalah Rp15.000,00/kg. Berapa yang harus dibayar pembeli untuk 1 peti mangga?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp570.000,00</p>
                  <p>B. Rp513.000,00</p>
                  <p>C. Rp486.000,00</p>
                  <p>D. Rp540.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">Pak Budi membeli 2 karung kedelai dengan Bruto masing-masing 100 kg dan Tara 2%. Harga beli keseluruhan adalah Rp1.960.000,00. Jika ia menjual kembali kedelai tersebut dengan harga Rp12.000,00 per kg netto, berapakah keuntungan totalnya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp292.000,00</p>
                  <p>B. Rp400.000,00</p>
                  <p>C. Rp440.000,00</p>
                  <p>D. Rp392.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Terdapat dua merek tepung terigu. Merek A: Bruto 25 kg, Tara 2%, dijual Rp245.000,00. Merek B: Netto 24 kg dijual Rp235.200,00. Pernyataan mana yang paling tepat untuk mencari harga termurah per kilogram netto?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Merek A lebih murah karena harga per kilogramnya Rp10.000,00.</p>
                  <p>B. Merek B lebih murah karena harga per kilogramnya Rp9.800,00.</p>
                  <p>C. Merek A dan Merek B sama murahnya karena harga per kilogramnya Rp10.000,00.</p>
                  <p>D. Merek A lebih murah karena harga per kilogramnya Rp9.800,00.</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">Pak Ali membeli 5 kaleng cat dengan harga total Rp2.500.000,00. Tiap kaleng memiliki Bruto 26 kg dan Netto 25 kg. Setelah cat habis, kaleng kosong (Tara) laku dijual Rp2.000,00/kg ke pengepul. Berapakah harga pokok cat per kilogram (netto) yang sebenarnya ditanggung Pak Ali?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp20.000,00</p>
                  <p>B. Rp19.800,00</p>
                  <p>C. Rp19.920,00</p>
                  <p>D. Rp20.080,00</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">Seorang pedagang membeli satu karung beras dengan Bruto 50 kg dan Tara 2%. Harga pembelian karung beras tersebut adalah Rp5.000,00. Pedagang itu kemudian menjual beras tersebut secara eceran dengan harga Rp12.000,00 per kg (netto). Berapakah total uang yang diperoleh pedagang tersebut dari penjualan satu karung beras?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp600.000,00</p>
                  <p>B. Rp588.000,00</p>
                  <p>C. Rp583.000,00</p>
                  <p>D. Rp88.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">Seorang pembeli ingin mendapatkan harga beras (netto) yang paling murah. Ia membandingkan dua penawaran:</p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Toko A: Menjual 1 karung dengan Bruto 100 kg, Tara 2%, seharga Rp1.000.000,00.</li>
                  <li>Toko B: Menjual 1 karung dengan Bruto 100 kg, Tara 3%, seharga Rp990.000,00.</li>
                </ul>
                <p className="mb-2">Di toko manakah pembeli tersebut seharusnya berbelanja untuk mendapatkan harga per kg netto termurah?</p>
                <div className="ml-4 space-y-1">
                  <p>a. Toko A, karena harga per kg netto sekitar Rp10.204 B.</p>
                  <p>b. Toko B, karena harga per kg netto sekitar Rp10.206</p>
                  <p>c. Toko B, karena harga karungnya lebih murah (Rp990.000)</p>
                  <p>d. Sama saja, karena brutonya sama-nama 100 kg</p>
                </div>
              </div>
            </div>

            {/* Soal 13 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">13.</span>
              <div>
                <p className="mb-2">Seorang penjual mendapat keuntungan total Rp100.000,00 setelah berhasil menjual habis satu peti buah. Ia menjual buah tersebut dengan harga Rp15.000,00 per kg (netto). Peti buah yang ia beli memiliki Bruto 60 kg dan Tara (berat peti) 2 kg. Berapakah harga beli (modal) peti buah tersebut pada awalnya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp900.000,00</p>
                  <p>B. Rp870.000,00</p>
                  <p>C. Rp800.000,00</p>
                  <p>D. Rp770.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 14 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">14.</span>
              <div>
                <p className="mb-2">Sebuah kargo berisi 20 kaleng biskuit identik ditimbang dan berat kotor (Bruto) totalnya adalah 25 kg. Diketahui berat kardus kargo (Tara kargo) adalah 1 kg. Jika berat netto (biskuit) di setiap kaleng adalah 900 gram, berapakah berat tara (kemasan kaleng) dari satu kaleng biskuit?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 300 gram</p>
                  <p>B. 500 gram</p>
                  <p>C. 1.200 gram</p>
                  <p>D. 1.150 gram</p>
                </div>
              </div>
            </div>

            {/* Soal 15 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">15.</span>
              <div>
                <p className="mb-2">Sebuah toko membeli satu drum minyak goreng dengan diskon tara (potongan berat) 3%. Setelah ditimbang, berat bersih (Netto) minyak yang diterima toko adalah 97 kg. Berapakah Bruto drum minyak tersebut sebelum dihitung diskon taranya?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 99,91 kg</p>
                  <p>B. 94,09 kg</p>
                  <p>C. 100 kg</p>
                  <p>D. 103 kg</p>
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

export default BrutoNettoTaraPage;
