import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, AlertCircle, Zap, Calculator } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PembagianBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "positifPositif", "negatifPositif", "positifNegatif", "negatifNegatif", "pembagianNol", "contoh", "kesimpulan"]);

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
          PEMBAGIAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar - Pembagian sebagai Kebalikan Perkalian */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kunci Rahasia: Pembagian = Kebalikan Perkalian</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Mau tahu rahasia memahami pembagian dengan mudah? <strong className="text-primary">Pembagian adalah operasi kebalikan dari perkalian!</strong> Ini adalah kunci yang akan membantumu menyelesaikan semua soal pembagian bilangan bulat.
                </p>
                
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Contoh Penerapan:</p>
                  <div className="space-y-3">
                    <p className="font-body text-sm text-white/80">
                      Misalnya, untuk mencari nilai <InlineMath math="p" /> dari <InlineMath math="p \times 7 = 56" />
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2">Kita bisa bertanya: "Bilangan berapa yang jika dikalikan 7 hasilnya 56?"</p>
                      <p className="text-white/70 text-xs mb-2">Atau cukup hitung: <InlineMath math="56 \div 7 = ?" /></p>
                      <p className="text-green-400 text-sm font-semibold">Jawabannya sama: <InlineMath math="p = 8" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Rumus Emas:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="56 \div 7 = 8 \Longleftrightarrow 8 \times 7 = 56" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    Secara umum: <InlineMath math="p \div q = r \Longleftrightarrow r \times q = p" />
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips!</strong> Operasi kebalikan ini disebut juga <strong>invers perkalian</strong>. Dengan memahami konsep ini, kamu bisa mengecek hasil pembagianmu dengan cara mengalikan kembali!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Positif dibagi Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifPositif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Positif : Positif = Positif</span>
              </div>
              {expandedSections.includes("positifPositif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifPositif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pembagian dua bilangan positif menghasilkan bilangan positif. Mari kita buktikan dengan konsep kebalikan perkalian!
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">Pembuktian:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="12 \div 3 = a" /> artinya <InlineMath math="a \times 3 = 12" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali 3 hasilnya 12?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="a = 4" /> karena <InlineMath math="4 \times 3 = 12" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="30 \div 6 = b" /> artinya <InlineMath math="b \times 6 = 30" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali 6 hasilnya 30?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="b = 5" /> karena <InlineMath math="5 \times 6 = 30" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Positif} \div \text{Positif} = \textbf{Positif}" />
                    <BlockMath math="a \div b = \frac{a}{b}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Negatif dibagi Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("negatifPositif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Negatif : Positif = Negatif</span>
              </div>
              {expandedSections.includes("negatifPositif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("negatifPositif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Yuk kita buktikan dengan konsep kebalikan perkalian! Cari bilangan yang jika dikalikan dengan pembagi menghasilkan bilangan yang dibagi.
                </p>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">Pembuktian:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-6 \div 2 = a" /> artinya <InlineMath math="a \times 2 = -6" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali 2 hasilnya -6?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="a = -3" /> karena <InlineMath math="-3 \times 2 = -6" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-20 \div 4 = b" /> artinya <InlineMath math="b \times 4 = -20" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali 4 hasilnya -20?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="b = -5" /> karena <InlineMath math="-5 \times 4 = -20" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Negatif} \div \text{Positif} = \textbf{Negatif}" />
                    <BlockMath math="(-a) \div b = -\frac{a}{b}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Positif dibagi Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Positif : Negatif = Negatif</span>
              </div>
              {expandedSections.includes("positifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dengan cara yang sama, mari kita buktikan pembagian bilangan positif dengan negatif:
                </p>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">Pembuktian:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="15 \div (-3) = a" /> artinya <InlineMath math="a \times (-3) = 15" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali -3 hasilnya 15?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="a = -5" /> karena <InlineMath math="-5 \times (-3) = 15" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="30 \div (-5) = b" /> artinya <InlineMath math="b \times (-5) = 30" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali -5 hasilnya 30?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="b = -6" /> karena <InlineMath math="-6 \times (-5) = 30" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Positif} \div \text{Negatif} = \textbf{Negatif}" />
                    <BlockMath math="a \div (-b) = -\frac{a}{b}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Negatif dibagi Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("negatifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Negatif : Negatif = Positif</span>
              </div>
              {expandedSections.includes("negatifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("negatifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Nah, sama seperti perkalian, dua bilangan negatif dibagi menghasilkan bilangan positif! Mari kita buktikan:
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">Pembuktian:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-12 \div (-3) = a" /> artinya <InlineMath math="a \times (-3) = -12" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali -3 hasilnya -12?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="a = 4" /> karena <InlineMath math="4 \times (-3) = -12" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-40 \div (-5) = b" /> artinya <InlineMath math="b \times (-5) = -40" /></p>
                      <p className="text-white/70 text-xs mb-1">Bilangan berapa yang jika dikali -5 hasilnya -40?</p>
                      <p className="text-green-400 text-sm">Jawab: <InlineMath math="b = 8" /> karena <InlineMath math="8 \times (-5) = -40" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Negatif} \div \text{Negatif} = \textbf{Positif}" />
                    <BlockMath math="(-a) \div (-b) = \frac{a}{b}" />
                  </div>
                </div>

                {/* Ringkasan Aturan Tanda */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Ringkasan Aturan Tanda Pembagian:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-2 px-3 text-left text-white/70">Bilangan 1</th>
                          <th className="py-2 px-3 text-center text-white/70">:</th>
                          <th className="py-2 px-3 text-left text-white/70">Bilangan 2</th>
                          <th className="py-2 px-3 text-center text-white/70">=</th>
                          <th className="py-2 px-3 text-left text-white/70">Hasil</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">:</td>
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">Positif (+)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">:</td>
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">Negatif (-)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">:</td>
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">Negatif (-)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">:</td>
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">Positif (+)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Cara Mudah Mengingat:</strong> Aturan tanda pembagian SAMA PERSIS dengan aturan tanda perkalian! Jika tandanya sama = positif, jika tandanya beda = negatif.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Pembagian dengan Nol */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("pembagianNol")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-body font-semibold text-white">Pembagian dengan Nol (AWAS!)</span>
              </div>
              {expandedSections.includes("pembagianNol") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("pembagianNol") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ada satu hal yang WAJIB kamu ingat dalam pembagian: <strong className="text-red-400">TIDAK BOLEH membagi dengan nol!</strong>
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-3">Mengapa tidak boleh?</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2">Misalkan <InlineMath math="8 \div 0 = p" />, maka <InlineMath math="p \times 0 = 8" /></p>
                      <p className="text-white/70 text-xs mb-1">Adakah bilangan yang jika dikali 0 hasilnya 8?</p>
                      <p className="text-red-400 text-sm font-semibold">TIDAK ADA! Karena bilangan apapun dikali 0 selalu = 0</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2">Misalkan <InlineMath math="-9 \div 0 = q" />, maka <InlineMath math="q \times 0 = -9" /></p>
                      <p className="text-white/70 text-xs mb-1">Adakah bilangan yang jika dikali 0 hasilnya -9?</p>
                      <p className="text-red-400 text-sm font-semibold">TIDAK ADA!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="a \div 0 = \text{TIDAK TERDEFINISI}" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    Untuk sembarang bilangan bulat <InlineMath math="a" />, pembagian dengan 0 tidak memiliki hasil.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Calculator className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-body text-sm font-semibold text-yellow-300 mb-2">Coba di Kalkulator!</p>
                      <p className="font-body text-sm text-yellow-200/80">
                        Jika kamu mencoba menghitung <InlineMath math="-9 \div 0" /> di kalkulator, akan muncul <code className="bg-slate-800 px-2 py-0.5 rounded text-red-400">MATH ERROR</code> atau <code className="bg-slate-800 px-2 py-0.5 rounded text-red-400">Error</code>. Ini membuktikan bahwa pembagian dengan nol memang tidak bisa dilakukan!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-blue-200 leading-relaxed">
                    <strong>Tapi ingat!</strong> <InlineMath math="0 \div a = 0" /> (nol dibagi bilangan apapun selain nol hasilnya nol). Yang tidak boleh adalah <InlineMath math="a \div 0" /> (bilangan dibagi nol).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Contoh Soal & Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Contoh Mudah */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body text-sm font-semibold text-green-300">Contoh 1: Pembagian Dasar</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm mb-2">Hitunglah hasil pembagian berikut:</p>
                    <p className="text-white/90 text-sm">a. <InlineMath math="-15 \div 3" /></p>
                    <p className="text-white/90 text-sm">b. <InlineMath math="-72 \div 2" /></p>
                    <p className="text-white/90 text-sm">c. <InlineMath math="18 \div (-3)" /></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-green-300">Pembahasan:</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-sm">a.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="-15 \div 3 = -5" /></p>
                          <p className="text-white/60 text-xs">(Negatif : Positif = Negatif)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-sm">b.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="-72 \div 2 = -36" /></p>
                          <p className="text-white/60 text-xs">(Negatif : Positif = Negatif)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-sm">c.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="18 \div (-3) = -6" /></p>
                          <p className="text-white/60 text-xs">(Positif : Negatif = Negatif)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh Sedang */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body text-sm font-semibold text-yellow-300">Contoh 2: Pembagian Bertingkat</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm mb-2">Hitunglah hasil pembagian berikut:</p>
                    <p className="text-white/90 text-sm">a. <InlineMath math="(-60 \div 5) \div 3" /></p>
                    <p className="text-white/90 text-sm">b. <InlineMath math="-96 \div (-12)" /></p>
                    <p className="text-white/90 text-sm">c. <InlineMath math="42 \div [8 + (-15)]" /></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-300">Pembahasan:</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">a.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="(-60 \div 5) \div 3" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= -12 \div 3" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= -4" /></p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">b.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="-96 \div (-12) = 8" /></p>
                          <p className="text-white/60 text-xs">(Negatif : Negatif = Positif)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">c.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="42 \div [8 + (-15)]" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= 42 \div (-7)" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= -6" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh Sulit */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body text-sm font-semibold text-red-300">Contoh 3: Soal Cerita</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm leading-relaxed">
                      Sebuah kapal selam menyelam dari permukaan laut hingga kedalaman 120 meter di bawah permukaan laut dalam waktu 8 menit dengan kecepatan konstan. Berapa meter perubahan kedalaman kapal selam setiap menitnya?
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-red-300">Pembahasan:</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-2">
                      <p className="text-white/60 text-xs">Diketahui:</p>
                      <ul className="text-white/80 text-sm ml-4 list-disc space-y-1">
                        <li>Kedalaman akhir = 120 m di bawah permukaan = <InlineMath math="-120" /> m</li>
                        <li>Waktu = 8 menit</li>
                      </ul>
                      <p className="text-white/60 text-xs mt-2">Ditanya: Perubahan kedalaman per menit?</p>
                      <p className="text-white/60 text-xs mt-2">Jawab:</p>
                      <div className="mt-2">
                        <BlockMath math="\text{Perubahan per menit} = (-120) \div 8 = -15 \text{ meter}" />
                      </div>
                      <p className="text-green-400 text-sm mt-2">
                        Jadi, kapal selam turun (berubah) <strong>15 meter ke bawah</strong> setiap menitnya.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contoh Bonus */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body text-sm font-semibold text-purple-300">Contoh 4: Operasi Gabungan</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm mb-2">Hitunglah:</p>
                    <p className="text-white/90 text-sm"><InlineMath math="-75 \div [45 \div (-9)]" /></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-purple-300">Pembahasan:</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-2">
                      <p className="text-white/60 text-xs">Langkah 1: Kerjakan yang di dalam kurung dulu</p>
                      <p className="text-white/80 text-sm"><InlineMath math="45 \div (-9) = -5" /></p>
                      <p className="text-white/60 text-xs mt-2">Langkah 2: Substitusikan hasil</p>
                      <p className="text-white/80 text-sm"><InlineMath math="-75 \div (-5) = 15" /></p>
                      <p className="text-green-400 text-sm mt-2">
                        Jadi, <InlineMath math="-75 \div [45 \div (-9)] = 15" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesimpulan & Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-body font-semibold text-white">Kesimpulan & Tips Pembagian Bilangan Bulat</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">

                {/* Kesimpulan Aturan Tanda */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Kesimpulan Aturan Tanda Pembagian:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-green-400 font-mono text-sm font-bold w-36">(+) ÷ (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">Positif (+)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(+) ÷ (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">Negatif (−)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(−) ÷ (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">Negatif (−)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-yellow-400 font-mono text-sm font-bold w-36">(−) ÷ (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">Positif (+)</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 mt-3">
                    <p className="text-white/70 text-xs text-center">
                      Cara mudah mengingat: <strong className="text-cyan-300">Tanda sama → positif &nbsp;|&nbsp; Tanda beda → negatif</strong>
                    </p>
                  </div>
                </div>

                {/* Aturan Penting */}
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">Aturan Penting yang Wajib Diingat:</p>
                  <div className="space-y-2">
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-red-300">Tidak bisa dibagi nol:</strong> <InlineMath math="a \div 0" /> tidak terdefinisi untuk semua bilangan <InlineMath math="a" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Nol dibagi bilangan apapun:</strong> <InlineMath math="0 \div a = 0" /> selama <InlineMath math="a \neq 0" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-cyan-300">Hubungan dengan perkalian:</strong> <InlineMath math="a \div b = c" /> berarti <InlineMath math="b \times c = a" />. Gunakan ini untuk mengecek jawaban!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-3">Tips Cepat Mengerjakan Soal:</p>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Tentukan tanda dulu, hitung nilai mutlaknya kemudian.</strong> Misalnya <InlineMath math="(-48) \div 6" />: tanda (−)÷(+) = negatif, nilai mutlak <InlineMath math="48 \div 6 = 8" />, jadi hasilnya <InlineMath math="-8" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Kerjakan kurung terdalam dahulu</strong> pada operasi bertingkat, baru lanjut ke luar.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Verifikasi jawaban dengan perkalian balik.</strong> Jika <InlineMath math="-36 \div (-4) = 9" />, cek: <InlineMath math="(-4) \times 9 = -36" /> ✓
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Ingat: pembagian TIDAK komutatif.</strong> <InlineMath math="12 \div (-3) \neq (-3) \div 12" />, jadi urutan pembagian tidak boleh ditukar!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/materi-matematika/kelas-7/bilangan-bulat");
            }}
            className="px-6 py-3 bg-primary/20 border border-primary/40 rounded-lg text-primary font-body text-sm hover:bg-primary/30 transition-colors"
          >
            Kembali ke Daftar Materi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembagianBilanganBulatPage;
