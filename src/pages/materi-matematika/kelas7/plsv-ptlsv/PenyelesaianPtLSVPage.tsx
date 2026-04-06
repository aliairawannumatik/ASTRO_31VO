import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PenyelesaianPtLSVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "tamkur", "kalibagi_pos", "kalibagi_neg", "pindahruas", "pecahan", "contoh1", "contoh2", "contoh3"]);

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
          PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL
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
                <span className="font-body font-semibold text-white">Serupa tapi Tidak Sama dengan PLSV</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Cara menyelesaikan PtLSV hampir sama dengan PLSV — kita boleh menambah, mengurang, mengali, atau membagi kedua ruas. Namun ada <strong className="text-primary">satu aturan kritis yang berbeda</strong>: saat mengali atau membagi dengan bilangan <strong className="text-red-400">negatif</strong>, tanda pertidaksamaan harus <strong className="text-red-400">dibalik!</strong>
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-red-300 font-semibold">⚠️ Aturan Kritis:</p>
                  <p className="font-body text-sm text-white/80 mt-1">
                    Jika kedua ruas dikali atau dibagi dengan bilangan <strong className="text-red-400">negatif</strong>, maka tanda pertidaksamaan <strong className="text-red-400">DIBALIK</strong>!
                  </p>
                  <p className="font-body text-sm text-white/60 mt-1">
                    (<InlineMath math=">" /> menjadi <InlineMath math="<" />, atau <InlineMath math="\leq" /> menjadi <InlineMath math="\geq" />, dst.)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tambah Kurang */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tamkur")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">1. Menambah / Mengurang Kedua Ruas</span>
              </div>
              {expandedSections.includes("tamkur") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("tamkur") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    Menambahkan atau mengurangi kedua ruas dengan bilangan yang sama <strong className="text-green-300">tidak mengubah tanda pertidaksamaan</strong>.
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 font-body text-sm text-white/80">
                    <p>Jika <InlineMath math="a > b" />, maka <InlineMath math="a + c > b + c" /></p>
                    <p>Jika <InlineMath math="a > b" />, maka <InlineMath math="a - c > b - c" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="x - 4 > 3" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>Tambahkan 4 ke kedua ruas:</p>
                    <BlockMath math="x - 4 + 4 > 3 + 4" />
                    <BlockMath math="x > 7" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x > 7, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kali Bagi Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kalibagi_pos")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">2. Mengali / Membagi dengan Bilangan Positif</span>
              </div>
              {expandedSections.includes("kalibagi_pos") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kalibagi_pos") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    Mengali atau membagi kedua ruas dengan bilangan <strong className="text-blue-300">positif</strong> <strong>tidak mengubah</strong> tanda pertidaksamaan.
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 font-body text-sm text-white/80">
                    <p>Jika <InlineMath math="a > b" /> dan <InlineMath math="c > 0" />, maka <InlineMath math="ac > bc" /></p>
                    <p>Jika <InlineMath math="a > b" /> dan <InlineMath math="c > 0" />, maka <InlineMath math="\frac{a}{c} > \frac{b}{c}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="3x \leq 15" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>Bagi kedua ruas dengan 3 (positif, tanda tidak berubah):</p>
                    <BlockMath math="\frac{3x}{3} \leq \frac{15}{3}" />
                    <BlockMath math="x \leq 5" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x \leq 5, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kali Bagi Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kalibagi_neg")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">3. Mengali / Membagi dengan Bilangan Negatif ⚠️</span>
              </div>
              {expandedSections.includes("kalibagi_neg") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kalibagi_neg") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">⚠️ ATURAN PENTING — TANDA DIBALIK!</p>
                  <p className="font-body text-sm text-white/80">
                    Mengali atau membagi kedua ruas dengan bilangan <strong className="text-red-400">negatif</strong> akan <strong className="text-red-400">membalik tanda pertidaksamaan</strong>.
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 font-body text-sm text-white/80">
                    <p>Jika <InlineMath math="a > b" /> dan <InlineMath math="c < 0" />, maka <InlineMath math="ac < bc" /></p>
                    <p>Jika <InlineMath math="a \leq b" /> dan <InlineMath math="c < 0" />, maka <InlineMath math="\frac{a}{c} \geq \frac{b}{c}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Mengapa tanda dibalik? Lihat contoh ini:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Kita tahu: <InlineMath math="3 < 7" /> (benar)</p>
                    <p>Kalikan keduanya dengan <InlineMath math="-1" />:</p>
                    <p><InlineMath math="-3 \text{ dan } -7" /> → manakah yang lebih besar?</p>
                    <p><InlineMath math="-3 > -7" /> (tanda jadi terbalik!)</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="-2x > 10" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Bagi kedua ruas dengan <InlineMath math="-2" /> (negatif → tanda DIBALIK):</p>
                    <BlockMath math="\frac{-2x}{-2} < \frac{10}{-2}" />
                    <BlockMath math="x < -5" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x < -5, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pindah Ruas */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pindahruas")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">4. Metode Pindah Ruas</span>
              </div>
              {expandedSections.includes("pindahruas") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("pindahruas") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    Sama seperti PLSV, suku yang berpindah ruas berganti tanda. <strong className="text-orange-300">Namun, perhatikan apakah koefisien variabel bertanda negatif atau tidak!</strong> Jika negatif, tanda pertidaksamaan dibalik saat membagi.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="5 - 3x \geq 14" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Pindahkan 5 ke kanan:</p>
                    <BlockMath math="-3x \geq 14 - 5" />
                    <BlockMath math="-3x \geq 9" />
                    <p>Bagi kedua ruas dengan <InlineMath math="-3" /> (negatif → tanda DIBALIK):</p>
                    <BlockMath math="x \leq \frac{9}{-3}" />
                    <BlockMath math="x \leq -3" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x \leq -3, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pecahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-pink-400" />
                <span className="font-body font-semibold text-white">5. Pertidaksamaan Bentuk Pecahan</span>
              </div>
              {expandedSections.includes("pecahan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("pecahan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    Sama seperti PLSV pecahan: kalikan kedua ruas dengan <strong className="text-pink-300">KPK semua penyebut</strong>. Perhatikan tanda penyebutnya — jika KPK positif, tanda tidak berubah.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="\frac{x}{4} - 1 < \frac{x}{6} + 2" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>KPK dari 4 dan 6 adalah 12. Kalikan semua suku dengan 12:</p>
                    <BlockMath math="12 \cdot \frac{x}{4} - 12 \cdot 1 < 12 \cdot \frac{x}{6} + 12 \cdot 2" />
                    <BlockMath math="3x - 12 < 2x + 24" />
                    <p>Pindah ruas:</p>
                    <BlockMath math="3x - 2x < 24 + 12" />
                    <BlockMath math="x < 36" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x < 36, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 1 - Mudah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mr-2">MUDAH</span>
                  Contoh Soal 1
                </span>
              </div>
              {expandedSections.includes("contoh1") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">Selesaikan PtLSV: <InlineMath math="2x + 5 < 13" /></p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Pindahkan 5 ke kanan:</p>
                    <BlockMath math="2x < 13 - 5" />
                    <BlockMath math="2x < 8" />
                    <p>Bagi dengan 2 (positif, tanda tidak berubah):</p>
                    <BlockMath math="x < 4" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x < 4, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 2 - Sedang */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded mr-2">SEDANG</span>
                  Contoh Soal 2
                </span>
              </div>
              {expandedSections.includes("contoh2") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">Selesaikan: <InlineMath math="3(x + 4) > -2(x - 1) + 5" /></p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p><strong>Langkah 1:</strong> Distribusikan:</p>
                    <BlockMath math="3x + 12 > -2x + 2 + 5" />
                    <BlockMath math="3x + 12 > -2x + 7" />
                    <p><strong>Langkah 2:</strong> Pindah ruas:</p>
                    <BlockMath math="3x + 2x > 7 - 12" />
                    <BlockMath math="5x > -5" />
                    <p><strong>Langkah 3:</strong> Bagi dengan 5 (positif):</p>
                    <BlockMath math="x > -1" />
                    <p className="text-green-400">HP = <InlineMath math="\{x \mid x > -1, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 3 - Sulit */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded mr-2">SULIT</span>
                  Contoh Soal 3
                </span>
              </div>
              {expandedSections.includes("contoh3") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Selesaikan: <InlineMath math="\frac{3x - 1}{2} \geq \frac{x + 3}{4} + 1" />
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1:</strong> KPK dari 2 dan 4 adalah 4. Kalikan semua suku dengan 4:</p>
                    <BlockMath math="4 \cdot \frac{3x-1}{2} \geq 4 \cdot \frac{x+3}{4} + 4 \cdot 1" />
                    <BlockMath math="2(3x - 1) \geq (x + 3) + 4" />
                    <p><strong>Langkah 2:</strong> Distribusikan:</p>
                    <BlockMath math="6x - 2 \geq x + 7" />
                    <p><strong>Langkah 3:</strong> Pindah ruas:</p>
                    <BlockMath math="6x - x \geq 7 + 2" />
                    <BlockMath math="5x \geq 9" />
                    <p><strong>Langkah 4:</strong> Bagi dengan 5 (positif):</p>
                    <BlockMath math="x \geq \frac{9}{5}" />
                    <p className="text-green-400">HP = <InlineMath math="\left\{x \mid x \geq \frac{9}{5},\, x \in \mathbb{R}\right\}" /></p>
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

export default PenyelesaianPtLSVPage;
