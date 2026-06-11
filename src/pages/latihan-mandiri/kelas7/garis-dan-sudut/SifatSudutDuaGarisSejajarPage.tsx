import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const SifatSudutDuaGarisSejajarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          SIFAT SUDUT DUA GARIS SEJAJAR<br />JIKA DIPOTONG GARIS LAIN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Garis dan Sudut</p>

        {/* Bagian I — Pilihan Ganda */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-accent text-sm font-bold mb-2 font-display">Bagian I — Pilihan Ganda</p>
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya!</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">

            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Garis a // b dipotong oleh garis c. Pada titik A dan B terbentuk sudut-sudut bernomor 1, 2, 3, 4. Pernyataan berikut yang benar adalah …</p>
                <img src={"/images/NO_1_1774842809807.png"} alt="Soal 1" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. ∠A₁ sehadap dengan ∠B₃</p>
                  <p>B. ∠A₂ berseberangan luar dengan ∠B₃</p>
                  <p>C. ∠A₁ luar sepihak dengan ∠B₄</p>
                  <p>D. ∠A₄ berseberangan dalam dengan ∠B₂</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut! Dua garis sejajar dipotong oleh dua garis transversal sehingga terbentuk sudut 1 sampai 8. Perhatikan pernyataan berikut!</p>
                <img src={"/images/NO_2_1774842809808.png"} alt="Soal 2" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 mb-2 space-y-1 text-white/70">
                  <p>(i) Sudut 1 dan sudut 7, sudut luar berseberangan</p>
                  <p>(ii) Sudut 1 dan sudut 6, sudut luar sepihak</p>
                  <p>(iii) Sudut 4 dan sudut 6, sudut bertolak belakang</p>
                  <p>(iv) Sudut 3 dan sudut 7, sudut sehadap</p>
                </div>
                <p className="mb-2">Pernyataan yang benar adalah ….</p>
                <div className="ml-4 space-y-1">
                  <p>A. (i) dan (ii) saja</p>
                  <p>B. (ii) dan (iv) saja</p>
                  <p>C. (i), (ii) dan (iii)</p>
                  <p>D. (i), (ii) dan (iv)</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">Perhatikan gambar. Diketahui ∠A₁ = 103°, maka besar ∠B₄ dan ∠A₃ berturut-turut adalah …</p>
                <img src={"/images/NO_3_1774842809808.png"} alt="Soal 3" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 130° dan 90°</p>
                  <p>B. 90° dan 130°</p>
                  <p>C. 77° dan 103°</p>
                  <p>D. 103° dan 77°</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Pada gambar berikut, garis p // q dipotong garis r secara transversal. Perbandingan sudut P₁ : Q₄ adalah 4 : 5. Besar sudut Q₁ adalah …</p>
                <img src={"/images/NO_4_1774842809809.png"} alt="Soal 4" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 40°</p>
                  <p>B. 80°</p>
                  <p>C. 100°</p>
                  <p>D. 120°</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Garis AB // CD dan besar ∠DAB dan ∠BCD diketahui dari gambar. Besar ∠ABC adalah …</p>
                <img src={"/images/NO_5_1774842809809.png"} alt="Soal 5" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 16°</p>
                  <p>B. 26°</p>
                  <p>C. 32°</p>
                  <p>D. 36°</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Perhatikan gambar. Besar ∠BCF adalah ….</p>
                <img src={"/images/NO_6_1774842809810.png"} alt="Soal 6" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 35°</p>
                  <p>B. 45°</p>
                  <p>C. 60°</p>
                  <p>D. 75°</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Jika garis l₁ dan l₂ adalah dua garis yang sejajar, maka nilai x adalah ...</p>
                <img src={"/images/NO_7_1774842809810.png"} alt="Soal 7" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 13°</p>
                  <p>B. 39°</p>
                  <p>C. 47°</p>
                  <p>D. 55°</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Besar sudut a adalah ...</p>
                <img src={"/images/NO_8_1774842809810.png"} alt="Soal 8" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 30°</p>
                  <p>B. 50°</p>
                  <p>C. 80°</p>
                  <p>D. 100°</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Diketahui garis EG // AC, besar ∠FEG = 50° dan besar ∠EDB = 108°. Besar ∠DBC adalah …</p>
                <img src={"/images/NO_9_1774842809811.png"} alt="Soal 9" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 58°</p>
                  <p>B. 61°</p>
                  <p>C. 100°</p>
                  <p>D. 122°</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Sebuah tangga rumah terbuat dari kayu dan pagar pengaman dari besi. Besar sudut antara tiang besi dan pagar dengan pegangan tangan terdapat pada gambar. Besar sudut kemiringan tangga adalah …</p>
                <img src={"/images/NO_10_1774842809811.png"} alt="Soal 10" className="my-3 w-full max-w-xs block" />
                <div className="ml-4 space-y-1">
                  <p>A. 60°</p>
                  <p>B. 50°</p>
                  <p>C. 40°</p>
                  <p>D. 10°</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/garis-dan-sudut"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Garis dan Sudut
          </button>
        </div>
      </div>
    </div>
  );
};

export default SifatSudutDuaGarisSejajarPage;
