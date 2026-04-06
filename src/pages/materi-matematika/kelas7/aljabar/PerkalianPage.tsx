import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PerkalianAljabarPage = () => {
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
          PERKALIAN BENTUK ALJABAR
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
                <span className="font-body font-semibold text-white">Mengalikan Bentuk Aljabar: Bayangkan Persegi Panjang!</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Perkalian aljabar bisa dipahami lewat konsep luas persegi panjang. Jika panjangnya <InlineMath math="(x + 4)" /> dan lebarnya <InlineMath math="x" />, maka luasnya adalah <InlineMath math="x(x+4)" />. Luas ini bisa dijabarkan menjadi <InlineMath math="x^2 + 4x" />.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    Proses mengubah bentuk perkalian menjadi bentuk penjumlahan disebut <strong>menjabarkan</strong>. Caranya menggunakan <strong>sifat distributif</strong>.
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Jenis-Jenis Perkalian</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">1. Perkalian Suku Tunggal</p>
                  <p className="font-body text-sm text-white/80 mb-2">Kalikan koefisien dengan koefisien, pangkatkan variabel yang sama:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="a \times b = ab \quad \text{(sifat komutatif)}" />
                    <BlockMath math="3m \times (-4m^2n) \times 2np = 24m^3n^2p" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">2. Suku Tunggal × Suku Dua/Tiga</p>
                  <p className="font-body text-sm text-white/80 mb-2">Gunakan sifat distributif — kalikan setiap suku di dalam kurung:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="x(x + k) = x^2 + kx" />
                    <BlockMath math="x(x + y + k) = x^2 + xy + kx" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">3. Suku Dua × Suku Dua</p>
                  <p className="font-body text-sm text-white/80 mb-2">Setiap suku di kiri dikalikan dengan setiap suku di kanan (FOIL):</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="(a+b)(c+d) = ac + ad + bc + bd" />
                    <BlockMath math="(x+2)(x+5) = x^2 + 7x + 10" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips FOIL:</strong> First (suku pertama × pertama), Outer (luar × luar), Inner (dalam × dalam), Last (terakhir × terakhir).
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
                    <p className="font-body text-sm text-white">Jabarkan: <InlineMath math="4x(x^2 + 2xy - 3y^2)" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Kalikan <InlineMath math="4x" /> ke setiap suku dalam kurung:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="4x \cdot x^2 + 4x \cdot 2xy + 4x \cdot (-3y^2)" />
                        <BlockMath math="= 4x^3 + 8x^2y - 12xy^2" />
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
                    <p className="font-body text-sm text-white">Jabarkan: <InlineMath math="(3x - 4)(2x + 5)" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Gunakan hukum distributif — <InlineMath math="(3x - 4)" /> diuraikan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 3x(2x + 5) + (-4)(2x + 5)" />
                        <BlockMath math="= 6x^2 + 15x - 8x - 20" />
                        <BlockMath math="= 6x^2 + 7x - 20" />
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
                      Jabarkan dan sederhanakan: <InlineMath math="(2x - 3)(4x^2 + 6x + 9)" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Distribusikan suku pertama <InlineMath math="2x" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="2x(4x^2 + 6x + 9) = 8x^3 + 12x^2 + 18x" />
                      </div>
                      <p><strong>Langkah 2:</strong> Distribusikan suku kedua <InlineMath math="-3" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-3(4x^2 + 6x + 9) = -12x^2 - 18x - 27" />
                      </div>
                      <p><strong>Langkah 3:</strong> Jumlahkan dan sederhanakan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="8x^3 + 12x^2 + 18x - 12x^2 - 18x - 27 = 8x^3 - 27" />
                      </div>
                      <p className="text-primary font-semibold">Hasil: <InlineMath math="8x^3 - 27" /> (ini adalah selisih dua kubik!)</p>
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

export default PerkalianAljabarPage;
