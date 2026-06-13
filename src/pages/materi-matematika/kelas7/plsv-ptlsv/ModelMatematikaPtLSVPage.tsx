import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const ModelMatematikaPtLSVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "model", "langkah", "katakunci", "contoh1", "contoh2", "contoh3"]);

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
          MODEL MATEMATIKA & PENERAPAN PtLSV
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
                <span className="font-body font-semibold text-white">Pertidaksamaan dalam Kehidupan Nyata</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  PtLSV sangat berguna untuk memodelkan masalah nyata yang melibatkan <strong className="text-primary">batasan atau rentang nilai</strong>. Contohnya: batas minimum, kapasitas maksimum, syarat kelulusan, anggaran belanja, dan lain-lain.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Contoh situasi: "Kamu hanya punya uang Rp50.000. Kamu ingin membeli beberapa buku seharga Rp12.000 per buku. Paling banyak berapa buku yang bisa kamu beli?" → Ini adalah masalah PtLSV!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Model Matematika */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("model")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Model Matematika untuk PtLSV</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Model matematika PtLSV dibuat dengan cara yang sama seperti PLSV, namun menggunakan tanda pertidaksamaan. Tanda yang tepat bergantung pada konteks soal.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-3">Kata kunci → Tanda Pertidaksamaan:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-4 text-primary">Kata Kunci dalam Soal</th>
                          <th className="text-left py-2 text-primary">Tanda</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">lebih dari, melebihi, di atas</td><td className="py-2"><InlineMath math=">" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">kurang dari, di bawah, tidak sampai</td><td className="py-2"><InlineMath math="<" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">paling sedikit, minimal, sekurang-kurangnya, tidak kurang dari</td><td className="py-2"><InlineMath math="\geq" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">paling banyak, maksimal, tidak lebih dari, tidak melebihi</td><td className="py-2"><InlineMath math="\leq" /></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Langkah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("langkah")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Langkah-Langkah Menyelesaikan Soal Cerita PtLSV</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">1</span>
                      <p><strong className="text-green-300">Baca dan pahami soal</strong> — Cari tahu apa yang diketahui dan apa yang ditanya.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">2</span>
                      <p><strong className="text-green-300">Tentukan variabel</strong> — Misalkan besaran yang dicari dengan variabel.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">3</span>
                      <p><strong className="text-green-300">Buat model PtLSV</strong> — Perhatikan kata kunci untuk menentukan tanda pertidaksamaan yang tepat.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">4</span>
                      <p><strong className="text-green-300">Selesaikan pertidaksamaan</strong> — Hati-hati saat mengali/membagi dengan bilangan negatif!</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">5</span>
                      <p><strong className="text-green-300">Tafsirkan jawaban</strong> — Kembalikan ke konteks soal. Ingat, variabel sering bernilai bulat positif dalam soal cerita!</p>
                    </div>
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
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Sebuah lift memiliki kapasitas maksimum 480 kg. Berat rata-rata satu orang dewasa adalah 60 kg. Paling banyak berapa orang yang dapat masuk lift sekaligus?
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1 & 2:</strong> Misalkan jumlah orang = <InlineMath math="x" /></p>
                    <p><strong>Langkah 3:</strong> Model PtLSV ("paling banyak" → <InlineMath math="\leq" />):</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="60x \leq 480" />
                    </div>
                    <p><strong>Langkah 4:</strong> Selesaikan:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="x \leq \frac{480}{60} = 8" />
                    </div>
                    <p><strong>Langkah 5:</strong> Paling banyak <strong className="text-green-400">8 orang</strong> yang dapat masuk lift.</p>
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
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Nilai ujian matematika Reza pada tiga ulangan pertama adalah 70, 75, dan 80. Berapa nilai minimal yang harus Reza dapatkan pada ulangan keempat agar rata-ratanya tidak kurang dari 78?
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1 & 2:</strong> Misalkan nilai ulangan ke-4 = <InlineMath math="x" /></p>
                    <p><strong>Langkah 3:</strong> Rata-rata 4 ulangan "tidak kurang dari 78" → <InlineMath math="\geq 78" /></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\frac{70 + 75 + 80 + x}{4} \geq 78" />
                    </div>
                    <p><strong>Langkah 4:</strong> Selesaikan:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="\frac{225 + x}{4} \geq 78" />
                      <BlockMath math="225 + x \geq 312" />
                      <BlockMath math="x \geq 87" />
                    </div>
                    <p><strong>Langkah 5:</strong> Reza harus mendapatkan nilai <strong className="text-green-400">minimal 87</strong> pada ulangan ke-4.</p>
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
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Seorang pedagang memiliki modal Rp150.000. Ia ingin membeli dua jenis barang: barang A seharga Rp8.000 per unit dan barang B seharga Rp5.000 per unit. Ia sudah pasti membeli 10 unit barang B. Berapa paling banyak unit barang A yang dapat ia beli tanpa melebihi modalnya?
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1 & 2:</strong></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>Misalkan jumlah barang A = <InlineMath math="x" /> unit</p>
                      <p>Jumlah barang B = 10 unit (sudah pasti)</p>
                    </div>
                    <p><strong>Langkah 3:</strong> Total pengeluaran tidak boleh melebihi modal:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="8000x + 5000(10) \leq 150000" />
                    </div>
                    <p><strong>Langkah 4:</strong> Selesaikan:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="8000x + 50000 \leq 150000" />
                      <BlockMath math="8000x \leq 100000" />
                      <BlockMath math="x \leq \frac{100000}{8000} = 12{,}5" />
                    </div>
                    <p><strong>Langkah 5:</strong> Karena <InlineMath math="x" /> harus bilangan bulat dan <InlineMath math="x \leq 12{,}5" />, maka paling banyak pedagang dapat membeli <strong className="text-green-400">12 unit barang A</strong>.</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>Verifikasi: <InlineMath math="8000(12) + 5000(10) = 96000 + 50000 = 146000 \leq 150000" /> ✓</p>
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

export default ModelMatematikaPtLSVPage;
