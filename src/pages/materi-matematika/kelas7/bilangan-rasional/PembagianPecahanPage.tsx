import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Lightbulb, AlertCircle, Calculator, Repeat, MinusCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const PembagianPecahanPage = () => {
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
          PEMBAGIAN PECAHAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 - Bilangan Rasional</p>

        {/* Sub-bab 1: Konsep Dasar Pembagian Pecahan */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => toggleSection(0)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Calculator className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Konsep Dasar Pembagian Pecahan</span>
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
                  <strong>Pembagian pecahan</strong> punya trik keren: membagi dengan suatu pecahan sama dengan mengalikan dengan <strong>kebalikannya</strong>! 
                  Kebalikan pecahan <InlineMath math="\frac{c}{d}" /> adalah <InlineMath math="\frac{d}{c}" /> (pembilang dan penyebut ditukar posisinya). 
                  Jadi, kamu tinggal ubah tanda bagi menjadi kali, lalu balik pecahan pembaginya. Mudah kan?
                </p>
              </div>

              {/* Rumus Utama */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Rumus Pembagian Pecahan:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c} = \frac{a \times d}{b \times c}" />
                  <p className="text-white/70 text-xs mt-2 font-body">dengan <InlineMath math="b \neq 0" />, <InlineMath math="c \neq 0" />, dan <InlineMath math="d \neq 0" /></p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li><strong>KPK</strong> (Kali-Putar-Kali): Kali dengan kebalikan pembagi!</li>
                  <li>Kebalikan dari <InlineMath math="\frac{c}{d}" /> adalah <InlineMath math="\frac{d}{c}" /></li>
                  <li>Jangan lupa sederhanakan hasil akhir jika memungkinkan</li>
                  <li>Pecahan campuran harus diubah ke pecahan biasa terlebih dahulu</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil pembagian <InlineMath math="\frac{3}{4} \div \frac{6}{5}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Tentukan kebalikan dari pembagi</p>
                    <div className="pl-4">Kebalikan dari <InlineMath math="\frac{6}{5}" /> adalah <InlineMath math="\frac{5}{6}" /></div>
                    <p><strong>Langkah 2:</strong> Ubah pembagian menjadi perkalian dengan kebalikan</p>
                    <div className="pl-4"><InlineMath math="\frac{3}{4} \div \frac{6}{5} = \frac{3}{4} \times \frac{5}{6}" /></div>
                    <p><strong>Langkah 3:</strong> Kalikan dan sederhanakan</p>
                    <div className="pl-4"><InlineMath math="= \frac{3 \times 5}{4 \times 6} = \frac{15}{24} = \frac{5}{8}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{5}{8}" /></p>
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
                  Hitunglah hasil pembagian <InlineMath math="5\frac{1}{4} \div 4\frac{1}{8}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah pecahan campuran menjadi pecahan biasa</p>
                    <div className="pl-4">
                      <InlineMath math="5\frac{1}{4} = \frac{(5 \times 4) + 1}{4} = \frac{21}{4}" />
                    </div>
                    <div className="pl-4">
                      <InlineMath math="4\frac{1}{8} = \frac{(4 \times 8) + 1}{8} = \frac{33}{8}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Tentukan kebalikan pembagi dan kalikan</p>
                    <div className="pl-4"><InlineMath math="\frac{21}{4} \div \frac{33}{8} = \frac{21}{4} \times \frac{8}{33}" /></div>
                    <p><strong>Langkah 3:</strong> Sederhanakan silang sebelum mengalikan</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{21}{4} \times \frac{8}{33} = \frac{21 \times 8}{4 \times 33} = \frac{21 \times 2}{1 \times 33} = \frac{42}{33} = \frac{14}{11}" />
                    </div>
                    <p><strong>Langkah 4:</strong> Ubah ke pecahan campuran</p>
                    <div className="pl-4"><InlineMath math="\frac{14}{11} = 1\frac{3}{11}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="1\frac{3}{11}" /></p>
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
                  Untuk memperindah tampilan pada baju yang dirancangnya, seorang penjahit memasang pita pada bagian baju. 
                  Jika tersedia 1 gulung pita yang panjangnya 5 meter, dan setiap baju membutuhkan <InlineMath math="\frac{5}{8}" /> meter pita, 
                  berapa banyak baju yang dapat dipasangi pita?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Tentukan operasi yang digunakan</p>
                    <div className="pl-4">Banyak baju = panjang total : panjang per baju</div>
                    <p><strong>Langkah 2:</strong> Ubah 5 meter menjadi pecahan</p>
                    <div className="pl-4"><InlineMath math="5 = \frac{5}{1}" /></div>
                    <p><strong>Langkah 3:</strong> Hitung pembagian</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{5}{1} \div \frac{5}{8} = \frac{5}{1} \times \frac{8}{5}" />
                    </div>
                    <div className="pl-4">
                      <InlineMath math="= \frac{5 \times 8}{1 \times 5} = \frac{40}{5} = 8" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> 8 potong baju dapat dipasangi pita</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 2: Kebalikan (Invers) Pecahan */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => toggleSection(1)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Repeat className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Kebalikan (Invers) Pecahan</span>
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
                  <strong>Kebalikan (invers)</strong> dari suatu pecahan didapat dengan menukar posisi pembilang dan penyebut. 
                  Kebalikan dari <InlineMath math="\frac{a}{b}" /> adalah <InlineMath math="\frac{b}{a}" />. 
                  Sifat istimewa: jika suatu pecahan dikalikan dengan kebalikannya, hasilnya selalu <strong>1</strong>! 
                  Konsep ini adalah kunci utama dalam pembagian pecahan.
                </p>
              </div>

              {/* Rumus */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Sifat Kebalikan Pecahan:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center space-y-3">
                  <BlockMath math="\text{Kebalikan dari } \frac{a}{b} \text{ adalah } \frac{b}{a}" />
                  <BlockMath math="\frac{a}{b} \times \frac{b}{a} = 1" />
                </div>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Tentukan kebalikan dari pecahan-pecahan berikut: <InlineMath math="\frac{3}{7}" />, <InlineMath math="\frac{5}{2}" />, dan <InlineMath math="4" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>a.</strong> Kebalikan dari <InlineMath math="\frac{3}{7}" />:</p>
                    <div className="pl-4">Tukar pembilang dan penyebut: <InlineMath math="\frac{7}{3}" /></div>
                    <p><strong>b.</strong> Kebalikan dari <InlineMath math="\frac{5}{2}" />:</p>
                    <div className="pl-4">Tukar pembilang dan penyebut: <InlineMath math="\frac{2}{5}" /></div>
                    <p><strong>c.</strong> Kebalikan dari <InlineMath math="4" />:</p>
                    <div className="pl-4">
                      Ubah ke pecahan: <InlineMath math="4 = \frac{4}{1}" />
                    </div>
                    <div className="pl-4">
                      Tukar: <InlineMath math="\frac{1}{4}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{7}{3}" />, <InlineMath math="\frac{2}{5}" />, <InlineMath math="\frac{1}{4}" /></p>
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
                  Tentukan kebalikan dari pecahan campuran <InlineMath math="2\frac{3}{5}" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah pecahan campuran ke pecahan biasa</p>
                    <div className="pl-4">
                      <InlineMath math="2\frac{3}{5} = \frac{(2 \times 5) + 3}{5} = \frac{13}{5}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Tentukan kebalikannya</p>
                    <div className="pl-4">
                      Kebalikan dari <InlineMath math="\frac{13}{5}" /> adalah <InlineMath math="\frac{5}{13}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Verifikasi dengan mengalikan</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{13}{5} \times \frac{5}{13} = \frac{65}{65} = 1" /> (Benar!)
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{5}{13}" /></p>
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
                  Jika <InlineMath math="x" /> adalah kebalikan dari <InlineMath math="3\frac{1}{4}" /> dan <InlineMath math="y" /> adalah kebalikan dari <InlineMath math="2\frac{1}{6}" />, 
                  hitunglah nilai dari <InlineMath math="x + y" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Tentukan nilai x (kebalikan dari <InlineMath math="3\frac{1}{4}" />)</p>
                    <div className="pl-4">
                      <InlineMath math="3\frac{1}{4} = \frac{13}{4}" /> sehingga <InlineMath math="x = \frac{4}{13}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Tentukan nilai y (kebalikan dari <InlineMath math="2\frac{1}{6}" />)</p>
                    <div className="pl-4">
                      <InlineMath math="2\frac{1}{6} = \frac{13}{6}" /> sehingga <InlineMath math="y = \frac{6}{13}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Hitung x + y</p>
                    <div className="pl-4">
                      <InlineMath math="x + y = \frac{4}{13} + \frac{6}{13} = \frac{4 + 6}{13} = \frac{10}{13}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{10}{13}" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 3: Pembagian Pecahan Negatif */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => toggleSection(2)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <MinusCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Pembagian Pecahan Negatif</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 2 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 2 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  Pembagian pecahan negatif mengikuti aturan tanda yang sama dengan perkalian: 
                  <strong> positif dibagi negatif = negatif</strong>, <strong>negatif dibagi positif = negatif</strong>, 
                  dan <strong>negatif dibagi negatif = positif</strong>. 
                  Caranya tetap sama: ubah jadi perkalian dengan kebalikan, lalu perhatikan tanda hasilnya!
                </p>
              </div>

              {/* Aturan Tanda */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Aturan Tanda pada Pembagian:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm font-body">
                    <div className="text-white/80"><InlineMath math="(+) \div (+) = (+)" /></div>
                    <div className="text-white/80"><InlineMath math="(+) \div (-) = (-)" /></div>
                    <div className="text-white/80"><InlineMath math="(-) \div (+) = (-)" /></div>
                    <div className="text-white/80"><InlineMath math="(-) \div (-) = (+)" /></div>
                  </div>
                  <p className="text-white/60 text-xs mt-2 text-center">Tanda sama = positif, Tanda beda = negatif</p>
                </div>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah <InlineMath math="\frac{3}{8} \div \left(-\frac{2}{5}\right)" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah jadi perkalian dengan kebalikan</p>
                    <div className="pl-4"><InlineMath math="\frac{3}{8} \div \left(-\frac{2}{5}\right) = \frac{3}{8} \times \left(-\frac{5}{2}\right)" /></div>
                    <p><strong>Langkah 2:</strong> Kalikan dan tentukan tanda</p>
                    <div className="pl-4">
                      <InlineMath math="= -\frac{3 \times 5}{8 \times 2} = -\frac{15}{16}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="-\frac{15}{16}" /></p>
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
                  Hitunglah <InlineMath math="-2\frac{1}{3} \div \left(-3\frac{1}{2}\right)" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah ke pecahan biasa</p>
                    <div className="pl-4">
                      <InlineMath math="-2\frac{1}{3} = -\frac{7}{3}" /> dan <InlineMath math="-3\frac{1}{2} = -\frac{7}{2}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Ubah jadi perkalian dengan kebalikan</p>
                    <div className="pl-4"><InlineMath math="-\frac{7}{3} \div \left(-\frac{7}{2}\right) = -\frac{7}{3} \times \left(-\frac{2}{7}\right)" /></div>
                    <p><strong>Langkah 3:</strong> Kalikan dan tentukan tanda</p>
                    <div className="pl-4">
                      Negatif × Negatif = Positif
                    </div>
                    <div className="pl-4">
                      <InlineMath math="= +\frac{7 \times 2}{3 \times 7} = \frac{14}{21} = \frac{2}{3}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="\frac{2}{3}" /></p>
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
                  Hitunglah <InlineMath math="\left(-\frac{3}{4}\right) \div \frac{9}{16} \div \left(-\frac{2}{3}\right)" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Kerjakan dari kiri ke kanan, hitung bagian pertama</p>
                    <div className="pl-4">
                      <InlineMath math="\left(-\frac{3}{4}\right) \div \frac{9}{16} = \left(-\frac{3}{4}\right) \times \frac{16}{9}" />
                    </div>
                    <div className="pl-4">
                      <InlineMath math="= -\frac{3 \times 16}{4 \times 9} = -\frac{48}{36} = -\frac{4}{3}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Lanjutkan dengan pembagian kedua</p>
                    <div className="pl-4">
                      <InlineMath math="-\frac{4}{3} \div \left(-\frac{2}{3}\right) = -\frac{4}{3} \times \left(-\frac{3}{2}\right)" />
                    </div>
                    <div className="pl-4">
                      Negatif × Negatif = Positif
                    </div>
                    <div className="pl-4">
                      <InlineMath math="= +\frac{4 \times 3}{3 \times 2} = \frac{12}{6} = 2" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="2" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Kembali */}
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

export default PembagianPecahanPage;
