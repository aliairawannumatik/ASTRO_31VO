import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianPLSVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "plsv", "akar", "kesamaan", "ekuivalen", "contoh1", "contoh2", "contoh3"]);

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
          PENGERTIAN PLSV, KESAMAAN & PERSAMAAN EKUIVALEN
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
                <span className="font-body font-semibold text-white">Membongkar Rahasia di Balik Tanda "="</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu berpikir: <em>"Berapakah nilai <InlineMath math="x" /> sehingga <InlineMath math="2x + 3 = 11" />?"</em> Inilah inti dari <strong className="text-primary">Persamaan Linear Satu Variabel (PLSV)</strong>. Kita akan belajar mengenali, memahami, dan membedakan beberapa konsep penting seputar PLSV.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Bayangkan persamaan seperti timbangan yang seimbang — sisi kiri dan sisi kanan harus selalu bernilai sama. Tugas kita adalah menemukan nilai yang menjaga keseimbangan itu!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pengertian PLSV */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("plsv")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Persamaan Linear Satu Variabel (PLSV)</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Definisi PLSV:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>Persamaan Linear Satu Variabel (PLSV)</strong> adalah kalimat terbuka yang:
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white/80 list-none">
                    <li>• Mengandung <strong className="text-blue-300">tepat satu variabel</strong> (satu jenis peubah)</li>
                    <li>• Pangkat tertinggi variabelnya adalah <strong className="text-blue-300">1 (linear)</strong></li>
                    <li>• Dihubungkan dengan tanda <strong className="text-blue-300">sama dengan (=)</strong></li>
                  </ul>
                </div>

                <p className="font-body text-sm text-white/80">Bentuk umum PLSV:</p>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <BlockMath math="ax + b = c" />
                  <p className="font-body text-xs text-white/60 mt-2">dengan <InlineMath math="a \neq 0" />, dan <InlineMath math="a, b, c" /> adalah konstanta bilangan real</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">Contoh PLSV vs Bukan PLSV:</p>
                  <div className="space-y-2 font-body text-sm">
                    <p className="text-green-300">✓ <InlineMath math="2x + 5 = 11" /> → PLSV (variabel <InlineMath math="x" />, pangkat 1)</p>
                    <p className="text-green-300">✓ <InlineMath math="3y - 7 = 2" /> → PLSV (variabel <InlineMath math="y" />, pangkat 1)</p>
                    <p className="text-red-400">✗ <InlineMath math="x^2 + 3 = 7" /> → Bukan PLSV (pangkat variabel = 2)</p>
                    <p className="text-red-400">✗ <InlineMath math="2x + 3y = 10" /> → Bukan PLSV (dua variabel)</p>
                    <p className="text-red-400">✗ <InlineMath math="5 + 3 = 8" /> → Bukan PLSV (tidak ada variabel)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Akar / Penyelesaian */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("akar")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Akar atau Penyelesaian PLSV</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Akar persamaan</strong> (atau <strong className="text-green-300">penyelesaian</strong>) adalah nilai variabel yang membuat persamaan menjadi <strong>kalimat yang benar</strong>.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Untuk <InlineMath math="2x + 1 = 7" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>• Coba <InlineMath math="x = 3" />: <InlineMath math="2(3)+1 = 7" /> ✓ → <strong className="text-green-400">x = 3 adalah akar/penyelesaiannya</strong></p>
                    <p>• Coba <InlineMath math="x = 2" />: <InlineMath math="2(2)+1 = 5 \neq 7" /> ✗ → bukan penyelesaian</p>
                  </div>
                  <p className="font-body text-sm text-white/80">
                    Himpunan Penyelesaian: <InlineMath math="HP = \{3\}" />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Kesamaan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kesamaan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Kesamaan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">Kesamaan</strong> adalah kalimat matematika yang dihubungkan dengan tanda "=" yang <strong>selalu benar</strong> untuk semua nilai variabel, atau merupakan pernyataan yang sudah pasti benar tanpa perlu menyelesaikannya.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white">Sifat-sifat kesamaan (yang berlaku pada PLSV):</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>• <strong className="text-orange-300">Refleksif:</strong> <InlineMath math="a = a" /> (setiap bilangan sama dengan dirinya sendiri)</p>
                    <p>• <strong className="text-orange-300">Simetri:</strong> Jika <InlineMath math="a = b" />, maka <InlineMath math="b = a" /></p>
                    <p>• <strong className="text-orange-300">Transitif:</strong> Jika <InlineMath math="a = b" /> dan <InlineMath math="b = c" />, maka <InlineMath math="a = c" /></p>
                    <p>• <strong className="text-orange-300">Substitusi:</strong> Jika <InlineMath math="a = b" />, maka <InlineMath math="a" /> bisa diganti <InlineMath math="b" /> dalam persamaan apapun.</p>
                  </div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-orange-200">
                    <strong>Operasi pada kesamaan:</strong> Jika kedua ruas ditambah, dikurang, dikali, atau dibagi dengan bilangan yang sama (kecuali dibagi nol), maka kesamaan tetap berlaku.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Persamaan Ekuivalen */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ekuivalen")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Persamaan yang Ekuivalen</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dua persamaan dikatakan <strong className="text-purple-300">ekuivalen</strong> (setara) jika keduanya memiliki <strong>himpunan penyelesaian yang sama persis</strong>. Ditulis dengan simbol <InlineMath math="\Leftrightarrow" />.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh persamaan-persamaan yang ekuivalen:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p><InlineMath math="x + 3 = 7" /> → HP = <InlineMath math="\{4\}" /></p>
                    <p><InlineMath math="2x + 6 = 14" /> → HP = <InlineMath math="\{4\}" /></p>
                    <p><InlineMath math="x - 1 = 3" /> → HP = <InlineMath math="\{4\}" /></p>
                    <p className="text-purple-300">Ketiga persamaan di atas <strong>ekuivalen</strong> karena memiliki HP yang sama!</p>
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-purple-200 leading-relaxed">
                    <strong>Cara menghasilkan persamaan ekuivalen:</strong> Tambahkan/kurangi/kalikan/bagikan kedua ruas dengan bilangan yang sama (bukan nol). Ini adalah dasar dari semua metode penyelesaian PLSV!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 1 - Mudah */}
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
                    Dari persamaan-persamaan berikut, tentukan mana yang merupakan PLSV dan mana yang bukan!
                  </p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="4x - 8 = 0" /></p>
                    <p>b. <InlineMath math="x^2 - 9 = 0" /></p>
                    <p>c. <InlineMath math="3(y + 2) = 15" /></p>
                    <p>d. <InlineMath math="2a + 3b = 12" /></p>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="4x - 8 = 0" /> → satu variabel <InlineMath math="x" />, pangkat 1 → <strong className="text-green-300">PLSV ✓</strong></p>
                    <p>b. <InlineMath math="x^2 - 9 = 0" /> → pangkat variabel = 2 → <strong className="text-red-400">Bukan PLSV ✗</strong></p>
                    <p>c. <InlineMath math="3(y + 2) = 15" /> → satu variabel <InlineMath math="y" />, pangkat 1 (setelah didistribusikan jadi <InlineMath math="3y+6=15" />) → <strong className="text-green-300">PLSV ✓</strong></p>
                    <p>d. <InlineMath math="2a + 3b = 12" /> → dua variabel berbeda → <strong className="text-red-400">Bukan PLSV ✗</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 2 - Sedang */}
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
                    Tentukan apakah dua persamaan berikut merupakan pasangan persamaan yang ekuivalen, dan jelaskan alasannya!
                  </p>
                  <div className="mt-2 font-body text-sm text-white/80 space-y-1">
                    <p>Persamaan I: <InlineMath math="5x - 10 = 0" /></p>
                    <p>Persamaan II: <InlineMath math="x = 2" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1:</strong> Cari HP Persamaan I:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="5x - 10 = 0" /></p>
                      <p><InlineMath math="5x = 10" /></p>
                      <p><InlineMath math="x = 2" /> → HP I = <InlineMath math="\{2\}" /></p>
                    </div>
                    <p><strong>Langkah 2:</strong> HP Persamaan II:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="x = 2" /> → HP II = <InlineMath math="\{2\}" /></p>
                    </div>
                    <p><strong>Kesimpulan:</strong> HP I = HP II = <InlineMath math="\{2\}" />, maka kedua persamaan <strong className="text-purple-300">ekuivalen</strong>. <InlineMath math="5x - 10 = 0 \Leftrightarrow x = 2" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 3 - Sulit */}
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
                    Diketahui persamaan <InlineMath math="3(2x - 4) + 6 = 2(x + 5)" />. Tunjukkan bahwa persamaan ini ekuivalen dengan <InlineMath math="x = 4" /> dengan menggunakan sifat-sifat kesamaan!
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <p><strong>Langkah 1:</strong> Distribusikan (urai kurung):</p>
                      <BlockMath math="6x - 12 + 6 = 2x + 10" />
                      <BlockMath math="6x - 6 = 2x + 10" />
                      <p><strong>Langkah 2:</strong> Kurangi kedua ruas dengan <InlineMath math="2x" /> (sifat kesamaan):</p>
                      <BlockMath math="4x - 6 = 10" />
                      <p><strong>Langkah 3:</strong> Tambahkan <InlineMath math="6" /> ke kedua ruas:</p>
                      <BlockMath math="4x = 16" />
                      <p><strong>Langkah 4:</strong> Bagikan kedua ruas dengan <InlineMath math="4" />:</p>
                      <BlockMath math="x = 4" />
                    </div>
                    <p><strong>Verifikasi:</strong> Substitusi <InlineMath math="x = 4" /> ke persamaan asal:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>Ruas kiri: <InlineMath math="3(2(4)-4)+6 = 3(8-4)+6 = 3(4)+6 = 12+6 = 18" /></p>
                      <p>Ruas kanan: <InlineMath math="2(4+5) = 2(9) = 18" /></p>
                      <p className="text-green-400">18 = 18 ✓ → Terbukti ekuivalen!</p>
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

export default PengertianPLSVPage;
