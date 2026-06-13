import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const OperasiPecahanPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh"]);

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
          MENYEDERHANAKAN PECAHAN ALJABAR
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · Aljabar · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Pecahan Aljabar: Prinsipnya Sama dengan Pecahan Biasa</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pecahan aljabar adalah pecahan yang pembilang atau penyebutnya (atau keduanya) memuat bentuk aljabar. Contoh: <InlineMath math="\dfrac{3}{2a}" />, <InlineMath math="\dfrac{m+2}{8}" />, <InlineMath math="\dfrac{x-5}{2x+y}" />.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-orange-200">
                    <strong>Penting!</strong> Penyebut pecahan aljabar <strong>tidak boleh nol</strong>. Jadi jika penyebutnya <InlineMath math="(a - 3)" />, maka <InlineMath math="a \neq 3" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Intisari */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Operasi pada Pecahan Aljabar</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">1. Menyederhanakan Pecahan Aljabar</p>
                  <p className="font-body text-sm text-white/80 mb-2">Faktorkan pembilang dan penyebut, lalu coret faktor yang sama:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\frac{x^2 + 4x}{x^2 - 16} = \frac{x(x+4)}{(x+4)(x-4)} = \frac{x}{x-4}" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">2. Penjumlahan & Pengurangan</p>
                  <p className="font-body text-sm text-white/80 mb-2">Samakan penyebut terlebih dahulu (cari KPK penyebut):</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="\frac{a}{b} + \frac{c}{b} = \frac{a+c}{b}" />
                    <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">3. Perkalian & Pembagian</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}" />
                    <BlockMath math="\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c} = \frac{ad}{bc}" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Selalu faktorkan pembilang dan penyebut dulu sebelum melakukan operasi — seringkali ada faktor yang bisa disederhanakan terlebih dahulu!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Sederhanakan: <InlineMath math="\dfrac{4a - 12b}{8}" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Faktorkan pembilang dengan FPT = 4:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{4(a - 3b)}{8} = \frac{a - 3b}{2}" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Sederhanakan: <InlineMath math="\dfrac{m^2 + m - 6}{2m^2 + 6m}" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Faktorkan pembilang: <InlineMath math="m^2 + m - 6 = (m+3)(m-2)" /></p>
                      <p><strong>Langkah 2:</strong> Faktorkan penyebut: <InlineMath math="2m^2 + 6m = 2m(m+3)" /></p>
                      <p><strong>Langkah 3:</strong> Coret faktor yang sama <InlineMath math="(m+3)" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{(m+3)(m-2)}{2m(m+3)} = \frac{m-2}{2m}" />
                      </div>
                      <p className="text-white/60 text-xs">Syarat: <InlineMath math="m \neq 0" /> dan <InlineMath math="m \neq -3" /></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah: <InlineMath math="\dfrac{3}{x+2} + \dfrac{5}{x-3}" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Kedua penyebut berbeda, KPK-nya adalah <InlineMath math="(x+2)(x-3)" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{3(x-3)}{(x+2)(x-3)} + \frac{5(x+2)}{(x+2)(x-3)}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Gabungkan pembilang:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= \frac{3x - 9 + 5x + 10}{(x+2)(x-3)}" />
                        <BlockMath math="= \frac{8x + 1}{(x+2)(x-3)}" />
                      </div>
                      <p className="text-primary font-semibold">Hasil: <InlineMath math="\dfrac{8x+1}{(x+2)(x-3)}" /></p>
                      <p className="text-white/60 text-xs">Syarat: <InlineMath math="x \neq -2" /> dan <InlineMath math="x \neq 3" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aljabar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiPecahanPage;
