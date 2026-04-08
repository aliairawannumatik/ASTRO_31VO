import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Receipt, AlertCircle, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PPNPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "kapan", "kesalahan", "contoh", "rangkuman"]);

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
                  Pernah melihat struk belanja yang totalnya sedikit lebih besar dari harga barang? Kemungkinan ada baris bertuliskan "PPN" di sana. <strong className="text-primary">Pajak Pertambahan Nilai (PPN)</strong> adalah pajak yang dikenakan atas konsumsi barang dan jasa — dan kita sebagai konsumen akhirlah yang menanggungnya.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-body text-sm font-semibold text-cyan-300">Tarif PPN di Indonesia (2026):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-slate-900/40 rounded p-2">
                          <p className="font-body text-xs font-bold text-cyan-200">11% — Umum</p>
                          <p className="font-body text-xs text-white/60 leading-relaxed">Untuk sebagian besar barang dan jasa sehari-hari.</p>
                        </div>
                        <div className="bg-slate-900/40 rounded p-2">
                          <p className="font-body text-xs font-bold text-cyan-200">12% — Mewah</p>
                          <p className="font-body text-xs text-white/60 leading-relaxed">Untuk barang/jasa tertentu yang dikategorikan mewah.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-border rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-2">🔑 Alur PPN:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Produsen → Distributor → Pengecer → <strong className="text-primary">Konsumen</strong>. PPN dikumpulkan di setiap tahap, namun pada akhirnya <strong className="text-cyan-300">konsumen akhir</strong> yang menanggung seluruhnya.
                  </p>
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
                      <BlockMath math="\boxed{\text{Besar PPN} = \%\text{PPN} \times \text{Harga Barang (sebelum PPN)}}" />
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Total Harga Bayar (Termasuk PPN):</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\boxed{\text{Total Bayar} = \text{Harga Barang} \times (100\% + \%\text{PPN})}" />
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Mencari Harga Sebelum PPN:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\boxed{\text{Harga Barang} = \frac{\text{Total Bayar}}{(100\% + \%\text{PPN})}}" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Cepat:</strong> PPN 11% → kalikan harga dengan <strong>1,11</strong>. PPN 12% → kalikan dengan <strong>1,12</strong>. Untuk mencari harga asli, bagi dengan angka yang sama.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KAPAN PPN DIKENAKAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kapan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Kapan PPN Dikenakan? (Konteks Soal)</span>
              </div>
              {expandedSections.includes("kapan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kapan") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dalam soal matematika kelas 7, PPN biasanya muncul dalam dua skenario utama:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">Harga belum termasuk PPN</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">Soal menyebutkan "harga sebelum PPN" atau "belum termasuk pajak". Kamu perlu menambahkan PPN untuk mendapat total bayar.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">Harga sudah termasuk PPN</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">Soal memberikan total bayar dan meminta harga asli sebelum PPN. Kamu perlu membagi untuk mendapat harga asli.</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/60 mb-2">Urutan Perhitungan Jika Ada Diskon + PPN:</p>
                  <div className="flex items-center gap-2 text-xs font-body text-white/80 flex-wrap">
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Harga Awal</span>
                    <span className="text-white/40">→</span>
                    <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Kurangi Diskon</span>
                    <span className="text-white/40">→</span>
                    <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Tambah PPN</span>
                    <span className="text-white/40">→</span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">Total Bayar</span>
                  </div>
                  <p className="font-body text-xs text-white/50 mt-2 leading-relaxed">PPN dihitung dari harga SETELAH diskon, bukan dari harga awal.</p>
                </div>
              </div>
            )}
          </div>

          {/* KESALAHAN UMUM */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kesalahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Kesalahan Umum & Tips Penting</span>
              </div>
              {expandedSections.includes("kesalahan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kesalahan") && (
              <div className="px-5 pb-5 space-y-3">
                {[
                  {
                    salah: "Menghitung PPN dari total bayar (yang sudah termasuk PPN), bukan dari harga asli",
                    benar: "PPN = %PPN × Harga Asli (sebelum PPN). Jika total sudah termasuk PPN, cari dulu harga aslinya dengan membagi (1 + %PPN).",
                  },
                  {
                    salah: "Menghitung PPN dari harga awal ketika ada diskon terlebih dahulu",
                    benar: "Urutannya: diskon dulu, baru PPN. PPN dihitung dari harga setelah diskon, bukan dari harga sebelum diskon.",
                  },
                  {
                    salah: "Bingung antara PPN 11% dan 12% dalam soal",
                    benar: "Baca soal dengan cermat. Tarif harus disebutkan eksplisit dalam soal. Jika tidak disebutkan, gunakan 11% untuk barang umum.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 text-xs font-bold shrink-0 mt-0.5">✗ SALAH:</span>
                      <p className="font-body text-xs text-red-300">{item.salah}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 text-xs font-bold shrink-0 mt-0.5">✓ BENAR:</span>
                      <p className="font-body text-xs text-green-300">{item.benar}</p>
                    </div>
                  </div>
                ))}
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
                      <p className="text-xs text-white/60">✦ Harga belum termasuk PPN, jadi tambahkan PPN 11%</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Besar PPN} = 11\% \times 120.000 = \text{Rp}13.200" />
                        <BlockMath math="\text{Total Bayar} = 120.000 + 13.200 = \text{Rp}133.200" />
                      </div>
                      <p className="text-white/60 text-xs">Cara cepat: <InlineMath math="120.000 \times 1{,}11 = \text{Rp}133.200" /></p>
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
                      <p className="text-xs text-white/60">✦ Harga termasuk PPN = 111% dari harga asli. Cari harga aslinya.</p>
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
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                        <p className="text-orange-300 text-xs font-semibold">⚠ Catatan: PPN dihitung dari harga SETELAH diskon (Rp102.000), bukan dari harga awal (Rp120.000)!</p>
                      </div>
                      <p className="text-primary font-semibold">Total yang harus dibayar = <strong>Rp113.220</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("rangkuman")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Rangkuman Materi PPN</span>
              </div>
              {expandedSections.includes("rangkuman") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-border rounded-lg p-4 space-y-3">
                  {[
                    { no: "1", poin: "PPN adalah pajak yang dikenakan atas konsumsi barang/jasa. Konsumen akhir yang menanggungnya." },
                    { no: "2", poin: "Tarif PPN: 11% (umum) atau 12% (mewah) — tergantung jenis barang/jasa." },
                    { no: "3", poin: "Total Bayar = Harga Barang × (100% + %PPN). Harga Asli = Total Bayar ÷ (100% + %PPN)." },
                    { no: "4", poin: "Jika ada diskon: hitung diskon dulu, baru PPN diterapkan pada harga setelah diskon." },
                    { no: "5", poin: "PPN berbeda dari PPh: PPN dikenakan saat membeli, PPh dikenakan dari penghasilan yang diterima." },
                  ].map((item) => (
                    <div key={item.no} className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.no}</span>
                      <p className="font-body text-sm text-white/80">{item.poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-xs text-cyan-200 leading-relaxed">
                    <strong>Koneksi ke Kehidupan Nyata:</strong> Setiap kali kamu membeli makanan di restoran, membeli pakaian di toko resmi, atau berbelanja online di marketplace, PPN sudah termasuk dalam harga yang kamu bayar. Coba cek struk belanjaanmu!
                  </p>
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
