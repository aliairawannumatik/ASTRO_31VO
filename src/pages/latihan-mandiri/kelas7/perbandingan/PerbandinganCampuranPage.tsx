import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PerbandinganCampuranPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERBANDINGAN CAMPURAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Perbandingan</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">Perbandingan Campuran</h2>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">1.</p>
              <p>Tujuh ekor kambing menghasilkan rumput seluas 7 kali ukuran lapangan sepak bola dalam waktu 7 hari. Waktu yang diperlukan oleh 3 ekor kambing untuk menghabiskan rumput seluas 3 kali ukuran lapangan sepak bola adalah ... hari</p>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">2.</p>
              <p>Jika 4 orang tukang kayu dapat membuat 12 kursi dalam waktu 3 hari, berapa hari yang dibutuhkan oleh 6 orang tukang kayu untuk membuat 24 kursi?</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">3.</p>
              <p>Sebuah perusahaan konstruksi mengerahkan 12 pekerja untuk menyelesaikan 2 unit rumah dalam waktu 30 hari. Jika perusahaan tersebut ingin menyelesaikan 3 unit rumah serupa dalam waktu 24 hari, berapa banyak pekerja yang harus mereka kerahkan?</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">4.</p>
              <p>Seorang peternak memiliki 40 ekor sapi yang dapat menghabiskan 60 karung pakan dalam waktu 15 hari. Jika peternak tersebut menjual 10 ekor sapinya (tersisa 30 ekor) dan ia hanya memiliki 45 karung pakan, berapa lama (dalam hari) persediaan pakan tersebut akan habis?</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">5.</p>
              <p>Tiga mesin cetak tipe A dapat mencetak 3.000 buku dalam 5 jam. Empat mesin cetak tipe B dapat mencetak 4.800 buku dalam 6 jam. Jika perusahaan menggunakan 2 mesin tipe A dan 3 mesin tipe B secara bersamaan, berapa jam waktu yang dibutuhkan untuk mencetak 8.000 buku?</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">6.</p>
              <p>Sebuah pabrik kain jika memproduksi pesanannya menggunakan 2 mesin tenun modern (kapasitas besar) akan selesai dalam waktu 12 hari, sedangkan jika dikerjakan menggunakan 4 mesin tenun tradisional (kapasitas kecil) selesai dalam waktu 18 hari. Jika pabrik tersebut mengoperasikan 3 mesin tenun modern dan 3 mesin tenun tradisional secara bersamaan, dalam waktu berapa hari pesanan kain tersebut dapat diselesaikan?</p>
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

export default PerbandinganCampuranPage;
