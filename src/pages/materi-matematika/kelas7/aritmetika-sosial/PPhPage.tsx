import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, AlertCircle, Star, Zap, RotateCcw,
  CheckCircle, XCircle, Percent, Briefcase, FileText, TrendingUp,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const formatRupiah = (num: number) =>
  "Rp" + Math.round(num).toLocaleString("id-ID");

const PPhPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "cara", "kalkulator", "kesalahan", "contoh", "rangkuman",
  ]);

  const [bruto, setBruto] = useState("");
  const [ptkp, setPtkp] = useState("54000000");
  const [tarifPPh, setTarifPPh] = useState("5");
  const [periode, setPeriode] = useState<"bulan" | "tahun">("bulan");
  const [kalcResult, setKalcResult] = useState<null | {
    bruto: number; ptkp: number; pkp: number; pph: number; bersih: number;
  }>(null);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hitungPPh = () => {
    const b = parseFloat(bruto.replace(/[^0-9.]/g, ""));
    const tk = parseFloat(ptkp.replace(/[^0-9.]/g, ""));
    const t = parseFloat(tarifPPh) / 100;
    if (!b || isNaN(b) || isNaN(tk) || !t || isNaN(t)) return;
    const brutoPerTahun = periode === "bulan" ? b * 12 : b;
    const pkp = Math.max(0, brutoPerTahun - tk);
    const pph = pkp * t;
    const bersih = brutoPerTahun - pph;
    setKalcResult({ bruto: brutoPerTahun, ptkp: tk, pkp, pph, bersih });
    playPopSound();
  };

  const resetKalkulator = () => {
    setBruto(""); setKalcResult(null); playPopSound();
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
          Kelas 7 · Aritmetika Sosial · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ─── PENGANTAR ─── */}
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

                <div className="grid grid-cols-2 gap-3 items-start">
                  <div className="rounded-xl overflow-hidden border border-border/60 flex flex-col">
                    <img
                      src="/image_pph_kantor_pajak.png"
                      alt="Kantor Pelayanan Pajak Pratama - Bangga Bayar Pajak"
                      className="w-full object-cover object-center h-52"
                    />
                    <p className="font-body text-[10px] text-white/40 text-center py-1.5 px-2 bg-slate-900/60">
                      Kantor Pelayanan Pajak Pratama
                    </p>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border/60 flex flex-col">
                    <img
                      src="/image_pph_slip_gaji.png"
                      alt="Contoh Slip Gaji dengan Potongan PPh 21 - Hilton International"
                      className="w-full object-contain h-52 bg-white"
                    />
                    <p className="font-body text-[10px] text-white/40 text-center py-1.5 px-2 bg-slate-900/60">
                      Sumber:{" "}
                      <a href="https://www.pajak.net/payroll.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60 transition-colors">
                        pajak.net/payroll.htm
                      </a>
                    </p>
                  </div>
                </div>
                <p className="font-body text-[11px] text-white/40 text-center -mt-2">
                  Baris "PPh 21 Seluruh Penghasilan" pada slip gaji adalah potongan pajak penghasilan yang dipotong langsung oleh perusahaan.
                </p>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Berbeda dengan PPN yang dikenakan saat kamu <em>membeli</em> sesuatu,{" "}
                  <strong className="text-primary">Pajak Penghasilan (PPh)</strong> dikenakan atas uang yang kamu{" "}
                  <em>dapatkan</em> — baik dari gaji, usaha, atau penghasilan lainnya. Ini adalah kontribusi wajib setiap
                  warga negara yang penghasilannya melampaui batas tertentu.
                </p>

                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-cyan-300 mb-3">🌟 Analogi Mudah — "Berbagi Rezeki"</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bayangkan kamu mendapat uang jajan Rp100.000 dari orang tua. Jika ada kesepakatan bahwa
                    kamu menyisihkan sedikit untuk kas keluarga — itulah gambaran PPh. Negara "meminta bagian kecil"
                    dari penghasilan yang melebihi kebutuhan dasar (PTKP), lalu uang itu digunakan untuk membiayai
                    fasilitas publik seperti jalan, sekolah, dan rumah sakit.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-sm font-semibold text-blue-300 mb-1">Apa itu PTKP?</p>
                        <p className="font-body text-xs text-white/60 leading-relaxed">
                          <strong className="text-blue-200">Penghasilan Tidak Kena Pajak</strong> — batas
                          penghasilan yang sama sekali tidak dikenai pajak. Di bawah PTKP? Bebas pajak sepenuhnya!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-sm font-semibold text-green-300 mb-1">Apa itu PKP?</p>
                        <p className="font-body text-xs text-white/60 leading-relaxed">
                          <strong className="text-green-200">Penghasilan Kena Pajak</strong> = Penghasilan Bruto − PTKP.
                          Inilah dasar perhitungan besar PPh yang harus dibayar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-border rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-3">🔑 Alur PPh — Dari Gaji ke Tangan Pemerintah:</p>
                  <div className="flex items-center gap-2 text-xs font-body flex-wrap">
                    {[
                      { label: "Gaji Bruto 💼", color: "bg-blue-500/20 text-blue-300" },
                      { label: "− PTKP", color: "bg-orange-500/20 text-orange-300" },
                      { label: "= PKP", color: "bg-yellow-500/20 text-yellow-300" },
                      { label: "× %PPh", color: "bg-red-500/20 text-red-300" },
                      { label: "= Besar PPh 🏛️", color: "bg-primary/20 text-primary font-bold" },
                    ].map((item, i, arr) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded ${item.color}`}>{item.label}</span>
                        {i < arr.length - 1 && <span className="text-white/30">→</span>}
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-white/50 mt-2">PPh hanya dihitung dari <strong className="text-primary">PKP (setelah dikurangi PTKP)</strong>, bukan dari gaji keseluruhan.</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-blue-300 mb-2">📍 Siapa yang Dikenai PPh dalam Kehidupan Sehari-hari?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Karyawan / pegawai swasta",
                      "Pegawai negeri (PNS/ASN)",
                      "Wirausahawan / pengusaha",
                      "Dokter, pengacara, notaris",
                      "Artis dan YouTuber",
                      "Pekerja lepas (freelancer)",
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
                <span className="font-body font-semibold text-white">Rumus-Rumus PPh</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-green-300">📐 Langkah 1 — Hitung PKP (Penghasilan Kena Pajak):</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\boxed{PKP = \text{Penghasilan Bruto} - PTKP}" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "Penghasilan Bruto", warna: "text-blue-300", arti: "Gaji/penghasilan kotor sebelum dipotong apapun" },
                      { label: "PTKP", warna: "text-orange-300", arti: "Penghasilan Tidak Kena Pajak — batas bebas pajak (soal SMP biasanya tertulis)" },
                      { label: "PKP", warna: "text-yellow-300", arti: "Penghasilan Kena Pajak — dasar perhitungan PPh. Jika PKP ≤ 0, PPh = Rp0" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
                        <span className={`font-bold font-body text-xs shrink-0 min-w-[110px] ${item.warna}`}>{item.label}</span>
                        <span className="text-xs text-white/70 font-body">{item.arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3">
                    <p className="font-body text-sm font-semibold text-blue-300">💰 Langkah 2 — Besar PPh:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Besar PPh} = \%\text{PPh} \times PKP" />
                    </div>
                    <p className="font-body text-xs text-white/50">PPh 5% dari PKP → kalikan PKP dengan <strong className="text-blue-300">0,05</strong></p>
                    <p className="font-body text-xs text-white/50">PPh 15% dari PKP → kalikan PKP dengan <strong className="text-blue-300">0,15</strong></p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                    <p className="font-body text-sm font-semibold text-purple-300">🏠 Langkah 3 — Gaji Bersih:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Gaji Bersih} = \text{Bruto} - \text{Besar PPh}" />
                    </div>
                    <p className="font-body text-xs text-white/50">Gaji yang benar-benar <strong className="text-purple-300">diterima</strong> karyawan setelah dipotong pajak</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-xs text-yellow-200 leading-relaxed">
                    💡 <strong>Tips Cepat (Dalam Satu Rumus):</strong> Gaji Bersih = Bruto − %PPh × (Bruto − PTKP).
                    Ingat urutan: PKP dulu, lalu PPh, lalu kurangi dari bruto.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-border rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-3">📊 Tarif PPh Pasal 17 (Umum — untuk Pengetahuan):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-xs border-collapse">
                      <thead>
                        <tr className="bg-green-500/20">
                          <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">PKP per Tahun</th>
                          <th className="px-3 py-2 text-green-300 text-center border border-green-500/30">Tarif</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        {[
                          { range: "Rp0 s.d. Rp60.000.000", tarif: "5%", highlight: true },
                          { range: "Rp60.000.001 s.d. Rp250.000.000", tarif: "15%", highlight: false },
                          { range: "Rp250.000.001 s.d. Rp500.000.000", tarif: "25%", highlight: false },
                          { range: "Rp500.000.001 s.d. Rp5.000.000.000", tarif: "30%", highlight: false },
                          { range: "Di atas Rp5.000.000.000", tarif: "35%", highlight: false },
                        ].map((row, i) => (
                          <tr key={i} className={`border border-green-500/20 ${row.highlight ? "bg-green-500/10" : i % 2 === 0 ? "" : "bg-slate-800/30"}`}>
                            <td className="px-3 py-2">{row.range}</td>
                            <td className={`px-3 py-2 text-center font-bold ${row.highlight ? "text-green-300" : "text-white/70"}`}>{row.tarif}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-[10px] text-white/30 mt-2">* Soal SMP biasanya menyebutkan tarif secara langsung. Tabel ini untuk pengetahuan umum.</p>
                </div>

              </div>
            )}
          </div>

          {/* ─── CARA MEMBACA SOAL ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("cara")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Cara Membaca Soal PPh</span>
              </div>
              {expandedSections.includes("cara") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("cara") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80">Dalam soal PPh, ada tiga tipe pertanyaan utama. Kenali kalimat kuncinya:</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-green-300">✅ Tipe 1 — Hitung Besar PPh dan Gaji Bersih</p>
                    <div className="space-y-1">
                      {['"penghasilan bruto ... tarif PPh ... PTKP ... hitung gaji bersih"', '"berapa PPh yang harus dibayar"', '"berapa take home pay"'].map((k, i) => (
                        <p key={i} className="font-body text-xs text-white/60 bg-slate-800/40 rounded px-2 py-1">{k}</p>
                      ))}
                    </div>
                    <p className="font-body text-xs text-green-200 mt-1">→ Hitung PKP = Bruto − PTKP, lalu PPh = %PPh × PKP, lalu Bersih = Bruto − PPh.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-orange-300">🔍 Tipe 2 — Cari Penghasilan Bruto dari Gaji Bersih</p>
                    <div className="space-y-1">
                      {['"menerima gaji bersih/netto Rp... setelah dipotong PPh"', '"take home pay ... berapa gaji bruto"'].map((k, i) => (
                        <p key={i} className="font-body text-xs text-white/60 bg-slate-800/40 rounded px-2 py-1">{k}</p>
                      ))}
                    </div>
                    <p className="font-body text-xs text-orange-200 mt-1">→ Misal Bruto = B. Bentuk persamaan: B − %PPh × (B − PTKP) = Bersih, lalu selesaikan.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-purple-300">💡 Tipe 3 — Cari Tarif PPh</p>
                    <div className="space-y-1">
                      {['"diketahui bruto, PTKP, dan gaji bersih — berapa tarif PPh"'].map((k, i) => (
                        <p key={i} className="font-body text-xs text-white/60 bg-slate-800/40 rounded px-2 py-1">{k}</p>
                      ))}
                    </div>
                    <p className="font-body text-xs text-purple-200 mt-1">→ Hitung PKP = Bruto − PTKP, lalu PPh = Bruto − Bersih, lalu %PPh = PPh ÷ PKP × 100%.</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-3">📋 Urutan Hitung PPh (Wajib Hafal!):</p>
                  <div className="flex items-center gap-2 flex-wrap text-xs font-body">
                    {[
                      { label: "Bruto", color: "bg-blue-500/20 text-blue-300" },
                      { label: "− PTKP", color: "bg-orange-500/20 text-orange-300" },
                      { label: "= PKP", color: "bg-yellow-500/20 text-yellow-300" },
                      { label: "× %PPh", color: "bg-cyan-500/20 text-cyan-300" },
                      { label: "= Besar PPh", color: "bg-red-500/20 text-red-300" },
                      { label: "Bruto − PPh = Bersih", color: "bg-green-500/20 text-green-300 font-bold" },
                    ].map((item, i, arr) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded ${item.color}`}>{item.label}</span>
                        {i < arr.length - 1 && <span className="text-white/30">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-red-300">⚠️ PPh dihitung dari PKP (setelah PTKP dikurangi), <strong>BUKAN</strong> dari gaji bruto langsung!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── KALKULATOR INTERAKTIF ─── */}
          <div className="rounded-xl overflow-hidden shadow-lg shadow-emerald-500/10" style={{ background: "linear-gradient(135deg, #001a0a 0%, #002a12 40%, #001a0a 100%)", border: "2px solid rgba(52,211,153,0.5)" }}>
            <button onClick={() => toggleSection("kalkulator")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer" style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.07) 100%)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)" }}>
                  <Calculator className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="font-body font-bold text-emerald-200 block leading-tight">🧮 Kalkulator PPh Interaktif</span>
                  <span className="font-body text-[10px] text-emerald-400/70">Hitung PPh dan gaji bersih otomatis!</span>
                </div>
                <span className="ml-1 bg-emerald-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">COBA!</span>
              </div>
              {expandedSections.includes("kalkulator") ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
            </button>
            {expandedSections.includes("kalkulator") && (
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div className="flex gap-2">
                  {([
                    { key: "bulan", label: "📅 Input per Bulan" },
                    { key: "tahun", label: "📆 Input per Tahun" },
                  ] as const).map((m) => (
                    <button key={m.key} onClick={() => { setPeriode(m.key); setKalcResult(null); playPopSound(); }}
                      className="flex-1 text-xs font-body font-bold py-2 rounded-lg transition-all"
                      style={periode === m.key
                        ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                        : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="font-body text-xs text-emerald-200/50">
                  {periode === "bulan" ? "Mode ini: masukkan gaji per bulan → perhitungan disetahunkan otomatis (×12)." : "Mode ini: masukkan gaji per tahun langsung."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-body text-xs text-emerald-300/80 font-semibold">
                      Penghasilan Bruto ({periode === "bulan" ? "per bulan" : "per tahun"})
                    </label>
                    <input type="number" value={bruto}
                      onChange={(e) => { setBruto(e.target.value); setKalcResult(null); }}
                      placeholder="masukkan nominal Rp"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-colors"
                      style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-emerald-300/80 font-semibold">PTKP per Tahun (Rp)</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: "54 Jt", val: "54000000" },
                        { label: "63 Jt", val: "63000000" },
                        { label: "67,5 Jt", val: "67500000" },
                      ].map((t) => (
                        <button key={t.val} onClick={() => { setPtkp(t.val); setKalcResult(null); playPopSound(); }}
                          className="flex-1 py-2 rounded-lg text-xs font-body font-bold transition-all"
                          style={ptkp === t.val
                            ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                            : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-body text-xs text-emerald-300/80 font-semibold flex items-center gap-1"><Percent className="w-3 h-3" /> Tarif PPh (%)</label>
                  <div className="flex gap-2">
                    {["5", "15", "25"].map((t) => (
                      <button key={t} onClick={() => { setTarifPPh(t); setKalcResult(null); playPopSound(); }}
                        className="flex-1 py-2.5 rounded-lg text-xs font-body font-bold transition-all"
                        style={tarifPPh === t
                          ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                          : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                        {t}%
                      </button>
                    ))}
                    <input type="number" value={!["5", "15", "25"].includes(tarifPPh) ? tarifPPh : ""}
                      onChange={(e) => { setTarifPPh(e.target.value); setKalcResult(null); }}
                      placeholder="lainnya"
                      className="flex-1 rounded-lg px-2 py-2.5 text-xs text-white font-body focus:outline-none text-center"
                      style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={hitungPPh}
                    className="flex-1 font-body font-bold text-sm py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(90deg, #059669, #10b981)", color: "#001a0a" }}>
                    <Zap className="w-4 h-4" /> Hitung PPh
                  </button>
                  <button onClick={resetKalkulator}
                    className="px-4 rounded-lg font-body text-sm py-3 transition-colors hover:opacity-80"
                    style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.5)" }}>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {kalcResult && (
                  <div className="rounded-xl p-4 space-y-2 animate-slide-up" style={{ background: "rgba(52,211,153,0.07)", border: "1.5px solid rgba(52,211,153,0.35)" }}>
                    <p className="font-body text-xs font-bold text-emerald-300">✅ Hasil Perhitungan (per Tahun):</p>
                    <div className="space-y-2">
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <span className="font-body text-xs text-emerald-200/60">Penghasilan Bruto</span>
                        <span className="font-body text-sm font-bold text-white">{formatRupiah(kalcResult.bruto)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <span className="font-body text-xs text-emerald-200/60">PTKP (dikurangi)</span>
                        <span className="font-body text-sm font-bold text-orange-400">−{formatRupiah(kalcResult.ptkp)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <span className="font-body text-xs text-emerald-200/60">PKP (Penghasilan Kena Pajak)</span>
                        <span className="font-body text-sm font-bold text-yellow-300">{formatRupiah(kalcResult.pkp)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <span className="font-body text-xs text-emerald-200/60">Besar PPh ({tarifPPh}% × PKP)</span>
                        <span className="font-body text-sm font-bold text-red-400">−{formatRupiah(kalcResult.pph)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.2), rgba(52,211,153,0.1))", border: "1px solid rgba(52,211,153,0.4)" }}>
                        <span className="font-body text-sm font-bold text-emerald-200">Penghasilan Bersih / Take Home Pay</span>
                        <span className="font-body text-lg font-black text-emerald-300">{formatRupiah(kalcResult.bersih)}</span>
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(52,211,153,0.2)" }}>
                      <p className="font-body text-xs text-emerald-300/60 text-center">
                        {kalcResult.pkp === 0
                          ? "PKP = 0 → Penghasilan di bawah/sama dengan PTKP → Bebas PPh sepenuhnya!"
                          : `Cara hitung: PKP = ${formatRupiah(kalcResult.bruto)} − ${formatRupiah(kalcResult.ptkp)} = ${formatRupiah(kalcResult.pkp)} → PPh = ${tarifPPh}% × ${formatRupiah(kalcResult.pkp)} = ${formatRupiah(kalcResult.pph)}`}
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
              {expandedSections.includes("kesalahan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kesalahan") && (
              <div className="px-5 pb-5 space-y-3">
                {[
                  {
                    salah: "Menghitung PPh dari penghasilan bruto langsung, tanpa mengurangi PTKP terlebih dahulu",
                    benar: "PPh = %PPh × PKP. PKP = Bruto − PTKP. Wajib kurangi PTKP dulu sebelum menghitung pajak.",
                  },
                  {
                    salah: "Menganggap penghasilan di bawah PTKP tetap kena pajak (walaupun sangat kecil)",
                    benar: "Jika PKP ≤ 0, maka PPh = Rp0. Penghasilan di bawah PTKP sama sekali tidak dikenai pajak.",
                  },
                  {
                    salah: "Mengurangi PTKP dari gaji bersih (netto), bukan dari gaji bruto",
                    benar: "PKP = Gaji Bruto − PTKP. Gaji Bersih = Gaji Bruto − PPh. Urutan ini tidak boleh tertukar.",
                  },
                  {
                    salah: "Bingung membedakan PPh dengan PPN — menggunakan rumus PPN untuk soal PPh",
                    benar: "PPh ≠ PPN. PPh dari penghasilan (ada PTKP). PPN dari pembelian barang/jasa (tanpa PTKP). Baca soalnya cermat.",
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
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1 – Menghitung PPh dan Gaji Bersih</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pak Hendra memiliki penghasilan bruto Rp5.000.000 per bulan. PTKP sebesar Rp3.000.000 per bulan. Tarif PPh 5% dari PKP. Berapa gaji bersih yang diterima Pak Hendra?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-green-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">📌 Diketahui: Bruto = Rp5.000.000, PTKP = Rp3.000.000, tarif PPh = 5%</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="PKP = 5.000.000 - 3.000.000 = \text{Rp}2.000.000" />
                      <BlockMath math="\text{Besar PPh} = 5\% \times 2.000.000 = \text{Rp}100.000" />
                      <BlockMath math="\text{Gaji Bersih} = 5.000.000 - 100.000 = \text{Rp}4.900.000" />
                    </div>
                    <p className="text-primary font-semibold text-xs bg-green-500/10 border border-green-500/20 rounded px-3 py-2">✅ Gaji bersih Pak Hendra = <strong>Rp4.900.000</strong></p>
                  </div>
                </div>

                {/* Contoh 2 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2 – Penghasilan di Bawah PTKP</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Seorang karyawan part-time berpenghasilan Rp2.200.000 per bulan. Jika PTKP adalah Rp2.500.000 per bulan dan tarif PPh 5%, berapa yang harus dibayarkan sebagai pajak?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-yellow-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">📌 Hitung PKP terlebih dahulu</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="PKP = 2.200.000 - 2.500.000 = -300.000" />
                    </div>
                    <p className="font-body text-xs text-white/70">Karena PKP bernilai negatif (penghasilan di bawah PTKP), maka <strong className="text-yellow-300">PKP dianggap Rp0</strong>.</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Besar PPh} = 5\% \times 0 = \text{Rp}0" />
                    </div>
                    <p className="text-primary font-semibold text-xs bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2">✅ Karyawan ini <strong>tidak perlu membayar pajak</strong> karena penghasilannya di bawah PTKP.</p>
                  </div>
                </div>

                {/* Contoh 3 */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3 – Mencari Penghasilan Bruto dari Gaji Bersih</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Bu Kartini menerima gaji bersih Rp4.400.000 setelah dipotong PPh 5%. PTKP yang berlaku adalah Rp2.500.000. Berapakah penghasilan bruto Bu Kartini sebelum dipotong pajak?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-red-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-3 py-2">⚡ Misalkan penghasilan bruto = <InlineMath math="B" /></p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="PKP = B - 2.500.000" />
                      <BlockMath math="\text{PPh} = 5\% \times (B - 2.500.000)" />
                      <BlockMath math="\text{Gaji Bersih} = B - \text{PPh} = 4.400.000" />
                      <BlockMath math="B - 0{,}05(B - 2.500.000) = 4.400.000" />
                      <BlockMath math="B - 0{,}05B + 125.000 = 4.400.000" />
                      <BlockMath math="0{,}95B = 4.275.000" />
                      <BlockMath math="B = \frac{4.275.000}{0{,}95} = \text{Rp}4.500.000" />
                    </div>
                    <p className="text-primary font-semibold text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">✅ Penghasilan bruto Bu Kartini = <strong>Rp4.500.000</strong></p>
                  </div>
                </div>

                {/* Contoh 4 */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 4 – Mencari Tarif PPh</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pak Rudi memiliki penghasilan bruto Rp8.000.000 per bulan dan PTKP Rp3.000.000 per bulan. Setelah dipotong pajak, ia menerima Rp4.750.000. Berapa tarif PPh yang dikenakan?
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-purple-400">LANGKAH PENYELESAIAN:</p>
                    <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">📌 Diketahui: Bruto = Rp8.000.000, PTKP = Rp3.000.000, Bersih = Rp4.750.000</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="PKP = 8.000.000 - 3.000.000 = \text{Rp}5.000.000" />
                      <BlockMath math="\text{Besar PPh} = 8.000.000 - 4.750.000 = \text{Rp}3.250.000" />
                      <BlockMath math="\%\text{PPh} = \frac{3.250.000}{5.000.000} \times 100\% = 65\%" />
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded px-3 py-2">
                      <p className="font-body text-xs text-orange-300">⚠️ Tarif 65% tidak realistis! Cek kembali apakah soal PTKP-nya per bulan atau per tahun, atau ada kesalahan data di soal.</p>
                    </div>
                    <p className="text-primary font-semibold text-xs bg-purple-500/10 border border-purple-500/20 rounded px-3 py-2">✅ Tarif PPh (berdasarkan data soal) = <strong>65%</strong> — ini menunjukkan pentingnya memeriksa kewajaran jawaban!</p>
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
                <span className="font-body font-semibold text-white">Rangkuman Materi PPh</span>
              </div>
              {expandedSections.includes("rangkuman") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                  {[
                    { no: "1", poin: "PPh dikenakan atas penghasilan (gaji/usaha), bukan atas pembelian seperti PPN." },
                    { no: "2", poin: "PKP = Penghasilan Bruto − PTKP. Jika PKP ≤ 0, tidak ada pajak yang dibayar." },
                    { no: "3", poin: "Besar PPh = %PPh × PKP. Gaji Bersih = Gaji Bruto − PPh." },
                    { no: "4", poin: "PTKP melindungi penghasilan rendah dari pajak — semakin tinggi PTKP, semakin sedikit yang wajib bayar pajak." },
                    { no: "5", poin: "Untuk mencari gaji bruto dari gaji bersih: bentuk persamaan aljabar dan selesaikan." },
                    { no: "6", poin: "PPh ≠ PPN. PPh dari penghasilan (ada PTKP & PKP). PPN dari konsumsi barang/jasa (tanpa PTKP)." },
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
                      { label: "PKP", math: "\\text{Bruto} - PTKP" },
                      { label: "Besar PPh", math: "\\%\\text{PPh} \\times PKP" },
                      { label: "Gaji Bersih", math: "\\text{Bruto} - \\text{PPh}" },
                      { label: "Tarif PPh", math: "\\frac{\\text{PPh}}{PKP} \\times 100\\%" },
                    ].map((r) => (
                      <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                        <p className="font-body text-[10px] text-white/40 mb-1">{r.label}</p>
                        <BlockMath math={r.math} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-xs text-blue-200 leading-relaxed">
                    🌍 <strong>Koneksi ke Kehidupan Nyata:</strong> Ketika orang tua atau saudara menerima slip gaji, ada baris "Potongan PPh" yang tertera.
                    Itulah pajak yang langsung dipotong oleh perusahaan sebelum gaji diterima karyawan — disebut sistem{" "}
                    <em>withholding tax</em>. Coba minta slip gaji orang tuamu dan temukan baris PPh di sana!
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

export default PPhPage;
