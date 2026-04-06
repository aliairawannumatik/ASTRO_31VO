import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianUnsurPage = () => {
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
          PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR
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
                <span className="font-body font-semibold text-white">Kenapa Matematika Pakai Huruf?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu punya 3 kantong, dan setiap kantong berisi sejumlah uang yang sama — tapi kamu belum tahu berapa isinya. Gimana cara nulisnya? Di sinilah <strong className="text-primary">aljabar</strong> masuk!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Misalnya, isi tiap kantong kita sebut <InlineMath math="x" /> rupiah. Maka total uang dari 3 kantong adalah <InlineMath math="x + x + x = 3x" /> rupiah. Bentuk <InlineMath math="3x" /> inilah yang disebut <strong>bentuk aljabar</strong>.
                  </p>
                </div>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kata "aljabar" sendiri berasal dari karya ilmuwan muslim bernama <strong className="text-primary">Al-Khawarizmi</strong> (780–850 M). Beliau menulis buku berjudul <em>al-jabr wal-muqabalah</em> yang menjadi fondasi ilmu aljabar modern.
                </p>
              </div>
            )}
          </div>

          {/* Ringkasan Intisari */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Unsur-Unsur Aljabar</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Sebuah bentuk aljabar tersusun dari beberapa unsur penting. Mari kenali satu per satu!
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">Unsur-Unsur Bentuk Aljabar:</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong className="text-green-300">Variabel (Peubah):</strong> Simbol huruf yang mewakili bilangan yang belum diketahui. Contoh: <InlineMath math="x, y, a, b" /></p>
                    <p><strong className="text-green-300">Koefisien:</strong> Bilangan yang dikalikan dengan variabel. Pada <InlineMath math="5x" />, koefisiennya adalah <InlineMath math="5" />.</p>
                    <p><strong className="text-green-300">Konstanta:</strong> Bilangan tetap tanpa variabel. Pada <InlineMath math="-7x^2y + 3" />, konstantanya adalah <InlineMath math="3" />.</p>
                    <p><strong className="text-green-300">Suku:</strong> Bagian dari bentuk aljabar yang dipisahkan oleh tanda + atau −.</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">Jenis-Jenis Suku:</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>Suku satu (monomial):</strong> <InlineMath math="4a,\ 6ab^2,\ -5a^2bc^3" /></p>
                    <p><strong>Suku dua (binom):</strong> <InlineMath math="2p + 15,\ 7p^2 - 10p" /></p>
                    <p><strong>Suku tiga (trinom):</strong> <InlineMath math="8x - 4y + 9,\ 6x^2 + 3xy - 5y^2" /></p>
                    <p><strong>Suku banyak (polinom):</strong> bentuk aljabar dengan lebih dari tiga suku.</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Suku Sejenis:</p>
                  <p className="font-body text-sm text-white/80">
                    Dua suku disebut sejenis jika memiliki variabel <strong>dan pangkat</strong> yang sama. Hanya koefisiennya yang boleh berbeda.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2">
                    <p className="font-body text-sm text-white/70">Contoh: <InlineMath math="12x^2" /> dan <InlineMath math="-4x^2" /> → <strong className="text-green-400">sejenis ✓</strong></p>
                    <p className="font-body text-sm text-white/70 mt-1"><InlineMath math="-9xy" /> dan <InlineMath math="7xy^2" /> → <strong className="text-red-400">tidak sejenis ✗</strong> (pangkat y berbeda)</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Suku sejenis itu seperti "keluarga" — boleh beda nama (koefisien), tapi harus punya "silsilah" variabel yang sama persis!
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

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada bentuk aljabar <InlineMath math="5x^2 - 3x + 7" />, tentukan: koefisien <InlineMath math="x^2" />, koefisien <InlineMath math="x" />, konstanta, dan jumlah sukunya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Identifikasi setiap suku → <InlineMath math="5x^2" />, <InlineMath math="-3x" />, dan <InlineMath math="7" />.</p>
                      <p><strong>Langkah 2:</strong> Temukan masing-masing unsur:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Koefisien <InlineMath math="x^2" /> = <strong className="text-primary">5</strong></p>
                        <p>Koefisien <InlineMath math="x" /> = <strong className="text-primary">-3</strong></p>
                        <p>Konstanta = <strong className="text-primary">7</strong></p>
                        <p>Jumlah suku = <strong className="text-primary">3</strong> (suku tiga / trinom)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari bentuk aljabar <InlineMath math="12x^2 - 9xy - 8y + 7xy^2 - 4x^2 + 5xy" />, kelompokkan suku-suku yang sejenis!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Daftarkan semua suku: <InlineMath math="12x^2,\ -9xy,\ -8y,\ 7xy^2,\ -4x^2,\ 5xy" /></p>
                      <p><strong>Langkah 2:</strong> Cari pasangan yang variabel dan pangkatnya sama:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><InlineMath math="12x^2" /> dan <InlineMath math="-4x^2" /> → <strong className="text-green-400">sejenis</strong> (sama-sama <InlineMath math="x^2" />)</p>
                        <p><InlineMath math="-9xy" /> dan <InlineMath math="5xy" /> → <strong className="text-green-400">sejenis</strong> (sama-sama <InlineMath math="xy" />)</p>
                        <p><InlineMath math="-8y" /> dan <InlineMath math="7xy^2" /> → <strong className="text-red-400">tidak sejenis</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah toko menjual pensil seharga <InlineMath math="p" /> rupiah per batang dan buku seharga <InlineMath math="q" /> rupiah per buah. Riko membeli 5 pensil dan 3 buku, lalu Sari membeli 2 pensil dan 7 buku. Nyatakan total belanja Riko dan Sari dalam bentuk aljabar! Identifikasi koefisien, variabel, dan konstantanya.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Susun bentuk aljabar untuk masing-masing:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Belanja Riko = <InlineMath math="5p + 3q" /></p>
                        <p>Belanja Sari = <InlineMath math="2p + 7q" /></p>
                      </div>
                      <p><strong>Langkah 2:</strong> Total belanja keduanya:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(5p + 3q) + (2p + 7q) = 7p + 10q" />
                      </div>
                      <p><strong>Langkah 3:</strong> Identifikasi unsur dari <InlineMath math="7p + 10q" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Variabel: <InlineMath math="p" /> dan <InlineMath math="q" /></p>
                        <p>Koefisien <InlineMath math="p" /> = <strong className="text-primary">7</strong></p>
                        <p>Koefisien <InlineMath math="q" /> = <strong className="text-primary">10</strong></p>
                        <p>Konstanta: <strong className="text-primary">tidak ada</strong></p>
                        <p>Jenis: <strong className="text-primary">suku dua (binom)</strong></p>
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

export default PengertianUnsurPage;
