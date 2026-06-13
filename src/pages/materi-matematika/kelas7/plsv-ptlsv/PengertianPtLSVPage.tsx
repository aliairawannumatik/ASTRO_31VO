import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianPtLSVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "ketidaksamaan", "ptlsv", "simbol", "contoh1", "contoh2", "contoh3"]);

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
          PENGERTIAN KETIDAKSAMAAN & PtLSV
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · PLSV & PtLSV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Lebih dari Sekadar Sama Dengan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Selama ini kita berkenalan dengan persamaan yang menggunakan tanda "=". Sekarang kita bertemu konsep baru yang lebih luas: <strong className="text-primary">pertidaksamaan</strong>. Dalam kehidupan nyata, kita sering menjumpai situasi seperti "harga tidak boleh lebih dari Rp50.000" atau "nilai ujian minimal 75" — itulah contoh pertidaksamaan!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Pertidaksamaan bukan hanya tentang "sama dengan", melainkan tentang rentang nilai — lebih besar, lebih kecil, atau tidak sama dengan!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ketidaksamaan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ketidaksamaan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Pengertian Ketidaksamaan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Definisi:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>Ketidaksamaan</strong> adalah kalimat matematika yang menyatakan bahwa dua ekspresi <strong className="text-blue-300">tidak sama</strong>, dihubungkan dengan tanda <strong className="text-blue-300">pertidaksamaan</strong> (bukan tanda "=").
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">Tanda-tanda Pertidaksamaan:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-4 text-primary">Tanda</th>
                          <th className="text-left py-2 pr-4 text-primary">Dibaca</th>
                          <th className="text-left py-2 text-primary">Contoh</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math=">" /></td>
                          <td className="py-2 pr-4">Lebih dari</td>
                          <td className="py-2"><InlineMath math="8 > 5" /></td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math="<" /></td>
                          <td className="py-2 pr-4">Kurang dari</td>
                          <td className="py-2"><InlineMath math="3 < 10" /></td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math="\geq" /></td>
                          <td className="py-2 pr-4">Lebih dari atau sama dengan</td>
                          <td className="py-2"><InlineMath math="x \geq 7" /></td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math="\leq" /></td>
                          <td className="py-2 pr-4">Kurang dari atau sama dengan</td>
                          <td className="py-2"><InlineMath math="x \leq 4" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-xl"><InlineMath math="\neq" /></td>
                          <td className="py-2 pr-4">Tidak sama dengan</td>
                          <td className="py-2"><InlineMath math="x \neq 0" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">Contoh ketidaksamaan:</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p>• <InlineMath math="10 > 7" /> → Benar ✓ (10 memang lebih dari 7)</p>
                    <p>• <InlineMath math="3 > 8" /> → Salah ✗ (3 tidak lebih dari 8)</p>
                    <p>• <InlineMath math="-5 < -2" /> → Benar ✓ (-5 memang kurang dari -2)</p>
                    <p>• <InlineMath math="6 \geq 6" /> → Benar ✓ (6 sama dengan 6)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PtLSV */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ptlsv")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Pertidaksamaan Linear Satu Variabel (PtLSV)</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">Definisi PtLSV:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>Pertidaksamaan Linear Satu Variabel (PtLSV)</strong> adalah kalimat terbuka yang:
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <li>• Mengandung <strong className="text-purple-300">tepat satu variabel</strong></li>
                    <li>• Pangkat tertinggi variabelnya adalah <strong className="text-purple-300">1 (linear)</strong></li>
                    <li>• Dihubungkan dengan tanda <strong className="text-purple-300">pertidaksamaan</strong> (<InlineMath math=">, <, \geq, \leq" />)</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">Bentuk umum PtLSV:</p>
                  <div className="space-y-1 text-center font-body text-sm text-white/80">
                    <p><InlineMath math="ax + b > c" />, atau <InlineMath math="ax + b < c" />, atau</p>
                    <p><InlineMath math="ax + b \geq c" />, atau <InlineMath math="ax + b \leq c" /></p>
                    <p className="text-xs text-white/50 mt-1">dengan <InlineMath math="a \neq 0" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">Contoh PtLSV vs Bukan PtLSV:</p>
                  <div className="space-y-2 font-body text-sm">
                    <p className="text-green-300">✓ <InlineMath math="2x + 3 > 7" /> → PtLSV</p>
                    <p className="text-green-300">✓ <InlineMath math="5 - x \leq 10" /> → PtLSV</p>
                    <p className="text-red-400">✗ <InlineMath math="x^2 > 4" /> → Bukan PtLSV (pangkat 2)</p>
                    <p className="text-red-400">✗ <InlineMath math="2x + y > 5" /> → Bukan PtLSV (dua variabel)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Perbedaan PLSV dan PtLSV */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("simbol")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Ringkasan: Perbedaan PLSV dan PtLSV</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body text-white/80">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 pr-4 text-primary">Aspek</th>
                        <th className="text-left py-2 pr-4 text-blue-300">PLSV</th>
                        <th className="text-left py-2 text-purple-300">PtLSV</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-2 pr-4">Tanda hubung</td>
                        <td className="py-2 pr-4 text-blue-300"><InlineMath math="=" /></td>
                        <td className="py-2 text-purple-300"><InlineMath math=">, <, \geq, \leq" /></td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-2 pr-4">Jumlah penyelesaian</td>
                        <td className="py-2 pr-4 text-blue-300">1 nilai</td>
                        <td className="py-2 text-purple-300">Banyak nilai (rentang)</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-2 pr-4">Contoh</td>
                        <td className="py-2 pr-4 text-blue-300"><InlineMath math="2x = 8" /></td>
                        <td className="py-2 text-purple-300"><InlineMath math="2x < 8" /></td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Penyelesaian</td>
                        <td className="py-2 pr-4 text-blue-300"><InlineMath math="x = 4" /></td>
                        <td className="py-2 text-purple-300"><InlineMath math="x < 4" /> (tak terhingga)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Penyelesaian PtLSV adalah <strong>himpunan bilangan</strong> (bukan satu nilai), yang biasanya digambarkan pada <strong>garis bilangan</strong>!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mr-2">MUDAH</span>
                  Contoh Soal 1
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Tentukan mana yang merupakan PtLSV dari kalimat-kalimat berikut:
                  </p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="3x - 5 < 10" /></p>
                    <p>b. <InlineMath math="2x + y \geq 8" /></p>
                    <p>c. <InlineMath math="x^2 - 1 > 0" /></p>
                    <p>d. <InlineMath math="4x \leq 20" /></p>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="3x - 5 < 10" /> → 1 variabel, pangkat 1, tanda &lt; → <strong className="text-green-300">PtLSV ✓</strong></p>
                    <p>b. <InlineMath math="2x + y \geq 8" /> → 2 variabel → <strong className="text-red-400">Bukan PtLSV ✗</strong></p>
                    <p>c. <InlineMath math="x^2 - 1 > 0" /> → pangkat variabel = 2 → <strong className="text-red-400">Bukan PtLSV ✗</strong></p>
                    <p>d. <InlineMath math="4x \leq 20" /> → 1 variabel, pangkat 1, tanda ≤ → <strong className="text-green-300">PtLSV ✓</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded mr-2">SEDANG</span>
                  Contoh Soal 2
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Dari PtLSV <InlineMath math="x + 3 > 5" />, tentukan apakah nilai-nilai berikut merupakan penyelesaiannya (dengan domain bilangan bulat):
                  </p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="x = 1" /> &nbsp;&nbsp; b. <InlineMath math="x = 3" /> &nbsp;&nbsp; c. <InlineMath math="x = 5" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Substitusi setiap nilai ke <InlineMath math="x + 3 > 5" />:</p>
                    <p>a. <InlineMath math="x=1" />: <InlineMath math="1 + 3 = 4 > 5" />? → <strong className="text-red-400">Tidak ✗</strong> (4 tidak lebih dari 5)</p>
                    <p>b. <InlineMath math="x=3" />: <InlineMath math="3 + 3 = 6 > 5" />? → <strong className="text-green-400">Ya ✓</strong> (6 lebih dari 5)</p>
                    <p>c. <InlineMath math="x=5" />: <InlineMath math="5 + 3 = 8 > 5" />? → <strong className="text-green-400">Ya ✓</strong> (8 lebih dari 5)</p>
                    <p className="mt-2">Penyelesaian dari <InlineMath math="\{1, 3, 5\}" /> adalah <InlineMath math="\{3, 5\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded mr-2">SULIT</span>
                  Contoh Soal 3
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Ubah kalimat berikut ke dalam bentuk PtLSV, kemudian tentukan apakah pernyataan tersebut benar atau salah:
                  </p>
                  <div className="mt-2 space-y-2 font-body text-sm text-white/80">
                    <p>a. "Dua kali suatu bilangan dikurangi 3 tidak lebih dari 11"</p>
                    <p>b. Apakah <InlineMath math="x = 7" /> merupakan penyelesaian dari PtLSV tersebut?</p>
                    <p>c. Apakah <InlineMath math="x = 6" /> merupakan penyelesaian?</p>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>a.</strong> "Dua kali suatu bilangan dikurangi 3" → <InlineMath math="2x - 3" /></p>
                    <p>"Tidak lebih dari 11" → <InlineMath math="\leq 11" /></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>Model PtLSV: <BlockMath math="2x - 3 \leq 11" /></p>
                    </div>
                    <p><strong>b.</strong> Uji <InlineMath math="x = 7" />:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="2(7) - 3 = 14 - 3 = 11 \leq 11" /> → <strong className="text-green-400">Benar ✓</strong></p>
                      <p><InlineMath math="x = 7" /> adalah penyelesaian (karena 11 ≤ 11 berlaku).</p>
                    </div>
                    <p><strong>c.</strong> Uji <InlineMath math="x = 6" />:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="2(6) - 3 = 12 - 3 = 9 \leq 11" /> → <strong className="text-green-400">Benar ✓</strong></p>
                      <p><InlineMath math="x = 6" /> juga penyelesaian.</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="font-body text-sm text-purple-200">Itulah mengapa PtLSV punya <strong>banyak penyelesaian</strong>! Semua nilai <InlineMath math="x \leq 7" /> adalah penyelesaian dari <InlineMath math="2x-3 \leq 11" />.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPtLSVPage;
