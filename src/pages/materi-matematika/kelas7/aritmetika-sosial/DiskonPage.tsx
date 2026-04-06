import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Tag } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiskonPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "ganda", "contoh"]);

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
          DISKON (POTONGAN HARGA)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Aritmetika Sosial - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Diskon: Lebih dari Sekadar Harga Coret</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Saat belanja online atau ke mal, kita sering melihat tag harga dicoret dan ada angka baru di bawahnya. Itulah <strong className="text-primary">diskon</strong> — potongan harga yang diberikan penjual dalam bentuk persentase dari harga asli.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-cyan-200">
                      <strong>Contoh nyata:</strong> Baju seharga Rp200.000 mendapat diskon 25% artinya kamu hemat Rp50.000 dan hanya perlu membayar Rp150.000.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RINGKASAN INTISARI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus Diskon</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">Besar Diskon (dalam Rupiah):</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Besar Diskon} = \%\text{Diskon} \times \text{Harga Awal}" />
                  </div>
                  <p className="font-body text-sm font-semibold text-green-300 mt-2">Harga Bayar Setelah Diskon:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Harga Bayar} = \text{Harga Awal} \times (100\% - \%\text{Diskon})" />
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Cepat:</strong> Diskon 30% berarti kamu membayar <strong>70%</strong> dari harga asli. Diskon 15% berarti kamu membayar <strong>85%</strong>. Langsung kalikan saja!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DISKON GANDA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ganda")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Konsep Khusus: Diskon Ganda (Double Discount)</span>
              </div>
              {expandedSections.includes("ganda") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("ganda") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Promo "Diskon 20% + 10%" <strong className="text-red-400">tidak sama dengan</strong> diskon 30%! Diskon kedua dihitung dari harga setelah diskon pertama, bukan dari harga aslinya.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">Rumus Diskon Ganda (Cara Cepat):</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Harga Bayar} = \frac{(100 - d_1)}{100} \times \frac{(100 - d_2)}{100} \times \text{Harga Awal}" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">Di mana <InlineMath math="d_1" /> = diskon pertama (%), <InlineMath math="d_2" /> = diskon kedua (%)</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/60 mb-2">ILUSTRASI: Diskon 20% + 10% dari Rp100.000</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p>Diskon 20%: bayar <InlineMath math="80\% \times 100.000 = \text{Rp}80.000" /></p>
                    <p>Diskon 10% dari Rp80.000: bayar <InlineMath math="90\% \times 80.000 = \text{Rp}72.000" /></p>
                    <p className="text-orange-300 font-semibold">Total diskon efektif = 28%, BUKAN 30%!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
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

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Diskon Tunggal</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sepatu seharga Rp350.000 mendapat diskon 40%. Berapa harga yang harus dibayar?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Harga Bayar} = (100\% - 40\%) \times 350.000" />
                        <BlockMath math="= 60\% \times 350.000 = \frac{60}{100} \times 350.000 = \text{Rp}210.000" />
                      </div>
                      <p className="text-primary font-semibold">Harga yang dibayar = <strong>Rp210.000</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Mencari Harga Asli dari Harga Bayar</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah tas dijual dengan diskon 30% dan kamu membayar Rp280.000. Berapakah harga asli tas tersebut sebelum diskon?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Setelah diskon 30%, harga yang dibayar = 70% dari harga asli.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="70\% \times \text{Harga Asli} = 280.000" />
                        <BlockMath math="\text{Harga Asli} = \frac{280.000}{70\%} = \frac{280.000}{0{,}7} = \text{Rp}400.000" />
                      </div>
                      <p className="text-primary font-semibold">Harga asli tas = <strong>Rp400.000</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Diskon Ganda + Untung Rugi</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang pedagang membeli jaket seharga Rp400.000 per buah. Ia menjualnya dengan harga Rp600.000, lalu memberikan diskon 15% + 10% kepada pembeli. Apakah pedagang masih untung atau rugi? Berapa besarnya?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung harga bayar setelah diskon ganda:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Harga Bayar} = \frac{85}{100} \times \frac{90}{100} \times 600.000" />
                        <BlockMath math="= 0{,}85 \times 0{,}9 \times 600.000 = 0{,}765 \times 600.000 = \text{Rp}459.000" />
                      </div>
                      <p><strong>Langkah 2:</strong> Bandingkan dengan harga beli (modal):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Untung} = 459.000 - 400.000 = \text{Rp}59.000" />
                      </div>
                      <p className="text-primary font-semibold">Pedagang masih <strong>untung Rp59.000</strong> meskipun memberikan diskon ganda.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aritmetika Sosial
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiskonPage;
