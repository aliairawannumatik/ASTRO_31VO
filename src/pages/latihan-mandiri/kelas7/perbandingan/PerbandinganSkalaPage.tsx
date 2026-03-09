import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const PerbandinganSkalaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          SKALA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Perbandingan</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">Skala</h2>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">1.</p>
              <p className="mb-3">Arti dari skala peta 1 : 500.000 adalah...</p>
              <div className="space-y-1 ml-4">
                <p>A. 1 cm pada peta mewakili 500.000 cm jarak sebenarnya.</p>
                <p>B. 1 cm pada peta mewakili 500.000 km jarak sebenarnya.</p>
                <p>C. 1 km pada peta mewakili 500.000 cm jarak sebenarnya.</p>
                <p>D. 500.000 cm pada peta mewakili 1 cm jarak sebenarnya.</p>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">2.</p>
              <p className="mb-3">Peta wilayah X memiliki skala 1 : 50.000. Peta wilayah Y memiliki skala 1 : 250.000. Pernyataan yang benar mengenai kedua peta tersebut adalah...</p>
              <div className="space-y-1 ml-4">
                <p>A. Peta X menunjukkan wilayah yang lebih luas dengan detail yang lebih sedikit daripada peta Y.</p>
                <p>B. Satu sentimeter pada peta X mewakili jarak yang lebih jauh di lapangan dibandingkan peta Y.</p>
                <p>C. Kedua peta memiliki tingkat kedetailan yang sama.</p>
                <p>D. Peta X lebih detail daripada peta Y untuk ukuran kertas yang sama.</p>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">3.</p>
              <p className="mb-3">Jarak dua kota pada peta adalah 20 cm. Jika skala peta 1 : 600.000, jarak dua kota sebenarnya adalah...</p>
              <div className="space-y-1 ml-4">
                <p>A. 1.200 km</p>
                <p>B. 120 km</p>
                <p>C. 30 km</p>
                <p>D. 12 km</p>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">4.</p>
              <p className="mb-3">Jarak antara kota A dan kota B sebenarnya adalah 120 km. Jika jarak kedua kota tersebut pada peta adalah 6 cm, berapakah skala peta tersebut?</p>
              <div className="space-y-1 ml-4">
                <p>A. 1 : 2.000.000</p>
                <p>B. 1 : 200.000</p>
                <p>C. 1 : 20.000.000</p>
                <p>D. 1 : 720.000</p>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">5.</p>
              <p className="mb-3">Sebuah kebun pada denah berukuran 12 cm x 15 cm. Jika ukuran kebun yang sebenarnya 50 m x 40 m, maka skala yang digunakan adalah....</p>
              <div className="space-y-1 ml-4">
                <p>A. 3 : 100</p>
                <p>B. 3 : 800</p>
                <p>C. 3 : 1.250</p>
                <p>D. 3 : 1.000</p>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">6.</p>
              <p className="mb-3">Jarak sebenarnya antara dua gedung adalah 4,5 km. Jika gedung tersebut digambar pada denah dengan skala 1 : 15.000, maka jarak pada denah adalah...</p>
              <div className="space-y-1 ml-4">
                <p>A. 3 cm</p>
                <p>B. 30 cm</p>
                <p>C. 300 cm</p>
                <p>D. 0,3 cm</p>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">7.</p>
              <p className="mb-3">Perhatikan denah sebuah rumah berikut!</p>
              <p className="mb-3 text-white/50 italic">[Gambar denah rumah]</p>
              <p className="mb-3">Jika skala denah rumah adalah 1 : 200, maka luas bangunan rumah sebenarnya adalah ...</p>
              <div className="space-y-1 ml-4">
                <p>A. 46 m<sup>2</sup></p>
                <p>B. 92 m<sup>2</sup></p>
                <p>C. 184 m<sup>2</sup></p>
                <p>D. 368 m<sup>2</sup></p>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">8.</p>
              <p className="mb-3">Denah sebuah gedung berskala 1 : 300. Jika luas denah 125 cm<sup>2</sup>, maka luas gedung sebenarnya adalah ...</p>
              <div className="space-y-1 ml-4">
                <p>A. 375 m<sup>2</sup></p>
                <p>B. 1.125 m<sup>2</sup></p>
                <p>C. 3.750 m<sup>2</sup></p>
                <p>D. 11.250 m<sup>2</sup></p>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">9.</p>
              <p className="mb-3">Jarak dua kota pada peta berskala 1 : 1.200.000 adalah 5 cm. Andi berangkat dari kota A ke kota B mengendarai motor dengan kecepatan rata-rata 40 km/jam. Jika ia berangkat pukul 07.15 dan beristirahat selama 30 menit di perjalanan, pada pukul berapa ia akan tiba di kota B?</p>
              <div className="space-y-1 ml-4">
                <p>A. 09.45</p>
                <p>B. 08.45</p>
                <p>C. 09.15</p>
                <p>D. 10.15</p>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4">
              <p className="font-semibold text-accent mb-2">10.</p>
              <p className="mb-3">Sebuah perusahaan properti membuat maket (model miniatur 3D) apartemen dengan skala 1 : 100. Jika kolam renang pada maket tersebut bervolume 2 liter air saat penuh, berapakah kapasitas air kolam renang tersebut di dunia nyata?</p>
              <div className="space-y-1 ml-4">
                <p>A. 2.000 liter</p>
                <p>B. 20.000 liter</p>
                <p>C. 200 liter</p>
                <p>D. 2.000.000 liter</p>
              </div>
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

export default PerbandinganSkalaPage;
