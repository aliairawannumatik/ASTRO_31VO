import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Briefcase } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PPhPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "cara", "contoh"]);

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
          PAJAK PENGHASILAN (PPh)
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
                <span className="font-body font-semibold text-white">PPh: Pajak dari Penghasilan yang Kamu Terima</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Berbeda dengan PPN yang dikenakan saat kamu <em>membeli</em> sesuatu, <strong className="text-primary">Pajak Penghasilan (PPh)</strong> dikenakan atas uang yang kamu <em>dapatkan</em> — baik dari gaji, usaha, atau penghasilan lainnya. Ini adalah kontribusi wajib setiap warga negara yang penghasilannya melampaui batas tertentu.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-body text-sm font-semibold text-blue-300 mb-2">Konsep Kunci: PTKP (Penghasilan Tidak Kena Pajak)</p>
                      <p className="font-body text-sm text-white/70">
                        Pemerintah menetapkan batas penghasilan yang <strong className="text-blue-200">tidak dikenakan pajak sama sekali</strong>. Penghasilan di bawah PTKP? Bebas pajak! Penghasilan di atas PTKP? Hanya selisihnya yang dikenai pajak.
                      </p>
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
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus PPh</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Langkah 1 — Hitung Penghasilan Kena Pajak (PKP):</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="PKP = \text{Penghasilan Bruto} - PTKP" />
                    </div>
                    <p className="font-body text-xs text-white/60 mt-1">Jika PKP ≤ 0, maka tidak ada pajak yang dibayar.</p>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Langkah 2 — Hitung Besar PPh:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Besar PPh} = \%\text{PPh} \times PKP" />
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Langkah 3 — Hitung Penghasilan Bersih (Netto):</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Penghasilan Bersih} = \text{Penghasilan Bruto} - \text{Besar PPh}" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> PPh dihitung dari <strong>PKP</strong> (setelah dikurangi PTKP), bukan dari penghasilan bruto secara keseluruhan. Ini yang bikin tagihannya lebih kecil dari yang dibayangkan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERBEDAAN PPN vs PPh */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("cara")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">PPN vs PPh — Jangan Tertukar!</span>
              </div>
              {expandedSections.includes("cara") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("cara") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-purple-500/20">
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">Aspek</th>
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">PPN</th>
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">PPh</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-purple-500/20">
                        <td className="px-3 py-2 font-semibold text-white/80">Dikenakan atas</td>
                        <td className="px-3 py-2">Konsumsi barang/jasa</td>
                        <td className="px-3 py-2">Penghasilan yang diterima</td>
                      </tr>
                      <tr className="border border-purple-500/20 bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-white/80">Siapa yang bayar</td>
                        <td className="px-3 py-2">Pembeli/konsumen akhir</td>
                        <td className="px-3 py-2">Penerima penghasilan</td>
                      </tr>
                      <tr className="border border-purple-500/20">
                        <td className="px-3 py-2 font-semibold text-white/80">Tarif umum</td>
                        <td className="px-3 py-2">11% atau 12%</td>
                        <td className="px-3 py-2">Bervariasi (5% ke atas)</td>
                      </tr>
                      <tr className="border border-purple-500/20 bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-white/80">Ada PTKP?</td>
                        <td className="px-3 py-2">Tidak</td>
                        <td className="px-3 py-2">Ya — ada batas bebas pajak</td>
                      </tr>
                    </tbody>
                  </table>
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
                    <span className="font-body font-semibold text-white">Contoh 1 – Menghitung PPh dan Gaji Bersih</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pak Hendra memiliki penghasilan bruto Rp5.000.000 per bulan. PTKP sebesar Rp3.000.000 per bulan. Tarif PPh 5% dari PKP. Berapa gaji bersih yang diterima Pak Hendra?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="PKP = 5.000.000 - 3.000.000 = \text{Rp}2.000.000" />
                        <BlockMath math="\text{Besar PPh} = 5\% \times 2.000.000 = \text{Rp}100.000" />
                        <BlockMath math="\text{Gaji Bersih} = 5.000.000 - 100.000 = \text{Rp}4.900.000" />
                      </div>
                      <p className="text-primary font-semibold">Gaji bersih Pak Hendra = <strong>Rp4.900.000</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Penghasilan di Bawah PTKP</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang karyawan part-time berpenghasilan Rp2.200.000 per bulan. Jika PTKP adalah Rp2.500.000 per bulan dan tarif PPh 5%, berapa yang harus dibayarkan sebagai pajak?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="PKP = 2.200.000 - 2.500.000 = -300.000" />
                      </div>
                      <p>Karena PKP bernilai negatif (penghasilan di bawah PTKP), maka <strong className="text-yellow-300">PKP dianggap Rp0</strong>.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Besar PPh} = 5\% \times 0 = \text{Rp}0" />
                      </div>
                      <p className="text-primary font-semibold">Karyawan ini <strong>tidak perlu membayar pajak</strong> karena penghasilannya di bawah PTKP.</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Mencari Penghasilan Bruto dari Gaji Bersih</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Bu Kartini menerima gaji bersih Rp4.400.000 setelah dipotong PPh 5%. PTKP yang berlaku adalah Rp2.500.000. Berapakah penghasilan bruto Bu Kartini sebelum dipotong pajak?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Misalkan penghasilan bruto = <InlineMath math="B" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="PKP = B - 2.500.000" />
                        <BlockMath math="\text{PPh} = 5\% \times (B - 2.500.000)" />
                        <BlockMath math="\text{Gaji Bersih} = B - \text{PPh} = 4.400.000" />
                        <BlockMath math="B - 0{,}05(B - 2.500.000) = 4.400.000" />
                        <BlockMath math="B - 0{,}05B + 125.000 = 4.400.000" />
                        <BlockMath math="0{,}95B = 4.275.000" />
                        <BlockMath math="B = \frac{4.275.000}{0{,}95} = \text{Rp}4.500.000" />
                      </div>
                      <p className="text-primary font-semibold">Penghasilan bruto Bu Kartini = <strong>Rp4.500.000</strong></p>
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

export default PPhPage;
