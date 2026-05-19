import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const DiskonPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          DISKON
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Aritmetika Sosial</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Sebuah toko sepatu memberikan diskon 15% untuk semua produk. Jika harga awal sepasang sepatu adalah Rp200.000, berapa besar potongan harga yang didapatkan pembeli?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp30.000</p>
                  <p>B. Rp170.000</p>
                  <p>C. Rp20.000</p>
                  <p>D. Rp15.000</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Sebuah buku seharga Rp80.000 sedang didiskon sebesar 25%. Berapakah harga akhir yang harus dibayar oleh pembeli?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp55.000</p>
                  <p>B. Rp20.000</p>
                  <p>C. Rp60.000</p>
                  <p>D. Rp75.000</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">Kemeja yang awalnya berharga Rp150.000 dijual dengan harga Rp120.000. Berapa persentase diskon yang diberikan untuk kemeja tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 15%</p>
                  <p>B. 20%</p>
                  <p>C. 25%</p>
                  <p>D. 30%</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Setelah mendapat diskon 20%, Andi membayar sebuah tas seharga Rp160.000. Berapa harga awal tas tersebut sebelum diberi diskon?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp240.000</p>
                  <p>B. Rp192.000</p>
                  <p>C. Rp220.000</p>
                  <p>D. Rp200.000</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Data harga dan diskon sepatu dan kaos dari ke-empat toko sebagai berikut:</p>
                <div className="mb-2">
                  <table className="w-full text-xs border border-white/20">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-2 py-1 text-left">Toko</th>
                        <th className="border border-white/20 px-2 py-1 text-center">Sepatu<br/><span className="font-normal text-white/60">Rp140.000</span></th>
                        <th className="border border-white/20 px-2 py-1 text-center">Kaos<br/><span className="font-normal text-white/60">Rp100.000</span></th>
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
                <p className="mb-2">Jika Febian akan membeli sepatu dan kaos, maka toko yang dipilihnya adalah</p>
                <div className="ml-4 space-y-1">
                  <p>A. Toko Damai</p>
                  <p>B. Toko Tentram</p>
                  <p>C. Toko Rukun</p>
                  <p>D. Toko Sentosa</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Untuk barang seharga Rp250.000, Toko A memberikan potongan langsung sebesar Rp50.000, sedangkan Toko B memberikan diskon 25%. Manakah pernyataan yang benar?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Harga di Toko B lebih murah.</p>
                  <p>B. Diskon Toko A setara dengan 25%.</p>
                  <p>C. Toko A dan Toko B memberikan potongan yang sama.</p>
                  <p>D. Harga di Toko A lebih murah.</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">{"Sebuah toko pakaian memasang plang promo 'Diskon 50% + 20%'. Jika harga awal jaket adalah Rp400.000, berapakah harga yang harus dibayar di kasir?"}</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp140.000</p>
                  <p>B. Rp280.000</p>
                  <p>C. Rp160.000</p>
                  <p>D. Rp120.000</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">{"Sebuah minimarket mengadakan promo 'Beli 2 Gratis 1' untuk produk sabun mandi. Jika dilihat secara matematis, promo ini setara dengan diskon per item sebesar..."}</p>
                <div className="ml-4 space-y-1">
                  <p>A. 33,33%</p>
                  <p>B. 25%</p>
                  <p>C. 66,67%</p>
                  <p>D. 50%</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Seorang pedagang membeli suatu barang dengan modal Rp100.000. Ia ingin memberikan diskon 20% pada pelanggannya, namun tetap ingin mendapat keuntungan bersih 20% dari modal awalnya. Berapa harga label yang harus dipasang pedagang tersebut?</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp150.000</p>
                  <p>B. Rp140.000</p>
                  <p>C. Rp120.000</p>
                  <p>D. Rp144.000</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">{"Sebuah barang dinaikkan harganya sebesar 25% dari harga normal. Seminggu kemudian, toko tersebut mengadakan 'Sale' dan memberikan diskon 20% pada barang tersebut. Bagaimana perbandingan harga akhir barang tersebut terhadap harga normalnya (harga awal)?"}</p>
                <div className="ml-4 space-y-1">
                  <p>A. Lebih mahal 5%</p>
                  <p>B. Lebih murah 5%</p>
                  <p>C. Lebih mahal 10%</p>
                  <p>D. Harganya tetap sama dengan harga awal</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">{"Untuk barang elektronik dengan harga awal yang sama, Toko X menawarkan diskon bertingkat '30% + 10%', sedangkan Toko Y menawarkan diskon '20% + 20%'. Manakah pilihan yang memberikan harga paling murah bagi pembeli?"}</p>
                <div className="ml-4 space-y-1">
                  <p>A. Toko Y lebih murah</p>
                  <p>B. Keduanya sama murah</p>
                  <p>C. Toko X lebih murah</p>
                  <p>D. Tidak dapat ditentukan</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">Menjelang tahun baru, harga sebuah kacamata dipotong (didiskon) dua kali seperti dinyatakan pada tanda berikut. Seorang pembeli membayar Rp168.750,00 untuk kacamata tersebut. Berapa harga kacamata tersebut sebelum dipotong harganya?</p>
                <div className="bg-white/10 px-3 py-2 rounded mb-2 inline-block">
                  <p className="font-bold">Diskon 50% + 10%</p>
                </div>
                <div className="ml-4 space-y-1">
                  <p>A. Rp262.500,00</p>
                  <p>B. Rp281.250,00</p>
                  <p>C. Rp375.000,00</p>
                  <p>D. Rp421.675,00</p>
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

export default DiskonPage;
