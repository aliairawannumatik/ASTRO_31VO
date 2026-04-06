import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const ModelMatematikaPLSVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "model", "langkah", "contoh1", "contoh2", "contoh3"]);

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
          MODEL MATEMATIKA & PENERAPAN PLSV
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
                <span className="font-body font-semibold text-white">Dari Cerita ke Persamaan</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Salah satu kegunaan terbesar PLSV adalah menyelesaikan <strong className="text-primary">masalah nyata dalam kehidupan sehari-hari</strong>. Caranya adalah dengan mengubah masalah cerita menjadi bentuk persamaan matematika — inilah yang disebut <strong className="text-primary">model matematika</strong>.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Contoh: "Usia Ani 5 tahun lebih tua dari Budi. Jika jumlah usia mereka 35 tahun, berapa usia masing-masing?" → Ini bisa diubah menjadi persamaan dan diselesaikan!
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
                <span className="font-body font-semibold text-white">Apa Itu Model Matematika?</span>
              </div>
              {expandedSections.includes("model") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("model") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-blue-300">Model matematika</strong> adalah representasi atau terjemahan dari suatu masalah nyata ke dalam bentuk ekspresi atau persamaan matematika. Dengan model matematika, masalah yang tampak rumit bisa diselesaikan secara sistematis.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">Kata kunci yang sering muncul dalam soal cerita:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-3 text-primary">Kata Kunci</th>
                          <th className="text-left py-2 text-primary">Simbol Matematika</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">Jumlah, total, seluruh</td><td className="py-1"><InlineMath math="+" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">Kurang, selisih, sisa</td><td className="py-1"><InlineMath math="-" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">Kali, perkalian, lipat</td><td className="py-1"><InlineMath math="\times" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">Bagi, per, rata-rata</td><td className="py-1"><InlineMath math="\div" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">Sama dengan, adalah, hasilnya</td><td className="py-1"><InlineMath math="=" /></td></tr>
                        <tr><td className="py-1 pr-3">Bilangan yang dicari</td><td className="py-1"><InlineMath math="x" /> atau variabel lain</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Langkah-langkah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("langkah")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Langkah-Langkah Menyelesaikan Soal Cerita PLSV</span>
              </div>
              {expandedSections.includes("langkah") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">1</span>
                      <p><strong className="text-green-300">Baca dan pahami soal</strong> — Identifikasi apa yang diketahui dan apa yang ditanya.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">2</span>
                      <p><strong className="text-green-300">Tentukan variabel</strong> — Misalkan bilangan atau besaran yang belum diketahui dengan <InlineMath math="x" /> (atau huruf lain).</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">3</span>
                      <p><strong className="text-green-300">Buat model matematika</strong> — Terjemahkan informasi dalam soal menjadi PLSV.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">4</span>
                      <p><strong className="text-green-300">Selesaikan persamaan</strong> — Cari nilai variabel.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">5</span>
                      <p><strong className="text-green-300">Tafsirkan jawaban</strong> — Kembalikan nilai variabel ke konteks soal dan buat kesimpulan.</p>
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
              {expandedSections.includes("contoh1") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Sebuah bilangan jika ditambah 17 hasilnya 30. Tentukan bilangan tersebut!
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1 & 2:</strong> Misalkan bilangan tersebut = <InlineMath math="x" /></p>
                    <p><strong>Langkah 3:</strong> Model matematika:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="x + 17 = 30" />
                    </div>
                    <p><strong>Langkah 4:</strong> Selesaikan:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="x = 30 - 17 = 13" />
                    </div>
                    <p><strong>Langkah 5:</strong> Jadi bilangan yang dimaksud adalah <strong className="text-green-400">13</strong>.</p>
                    <p>Verifikasi: <InlineMath math="13 + 17 = 30" /> ✓</p>
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
                  <p className="font-body text-sm text-white">
                    Usia Ayah sekarang adalah 3 kali usia Doni. Selisih usia mereka adalah 28 tahun. Berapakah usia Ayah dan Doni sekarang?
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1 & 2:</strong> Misalkan usia Doni = <InlineMath math="x" /> tahun, maka usia Ayah = <InlineMath math="3x" /> tahun.</p>
                    <p><strong>Langkah 3:</strong> Model matematika (selisih usia):</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="3x - x = 28" />
                    </div>
                    <p><strong>Langkah 4:</strong> Selesaikan:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="2x = 28" />
                      <BlockMath math="x = 14" />
                    </div>
                    <p><strong>Langkah 5:</strong> Usia Doni = <strong className="text-green-400">14 tahun</strong>, Usia Ayah = <InlineMath math="3 \times 14" /> = <strong className="text-green-400">42 tahun</strong>.</p>
                    <p>Verifikasi: Selisih = <InlineMath math="42 - 14 = 28" /> ✓</p>
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
                    Sebuah toko buku menjual dua jenis pensil. Pensil merek A harganya Rp2.000 lebih mahal dari pensil merek B. Seorang siswa membeli 3 pensil A dan 5 pensil B dengan total Rp22.000. Berapakah harga masing-masing pensil?
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1 & 2:</strong></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>Misalkan harga pensil B = <InlineMath math="x" /> rupiah</p>
                      <p>Maka harga pensil A = <InlineMath math="(x + 2000)" /> rupiah</p>
                    </div>
                    <p><strong>Langkah 3:</strong> Model matematika:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="3(x + 2000) + 5x = 22000" />
                    </div>
                    <p><strong>Langkah 4:</strong> Selesaikan:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="3x + 6000 + 5x = 22000" />
                      <BlockMath math="8x = 22000 - 6000 = 16000" />
                      <BlockMath math="x = 2000" />
                    </div>
                    <p><strong>Langkah 5:</strong></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>Harga pensil B = <strong className="text-green-400">Rp2.000</strong></p>
                      <p>Harga pensil A = <InlineMath math="2000 + 2000" /> = <strong className="text-green-400">Rp4.000</strong></p>
                    </div>
                    <p>Verifikasi: <InlineMath math="3(4000) + 5(2000) = 12000 + 10000 = 22000" /> ✓</p>
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

export default ModelMatematikaPLSVPage;
