import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, DollarSign, AlertCircle, Star, TrendingUp, Zap,
  CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Clock, Percent
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const formatRupiah = (num: number) =>
  "Rp" + Math.round(num).toLocaleString("id-ID");

const quizData = [
  {
    soal: "Budi menabung Rp1.000.000 dengan bunga tunggal 10% per tahun selama 3 tahun. Berapa total tabungannya?",
    pilihan: ["Rp1.100.000", "Rp1.300.000", "Rp1.310.000", "Rp1.030.000"],
    jawaban: 1,
    pembahasan: "B = 1.000.000 × 3 × 0,10 = 300.000. Total = 1.000.000 + 300.000 = Rp1.300.000",
  },
  {
    soal: "Pinjaman Rp6.000.000 dikenakan bunga tunggal 12% per tahun. Berapakah bunga yang harus dibayar setelah 6 bulan?",
    pilihan: ["Rp720.000", "Rp360.000", "Rp432.000", "Rp180.000"],
    jawaban: 1,
    pembahasan: "W = 6/12 = 0,5 tahun. B = 6.000.000 × 0,5 × 0,12 = Rp360.000",
  },
  {
    soal: "Setelah 2 tahun dengan bunga 5% per tahun, total tabungan menjadi Rp2.200.000. Berapakah modal awalnya?",
    pilihan: ["Rp1.900.000", "Rp2.000.000", "Rp2.100.000", "Rp1.800.000"],
    jawaban: 1,
    pembahasan: "M = 2.200.000 ÷ (1 + 2 × 0,05) = 2.200.000 ÷ 1,1 = Rp2.000.000",
  },
  {
    soal: "Bunga tunggal berbeda dari bunga majemuk karena...",
    pilihan: [
      "Bunga tunggal dihitung dari bunga sebelumnya",
      "Bunga tunggal selalu lebih besar",
      "Bunga tunggal dihitung dari modal awal yang tetap",
      "Bunga tunggal tidak ada rumusnya",
    ],
    jawaban: 2,
    pembahasan: "Ciri khas bunga tunggal: setiap periode, bunga dihitung dari modal AWAL yang selalu sama, bukan dari total saldo.",
  },
];

const BungaTunggalPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "satuan", "kalkulator", "visual", "kesalahan", "contoh", "quiz", "rangkuman",
  ]);

  const [modal, setModal] = useState("");
  const [bunga, setBunga] = useState("");
  const [waktu, setWaktu] = useState("");
  const [satuanWaktu, setSatuanWaktu] = useState<"tahun" | "bulan">("tahun");
  const [kalcResult, setKalcResult] = useState<null | { bungaRp: number; totalRp: number; waktuTahun: number }>(null);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPilihan, setQuizPilihan] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelesai, setQuizSelesai] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hitungBunga = () => {
    const m = parseFloat(modal.replace(/[^0-9.]/g, ""));
    const p = parseFloat(bunga) / 100;
    const w = parseFloat(waktu);
    if (!m || !p || !w || isNaN(m) || isNaN(p) || isNaN(w)) return;
    const wTahun = satuanWaktu === "bulan" ? w / 12 : w;
    const b = m * wTahun * p;
    setKalcResult({ bungaRp: b, totalRp: m + b, waktuTahun: wTahun });
    playPopSound();
  };

  const resetKalkulator = () => {
    setModal(""); setBunga(""); setWaktu(""); setKalcResult(null);
    playPopSound();
  };

  const handlePilih = (i: number) => {
    if (!quizSubmitted) { setQuizPilihan(i); playPopSound(); }
  };

  const handleSubmitQuiz = () => {
    if (quizPilihan === null) return;
    const benar = quizPilihan === quizData[quizIndex].jawaban;
    setQuizSubmitted(true);
    if (benar) setQuizScore((s) => s + 1);
    setQuizAnswers((prev) => [...prev, benar]);
    playPopSound();
  };

  const handleNextQuiz = () => {
    if (quizIndex + 1 >= quizData.length) {
      setQuizSelesai(true);
    } else {
      setQuizIndex((i) => i + 1);
      setQuizPilihan(null);
      setQuizSubmitted(false);
    }
    playPopSound();
  };

  const resetQuiz = () => {
    setQuizIndex(0); setQuizPilihan(null); setQuizSubmitted(false);
    setQuizScore(0); setQuizSelesai(false); setQuizAnswers([]);
    playPopSound();
  };

  const modalNum = parseFloat(modal.replace(/[^0-9.]/g, "")) || 0;
  const bungaNum = parseFloat(bunga) / 100 || 0;
  const timelineYears = [0, 1, 2, 3, 4, 5];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BUNGA TUNGGAL
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
                <span className="font-body font-semibold text-white">Apa Itu Bunga Tunggal?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="rounded-xl overflow-hidden border border-border/60">
                  <img
                    src="/image_bunga_tunggal_menabung.png"
                    alt="Anak-anak menabung di bank"
                    className="w-full object-cover max-h-64"
                  />
                  <p className="font-body text-[11px] text-white/40 text-center py-2 px-3 bg-slate-900/60">
                    Menabung sejak dini menghasilkan bunga sebagai imbalan dari bank.
                  </p>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu menaruh uang di celengan babi — uang itu tidak bertambah. Tapi ketika kamu
                  <strong className="text-yellow-300"> menabung di bank</strong>, bank memberikan "hadiah" bernama <strong className="text-primary">bunga</strong>.
                  Bunga tunggal adalah jenis bunga paling sederhana: dihitung hanya dari <strong className="text-yellow-300">modal awal</strong> yang tidak berubah setiap periodenya.
                </p>

                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-cyan-300 mb-3">🌟 Analogi Mudah — "Sewa Uang"</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bunga itu seperti <em>biaya sewa</em> uang. Ketika kamu <strong>meminjam</strong> uang dari bank, kamu "menyewa"
                    uang itu dan membayar biaya sewa (bunga). Ketika kamu <strong>menabung</strong>, kamulah yang
                    "menyewakan" uang ke bank, dan banklah yang membayar sewa ke kamu.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <DollarSign className="w-5 h-5 text-green-400 mb-2" />
                    <p className="font-body text-sm font-semibold text-green-300 mb-1">Jika Menabung 🏦</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">
                      Bunga = tambahan uang dari bank. Kamu diuntungkan — uangmu tumbuh setiap periode tanpa kamu lakukan apa-apa.
                    </p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <DollarSign className="w-5 h-5 text-red-400 mb-2" />
                    <p className="font-body text-sm font-semibold text-red-300 mb-1">Jika Meminjam 💸</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">
                      Bunga = biaya tambahan yang harus dibayar. Makin lama kamu pinjam, makin besar total yang harus dikembalikan.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-border rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-2">🔑 Ciri Khas Bunga Tunggal:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Setiap periode, bunga dihitung dari <strong className="text-yellow-300">modal awal yang sama</strong>. Tidak ada "bunga berbunga" —
                    itulah yang membedakannya dari bunga majemuk yang lebih kompleks.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-blue-300 mb-2">📍 Di mana Bunga Tunggal Dipakai?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Tabungan bank jangka pendek", "Koperasi simpan pinjam", "Kredit motor/barang", "Pinjaman informal/keluarga"].map((item, i) => (
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
                <span className="font-body font-semibold text-white">Rumus-Rumus Bunga Tunggal</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-green-300">📐 Rumus Utama — Besar Bunga:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\boxed{B = M \times W \times P}" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { var: "B", warna: "text-green-300", arti: "Besar bunga (Rupiah yang diperoleh atau dibayar)" },
                      { var: "M", warna: "text-yellow-300", arti: "Modal awal / pokok tabungan atau pinjaman" },
                      { var: "W", warna: "text-blue-300", arti: "Waktu (harus dalam satuan yang sama dengan periode bunga)" },
                      { var: "P", warna: "text-purple-300", arti: "Persentase bunga per periode (dalam desimal, mis. 6% = 0,06)" },
                    ].map((item) => (
                      <div key={item.var} className="flex items-start gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
                        <span className={`font-bold font-body text-sm w-5 shrink-0 ${item.warna}`}>{item.var}</span>
                        <span className="text-xs text-white/70 font-body">{item.arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">💰 Modal Akhir (Total setelah periode W):</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\boxed{M_1 = M + B = M \times (1 + W \times P)}" />
                  </div>
                  <p className="font-body text-xs text-white/60"><InlineMath math="M_1" /> = modal awal + bunga yang terkumpul</p>
                </div>

                <p className="font-body text-sm text-white/60 font-semibold">🔄 Rumus Turunan (Mencari Variabel Lain):</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { judul: "Mencari M (Modal Awal)", warna: "purple", math: "M = \\frac{M_1}{1 + W \\times P}" },
                    { judul: "Mencari W (Waktu)", warna: "orange", math: "W = \\frac{B}{M \\times P}" },
                    { judul: "Mencari P (Suku Bunga)", warna: "pink", math: "P = \\frac{B}{M \\times W}" },
                  ].map((item) => (
                    <div key={item.judul} className={`bg-${item.warna}-500/10 border border-${item.warna}-500/30 rounded-lg p-3`}>
                      <p className={`font-body text-xs font-semibold text-${item.warna}-300 mb-2`}>{item.judul}</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <BlockMath math={item.math} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-xs text-yellow-200 leading-relaxed">
                    <strong>💡 Tips Hafalan:</strong> Ingat saja <InlineMath math="B = M \times W \times P" /> (Modal × Waktu × Persen).
                    Dari situ, semua variabel lain bisa dicari dengan aljabar sederhana!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ─── SATUAN WAKTU ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("satuan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Kunci Sukses: Konsistensi Satuan Waktu</span>
              </div>
              {expandedSections.includes("satuan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("satuan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-red-300 font-semibold">⚠️ Ini adalah jebakan paling umum dalam soal bunga tunggal!</p>
                  <p className="font-body text-xs text-white/70 mt-1">
                    Satuan waktu <InlineMath math="W" /> harus selalu sesuai dengan periode bunga <InlineMath math="P" />.
                    Jika bunga dinyatakan per tahun, <InlineMath math="W" /> harus dalam tahun.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-orange-500/20">
                        <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30 text-xs">Bunga Per...</th>
                        <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30 text-xs">Satuan W</th>
                        <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30 text-xs">Konversi Jika Perlu</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      {[
                        ["Tahun", "Tahun", "Jika W diberikan dalam bulan → ÷ 12. Hari → ÷ 365"],
                        ["Bulan", "Bulan", "Jika W diberikan dalam tahun → × 12. Hari → ÷ 30"],
                        ["Hari", "Hari", "Jika W diberikan dalam tahun → × 365. Bulan → × 30"],
                      ].map(([per, satuan, konv], i) => (
                        <tr key={i} className={`border border-orange-500/20 ${i % 2 !== 0 ? "bg-slate-800/30" : ""}`}>
                          <td className="px-3 py-2 text-xs">{per}</td>
                          <td className="px-3 py-2 text-xs font-bold text-orange-300">{satuan}</td>
                          <td className="px-3 py-2 text-xs">{konv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-xs font-semibold text-yellow-300">📝 Contoh Konversi:</p>
                  <div className="space-y-1 font-body text-xs text-white/70">
                    <p>Bunga <strong className="text-white">12% per tahun</strong> selama <strong className="text-white">9 bulan</strong> →
                      <InlineMath math=" W = \frac{9}{12} = 0{,}75 \text{ tahun}" /></p>
                    <p>Bunga <strong className="text-white">2% per bulan</strong> selama <strong className="text-white">1,5 tahun</strong> →
                      <InlineMath math=" W = 1{,}5 \times 12 = 18 \text{ bulan}" /></p>
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
                  <span className="font-body font-bold text-amber-200 block leading-tight">🧮 Kalkulator Bunga Tunggal</span>
                  <span className="font-body text-[10px] text-amber-400/70">Interaktif — Masukkan nilai, hitung otomatis!</span>
                </div>
                <span className="ml-1 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">COBA!</span>
              </div>
              {expandedSections.includes("kalkulator") ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
            </button>
            {expandedSections.includes("kalkulator") && (
              <div className="px-5 pb-5 space-y-4 pt-2">
                <p className="font-body text-xs text-amber-200/60">Isi kolom di bawah ini, lalu tekan tombol hitung untuk mendapat hasil secara langsung.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 flex items-center gap-1 font-semibold">
                      <DollarSign className="w-3 h-3" /> Modal Awal (Rp)
                    </label>
                    <input
                      type="number"
                      value={modal}
                      onChange={(e) => { setModal(e.target.value); setKalcResult(null); }}
                      placeholder="contoh: 2000000"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-colors"
                      style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)"}}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 flex items-center gap-1 font-semibold">
                      <Percent className="w-3 h-3" /> Bunga (% per tahun/bulan)
                    </label>
                    <input
                      type="number"
                      value={bunga}
                      onChange={(e) => { setBunga(e.target.value); setKalcResult(null); }}
                      placeholder="contoh: 6"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-colors"
                      style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)"}}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" /> Waktu (angka saja)
                    </label>
                    <input
                      type="number"
                      value={waktu}
                      onChange={(e) => { setWaktu(e.target.value); setKalcResult(null); }}
                      placeholder="contoh: 2"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-colors"
                      style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)"}}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 font-semibold">Satuan Waktu</label>
                    <div className="flex gap-2">
                      {(["tahun", "bulan"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSatuanWaktu(s); setKalcResult(null); playPopSound(); }}
                          className="flex-1 py-2.5 rounded-lg text-xs font-body font-bold transition-all"
                          style={satuanWaktu === s
                            ? {background: "rgba(251,191,36,0.25)", border: "1.5px solid rgba(251,191,36,0.8)", color: "#fbbf24"}
                            : {background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.4)"}}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={hitungBunga}
                    className="flex-1 font-body font-bold text-sm py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{background: "linear-gradient(90deg, #d97706, #f59e0b)", color: "#1a1200"}}
                  >
                    <Zap className="w-4 h-4" /> Hitung Sekarang
                  </button>
                  <button
                    onClick={resetKalkulator}
                    className="px-4 rounded-lg font-body text-sm py-3 transition-colors hover:opacity-80"
                    style={{background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.5)"}}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {kalcResult && (
                  <div className="rounded-xl p-4 space-y-3 animate-slide-up" style={{background: "rgba(251,191,36,0.07)", border: "1.5px solid rgba(251,191,36,0.35)"}}>
                    <p className="font-body text-xs font-bold text-amber-300">✅ Hasil Perhitungan:</p>
                    <div className="space-y-2">
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background: "rgba(0,0,0,0.3)"}}>
                        <span className="font-body text-xs text-amber-200/60">Modal Awal</span>
                        <span className="font-body text-sm font-bold text-white">{formatRupiah(parseFloat(modal.replace(/[^0-9.]/g, "")) || 0)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background: "rgba(0,0,0,0.3)"}}>
                        <span className="font-body text-xs text-amber-200/60">Bunga yang Diperoleh</span>
                        <span className="font-body text-sm font-bold text-green-400">+{formatRupiah(kalcResult.bungaRp)}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background: "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(251,191,36,0.1))", border: "1px solid rgba(251,191,36,0.4)"}}>
                        <span className="font-body text-sm font-bold text-amber-200">Total Akhir</span>
                        <span className="font-body text-lg font-black text-amber-300">{formatRupiah(kalcResult.totalRp)}</span>
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(251,191,36,0.2)"}}>
                      <p className="font-body text-xs text-amber-300/60 text-center">
                        Cara hitung: B = {formatRupiah(parseFloat(modal.replace(/[^0-9.]/g, "")) || 0)} × {kalcResult.waktuTahun} × {(bungaNum).toFixed(2)} = {formatRupiah(kalcResult.bungaRp)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── VISUALISASI PERTUMBUHAN ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("visual")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Visualisasi Pertumbuhan Uang</span>
              </div>
              {expandedSections.includes("visual") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("visual") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-xs text-white/60">
                  Ilustrasi di bawah ini menunjukkan bagaimana uang <strong className="text-white">Rp1.000.000</strong> dengan bunga tunggal <strong className="text-white">20% per tahun</strong> tumbuh selama 5 tahun.
                </p>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-end gap-2 h-40 justify-around">
                    {timelineYears.map((y) => {
                      const nilai = 1000000 * (1 + y * 0.2);
                      const persen = (nilai / (1000000 * (1 + 5 * 0.2))) * 100;
                      return (
                        <div key={y} className="flex flex-col items-center gap-1 flex-1">
                          <span className="font-body text-[10px] text-green-300 font-bold">
                            {(nilai / 1000000).toFixed(1)}jt
                          </span>
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-green-600 to-green-400 transition-all"
                            style={{ height: `${persen}%`, minHeight: "8px" }}
                          />
                          <span className="font-body text-[10px] text-white/50">Th-{y}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="font-body text-[10px] text-white/40 text-center mt-2">Modal Awal Rp1.000.000 · Bunga 20%/tahun</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full font-body text-xs border-collapse">
                    <thead>
                      <tr className="bg-green-500/20">
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/20">Tahun ke-</th>
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/20">Bunga per Tahun</th>
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/20">Total Bunga</th>
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/20">Total Uang</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      {[1, 2, 3, 4, 5].map((y) => (
                        <tr key={y} className={`border border-green-500/10 ${y % 2 === 0 ? "bg-slate-800/30" : ""}`}>
                          <td className="px-3 py-2 font-bold text-white">{y}</td>
                          <td className="px-3 py-2 text-green-300">Rp200.000</td>
                          <td className="px-3 py-2 text-green-300">Rp{(y * 200000).toLocaleString("id-ID")}</td>
                          <td className="px-3 py-2 font-bold text-white">Rp{(1000000 + y * 200000).toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    💡 <strong>Perhatikan:</strong> Bunga per tahun selalu sama (Rp200.000) karena dihitung dari modal awal yang tetap.
                    Inilah yang membedakan bunga tunggal — pertumbuhannya <em>linear</em> (garis lurus), bukan eksponensial.
                  </p>
                </div>
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
                    salah: "Tidak mengonversi satuan waktu — langsung pakai angka 9 padahal bunga per tahun dan W = 9 bulan",
                    benar: "Konversi dulu: W = 9 ÷ 12 = 0,75 tahun. Selalu samakan satuan W dengan periode P.",
                  },
                  {
                    salah: "Menghitung bunga dari total saldo (modal + bunga sebelumnya) seperti bunga majemuk",
                    benar: "Bunga tunggal: setiap periode bunga dihitung dari modal AWAL yang tetap, bukan dari total saldo.",
                  },
                  {
                    salah: "Lupa menambahkan bunga ke modal saat mencari modal akhir — hanya melaporkan nilai B saja",
                    benar: "Modal Akhir = Modal Awal + Bunga. Jangan lupa menjumlahkan keduanya.",
                  },
                  {
                    salah: "Memasukkan P sebagai angka persen (mis. 6) bukan desimal (0,06) ke dalam rumus",
                    benar: "Konversi persen ke desimal: P = 6% = 6/100 = 0,06 sebelum dikalikan.",
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
                    <span className="font-body font-semibold text-white text-sm">Contoh 1 – Menghitung Bunga & Modal Akhir</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rafa menabung Rp2.000.000 di bank dengan bunga tunggal 6% per tahun. Berapa besar bunga yang diperoleh dan berapa total tabungannya setelah 2 tahun?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">LANGKAH PENYELESAIAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">
                        📌 Diketahui: <InlineMath math="M = \text{Rp}2.000.000" />, <InlineMath math="P = 6\% = 0{,}06" />, <InlineMath math="W = 2 \text{ tahun}" />
                      </p>
                      <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">
                        📌 Ditanya: Besar bunga (B) dan modal akhir (<InlineMath math="M_1" />)
                      </p>
                      <div className="bg-slate-900/60 rounded-lg p-3">
                        <BlockMath math="B = M \times W \times P = 2.000.000 \times 2 \times 0{,}06 = \text{Rp}240.000" />
                        <BlockMath math="M_1 = M + B = 2.000.000 + 240.000 = \text{Rp}2.240.000" />
                      </div>
                      <p className="text-primary font-semibold text-xs bg-green-500/10 border border-green-500/20 rounded px-3 py-2">
                        ✅ Jawaban: Bunga = Rp240.000 · Total tabungan = <strong>Rp2.240.000</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2 – Waktu dalam Bulan, Bunga per Tahun</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Ibu Ani meminjam uang Rp5.000.000 dengan bunga tunggal 18% per tahun. Berapa total yang harus dikembalikan setelah 8 bulan?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">LANGKAH PENYELESAIAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">
                        📌 Diketahui: <InlineMath math="M = \text{Rp}5.000.000" />, <InlineMath math="P = 18\% = 0{,}18 \text{ per tahun}" />, W = 8 bulan
                      </p>
                      <p className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-3 py-2">
                        ⚡ Konversi: Bunga per tahun → W harus dalam tahun: <InlineMath math="W = \frac{8}{12} = \frac{2}{3} \text{ tahun}" />
                      </p>
                      <div className="bg-slate-900/60 rounded-lg p-3">
                        <BlockMath math="B = 5.000.000 \times \frac{2}{3} \times 0{,}18 = 5.000.000 \times 0{,}12 = \text{Rp}600.000" />
                        <BlockMath math="M_1 = 5.000.000 + 600.000 = \text{Rp}5.600.000" />
                      </div>
                      <p className="text-primary font-semibold text-xs bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2">
                        ✅ Jawaban: Total yang dikembalikan = <strong>Rp5.600.000</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3 – Mencari Modal Awal dari Modal Akhir</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Setelah 2,5 tahun dengan bunga tunggal 8% per tahun, total tabungan Budi menjadi Rp3.600.000. Berapa modal awal yang ia tabungkan?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">LANGKAH PENYELESAIAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">
                        📌 Diketahui: <InlineMath math="M_1 = \text{Rp}3.600.000" />, <InlineMath math="P = 0{,}08" />, <InlineMath math="W = 2{,}5 \text{ tahun}" /> · Cari M.
                      </p>
                      <div className="bg-slate-900/60 rounded-lg p-3">
                        <BlockMath math="M_1 = M \times (1 + W \times P)" />
                        <BlockMath math="3.600.000 = M \times (1 + 2{,}5 \times 0{,}08)" />
                        <BlockMath math="3.600.000 = M \times 1{,}2" />
                        <BlockMath math="M = \frac{3.600.000}{1{,}2} = \text{Rp}3.000.000" />
                      </div>
                      <p className="text-primary font-semibold text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                        ✅ Jawaban: Modal awal yang ditabung = <strong>Rp3.000.000</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contoh 4 */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 4 – Mencari Suku Bunga</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah pinjaman Rp4.000.000 selama 1 tahun menghasilkan bunga Rp480.000. Berapa persen suku bunga per tahunnya?
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-purple-400">LANGKAH PENYELESAIAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/60 rounded-lg p-3">
                        <BlockMath math="P = \frac{B}{M \times W} = \frac{480.000}{4.000.000 \times 1} = 0{,}12 = 12\%" />
                      </div>
                      <p className="text-primary font-semibold text-xs bg-purple-500/10 border border-purple-500/20 rounded px-3 py-2">
                        ✅ Jawaban: Suku bunga = <strong>12% per tahun</strong>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ─── MINI QUIZ ─── */}
          <div className="bg-card/80 backdrop-blur border border-purple-500/40 rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("quiz")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Uji Pemahamanmu — Mini Quiz</span>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{quizData.length} SOAL</span>
              </div>
              {expandedSections.includes("quiz") ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
            </button>
            {expandedSections.includes("quiz") && (
              <div className="px-5 pb-5 space-y-4">
                {!quizSelesai ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-body text-xs text-white/50">Soal {quizIndex + 1} dari {quizData.length}</p>
                      <div className="flex gap-1">
                        {quizData.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i < quizIndex ? (quizAnswers[i] ? "bg-green-400" : "bg-red-400") : i === quizIndex ? "bg-purple-400" : "bg-slate-600"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-4">
                      <p className="font-body text-sm text-white leading-relaxed">{quizData[quizIndex].soal}</p>
                    </div>
                    <div className="space-y-2">
                      {quizData[quizIndex].pilihan.map((p, i) => {
                        let style = "bg-slate-800/40 border-border text-white/80 hover:border-purple-400/50 hover:bg-purple-500/10";
                        if (quizPilihan === i && !quizSubmitted) style = "bg-purple-500/20 border-purple-400 text-purple-200";
                        if (quizSubmitted) {
                          if (i === quizData[quizIndex].jawaban) style = "bg-green-500/20 border-green-400 text-green-300";
                          else if (i === quizPilihan && i !== quizData[quizIndex].jawaban) style = "bg-red-500/20 border-red-400 text-red-300";
                          else style = "bg-slate-800/40 border-border text-white/40";
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => handlePilih(i)}
                            className={`w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-colors ${style}`}
                          >
                            <span className="font-bold mr-2">{["A", "B", "C", "D"][i]}.</span>{p}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className={`rounded-lg p-3 text-xs font-body ${quizPilihan === quizData[quizIndex].jawaban ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
                        {quizPilihan === quizData[quizIndex].jawaban ? "✅ Benar! " : "❌ Salah. "}
                        <span className="text-white/70">{quizData[quizIndex].pembahasan}</span>
                      </div>
                    )}
                    <div className="flex gap-3">
                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={quizPilihan === null}
                          className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 disabled:opacity-40 disabled:cursor-not-allowed font-body font-semibold text-sm py-2.5 rounded-lg transition-colors"
                        >
                          Kunci Jawaban
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuiz}
                          className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 font-body font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {quizIndex + 1 >= quizData.length ? "Lihat Skor" : "Soal Berikutnya"} <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-4">
                    <Trophy className={`w-16 h-16 mx-auto ${quizScore >= 3 ? "text-yellow-400" : quizScore >= 2 ? "text-blue-400" : "text-slate-400"}`} />
                    <div>
                      <p className="font-display text-4xl font-bold text-white">{quizScore}<span className="text-white/40 text-2xl">/{quizData.length}</span></p>
                      <p className="font-body text-sm text-white/60 mt-1">
                        {quizScore === quizData.length ? "🏆 Sempurna! Kamu sudah sangat paham bunga tunggal!" :
                         quizScore >= 3 ? "⭐ Bagus sekali! Sedikit lagi menuju sempurna." :
                         quizScore >= 2 ? "👍 Lumayan! Coba pelajari lagi bagian yang masih salah." :
                         "💪 Jangan menyerah! Baca lagi materinya dan coba lagi."}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {quizAnswers.map((benar, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${benar ? "bg-green-500/20 text-green-400 border border-green-500/40" : "bg-red-500/20 text-red-400 border border-red-500/40"}`}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <button onClick={resetQuiz} className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 font-body font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                      <RotateCcw className="w-4 h-4" /> Ulangi Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── RANGKUMAN ─── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("rangkuman")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Rangkuman Materi Bunga Tunggal</span>
              </div>
              {expandedSections.includes("rangkuman") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                  {[
                    { no: "1", poin: "Bunga tunggal dihitung dari modal awal yang tetap setiap periodenya (tidak ada 'bunga dari bunga')." },
                    { no: "2", poin: "Rumus utama: B = M × W × P. Modal akhir: M₁ = M + B = M(1 + W × P)." },
                    { no: "3", poin: "Satuan waktu W harus selalu disesuaikan dengan periode bunga P sebelum dihitung." },
                    { no: "4", poin: "Untuk mencari modal awal: M = M₁ ÷ (1 + W × P)." },
                    { no: "5", poin: "Untuk mencari suku bunga: P = B ÷ (M × W)." },
                    { no: "6", poin: "Pertumbuhan bunga tunggal bersifat linear — sama jumlahnya setiap periode." },
                  ].map((item) => (
                    <div key={item.no} className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.no}</span>
                      <p className="font-body text-sm text-white/80">{item.poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-xs text-green-200 leading-relaxed">
                    <strong>🌍 Koneksi ke Kehidupan Nyata:</strong> Bunga tunggal sering dipakai pada tabungan jangka pendek,
                    koperasi simpan pinjam, dan kredit informal. Memahami cara kerjanya membantu kamu membuat keputusan
                    keuangan yang lebih cerdas di masa depan!
                  </p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4">
                  <p className="font-body text-xs font-semibold text-white/60 mb-3 text-center">📐 Kartu Rumus Singkat</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Bunga", math: "B = M \\times W \\times P" },
                      { label: "Modal Akhir", math: "M_1 = M(1 + W \\times P)" },
                      { label: "Modal Awal", math: "M = \\frac{M_1}{1+W \\times P}" },
                      { label: "Suku Bunga", math: "P = \\frac{B}{M \\times W}" },
                    ].map((r) => (
                      <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                        <p className="font-body text-[10px] text-white/40 mb-1">{r.label}</p>
                        <BlockMath math={r.math} />
                      </div>
                    ))}
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

export default BungaTunggalPage;
