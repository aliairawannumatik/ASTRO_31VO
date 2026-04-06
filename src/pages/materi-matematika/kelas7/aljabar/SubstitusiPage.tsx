import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const SubstitusiPage = () => {
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
          SUBSTITUSI BILANGAN PADA BENTUK ALJABAR
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
                <span className="font-body font-semibold text-white">Substitusi: Tukar Huruf dengan Angka!</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Variabel dalam bentuk aljabar bisa diganti dengan bilangan tertentu. Proses penggantian ini disebut <strong className="text-primary">substitusi</strong>. Ini sangat berguna saat kita menggunakan rumus dalam fisika, kimia, atau soal cerita.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    Contoh: Rumus jarak <InlineMath math="s = v \times t" />. Jika <InlineMath math="v = 68" /> km/jam dan <InlineMath math="t = 1{,}5" /> jam, maka <InlineMath math="s = 68 \times 1{,}5 = 102" /> km. Itulah substitusi!
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Cara Melakukan Substitusi</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-green-300">Langkah-Langkah Substitusi:</p>
                  <p className="font-body text-sm text-white/80"><strong>1.</strong> Tulis ulang bentuk aljabar aslinya.</p>
                  <p className="font-body text-sm text-white/80"><strong>2.</strong> Ganti setiap variabel dengan nilai yang diberikan.</p>
                  <p className="font-body text-sm text-white/80"><strong>3.</strong> Hitung hasil operasinya dengan urutan: kurung → pangkat → kali/bagi → tambah/kurang.</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Perhatikan Arti Notasi:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/70">
                    <p><InlineMath math="4ab" /> artinya <InlineMath math="4 \times a \times b" /></p>
                    <p><InlineMath math="ab^2" /> artinya <InlineMath math="a \times b \times b" /></p>
                    <p><InlineMath math="(ab)^2" /> artinya <InlineMath math="(ab) \times (ab) = a^2b^2" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Efisien:</strong> Jika ada suku-suku sejenis, sederhanakan dulu sebelum mensubstitusi agar perhitungannya lebih mudah!
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
                    <p className="font-body text-sm text-white">
                      Jika <InlineMath math="a = 5" /> dan <InlineMath math="b = -4" />, tentukan nilai dari <InlineMath math="2ab + 3b^2" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Ganti <InlineMath math="a = 5" /> dan <InlineMath math="b = -4" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="2(5)(-4) + 3(-4)^2" />
                        <BlockMath math="= 2 \times 5 \times (-4) + 3 \times 16" />
                        <BlockMath math="= -40 + 48 = 8" />
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
                    <p className="font-body text-sm text-white">
                      Jika <InlineMath math="p = 6" />, <InlineMath math="q = -3" />, dan <InlineMath math="r = -4" />, tentukan nilai dari <InlineMath math="(p + 5q)^2 - (qr)^2" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung bagian dalam kurung:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="p + 5q = 6 + 5(-3) = 6 - 15 = -9" />
                        <BlockMath math="qr = (-3)(-4) = 12" />
                      </div>
                      <p><strong>Langkah 2:</strong> Substitusikan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(-9)^2 - (12)^2 = 81 - 144 = -63" />
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
                      Sederhanakan dulu, lalu substitusikan <InlineMath math="x = 8" /> dan <InlineMath math="y = -12" /> ke dalam bentuk:
                    </p>
                    <div className="mt-2">
                      <BlockMath math="9x^3 - 21y + 16x^2 + 30y - 18x^2 - 20y" />
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Sederhanakan dengan mengelompokkan suku sejenis:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="9x^3 + (16x^2 - 18x^2) + (-21y + 30y - 20y)" />
                        <BlockMath math="= 9x^3 - 2x^2 - 11y" />
                      </div>
                      <p><strong>Langkah 2:</strong> Substitusikan <InlineMath math="x = 8" />, <InlineMath math="y = -12" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 9(8)^3 - 2(8)^2 - 11(-12)" />
                        <BlockMath math="= 9(512) - 2(64) + 132" />
                        <BlockMath math="= 4608 - 128 + 132 = 4612" />
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

export default SubstitusiPage;
