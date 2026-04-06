import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PemangkatanAljabarPage = () => {
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
          PEMANGKATAN BENTUK ALJABAR
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
                <span className="font-body font-semibold text-white">Pangkat = Perkalian Berulang</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pemangkatan artinya mengalikan sebuah bentuk aljabar dengan dirinya sendiri sebanyak pangkat kali. Misalnya <InlineMath math="(4a)^2 = 4a \times 4a = 16a^2" />.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-orange-300">Hati-hati! Perhatikan letak pangkat:</p>
                  <p className="font-body text-sm text-white/80"><InlineMath math="3a^2" /> → hanya <InlineMath math="a" /> yang dikuadratkan = <InlineMath math="3 \times a \times a" /></p>
                  <p className="font-body text-sm text-white/80"><InlineMath math="(3a)^2" /> → seluruh <InlineMath math="3a" /> dikuadratkan = <InlineMath math="9a^2" /></p>
                  <p className="font-body text-sm text-red-300 font-semibold">Jadi <InlineMath math="3a^2 \neq (3a)^2" />!</p>
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Intisari */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus dan Segitiga Pascal</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">Rumus Pengkuadratan Suku Dua:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <BlockMath math="(a + b)^2 = a^2 + 2ab + b^2" />
                    <BlockMath math="(a - b)^2 = a^2 - 2ab + b^2" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Segitiga Pascal untuk Koefisien:</p>
                  <div className="bg-slate-900/50 rounded p-3 font-mono text-xs text-center text-white/70 space-y-1">
                    <p>1</p>
                    <p>1  1</p>
                    <p>1  2  1  → untuk pangkat 2</p>
                    <p>1  3  3  1  → untuk pangkat 3</p>
                    <p>1  4  6  4  1  → untuk pangkat 4</p>
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">Pangkat dari <InlineMath math="a" /> turun, pangkat dari <InlineMath math="b" /> naik.</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">Contoh Pangkat 3:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3" />
                    <BlockMath math="(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Untuk pangkat negatif <InlineMath math="(a-b)^n" />, tanda berganti-ganti: +, −, +, −, ... mulai dari suku pertama.
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
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Tentukan: <InlineMath math="(-15m^4n^3)^2" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Pangkatkan seluruh bagian di dalam kurung:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(-15m^4n^3)^2 = (-15)^2 \cdot (m^4)^2 \cdot (n^3)^2" />
                        <BlockMath math="= 225m^8n^6" />
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
                    <p className="font-body text-sm text-white">Jabarkan: <InlineMath math="(5x^2 - 2x)^2" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Gunakan rumus <InlineMath math="(a-b)^2 = a^2 - 2ab + b^2" /> dengan <InlineMath math="a = 5x^2" />, <InlineMath math="b = 2x" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(5x^2)^2 - 2(5x^2)(2x) + (2x)^2" />
                        <BlockMath math="= 25x^4 - 20x^3 + 4x^2" />
                      </div>
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
                      Jabarkan <InlineMath math="(3x - 2y)^3" /> menggunakan Segitiga Pascal!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Koefisien untuk pangkat 3 dari Segitiga Pascal: <strong>1, 3, 3, 1</strong></p>
                      <p><strong>Langkah 2:</strong> Terapkan pola dengan <InlineMath math="a = 3x" />, <InlineMath math="b = -2y" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="1(3x)^3 + 3(3x)^2(-2y) + 3(3x)(-2y)^2 + 1(-2y)^3" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung masing-masing suku:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 27x^3 + 3(9x^2)(-2y) + 3(3x)(4y^2) + (-8y^3)" />
                        <BlockMath math="= 27x^3 - 54x^2y + 36xy^2 - 8y^3" />
                      </div>
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

export default PemangkatanAljabarPage;
