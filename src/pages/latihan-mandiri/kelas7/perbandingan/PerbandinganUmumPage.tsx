import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const PerbandinganUmumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Perbandingan</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">Latihan Mandiri</h2>
          <p className="text-white/70 text-sm mb-6 font-body">Selesaikan soal-soal berikut.</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">1.</p>
              <p>Tinggi Gedung A adalah 120 meter dan tinggi Gedung B adalah 150 meter. Tentukan rasio tinggi Gedung B terhadap Gedung A dalam bentuk paling sederhana!</p>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">2.</p>
              <p>Dalam sebuah keranjang buah terdapat 24 buah apel merah dan 16 buah apel hijau. Berapakah perbandingan antara jumlah apel merah terhadap total keseluruhan apel di dalam keranjang tersebut (sajikan dalam bentuk yang paling sederhana)?</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">3.</p>
              <p>Umur Ayah saat ini adalah 45 tahun, sedangkan umur Budi adalah 15 tahun. Tentukan perbandingan umur Ayah dan Budi pada 5 tahun yang lalu!</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">4.</p>
              <p>Jarak rumah Ali ke sekolah adalah 2,5 km, sedangkan jarak rumah Cici ke sekolah hanya 500 meter. Berapakah perbandingan jarak rumah Ali dan rumah Cici ke sekolah dalam bentuk paling sederhana?</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">5.</p>
              <p>Waktu yang dihabiskan Dika untuk belajar di malam hari adalah 2 jam, sedangkan waktu untuk bermain game adalah 45 menit. Tentukan rasio waktu belajar Dika terhadap waktu bermainnya!</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">6.</p>
              <p>Sebuah botol minum besar berisi 1,5 liter air. Air tersebut dituangkan ke dalam sebuah gelas yang memiliki kapasitas 300 ml. Berapa rasio volume air di botol besar terhadap gelas tersebut?</p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">7.</p>
              <p>Sebuah peternakan ayam petelur memiliki lahan seluas 2,5 hektar yang menampung 75.000 ekor ayam. Tentukan rasio kepadatan ayam terhadap luas lahan peternakan tersebut dalam satuan ekor/m<sup>2</sup>. (Catatan: 1 hektar = 10.000 m<sup>2</sup>)</p>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">8.</p>
              <p>Perbandingan panjang, lebar, dan tinggi sebuah balok adalah <InlineMath math="4 : 3 : 2" />. Jika volume balok itu adalah 192 cm<sup>3</sup>, tentukan luas permukaan balok tersebut.</p>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">9.</p>
              <p>Perbandingan panjang, lebar, dan tinggi sebuah wadah penyimpanan air berbentuk balok adalah <InlineMath math="6 : 4 : 3" />. Jika luas seluruh permukaan wadah tersebut adalah 4.320 cm<sup>2</sup>, berapakah liter volume air maksimal yang dapat ditampung dalam wadah tersebut? (Catatan: 1 liter = 1.000 cm<sup>3</sup>)</p>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">10.</p>
              <p>Hasil panen buah mangga, jeruk, dan apel di sebuah perkebunan memiliki perbandingan <InlineMath math="4 : 5 : 7" />. Jika diketahui selisih berat panen buah apel dan buah mangga adalah 450 kg, tentukanlah total keseluruhan berat hasil panen ketiga buah tersebut!</p>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">11.</p>
              <p>Uang tabungan Siska berbanding uang tabungan Tari adalah <InlineMath math="2 : 3" />. Sedangkan perbandingan uang tabungan Tari dan Uci adalah <InlineMath math="4 : 5" />. Jika jumlah seluruh uang tabungan mereka bertiga jika digabungkan adalah Rp700.000,00, berapakah besar uang tabungan mereka masing-masing?</p>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">12.</p>
              <p>Dalam sebuah kemitraan bisnis, perbandingan modal investasi antara Pak Rendi dan Pak Surya adalah <InlineMath math="3 : 4" />. Sementara itu, perbandingan modal Pak Surya dan Pak Tono adalah <InlineMath math="6 : 5" />. Jika total modal yang terkumpul dari ketiganya adalah Rp186.000.000,00, berapakah besar modal yang disetorkan oleh Pak Tono?</p>
            </div>

            {/* Soal 13 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">13.</p>
              <p>Perbandingan uang saku mingguan Bima dan Candra adalah <InlineMath math="3 : 4" />. Sementara itu, perbandingan uang saku Candra dan Dika adalah <InlineMath math="2 : 5" />. Jika diketahui selisih uang saku antara Dika dan Bima adalah Rp35.000,00, tentukanlah jumlah uang saku yang dimiliki oleh Bima, Candra, dan Dika masing-masing!</p>
            </div>

            {/* Soal 14 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">14.</p>
              <p>Sebuah taman berbentuk persegi panjang memiliki perbandingan panjang dan lebar <InlineMath math="5 : 3" />. Jika luas taman tersebut adalah 1.350 m<sup>2</sup>, berapakah total biaya yang dibutuhkan untuk memasang lampu hias di sekeliling taman, jika setiap 2 meter dipasang satu lampu dengan harga Rp150.000,00 per lampu?</p>
            </div>

            {/* Soal 15 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">15.</p>
              <p>Perbandingan uang Ali dan Budi adalah <InlineMath math="2 : 3" />, sedangkan perbandingan uang Budi dan Citra adalah <InlineMath math="4 : 5" />. Jika uang Ali Rp. 30.000,00, maka uang Citra adalah</p>
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

export default PerbandinganUmumPage;
