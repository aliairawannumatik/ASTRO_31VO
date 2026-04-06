import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import imgA from "@assets/a_1774838179561.png";
import imgB from "@assets/b_1774838179562.png";
import imgC from "@assets/c_1774838179562.png";
import imgD from "@assets/d_1774838179563.png";
import imgE from "@assets/e_1774838179563.png";
import imgF from "@assets/f_1774838179564.png";
import img2 from "@assets/no_2_1774838544613.png";
import img3 from "@assets/no_3_1774838544614.png";
import img4 from "@assets/no_4_1774838544614.png";
import img5 from "@assets/no_5_1774838544615.png";
import img6 from "@assets/no_6_1774838544615.png";
import img8 from "@assets/no_8_1774838544616.png";
import img10 from "@assets/no_10_1774838544616.png";
import img11 from "@assets/no_11_1774838544616.png";
import img12 from "@assets/no_12_1774838544617.png";
import img13 from "@assets/no_13_1774838544618.png";

const SudutPelurusPenyikuBertolakPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          SUDUT PELURUS, SUDUT PENYIKU DAN SUDUT BERTOLAK BELAKANG
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Garis dan Sudut</p>

        {/* Bagian I */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-accent text-sm font-bold mb-2 font-display">Bagian I — Isian Pendek</p>
          <p className="text-yellow-400 text-sm mb-6 font-body">Tentukan nilai sudut yang belum diketahui. Kerjakan lengkap dengan caranya!</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal a */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">a)</span>
              <div>
                <p>Dua sudut terletak pada satu garis lurus (berpelurus). Salah satu sudutnya adalah 37°. Tentukan nilai x!</p>
                <img src={imgA} alt="Soal a" className="mt-3 max-w-xs" />
              </div>
            </div>

            {/* Soal b */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">b)</span>
              <div>
                <p>Dua sudut terletak pada satu garis lurus (berpelurus). Salah satu sudutnya adalah 127°. Tentukan nilai y!</p>
                <img src={imgB} alt="Soal b" className="mt-3 max-w-xs" />
              </div>
            </div>

            {/* Soal c */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">c)</span>
              <div>
                <p>Dua sudut terletak pada satu garis lurus (berpelurus). Salah satu sudutnya adalah 140°. Tentukan nilai z!</p>
                <img src={imgC} alt="Soal c" className="mt-3 max-w-xs" />
              </div>
            </div>

            {/* Soal d */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">d)</span>
              <div>
                <p>Sudut a°, 50°, dan 20° terletak pada satu garis lurus. Tentukan nilai a!</p>
                <img src={imgD} alt="Soal d" className="mt-3 max-w-xs" />
              </div>
            </div>

            {/* Soal e */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">e)</span>
              <div>
                <p>Sudut 50° dan sudut b° saling berpenyiku (membentuk sudut siku-siku). Tentukan nilai b!</p>
                <img src={imgE} alt="Soal e" className="mt-3 max-w-xs" />
              </div>
            </div>

            {/* Soal f */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">f)</span>
              <div>
                <p>Sudut c° dan sudut 80° saling berpenyiku (membentuk sudut siku-siku). Tentukan nilai c!</p>
                <img src={imgF} alt="Soal f" className="mt-3 max-w-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Bagian II */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-accent text-sm font-bold mb-2 font-display">Bagian II — Pilihan Ganda</p>
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <div>
                <p className="mb-2">Sudut 7/12 putaran adalah …</p>
                <div className="ml-4 space-y-1">
                  <p>A. 280°</p>
                  <p>B. 210°</p>
                  <p>C. 120°</p>
                  <p>D. 30°</p>
                </div>
              </div>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Titik D adalah titik tengah. Garis-garis dari titik D menuju A, B, C, dan F membentuk sudut-sudut di sekitar titik D. Diketahui besar ∠ADB = ∠BDC. Jika besar ∠ADB = besar ∠BDC = 40°, besar ∠CDF adalah …</p>
                <img src={img2} alt="Soal 2" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 40°</p>
                  <p>B. 80°</p>
                  <p>C. 100°</p>
                  <p>D. 120°</p>
                </div>
              </div>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Titik A, B, C, D, E membentuk konfigurasi sudut di mana ∠CAE adalah sudut siku-siku dan besar ∠BAC = 40°. Besar ∠DAE = (4x + 10)°. Nilai x adalah …</p>
                <img src={img3} alt="Soal 3" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 7,5</p>
                  <p>B. 10</p>
                  <p>C. 12,5</p>
                  <p>D. 40</p>
                </div>
              </div>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut. Pada gambar terdapat sudut x° dan sudut 20° yang terbentuk di antara dua garis. Sudut siku-siku (90°) terdapat pada gambar tersebut. Nilai x adalah …</p>
                <img src={img4} alt="Soal 4" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 70°</p>
                  <p>B. 80°</p>
                  <p>C. 90°</p>
                  <p>D. 110°</p>
                </div>
              </div>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <div>
                <p className="mb-2">Perhatikan gambar berikut! Dari gambar diketahui besar ∠SQR = 32°. Besar penyiku ∠SQR adalah ...</p>
                <img src={img5} alt="Soal 5" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 90°</p>
                  <p>B. 32°</p>
                  <p>C. 48°</p>
                  <p>D. 58°</p>
                </div>
              </div>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <div>
                <p className="mb-2">Perhatikan gambar. Diketahui besar ∠CBD = (2x + 5)° dan ∠ABD = (3x – 25)°. Sudut CBD dan ABD saling berpelurus. Besar pelurus sudut CBD adalah ...</p>
                <img src={img6} alt="Soal 6" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 82°</p>
                  <p>B. 85°</p>
                  <p>C. 95°</p>
                  <p>D. 104°</p>
                </div>
              </div>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <div>
                <p className="mb-2">Diketahui besar ∠A = (2x + 3)° dan ∠B = (3x – 8)° saling berpelurus. Maka penyiku sudut A adalah …</p>
                <div className="ml-4 space-y-1">
                  <p>A. 13°</p>
                  <p>B. 37°</p>
                  <p>C. 77°</p>
                  <p>D. 103°</p>
                </div>
              </div>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <div>
                <p className="mb-2">Dari gambar berikut, diketahui sudut x dan sudut y saling berpelurus dengan perbandingan x : y = 2 : 7. Besar sudut x adalah ...</p>
                <img src={img8} alt="Soal 8" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 120°</p>
                  <p>B. 60°</p>
                  <p>C. 40°</p>
                  <p>D. 20°</p>
                </div>
              </div>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <div>
                <p className="mb-2">Pelurusnya suatu sudut besarnya 3 kali sudut tersebut, maka sudut tersebut adalah …</p>
                <div className="ml-4 space-y-1">
                  <p>A. 15°</p>
                  <p>B. 30°</p>
                  <p>C. 45°</p>
                  <p>D. 60°</p>
                </div>
              </div>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <div>
                <p className="mb-2">Perhatikan gambar. Titik O adalah titik potong dua garis. Sudut-sudut yang terbentuk di sekitar O diketahui nilainya. Besar sudut AOB adalah ...</p>
                <img src={img10} alt="Soal 10" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 70°</p>
                  <p>B. 120°</p>
                  <p>C. 140°</p>
                  <p>D. 160°</p>
                </div>
              </div>
            </div>

            {/* Soal 11 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">11.</span>
              <div>
                <p className="mb-2">Empat sudut terbentuk oleh dua garis berpotongan dan diberi nama p°, q°, r°, s° (berurutan). Bila diketahui q° = 45°, maka nilai p, s, dan r berturut-turut adalah ...</p>
                <img src={img11} alt="Soal 11" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. p = 135° ; s = 45° ; r = 135°</p>
                  <p>B. p = 130° ; s = 45° ; r = 130°</p>
                  <p>C. p = 135° ; s = 40° ; r = 135°</p>
                  <p>D. p = 130° ; s = 40° ; r = 130°</p>
                </div>
              </div>
            </div>

            {/* Soal 12 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">12.</span>
              <div>
                <p className="mb-2">Perhatikan gambar di bawah ini. Dari gambar diketahui dua garis berpotongan membentuk sudut-sudut yang dinyatakan dalam variabel a. Tentukan nilai a!</p>
                <img src={img12} alt="Soal 12" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 45</p>
                  <p>B. 49</p>
                  <p>C. 55</p>
                  <p>D. 105</p>
                </div>
              </div>
            </div>

            {/* Soal 13 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">13.</span>
              <div>
                <p className="mb-2">Perhatikan gambar di bawah ini. Dua garis berpotongan di titik E membentuk sudut-sudut C, E, D dengan nilai tertentu yang diketahui dari gambar. Berapakah besar sudut CED?</p>
                <img src={img13} alt="Soal 13" className="my-3 max-w-xs" />
                <div className="ml-4 space-y-1">
                  <p>A. 73°</p>
                  <p>B. 107°</p>
                  <p>C. 117°</p>
                  <p>D. 127°</p>
                </div>
              </div>
            </div>

            {/* Soal 14 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">14.</span>
              <div>
                <p className="mb-2">Besar sudut terkecil yang dibentuk oleh dua jarum jam pada pukul 07.20 adalah …</p>
                <div className="ml-4 space-y-1">
                  <p>A. 90°</p>
                  <p>B. 100°</p>
                  <p>C. 105°</p>
                  <p>D. 110°</p>
                </div>
              </div>
            </div>

            {/* Soal 15 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">15.</span>
              <div>
                <p className="mb-2">Besar sudut terkecil yang dibentuk oleh dua jarum jam pada pukul 22.10 adalah …</p>
                <div className="ml-4 space-y-1">
                  <p>A. 145°</p>
                  <p>B. 125°</p>
                  <p>C. 115°</p>
                  <p>D. 95°</p>
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

export default SudutPelurusPenyikuBertolakPage;
