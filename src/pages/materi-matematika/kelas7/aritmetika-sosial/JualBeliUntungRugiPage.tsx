import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, TrendingUp, TrendingDown } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const JualBeliUntungRugiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "persen", "contoh"]);

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
          JUAL BELI, UNTUNG DAN RUGI
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
                <span className="font-body font-semibold text-white">Kenapa Harus Paham Untung & Rugi?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dari warung kelontong hingga marketplace online, setiap transaksi jual beli selalu melibatkan dua angka kunci: <strong className="text-primary">harga beli</strong> dan <strong className="text-primary">harga jual</strong>. Selisih keduanya menentukan apakah kamu untung, rugi, atau impas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 border border-border rounded-lg p-3 text-center">
                    <p className="font-body text-xs font-semibold text-white/60 mb-1">HARGA BELI (Modal)</p>
                    <p className="font-body text-xs text-white/50">Uang yang dikeluarkan untuk mendapatkan barang</p>
                  </div>
                  <div className="bg-slate-800/50 border border-border rounded-lg p-3 text-center">
                    <p className="font-body text-xs font-semibold text-white/60 mb-1">HARGA JUAL</p>
                    <p className="font-body text-xs text-white/50">Uang yang diterima saat menjual barang</p>
                  </div>
                  <div className="bg-slate-800/50 border border-border rounded-lg p-3 text-center">
                    <p className="font-body text-xs font-semibold text-white/60 mb-1">SELISIH</p>
                    <p className="font-body text-xs text-white/50">Menentukan untung, rugi, atau impas</p>
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus Untung & Rugi</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <p className="font-body text-sm font-semibold text-green-300">Untung (Laba)</p>
                    </div>
                    <p className="font-body text-xs text-white/60 mb-2">Terjadi bila Harga Jual {">"} Harga Beli</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\text{Untung} = HJ - HB" />
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <p className="font-body text-sm font-semibold text-red-300">Rugi</p>
                    </div>
                    <p className="font-body text-xs text-white/60 mb-2">Terjadi bila Harga Jual {"<"} Harga Beli</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\text{Rugi} = HB - HJ" />
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">Mencari Harga Jual dari Persentase:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded p-2">
                      <p className="font-body text-xs text-white/60 mb-1">Jika untung U%:</p>
                      <BlockMath math="HJ = \frac{(100 + U)}{100} \times HB" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <p className="font-body text-xs text-white/60 mb-1">Jika rugi R%:</p>
                      <BlockMath math="HJ = \frac{(100 - R)}{100} \times HB" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan Penting:</strong> Persentase untung dan rugi selalu dihitung terhadap <strong>harga beli (modal)</strong>, bukan harga jual!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERSENTASE */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("persen")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Persentase Untung, Rugi & Mencari Harga Beli</span>
              </div>
              {expandedSections.includes("persen") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("persen") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">Persentase Untung:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\%U = \frac{\text{Untung}}{HB} \times 100\%" />
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">Persentase Rugi:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\%R = \frac{\text{Rugi}}{HB} \times 100\%" />
                    </div>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-3">Mencari Harga Beli dari Harga Jual & Persentase:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded p-2">
                      <p className="font-body text-xs text-white/60 mb-1">Jika diketahui untung U%:</p>
                      <BlockMath math="HB = \frac{100}{100 + U} \times HJ" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <p className="font-body text-xs text-white/60 mb-1">Jika diketahui rugi R%:</p>
                      <BlockMath math="HB = \frac{100}{100 - R} \times HJ" />
                    </div>
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

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Menghitung Untung & Persentasenya</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang pedagang membeli 1 karung beras seharga Rp180.000 lalu menjualnya seharga Rp225.000. Hitunglah besar untung dan persentase keuntungannya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Diketahui: <InlineMath math="HB = \text{Rp}180.000" />, <InlineMath math="HJ = \text{Rp}225.000" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Untung} = HJ - HB = 225.000 - 180.000 = \text{Rp}45.000" />
                        <BlockMath math="\%U = \frac{45.000}{180.000} \times 100\% = 25\%" />
                      </div>
                      <p className="text-primary font-semibold">Pedagang untung Rp45.000 atau <strong>25%</strong> dari modal.</p>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Menentukan Harga Jual dari Persentase Untung</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang pedagang buah membeli durian seharga Rp240.000 per buah. Ia ingin mendapatkan untung 35% dari modal. Berapa harga jual yang harus ia patok?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Diketahui: <InlineMath math="HB = \text{Rp}240.000" />, untung <InlineMath math="U = 35\%" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="HJ = \frac{100 + 35}{100} \times 240.000 = \frac{135}{100} \times 240.000" />
                        <BlockMath math="HJ = 1{,}35 \times 240.000 = \text{Rp}324.000" />
                      </div>
                      <p className="text-primary font-semibold">Harga jual yang harus dipatok = <strong>Rp324.000</strong></p>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Mencari Harga Beli dari Harga Jual & Persentase Rugi</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah sepeda dijual seharga Rp680.000 dan penjual mengalami kerugian sebesar 15%. Berapakah harga beli sepeda tersebut? Berapa pula rugi dalam rupiah?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Diketahui: <InlineMath math="HJ = \text{Rp}680.000" />, rugi <InlineMath math="R = 15\%" /></p>
                      <p><strong>Langkah 1: Cari Harga Beli</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="HB = \frac{100}{100 - 15} \times 680.000 = \frac{100}{85} \times 680.000" />
                        <BlockMath math="HB = \frac{68.000.000}{85} = \text{Rp}800.000" />
                      </div>
                      <p><strong>Langkah 2: Cari Rugi dalam Rupiah</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Rugi} = HB - HJ = 800.000 - 680.000 = \text{Rp}120.000" />
                      </div>
                      <p className="text-primary font-semibold">Harga beli sepeda = Rp800.000. Kerugian = <strong>Rp120.000</strong>.</p>
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

export default JualBeliUntungRugiPage;
