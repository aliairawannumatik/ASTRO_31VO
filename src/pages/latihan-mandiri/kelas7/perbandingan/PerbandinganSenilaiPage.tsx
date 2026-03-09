import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PerbandinganSenilaiPage = () => {
  const navigate = useNavigate();

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
          <h2 className="text-lg font-bold text-accent mb-4 font-display">Perbandingan Senilai dan Berbalik Nilai</h2>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">1.</p>
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

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">2.</p>
              <p>Sebuah mobil membutuhkan 4 liter bensin untuk menempuh jarak sejauh 60 km. Jika mobil tersebut diisi dengan 10 liter bensin, tentukan jarak maksimal yang dapat ditempuh oleh mobil tersebut!</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">3.</p>
              <p>Seorang peternak memiliki persediaan makanan ternak yang cukup untuk memberi makan 30 ekor sapi selama 15 hari. Jika peternak tersebut baru saja membeli 15 ekor sapi lagi, berapa hari persediaan makanan tersebut akan habis?</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">4.</p>
              <p>Sebuah mesin cetak foto digital membutuhkan waktu 5 menit untuk mencetak 60 lembar foto beresolusi tinggi. Berapa menit waktu yang diperlukan mesin tersebut jika harus mencetak pesanan sebanyak 84 lembar foto?</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">5.</p>
              <p>Adi dapat menyelesaikan suatu pekerjaan selama 4 jam. Budi dapat menyelesaikan pekerjaan yang sama dalam waktu 6 jam. Jika pekerjaan tersebut dikerjakan adi dan budi bersama sama, maka pekerjaan tersebut akan selesai dalam waktu ...</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">6.</p>
              <p>Suatu perkajaan jika dikerjakan oleh Anto dan Dini dapat diselesaikan dalam waktu 6 jam. Jika pekerjaan itu dikerjakan oleh Dini sendirian akan selesai 5 jam lebih lambat dibandingkan Anto. Pekerjaan itu dapat diselesaikan Anto sendirian dalam waktu ... jam</p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">7.</p>
              <p>Persiapan sebuah panggung festival budaya diperkirakan selesai dalam waktu 24 hari jika dikerjakan oleh 6 orang teknisi. Setelah dikerjakan selama 4 hari, pekerjaan terpaksa dihentikan selama 8 hari karena badai. Agar persiapan panggung selesai tepat waktu sesuai rencana awal, berapa banyak tambahan teknisi yang diperlukan?</p>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">8.</p>
              <p>Sebuah pesanan seragam sekolah dapat diselesaikan oleh 4 orang penjahit dalam waktu 20 hari. Setelah mereka bekerja selama 4 hari, pasokan listrik terputus sehingga pekerjaan terhenti total selama 12 hari. Berapa banyak tambahan penjahit yang dibutuhkan agar pesanan seragam tersebut dapat diselesaikan tepat waktu?</p>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">9.</p>
              <p>Sebuah tempat penampungan hewan (shelter) memiliki persediaan makanan (dry food) yang cukup untuk 20 ekor kucing peliharaan selama 25 hari. Berapa hari persediaan makanan tersebut akan habis jika shelter tersebut menerima tambahan penghuni sebanyak 5 ekor kucing lagi?</p>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">10.</p>
              <p>Sebuah pesanan katering pernikahan raksasa jika dikerjakan oleh 3 orang Chef utama akan selesai dalam waktu 10 hari, sedangkan jika dikerjakan oleh 8 orang asisten dapur akan selesai dalam waktu 9 hari. Jika pesanan tersebut dikerjakan secara bersama-sama oleh 5 Chef utama dan 6 asisten dapur, dalam waktu berapa hari pesanan katering itu akan selesai?</p>
            </div>
          </div>
        </div>

        {/* Game Quiz Section */}
        <div className="bg-card/80 backdrop-blur border border-purple-500/50 rounded-xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-bold text-purple-400 mb-4 font-display">Game Quiz</h2>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Game Quiz 1 */}
            <div className="border-l-2 border-purple-500/50 pl-4">
              <p className="font-semibold text-purple-400 mb-2">1.</p>
              <p>Sebuah studio developer game dapat menyelesaikan pembuatan sebuah aplikasi dalam waktu 9 bulan dengan tim yang terdiri dari 210 orang programmer. Jika peluncuran aplikasi tersebut dimajukan sehingga harus selesai dalam waktu 7 bulan saja, berapa banyak programmer yang harus ditambahkan ke dalam tim tersebut?</p>
            </div>

            {/* Game Quiz 2 */}
            <div className="border-l-2 border-purple-500/50 pl-4">
              <p className="font-semibold text-purple-400 mb-2">2.</p>
              <p>Sebuah kolam renang dapat diisi penuh menggunakan Pompa Air A dalam waktu 12 jam. Jika hanya menggunakan Pompa Air B, kolam akan penuh dalam waktu 6 jam. Berapa jam waktu yang dibutuhkan untuk mengisi kolam renang tersebut jika Pompa A dan Pompa B dihidupkan bersama-sama?</p>
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
