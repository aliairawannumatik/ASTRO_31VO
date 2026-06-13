import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Plus, Minus, RefreshCw } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import FractionCircleAnimation from "@/components/FractionCircleAnimation";

const PenjumlahanPenguranganPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["penjumlahan", "pengurangan", "sifat-penjumlahan", "pecahan-negatif"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENJUMLAHAN DAN PENGURANGAN PECAHAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Rasional - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Animasi Interaktif */}
          <FractionCircleAnimation />

          {/* Section 1: Penjumlahan Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("penjumlahan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Penjumlahan Pecahan</span>
              </div>
              {expandedSections.includes("penjumlahan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("penjumlahan") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Penjumlahan pecahan</strong> adalah operasi menggabungkan dua pecahan atau lebih menjadi satu nilai. Kunci utamanya ada pada <strong>penyebut</strong>: jika penyebutnya sama, langsung jumlahkan pembilangnya. Jika berbeda, samakan dulu penyebutnya menggunakan KPK!
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Penjumlahan Pecahan:</p>
                  
                  <p className="font-body text-xs text-white/70 mb-2">Jika penyebut sama:</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center mb-3">
                    <BlockMath math="\frac{a}{c} + \frac{b}{c} = \frac{a + b}{c}" />
                  </div>
                  
                  <p className="font-body text-xs text-white/70 mb-2">Jika penyebut berbeda:</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{a \times d + c \times b}{b \times d}" />
                    <p className="text-white/60 text-xs mt-2">atau gunakan KPK dari penyebut</p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Visualisasi:</strong> Bayangkan kamu punya <InlineMath math="\frac{2}{4}" /> bagian pizza dan temanmu memberi <InlineMath math="\frac{1}{4}" /> bagian lagi. Total yang kamu punya adalah <InlineMath math="\frac{2+1}{4} = \frac{3}{4}" /> bagian pizza!
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Penting:</strong> Selalu sederhanakan hasil akhir jika memungkinkan! Jika hasilnya berupa pecahan tidak murni (pembilang lebih besar dari penyebut), ubah menjadi pecahan campuran.
                  </p>
                </div>

                {/* Contoh Soal Penjumlahan */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="\frac{5}{12} + \frac{3}{12}" />
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Perhatikan penyebutnya sudah sama (12)</p>
                        <p><strong>Langkah 2:</strong> Langsung jumlahkan pembilangnya:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{5}{12} + \frac{3}{12} = \frac{5 + 3}{12} = \frac{8}{12}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Sederhanakan dengan membagi FPB (4):</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{8}{12} = \frac{8 \div 4}{12 \div 4} = \frac{2}{3}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{5}{12} + \frac{3}{12} = \frac{2}{3}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="1\frac{1}{6} + 3\frac{7}{8}" />
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Tentukan KPK dari 6 dan 8 = 24</p>
                        <p><strong>Langkah 2:</strong> Samakan penyebut kedua pecahan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="1\frac{1}{6} = 1\frac{4}{24}" />
                          <BlockMath math="3\frac{7}{8} = 3\frac{21}{24}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Jumlahkan bilangan bulat dan pecahannya:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="1\frac{4}{24} + 3\frac{21}{24} = (1+3) + \frac{4+21}{24} = 4\frac{25}{24}" />
                        </div>
                        <p><strong>Langkah 4:</strong> Karena <InlineMath math="\frac{25}{24} > 1" />, ubah ke pecahan campuran:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="4\frac{25}{24} = 4 + 1\frac{1}{24} = 5\frac{1}{24}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="1\frac{1}{6} + 3\frac{7}{8} = 5\frac{1}{24}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 3 - Sulit */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                      <span className="font-body font-semibold text-white">Contoh 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Sebuah mobil angkutan mengangkut sepeda motor dari dealer A dengan berat <InlineMath math="130\frac{1}{4}" /> kg, dan dari dealer B dengan berat <InlineMath math="128\frac{3}{8}" /> kg. Berapa kilogram total berat beban yang diangkut?
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Identifikasi yang dijumlahkan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\text{Total} = 130\frac{1}{4} + 128\frac{3}{8}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Tentukan KPK dari 4 dan 8 = 8</p>
                        <p><strong>Langkah 3:</strong> Samakan penyebut:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="130\frac{1}{4} = 130\frac{2}{8}" />
                        </div>
                        <p><strong>Langkah 4:</strong> Jumlahkan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="130\frac{2}{8} + 128\frac{3}{8} = (130+128) + \frac{2+3}{8} = 258\frac{5}{8}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, total berat beban adalah <InlineMath math="258\frac{5}{8}" /> kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Sifat-Sifat Penjumlahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifat-penjumlahan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Sifat-Sifat Penjumlahan Pecahan</span>
              </div>
              {expandedSections.includes("sifat-penjumlahan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("sifat-penjumlahan") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Penjumlahan pecahan memiliki <strong className="text-primary">dua sifat penting</strong> yang dapat mempermudah perhitungan: <strong>Sifat Komutatif</strong> (pertukaran) dan <strong>Sifat Asosiatif</strong> (pengelompokan).
                  </p>
                </div>

                {/* Sifat Komutatif */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">1. Sifat Komutatif (Pertukaran)</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">
                    Urutan penjumlahan tidak memengaruhi hasil. Mau dijumlahkan dari kiri atau kanan, hasilnya tetap sama!
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{c}{d} + \frac{a}{b}" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    Contoh: <InlineMath math="\frac{1}{2} + \frac{3}{4} = \frac{3}{4} + \frac{1}{2} = \frac{5}{4}" />
                  </p>
                </div>

                {/* Sifat Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">2. Sifat Asosiatif (Pengelompokan)</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">
                    Cara pengelompokan tidak memengaruhi hasil. Kamu bebas menjumlahkan yang mana dulu!
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\left(\frac{a}{b} + \frac{c}{d}\right) + \frac{e}{f} = \frac{a}{b} + \left(\frac{c}{d} + \frac{e}{f}\right)" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    Contoh: <InlineMath math="\left(\frac{1}{2} + \frac{1}{4}\right) + \frac{1}{8} = \frac{1}{2} + \left(\frac{1}{4} + \frac{1}{8}\right) = \frac{7}{8}" />
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips:</strong> Gunakan sifat-sifat ini untuk mempermudah perhitungan! Misalnya, kelompokkan pecahan dengan penyebut sama terlebih dahulu.
                  </p>
                </div>

                {/* Contoh Soal Sifat Penjumlahan */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Buktikan bahwa <InlineMath math="\frac{2}{5} + \frac{1}{3} = \frac{1}{3} + \frac{2}{5}" />
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Ruas Kiri:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{5} + \frac{1}{3} = \frac{6}{15} + \frac{5}{15} = \frac{11}{15}" />
                        </div>
                        <p><strong>Ruas Kanan:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{1}{3} + \frac{2}{5} = \frac{5}{15} + \frac{6}{15} = \frac{11}{15}" />
                        </div>
                        <p className="text-primary font-semibold">Terbukti keduanya sama = <InlineMath math="\frac{11}{15}" /> (Sifat Komutatif)</p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="\frac{3}{10} + \frac{1}{7} + \frac{7}{10}" /> dengan cara yang efisien!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Gunakan sifat komutatif, kelompokkan penyebut sama:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{10} + \frac{1}{7} + \frac{7}{10} = \left(\frac{3}{10} + \frac{7}{10}\right) + \frac{1}{7}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Hitung pecahan dengan penyebut sama terlebih dahulu:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{10}{10} + \frac{1}{7} = 1 + \frac{1}{7} = 1\frac{1}{7}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, hasilnya adalah <InlineMath math="1\frac{1}{7}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 3 - Sulit */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                      <span className="font-body font-semibold text-white">Contoh 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="5\frac{2}{3} + 6\frac{1}{4} + 4\frac{1}{2}" /> dengan menggunakan sifat asosiatif!
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Jumlahkan bilangan bulat terlebih dahulu:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="5 + 6 + 4 = 15" />
                        </div>
                        <p><strong>Langkah 2:</strong> Tentukan KPK dari 3, 4, dan 2 = 12</p>
                        <p><strong>Langkah 3:</strong> Samakan penyebut pecahan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{3} = \frac{8}{12}, \quad \frac{1}{4} = \frac{3}{12}, \quad \frac{1}{2} = \frac{6}{12}" />
                        </div>
                        <p><strong>Langkah 4:</strong> Jumlahkan pecahannya:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{8}{12} + \frac{3}{12} + \frac{6}{12} = \frac{17}{12} = 1\frac{5}{12}" />
                        </div>
                        <p><strong>Langkah 5:</strong> Gabungkan dengan bilangan bulat:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="15 + 1\frac{5}{12} = 16\frac{5}{12}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, hasilnya adalah <InlineMath math="16\frac{5}{12}" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Pengurangan Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("pengurangan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Minus className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Pengurangan Pecahan</span>
              </div>
              {expandedSections.includes("pengurangan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("pengurangan") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Pengurangan pecahan</strong> adalah operasi mengurangkan satu pecahan dari pecahan lainnya. Prinsipnya mirip dengan penjumlahan: <strong>samakan penyebut</strong> terlebih dahulu, baru kurangkan pembilangnya!
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Pengurangan Pecahan:</p>
                  
                  <p className="font-body text-xs text-white/70 mb-2">Jika penyebut sama:</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center mb-3">
                    <BlockMath math="\frac{a}{c} - \frac{b}{c} = \frac{a - b}{c}" />
                  </div>
                  
                  <p className="font-body text-xs text-white/70 mb-2">Jika penyebut berbeda:</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\frac{a}{b} - \frac{c}{d} = \frac{a \times d - c \times b}{b \times d}" />
                    <p className="text-white/60 text-xs mt-2">atau gunakan KPK dari penyebut</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Perhatian!</strong> Berbeda dengan penjumlahan, pengurangan <strong>tidak memiliki sifat komutatif</strong>. Artinya, <InlineMath math="\frac{a}{b} - \frac{c}{d} \neq \frac{c}{d} - \frac{a}{b}" />
                  </p>
                </div>

                {/* Contoh Soal Pengurangan */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="\frac{5}{9} - \frac{2}{9}" />
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Penyebut sudah sama (9)</p>
                        <p><strong>Langkah 2:</strong> Kurangkan pembilangnya:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{5}{9} - \frac{2}{9} = \frac{5 - 2}{9} = \frac{3}{9}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Sederhanakan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{9} = \frac{1}{3}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{5}{9} - \frac{2}{9} = \frac{1}{3}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="\frac{3}{4} - \frac{1}{6}" />
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Penyebut berbeda, cari KPK dari 4 dan 6 = 12</p>
                        <p><strong>Langkah 2:</strong> Samakan penyebut:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{4} = \frac{3 \times 3}{4 \times 3} = \frac{9}{12}" />
                          <BlockMath math="\frac{1}{6} = \frac{1 \times 2}{6 \times 2} = \frac{2}{12}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Kurangkan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{9}{12} - \frac{2}{12} = \frac{7}{12}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{3}{4} - \frac{1}{6} = \frac{7}{12}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 3 - Sulit */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                      <span className="font-body font-semibold text-white">Contoh 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Seseorang mendapat upah Rp840.000 sebulan. Seperenam dari upah digunakan untuk sewa rumah, <InlineMath math="\frac{2}{5}" /> bagian untuk kebutuhan makan. Berapa rupiah yang digunakan untuk keperluan lain?
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Hitung bagian untuk keperluan lain:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\text{Keperluan lain} = 1 - \frac{1}{6} - \frac{2}{5}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Cari KPK dari 6 dan 5 = 30, samakan penyebut:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{30}{30} - \frac{5}{30} - \frac{12}{30}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Kurangkan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{30 - 5 - 12}{30} = \frac{13}{30}" />
                        </div>
                        <p><strong>Langkah 4:</strong> Hitung uang untuk keperluan lain:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{13}{30} \times 840.000 = \text{Rp}364.000" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, uang untuk keperluan lain adalah Rp364.000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Penjumlahan dan Pengurangan Pecahan Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("pecahan-negatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Penjumlahan dan Pengurangan Pecahan Negatif</span>
              </div>
              {expandedSections.includes("pecahan-negatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("pecahan-negatif") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Pecahan negatif</strong> adalah pecahan yang nilainya kurang dari nol. Operasi penjumlahan dan pengurangan pada pecahan negatif mengikuti aturan yang sama dengan bilangan bulat negatif, dikombinasikan dengan aturan pecahan.
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Bentuk Penulisan Pecahan Negatif:</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="-\frac{a}{b} = \frac{-a}{b} = \frac{a}{-b}" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">Ketiga bentuk di atas nilainya sama</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">Aturan Tanda:</p>
                  <ul className="font-body text-sm text-white/80 space-y-1 list-disc list-inside">
                    <li>Positif + Positif = Positif</li>
                    <li>Negatif + Negatif = Negatif (jumlahkan, beri tanda negatif)</li>
                    <li>Positif + Negatif = Kurangkan, ikuti tanda yang lebih besar</li>
                    <li>Dikurangi bilangan negatif = Ditambah bilangan positif</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips:</strong> Ingat bahwa mengurangi bilangan negatif sama dengan menambah bilangan positif: <InlineMath math="a - (-b) = a + b" />
                  </p>
                </div>

                {/* Contoh Soal Pecahan Negatif */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="-\frac{3}{8} + \left(-\frac{7}{8}\right)" />
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Kedua pecahan negatif, maka jumlahkan nilainya dan beri tanda negatif:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="-\frac{3}{8} + \left(-\frac{7}{8}\right) = -\frac{3 + 7}{8} = -\frac{10}{8}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Sederhanakan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="-\frac{10}{8} = -\frac{5}{4} = -1\frac{1}{4}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, hasilnya adalah <InlineMath math="-1\frac{1}{4}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="\frac{5}{6} - \left(-\frac{1}{4}\right)" />
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Ubah pengurangan negatif menjadi penjumlahan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{5}{6} - \left(-\frac{1}{4}\right) = \frac{5}{6} + \frac{1}{4}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Samakan penyebut (KPK 6 dan 4 = 12):</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{10}{12} + \frac{3}{12} = \frac{13}{12} = 1\frac{1}{12}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, hasilnya adalah <InlineMath math="1\frac{1}{12}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 3 - Sulit */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                      <span className="font-body font-semibold text-white">Contoh 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Hitunglah <InlineMath math="-3\frac{1}{3} - \left(-5\frac{1}{2}\right) + \left(-2\frac{1}{6}\right)" />
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Sederhanakan tanda operasi:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="-3\frac{1}{3} - \left(-5\frac{1}{2}\right) + \left(-2\frac{1}{6}\right) = -3\frac{1}{3} + 5\frac{1}{2} - 2\frac{1}{6}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Ubah ke pecahan biasa dengan penyebut sama (KPK = 6):</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= -\frac{10}{3} + \frac{11}{2} - \frac{13}{6}" />
                          <BlockMath math="= -\frac{20}{6} + \frac{33}{6} - \frac{13}{6}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Hitung dari kiri ke kanan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{-20 + 33 - 13}{6} = \frac{0}{6} = 0" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, hasilnya adalah 0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-yellow-500 via-lime-500 to-green-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">➕➖ RANGKUMAN LENGKAP</p>
            <p className="font-body text-xs text-white/80 mt-0.5">Penjumlahan &amp; Pengurangan Pecahan — Kelas 7</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">1</span>
                Aturan Penjumlahan &amp; Pengurangan Pecahan
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Penyebut SAMA → Langsung operasikan", desc: "a/b + c/b = (a+c)/b dan a/b − c/b = (a−c)/b. Hanya pembilang yang dijumlahkan/dikurangi, penyebut tetap!", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
                  { label: "Penyebut BEDA → Samakan dulu dengan KPK", desc: "Cari KPK penyebut. Ubah semua pecahan ke penyebut KPK. Baru jumlah/kurangi pembilangnya.", color: "from-lime-900/70 to-lime-800/30 border-lime-500/50 text-lime-200" },
                  { label: "Pecahan Campuran → Ubah ke biasa dulu", desc: "2 3/4 = (2×4+3)/4 = 11/4. Ubah semua pecahan campuran ke bentuk biasa sebelum dioperasikan.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
                  { label: "Sederhanakan hasil akhir!", desc: "Setelah menjumlah/mengurangi, selalu cek apakah hasilnya bisa disederhanakan dengan FPB.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
                ].map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div><p className="font-body text-xs font-bold">{label}</p><p className="font-body text-xs text-white/65 mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-lime-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-lime-500/30 border border-lime-500 flex items-center justify-center text-[10px]">2</span>
                Tips &amp; Trik Jitu
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🎯", tip: "Jangan pernah langsung menjumlah penyebut!", detail: "3/4 + 1/2 ≠ 4/6. Ini kesalahan paling umum! Selalu samakan penyebut dulu dengan KPK: 3/4 + 2/4 = 5/4.", color: "bg-red-900/30 border-red-500/30" },
                  { icon: "⚡", tip: "Gunakan KPK, bukan perkalian langsung", detail: "Untuk 1/6 + 1/4, KPK = 12 (bukan 24). Menggunakan KPK membuat pecahan lebih kecil dan mudah disederhanakan.", color: "bg-yellow-900/30 border-yellow-500/30" },
                  { icon: "🔄", tip: "Tiga pecahan sekaligus? Tetap samakan semua dulu", detail: "Cari KPK dari ketiga penyebut sekaligus, ubah semua ke penyebut yang sama, baru kerjakan dari kiri ke kanan.", color: "bg-lime-900/30 border-lime-500/30" },
                  { icon: "✅", tip: "Verifikasi dengan desimal", detail: "Ubah pecahanmu ke desimal dan hitung. Contoh: 1/4 + 1/2 = 0,25 + 0,50 = 0,75 = 3/4. Cocokkan hasilmu!", color: "bg-green-900/30 border-green-500/30" },
                ].map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 via-lime-500/15 to-green-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌻</div>
              <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Kunci penjumlahan dan pengurangan pecahan hanya satu: <strong className="text-yellow-300">penyebut harus sama sebelum dioperasikan</strong>. Gunakan <strong className="text-lime-300">KPK untuk menyamakan penyebut</strong>, operasikan hanya pembilangnya, lalu sederhanakan hasilnya dengan FPB. Sederhana, sistematis, dan tidak bisa salah!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {["Penyebut Sama = Langsung", "KPK untuk Samakan", "Ubah Campuran dulu", "Sederhanakan Akhir"].map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Lanjut ke Perkalian Pecahan!</p>
            </div>
          </div>
        </div>

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

export default PenjumlahanPenguranganPage;
