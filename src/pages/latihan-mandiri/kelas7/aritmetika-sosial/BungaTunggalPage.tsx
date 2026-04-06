import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const BungaTunggalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BUNGA TUNGGAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Aritmetika Sosial</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Siska menabung sebesar Rp3.000.000,00 di sebuah bank yang memberikan suku bunga tunggal 12% per tahun. Besar bunga yang diterima Siska jika ia menabung selama 6 bulan adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp120.000,00</p>
                  <p>B. Rp150.000,00</p>
                  <p>C. Rp360.000,00</p>
                  <p>D. Rp180.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Andi meminjam uang di koperasi sebesar Rp2.000.000,00 dengan bunga tunggal 8% per tahun. Total uang yang harus dikembalikan Andi setelah 1 tahun adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp2.800.000,00</p>
                  <p>B. Rp2.008.000,00</p>
                  <p>C. Rp2.080.000,00</p>
                  <p>D. Rp2.160.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">Dina menabung sebesar Rp4.000.000,00. Setelah beberapa bulan, tabungannya menjadi Rp4.320.000,00. Jika bank memberikan suku bunga tunggal 12% per tahun, lama Dina menabung adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 9 bulan</p>
                  <p>B. 10 bulan</p>
                  <p>C. 8 bulan</p>
                  <p>D. 6 bulan</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Modal sebesar Rp5.000.000,00 ditabung di bank. Setelah 8 bulan, uang tersebut menjadi Rp5.400.000,00. Suku bunga tunggal per tahun yang diberikan oleh bank adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 12%</p>
                  <p>B. 14%</p>
                  <p>C. 10%</p>
                  <p>D. 15%</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Setelah 1 tahun menabung di bank yang memberikan bunga tunggal 10% per tahun, tabungan Anton menjadi Rp2.200.000,00. Besar tabungan awal Anton adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp1.900.000,00</p>
                  <p>B. Rp2.100.000,00</p>
                  <p>C. Rp1.800.000,00</p>
                  <p>D. Rp2.000.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Sebuah lembaga keuangan memberikan suku bunga tunggal 1,5% per bulan. Jika seseorang menabung Rp2.000.000,00 selama 10 bulan, maka jumlah tabungan akhirnya adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp2.600.000,00</p>
                  <p>B. Rp2.150.000,00</p>
                  <p>C. Rp2.030.000,00</p>
                  <p>D. Rp2.300.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">Pak Rudi meminjam uang di bank sebesar Rp6.000.000,00 dengan bunga tunggal 10% per tahun. Pinjaman tersebut akan dilunasi dengan cara diangsur selama 10 bulan. Besar angsuran yang harus dibayar Pak Rudi setiap bulannya adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp650.000,00</p>
                  <p>B. Rp700.000,00</p>
                  <p>C. Rp600.000,00</p>
                  <p>D. Rp660.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">Bank A memberikan bunga tunggal 10% per tahun, sedangkan Bank B memberikan bunga tunggal 12% per tahun. Jika Rio menabung Rp5.000.000,00 di Bank A dan Rian menabung dengan jumlah yang sama di Bank B, selisih bunga yang mereka peroleh setelah 9 bulan adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp50.000,00</p>
                  <p>B. Rp100.000,00</p>
                  <p>C. Rp150.000,00</p>
                  <p>D. Rp75.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Seseorang meminjam uang sebesar Rp10.000.000,00 dengan bunga tunggal 9% per tahun. Jika ia mengembalikan pinjaman tersebut setelah 120 hari, besar bunga yang harus dibayarkan adalah ... (Anggap 1 tahun = 360 hari)</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp400.000,00</p>
                  <p>B. Rp350.000,00</p>
                  <p>C. Rp250.000,00</p>
                  <p>D. Rp300.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">Deni menabung di bank dengan suku bunga tunggal 5% per tahun. Waktu yang dibutuhkan agar uang Deni menjadi dua kali lipat dari tabungan awalnya adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 20 tahun</p>
                  <p>B. 15 tahun</p>
                  <p>C. 25 tahun</p>
                  <p>D. 10 tahun</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">Sebuah investasi menawarkan bunga tunggal sehingga modal yang diinvestasikan menjadi dua kali lipat dalam waktu 8 tahun. Persentase suku bunga per tahun dari investasi tersebut adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 12,5%</p>
                  <p>B. 18%</p>
                  <p>C. 15%</p>
                  <p>D. 12%</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">Pak Ali memiliki uang Rp10.000.000,00. Ia membaginya menjadi dua bagian untuk ditabung di Bank A dengan bunga tunggal 10% per tahun dan di Bank B dengan bunga tunggal 12% per tahun. Jika total bunga yang diterima Pak Ali dari kedua bank setelah 1 tahun adalah Rp1.160.000,00, maka besar uang yang ditabung di Bank A adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp2.000.000,00</p>
                  <p>B. Rp8.000.000,00</p>
                  <p>C. Rp6.000.000,00</p>
                  <p>D. Rp4.000.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 13 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">13.</span>
              <div>
                <p className="mb-2">Tia menabung uang sebesar Rp2.000.000,00 dengan bunga tunggal 12% per tahun, sedangkan Mia menabung sebesar Rp2.500.000,00 dengan bunga tunggal 8% per tahun. Setelah berapa tahun jumlah tabungan (modal beserta bunga) mereka akan menjadi sama?</p>
                <div className="ml-4 space-y-1">
                  <p>A. 10 tahun</p>
                  <p>B. 17,5 tahun</p>
                  <p>C. 15 tahun</p>
                  <p>D. 12,5 tahun</p>
                </div>
              </div>
            </div>

            {/* Soal 14 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">14.</span>
              <div>
                <p className="mb-2">Harga tunai sebuah sepeda motor adalah Rp10.000.000,00. Motor tersebut dapat dibeli secara kredit dengan uang muka Rp2.000.000,00 dan sisanya dicicil sebanyak 10 kali sebesar Rp900.000,00 per bulan. Suku bunga tunggal per tahun yang dibebankan pada pembelian kredit tersebut adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 10%</p>
                  <p>B. 15%</p>
                  <p>C. 18%</p>
                  <p>D. 12%</p>
                </div>
              </div>
            </div>

            {/* Soal 15 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">15.</span>
              <div>
                <p className="mb-2">Arman menabung Rp5.000.000,00. Pada 6 bulan pertama, bank memberikan bunga tunggal 10% per tahun. Pada 6 bulan berikutnya, suku bunga naik menjadi 12% per tahun. Total bunga yang diterima Arman pada akhir tahun pertama adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp600.000,00</p>
                  <p>B. Rp650.000,00</p>
                  <p>C. Rp550.000,00</p>
                  <p>D. Rp500.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 16 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">16.</span>
              <div>
                <p className="mb-2">Akibat kesalahan sistem, bunga deposito seorang nasabah dihitung menggunakan suku bunga tunggal 12% per tahun, padahal seharusnya 10% per tahun. Jika untuk periode 8 bulan selisih bunga akibat kesalahan tersebut adalah Rp80.000,00, maka nilai deposito nasabah tersebut adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp8.000.000,00</p>
                  <p>B. Rp6.000.000,00</p>
                  <p>C. Rp4.000.000,00</p>
                  <p>D. Rp5.000.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 17 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">17.</span>
              <div>
                <p className="mb-2">Perbandingan uang Tono dan Tini adalah 2:3. Tono menginvestasikan uangnya dengan bunga tunggal 15% per tahun, sedangkan Tini dengan bunga 10% per tahun. Jika jumlah bunga yang mereka berdua terima setelah 1 tahun adalah Rp1.200.000,00, maka uang awal Tono adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp2.000.000,00</p>
                  <p>B. Rp6.000.000,00</p>
                  <p>C. Rp4.000.000,00</p>
                  <p>D. Rp3.000.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 18 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">18.</span>
              <div>
                <p className="mb-2">Faraz menyimpan uang sebesar Rp. 1.200.000,00 di sebuah bank dengan bunga tunggal 15% setahun. Setelah beberapa bulan ia mengambil seluruh tabungan beserta bunganya menjadi Rp.1.260.000,00. Lama Faraz menabung adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 3 bulan</p>
                  <p>B. 4 bulan</p>
                  <p>C. 5 bulan</p>
                  <p>D. 6 bulan</p>
                </div>
              </div>
            </div>

            {/* Soal 19 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">19.</span>
              <div>
                <p className="mb-2">Hasan menyimpan uang di bank sebesar Rp. 800.000,00 dengan bunga tunggal 12% pertahun. Agar jumlah tabungannya menjadi Rp. 872.000,00, Hasan harus menabung selama ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 9 bulan</p>
                  <p>B. 7 bulan</p>
                  <p>C. 6 bulan</p>
                  <p>D. 4 bulan</p>
                </div>
              </div>
            </div>

            {/* Soal 20 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">20.</span>
              <div>
                <p className="mb-2">Kaliluna menabung Rp. 600.000,00 pada sebuah bank. Setelah 10 bulan tabungan Kaliluna menjadi Rp. 640.000,00. Persentase bunga per tahun pada bank tersebut adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. 6%</p>
                  <p>B. 6,7%</p>
                  <p>C. 8%</p>
                  <p>D. 8,5%</p>
                </div>
              </div>
            </div>

            {/* Soal 21 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">21.</span>
              <div>
                <p className="mb-2">Rafa menabung pada sebuah bank dengan bunga tunggal 16% setahun. Setelah 9 bulan uangnya menjadi Rp. 2.240.000,00. Tabungan awal Rafa adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp. 1.800.000,00</p>
                  <p>B. Rp. 1.900.000,00</p>
                  <p>C. Rp. 2.000.000,00</p>
                  <p>D. Rp. 2.100.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 22 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">22.</span>
              <div>
                <p className="mb-2">Pak Dindin meminjam uang di koperasi sebesar Rp. 4.800.000,00. Ia dikenakan bunga 24% setahun. Ia berencana mengembalikan dalam 2 tahun. Besar cicilan yang harus dibayar tiap bulan adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp296.000,00</p>
                  <p>B. Rp269.000,00</p>
                  <p>C. Rp260.000,00</p>
                  <p>D. Rp209.000,00</p>
                </div>
              </div>
            </div>

            {/* Game Quiz Section */}
            <div className="border-t border-white/20 pt-6 mt-6">
              <h3 className="text-lg font-bold text-accent mb-4 font-display">Game Quiz</h3>
            </div>

            {/* Soal 23 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">23.</span>
              <div>
                <p className="mb-2">Budi menabung di bank sebesar Rp1.000.000,00 dengan suku bunga tunggal 10% per tahun. Besar bunga yang diperoleh Budi setelah menabung selama 1 tahun adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp100.000,00</p>
                  <p>B. Rp10.000,00</p>
                  <p>C. Rp110.000,00</p>
                  <p>D. Rp50.000,00</p>
                </div>
              </div>
            </div>

            {/* Soal 24 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">24.</span>
              <div>
                <p className="mb-2">Pak Joko menyimpan uang di bank sebesar Rp1.500.000,00 dengan bunga tunggal 10% per tahun. Jumlah tabungan Pak Joko setelah 9 bulan adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp1.700.000,00</p>
                  <p>B. Rp1.612.500,00</p>
                  <p>C. Rp1.650.000,00</p>
                  <p>D. Rp1.512.500,00</p>
                </div>
              </div>
            </div>

            {/* Soal 25 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">25.</span>
              <div>
                <p className="mb-2">Ibu meminjam uang dengan sistem bunga tunggal 12% per tahun. Setelah 8 bulan, total pinjaman yang harus dikembalikan adalah Rp3.240.000,00. Besar pinjaman awal Ibu adalah ...</p>
                <div className="ml-4 space-y-1">
                  <p>A. Rp3.000.000,00</p>
                  <p>B. Rp3.100.000,00</p>
                  <p>C. Rp2.900.000,00</p>
                  <p>D. Rp2.800.000,00</p>
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

export default BungaTunggalPage;
