import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Package } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BrutoNettoTaraPage = () => {
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
          BRUTO, NETTO DAN TARA
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
                <span className="font-body font-semibold text-white">Berat Kotor vs Berat Bersih — Apa Bedanya?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu memperhatikan label pada produk makanan? Di sana biasanya tertulis "Berat Bersih: 500g". Angka itu adalah <strong className="text-primary">netto</strong> — berat isinya saja tanpa kemasan. Konsep ini sangat penting dalam perdagangan agar pembeli tahu persis berapa yang mereka dapatkan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-orange-400" />
                      <p className="font-body text-sm font-bold text-orange-300">BRUTO</p>
                    </div>
                    <p className="font-body text-xs text-white/60">Berat kotor = isi + kemasan. Ini yang ditimbang saat pertama kali ditimbang.</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-green-400" />
                      <p className="font-body text-sm font-bold text-green-300">NETTO</p>
                    </div>
                    <p className="font-body text-xs text-white/60">Berat bersih = isi saja. Inilah yang benar-benar kamu beli/konsumsi.</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-400" />
                      <p className="font-body text-sm font-bold text-blue-300">TARA</p>
                    </div>
                    <p className="font-body text-xs text-white/60">Berat kemasan = kardus, botol, karung, dll. yang membungkus isi.</p>
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus Bruto, Netto, Tara</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Hubungan Dasar (Rumus Utama):</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\text{Bruto} = \text{Netto} + \text{Tara}" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">Mencari Netto:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\text{Netto} = \text{Bruto} - \text{Tara}" />
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-blue-300 mb-2">Mencari Tara:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\text{Tara} = \text{Bruto} - \text{Netto}" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Analogi Mudah:</strong> Bruto = sekarung beras (40 kg). Tara = karungnya (2 kg). Netto = berasnya saja (38 kg). Selalu berlaku: <strong>Bruto = Netto + Tara</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERSENTASE TARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("persen")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Tara dalam Persentase (%)</span>
              </div>
              {expandedSections.includes("persen") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("persen") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dalam perdagangan besar (grosir), tara sering dinyatakan sebagai <strong className="text-cyan-300">persentase dari Bruto</strong>, bukan dalam satuan berat langsung. Ini memudahkan penghitungan untuk berbagai ukuran kemasan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">Nilai Tara dari % Tara:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\text{Tara} = \%\text{Tara} \times \text{Bruto}" />
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">% Tara dari nilai Tara & Bruto:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\%\text{Tara} = \frac{\text{Tara}}{\text{Bruto}} \times 100\%" />
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

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Mencari Netto</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah toples kue memiliki bruto 750 gram. Jika berat toplesnya (tara) adalah 150 gram, berapakah netto kue di dalamnya?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Netto} = \text{Bruto} - \text{Tara} = 750 - 150 = 600 \text{ gram}" />
                      </div>
                      <p className="text-primary font-semibold">Berat bersih kue = <strong>600 gram</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Tara dalam Persentase</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang pedagang membeli 1 peti jeruk dengan bruto 25 kg. Peti tersebut memiliki tara 8%. Berapa kg netto jeruk yang didapat pedagang tersebut?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung nilai Tara:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Tara} = 8\% \times 25 = \frac{8}{100} \times 25 = 2 \text{ kg}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung Netto:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Netto} = \text{Bruto} - \text{Tara} = 25 - 2 = 23 \text{ kg}" />
                      </div>
                      <p className="text-primary font-semibold">Netto jeruk = <strong>23 kg</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Gabungan Bruto, Netto, Tara & Jual Beli</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang pedagang membeli 5 karung kopi dengan bruto masing-masing 20 kg dan tara 4%. Harga beli per kg netto adalah Rp80.000. Jika ia menjual seluruh kopi seharga Rp85.000 per kg netto, berapa total keuntungannya?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tara per karung:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Tara} = 4\% \times 20 = 0{,}8 \text{ kg/karung}" />
                        <BlockMath math="\text{Netto/karung} = 20 - 0{,}8 = 19{,}2 \text{ kg}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Total netto (5 karung):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Total Netto} = 5 \times 19{,}2 = 96 \text{ kg}" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung modal dan pemasukan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Modal} = 96 \times 80.000 = \text{Rp}7.680.000" />
                        <BlockMath math="\text{Pemasukan} = 96 \times 85.000 = \text{Rp}8.160.000" />
                        <BlockMath math="\text{Untung} = 8.160.000 - 7.680.000 = \text{Rp}480.000" />
                      </div>
                      <p className="text-primary font-semibold">Total keuntungan = <strong>Rp480.000</strong></p>
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

export default BrutoNettoTaraPage;
