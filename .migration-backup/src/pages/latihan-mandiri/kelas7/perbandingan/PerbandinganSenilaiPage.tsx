import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PerbandinganSenilaiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERBANDINGAN SENILAI DAN BERBALIK NILAI
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Perbandingan</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Di antara pernyataan-pernyataan berikut, tentukan mana yang merupakan perbandingan senilai, perbandingan berbalik nilai, atau bukan keduanya!</p>
                <ol className="list-[lower-alpha] list-inside space-y-1 ml-2">
                  <li>Kecepatan rata-rata sebuah mobil dengan waktu tempuh untuk mencapai kota tujuan.</li>
                  <li>Jumlah porsi resep kue dengan takaran gram tepung terigu yang dibutuhkan.</li>
                  <li>Usia seseorang dengan ukuran sepatu yang dipakainya.</li>
                  <li>Jarak tempuh sebuah taksi dengan total argo yang harus dibayar penumpang.</li>
                  <li>Jumlah halaman sebuah buku novel dengan waktu yang dibutuhkan untuk membacanya sampai tamat.</li>
                  <li>Banyaknya pompa air yang dihidupkan dengan waktu yang dibutuhkan untuk mengosongkan kolam renang.</li>
                  <li>Jumlah saudara kandung yang dimiliki seorang siswa dengan nilai ujian matematikanya.</li>
                  <li>Debit air yang keluar dari keran dengan volume air yang tertampung di dalam ember pada waktu tertentu.</li>
                </ol>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <p>Sebuah mobil membutuhkan 4 liter bensin untuk menempuh jarak sejauh 60 km. Jika mobil tersebut diisi dengan 10 liter bensin, tentukan jarak maksimal yang dapat ditempuh oleh mobil tersebut!</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <p>Seorang peternak memiliki persediaan makanan ternak yang cukup untuk memberi makan 30 ekor sapi selama 15 hari. Jika peternak tersebut baru saja membeli 15 ekor sapi lagi, berapa hari persediaan makanan tersebut akan habis?</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <p>Sebuah mesin cetak foto digital membutuhkan waktu 5 menit untuk mencetak 60 lembar foto beresolusi tinggi. Berapa menit waktu yang diperlukan mesin tersebut jika harus mencetak pesanan sebanyak 84 lembar foto?</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <p>Sebuah tempat penampungan hewan (shelter) memiliki persediaan makanan (dry food) yang cukup untuk 20 ekor kucing peliharaan selama 25 hari. Berapa hari persediaan makanan tersebut akan habis jika shelter tersebut menerima tambahan penghuni sebanyak 5 ekor kucing lagi?</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <p>Adi dapat menyelesaikan suatu pekerjaan selama 4 jam. Budi dapat menyelesaikan pekerjaan yang sama dalam waktu 6 jam. Jika pekerjaan tersebut dikerjakan adi dan budi bersama sama, maka pekerjaan tersebut akan selesai dalam waktu ...</p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <p>Mesin P dapat mengisi tangki sampai penuh dalam 2 jam, mesin Q dalam 5 jam, dan mesin R dalam 10 jam. Jika ketiga mesin dinyalakan secara bersamaan, berapa waktu yang diperlukan hingga tangki terisi penuh?</p>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <p>Persiapan sebuah panggung festival budaya diperkirakan selesai dalam waktu 24 hari jika dikerjakan oleh 6 orang teknisi. Setelah dikerjakan selama 4 hari, pekerjaan terpaksa dihentikan selama 8 hari karena badai. Agar persiapan panggung selesai tepat waktu sesuai rencana awal, berapa banyak tambahan teknisi yang diperlukan?</p>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <p>Sebuah pesanan seragam sekolah dapat diselesaikan oleh 4 orang penjahit dalam waktu 20 hari. Setelah mereka bekerja selama 4 hari, pasokan listrik terputus sehingga pekerjaan terhenti total selama 12 hari. Berapa banyak tambahan penjahit yang dibutuhkan agar pesanan seragam tersebut dapat diselesaikan tepat waktu?</p>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <p>Sebuah pesanan katering pernikahan raksasa jika dikerjakan oleh 3 orang Chef utama akan selesai dalam waktu 10 hari, sedangkan jika dikerjakan oleh 8 orang asisten dapur akan selesai dalam waktu 9 hari. Jika pesanan tersebut dikerjakan secara bersama-sama oleh 5 Chef utama dan 6 asisten dapur, dalam waktu berapa hari pesanan katering itu akan selesai?</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/perbandingan"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Perbandingan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganSenilaiPage;
