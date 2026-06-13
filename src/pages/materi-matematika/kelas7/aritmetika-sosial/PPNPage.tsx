import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, Receipt, AlertCircle, Star, Zap, RotateCcw,
  CheckCircle, XCircle, Percent, ShoppingCart
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const formatRupiah = (num: number) =>
  "Rp" + Math.round(num).toLocaleString("id-ID");

const PPNPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "kapan", "kalkulator", "kesalahan", "contoh", "rangkuman",
  ]);

  const [harga, setHarga] = useState("");
  const [persen, setPersen] = useState("11");
  const [mode, setMode] = useState<"tambah" | "cari">("tambah");
  const [kalcResult, setKalcResult] = useState<null | { ppn: number; total: number; asli: number }>(null);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hitungPPN = () => {
    const h = parseFloat(harga.replace(/[^0-9.]/g, ""));
    const p = parseFloat(persen) / 100;
    if (!h || !p || isNaN(h) || isNaN(p)) return;
    if (mode === "tambah") {
      const ppn = h * p;
      setKalcResult({ ppn, total: h + ppn, asli: h });
    } else {
      const asli = h / (1 + p);
      const ppn = h - asli;
      setKalcResult({ ppn, total: h, asli });
    }
    playPopSound();
  };

  const resetKalkulator = () => {
    setHarga(""); setKalcResult(null); playPopSound();
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
          Kelas 7 · Aritmetika Sosial · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ─── PENGANTAR ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">PPN: Pajak yang Kamu Bayar Tanpa Sadar</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 items-start">
                  <div className="rounded-xl overflow-hidden border border-border/60 flex flex-col">
                    <img src="/image_ppn_kfc_makan2.png" alt="Makan di KFC - contoh konsumsi yang dikenai PPN" className="w-full object-cover object-center h-80" />
                    <p className="font-body text-[10px] text-white/40 text-center py-1.5 px-2 bg-slate-900/60">
                      Sumber: <a href="https://www.lemon8-app.com/@riskaayunanda913/7560353431749034504?region=id" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60 transition-colors">lemon8-app.com</a>
                    </p>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border/60 bg-white">
                    <img src="/image_ppn_struk3.png" alt="Struk KFC yang menampilkan PPN 10%" className="w-full object-contain h-80" />
                  </div>
                </div>
                <p className="font-body text-[11px] text-white/40 text-center -mt-2">
                  Struk KFC menampilkan baris "P.Rest 10%" — itulah PPN yang kamu bayar tanpa sadar saat makan di restoran.
                </p>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernah melihat struk belanja yang totalnya sedikit lebih besar dari harga barang? Kemungkinan ada baris bertuliskan "PPN" di sana.
                  <strong className="text-primary"> Pajak Pertambahan Nilai (PPN)</strong> adalah pajak yang dikenakan atas konsumsi barang dan jasa —
                  dan kita sebagai <strong className="text-yellow-300">konsumen akhir</strong>lah yang menanggungnya.
                </p>

                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-cyan-300 mb-3">🌟 Analogi Mudah — "Tiket Masuk Belanja"</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bayangkan PPN seperti "tiket masuk" yang kamu bayar setiap kali membeli barang atau jasa.
                    Tiket ini dikumpulkan oleh penjual, lalu diserahkan ke pemerintah. Jadi meski kamu tidak langsung transfer ke pemerintah,
                    kamu tetap yang menanggungnya lewat harga yang kamu bayar.
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-2 w-full">
                      <p className="font-body text-sm font-semibold text-cyan-300">Tarif PPN di Indonesia (2026):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-slate-900/40 rounded-lg p-3">
                          <p className="font-body text-xs font-bold text-cyan-200">11% — Umum</p>
                          <p className="font-body text-xs text-white/60 leading-relaxed mt-1">Makanan restoran, pakaian, elektronik, belanja online, dll.</p>
                        </div>
                        <div className="bg-slate-900/40 rounded-lg p-3">
                          <p className="font-body text-xs font-bold text-cyan-200">12% — Mewah / Tertentu</p>
                          <p className="font-body text-xs text-white/60 leading-relaxed mt-1">Barang/jasa premium yang dikategorikan mewah oleh pemerintah.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-border rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-3">🔑 Alur PPN — Siapa Menanggung?</p>
                  <div className="flex items-center gap-2 text-xs font-body flex-wrap">
                    {["Produsen 🏭", "Distributor 🚚", "Pengecer 🏪", "Konsumen 🧑"].map((item, i, arr) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded ${i === arr.length - 1 ? "bg-primary/20 text-primary font-bold" : "bg-slate-700/60 text-white/60"}`}>{item}</span>
                        {i < arr.length - 1 && <span className="text-white/30">→</span>}
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-white/50 mt-2">PPN dikumpulkan di setiap tahap rantai distribusi, namun <strong className="text-primary">konsumen akhir</strong> yang menanggung seluruhnya.</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-blue-300 mb-2">📍 Contoh Nyata PPN dalam Kehidupan Sehari-hari:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Makan di restoran / fast food",
                      "Belanja di mall / toko resmi",
                      "Beli gadget / elektronik",
                      "Belanja di marketplace online",
                      "Bayar tagihan listrik",
                      "Beli tiket konser / bioskop",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <p className="font-body text-xs text-white/70">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── RUMUS ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Rumus-Rumus PPN</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-green-300">📐 Rumus Utama — Besar PPN:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\boxed{\text{Besar PPN} = \%\text{PPN} \times \text{Harga Asli}}" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "Besar PPN", warna: "text-green-300", arti: "Nominal rupiah pajak yang ditambahkan ke harga asli" },
                      { label: "%PPN", warna: "text-yellow-300", arti: "Tarif pajak dalam desimal, mis. 11% = 0,11 atau 12% = 0,12" },
                      { label: "Harga Asli", warna: "text-blue-300", arti: "Harga barang/jasa sebelum dikenakan PPN (Dasar Pengenaan Pajak)" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
                        <span className={`font-bold font-body text-xs shrink-0 min-w-[70px] ${item.warna}`}>{item.label}</span>
                        <span className="text-xs text-white/70 font-body">{item.arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3">
                    <p className="font-body text-sm font-semibold text-blue-300">💰 Total Bayar (Harga + PPN):</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Total} = \text{Harga} \times (1 + \%\text{PPN})" />
                    </div>
                    <p className="font-body text-xs text-white/50">PPN 11% → kalikan dengan <strong className="text-blue-300">1,11</strong></p>
                    <p className="font-body text-xs text-white/50">PPN 12% → kalikan dengan <strong className="text-blue-300">1,12</strong></p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                    <p className="font-body text-sm font-semibold text-purple-300">🔍 Harga Asli dari Total:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Harga Asli} = \frac{\text{Total}}{1 + \%\text{PPN}}" />
                    </div>
                    <p className="font-body text-xs text-white/50">Total termasuk PPN 11% → bagi dengan <strong className="text-purple-300">1,11</strong></p>
                    <p className="font-body text-xs text-white/50">Total termasuk PPN 12% → bagi dengan <strong className="text-purple-300">1,12</strong></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-xs text-yellow-200 leading-relaxed">
                    💡 <strong>Tips Cepat:</strong> Angka pengali PPN bisa diingat sebagai "1 + tarif". PPN 11% → ×1,11 (tambah). PPN 12% → ×1,12 (tambah).
                    Untuk mencari harga asli, cukup balik: bagi dengan angka yang sama.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ─── KAPAN PPN DIKENAKAN ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kapan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Cara Membaca Soal PPN</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80">Dalam soal, ada dua situasi umum. Kenali kalimat kuncinya:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-green-300">✅ Situasi 1 — Harga Belum Termasuk PPN</p>
                    <div className="space-y-1">
                      {['"belum termasuk pajak"', '"harga sebelum PPN"', '"dikenakan PPN sebesar..."', '"harga + PPN 11%"'].map((k, i) => (
                        <p key={i} className="font-body text-xs text-white/60 bg-slate-800/40 rounded px-2 py-1">{k}</p>
                      ))}
                    </div>
                    <p className="font-body text-xs text-green-200 mt-1">→ <strong>Tambahkan PPN</strong> ke harga untuk dapat total bayar.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-orange-300">🔍 Situasi 2 — Harga Sudah Termasuk PPN</p>
                    <div className="space-y-1">
                      {['"sudah termasuk PPN"', '"harga termasuk pajak"', '"membayar Rp... (termasuk PPN)"', '"total bayar sudah PPN"'].map((k, i) => (
                        <p key={i} className="font-body text-xs text-white/60 bg-slate-800/40 rounded px-2 py-1">{k}</p>
                      ))}
                    </div>
                    <p className="font-body text-xs text-orange-200 mt-1">→ <strong>Bagi dengan (1 + %PPN)</strong> untuk dapat harga asli.</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-3">📋 Urutan Jika Ada Diskon + PPN (Sangat Sering Keluar di Soal!):</p>
                  <div className="flex items-center gap-2 flex-wrap text-xs font-body">
                    {[
                      { label: "Harga Awal", color: "bg-blue-500/20 text-blue-300" },
                      { label: "− Diskon", color: "bg-orange-500/20 text-orange-300" },
                      { label: "= Harga Setelah Diskon", color: "bg-yellow-500/20 text-yellow-300" },
                      { label: "× (1 + %PPN)", color: "bg-cyan-500/20 text-cyan-300" },
                      { label: "= Total Bayar", color: "bg-green-500/20 text-green-300 font-bold" },
                    ].map((item, i, arr) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded ${item.color}`}>{item.label}</span>
                        {i < arr.length - 1 && <span className="text-white/30">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-red-300">⚠️ PPN selalu dihitung dari harga <strong>SETELAH diskon</strong>, bukan dari harga awal!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── KALKULATOR INTERAKTIF ─── */}
          <div className="rounded-xl overflow-hidden shadow-lg shadow-amber-500/10" style={{background: "linear-gradient(135deg, #1a1200 0%, #2a1a00 40%, #1a1200 100%)", border: "2px solid rgba(251,191,36,0.5)"}}>
            <button onClick={() => toggleSection("kalkulator")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer" style={{background: "linear-gradient(90deg, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.07) 100%)"}}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)"}}>
                  <Calculator className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="font-body font-bold text-amber-200 block leading-tight">🧮 Kalkulator PPN Interaktif</span>
                  <span className="font-body text-[10px] text-amber-400/70">Hitung PPN otomatis — dua mode tersedia!</span>
                </div>
                <span className="ml-1 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">COBA!</span>
              </div>
              {true ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
            </button>
            {true && (
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div className="flex gap-2">
                  {([
                    { key: "tambah", label: "➕ Tambah PPN ke Harga" },
                    { key: "cari", label: "🔍 Cari Harga Asli" },
                  ] as const).map((m) => (
                    <button key={m.key} onClick={() => { setMode(m.key); setKalcResult(null); playPopSound(); }}
                      className="flex-1 text-xs font-body font-bold py-2 rounded-lg transition-all"
                      style={mode === m.key
                        ? {background: "rgba(251,191,36,0.25)", border: "1.5px solid rgba(251,191,36,0.8)", color: "#fbbf24"}
                        : {background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.4)"}}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="font-body text-xs text-amber-200/50">
                  {mode === "tambah" ? "Mode ini: masukkan harga asli → hitung PPN dan total bayar." : "Mode ini: masukkan total yang sudah termasuk PPN → hitung harga asli."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 font-semibold">
                      {mode === "tambah" ? "Harga Asli (sebelum PPN)" : "Total Bayar (sudah termasuk PPN)"}
                    </label>
                    <input type="number" value={harga}
                      onChange={(e) => { setHarga(e.target.value); setKalcResult(null); }}
                      placeholder="masukkan nominal Rp"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-colors"
                      style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)"}} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 font-semibold flex items-center gap-1"><Percent className="w-3 h-3" /> Tarif PPN (%)</label>
                    <div className="flex gap-2">
                      {["11", "12"].map((t) => (
                        <button key={t} onClick={() => { setPersen(t); setKalcResult(null); playPopSound(); }}
                          className="flex-1 py-2.5 rounded-lg text-xs font-body font-bold transition-all"
                          style={persen === t
                            ? {background: "rgba(251,191,36,0.25)", border: "1.5px solid rgba(251,191,36,0.8)", color: "#fbbf24"}
                            : {background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.4)"}}>
                          {t}%
                        </button>
                      ))}
                      <input type="number" value={!["11","12"].includes(persen) ? persen : ""}
                        onChange={(e) => { setPersen(e.target.value); setKalcResult(null); }}
                        placeholder="lainnya"
                        className="flex-1 rounded-lg px-2 py-2.5 text-xs text-white font-body focus:outline-none text-center"
                        style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)"}} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={hitungPPN}
                    className="flex-1 font-body font-bold text-sm py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{background: "linear-gradient(90deg, #d97706, #f59e0b)", color: "#1a1200"}}>
                    <Zap className="w-4 h-4" /> Hitung PPN
                  </button>
                  <button onClick={resetKalkulator}
                    className="px-4 rounded-lg font-body text-sm py-3 transition-colors hover:opacity-80"
                    style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.5)"}}>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {kalcResult && (
                  <div className="rounded-xl p-4 space-y-2 animate-slide-up" style={{background: "rgba(251,191,36,0.07)", border: "1.5px solid rgba(251,191,36,0.35)"}}>
                    <p className="font-body text-xs font-bold text-amber-300">✅ Hasil Perhitungan:</p>
                    <div className="space-y-2">
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background: "var(--bg-secondary)"}}>
                        <span className="font-body text-xs text-amber-200/60">Harga Asli (sebelum PPN)</span>
                        <span className="font-body text-sm font-bold text-white">{formatRupiah(kalcResult.asli)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background: "var(--bg-secondary)"}}>
                        <span className="font-body text-xs text-amber-200/60">Besar PPN ({persen}%)</span>
                        <span className="font-body text-sm font-bold text-orange-400">+{formatRupiah(kalcResult.ppn)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background: "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(251,191,36,0.1))", border: "1px solid rgba(251,191,36,0.4)"}}>
                        <span className="font-body text-sm font-bold text-amber-200">Total Bayar</span>
                        <span className="font-body text-lg font-black text-amber-300">{formatRupiah(kalcResult.total)}</span>
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{background: "var(--bg-secondary)", border: "1px dashed rgba(251,191,36,0.2)"}}>
                      <p className="font-body text-xs text-amber-300/60 text-center">
                        {mode === "tambah"
                          ? `Cara hitung: ${formatRupiah(kalcResult.asli)} × ${persen}% = ${formatRupiah(kalcResult.ppn)} (PPN) → Total = ${formatRupiah(kalcResult.total)}`
                          : `Cara hitung: ${formatRupiah(kalcResult.total)} ÷ 1,${persen} = ${formatRupiah(kalcResult.asli)} (harga asli)`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── KESALAHAN UMUM ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kesalahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Kesalahan Umum & Tips Penting</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-3">
                {[
                  {
                    salah: "Menghitung PPN dari total bayar yang sudah termasuk PPN",
                    benar: "PPN = %PPN × Harga Asli (sebelum PPN). Jika total sudah termasuk PPN, cari dulu harga aslinya dengan membagi (1 + %PPN).",
                  },
                  {
                    salah: "Menghitung PPN dari harga awal ketika ada diskon terlebih dahulu",
                    benar: "Urutan wajib: diskon dulu → PPN dari harga setelah diskon. PPN bukan dari harga sebelum diskon!",
                  },
                  {
                    salah: "Lupa menambahkan PPN ke harga asli — hanya melaporkan nilai PPN saja sebagai jawaban",
                    benar: "Total Bayar = Harga Asli + Besar PPN. Jika soal menanya 'total bayar', pastikan harga asli sudah ditambah PPN.",
                  },
                  {
                    salah: "Bingung 11% vs 12% dan asal pakai tanpa membaca soal",
                    benar: "Baca soal cermat. Tarif harus tertulis di soal. 11% untuk barang umum, 12% untuk yang dikategorikan mewah.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-red-300">{item.salah}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-green-300">{item.benar}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── CONTOH SOAL ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal & Pembahasan Lengkap</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1 – Total Bayar dengan PPN</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Sebuah buku elektronik dijual Rp120.000 belum termasuk PPN. Jika PPN yang dikenakan 11%, berapa total yang harus dibayar?</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-green-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">📌 Diketahui: Harga = Rp120.000, PPN = 11%. Harga belum termasuk PPN.</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{PPN} = 11\% \times 120.000 = \text{Rp}13.200" />
                      <BlockMath math="\text{Total} = 120.000 + 13.200 = \text{Rp}133.200" />
                    </div>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">Cara cepat: <InlineMath math="120.000 \times 1{,}11 = \text{Rp}133.200" /></p>
                    <p className="text-primary font-semibold text-xs bg-green-500/10 border border-green-500/20 rounded px-3 py-2">✅ Total yang harus dibayar = <strong>Rp133.200</strong></p>
                  </div>
                </div>

                {/* Contoh 2 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2 – Mencari Harga Sebelum PPN</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Dani membayar Rp555.000 untuk sepatu, termasuk PPN 11%. Berapa harga sepatu sebelum PPN?</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-yellow-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">📌 Total Rp555.000 sudah termasuk PPN. Berarti total = 111% dari harga asli.</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Harga Asli} = \frac{555.000}{1{,}11} = \text{Rp}500.000" />
                    </div>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">Verifikasi: 500.000 × 1,11 = Rp555.000 ✓</p>
                    <p className="text-primary font-semibold text-xs bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2">✅ Harga sebelum PPN = <strong>Rp500.000</strong></p>
                  </div>
                </div>

                {/* Contoh 3 */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3 – Diskon + PPN</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Restoran memberi diskon 15% untuk semua menu, lalu dikenakan PPN 11%. Jika harga awal Rp120.000, berapa total bayar?</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-red-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-3 py-2">⚡ Urutan: diskon dulu → baru PPN dari harga setelah diskon!</p>
                    <p className="font-body text-xs text-white/70"><strong>Langkah 1:</strong> Harga setelah diskon:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="120.000 \times (100\% - 15\%) = 120.000 \times 85\% = \text{Rp}102.000" />
                    </div>
                    <p className="font-body text-xs text-white/70"><strong>Langkah 2:</strong> Total bayar + PPN 11%:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="102.000 \times 1{,}11 = \text{Rp}113.220" />
                    </div>
                    <p className="text-primary font-semibold text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">✅ Total yang harus dibayar = <strong>Rp113.220</strong></p>
                  </div>
                </div>

                {/* Contoh 4 */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 4 – Mencari Tarif PPN</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Siti membeli tas seharga Rp400.000 (harga asli) dan membayar Rp448.000. Berapa persentase PPN yang dibebankan?</p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-purple-400">LANGKAH PENYELESAIAN:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Besar PPN} = 448.000 - 400.000 = \text{Rp}48.000" />
                      <BlockMath math="\%\text{PPN} = \frac{48.000}{400.000} \times 100\% = 12\%" />
                    </div>
                    <p className="text-primary font-semibold text-xs bg-purple-500/10 border border-purple-500/20 rounded px-3 py-2">✅ Tarif PPN yang dibebankan = <strong>12%</strong></p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ─── RANGKUMAN ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("rangkuman")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Rangkuman Materi PPN</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                  {[
                    { no: "1", poin: "PPN = pajak yang dikenakan atas konsumsi barang/jasa. Konsumen akhir yang menanggungnya." },
                    { no: "2", poin: "Tarif: 11% (umum) atau 12% (mewah). Selalu cek soal untuk tarif yang digunakan." },
                    { no: "3", poin: "Total Bayar = Harga Asli × (1 + %PPN). Contoh: ×1,11 untuk PPN 11%." },
                    { no: "4", poin: "Harga Asli dari total termasuk PPN = Total Bayar ÷ (1 + %PPN). Contoh: ÷1,11." },
                    { no: "5", poin: "Jika ada diskon + PPN: hitung diskon dulu, baru PPN dari harga setelah diskon." },
                    { no: "6", poin: "PPN ≠ PPh. PPN dikenakan saat membeli barang/jasa. PPh dikenakan dari penghasilan." },
                  ].map((item) => (
                    <div key={item.no} className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.no}</span>
                      <p className="font-body text-sm text-white/80">{item.poin}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/60 mb-3 text-center">📐 Kartu Rumus Singkat</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Besar PPN", math: "\\%\\text{PPN} \\times \\text{Harga}" },
                      { label: "Total Bayar", math: "\\text{Harga} \\times (1 + \\%\\text{PPN})" },
                      { label: "Harga Asli", math: "\\frac{\\text{Total}}{1 + \\%\\text{PPN}}" },
                      { label: "Tarif PPN", math: "\\frac{\\text{PPN}}{\\text{Harga Asli}} \\times 100\\%" },
                    ].map((r) => (
                      <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                        <p className="font-body text-[10px] text-white/40 mb-1">{r.label}</p>
                        <BlockMath math={r.math} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-xs text-green-200 leading-relaxed">
                    🌍 <strong>Koneksi ke Kehidupan Nyata:</strong> Setiap kali kamu beli makanan di restoran, belanja online, atau beli gadget,
                    PPN sudah termasuk dalam harga yang kamu bayar. Coba cek struk belanjaanmu — ada baris PPN di sana!
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
