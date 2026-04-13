import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const PerbandinganBertingkatPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERBANDINGAN BERTINGKAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Perbandingan</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">

            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <p>
                Perbandingan uang Rian dan Sandi adalah <InlineMath math="2 : 3" />, sedangkan perbandingan uang Sandi dan Tedi adalah <InlineMath math="3 : 5" />.
                Jika jumlah uang ketiganya adalah Rp200.000, tentukan uang masing-masing!
              </p>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <p>
                Perbandingan bola merah : bola biru = <InlineMath math="2 : 5" />, dan perbandingan bola biru : bola hijau = <InlineMath math="4 : 3" />.
                Jika selisih bola merah dan bola hijau adalah 14 butir, tentukan banyak bola biru!
              </p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <p>
                Tabungan Pita : Qiran = <InlineMath math="5 : 3" /> dan tabungan Qiran : Rina = <InlineMath math="6 : 7" />.
                Jika tabungan Pita adalah Rp30.000, berapa tabungan Rina?
              </p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <p>
                Perbandingan tinggi badan Aldi : Bima = <InlineMath math="4 : 5" /> dan Bima : Ciko = <InlineMath math="5 : 6" />.
                Jika jumlah tinggi badan Aldi dan Ciko adalah 150 cm, tentukan tinggi badan Bima!
              </p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <p>
                Perbandingan nilai ujian Rara : Sita = <InlineMath math="3 : 5" /> dan Sita : Tara = <InlineMath math="2 : 3" />.
                Diketahui jumlah nilai ketiganya adalah 310. Tentukan:
                <br />a. Nilai masing-masing
                <br />b. Selisih nilai Tara dan Rara
              </p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <p>
                Modal usaha Ari : Bowo = <InlineMath math="3 : 4" /> dan Bowo : Candra = <InlineMath math="2 : 5" />.
                Jika selisih modal Ari dan Candra adalah Rp49.000, tentukan total modal ketiganya!
              </p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <p>
                Perbandingan panjang tiga buah tongkat A, B, dan C diketahui sebagai berikut:
                A : B = <InlineMath math="2 : 3" /> dan B : C = <InlineMath math="4 : 5" />.
                Jika total panjang ketiga tongkat tersebut adalah 70 cm, berapa panjang tongkat A dan C masing-masing?
              </p>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <p>
                Perbandingan kelereng Fani : Gita = <InlineMath math="5 : 7" /> dan kelereng Gita : Hana = <InlineMath math="3 : 4" />.
                Jika kelereng Gita berjumlah 21 butir, tentukan:
                <br />a. Kelereng Fani dan Hana masing-masing
                <br />b. Jumlah kelereng ketiganya
              </p>
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

export default PerbandinganBertingkatPage;
