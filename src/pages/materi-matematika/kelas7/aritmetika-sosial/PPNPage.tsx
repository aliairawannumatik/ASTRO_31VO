import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Receipt } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PPNPage = () => {
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
          PAJAK PERTAMBAHAN NILAI (PPN)
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
                <span className="font-body font-semibold text-white">PPN: Pajak yang Kamu Bayar Tanpa Sadar</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernah melihat nota belanja yang totalnya sedikit lebih besar dari harga barang? Kemungkinan besar ada baris bertuliskan "PPN" di sana. <strong className="text-primary">Pajak Pertambahan Nilai (PPN)</strong> adalah pajak yang dikenakan atas konsumsi barang dan jasa — dan kita sebagai konsumen akhirlah yang menanggungnya.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-body text-sm font-semibold text-cyan-300 mb-1">Tarif PPN di Indonesia (2026):</p>
                      <p className="font-body text-sm text-white/70"><strong className="text-cyan-200">11%</strong> untuk barang/jasa umum (non-mewah)</p>
                      <p className="font-body text-sm text-white/70"><strong className="text-cyan-200">12%</strong> untuk barang/jasa mewah</p>
                    </div>
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus PPN</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Besar PPN:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Besar PPN} = \%\text{PPN} \times \text{Harga Barang (sebelum PPN)}" />
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Total Harga Bayar (Termasuk PPN):</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Total Bayar} = \text{Harga Barang} \times (100\% + \%\text{PPN})" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Cepat:</strong> Untuk PPN 11%, kalikan harga barang dengan <strong>1,11</strong>. Untuk PPN 12%, kalikan dengan <strong>1,12</strong>. Mudah!
                  </p>
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
                    <span className="font-body font-semibold text-white">Contoh 1 – Menghitung Total Bayar dengan PPN</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah buku elektronik dijual seharga Rp120.000 belum termasuk PPN. Jika PPN yang dikenakan adalah 11%, berapa total yang harus dibayar?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Besar PPN} = 11\% \times 120.000 = \text{Rp}13.200" />
                        <BlockMath math="\text{Total Bayar} = 120.000 + 13.200 = \text{Rp}133.200" />
                      </div>
                      <p className="text-white/60 text-xs">Atau cara cepat: <InlineMath math="120.000 \times 1{,}11 = \text{Rp}133.200" /></p>
                      <p className="text-primary font-semibold">Total yang harus dibayar = <strong>Rp133.200</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Mencari Harga Sebelum PPN</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dani membayar Rp555.000 untuk sebuah sepatu, termasuk PPN 11%. Berapa harga sepatu sebelum PPN?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Harga termasuk PPN = 111% dari harga asli.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="111\% \times \text{Harga Asli} = 555.000" />
                        <BlockMath math="\text{Harga Asli} = \frac{555.000}{1{,}11} = \text{Rp}500.000" />
                      </div>
                      <p className="text-primary font-semibold">Harga sepatu sebelum PPN = <strong>Rp500.000</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – PPN Setelah Diskon</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah restoran menawarkan diskon 15% untuk semua menu. Setelah diskon, harga dikenakan PPN 11%. Jika harga awal makanan yang dipesan Rp120.000, berapa total yang harus dibayar?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung harga setelah diskon 15%:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Harga Setelah Diskon} = 85\% \times 120.000 = \text{Rp}102.000" />
                      </div>
                      <p><strong>Langkah 2:</strong> Kenakan PPN 11% pada harga setelah diskon:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Total Bayar} = 102.000 \times 1{,}11 = \text{Rp}113.220" />
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="text-white/60 text-xs">Catatan: PPN dihitung dari harga <em>setelah</em> diskon, bukan dari harga asli!</p>
                      </div>
                      <p className="text-primary font-semibold">Total yang harus dibayar = <strong>Rp113.220</strong></p>
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

export default PPNPage;
