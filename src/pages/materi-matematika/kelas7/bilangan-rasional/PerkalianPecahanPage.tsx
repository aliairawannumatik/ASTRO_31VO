import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Lightbulb, AlertCircle, Calculator, Scale, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import FractionMultiplicationAnimation from "@/components/FractionMultiplicationAnimation";

const PerkalianPecahanPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    playPopSound();
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERKALIAN PECAHAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 - Bilangan Rasional</p>

        {/* Animasi Interaktif */}
        <div className="mb-6 animate-slide-up">
          <FractionMultiplicationAnimation />
        </div>

        {/* Sub-bab 1: Konsep Dasar Perkalian Pecahan */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => toggleSection(0)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Calculator className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Konsep Dasar Perkalian Pecahan</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 0 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 0 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  <strong>Perkalian pecahan</strong> itu sebenarnya simpel banget! Kamu tinggal kalikan <strong>pembilang dengan pembilang</strong>, 
                  lalu kalikan <strong>penyebut dengan penyebut</strong>. Nggak perlu repot-repot menyamakan penyebut seperti penjumlahan atau pengurangan. 
                  Kalau ada pecahan campuran, ubah dulu jadi pecahan biasa sebelum dikalikan.
                </p>
              </div>

              {/* Rumus Utama */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Rumus Perkalian Pecahan:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\frac{a}{b} \times \frac{c}{d} = \frac{a \times c}{b \times d}" />
                  <p className="text-white/70 text-xs mt-2 font-body">dengan <InlineMath math="b \neq 0" /> dan <InlineMath math="d \neq 0" /></p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Jika ada pecahan campuran, ubah dulu jadi pecahan biasa!</li>
                  <li>Sederhanakan hasil akhir jika memungkinkan</li>
                  <li>Bisa menyederhanakan silang sebelum mengalikan (lebih efisien)</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="\frac{3}{8} \times \frac{4}{7}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Kalikan pembilang dengan pembilang</p>
                    <div className="pl-4"><InlineMath math="3 \times 4 = 12" /></div>
                    <p><strong>Langkah 2:</strong> Kalikan penyebut dengan penyebut</p>
                    <div className="pl-4"><InlineMath math="8 \times 7 = 56" /></div>
                    <p><strong>Langkah 3:</strong> Tulis hasilnya dan sederhanakan</p>
                    <div className="pl-4"><InlineMath math="\frac{3}{8} \times \frac{4}{7} = \frac{12}{56} = \frac{3}{14}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{3}{14}" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="1\frac{4}{5} \times 2\frac{1}{3}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah pecahan campuran menjadi pecahan biasa</p>
                    <div className="pl-4">
                      <InlineMath math="1\frac{4}{5} = \frac{(1 \times 5) + 4}{5} = \frac{9}{5}" />
                    </div>
                    <div className="pl-4">
                      <InlineMath math="2\frac{1}{3} = \frac{(2 \times 3) + 1}{3} = \frac{7}{3}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Kalikan kedua pecahan</p>
                    <div className="pl-4"><InlineMath math="\frac{9}{5} \times \frac{7}{3} = \frac{9 \times 7}{5 \times 3} = \frac{63}{15}" /></div>
                    <p><strong>Langkah 3:</strong> Sederhanakan dan ubah ke pecahan campuran</p>
                    <div className="pl-4"><InlineMath math="\frac{63}{15} = \frac{21}{5} = 4\frac{1}{5}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="4\frac{1}{5}" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Paman mendapat penghasilan Rp3.600.000 setiap bulan. Sebanyak <InlineMath math="\frac{2}{5}" /> dari penghasilan tersebut 
                  digunakan untuk kebutuhan pangan. Kemudian <InlineMath math="\frac{1}{4}" /> dari biaya pangan digunakan untuk membeli gas dan air minum. 
                  Berapa rupiah uang yang digunakan untuk membeli gas dan air minum?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Tentukan bagian untuk gas dan air minum</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Bagian} = \frac{1}{4} \times \frac{2}{5} = \frac{1 \times 2}{4 \times 5} = \frac{2}{20} = \frac{1}{10}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Hitung nominal uangnya</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Biaya} = \frac{1}{10} \times Rp3.600.000" />
                    </div>
                    <div className="pl-4">
                      <InlineMath math="= Rp360.000" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Rp360.000</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 2: Sifat Komutatif Perkalian Pecahan */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => toggleSection(1)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Scale className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Sifat Komutatif (Pertukaran)</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 1 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 1 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  <strong>Sifat komutatif</strong> artinya urutan perkalian boleh ditukar tanpa mengubah hasil. 
                  Mau <InlineMath math="a \times b" /> atau <InlineMath math="b \times a" />, hasilnya tetap sama! 
                  Ini berlaku juga untuk pecahan. Sifat ini berguna untuk mempermudah perhitungan dengan memilih urutan yang lebih mudah dihitung.
                </p>
              </div>

              {/* Rumus */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Rumus Sifat Komutatif:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\frac{a}{b} \times \frac{c}{d} = \frac{c}{d} \times \frac{a}{b}" />
                </div>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Buktikan bahwa <InlineMath math="\frac{1}{2} \times \frac{3}{4} = \frac{3}{4} \times \frac{1}{2}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Hitung ruas kiri:</strong></p>
                    <div className="pl-4"><InlineMath math="\frac{1}{2} \times \frac{3}{4} = \frac{1 \times 3}{2 \times 4} = \frac{3}{8}" /></div>
                    <p><strong>Hitung ruas kanan:</strong></p>
                    <div className="pl-4"><InlineMath math="\frac{3}{4} \times \frac{1}{2} = \frac{3 \times 1}{4 \times 2} = \frac{3}{8}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>Kesimpulan:</strong> Kedua ruas sama, yaitu <InlineMath math="\frac{3}{8}" />. Terbukti komutatif!</p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Buktikan sifat komutatif pada <InlineMath math="1\frac{1}{3} \times \frac{1}{5}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah pecahan campuran</p>
                    <div className="pl-4"><InlineMath math="1\frac{1}{3} = \frac{4}{3}" /></div>
                    <p><strong>Langkah 2:</strong> Hitung <InlineMath math="\frac{4}{3} \times \frac{1}{5}" /></p>
                    <div className="pl-4"><InlineMath math="\frac{4}{3} \times \frac{1}{5} = \frac{4}{15}" /></div>
                    <p><strong>Langkah 3:</strong> Hitung <InlineMath math="\frac{1}{5} \times \frac{4}{3}" /></p>
                    <div className="pl-4"><InlineMath math="\frac{1}{5} \times \frac{4}{3} = \frac{4}{15}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>Kesimpulan:</strong> <InlineMath math="\frac{4}{3} \times \frac{1}{5} = \frac{1}{5} \times \frac{4}{3} = \frac{4}{15}" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Gunakan sifat komutatif untuk menghitung <InlineMath math="\frac{7}{12} \times \frac{8}{21}" /> dengan cara yang lebih mudah!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Strategi:</strong> Dengan sifat komutatif, kita bisa menyederhanakan silang lebih dulu</p>
                    <p><strong>Langkah 1:</strong> Cari faktor persekutuan</p>
                    <div className="pl-4">
                      <p>7 dan 21: FPB = 7 (karena 21 = 7 × 3)</p>
                      <p>8 dan 12: FPB = 4 (karena 8 = 4 × 2 dan 12 = 4 × 3)</p>
                    </div>
                    <p><strong>Langkah 2:</strong> Sederhanakan silang sebelum mengalikan</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{7}{12} \times \frac{8}{21} = \frac{^1\cancel{7}}{^3\cancel{12}} \times \frac{^2\cancel{8}}{_3\cancel{21}} = \frac{1 \times 2}{3 \times 3} = \frac{2}{9}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{2}{9}" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 3: Sifat Asosiatif Perkalian Pecahan */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => toggleSection(2)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Layers className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Sifat Asosiatif (Pengelompokan)</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 2 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 2 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  <strong>Sifat asosiatif</strong> artinya pengelompokan operasi tidak mempengaruhi hasil. 
                  Saat mengalikan tiga pecahan atau lebih, kamu bebas mau mengelompokkan yang mana dulu. 
                  Hasilnya akan tetap sama! Ini sangat membantu saat ada perhitungan yang lebih mudah jika dikelompokkan dengan cara tertentu.
                </p>
              </div>

              {/* Rumus */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Rumus Sifat Asosiatif:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\left(\frac{a}{b} \times \frac{c}{d}\right) \times \frac{e}{f} = \frac{a}{b} \times \left(\frac{c}{d} \times \frac{e}{f}\right)" />
                </div>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Buktikan bahwa <InlineMath math="\left(\frac{1}{2} \times \frac{1}{3}\right) \times \frac{1}{4} = \frac{1}{2} \times \left(\frac{1}{3} \times \frac{1}{4}\right)" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Hitung ruas kiri:</strong></p>
                    <div className="pl-4">
                      <InlineMath math="\left(\frac{1}{2} \times \frac{1}{3}\right) \times \frac{1}{4} = \frac{1}{6} \times \frac{1}{4} = \frac{1}{24}" />
                    </div>
                    <p><strong>Hitung ruas kanan:</strong></p>
                    <div className="pl-4">
                      <InlineMath math="\frac{1}{2} \times \left(\frac{1}{3} \times \frac{1}{4}\right) = \frac{1}{2} \times \frac{1}{12} = \frac{1}{24}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Kesimpulan:</strong> Kedua ruas sama, yaitu <InlineMath math="\frac{1}{24}" />. Terbukti asosiatif!</p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah <InlineMath math="\frac{3}{7} \times \frac{1}{9} \times \frac{3}{5}" /> dengan dua cara pengelompokan berbeda!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Cara 1:</strong> Kelompokkan dua pecahan pertama</p>
                    <div className="pl-4">
                      <InlineMath math="\left(\frac{3}{7} \times \frac{1}{9}\right) \times \frac{3}{5} = \frac{3}{63} \times \frac{3}{5} = \frac{1}{21} \times \frac{3}{5} = \frac{3}{105} = \frac{1}{35}" />
                    </div>
                    <p><strong>Cara 2:</strong> Kelompokkan dua pecahan terakhir</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{3}{7} \times \left(\frac{1}{9} \times \frac{3}{5}\right) = \frac{3}{7} \times \frac{3}{45} = \frac{3}{7} \times \frac{1}{15} = \frac{3}{105} = \frac{1}{35}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Kesimpulan:</strong> Kedua cara menghasilkan <InlineMath math="\frac{1}{35}" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah <InlineMath math="3\frac{1}{7} \times 5\frac{1}{9} \times 3\frac{1}{5}" /> dengan pengelompokan yang paling efisien!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah semua pecahan campuran</p>
                    <div className="pl-4">
                      <InlineMath math="3\frac{1}{7} = \frac{22}{7}, \quad 5\frac{1}{9} = \frac{46}{9}, \quad 3\frac{1}{5} = \frac{16}{5}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Kalikan semuanya</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{22}{7} \times \frac{46}{9} \times \frac{16}{5}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Hitung pembilang dan penyebut</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{22 \times 46 \times 16}{7 \times 9 \times 5} = \frac{16192}{315}" />
                    </div>
                    <p><strong>Langkah 4:</strong> Ubah ke pecahan campuran</p>
                    <div className="pl-4">
                      <InlineMath math="= 51\frac{127}{315}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="51\frac{127}{315}" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 4: Sifat Distributif Perkalian Pecahan */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => toggleSection(3)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <ChevronRight className="w-5 h-5 text-pink-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Sifat Distributif (Penyebaran)</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 3 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 3 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-lg p-4">
                <h3 className="text-pink-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  <strong>Sifat distributif</strong> menghubungkan perkalian dengan penjumlahan atau pengurangan. 
                  Kamu bisa "menyebarkan" perkalian ke setiap suku di dalam kurung. 
                  Sifat ini sangat berguna untuk menyederhanakan perhitungan, terutama saat ada pecahan yang sama.
                </p>
              </div>

              {/* Rumus */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Rumus Sifat Distributif:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-white/70 text-xs mb-1">Terhadap Penjumlahan:</p>
                    <BlockMath math="\frac{a}{b} \times \left(\frac{c}{d} + \frac{e}{f}\right) = \frac{a}{b} \times \frac{c}{d} + \frac{a}{b} \times \frac{e}{f}" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-xs mb-1">Terhadap Pengurangan:</p>
                    <BlockMath math="\frac{a}{b} \times \left(\frac{c}{d} - \frac{e}{f}\right) = \frac{a}{b} \times \frac{c}{d} - \frac{a}{b} \times \frac{e}{f}" />
                  </div>
                </div>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah <InlineMath math="\frac{1}{2} \times \frac{3}{8} + \frac{1}{2} \times \frac{1}{8}" /> menggunakan sifat distributif!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Kenali pola distributif (faktor yang sama: <InlineMath math="\frac{1}{2}" />)</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{1}{2} \times \frac{3}{8} + \frac{1}{2} \times \frac{1}{8} = \frac{1}{2} \times \left(\frac{3}{8} + \frac{1}{8}\right)" />
                    </div>
                    <p><strong>Langkah 2:</strong> Jumlahkan pecahan dalam kurung</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{1}{2} \times \frac{4}{8} = \frac{1}{2} \times \frac{1}{2}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Kalikan</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{1}{4}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{1}{4}" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah <InlineMath math="2\frac{1}{5} \times \frac{1}{4} - 1\frac{1}{5} \times \frac{1}{4}" /> dengan sifat distributif!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Kenali faktor yang sama: <InlineMath math="\frac{1}{4}" /></p>
                    <div className="pl-4">
                      <InlineMath math="= \left(2\frac{1}{5} - 1\frac{1}{5}\right) \times \frac{1}{4}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Kurangkan pecahan dalam kurung</p>
                    <div className="pl-4">
                      <InlineMath math="= 1 \times \frac{1}{4}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Kalikan</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{1}{4}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{1}{4}" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah <InlineMath math="\frac{1}{3} \times \left(\frac{1}{4} + \frac{1}{6}\right)" /> dengan dua cara: langsung dan distributif!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-3">
                    <div className="border-b border-white/20 pb-3">
                      <p><strong>Cara 1 (Langsung):</strong></p>
                      <div className="pl-4">
                        <p>Jumlahkan dulu isi kurung (KPK 4 dan 6 = 12):</p>
                        <InlineMath math="\frac{1}{4} + \frac{1}{6} = \frac{3}{12} + \frac{2}{12} = \frac{5}{12}" />
                      </div>
                      <div className="pl-4 mt-1">
                        <p>Lalu kalikan:</p>
                        <InlineMath math="\frac{1}{3} \times \frac{5}{12} = \frac{5}{36}" />
                      </div>
                    </div>
                    <div>
                      <p><strong>Cara 2 (Distributif):</strong></p>
                      <div className="pl-4">
                        <InlineMath math="\frac{1}{3} \times \frac{1}{4} + \frac{1}{3} \times \frac{1}{6}" />
                      </div>
                      <div className="pl-4 mt-1">
                        <InlineMath math="= \frac{1}{12} + \frac{1}{18}" />
                      </div>
                      <div className="pl-4 mt-1">
                        <p>KPK 12 dan 18 = 36:</p>
                        <InlineMath math="= \frac{3}{36} + \frac{2}{36} = \frac{5}{36}" />
                      </div>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{5}{36}" /> (kedua cara sama)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigasi */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-rasional"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Rasional
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianPecahanPage;
