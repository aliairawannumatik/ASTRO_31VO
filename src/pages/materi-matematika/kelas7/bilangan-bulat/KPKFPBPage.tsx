import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Zap, Calculator, AlertTriangle, Layers } from "lucide-react";
import FactorTreeAnimation from "@/components/FactorTreeAnimation";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const KPKFPBPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["kelipatan", "faktor", "faktorisasi", "contoh-kpk", "contoh-fpb", "aplikasi"]);

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
          KPK DAN FPB
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Kelipatan dan Kelipatan Persekutuan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kelipatan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kelipatan dan Kelipatan Persekutuan</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Ringkasan Intisari:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Kelipatan</strong> suatu bilangan <InlineMath math="a" /> diperoleh dengan mengalikan <InlineMath math="a" /> dengan bilangan asli berurutan <InlineMath math="(1, 2, 3, 4, ...)" />. 
                    Ketika dua bilangan atau lebih memiliki kelipatan yang sama, bilangan tersebut disebut <strong className="text-cyan-400">Kelipatan Persekutuan</strong>. 
                    Yang terkecil dari kelipatan persekutuan ini dinamakan <strong className="text-green-400">KPK (Kelipatan Persekutuan Terkecil)</strong>.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Contoh Kelipatan:</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">Kelipatan dari <InlineMath math="2" />:</p>
                      <BlockMath math="2, 4, 6, 8, 10, 12, 14, 16, ..." />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">Kelipatan dari <InlineMath math="3" />:</p>
                      <BlockMath math="3, 6, 9, 12, 15, 18, 21, 24, ..." />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">Kelipatan dari <InlineMath math="4" />:</p>
                      <BlockMath math="4, 8, 12, 16, 20, 24, 28, 32, ..." />
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">Kelipatan Persekutuan dari 3 dan 4:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="text-white/70 text-sm">Kelipatan 3: <InlineMath math="3, 6, 9, \textcolor{lime}{12}, 15, 18, 21, \textcolor{lime}{24}, 27, 30, 33, \textcolor{lime}{36}, ..." /></p>
                    <p className="text-white/70 text-sm">Kelipatan 4: <InlineMath math="4, 8, \textcolor{lime}{12}, 16, 20, \textcolor{lime}{24}, 28, 32, \textcolor{lime}{36}, ..." /></p>
                    <p className="text-cyan-400 text-sm font-semibold">Kelipatan Persekutuan: <InlineMath math="12, 24, 36, 48, ..." /></p>
                    <p className="text-green-400 font-semibold">KPK dari 3 dan 4 = <InlineMath math="12" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips:</strong> Kelipatan suatu bilangan selalu tak terhingga banyaknya, tetapi KPK adalah satu nilai pasti yang merupakan kelipatan terkecil yang dimiliki bersama oleh dua bilangan atau lebih.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Faktor dan Faktor Persekutuan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("faktor")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Faktor dan Faktor Persekutuan</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Ringkasan Intisari:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Faktor</strong> adalah bilangan-bilangan yang dapat membagi habis suatu bilangan. 
                    Ketika dua bilangan atau lebih memiliki faktor yang sama, faktor tersebut disebut <strong className="text-cyan-400">Faktor Persekutuan</strong>. 
                    Yang terbesar dari faktor persekutuan ini dinamakan <strong className="text-orange-400">FPB (Faktor Persekutuan Terbesar)</strong>.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">Cara Mencari Faktor:</p>
                  <p className="text-white/70 text-sm mb-3">Temukan semua bilangan yang dapat membagi habis bilangan tersebut:</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">Faktor dari <InlineMath math="12" />:</p>
                      <div className="text-white/60 text-xs mt-1">
                        <InlineMath math="12 = 1 \times 12 = 2 \times 6 = 3 \times 4" />
                      </div>
                      <BlockMath math="\text{Faktor: } 1, 2, 3, 4, 6, 12" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">Faktor dari <InlineMath math="18" />:</p>
                      <div className="text-white/60 text-xs mt-1">
                        <InlineMath math="18 = 1 \times 18 = 2 \times 9 = 3 \times 6" />
                      </div>
                      <BlockMath math="\text{Faktor: } 1, 2, 3, 6, 9, 18" />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-orange-300 mb-3">Faktor Persekutuan dari 12 dan 18:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="text-white/70 text-sm">Faktor 12: <InlineMath math="\textcolor{orange}{1}, \textcolor{orange}{2}, \textcolor{orange}{3}, 4, \textcolor{orange}{6}, 12" /></p>
                    <p className="text-white/70 text-sm">Faktor 18: <InlineMath math="\textcolor{orange}{1}, \textcolor{orange}{2}, \textcolor{orange}{3}, \textcolor{orange}{6}, 9, 18" /></p>
                    <p className="text-cyan-400 text-sm font-semibold">Faktor Persekutuan: <InlineMath math="1, 2, 3, 6" /></p>
                    <p className="text-orange-400 font-semibold">FPB dari 12 dan 18 = <InlineMath math="6" /></p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Ingat!</strong> Faktor suatu bilangan selalu terbatas (ada batasnya), berbeda dengan kelipatan yang tak terhingga. FPB adalah faktor terbesar yang dimiliki bersama.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Faktorisasi Prima */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("faktorisasi")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Metode Faktorisasi Prima</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Ringkasan Intisari:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-blue-400">Faktorisasi prima</strong> adalah cara menguraikan bilangan menjadi perkalian bilangan-bilangan prima. 
                    Metode ini sangat memudahkan pencarian KPK dan FPB, terutama untuk bilangan yang besar.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3">Aturan Penting:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-green-300 mb-1">KPK dengan Faktorisasi Prima:</p>
                      <p className="text-white/70 text-sm">Kalikan semua faktor prima yang berbeda dengan pangkat <strong className="text-green-400">TERTINGGI</strong></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-orange-300 mb-1">FPB dengan Faktorisasi Prima:</p>
                      <p className="text-white/70 text-sm">Kalikan faktor prima yang SAMA dengan pangkat <strong className="text-orange-400">TERENDAH</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Contoh Faktorisasi Prima:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm mb-2">Faktorisasi prima dari 12 dan 18:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <BlockMath math="12 = 2^2 \times 3" />
                        </div>
                        <div>
                          <BlockMath math="18 = 2 \times 3^2" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-sm mb-1"><strong>KPK</strong> = pangkat tertinggi:</p>
                      <BlockMath math="KPK = 2^2 \times 3^2 = 4 \times 9 = 36" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-orange-400 text-sm mb-1"><strong>FPB</strong> = pangkat terendah (faktor sama):</p>
                      <BlockMath math="FPB = 2^1 \times 3^1 = 2 \times 3 = 6" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Jitu:</strong> Gunakan pohon faktor untuk mempermudah proses faktorisasi. Bagi bilangan dengan bilangan prima terkecil (2, 3, 5, 7, ...) secara berurutan hingga hasilnya 1.
                  </p>
                </div>

                <FactorTreeAnimation />
              </div>
            )}
          </div>

          {/* Section: Contoh Soal KPK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh-kpk")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Contoh Soal KPK (Bertingkat)</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">
                {/* Soal Mudah */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-green-300">Contoh 1</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Tentukan KPK dari 6 dan 8!</p>
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima masing-masing bilangan</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="6 = 2 \times 3" />
                        <br />
                        <InlineMath math="8 = 2^3" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Ambil semua faktor prima dengan pangkat tertinggi</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: pangkat tertinggi = 3 (dari 8)</p>
                        <p className="text-white/60 text-xs">Faktor 3: pangkat tertinggi = 1 (dari 6)</p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Kalikan faktor-faktor tersebut</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="KPK = 2^3 \times 3 = 8 \times 3 = 24" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: KPK dari 6 dan 8 adalah <InlineMath math="24" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Sedang */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-yellow-300">Contoh 2</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Tentukan KPK dari 28 dan 42!</p>
                  </div>
                  <div className="border-t border-yellow-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="28 = 4 \times 7 = 2^2 \times 7" />
                        <br />
                        <InlineMath math="42 = 6 \times 7 = 2 \times 3 \times 7" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Identifikasi semua faktor prima dan pangkat tertingginya</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: pangkat tertinggi = 2 (dari 28)</p>
                        <p className="text-white/60 text-xs">Faktor 3: pangkat tertinggi = 1 (dari 42)</p>
                        <p className="text-white/60 text-xs">Faktor 7: pangkat tertinggi = 1 (sama)</p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Hitung KPK</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="KPK = 2^2 \times 3 \times 7 = 4 \times 3 \times 7 = 84" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: KPK dari 28 dan 42 adalah <InlineMath math="84" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Sulit */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-red-300">Contoh 3</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Tentukan KPK dari 50, 84, dan 90!</p>
                  </div>
                  <div className="border-t border-red-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima ketiga bilangan</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="50 = 2 \times 25 = 2 \times 5^2" />
                        <br />
                        <InlineMath math="84 = 4 \times 21 = 2^2 \times 3 \times 7" />
                        <br />
                        <InlineMath math="90 = 9 \times 10 = 2 \times 3^2 \times 5" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Tentukan pangkat tertinggi setiap faktor prima</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: pangkat tertinggi = 2 (dari 84)</p>
                        <p className="text-white/60 text-xs">Faktor 3: pangkat tertinggi = 2 (dari 90)</p>
                        <p className="text-white/60 text-xs">Faktor 5: pangkat tertinggi = 2 (dari 50)</p>
                        <p className="text-white/60 text-xs">Faktor 7: pangkat tertinggi = 1 (dari 84)</p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Kalikan semua faktor dengan pangkat tertinggi</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="KPK = 2^2 \times 3^2 \times 5^2 \times 7" />
                        <br />
                        <InlineMath math="= 4 \times 9 \times 25 \times 7 = 6.300" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: KPK dari 50, 84, dan 90 adalah <InlineMath math="6.300" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal FPB */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh-fpb")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Contoh Soal FPB (Bertingkat)</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">
                {/* Soal Mudah */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-green-300">Contoh 1</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Tentukan FPB dari 12 dan 18!</p>
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="12 = 2^2 \times 3" />
                        <br />
                        <InlineMath math="18 = 2 \times 3^2" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Ambil faktor prima yang SAMA dengan pangkat TERENDAH</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: ada di keduanya, pangkat terendah = 1</p>
                        <p className="text-white/60 text-xs">Faktor 3: ada di keduanya, pangkat terendah = 1</p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Kalikan faktor-faktor tersebut</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="FPB = 2^1 \times 3^1 = 2 \times 3 = 6" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: FPB dari 12 dan 18 adalah <InlineMath math="6" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Sedang */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-yellow-300">Contoh 2</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Tentukan FPB dari 28 dan 42!</p>
                  </div>
                  <div className="border-t border-yellow-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="28 = 2^2 \times 7" />
                        <br />
                        <InlineMath math="42 = 2 \times 3 \times 7" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Identifikasi faktor prima yang SAMA</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: ada di keduanya, pangkat terendah = 1</p>
                        <p className="text-white/60 text-xs">Faktor 3: hanya di 42 (tidak dihitung)</p>
                        <p className="text-white/60 text-xs">Faktor 7: ada di keduanya, pangkat terendah = 1</p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Hitung FPB</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="FPB = 2 \times 7 = 14" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: FPB dari 28 dan 42 adalah <InlineMath math="14" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Sulit */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-red-300">Contoh 3</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Tentukan FPB dari 24, 48, dan 72!</p>
                  </div>
                  <div className="border-t border-red-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima ketiga bilangan</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="24 = 2^3 \times 3" />
                        <br />
                        <InlineMath math="48 = 2^4 \times 3" />
                        <br />
                        <InlineMath math="72 = 2^3 \times 3^2" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Tentukan faktor prima yang sama dengan pangkat terendah</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: ada di ketiganya, pangkat terendah = 3</p>
                        <p className="text-white/60 text-xs">Faktor 3: ada di ketiganya, pangkat terendah = 1</p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Kalikan faktor-faktor tersebut</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="FPB = 2^3 \times 3 = 8 \times 3 = 24" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: FPB dari 24, 48, dan 72 adalah <InlineMath math="24" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Aplikasi dalam Kehidupan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("aplikasi")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Aplikasi KPK dan FPB dalam Kehidupan</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">
                {/* Aplikasi KPK */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">KPK</span>
                    <span className="font-body font-semibold text-green-300">Soal Cerita - Jadwal Bertemu</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Arkan mengunjungi perpustakaan setiap <strong>6 hari sekali</strong>, Dimas setiap <strong>4 hari sekali</strong>, 
                      dan Sukma setiap <strong>8 hari sekali</strong>. Jika pada tanggal 28 Januari mereka berkunjung bersama-sama, 
                      kapan mereka akan bertemu lagi di perpustakaan?
                    </p>
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Analisis:</strong> Soal ini berkaitan dengan KPK karena kita mencari waktu bertemu berikutnya (kelipatan persekutuan).</p>
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="6 = 2 \times 3" />
                        <br />
                        <InlineMath math="4 = 2^2" />
                        <br />
                        <InlineMath math="8 = 2^3" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Hitung KPK (pangkat tertinggi)</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="KPK = 2^3 \times 3 = 8 \times 3 = 24" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Hitung tanggal berikutnya</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">28 Januari + 24 hari</p>
                        <p className="text-white/60 text-xs">Januari memiliki 31 hari, sisa: 31 - 28 = 3 hari</p>
                        <p className="text-white/60 text-xs">24 - 3 = 21 hari di bulan Februari</p>
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: Mereka akan bertemu lagi pada tanggal <strong>21 Februari</strong></p>
                    </div>
                  </div>
                </div>

                {/* Aplikasi FPB */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">FPB</span>
                    <span className="font-body font-semibold text-orange-300">Soal Cerita - Pembagian Rata</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Tersedia <strong>84 buku</strong>, <strong>56 pensil</strong>, dan <strong>140 krayon</strong>. 
                      Jika semua barang tersebut akan dibagikan secara merata kepada sejumlah anak tanpa ada yang tersisa, 
                      berapa jumlah anak maksimal yang dapat menerima pembagian tersebut?
                    </p>
                  </div>
                  <div className="border-t border-orange-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-orange-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Analisis:</strong> Soal ini berkaitan dengan FPB karena kita mencari pembagi terbesar yang dapat membagi semua bilangan tanpa sisa.</p>
                      <p className="text-white/70"><strong>Langkah 1:</strong> Faktorisasi prima</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="84 = 2^2 \times 3 \times 7" />
                        <br />
                        <InlineMath math="56 = 2^3 \times 7" />
                        <br />
                        <InlineMath math="140 = 2^2 \times 5 \times 7" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Hitung FPB (faktor sama, pangkat terendah)</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">Faktor 2: ada di ketiganya, pangkat terendah = 2</p>
                        <p className="text-white/60 text-xs">Faktor 7: ada di ketiganya, pangkat terendah = 1</p>
                        <InlineMath math="FPB = 2^2 \times 7 = 4 \times 7 = 28" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: Maksimal <strong>28 anak</strong> yang dapat menerima pembagian secara merata.</p>
                      <div className="bg-slate-800/50 rounded p-2 mt-2">
                        <p className="text-white/60 text-xs">Setiap anak mendapat:</p>
                        <p className="text-white/60 text-xs">- Buku: 84 : 28 = 3 buku</p>
                        <p className="text-white/60 text-xs">- Pensil: 56 : 28 = 2 pensil</p>
                        <p className="text-white/60 text-xs">- Krayon: 140 : 28 = 5 krayon</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kesimpulan dan Tips */}
                <div className="bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-400/40 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📌</span>
                    <span className="font-body font-bold text-indigo-300 text-sm">Kesimpulan Materi KPK dan FPB</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-green-500/20">
                      <p className="font-body font-semibold text-green-300 text-sm mb-2">✅ Poin Kunci KPK</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><strong className="text-white/90">KPK</strong> = Kelipatan Persekutuan <strong className="text-green-400">Terkecil</strong></li>
                        <li>Ambil semua faktor prima dengan pangkat <strong className="text-green-400">tertinggi</strong></li>
                        <li>Hasilnya selalu <strong className="text-white/90">≥</strong> bilangan terbesar dari yang dicari</li>
                        <li>Digunakan saat mencari waktu atau kejadian yang <strong className="text-white/90">berulang bersama</strong></li>
                      </ul>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 border border-orange-500/20">
                      <p className="font-body font-semibold text-orange-300 text-sm mb-2">✅ Poin Kunci FPB</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><strong className="text-white/90">FPB</strong> = Faktor Persekutuan <strong className="text-orange-400">Terbesar</strong></li>
                        <li>Ambil faktor prima yang <strong className="text-orange-400">sama</strong> dengan pangkat <strong className="text-orange-400">terendah</strong></li>
                        <li>Hasilnya selalu <strong className="text-white/90">≤</strong> bilangan terkecil dari yang dicari</li>
                        <li>Digunakan saat membagi sesuatu secara <strong className="text-white/90">merata</strong></li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20 space-y-2">
                    <p className="font-body font-semibold text-yellow-300 text-sm">💡 Tips Belajar Efektif</p>
                    <ul className="text-white/70 text-xs space-y-1.5">
                      <li>🌳 <strong className="text-white/90">Gunakan pohon faktor</strong> untuk bilangan yang besar agar tidak bingung</li>
                      <li>🔁 <strong className="text-white/90">Latih hafalan bilangan prima</strong>: 2, 3, 5, 7, 11, 13, 17, 19, 23 ...</li>
                      <li>✏️ <strong className="text-white/90">Tulis faktorisasi prima</strong> kedua bilangan sebelum memulai perhitungan</li>
                      <li>🔍 <strong className="text-white/90">Baca soal cerita dua kali</strong> — cari kata kunci untuk menentukan pakai KPK atau FPB</li>
                      <li>📐 <strong className="text-white/90">Cek jawabanmu</strong>: KPK harus habis dibagi oleh semua bilangan; FPB harus bisa membagi semua bilangan</li>
                    </ul>
                  </div>
                </div>

                {/* Tips Membedakan */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-cyan-400" />
                    <span className="font-body font-semibold text-cyan-300">Tips Membedakan KPK dan FPB</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-green-300 mb-1">Gunakan KPK jika:</p>
                      <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
                        <li>Mencari waktu bertemu/bersamaan lagi</li>
                        <li>Kata kunci: "kapan ... bersama lagi", "berulang", "bertepatan"</li>
                        <li>Jawabannya biasanya lebih besar dari bilangan awal</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-orange-300 mb-1">Gunakan FPB jika:</p>
                      <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
                        <li>Membagi sesuatu secara merata tanpa sisa</li>
                        <li>Kata kunci: "maksimal", "sebanyak-banyaknya", "rata"</li>
                        <li>Jawabannya biasanya lebih kecil dari bilangan awal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">🔢 RANGKUMAN LENGKAP</p>
            <p className="font-body text-xs text-white/80 mt-0.5">KPK dan FPB — Kelas 7</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            {/* Definisi & Perbedaan */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-500/30 border border-pink-500 flex items-center justify-center text-[10px]">1</span>
                Definisi &amp; Perbedaan KPK dan FPB
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-gradient-to-r from-green-900/70 to-green-800/30 border border-green-500/50 rounded-xl px-4 py-3">
                  <p className="font-body text-xs font-bold text-green-300">KPK — Kelipatan Persekutuan Terkecil</p>
                  <p className="font-body text-xs text-white/65 mt-1">Bilangan terkecil yang habis dibagi oleh semua bilangan yang dicari. Hasil KPK selalu ≥ bilangan terbesar.</p>
                  <p className="font-mono text-xs text-green-200 mt-1">KPK(12, 18) = 36</p>
                </div>
                <div className="bg-gradient-to-r from-orange-900/70 to-orange-800/30 border border-orange-500/50 rounded-xl px-4 py-3">
                  <p className="font-body text-xs font-bold text-orange-300">FPB — Faktor Persekutuan Terbesar</p>
                  <p className="font-body text-xs text-white/65 mt-1">Bilangan terbesar yang dapat membagi habis semua bilangan yang dicari. Hasil FPB selalu ≤ bilangan terkecil.</p>
                  <p className="font-mono text-xs text-orange-200 mt-1">FPB(12, 18) = 6</p>
                </div>
              </div>
            </div>

            {/* Metode Faktorisasi Prima */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center text-[10px]">2</span>
                Metode Faktorisasi Prima — Paling Andal!
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Langkah 1: Buat Pohon Faktor", desc: "Urai setiap bilangan menjadi faktor prima dengan cara membagi berulang kali dengan bilangan prima (2, 3, 5, 7, ...).", color: "from-pink-900/60 to-pink-800/20 border-pink-500/40 text-pink-200" },
                  { label: "Langkah 2: Tulis sebagai Perkalian Prima", desc: "Contoh: 12 = 2² × 3 dan 18 = 2 × 3²", color: "from-rose-900/60 to-rose-800/20 border-rose-500/40 text-rose-200" },
                  { label: "Untuk KPK: Ambil pangkat TERTINGGI", desc: "KPK(12, 18): dari 2² dan 2¹ → ambil 2². Dari 3¹ dan 3² → ambil 3². Jadi KPK = 2² × 3² = 4 × 9 = 36", color: "from-green-900/60 to-green-800/20 border-green-500/40 text-green-200" },
                  { label: "Untuk FPB: Ambil pangkat TERENDAH", desc: "FPB(12, 18): dari 2² dan 2¹ → ambil 2¹. Dari 3¹ dan 3² → ambil 3¹. Jadi FPB = 2¹ × 3¹ = 2 × 3 = 6", color: "from-orange-900/60 to-orange-800/20 border-orange-500/40 text-orange-200" },
                ].map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div>
                      <p className="font-body text-xs font-bold">{label}</p>
                      <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Trik */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">3</span>
                Tips &amp; Trik Jitu KPK &amp; FPB
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🎯", tip: "Kunci identifikasi soal cerita", detail: "Kata 'bersama lagi', 'bertepatan', 'berulang' → pakai KPK. Kata 'maksimal', 'sebanyak-banyaknya', 'merata', 'dibagi rata' → pakai FPB.", color: "bg-pink-900/30 border-pink-500/30" },
                  { icon: "⚡", tip: "Cara cepat FPB dengan algoritma Euclid", detail: "FPB(a, b): bagi a dengan b, ambil sisanya. Ulangi sampai sisa = 0. FPB adalah pembagi terakhir. Contoh: FPB(48, 18): 48 = 2×18 + 12; 18 = 1×12 + 6; 12 = 2×6 + 0 → FPB = 6!", color: "bg-orange-900/30 border-orange-500/30" },
                  { icon: "🔗", tip: "Hubungan KPK dan FPB", detail: "KPK(a, b) × FPB(a, b) = a × b. Berguna untuk mencari salah satu jika yang lain diketahui!", color: "bg-green-900/30 border-green-500/30" },
                  { icon: "📊", tip: "Bilangan prima kecil yang wajib hafal", detail: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. Hafal ini dan pohon faktor akan jauh lebih cepat dibuat!", color: "bg-cyan-900/30 border-cyan-500/30" },
                ].map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-body text-xs font-bold text-white">{tip}</p>
                      <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kesimpulan */}
            <div className="bg-gradient-to-br from-pink-500/20 via-rose-500/15 to-red-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌺</div>
              <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                KPK dan FPB adalah alat matematika yang sangat berguna dalam kehidupan nyata — dari menjadwalkan pertemuan hingga membagi hadiah secara merata. Kuncinya:{" "}
                <strong className="text-green-300">KPK = pangkat tertinggi</strong> dan{" "}
                <strong className="text-orange-300">FPB = pangkat terendah</strong> dari faktorisasi prima. Dan ingat hubungan ajaib:{" "}
                <strong className="text-yellow-300">KPK × FPB = a × b</strong>!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {["Faktorisasi Prima", "KPK = Pangkat Tertinggi", "FPB = Pangkat Terendah", "KPK×FPB = a×b", "Algoritma Euclid"].map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🎓 Selamat! Kamu telah menyelesaikan seluruh materi Bilangan Bulat Kelas 7!</p>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPKFPBPage;
