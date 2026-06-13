import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PembagianAljabarPage = () => {
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
          PEMBAGIAN BENTUK ALJABAR
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
                <span className="font-body font-semibold text-white">Kunci Pembagian: Cari Faktor yang Sama!</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pembagian bentuk aljabar bekerja mirip seperti penyederhanaan pecahan biasa. Jika dua bentuk aljabar punya faktor yang sama, kita bisa saling mencoret faktor tersebut untuk menyederhanakan hasilnya.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    Contoh sederhana: <InlineMath math="8a \div 2a = 4" /> karena faktor <InlineMath math="2a" /> ada di keduanya. Demikian pula <InlineMath math="6xy \div 3y = 2x" />.
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Cara Membagi Aljabar</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Metode 1: Pembagian Langsung (faktor persekutuan)</p>
                  <p className="font-body text-sm text-white/80">Jika pembilang dan penyebut punya faktor yang sama, coret faktor tersebut.</p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2">
                    <BlockMath math="\frac{28a^5b^3}{-7a^4} = -4ab^3" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Metode 2: Bagi Kurung (polinomial)</p>
                  <p className="font-body text-sm text-white/80">Digunakan ketika pembagi merupakan suku dua. Caranya sama seperti pembagian bilangan bulat panjang.</p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2 font-mono text-xs text-white/70">
                    <p>Langkah: bagi → kalikan → kurangi → turunkan → ulangi</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Jika hasil pembagian tidak habis, maka ada <strong>sisa</strong>. Ditulis sebagai: hasil + sisa/pembagi.
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
                    <p className="font-body text-sm text-white">Tentukan hasil: <InlineMath math="42x^7y^8z \div 6x^3y^8" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Pisahkan dan sederhanakan setiap bagian:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{42x^7y^8z}{6x^3y^8} = \frac{42}{6} \cdot \frac{x^7}{x^3} \cdot \frac{y^8}{y^8} \cdot z" />
                        <BlockMath math="= 7 \cdot x^4 \cdot 1 \cdot z = 7x^4z" />
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
                    <p className="font-body text-sm text-white">Bagi: <InlineMath math="(x^2 + 8x + 12) \div (x + 6)" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN (Cara Bagi Kurung):</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 font-mono text-xs">
                        <p className="text-white/70">x + 2</p>
                        <p className="text-white/50">──────────────────</p>
                        <p className="text-white/70">x + 6 ) x² + 8x + 12</p>
                        <p className="text-white/70 ml-8">x² + 6x</p>
                        <p className="text-white/50 ml-8">────────</p>
                        <p className="text-white/70 ml-14">2x + 12</p>
                        <p className="text-white/70 ml-14">2x + 12</p>
                        <p className="text-white/50 ml-14">────────</p>
                        <p className="text-primary ml-20">0</p>
                      </div>
                      <p className="text-primary font-semibold">Hasil: <InlineMath math="x + 2" /> (habis dibagi)</p>
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
                    <p className="font-body text-sm text-white">Bagi <InlineMath math="(2x^3 + 7x - 32)" /> dengan <InlineMath math="(x - 3)" /> dan tentukan sisanya!</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 font-mono text-xs">
                        <p className="text-white/70">2x + 13</p>
                        <p className="text-white/50">──────────────────</p>
                        <p className="text-white/70">x - 3 ) 2x² + 7x - 32</p>
                        <p className="text-white/70 ml-8">2x² - 6x</p>
                        <p className="text-white/50 ml-8">────────</p>
                        <p className="text-white/70 ml-12">13x - 32</p>
                        <p className="text-white/70 ml-12">13x - 39</p>
                        <p className="text-white/50 ml-12">────────</p>
                        <p className="text-primary ml-20">7</p>
                      </div>
                      <p className="text-primary font-semibold">Hasil: <InlineMath math="2x + 13" /> sisa <InlineMath math="7" /></p>
                      <p className="text-white/60 text-xs">Artinya: <InlineMath math="(2x^2 + 7x - 32) = (x-3)(2x+13) + 7" /></p>
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

export default PembagianAljabarPage;
