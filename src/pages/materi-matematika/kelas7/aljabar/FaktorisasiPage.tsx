import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const FaktorisasiPage = () => {
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
          FAKTORISASI BENTUK ALJABAR
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
                <span className="font-body font-semibold text-white">Faktorisasi: Kebalikan dari Menjabarkan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kalau menjabarkan mengubah perkalian menjadi penjumlahan, maka <strong className="text-primary">faktorisasi</strong> adalah kebalikannya — mengubah penjumlahan kembali menjadi perkalian faktor-faktor.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\underbrace{ab + ac}_{\text{penjumlahan}} \xrightarrow{\text{faktorisasi}} \underbrace{a(b+c)}_{\text{perkalian}}" />
                  </div>
                  <p className="font-body text-xs text-cyan-200 mt-2">Kunci: cari <strong>faktor persekutuan terbesar (FPT)</strong> dari semua suku!</p>
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Intisari */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Teknik-Teknik Faktorisasi</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">1. Faktorisasi dengan Hukum Distributif</p>
                  <p className="font-body text-sm text-white/80 mb-2">Keluarkan faktor persekutuan terbesar:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="4a + 8 = 4(a + 2)" />
                    <BlockMath math="9p^3 + 15p^5 = 3p^3(3 + 5p^2)" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">2. Faktorisasi Selisih Dua Kuadrat</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="x^2 - y^2 = (x + y)(x - y)" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">3. Faktorisasi <InlineMath math="x^2 + bx + c" /></p>
                  <p className="font-body text-sm text-white/80 mb-2">Cari dua bilangan yang <strong>jumlahnya</strong> = <InlineMath math="b" /> dan <strong>perkaliannya</strong> = <InlineMath math="c" />:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="x^2 + 7x + 12 = (x + 3)(x + 4)" />
                    <p className="text-xs text-white/60">(karena 3 + 4 = 7 dan 3 × 4 = 12)</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Dalam faktorisasi, selalu gunakan <strong>FPT</strong> (faktor persekutuan terbesar) agar suku di dalam kurung tidak lagi punya faktor bersama.
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
                    <p className="font-body text-sm text-white">Faktorkan: <InlineMath math="4x^2y + 6xy^2 - 8x^2y^2" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari FPT dari <InlineMath math="4x^2y, 6xy^2, 8x^2y^2" /> → FPT = <InlineMath math="2xy" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 2xy(2x) + 2xy(3y) - 2xy(4xy)" />
                        <BlockMath math="= 2xy(2x + 3y - 4xy)" />
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
                    <p className="font-body text-sm text-white">Faktorkan selengkapnya: <InlineMath math="5m^2 - 5n^2" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Keluarkan FPT = 5:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="5m^2 - 5n^2 = 5(m^2 - n^2)" />
                      </div>
                      <p><strong>Langkah 2:</strong> Faktorkan selisih dua kuadrat:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 5(m + n)(m - n)" />
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
                    <p className="font-body text-sm text-white">Faktorkan: <InlineMath math="x^2 - 10x + 21" /></p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari dua bilangan yang jumlahnya <InlineMath math="-10" /> dan perkaliannya <InlineMath math="21" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Kandidat: <InlineMath math="-3" /> dan <InlineMath math="-7" /></p>
                        <p>Cek: <InlineMath math="(-3) + (-7) = -10" /> ✓</p>
                        <p>Cek: <InlineMath math="(-3) \times (-7) = 21" /> ✓</p>
                      </div>
                      <p><strong>Langkah 2:</strong> Tulis dalam bentuk faktor:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="x^2 - 10x + 21 = (x - 3)(x - 7)" />
                      </div>
                      <p><strong>Verifikasi:</strong> <InlineMath math="(x-3)(x-7) = x^2 - 7x - 3x + 21 = x^2 - 10x + 21" /> ✓</p>
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

export default FaktorisasiPage;
