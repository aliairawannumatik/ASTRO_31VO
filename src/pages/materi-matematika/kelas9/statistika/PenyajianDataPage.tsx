import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BAR_COLORS = [
  { bg: "bg-blue-500",   text: "text-blue-300"   },
  { bg: "bg-violet-500", text: "text-violet-300" },
  { bg: "bg-green-500",  text: "text-green-300"  },
  { bg: "bg-orange-500", text: "text-orange-300" },
  { bg: "bg-pink-500",   text: "text-pink-300"   },
  { bg: "bg-cyan-500",   text: "text-cyan-300"   },
  { bg: "bg-amber-500",  text: "text-amber-300"  },
  { bg: "bg-red-500",    text: "text-red-300"    },
];

const PIE_COLORS = [
  "#f97316","#a855f7","#22d3ee","#4ade80",
  "#f43f5e","#fbbf24","#60a5fa","#e879f9",
  "#10b981","#fb923c",
];

const PenyajianDataPage = () => {
  const navigate = useNavigate();

  /* ── Diagram Batang Interaktif state ── */
  const [tableRows, setTableRows] = useState<{ id: number; label: string; value: string }[]>([
    { id: 1, label: "Pramuka",  value: "24" },
    { id: 2, label: "Musik",   value: "18" },
    { id: 3, label: "Futsal",  value: "30" },
    { id: 4, label: "Tari",    value: "12" },
  ]);
  const [rowCounter, setRowCounter] = useState(5);
  const [chartVisible, setChartVisible]   = useState(false);
  const [chartData, setChartData]         = useState<{ label: string; value: number }[]>([]);
  const [chartAnimated, setChartAnimated] = useState(false);

  const addRow = () => {
    if (tableRows.length >= 10) return;
    setTableRows(prev => [...prev, { id: rowCounter, label: "", value: "" }]);
    setRowCounter(prev => prev + 1);
  };
  const removeRow = (id: number) => {
    if (tableRows.length <= 2) return;
    setTableRows(prev => prev.filter(r => r.id !== id));
  };
  const updateRow = (id: number, field: "label" | "value", val: string) => {
    setTableRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };
  const convertToChart = () => {
    const valid = tableRows
      .filter(r => r.label.trim() && r.value.trim() && !isNaN(Number(r.value)) && Number(r.value) >= 0)
      .map(r => ({ label: r.label.trim(), value: Number(r.value) }));
    if (valid.length < 1) return;
    setChartData(valid);
    setChartVisible(true);
    setChartAnimated(false);
    setTimeout(() => setChartAnimated(true), 80);
  };
  const resetChart = () => {
    setChartVisible(false);
    setChartAnimated(false);
    setChartData([]);
  };

  /* ── Diagram Garis Interaktif state ── */
  const [lineRows, setLineRows] = useState<{ id: number; label: string; value: string }[]>([
    { id: 1, label: "Jan", value: "65" },
    { id: 2, label: "Feb", value: "72" },
    { id: 3, label: "Mar", value: "68" },
    { id: 4, label: "Apr", value: "80" },
    { id: 5, label: "Mei", value: "85" },
  ]);
  const [lineRowCounter, setLineRowCounter] = useState(6);
  const [lineChartVisible, setLineChartVisible] = useState(false);
  const [lineChartData, setLineChartData] = useState<{ label: string; value: number }[]>([]);
  const [lineChartAnimated, setLineChartAnimated] = useState(false);

  const addLineRow = () => {
    if (lineRows.length >= 12) return;
    setLineRows(prev => [...prev, { id: lineRowCounter, label: "", value: "" }]);
    setLineRowCounter(prev => prev + 1);
  };
  const removeLineRow = (id: number) => {
    if (lineRows.length <= 2) return;
    setLineRows(prev => prev.filter(r => r.id !== id));
  };
  const updateLineRow = (id: number, field: "label" | "value", val: string) => {
    setLineRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };
  const convertToLineChart = () => {
    const valid = lineRows
      .filter(r => r.label.trim() && r.value.trim() && !isNaN(Number(r.value)))
      .map(r => ({ label: r.label.trim(), value: Number(r.value) }));
    if (valid.length < 2) return;
    setLineChartData(valid);
    setLineChartVisible(true);
    setLineChartAnimated(false);
    setTimeout(() => setLineChartAnimated(true), 80);
  };
  const resetLineChart = () => {
    setLineChartVisible(false);
    setLineChartAnimated(false);
    setLineChartData([]);
  };

  /* ── Diagram Lingkaran Interaktif state ── */
  const [pieRows, setPieRows] = useState<{ id: number; label: string; value: string }[]>([
    { id: 1, label: "Pramuka",  value: "24" },
    { id: 2, label: "Musik",    value: "18" },
    { id: 3, label: "Futsal",   value: "30" },
    { id: 4, label: "Tari",     value: "12" },
    { id: 5, label: "Robotik",  value: "16" },
  ]);
  const [pieRowCounter, setPieRowCounter] = useState(6);
  const [pieVisible, setPieVisible]       = useState(false);
  const [pieData, setPieData]             = useState<{ label: string; value: number; pct: number; sudut: number }[]>([]);
  const [pieAnimated, setPieAnimated]     = useState(false);
  const [pieMode, setPieMode]             = useState<"persen" | "derajat">("persen");

  const addPieRow = () => {
    if (pieRows.length >= 10) return;
    setPieRows(prev => [...prev, { id: pieRowCounter, label: "", value: "" }]);
    setPieRowCounter(prev => prev + 1);
  };
  const removePieRow = (id: number) => {
    if (pieRows.length <= 2) return;
    setPieRows(prev => prev.filter(r => r.id !== id));
  };
  const updatePieRow = (id: number, field: "label" | "value", val: string) => {
    setPieRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };
  const buildPieChart = () => {
    const valid = pieRows
      .filter(r => r.label.trim() && r.value.trim() && !isNaN(Number(r.value)) && Number(r.value) > 0)
      .map(r => ({ label: r.label.trim(), value: Number(r.value) }));
    if (valid.length < 2) return;
    const total = valid.reduce((s, d) => s + d.value, 0);
    const computed = valid.map(d => ({
      ...d,
      pct:   Math.round((d.value / total) * 1000) / 10,
      sudut: Math.round((d.value / total) * 3600) / 10,
    }));
    setPieData(computed);
    setPieVisible(true);
    setPieAnimated(false);
    setTimeout(() => setPieAnimated(true), 80);
  };
  const resetPie = () => { setPieVisible(false); setPieAnimated(false); setPieData([]); };

  /* ── Diagram Batang Daun Interaktif state ── */
  const [stemInput, setStemInput]         = useState("62, 65, 68, 71, 73, 73, 75, 78, 78, 82, 85, 87, 88, 91, 95");
  const [stemResult, setStemResult]       = useState<{ stem: number; leaves: number[] }[]>([]);
  const [stemRaw, setStemRaw]             = useState<number[]>([]);
  const [stemVisible, setStemVisible]     = useState(false);
  const [stemAnimated, setStemAnimated]   = useState(false);
  const [stemError, setStemError]         = useState("");

  const buildStemLeaf = () => {
    const parts = stemInput.split(/[,\s]+/).filter(Boolean);
    if (parts.length < 2) { setStemError("Masukkan minimal 2 angka, dipisahkan koma."); return; }
    if (parts.length > 30) { setStemError("Maksimal 30 angka."); return; }
    const nums = parts.map(p => parseInt(p.trim(), 10));
    if (nums.some(n => isNaN(n) || n < 0 || n > 999)) { setStemError("Semua angka harus valid dan berada di antara 0–999."); return; }
    setStemError("");
    const sorted = [...nums].sort((a, b) => a - b);
    setStemRaw(sorted);
    const map = new Map<number, number[]>();
    for (const n of sorted) {
      const s = Math.floor(n / 10), l = n % 10;
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push(l);
    }
    const result = Array.from(map.entries()).sort((a, b) => a[0] - b[0]).map(([stem, leaves]) => ({ stem, leaves }));
    setStemResult(result);
    setStemVisible(true);
    setStemAnimated(false);
    setTimeout(() => setStemAnimated(true), 80);
  };
  const resetStem = () => { setStemVisible(false); setStemAnimated(false); setStemResult([]); setStemRaw([]); };
  const loadStemExample = () => { setStemInput("72, 65, 78, 83, 91, 65, 72, 88, 75, 90, 68, 77, 84, 92, 70"); setStemError(""); setStemVisible(false); setStemAnimated(false); };

  /* ── Tabel Distribusi Frekuensi Data Tunggal Interaktif ── */
  const [freqRawInput, setFreqRawInput] = useState("70, 75, 80, 70, 85, 80, 75, 70, 90, 85, 80, 75, 70, 85, 80, 75, 90, 70, 85, 80");
  const [freqResult, setFreqResult] = useState<{ nilai: number; frek: number }[]>([]);
  const [freqVisible, setFreqVisible] = useState(false);
  const [freqAnimated, setFreqAnimated] = useState(false);
  const [freqError, setFreqError] = useState("");

  const buildFreqTable = () => {
    const parts = freqRawInput.split(/[,\s]+/).filter(Boolean);
    if (parts.length < 2) { setFreqError("Masukkan minimal 2 angka."); return; }
    if (parts.length > 40) { setFreqError("Maksimal 40 angka."); return; }
    const nums = parts.map(p => Number(p.trim()));
    if (nums.some(n => isNaN(n) || !Number.isInteger(n) || n < 0 || n > 999)) {
      setFreqError("Semua data harus bilangan bulat antara 0–999."); return;
    }
    setFreqError("");
    const map = new Map<number, number>();
    for (const n of nums) map.set(n, (map.get(n) || 0) + 1);
    const result = Array.from(map.entries()).sort((a, b) => a[0] - b[0]).map(([nilai, frek]) => ({ nilai, frek }));
    setFreqResult(result);
    setFreqVisible(true);
    setFreqAnimated(false);
    setTimeout(() => setFreqAnimated(true), 80);
  };
  const resetFreqTable = () => { setFreqVisible(false); setFreqAnimated(false); setFreqResult([]); };
  const loadFreqExample = () => { setFreqRawInput("65, 70, 70, 75, 80, 65, 75, 80, 70, 85, 80, 75, 65, 70, 85"); setFreqError(""); setFreqVisible(false); setFreqAnimated(false); };

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1", "contoh1",
    "konsep2", "contoh2",
    "konsep3", "contoh3",
    "konsep4", "contoh4",
    "konsep5", "contoh5",
    "rangkuman",
  ]);

  const SectionHeader = ({
    icon, iconColor, title,
  }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENYAJIAN DATA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===== PENGANTAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Penyajian Data Penting?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu punya ratusan nilai ujian dalam satu lembar kertas berisi angka-angka acak. Susah dibaca, kan? Nah, di sinilah penyajian data berperan — mengubah kumpulan angka mentah menjadi tampilan yang <strong className="text-cyan-300">informatif, rapi, dan mudah dipahami</strong>.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Di sub-bab ini kamu akan belajar lima bentuk penyajian data: Diagram Batang Daun, Diagram Batang, Diagram Garis, Diagram Lingkaran, dan Tabel Distribusi Frekuensi. Setiap bentuk punya keunggulannya masing-masing! 📊🚀
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Pastikan kamu sudah memahami Pengantar Statistika sebelum masuk ke sini. Kemampuan membaca dan membuat diagram sangat dibutuhkan di ujian!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== SUB-BAB 1: TABEL DISTRIBUSI FREKUENSI ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 1: Tabel Distribusi Frekuensi" />
            {expandedSections.includes("konsep5") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Tabel distribusi frekuensi</strong> adalah cara menyajikan data dengan menghitung <strong className="text-cyan-300">berapa kali setiap nilai muncul</strong> dalam kumpulan data. Nilai yang dihitung kemunculannya disebut <strong className="text-cyan-300">frekuensi</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-cyan-300">NILAI</p>
                      <p className="font-body text-xs text-white/70 mt-1">Data yang diamati</p>
                      <p className="font-body text-xs text-cyan-400 mt-1">mis. 70, 75, 80 ...</p>
                    </div>
                    <div className="bg-teal-900/40 border border-teal-500/40 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-teal-300">FREKUENSI</p>
                      <p className="font-body text-xs text-white/70 mt-1">Berapa kali nilai itu muncul</p>
                      <p className="font-body text-xs text-teal-400 mt-1">dihitung dari data mentah</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-body text-xs font-bold text-cyan-300">📋 Cara Membuat Tabel Distribusi Frekuensi:</p>
                    {[
                      ["1", "Catat semua data mentah", "Kumpulkan seluruh data yang ada"],
                      ["2", "Tentukan nilai-nilai berbeda", "Catat semua nilai unik yang muncul"],
                      ["3", "Hitung kemunculan tiap nilai", "Berapa kali nilai itu ada dalam data?"],
                      ["4", "Tulis dalam tabel", "Kolom Nilai | Kolom Frekuensi"],
                    ].map(([no, judul, ket]) => (
                      <div key={no} className="flex gap-3 items-start">
                        <div className="bg-cyan-500/20 text-cyan-400 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{no}</div>
                        <div>
                          <p className="font-body text-xs font-semibold text-white">{judul}</p>
                          <p className="font-body text-xs text-white/60">{ket}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contoh: Distribusi Frekuensi Data Tunggal */}
                {(() => {
                  const contohData = [70, 70, 70, 70, 70, 75, 75, 75, 75, 80, 80, 80, 80, 80, 85, 85, 85, 90, 90, 95];
                  const contohMap = new Map<number, number>();
                  for (const n of contohData) contohMap.set(n, (contohMap.get(n) || 0) + 1);
                  const contohFreq = Array.from(contohMap.entries()).sort((a, b) => a[0] - b[0]);
                  const BAR_COLS = ["#22d3ee","#4ade80","#a78bfa","#fb923c","#f472b6","#fbbf24"];
                  return (
                    <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl overflow-hidden">
                      <div className="bg-cyan-800/30 px-4 py-2">
                        <p className="font-body text-xs font-bold text-cyan-200 uppercase tracking-wide">📋 Contoh: Distribusi Frekuensi Nilai Ulangan 20 Siswa</p>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Raw data */}
                        <div>
                          <p className="font-body text-xs text-white/50 mb-2">Diketahui nilai matematika 20 siswa SMP Internasional:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {contohData.map((v, i) => (
                              <span key={i} className="bg-slate-700/60 border border-cyan-500/20 rounded px-2 py-1 font-mono text-xs text-cyan-300">{v}</span>
                            ))}
                          </div>
                        </div>
                        {/* Frequency table */}
                        <div className="rounded-lg overflow-hidden border border-cyan-500/20 max-w-xs">
                          <div className="grid bg-cyan-950/60" style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300">Nilai</div>
                            <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300 text-center">Frekuensi (f)</div>
                          </div>
                          <div className="divide-y divide-slate-700/40">
                            {contohFreq.map(([nilai, frek], i) => (
                              <div key={nilai} className="grid items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                <div className="px-3 py-2 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: BAR_COLS[i % BAR_COLS.length] }} />
                                  <span className="font-mono text-xs text-white font-semibold">{nilai}</span>
                                </div>
                                <div className="px-3 py-2 text-center font-body text-xs font-bold text-green-300">{frek}</div>
                              </div>
                            ))}
                            <div className="grid items-center bg-slate-700/30 border-t border-slate-500/50" style={{ gridTemplateColumns: "1fr 1fr" }}>
                              <div className="px-3 py-2 font-body text-xs font-bold text-white">TOTAL</div>
                              <div className="px-3 py-2 text-center font-body text-xs font-bold text-cyan-400">{contohData.length}</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3 font-body text-xs text-white/70 leading-relaxed">
                          <strong className="text-cyan-300">Cara membaca:</strong> Nilai 80 muncul <strong className="text-green-300">5 kali</strong> → frekuensinya 5. Nilai 95 muncul <strong className="text-green-300">1 kali</strong> → frekuensinya 1. Jumlah seluruh frekuensi = <strong className="text-cyan-300">20</strong> (= banyak data).
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ===== ANIMASI INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-cyan-500/30 rounded-xl overflow-hidden">
                  <div className="bg-cyan-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-cyan-200">🛠️ Coba Sendiri — Buat Tabel Distribusi Frekuensi</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Ketikkan data angka (bilangan bulat 0–999) dipisahkan koma — maks 40 angka. Klik <strong className="text-cyan-300">Buat Tabel</strong> dan lihat tabel serta diagram frekuensi muncul dengan animasi!
                    </p>

                    {/* Input area */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body text-xs font-semibold text-cyan-300">Data mentah (dipisah koma, maks 40):</label>
                        <button
                          onClick={loadFreqExample}
                          className="font-body text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors underline underline-offset-2"
                        >Ganti contoh ↗</button>
                      </div>
                      {/* Data tokens preview */}
                      {freqRawInput.trim() && (
                        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto bg-slate-900/40 rounded-lg p-2">
                          {freqRawInput.split(/[,\s]+/).filter(Boolean).map((v, i) => (
                            <span key={i} className="bg-cyan-500/15 border border-cyan-500/25 rounded px-1.5 py-0.5 font-mono text-xs text-cyan-200">{v}</span>
                          ))}
                        </div>
                      )}
                      <textarea
                        value={freqRawInput}
                        onChange={(e) => { setFreqRawInput(e.target.value); setFreqError(""); setFreqVisible(false); }}
                        placeholder="Contoh: 70, 75, 80, 70, 85, 80, 75..."
                        rows={2}
                        className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-cyan-400/60 transition-colors resize-none"
                      />
                      {freqError && (
                        <p className="font-body text-xs text-red-400">⚠ {freqError}</p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={buildFreqTable}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 border border-cyan-500/50 text-white text-xs font-body font-bold hover:bg-cyan-500 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        Buat Tabel &amp; Diagram
                      </button>
                      {freqVisible && (
                        <button
                          onClick={resetFreqTable}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >↺ Reset</button>
                      )}
                    </div>

                    {/* Result */}
                    {freqVisible && freqResult.length > 0 && (() => {
                      const total = freqResult.reduce((s, r) => s + r.frek, 0);
                      const maxFrek = Math.max(...freqResult.map(r => r.frek));
                      const ANIM_COLORS = ["#22d3ee","#4ade80","#a78bfa","#fb923c","#f472b6","#fbbf24","#60a5fa","#34d399","#f87171","#e879f9"];

                      return (
                        <div
                          className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-4 space-y-4"
                          style={{ opacity: freqAnimated ? 1 : 0, transition: "opacity 0.4s ease" }}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wider">📊 Hasil Tabel Distribusi Frekuensi</p>
                            <span className="font-body text-xs text-white/35">{total} data · {freqResult.length} nilai unik</span>
                          </div>

                          <div className="rounded-lg overflow-hidden border border-cyan-500/20 max-w-xs">
                            <div className="grid bg-cyan-950/70" style={{ gridTemplateColumns: "1fr 1fr" }}>
                              <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300">Nilai</div>
                              <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300 text-center">Frekuensi (f)</div>
                            </div>
                            <div className="divide-y divide-slate-700/40">
                              {freqResult.map((row, i) => (
                                <div
                                  key={row.nilai}
                                  className="grid items-center"
                                  style={{
                                    gridTemplateColumns: "1fr 1fr",
                                    opacity: freqAnimated ? 1 : 0,
                                    transform: freqAnimated ? "translateX(0)" : "translateX(-10px)",
                                    transition: `opacity 0.3s ease ${i * 0.07}s, transform 0.3s ease ${i * 0.07}s`,
                                  }}
                                >
                                  <div className="px-3 py-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: ANIM_COLORS[i % ANIM_COLORS.length] }} />
                                    <span className="font-mono text-xs text-white font-semibold">{row.nilai}</span>
                                  </div>
                                  <div className="px-3 py-2 flex items-center justify-center gap-2">
                                    <span className="font-body text-xs font-bold text-green-300">{row.frek}</span>
                                    {row.frek === maxFrek && (
                                      <span className="text-yellow-400 text-xs">★</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="grid items-center bg-slate-700/30 border-t border-slate-500/50" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                <div className="px-3 py-2 font-body text-xs font-bold text-white">TOTAL</div>
                                <div className="px-3 py-2 text-center font-body text-xs font-bold text-cyan-400">{total}</div>
                              </div>
                            </div>
                          </div>

                          {/* Stats summary */}
                          <div
                            className="grid grid-cols-2 gap-2"
                            style={{
                              opacity: freqAnimated ? 1 : 0,
                              transition: `opacity 0.4s ease ${freqResult.length * 0.07 + 0.3}s`,
                            }}
                          >
                            <div className="bg-cyan-900/25 border border-cyan-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>BANYAK DATA (n)</p>
                              <p className="font-body text-cyan-300 font-bold text-sm mt-0.5">{total}</p>
                            </div>
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>NILAI UNIK</p>
                              <p className="font-body text-green-300 font-bold text-sm mt-0.5">{freqResult.length}</p>
                            </div>
                          </div>

                          <p className="font-body text-xs text-white/40 leading-relaxed">
                            Jumlah seluruh frekuensi = banyaknya data = <strong className="text-cyan-300">{total}</strong>.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Tabel distribusi frekuensi data tunggal mencatat berapa kali setiap nilai muncul. Jumlah semua frekuensi harus sama dengan banyaknya seluruh data (n). Semakin tinggi batang pada diagram, semakin sering nilai tersebut muncul!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh5" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal — Tabel Distribusi Frekuensi" />
            {expandedSections.includes("contoh5") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white">
                      Data nilai ulangan IPA 10 siswa: <strong className="text-cyan-300">70, 80, 75, 90, 80, 75, 70, 85, 90, 75</strong>.
                    </p>
                    <p className="font-body text-sm text-white">
                      Buat tabel distribusi frekuensi data tunggal, lalu tentukan:<br />
                      (a) Total frekuensi &nbsp; (b) Nilai yang paling sering muncul dari tabel
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan data → 70, 70, 75, 75, 75, 80, 80, 85, 90, 90</p>
                      <p><strong>Langkah 2:</strong> Hitung kemunculan tiap nilai:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-slate-700/40">
                              <th className="px-3 py-1.5 text-left text-white/70">Nilai (x)</th>
                              <th className="px-3 py-1.5 text-center text-white/70">Turus</th>
                              <th className="px-3 py-1.5 text-center text-white/70">Frekuensi (f)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              ["70","||","2"],
                              ["75","|||","3"],
                              ["80","||","2"],
                              ["85","|","1"],
                              ["90","||","2"],
                            ].map(([x,t,f],i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : ""}>
                                <td className="px-3 py-1.5 text-green-300 font-bold">{x}</td>
                                <td className="px-3 py-1.5 text-center text-cyan-300 tracking-widest">{t}</td>
                                <td className="px-3 py-1.5 text-center text-white font-bold">{f}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold bg-slate-700/20">
                              <td className="px-3 py-1.5 text-yellow-300">Jumlah</td>
                              <td className="px-3 py-1.5 text-center">—</td>
                              <td className="px-3 py-1.5 text-center text-yellow-300">10</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1.5">
                        <p>(a) Total frekuensi = <InlineMath math="2 + 3 + 2 + 1 + 2 = \mathbf{10}" /> ✓ (sama dengan banyak data)</p>
                        <p>(b) Nilai yang paling sering muncul = <span className="text-green-400 font-bold">75</span> (muncul 3 kali, frekuensi tertinggi)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">
                      Data berikut adalah hasil pencatatan banyak anak dalam keluarga pada sebuah desa.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="font-body text-sm text-cyan-300 font-semibold border-collapse">
                        <tbody>
                          {[
                            ["1","3","2","3","5","4","3","5","1","2"],
                            ["4","2","2","3","1","6","5","2","1","3"],
                            ["3","4","5","2","3","4","6","5","3","4"],
                            ["2","4","2","3","2","4","1","2","3","1"],
                          ].map((row, i) => (
                            <tr key={i}>
                              {row.map((val, j) => (
                                <td key={j} className="px-3 py-1 text-center">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white">
                      <strong>a.</strong> Buatlah tabel distribusi frekuensinya!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan nilai-nilai yang berbeda → 1, 2, 3, 4, 5, 6</p>
                      <p><strong>Langkah 2:</strong> Hitung frekuensi kemunculan tiap nilai dari 40 data:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-slate-700/40">
                              <th className="px-3 py-1.5 text-left text-white/70">Banyak Anak (x)</th>
                              <th className="px-3 py-1.5 text-center text-white/70">Turus</th>
                              <th className="px-3 py-1.5 text-center text-white/70">Frekuensi (f)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              ["1","|||| |","6"],
                              ["2","|||| ||||","10"],
                              ["3","|||| ||||","10"],
                              ["4","|||| ||","7"],
                              ["5","||||","5"],
                              ["6","||","2"],
                            ].map(([x,t,f],i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : ""}>
                                <td className="px-3 py-1.5 text-yellow-300 font-bold">{x}</td>
                                <td className="px-3 py-1.5 text-center text-cyan-300 tracking-widest">{t}</td>
                                <td className="px-3 py-1.5 text-center text-white font-bold">{f}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold bg-slate-700/20">
                              <td className="px-3 py-1.5 text-yellow-300">Jumlah</td>
                              <td className="px-3 py-1.5 text-center">—</td>
                              <td className="px-3 py-1.5 text-center text-yellow-300">40</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1.5">
                        <p>Total frekuensi = <InlineMath math="6 + 10 + 10 + 7 + 5 + 2 = \mathbf{40}" /> ✓ (sama dengan banyak data)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white">
                      Data nilai ulangan matematika 25 siswa:
                    </p>
                    <p className="font-body text-sm text-cyan-300 font-semibold leading-relaxed">
                      60, 70, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 70, 90, 80, 70
                    </p>
                    <p className="font-body text-sm text-white mt-1">
                      Buat tabel distribusi frekuensi data tunggal lengkap dengan frekuensi kumulatif (fk), lalu tentukan:<br />
                      (a) Persentase siswa yang mendapat nilai ≥ 80 &nbsp;
                      (b) Banyak siswa yang mendapat nilai di bawah 80
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung frekuensi tiap nilai dan frekuensi kumulatif (fk = jumlah f dari atas s.d. baris tersebut):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-slate-700/40">
                              <th className="px-2 py-1.5 text-left text-white/70">Nilai (x)</th>
                              <th className="px-2 py-1.5 text-center text-white/70">Frekuensi (f)</th>
                              <th className="px-2 py-1.5 text-center text-white/70">Frek. Kumulatif (fk)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              ["60","4","4"],
                              ["70","9","13"],
                              ["80","8","21"],
                              ["90","4","25"],
                            ].map(([x,f,fk],i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : ""}>
                                <td className="px-2 py-1.5 text-red-300 font-bold">{x}</td>
                                <td className="px-2 py-1.5 text-center text-green-300 font-bold">{f}</td>
                                <td className="px-2 py-1.5 text-center text-purple-300">{fk}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold bg-slate-700/20">
                              <td className="px-2 py-1.5 text-yellow-300">Jumlah</td>
                              <td className="px-2 py-1.5 text-center text-yellow-300">25</td>
                              <td className="px-2 py-1.5 text-center text-slate-400">—</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>(a)</strong> Siswa nilai ≥ 80 = f(80) + f(90) = 8 + 4 = 12 siswa</p>
                        <BlockMath math="\text{Persentase} = \frac{12}{25} \times 100\% = \mathbf{48\%}" />
                        <p><strong>(b)</strong> Siswa nilai &lt; 80 = f(60) + f(70) = 4 + 9 = <span className="text-red-400 font-bold">13 siswa</span></p>
                        <p className="text-xs text-white/50 italic">(atau: fk nilai 70 = 13 siswa)</p>
                      </div>
                      <p><strong className="text-primary">48% siswa nilai ≥ 80; 13 siswa nilai &lt; 80</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 2: DIAGRAM BATANG ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Sub-Bab 2: Diagram Batang" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-blue-300">Diagram batang</strong> menggunakan batang-batang persegi panjang untuk mewakili data. Tinggi (atau panjang) batang menunjukkan nilai/frekuensi data. Sangat efektif untuk <strong className="text-blue-300">membandingkan beberapa kategori</strong> secara visual.
                  </p>
                </div>

                {/* Visual Diagram Batang */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">📊 Contoh: Jumlah Siswa yang Memilih Ekskul</p>
                  </div>
                  <div className="p-4">
                    <div className="relative h-44 flex items-end gap-3 px-2 pb-8">
                      {/* Y-axis label */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between pb-8 pt-2">
                        {[30, 25, 20, 15, 10, 5, 0].map((v) => (
                          <span key={v} className="text-white/30 text-xs font-body">{v}</span>
                        ))}
                      </div>
                      {/* Grid lines */}
                      <div className="absolute left-7 right-2 top-0 h-full pb-8">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i / 6) * 100}%` }} />
                        ))}
                      </div>
                      {/* Bars */}
                      {[
                        { label: "Pramuka", value: 24, color: "bg-blue-500" },
                        { label: "Musik", value: 18, color: "bg-purple-500" },
                        { label: "Futsal", value: 30, color: "bg-green-500" },
                        { label: "Tari", value: 12, color: "bg-pink-500" },
                        { label: "Robotik", value: 21, color: "bg-orange-500" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col items-center gap-1 flex-1 ml-7">
                          <span className="text-white/70 text-xs font-body mb-0.5">{value}</span>
                          <div
                            className={`w-full ${color} rounded-t-sm`}
                            style={{ height: `${(value / 30) * 120}px` }}
                          />
                          <span className="text-white/50 text-xs font-body absolute bottom-0 text-center leading-tight" style={{ fontSize: '9px' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="font-body text-xs text-white/40 text-center mt-2">Diagram Batang: Pilihan Ekskul Siswa</p>
                  </div>
                </div>

                {/* Komponen Diagram Batang */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">🔍 Komponen Diagram Batang</p>
                  <div className="space-y-2 font-body text-sm">
                    <div className="flex gap-3 items-start">
                      <span className="text-blue-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-blue-300">Sumbu X (horizontal)</strong> → kategori atau nama data</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-blue-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-blue-300">Sumbu Y (vertikal)</strong> → nilai atau frekuensi</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-blue-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-blue-300">Batang</strong> → mewakili nilai tiap kategori; lebar sama, ada jarak antar batang</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-blue-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-blue-300">Judul</strong> → menjelaskan isi diagram</p>
                    </div>
                  </div>
                </div>

                {/* ===== DIAGRAM BATANG INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-blue-500/30 rounded-xl overflow-hidden">
                  <div className="bg-blue-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-blue-200">🛠️ Coba Sendiri — Buat Diagram Batang</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Isi tabel dengan data kamu, tambah atau hapus baris sesuai kebutuhan, lalu klik <strong className="text-blue-300">Konversi ke Diagram Batang</strong> untuk melihat hasilnya secara animasi!
                    </p>

                    {/* Table */}
                    <div className="rounded-lg overflow-hidden border border-slate-600/50">
                      <div className="grid bg-blue-950/60" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                        <div className="px-3 py-2 font-body text-xs font-bold text-blue-300 uppercase tracking-wide">Kategori / Label</div>
                        <div className="px-3 py-2 font-body text-xs font-bold text-blue-300 uppercase tracking-wide">Nilai</div>
                        <div />
                      </div>
                      <div className="divide-y divide-slate-700/40">
                        {tableRows.map((row) => (
                          <div key={row.id} className="grid items-center gap-2 px-2 py-1.5 bg-slate-900/30" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) => updateRow(row.id, "label", e.target.value)}
                              placeholder="Contoh: Pramuka"
                              className="w-full bg-slate-800/60 border border-slate-600/50 rounded px-2 py-1.5 text-xs font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-blue-400/60 transition-colors"
                            />
                            <input
                              type="number"
                              value={row.value}
                              onChange={(e) => updateRow(row.id, "value", e.target.value)}
                              placeholder="0"
                              min="0"
                              className="w-full bg-slate-800/60 border border-slate-600/50 rounded px-2 py-1.5 text-xs font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-blue-400/60 transition-colors"
                            />
                            <button
                              onClick={() => removeRow(row.id)}
                              disabled={tableRows.length <= 2}
                              className="w-8 h-8 flex items-center justify-center rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={addRow}
                        disabled={tableRows.length >= 10}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-500/40 text-white/75 text-xs font-body font-semibold hover:bg-slate-600/60 hover:border-slate-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                      >
                        ＋ Tambah Baris
                        {tableRows.length >= 10 && <span className="text-white/30">(maks 10)</span>}
                      </button>

                      <button
                        onClick={convertToChart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 border border-blue-500/50 text-white text-xs font-body font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        Konversi ke Diagram Batang
                      </button>

                      {chartVisible && (
                        <button
                          onClick={resetChart}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >↺ Reset</button>
                      )}
                    </div>

                    {/* Animated Chart Result */}
                    {chartVisible && chartData.length > 0 && (() => {
                      const maxVal = Math.max(...chartData.map(d => d.value), 1);
                      const total  = chartData.reduce((s, d) => s + d.value, 0);
                      const biggest = chartData.reduce((a, b) => a.value >= b.value ? a : b);
                      const smallest = chartData.reduce((a, b) => a.value <= b.value ? a : b);
                      const ySteps = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];
                      return (
                        <div className="bg-slate-900/60 border border-blue-500/20 rounded-xl p-4 space-y-3">
                          <p className="font-body text-xs font-bold text-blue-300 text-center uppercase tracking-wider">📊 Hasil Diagram Batang</p>

                          {/* Chart canvas */}
                          <div className="relative" style={{ height: "200px" }}>
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between" style={{ width: "30px" }}>
                              {ySteps.map((v) => (
                                <span key={v} className="font-body text-white/35 text-right pr-1 leading-none" style={{ fontSize: "9px" }}>{v}</span>
                              ))}
                            </div>
                            {/* Grid lines */}
                            <div className="absolute top-0 bottom-6 right-0" style={{ left: "32px" }}>
                              {[0, 0.25, 0.5, 0.75, 1].map((r) => (
                                <div key={r} className="absolute w-full border-t border-slate-700/40" style={{ top: `${r * 100}%` }} />
                              ))}
                            </div>
                            {/* Bars */}
                            <div className="absolute top-0 bottom-6 right-0 flex items-end gap-1.5 px-1" style={{ left: "34px" }}>
                              {chartData.map((item, idx) => {
                                const color = BAR_COLORS[idx % BAR_COLORS.length];
                                const heightPct = (item.value / maxVal) * 100;
                                return (
                                  <div key={`${item.label}-${idx}`} className="flex flex-col items-center justify-end flex-1 h-full">
                                    <span
                                      className="font-body font-semibold text-white/80 mb-0.5"
                                      style={{ fontSize: "10px", opacity: chartAnimated ? 1 : 0, transition: "opacity 0.4s ease 0.6s" }}
                                    >{item.value}</span>
                                    <div
                                      className={`w-full ${color.bg} rounded-t-md`}
                                      style={{
                                        height: chartAnimated ? `${heightPct}%` : "0%",
                                        transition: `height 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.05 * idx}s`,
                                        minHeight: chartAnimated && item.value > 0 ? "4px" : "0px",
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            {/* X-axis labels */}
                            <div className="absolute bottom-0 right-0 flex" style={{ left: "34px", height: "22px" }}>
                              {chartData.map((item, idx) => (
                                <div key={`lbl-${idx}`} className="flex-1 flex items-end justify-center pb-0.5">
                                  <span className="font-body text-white/50 text-center leading-tight" style={{ fontSize: "9px" }}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Color legend */}
                          <div className="flex flex-wrap gap-2 justify-center pt-1">
                            {chartData.map((item, idx) => {
                              const color = BAR_COLORS[idx % BAR_COLORS.length];
                              return (
                                <div key={`leg-${idx}`} className="flex items-center gap-1 text-xs font-body text-white/55">
                                  <div className={`w-2.5 h-2.5 rounded-sm ${color.bg} shrink-0`} />
                                  <span>{item.label}: <strong className={color.text}>{item.value}</strong></span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Stats row */}
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <div className="bg-blue-900/25 border border-blue-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>TERBESAR</p>
                              <p className="font-body text-blue-300 font-bold text-sm mt-0.5">{biggest.value}</p>
                              <p className="font-body text-white/40 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{biggest.label}</p>
                            </div>
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>TOTAL</p>
                              <p className="font-body text-green-300 font-bold text-sm mt-0.5">{total}</p>
                              <p className="font-body text-white/40 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{chartData.length} data</p>
                            </div>
                            <div className="bg-orange-900/25 border border-orange-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>TERKECIL</p>
                              <p className="font-body text-orange-300 font-bold text-sm mt-0.5">{smallest.value}</p>
                              <p className="font-body text-white/40 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{smallest.label}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Diagram batang paling tepat dipakai untuk membandingkan nilai antar kategori. Gunakan warna berbeda untuk setiap batang agar lebih mudah dibaca!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Diagram Batang" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari diagram batang berikut, diketahui jumlah pengunjung perpustakaan selama 5 hari: Senin 40, Selasa 55, Rabu 30, Kamis 60, Jumat 45.<br />
                      Tentukan: (a) Hari dengan pengunjung terbanyak, (b) Total pengunjung seluruhnya.
                    </p>
                  </div>
                  {/* Diagram Batang Contoh 1 */}
                  <div className="bg-slate-900/70 border border-green-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3 text-center">📊 Diagram Batang — Pengunjung Perpustakaan</p>
                    <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto block" aria-label="Diagram batang pengunjung perpustakaan">
                      {/* Gridlines */}
                      {[0,20,40,60].map((v) => {
                        const y = 160 - (v/60)*150;
                        return (
                          <g key={v}>
                            <line x1="50" y1={y} x2="340" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
                            <text x="44" y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                          </g>
                        );
                      })}
                      {/* Y-axis label */}
                      <text x="12" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,12,90)">Pengunjung</text>
                      {/* Axes */}
                      <line x1="50" y1="10" x2="50" y2="160" stroke="#475569" strokeWidth="1.5" />
                      <line x1="50" y1="160" x2="340" y2="160" stroke="#475569" strokeWidth="1.5" />
                      {/* Bars */}
                      {[
                        { label:"Senin", val:40, x:63 },
                        { label:"Selasa", val:55, x:117 },
                        { label:"Rabu", val:30, x:171 },
                        { label:"Kamis", val:60, x:225 },
                        { label:"Jumat", val:45, x:279 },
                      ].map(({ label, val, x }) => {
                        const barH = (val/60)*150;
                        const y = 160 - barH;
                        const isMax = val === 60;
                        return (
                          <g key={label}>
                            <rect x={x} y={y} width="38" height={barH} rx="3"
                              fill={isMax ? "#22c55e" : "#16a34a"} opacity={isMax ? 1 : 0.7} />
                            <text x={x+19} y={y-4} textAnchor="middle" fontSize="9" fill={isMax ? "#86efac" : "#4ade80"} fontWeight="bold">{val}</text>
                            <text x={x+19} y="173" textAnchor="middle" fontSize="9" fill="#94a3b8">{label}</text>
                          </g>
                        );
                      })}
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">Batang terhijau = pengunjung terbanyak</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>(a)</strong> Batang tertinggi → <span className="text-green-400 font-semibold">Kamis (60 pengunjung)</span></p>
                      <p><strong>(b)</strong> Total pengunjung:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="40 + 55 + 30 + 60 + 45 = 230 \text{ pengunjung}" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data penjualan buku di toko "Pintar" dalam 4 bulan: Jan = 120, Feb = 95, Mar = 145, Apr = 110. Jika target penjualan per bulan adalah 115 buku, tentukan pada bulan mana target terpenuhi dan berapa buku di atas/bawah target?
                    </p>
                  </div>
                  {/* Diagram Batang Contoh 2 */}
                  <div className="bg-slate-900/70 border border-yellow-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3 text-center">📊 Diagram Batang — Penjualan Buku + Garis Target</p>
                    <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto block" aria-label="Diagram batang penjualan buku">
                      {/* Gridlines & Y labels */}
                      {[0,50,100,150].map((v) => {
                        const y = 160 - (v/160)*150;
                        return (
                          <g key={v}>
                            <line x1="50" y1={y} x2="300" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
                            <text x="44" y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                          </g>
                        );
                      })}
                      {/* Y-axis label */}
                      <text x="12" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,12,90)">Buku</text>
                      {/* Axes */}
                      <line x1="50" y1="10" x2="50" y2="160" stroke="#475569" strokeWidth="1.5" />
                      <line x1="50" y1="160" x2="300" y2="160" stroke="#475569" strokeWidth="1.5" />
                      {/* Bars */}
                      {[
                        { label:"Jan", val:120, x:65 },
                        { label:"Feb", val:95, x:125 },
                        { label:"Mar", val:145, x:185 },
                        { label:"Apr", val:110, x:245 },
                      ].map(({ label, val, x }) => {
                        const barH = (val/160)*150;
                        const y = 160 - barH;
                        const above = val >= 115;
                        return (
                          <g key={label}>
                            <rect x={x} y={y} width="42" height={barH} rx="3"
                              fill={above ? "#eab308" : "#b45309"} opacity={above ? 0.9 : 0.65} />
                            <text x={x+21} y={y-4} textAnchor="middle" fontSize="9" fill={above ? "#fef08a" : "#fcd34d"} fontWeight="bold">{val}</text>
                            <text x={x+21} y="173" textAnchor="middle" fontSize="9" fill="#94a3b8">{label}</text>
                          </g>
                        );
                      })}
                      {/* Target line at 115 */}
                      {(() => {
                        const ty = 160 - (115/160)*150;
                        return (
                          <g>
                            <line x1="50" y1={ty} x2="300" y2={ty} stroke="#f87171" strokeWidth="1.5" strokeDasharray="6 3" />
                            <text x="303" y={ty+4} fontSize="9" fill="#f87171" fontWeight="bold">115</text>
                            <text x="175" y={ty-5} textAnchor="middle" fontSize="8" fill="#f87171">Target</text>
                          </g>
                        );
                      })()}
                      {/* Legend */}
                      <rect x="60" y="185" width="10" height="8" rx="2" fill="#eab308" />
                      <text x="74" y="193" fontSize="8" fill="#94a3b8">Target terpenuhi</text>
                      <rect x="170" y="185" width="10" height="8" rx="2" fill="#b45309" opacity="0.65" />
                      <text x="184" y="193" fontSize="8" fill="#94a3b8">Di bawah target</text>
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">Garis merah = target 115 buku/bulan</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Jan: 120 &gt; 115 → <span className="text-green-400">✓ Terpenuhi</span>, surplus <InlineMath math="120-115 = 5" /> buku</p>
                        <p>Feb: 95 &lt; 115 → <span className="text-red-400">✗ Tidak terpenuhi</span>, kurang <InlineMath math="115-95 = 20" /> buku</p>
                        <p>Mar: 145 &gt; 115 → <span className="text-green-400">✓ Terpenuhi</span>, surplus <InlineMath math="145-115 = 30" /> buku</p>
                        <p>Apr: 110 &lt; 115 → <span className="text-red-400">✗ Tidak terpenuhi</span>, kurang <InlineMath math="115-110 = 5" /> buku</p>
                      </div>
                      <p><strong className="text-primary">Target terpenuhi di bulan Januari dan Maret.</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari diagram batang ganda (dua kelompok), diketahui nilai ulangan siswa Kelas A dan B per mata pelajaran:<br />
                      Matematika: A=78, B=82 | IPA: A=85, B=79 | Bhs.Indo: A=88, B=90 | IPS: A=75, B=74<br />
                      Pada mata pelajaran apa saja Kelas A lebih unggul dibanding Kelas B?
                    </p>
                  </div>
                  {/* Diagram Batang Ganda Contoh 3 */}
                  <div className="bg-slate-900/70 border border-red-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3 text-center">📊 Diagram Batang Ganda — Nilai Kelas A vs B</p>
                    <svg viewBox="0 0 380 215" className="w-full max-w-md mx-auto block" aria-label="Diagram batang ganda nilai kelas A dan B">
                      {/* Gridlines & Y labels (range 60–100) */}
                      {[60,70,80,90,100].map((v) => {
                        const y = 160 - ((v-60)/40)*150;
                        return (
                          <g key={v}>
                            <line x1="54" y1={y} x2="355" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
                            <text x="48" y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                          </g>
                        );
                      })}
                      {/* Y-axis label */}
                      <text x="12" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,12,90)">Nilai</text>
                      {/* Axes */}
                      <line x1="54" y1="10" x2="54" y2="160" stroke="#475569" strokeWidth="1.5" />
                      <line x1="54" y1="160" x2="355" y2="160" stroke="#475569" strokeWidth="1.5" />
                      {/* Grouped bars */}
                      {[
                        { label:"Matematika", a:78, b:82, gx:64 },
                        { label:"IPA",        a:85, b:79, gx:145 },
                        { label:"Bhs.Indo",   a:88, b:90, gx:226 },
                        { label:"IPS",        a:75, b:74, gx:307 },
                      ].map(({ label, a, b, gx }) => {
                        const hA = ((a-60)/40)*150;
                        const hB = ((b-60)/40)*150;
                        const yA = 160 - hA;
                        const yB = 160 - hB;
                        const aWins = a > b;
                        return (
                          <g key={label}>
                            {/* Bar A */}
                            <rect x={gx} y={yA} width="26" height={hA} rx="3"
                              fill="#22d3ee" opacity={aWins ? 1 : 0.55} />
                            <text x={gx+13} y={yA-4} textAnchor="middle" fontSize="8" fill="#67e8f9" fontWeight="bold">{a}</text>
                            {/* Bar B */}
                            <rect x={gx+29} y={yB} width="26" height={hB} rx="3"
                              fill="#fb923c" opacity={!aWins ? 1 : 0.55} />
                            <text x={gx+42} y={yB-4} textAnchor="middle" fontSize="8" fill="#fdba74" fontWeight="bold">{b}</text>
                            {/* X label */}
                            <text x={gx+27} y="174" textAnchor="middle" fontSize="8" fill="#94a3b8">{label}</text>
                          </g>
                        );
                      })}
                      {/* Legend */}
                      <rect x="80" y="188" width="12" height="9" rx="2" fill="#22d3ee" />
                      <text x="96" y="197" fontSize="9" fill="#94a3b8">Kelas A</text>
                      <rect x="160" y="188" width="12" height="9" rx="2" fill="#fb923c" />
                      <text x="176" y="197" fontSize="9" fill="#94a3b8">Kelas B</text>
                      <text x="240" y="197" fontSize="8" fill="#64748b">Warna terang = unggul</text>
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">Biru = Kelas A &nbsp;|&nbsp; Oranye = Kelas B &nbsp;|&nbsp; Warna lebih terang = lebih unggul</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Bandingkan A vs B per mata pelajaran dari diagram:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Matematika: A=78 vs B=82 → <span className="text-red-400">B unggul</span></p>
                        <p>IPA: A=85 vs B=79 → <span className="text-cyan-400">A unggul (+6)</span></p>
                        <p>Bhs.Indo: A=88 vs B=90 → <span className="text-red-400">B unggul</span></p>
                        <p>IPS: A=75 vs B=74 → <span className="text-cyan-400">A unggul (+1)</span></p>
                      </div>
                      <p><strong className="text-primary">Kelas A lebih unggul pada mata pelajaran IPA dan IPS.</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 3: DIAGRAM GARIS ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 3: Diagram Garis" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-purple-300">Diagram garis</strong> menghubungkan titik-titik data dengan garis lurus. Sangat efektif untuk menggambarkan <strong className="text-purple-300">perubahan data dari waktu ke waktu</strong> (tren), seperti pertumbuhan penduduk, perkembangan harga, atau perubahan suhu.
                  </p>
                </div>

                {/* Visual Diagram Garis */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl overflow-hidden">
                  <div className="bg-purple-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-purple-200 uppercase tracking-wide">📈 Contoh: Perkembangan Nilai Ulangan Bulanan</p>
                  </div>
                  <div className="p-4">
                    <div className="relative h-40 flex items-end px-2 pb-6">
                      {/* Grid + y-axis */}
                      <div className="absolute left-7 right-2 top-2 bottom-6">
                        {[0,1,2,3,4].map(i => (
                          <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i/4)*100}%` }} />
                        ))}
                      </div>
                      {/* Y labels */}
                      <div className="absolute left-0 top-2 bottom-6 flex flex-col justify-between">
                        {["100","80","60","40","20"].map(v => (
                          <span key={v} className="text-white/30 text-xs">{v}</span>
                        ))}
                      </div>
                      {/* SVG Line Chart */}
                      <svg className="absolute left-7 right-2 top-2 bottom-6 w-[calc(100%-2.25rem)] h-[calc(100%-2rem)]" viewBox="0 0 300 120" preserveAspectRatio="none">
                        <polyline
                          points="0,84 60,60 120,48 180,36 240,24 300,12"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                        {[[0,84],[60,60],[120,48],[180,36],[240,24],[300,12]].map(([x,y], i) => (
                          <circle key={i} cx={x} cy={y} r="5" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
                        ))}
                      </svg>
                      {/* X Labels */}
                      <div className="absolute bottom-0 left-7 right-2 flex justify-between">
                        {["Jan","Feb","Mar","Apr","Mei","Jun"].map(m => (
                          <span key={m} className="text-white/40 text-xs font-body">{m}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center mt-1">
                      {[["Jan","65"],["Feb","70"],["Mar","74"],["Apr","78"],["Mei","82"],["Jun","88"]].map(([m,v]) => (
                        <div key={m} className="text-center">
                          <p className="text-purple-300 text-xs font-bold">{v}</p>
                          <p className="text-white/40 text-xs">{m}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">📌 Cara Membaca Diagram Garis</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p>• <strong className="text-purple-300">Garis naik</strong> → data meningkat</p>
                    <p>• <strong className="text-purple-300">Garis turun</strong> → data menurun</p>
                    <p>• <strong className="text-purple-300">Garis datar</strong> → data stabil/tetap</p>
                    <p>• Semakin curam garis → semakin besar perubahannya</p>
                  </div>
                </div>

                {/* ===== DIAGRAM GARIS INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-purple-500/30 rounded-xl overflow-hidden">
                  <div className="bg-purple-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-purple-200">🛠️ Coba Sendiri — Buat Diagram Garis</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Isi tabel dengan data kamu — tambah atau hapus baris sesuai kebutuhan (minimal 2 baris), lalu klik{" "}
                      <strong className="text-purple-300">Buat Diagram Garis</strong> untuk melihat hasilnya secara animasi!
                    </p>

                    {/* Table */}
                    <div className="rounded-lg overflow-hidden border border-slate-600/50">
                      <div className="grid bg-purple-950/60" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                        <div className="px-3 py-2 font-body text-xs font-bold text-purple-300 uppercase tracking-wide">Label (waktu/kategori)</div>
                        <div className="px-3 py-2 font-body text-xs font-bold text-purple-300 uppercase tracking-wide">Nilai</div>
                        <div />
                      </div>
                      <div className="divide-y divide-slate-700/40">
                        {lineRows.map((row) => (
                          <div key={row.id} className="grid items-center gap-2 px-2 py-1.5 bg-slate-900/30" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) => updateLineRow(row.id, "label", e.target.value)}
                              placeholder="Contoh: Jan"
                              className="w-full bg-slate-800/60 border border-slate-600/50 rounded px-2 py-1.5 text-xs font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-purple-400/60 transition-colors"
                            />
                            <input
                              type="number"
                              value={row.value}
                              onChange={(e) => updateLineRow(row.id, "value", e.target.value)}
                              placeholder="0"
                              className="w-full bg-slate-800/60 border border-slate-600/50 rounded px-2 py-1.5 text-xs font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-purple-400/60 transition-colors"
                            />
                            <button
                              onClick={() => removeLineRow(row.id)}
                              disabled={lineRows.length <= 2}
                              className="w-8 h-8 flex items-center justify-center rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={addLineRow}
                        disabled={lineRows.length >= 12}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-500/40 text-white/75 text-xs font-body font-semibold hover:bg-slate-600/60 hover:border-slate-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                      >
                        ＋ Tambah Baris
                        {lineRows.length >= 12 && <span className="text-white/30">(maks 12)</span>}
                      </button>

                      <button
                        onClick={convertToLineChart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 border border-purple-500/50 text-white text-xs font-body font-bold hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        Buat Diagram Garis
                      </button>

                      {lineChartVisible && (
                        <button
                          onClick={resetLineChart}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >↺ Reset</button>
                      )}
                    </div>

                    {/* Animated Line Chart Result */}
                    {lineChartVisible && lineChartData.length >= 2 && (() => {
                      const n = lineChartData.length;
                      const vals = lineChartData.map(d => d.value);
                      const minVal = Math.min(...vals);
                      const maxVal = Math.max(...vals);
                      const range = maxVal - minVal || 1;
                      const total = vals.reduce((a, b) => a + b, 0);
                      const avg = (total / n).toFixed(1);
                      const maxPoint = lineChartData.reduce((a, b) => a.value >= b.value ? a : b);
                      const minPoint = lineChartData.reduce((a, b) => a.value <= b.value ? a : b);
                      const trendDiff = vals[n - 1] - vals[0];
                      const trendLabel = trendDiff > 0 ? `📈 Naik +${trendDiff}` : trendDiff < 0 ? `📉 Turun ${trendDiff}` : "➡️ Stabil";
                      const trendColor = trendDiff > 0 ? "text-green-400" : trendDiff < 0 ? "text-red-400" : "text-yellow-400";

                      const SVG_W = 400, SVG_H = 170;
                      const PAD_L = 38, PAD_R = 14, PAD_T = 16, PAD_B = 32;
                      const CW = SVG_W - PAD_L - PAD_R;
                      const CH = SVG_H - PAD_T - PAD_B;

                      const px = (i: number) => PAD_L + (n === 1 ? CW / 2 : (i / (n - 1)) * CW);
                      const py = (v: number) => PAD_T + (1 - (v - minVal) / range) * CH;

                      const pointsStr = lineChartData.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");
                      const areaPoints = `${px(0)},${PAD_T + CH} ${pointsStr} ${px(n - 1)},${PAD_T + CH}`;

                      const ySteps = 4;
                      const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
                        Math.round(maxVal - (range * i) / ySteps)
                      );

                      return (
                        <div className="bg-slate-900/60 border border-purple-500/20 rounded-xl p-4 space-y-3">
                          <p className="font-body text-xs font-bold text-purple-300 text-center uppercase tracking-wider">📈 Hasil Diagram Garis</p>

                          {/* SVG Chart */}
                          <div className="w-full overflow-x-auto">
                            <svg
                              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                              className="w-full"
                              style={{ minWidth: "260px", maxHeight: "200px" }}
                            >
                              {/* Grid + Y labels */}
                              {yLabels.map((v, i) => {
                                const y = PAD_T + (i / ySteps) * CH;
                                return (
                                  <g key={i}>
                                    <line
                                      x1={PAD_L} y1={y} x2={SVG_W - PAD_R} y2={y}
                                      stroke={i === ySteps ? "#475569" : "#1e293b"}
                                      strokeWidth={i === ySteps ? 1.5 : 1}
                                      strokeDasharray={i > 0 && i < ySteps ? "4 3" : undefined}
                                    />
                                    <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize="9" fill="#64748b">{v}</text>
                                  </g>
                                );
                              })}

                              {/* X labels */}
                              {lineChartData.map((d, i) => (
                                <text
                                  key={`xl-${i}`}
                                  x={px(i)} y={SVG_H - 6}
                                  textAnchor="middle" fontSize="9" fill="#64748b"
                                  style={{
                                    opacity: lineChartAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${0.2 + i * 0.05}s`,
                                  }}
                                >{d.label}</text>
                              ))}

                              {/* Area fill */}
                              <polygon
                                points={areaPoints}
                                fill="rgba(168,85,247,0.07)"
                                style={{
                                  opacity: lineChartAnimated ? 1 : 0,
                                  transition: "opacity 0.7s ease 1.0s",
                                }}
                              />

                              {/* Animated line */}
                              <polyline
                                points={pointsStr}
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="2000"
                                style={{
                                  strokeDashoffset: lineChartAnimated ? 0 : 2000,
                                  transition: "stroke-dashoffset 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.05s",
                                }}
                              />

                              {/* Data points + value labels */}
                              {lineChartData.map((d, i) => (
                                <g
                                  key={`pt-${i}`}
                                  style={{
                                    opacity: lineChartAnimated ? 1 : 0,
                                    transition: `opacity 0.25s ease ${0.1 + i * 0.1}s`,
                                  }}
                                >
                                  <circle cx={px(i)} cy={py(d.value)} r="5" fill="#a855f7" stroke="#0f172a" strokeWidth="1.5" />
                                  <text
                                    x={px(i)}
                                    y={py(d.value) - 8}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fontWeight="bold"
                                    fill="#e2e8f0"
                                  >{d.value}</text>
                                </g>
                              ))}
                            </svg>
                          </div>

                          {/* Stats row */}
                          <div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                            style={{
                              opacity: lineChartAnimated ? 1 : 0,
                              transition: "opacity 0.5s ease 1.3s",
                            }}
                          >
                            <div className="bg-purple-900/25 border border-purple-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>TREN</p>
                              <p className={`font-body font-bold text-xs mt-0.5 ${trendColor}`}>{trendLabel}</p>
                            </div>
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>TERTINGGI</p>
                              <p className="font-body text-green-300 font-bold text-sm mt-0.5">{maxPoint.value}</p>
                              <p className="font-body text-white/35 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{maxPoint.label}</p>
                            </div>
                            <div className="bg-blue-900/25 border border-blue-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>RATA-RATA</p>
                              <p className="font-body text-blue-300 font-bold text-sm mt-0.5">{avg}</p>
                            </div>
                            <div className="bg-orange-900/25 border border-orange-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>TERENDAH</p>
                              <p className="font-body text-orange-300 font-bold text-sm mt-0.5">{minPoint.value}</p>
                              <p className="font-body text-white/35 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{minPoint.label}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Diagram garis ideal untuk data berurutan waktu (harian, bulanan, tahunan). Kalau mau membandingkan dua kelompok, gunakan dua garis dengan warna berbeda dalam satu diagram.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Diagram Garis" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Suhu udara di suatu kota selama 6 jam dicatat: 06.00 = 22°C, 08.00 = 25°C, 10.00 = 28°C, 12.00 = 32°C, 14.00 = 30°C, 16.00 = 27°C.<br />
                      Pada jam berapa suhu tertinggi terjadi, dan bagaimana trennya setelah itu?
                    </p>
                  </div>
                  {/* Diagram Garis Contoh 1 */}
                  <div className="bg-slate-900/70 border border-green-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3 text-center">📈 Diagram Garis — Suhu Udara per Jam</p>
                    <svg viewBox="0 0 360 195" className="w-full max-w-sm mx-auto block" aria-label="Diagram garis suhu udara">
                      {(() => {
                        const data = [
                          { label:"06.00", val:22 }, { label:"08.00", val:25 },
                          { label:"10.00", val:28 }, { label:"12.00", val:32 },
                          { label:"14.00", val:30 }, { label:"16.00", val:27 },
                        ];
                        const minV=20, maxV=34, L=55, R=340, T=10, B=160;
                        const W=R-L, H=B-T;
                        const step=W/(data.length-1);
                        const xs=data.map((_,i)=>L+i*step);
                        const ys=data.map(d=>B-((d.val-minV)/(maxV-minV))*H);
                        const pts=xs.map((x,i)=>`${x},${ys[i]}`).join(" ");
                        return (
                          <>
                            {[20,24,28,32].map(v=>{
                              const y=B-((v-minV)/(maxV-minV))*H;
                              return <g key={v}>
                                <line x1={L} y1={y} x2={R} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3"/>
                                <text x={L-5} y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}°</text>
                              </g>;
                            })}
                            <text x="14" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,14,90)">Suhu (°C)</text>
                            <line x1={L} y1={T} x2={L} y2={B} stroke="#475569" strokeWidth="1.5"/>
                            <line x1={L} y1={B} x2={R} y2={B} stroke="#475569" strokeWidth="1.5"/>
                            <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                            {data.map((d,i)=>(
                              <g key={d.label}>
                                <circle cx={xs[i]} cy={ys[i]} r={d.val===32?6:4}
                                  fill={d.val===32?"#f87171":"#a78bfa"} stroke="#0f172a" strokeWidth="1.5"/>
                                <text x={xs[i]} y={ys[i]-9} textAnchor="middle" fontSize="8"
                                  fill={d.val===32?"#fca5a5":"#ddd6fe"} fontWeight={d.val===32?"bold":"normal"}>{d.val}°</text>
                                <text x={xs[i]} y={B+13} textAnchor="middle" fontSize="8" fill="#94a3b8">{d.label}</text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">Titik merah = suhu tertinggi (32°C pukul 12.00)</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>• Suhu tertinggi: <span className="text-red-400 font-semibold">32°C pada pukul 12.00</span></p>
                      <p>• Tren 06.00–12.00 → <span className="text-green-400">naik terus (garis naik)</span></p>
                      <p>• Tren 12.00–16.00 → <span className="text-blue-400">turun (garis turun)</span></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-green-300">Setelah pukul 12.00, suhu menurun menuju sore hari.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Penjualan minuman A (ml × 1000): Jan=80, Feb=95, Mar=90, Apr=110, Mei=105, Jun=120.<br />
                      Tentukan bulan dengan penjualan tertinggi dan terendah, serta identifikasi tren perubahan penjualan!
                    </p>
                  </div>
                  {/* Diagram Garis Contoh 2 */}
                  <div className="bg-slate-900/70 border border-yellow-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3 text-center">📈 Diagram Garis — Penjualan Minuman A (×1000 ml)</p>
                    <svg viewBox="0 0 360 195" className="w-full max-w-sm mx-auto block" aria-label="Diagram garis penjualan minuman">
                      {(() => {
                        const data = [
                          { label:"Jan", val:80 }, { label:"Feb", val:95 },
                          { label:"Mar", val:90 }, { label:"Apr", val:110 },
                          { label:"Mei", val:105 }, { label:"Jun", val:120 },
                        ];
                        const minV=70, maxV=130, L=55, R=340, T=10, B=160;
                        const W=R-L, H=B-T;
                        const step=W/(data.length-1);
                        const xs=data.map((_,i)=>L+i*step);
                        const ys=data.map(d=>B-((d.val-minV)/(maxV-minV))*H);
                        const pts=xs.map((x,i)=>`${x},${ys[i]}`).join(" ");
                        return (
                          <>
                            {[70,90,110,130].map(v=>{
                              const y=B-((v-minV)/(maxV-minV))*H;
                              return <g key={v}>
                                <line x1={L} y1={y} x2={R} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3"/>
                                <text x={L-5} y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                              </g>;
                            })}
                            <text x="14" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,14,90)">×1000 ml</text>
                            <line x1={L} y1={T} x2={L} y2={B} stroke="#475569" strokeWidth="1.5"/>
                            <line x1={L} y1={B} x2={R} y2={B} stroke="#475569" strokeWidth="1.5"/>
                            <polyline points={pts} fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                            {data.map((d,i)=>{
                              const isMax=d.val===120, isMin=d.val===80;
                              return (
                                <g key={d.label}>
                                  <circle cx={xs[i]} cy={ys[i]} r={isMax||isMin?6:4}
                                    fill={isMax?"#22c55e":isMin?"#f87171":"#eab308"} stroke="#0f172a" strokeWidth="1.5"/>
                                  <text x={xs[i]} y={ys[i]-9} textAnchor="middle" fontSize="8"
                                    fill={isMax?"#86efac":isMin?"#fca5a5":"#fef08a"} fontWeight={isMax||isMin?"bold":"normal"}>{d.val}</text>
                                  <text x={xs[i]} y={B+13} textAnchor="middle" fontSize="8" fill="#94a3b8">{d.label}</text>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">Hijau = tertinggi (Jun) &nbsp;|&nbsp; Merah = terendah (Jan)</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Jan: 80 | Feb: 95 (+15) | Mar: 90 (−5) | Apr: 110 (+20) | Mei: 105 (−5) | Jun: 120 (+15)</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• Penjualan <span className="text-green-400 font-semibold">tertinggi</span> → Juni (120 × 1000 ml)</p>
                        <p>• Penjualan <span className="text-red-400 font-semibold">terendah</span> → Januari (80 × 1000 ml)</p>
                        <p>• Tren umum: <span className="text-yellow-400">meningkat</span> dari Januari ke Juni, meski ada sedikit turun di Maret dan Mei</p>
                      </div>
                      <p><strong className="text-primary">Penjualan tertinggi di bulan Juni, terendah di Januari, dengan tren meningkat secara keseluruhan.</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dua produk, X dan Y, memiliki data penjualan (unit) per kuartal:<br />
                      Q1: X=200, Y=150 | Q2: X=220, Y=180 | Q3: X=210, Y=220 | Q4: X=240, Y=260<br />
                      (a) Pada kuartal berapa Y mulai melampaui X? (b) Hitung selisih total penjualan X dan Y selama setahun!
                    </p>
                  </div>
                  {/* Diagram Garis Ganda Contoh 3 */}
                  <div className="bg-slate-900/70 border border-red-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3 text-center">📈 Diagram Garis Ganda — Penjualan Produk X vs Y</p>
                    <svg viewBox="0 0 360 210" className="w-full max-w-sm mx-auto block" aria-label="Diagram garis ganda produk X dan Y">
                      {(() => {
                        const dataX = [
                          { label:"Q1", val:200 }, { label:"Q2", val:220 },
                          { label:"Q3", val:210 }, { label:"Q4", val:240 },
                        ];
                        const dataY = [
                          { label:"Q1", val:150 }, { label:"Q2", val:180 },
                          { label:"Q3", val:220 }, { label:"Q4", val:260 },
                        ];
                        const minV=130, maxV=270, L=55, R=330, T=10, B=160;
                        const W=R-L, H=B-T;
                        const step=W/(dataX.length-1);
                        const xs=dataX.map((_,i)=>L+i*step);
                        const yOf=(v: number)=>B-((v-minV)/(maxV-minV))*H;
                        const ysX=dataX.map(d=>yOf(d.val));
                        const ysY=dataY.map(d=>yOf(d.val));
                        const ptsX=xs.map((x,i)=>`${x},${ysX[i]}`).join(" ");
                        const ptsY=xs.map((x,i)=>`${x},${ysY[i]}`).join(" ");
                        return (
                          <>
                            {[140,170,200,230,260].map(v=>{
                              const y=yOf(v);
                              return <g key={v}>
                                <line x1={L} y1={y} x2={R} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3"/>
                                <text x={L-5} y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                              </g>;
                            })}
                            <text x="14" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,14,90)">Unit</text>
                            <line x1={L} y1={T} x2={L} y2={B} stroke="#475569" strokeWidth="1.5"/>
                            <line x1={L} y1={B} x2={R} y2={B} stroke="#475569" strokeWidth="1.5"/>
                            {/* crossing area marker at Q3 */}
                            <line x1={xs[2]} y1={T} x2={xs[2]} y2={B} stroke="#f87171" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                            <text x={xs[2]} y={T+8} textAnchor="middle" fontSize="8" fill="#f87171">Y melampaui X</text>
                            {/* Line X (cyan) */}
                            <polyline points={ptsX} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                            {/* Line Y (orange) */}
                            <polyline points={ptsY} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                            {/* Dots X */}
                            {dataX.map((d,i)=>(
                              <g key={`x${i}`}>
                                <circle cx={xs[i]} cy={ysX[i]} r="4" fill="#22d3ee" stroke="#0f172a" strokeWidth="1.5"/>
                                <text x={xs[i]-8} y={ysX[i]-8} textAnchor="middle" fontSize="8" fill="#67e8f9">{d.val}</text>
                              </g>
                            ))}
                            {/* Dots Y */}
                            {dataY.map((d,i)=>(
                              <g key={`y${i}`}>
                                <circle cx={xs[i]} cy={ysY[i]} r="4" fill="#fb923c" stroke="#0f172a" strokeWidth="1.5"/>
                                <text x={xs[i]+8} y={ysY[i]-8} textAnchor="middle" fontSize="8" fill="#fdba74">{d.val}</text>
                                <text x={xs[i]} y={B+13} textAnchor="middle" fontSize="8" fill="#94a3b8">{d.label}</text>
                              </g>
                            ))}
                            {/* Legend */}
                            <line x1="70" y1="185" x2="90" y2="185" stroke="#22d3ee" strokeWidth="2.5"/>
                            <circle cx="80" cy="185" r="3" fill="#22d3ee"/>
                            <text x="94" y="189" fontSize="9" fill="#94a3b8">Produk X</text>
                            <line x1="175" y1="185" x2="195" y2="185" stroke="#fb923c" strokeWidth="2.5"/>
                            <circle cx="185" cy="185" r="3" fill="#fb923c"/>
                            <text x="199" y="189" fontSize="9" fill="#94a3b8">Produk Y</text>
                          </>
                        );
                      })()}
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">Garis putus merah = titik Y mulai melampaui X (Q3)</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>(a)</strong> Bandingkan X vs Y per kuartal:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Q1: X=200 &gt; Y=150 → X unggul</p>
                        <p>Q2: X=220 &gt; Y=180 → X unggul</p>
                        <p>Q3: X=210 &lt; Y=220 → <span className="text-red-400">Y mulai unggul!</span></p>
                        <p>Q4: X=240 &lt; Y=260 → Y tetap unggul</p>
                      </div>
                      <p>→ Y mulai melampaui X pada <strong className="text-red-300">Kuartal 3 (Q3)</strong></p>
                      <p><strong>(b)</strong> Total penjualan:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Total X} = 200+220+210+240 = 870 \text{ unit}" />
                        <BlockMath math="\text{Total Y} = 150+180+220+260 = 810 \text{ unit}" />
                        <BlockMath math="\text{Selisih} = 870 - 810 = 60 \text{ unit}" />
                      </div>
                      <p><strong className="text-primary">Y unggul mulai Q3; total X lebih banyak 60 unit dari Y.</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 4: DIAGRAM LINGKARAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Sub-Bab 4: Diagram Lingkaran (Pie Chart)" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">Diagram lingkaran</strong> membagi lingkaran menjadi sektor-sektor yang menggambarkan proporsi tiap data terhadap keseluruhan. Ideal untuk menunjukkan <strong className="text-orange-300">persentase atau bagian dari total</strong>.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-orange-300 mb-2">Rumus Konversi:</p>
                    <BlockMath math="\text{Sudut sektor} = \frac{f_i}{\sum f} \times 360°" />
                    <BlockMath math="\text{Persentase} = \frac{f_i}{\sum f} \times 100\%" />
                    <p className="font-body text-xs text-white/60 mt-2">
                      Di mana <InlineMath math="f_i" /> = frekuensi kategori ke-<InlineMath math="i" />, <InlineMath math="\sum f" /> = total frekuensi
                    </p>
                  </div>
                </div>

                {/* Visual Diagram Lingkaran */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl overflow-hidden">
                  <div className="bg-orange-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-orange-200 uppercase tracking-wide">🥧 Contoh: Jenis Transportasi yang Digunakan Siswa</p>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row items-center gap-6">
                    {/* SVG Pie Chart */}
                    <svg viewBox="0 0 200 200" className="w-44 h-44 shrink-0">
                      {/* Jalan kaki 25% = 90° */}
                      <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#f97316" opacity="0.85" />
                      {/* Sepeda 20% = 72° */}
                      <path d="M100,100 L190,100 A90,90 0 0,1 127.8,190 Z" fill="#a855f7" opacity="0.85" />
                      {/* Angkot 30% = 108° */}
                      <path d="M100,100 L127.8,190 A90,90 0 0,1 10,127.8 Z" fill="#22d3ee" opacity="0.85" />
                      {/* Motor 15% = 54° */}
                      <path d="M100,100 L10,127.8 A90,90 0 0,1 10,72.2 Z" fill="#4ade80" opacity="0.85" />
                      {/* Mobil 10% = 36° */}
                      <path d="M100,100 L10,72.2 A90,90 0 0,1 100,10 Z" fill="#f43f5e" opacity="0.85" />
                      <circle cx="100" cy="100" r="35" fill="#1e293b" />
                      <text x="100" y="95" textAnchor="middle" fill="var(--icon-color)" fontSize="10" fontWeight="bold">DATA</text>
                      <text x="100" y="110" textAnchor="middle" fill="#94a3b8" fontSize="8">TRANSPORTASI</text>
                    </svg>
                    {/* Legenda */}
                    <div className="space-y-2 w-full">
                      {[
                        { label: "Jalan Kaki", pct: "25%", sudut: "90°", color: "bg-orange-500" },
                        { label: "Sepeda", pct: "20%", sudut: "72°", color: "bg-purple-500" },
                        { label: "Angkot", pct: "30%", sudut: "108°", color: "bg-cyan-400" },
                        { label: "Motor", pct: "15%", sudut: "54°", color: "bg-green-400" },
                        { label: "Mobil", pct: "10%", sudut: "36°", color: "bg-rose-500" },
                      ].map(({ label, pct, sudut, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-sm shrink-0 ${color}`} />
                          <span className="font-body text-xs text-white/80 flex-1">{label}</span>
                          <span className="font-body text-xs text-orange-300 font-bold w-10 text-right">{pct}</span>
                          <span className="font-body text-xs text-white/40 w-10 text-right">{sudut}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ===== DIAGRAM LINGKARAN INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-orange-500/30 rounded-xl overflow-hidden">
                  <div className="bg-orange-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-orange-200">🛠️ Coba Sendiri — Buat Diagram Lingkaran</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Isi tabel dengan kategori dan frekuensinya (nilai &gt; 0), tambah atau hapus baris sesuai kebutuhan, lalu klik{" "}
                      <strong className="text-orange-300">Buat Diagram Lingkaran</strong>. Gunakan tombol{" "}
                      <strong className="text-orange-300">% Persen</strong> dan <strong className="text-orange-300">° Derajat</strong> untuk beralih tampilan!
                    </p>

                    {/* Table */}
                    <div className="rounded-lg overflow-hidden border border-slate-600/50">
                      <div className="grid bg-orange-950/60" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                        <div className="px-3 py-2 font-body text-xs font-bold text-orange-300 uppercase tracking-wide">Kategori / Label</div>
                        <div className="px-3 py-2 font-body text-xs font-bold text-orange-300 uppercase tracking-wide">Frekuensi</div>
                        <div />
                      </div>
                      <div className="divide-y divide-slate-700/40">
                        {pieRows.map((row, idx) => (
                          <div key={row.id} className="grid items-center gap-2 px-2 py-1.5 bg-slate-900/30" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                              <input
                                type="text"
                                value={row.label}
                                onChange={(e) => updatePieRow(row.id, "label", e.target.value)}
                                placeholder="Contoh: Pramuka"
                                className="w-full bg-slate-800/60 border border-slate-600/50 rounded px-2 py-1.5 text-xs font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-orange-400/60 transition-colors"
                              />
                            </div>
                            <input
                              type="number"
                              value={row.value}
                              onChange={(e) => updatePieRow(row.id, "value", e.target.value)}
                              placeholder="0"
                              min="1"
                              className="w-full bg-slate-800/60 border border-slate-600/50 rounded px-2 py-1.5 text-xs font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-orange-400/60 transition-colors"
                            />
                            <button
                              onClick={() => removePieRow(row.id)}
                              disabled={pieRows.length <= 2}
                              className="w-8 h-8 flex items-center justify-center rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={addPieRow}
                        disabled={pieRows.length >= 10}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-500/40 text-white/75 text-xs font-body font-semibold hover:bg-slate-600/60 hover:border-slate-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                      >
                        ＋ Tambah Baris
                        {pieRows.length >= 10 && <span className="text-white/30">(maks 10)</span>}
                      </button>

                      <button
                        onClick={buildPieChart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 border border-orange-500/50 text-white text-xs font-body font-bold hover:bg-orange-500 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        Buat Diagram Lingkaran
                      </button>

                      {pieVisible && (
                        <button
                          onClick={resetPie}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >↺ Reset</button>
                      )}
                    </div>

                    {/* Animated Pie Chart Result */}
                    {pieVisible && pieData.length >= 2 && (() => {
                      const total = pieData.reduce((s, d) => s + d.value, 0);
                      const CX = 100, CY = 100, R = 78, R_INNER = 34;

                      // Build SVG arc paths
                      let curAngle = -Math.PI / 2;
                      const slices = pieData.map((d, i) => {
                        const sweep  = (d.sudut / 360) * 2 * Math.PI;
                        const start  = curAngle;
                        const end    = curAngle + sweep;
                        curAngle     = end;
                        const mid    = start + sweep / 2;
                        const large  = sweep > Math.PI ? 1 : 0;
                        const x1 = CX + R * Math.cos(start);
                        const y1 = CY + R * Math.sin(start);
                        const x2 = CX + R * Math.cos(end);
                        const y2 = CY + R * Math.sin(end);
                        const lx = CX + (R * 0.67) * Math.cos(mid);
                        const ly = CY + (R * 0.67) * Math.sin(mid);
                        return {
                          path: `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`,
                          color: PIE_COLORS[i % PIE_COLORS.length],
                          lx, ly, sweep,
                          ...d,
                        };
                      });

                      return (
                        <div className="bg-slate-900/60 border border-orange-500/20 rounded-xl p-4 space-y-4">

                          {/* Unit toggle */}
                          <div className="flex items-center justify-between">
                            <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wider">🥧 Hasil Diagram Lingkaran</p>
                            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-600/50 rounded-lg p-1">
                              <button
                                onClick={() => setPieMode("persen")}
                                className={`px-3 py-1 rounded-md text-xs font-body font-bold transition-all ${
                                  pieMode === "persen"
                                    ? "bg-orange-500 text-white shadow"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                              >% Persen</button>
                              <button
                                onClick={() => setPieMode("derajat")}
                                className={`px-3 py-1 rounded-md text-xs font-body font-bold transition-all ${
                                  pieMode === "derajat"
                                    ? "bg-violet-500 text-white shadow"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                              >° Derajat</button>
                            </div>
                          </div>

                          {/* Chart + legend */}
                          <div className="flex flex-col sm:flex-row items-center gap-5">

                            {/* SVG Pie */}
                            <div className="shrink-0">
                              <svg viewBox="0 0 200 200" style={{ width: "180px", height: "180px" }}>
                                {slices.map((s, i) => (
                                  <path
                                    key={i}
                                    d={s.path}
                                    fill={s.color}
                                    stroke="#0f172a"
                                    strokeWidth="1.2"
                                    style={{
                                      transformBox: "view-box" as React.CSSProperties["transformBox"],
                                      transformOrigin: "50% 50%",
                                      opacity: pieAnimated ? 0.88 : 0,
                                      transform: pieAnimated ? "scale(1)" : "scale(0.3)",
                                      transition: `opacity 0.35s ease ${i * 0.1}s, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
                                    }}
                                  />
                                ))}

                                {/* Inner donut hole */}
                                <circle
                                  cx={CX} cy={CY} r={R_INNER}
                                  fill="#0f172a"
                                  style={{
                                    opacity: pieAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${pieData.length * 0.1 + 0.1}s`,
                                  }}
                                />

                                {/* Center text */}
                                <text
                                  x={CX} y={CY - 5}
                                  textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fdba74"
                                  style={{
                                    opacity: pieAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${pieData.length * 0.1 + 0.25}s`,
                                  }}
                                >TOTAL</text>
                                <text
                                  x={CX} y={CY + 7}
                                  textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff"
                                  style={{
                                    opacity: pieAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${pieData.length * 0.1 + 0.3}s`,
                                  }}
                                >{total}</text>
                                <text
                                  x={CX} y={CY + 17}
                                  textAnchor="middle" fontSize="7" fill="#94a3b8"
                                  style={{
                                    opacity: pieAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${pieData.length * 0.1 + 0.35}s`,
                                  }}
                                >data</text>

                                {/* Slice value labels (only show if sector is large enough) */}
                                {slices.map((s, i) =>
                                  s.sweep > 0.28 ? (
                                    <text
                                      key={`lbl-${i}`}
                                      x={s.lx.toFixed(1)} y={(s.ly + 3).toFixed(1)}
                                      textAnchor="middle" fontSize="8.5" fontWeight="bold"
                                      fill="#ffffff"
                                      style={{
                                        opacity: pieAnimated ? 1 : 0,
                                        transition: `opacity 0.3s ease ${i * 0.1 + 0.3}s`,
                                      }}
                                    >
                                      {pieMode === "persen" ? `${s.pct}%` : `${s.sudut}°`}
                                    </text>
                                  ) : null
                                )}
                              </svg>
                            </div>

                            {/* Legend */}
                            <div
                              className="flex-1 w-full space-y-1.5"
                              style={{
                                opacity: pieAnimated ? 1 : 0,
                                transition: `opacity 0.4s ease ${pieData.length * 0.1 + 0.2}s`,
                              }}
                            >
                              {/* Header row */}
                              <div className="grid text-xs font-body font-bold uppercase tracking-wide text-white/35 pb-1 border-b border-slate-700/50" style={{ gridTemplateColumns: "1fr 48px 52px 52px" }}>
                                <span>Kategori</span>
                                <span className="text-right">Freq</span>
                                <span className={`text-right transition-colors ${pieMode === "persen" ? "text-orange-400" : "text-white/35"}`}>%</span>
                                <span className={`text-right transition-colors ${pieMode === "derajat" ? "text-violet-400" : "text-white/35"}`}>°</span>
                              </div>
                              {slices.map((s, i) => (
                                <div key={i} className="grid items-center gap-1" style={{ gridTemplateColumns: "1fr 48px 52px 52px" }}>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                                    <span className="font-body text-xs text-white/80 truncate">{s.label}</span>
                                  </div>
                                  <span className="font-body text-xs text-white/55 text-right">{s.value}</span>
                                  <span
                                    className="font-body text-xs font-bold text-right transition-all"
                                    style={{
                                      color: pieMode === "persen" ? "#fb923c" : "#94a3b8",
                                      fontSize: pieMode === "persen" ? "12px" : "10px",
                                    }}
                                  >{s.pct}%</span>
                                  <span
                                    className="font-body text-xs font-bold text-right transition-all"
                                    style={{
                                      color: pieMode === "derajat" ? "#c084fc" : "#94a3b8",
                                      fontSize: pieMode === "derajat" ? "12px" : "10px",
                                    }}
                                  >{s.sudut}°</span>
                                </div>
                              ))}
                              {/* Totals row */}
                              <div className="grid items-center gap-1 pt-1.5 border-t border-slate-700/50" style={{ gridTemplateColumns: "1fr 48px 52px 52px" }}>
                                <span className="font-body text-xs font-bold text-white/60">TOTAL</span>
                                <span className="font-body text-xs font-bold text-white/60 text-right">{total}</span>
                                <span className="font-body text-xs font-bold text-orange-400/80 text-right">100%</span>
                                <span className="font-body text-xs font-bold text-violet-400/80 text-right">360°</span>
                              </div>
                            </div>
                          </div>

                          {/* Formula reminder */}
                          <div
                            className="grid grid-cols-2 gap-2"
                            style={{
                              opacity: pieAnimated ? 1 : 0,
                              transition: `opacity 0.4s ease ${pieData.length * 0.1 + 0.5}s`,
                            }}
                          >
                            <div className={`rounded-lg px-3 py-2 text-center border transition-all ${pieMode === "persen" ? "bg-orange-900/30 border-orange-500/40" : "bg-slate-800/40 border-slate-600/30"}`}>
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>RUMUS PERSEN</p>
                              <p className="font-body text-orange-300 font-bold text-xs mt-0.5">(f / total) × 100%</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 text-center border transition-all ${pieMode === "derajat" ? "bg-violet-900/30 border-violet-500/40" : "bg-slate-800/40 border-slate-600/30"}`}>
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>RUMUS DERAJAT</p>
                              <p className="font-body text-violet-300 font-bold text-xs mt-0.5">(f / total) × 360°</p>
                            </div>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Cek:</strong> Jumlah semua sudut sektor harus = 360°, dan jumlah semua persentase harus = 100%. Selalu lakukan pengecekan ini setelah membuat diagram lingkaran!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title="📝 Contoh Soal — Diagram Lingkaran" />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari diagram lingkaran diketahui persentase buah favorit 100 siswa: Mangga 35%, Jeruk 25%, Apel 20%, Pisang 15%, Lainnya 5%.<br />
                      Tentukan jumlah siswa yang menyukai mangga dan besar sudut sektornya!
                    </p>
                  </div>
                  {/* Diagram Lingkaran Contoh 1 */}
                  <div className="bg-slate-900/70 border border-green-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3 text-center">🥧 Diagram Lingkaran — Buah Favorit 100 Siswa</p>
                    <svg viewBox="0 0 380 200" className="w-full max-w-md mx-auto block" aria-label="Diagram lingkaran buah favorit">
                      {(() => {
                        const cx=115, cy=98, r=82;
                        const slices = [
                          { label:"Mangga", sub:"35% · 126°", pct:35, color:"#22c55e", highlight:true },
                          { label:"Jeruk",  sub:"25% · 90°",  pct:25, color:"#f97316" },
                          { label:"Apel",   sub:"20% · 72°",  pct:20, color:"#3b82f6" },
                          { label:"Pisang", sub:"15% · 54°",  pct:15, color:"#eab308" },
                          { label:"Lainnya",sub:"5% · 18°",   pct:5,  color:"#94a3b8" },
                        ];
                        let cum=0;
                        const computed = slices.map(s=>{
                          const s0=(cum/100)*360-90, s1=((cum+s.pct)/100)*360-90;
                          cum+=s.pct;
                          return {...s,s0,s1};
                        });
                        const toRad=(d: number)=>d*Math.PI/180;
                        const arc=(s: typeof computed[0])=>{
                          const a0=toRad(s.s0), a1=toRad(s.s1);
                          const x1=cx+r*Math.cos(a0), y1=cy+r*Math.sin(a0);
                          const x2=cx+r*Math.cos(a1), y2=cy+r*Math.sin(a1);
                          const lg=(s.s1-s.s0)>180?1:0;
                          return `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
                        };
                        return (
                          <>
                            {computed.map(s=>{
                              const mid=toRad((s.s0+s.s1)/2);
                              const lx=cx+r*0.63*Math.cos(mid), ly=cy+r*0.63*Math.sin(mid);
                              return (
                                <g key={s.label}>
                                  <path d={arc(s)} fill={s.color} opacity={s.highlight?1:0.82} stroke="#0f172a" strokeWidth="1.5"/>
                                  {s.pct>=10 && <text x={lx} y={ly+3} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">{s.pct}%</text>}
                                </g>
                              );
                            })}
                            {/* Legend */}
                            {computed.map((s,i)=>(
                              <g key={s.label+"leg"}>
                                <rect x="215" y={14+i*33} width="12" height="12" rx="2" fill={s.color} opacity={s.highlight?1:0.82}/>
                                <text x="232" y={24+i*33} fontSize="10" fill={s.highlight?"#86efac":"#cbd5e1"} fontWeight={s.highlight?"bold":"normal"}>{s.label}</text>
                                <text x="232" y={36+i*33} fontSize="8" fill="#64748b">{s.sub}</text>
                              </g>
                            ))}
                            {/* Highlighted slice label arrow */}
                            <text x="115" y="190" textAnchor="middle" fontSize="8" fill="#4ade80">★ Mangga = 35 siswa, sudut 126°</text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Siswa menyukai mangga} = 35\% \times 100 = 35 \text{ siswa}" />
                        <BlockMath math="\text{Sudut sektor mangga} = \frac{35}{100} \times 360° = 126°" />
                      </div>
                      <p><strong className="text-primary">35 siswa menyukai mangga; sudut sektor = 126°</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Anggaran belanja bulanan sebuah keluarga adalah Rp 4.000.000. Pengeluaran: Makanan Rp 1.600.000, Pendidikan Rp 800.000, Transportasi Rp 600.000, Kesehatan Rp 400.000, Hiburan Rp 400.000, Tabungan sisanya.<br />
                      Tentukan persentase dan sudut sektor tabungan!
                    </p>
                  </div>
                  {/* Diagram Lingkaran Contoh 2 */}
                  <div className="bg-slate-900/70 border border-yellow-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3 text-center">🥧 Diagram Lingkaran — Anggaran Belanja Bulanan</p>
                    <svg viewBox="0 0 400 215" className="w-full max-w-md mx-auto block" aria-label="Diagram lingkaran anggaran belanja">
                      {(() => {
                        const cx=115, cy=103, r=85;
                        const slices = [
                          { label:"Makanan",     sub:"40% · Rp1,6jt", pct:40, color:"#ef4444" },
                          { label:"Pendidikan",  sub:"20% · Rp800rb",  pct:20, color:"#3b82f6" },
                          { label:"Transportasi",sub:"15% · Rp600rb",  pct:15, color:"#f97316" },
                          { label:"Kesehatan",   sub:"10% · Rp400rb",  pct:10, color:"#22c55e" },
                          { label:"Hiburan",     sub:"10% · Rp400rb",  pct:10, color:"#a855f7" },
                          { label:"Tabungan",    sub:"5% · 18° ★",     pct:5,  color:"#eab308", highlight:true },
                        ];
                        let cum=0;
                        const computed=slices.map(s=>{
                          const s0=(cum/100)*360-90, s1=((cum+s.pct)/100)*360-90;
                          cum+=s.pct;
                          return {...s,s0,s1};
                        });
                        const toRad=(d: number)=>d*Math.PI/180;
                        const arc=(s: typeof computed[0])=>{
                          const a0=toRad(s.s0),a1=toRad(s.s1);
                          const x1=cx+r*Math.cos(a0),y1=cy+r*Math.sin(a0);
                          const x2=cx+r*Math.cos(a1),y2=cy+r*Math.sin(a1);
                          const lg=(s.s1-s.s0)>180?1:0;
                          return `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
                        };
                        return (
                          <>
                            {computed.map(s=>{
                              const mid=toRad((s.s0+s.s1)/2);
                              const lx=cx+r*0.64*Math.cos(mid),ly=cy+r*0.64*Math.sin(mid);
                              return (
                                <g key={s.label}>
                                  <path d={arc(s)} fill={s.color} opacity={s.highlight?1:0.82} stroke="#0f172a" strokeWidth="1.5"/>
                                  {s.pct>=12 && <text x={lx} y={ly+3} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">{s.pct}%</text>}
                                </g>
                              );
                            })}
                            {computed.map((s,i)=>(
                              <g key={s.label+"leg"}>
                                <rect x="220" y={8+i*33} width="12" height="12" rx="2" fill={s.color} opacity={s.highlight?1:0.82}/>
                                <text x="237" y={18+i*33} fontSize="9.5" fill={s.highlight?"#fef08a":"#cbd5e1"} fontWeight={s.highlight?"bold":"normal"}>{s.label}</text>
                                <text x="237" y={30+i*33} fontSize="8" fill="#64748b">{s.sub}</text>
                              </g>
                            ))}
                            <text x="115" y="202" textAnchor="middle" fontSize="8" fill="#fbbf24">★ Tabungan = Rp200.000 = 5%, sudut 18°</text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Tabungan} = 4.000.000 - (1.600+800+600+400+400) \times 1000" />
                        <BlockMath math="= 4.000.000 - 3.800.000 = 200.000" />
                        <BlockMath math="\%\text{Tabungan} = \frac{200.000}{4.000.000} \times 100\% = 5\%" />
                        <BlockMath math="\text{Sudut} = 5\% \times 360° = 18°" />
                      </div>
                      <p><strong className="text-primary">Tabungan = Rp200.000 = 5%; sudut sektor = 18°</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari diagram lingkaran, diketahui sudut sektor untuk 5 kategori pelajaran favorit: Matematika 90°, IPA 72°, Bhs.Indo 108°, IPS 54°, Seni 36°. Jika total siswa adalah 300, tentukan:<br />
                      (a) Persentase dan jumlah siswa tiap kategori.<br />
                      (b) Verifikasi bahwa total sudut = 360°.
                    </p>
                  </div>
                  {/* Diagram Lingkaran Contoh 3 */}
                  <div className="bg-slate-900/70 border border-red-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3 text-center">🥧 Diagram Lingkaran — Pelajaran Favorit 300 Siswa</p>
                    <svg viewBox="0 0 390 205" className="w-full max-w-md mx-auto block" aria-label="Diagram lingkaran pelajaran favorit">
                      {(() => {
                        const cx=112, cy=98, r=82;
                        const slices = [
                          { label:"Bhs.Indo",  sub:"108° · 30% · 90 siswa", deg:108, color:"#f97316" },
                          { label:"Matematika",sub:"90° · 25% · 75 siswa",  deg:90,  color:"#22d3ee" },
                          { label:"IPA",       sub:"72° · 20% · 60 siswa",  deg:72,  color:"#22c55e" },
                          { label:"IPS",       sub:"54° · 15% · 45 siswa",  deg:54,  color:"#a855f7" },
                          { label:"Seni",      sub:"36° · 10% · 30 siswa",  deg:36,  color:"#f43f5e" },
                        ];
                        let cumDeg=0;
                        const computed=slices.map(s=>{
                          const s0=cumDeg-90, s1=cumDeg+s.deg-90;
                          cumDeg+=s.deg;
                          return {...s, s0, s1, pct:Math.round(s.deg/360*100)};
                        });
                        const toRad=(d: number)=>d*Math.PI/180;
                        const arc=(s: typeof computed[0])=>{
                          const a0=toRad(s.s0),a1=toRad(s.s1);
                          const x1=cx+r*Math.cos(a0),y1=cy+r*Math.sin(a0);
                          const x2=cx+r*Math.cos(a1),y2=cy+r*Math.sin(a1);
                          const lg=(s.s1-s.s0)>180?1:0;
                          return `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
                        };
                        return (
                          <>
                            {computed.map(s=>{
                              const mid=toRad((s.s0+s.s1)/2);
                              const lx=cx+r*0.64*Math.cos(mid), ly=cy+r*0.64*Math.sin(mid);
                              return (
                                <g key={s.label}>
                                  <path d={arc(s)} fill={s.color} opacity="0.88" stroke="#0f172a" strokeWidth="1.5"/>
                                  {s.pct>=15 && <text x={lx} y={ly+3} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">{s.pct}%</text>}
                                </g>
                              );
                            })}
                            {computed.map((s,i)=>(
                              <g key={s.label+"leg"}>
                                <rect x="212" y={10+i*37} width="12" height="12" rx="2" fill={s.color} opacity="0.88"/>
                                <text x="229" y={21+i*37} fontSize="9.5" fill="#e2e8f0" fontWeight="bold">{s.label}</text>
                                <text x="229" y={33+i*37} fontSize="7.5" fill="#64748b">{s.sub}</text>
                              </g>
                            ))}
                            <text x="112" y="196" textAnchor="middle" fontSize="7.5" fill="#64748b">Total: 90+72+108+54+36 = 360° ✓</text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> <InlineMath math="\% = \frac{\text{sudut}}{360°} \times 100\%" />, jumlah = <InlineMath math="\% \times 300" /></p>
                      <div className="bg-slate-900/50 rounded p-3 overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="border-b border-slate-600/50">
                              <th className="text-left py-1 text-white/50">Pelajaran</th>
                              <th className="text-right py-1 text-white/50">Sudut</th>
                              <th className="text-right py-1 text-white/50">%</th>
                              <th className="text-right py-1 text-white/50">Siswa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              ["Matematika","90°","25%","75"],
                              ["IPA","72°","20%","60"],
                              ["Bhs.Indo","108°","30%","90"],
                              ["IPS","54°","15%","45"],
                              ["Seni","36°","10%","30"],
                            ].map(([p,s,pct,jml]) => (
                              <tr key={p}>
                                <td className="py-1 text-white/70">{p}</td>
                                <td className="py-1 text-right text-orange-300">{s}</td>
                                <td className="py-1 text-right text-yellow-300">{pct}</td>
                                <td className="py-1 text-right text-cyan-300 font-bold">{jml}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50">
                              <td className="py-1 text-white font-bold">TOTAL</td>
                              <td className="py-1 text-right text-orange-400 font-bold">360°</td>
                              <td className="py-1 text-right text-yellow-400 font-bold">100%</td>
                              <td className="py-1 text-right text-cyan-400 font-bold">300</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Verifikasi: <InlineMath math="90+72+108+54+36 = 360°" /> ✓</p>
                      <p><strong className="text-primary">Total sudut = 360°, total siswa = 300 ✓</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 5: DIAGRAM BATANG DAUN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 5: Diagram Batang Daun (Stem-and-Leaf)" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Diagram batang daun</strong> adalah cara penyajian data yang unik — data angka dipisah menjadi dua bagian:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-900/40 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-300">BATANG</p>
                      <p className="font-body text-xs text-white/70 mt-1">Digit depan (puluhan)</p>
                      <p className="font-body text-xs text-green-400 mt-1">Ditulis di <strong>kiri</strong></p>
                    </div>
                    <div className="bg-teal-900/40 border border-teal-500/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-teal-300">DAUN</p>
                      <p className="font-body text-xs text-white/70 mt-1">Digit belakang (satuan)</p>
                      <p className="font-body text-xs text-teal-400 mt-1">Ditulis di <strong>kanan</strong></p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kelebihan utama: data asli tetap terlihat, mudah menentukan nilai minimum, maksimum, dan median secara langsung!
                  </p>
                </div>

                {/* Contoh Diagram Batang Daun */}
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl overflow-hidden">
                  <div className="bg-green-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-green-200 uppercase tracking-wide">📋 Contoh Diagram Batang Daun</p>
                  </div>
                  <div className="p-4">
                    <p className="font-body text-xs text-white/60 mb-3">Data nilai ulangan 15 siswa: 62, 65, 68, 71, 73, 73, 75, 78, 78, 82, 85, 87, 88, 91, 95</p>
                    <div className="bg-slate-900/70 rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white/40 text-xs w-20 text-right shrink-0">Batang</span>
                        <span className="text-white/40 text-xs mx-2">|</span>
                        <span className="text-white/40 text-xs">Daun</span>
                      </div>
                      <div className="border-t border-slate-600/40 pt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold w-20 text-right shrink-0">6</span>
                          <span className="text-white/40 mx-2">|</span>
                          <span className="text-green-300">2  5  8</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold w-20 text-right shrink-0">7</span>
                          <span className="text-white/40 mx-2">|</span>
                          <span className="text-green-300">1  3  3  5  8  8</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold w-20 text-right shrink-0">8</span>
                          <span className="text-white/40 mx-2">|</span>
                          <span className="text-green-300">2  5  7  8</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold w-20 text-right shrink-0">9</span>
                          <span className="text-white/40 mx-2">|</span>
                          <span className="text-green-300">1  5</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
                      <div className="bg-green-900/30 rounded p-2 text-center">
                        <p className="text-white/50">Minimum</p>
                        <p className="text-green-300 font-bold text-base">62</p>
                      </div>
                      <div className="bg-red-900/30 rounded p-2 text-center">
                        <p className="text-white/50">Maksimum</p>
                        <p className="text-red-300 font-bold text-base">95</p>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2 text-center">
                        <p className="text-white/50">Median</p>
                        <p className="text-blue-300 font-bold text-base">78</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Cara membuat:</strong> (1) Urutkan data dari kecil ke besar. (2) Ambil digit puluhan sebagai batang. (3) Tulis digit satuan sebagai daun di sebelah kanan batangnya.
                  </p>
                </div>

                {/* ===== DIAGRAM BATANG DAUN INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-green-500/30 rounded-xl overflow-hidden">
                  <div className="bg-green-900/50 px-4 py-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-green-200">🛠️ Coba Sendiri — Buat Diagram Batang Daun</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Masukkan data angka (0–999) dipisahkan koma, lalu klik <strong className="text-green-300">Buat Diagram</strong> untuk melihat animasi batang daun lengkap dengan statistiknya!
                    </p>

                    {/* Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body text-xs font-semibold text-green-300">Data angka (dipisah koma, maks 30):</label>
                        <button
                          onClick={loadStemExample}
                          className="font-body text-xs text-green-400/60 hover:text-green-400 transition-colors underline underline-offset-2"
                        >Ganti contoh ↗</button>
                      </div>
                      <input
                        type="text"
                        value={stemInput}
                        onChange={(e) => { setStemInput(e.target.value); setStemError(""); setStemVisible(false); }}
                        placeholder="Contoh: 72, 65, 78, 83, 91, 75, 90..."
                        className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-green-400/60 transition-colors"
                      />
                      {stemError && (
                        <p className="font-body text-xs text-red-400">⚠ {stemError}</p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={buildStemLeaf}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 border border-green-500/50 text-white text-xs font-body font-bold hover:bg-green-500 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                      >
                        <Target className="w-3.5 h-3.5" />
                        Buat Diagram Batang Daun
                      </button>
                      {stemVisible && (
                        <button
                          onClick={resetStem}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >↺ Reset</button>
                      )}
                    </div>

                    {/* Diagram Result */}
                    {stemVisible && stemResult.length > 0 && (() => {
                      const n = stemRaw.length;
                      const minVal = stemRaw[0];
                      const maxVal = stemRaw[n - 1];
                      const medianVal = n % 2 === 1
                        ? stemRaw[Math.floor(n / 2)]
                        : (stemRaw[n / 2 - 1] + stemRaw[n / 2]) / 2;
                      const freq = new Map<number, number>();
                      for (const x of stemRaw) freq.set(x, (freq.get(x) || 0) + 1);
                      const maxFreq = Math.max(...freq.values());
                      const modes = [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v).sort((a, b) => a - b);
                      const modeStr = maxFreq === 1 ? "Tidak ada" : modes.join(" & ");

                      let globalLeafIdx = 0;

                      return (
                        <div className="bg-slate-900/60 border border-green-500/20 rounded-xl p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wider">🌿 Hasil Diagram Batang Daun</p>
                            <span className="font-body text-xs text-white/35">{n} data · terurut</span>
                          </div>

                          {/* Sorted data preview */}
                          <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                            <p className="font-body text-xs text-white/35 mb-1">Data terurut:</p>
                            <p className="font-body text-xs text-white/70 leading-relaxed">{stemRaw.join(", ")}</p>
                          </div>

                          {/* Stem-and-leaf diagram */}
                          <div className="bg-slate-900/80 rounded-xl overflow-hidden border border-green-500/15">
                            {/* Header */}
                            <div className="flex items-center gap-0 border-b border-slate-700/60">
                              <div className="w-16 px-3 py-2 text-right font-body text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">Batang</div>
                              <div className="w-px self-stretch bg-slate-600/60" />
                              <div className="px-3 py-2 font-body text-xs font-bold text-slate-400 uppercase tracking-wide">Daun</div>
                            </div>
                            {/* Rows */}
                            <div className="divide-y divide-slate-800/60">
                              {stemResult.map((row, rowIdx) => {
                                const rowDelay = rowIdx * 0.12;
                                const localStart = globalLeafIdx;
                                globalLeafIdx += row.leaves.length;
                                return (
                                  <div
                                    key={row.stem}
                                    className="flex items-center gap-0"
                                    style={{
                                      opacity: stemAnimated ? 1 : 0,
                                      transform: stemAnimated ? "translateX(0)" : "translateX(-16px)",
                                      transition: `opacity 0.4s ease ${rowDelay}s, transform 0.4s ease ${rowDelay}s`,
                                    }}
                                  >
                                    <div className="w-16 px-3 py-2.5 text-right shrink-0">
                                      <span className="font-mono font-bold text-cyan-300 text-sm">{row.stem}</span>
                                    </div>
                                    <div className="w-px self-stretch bg-slate-600/60" />
                                    <div className="px-3 py-2.5 flex items-center gap-2 flex-wrap">
                                      {row.leaves.map((leaf, leafIdx) => {
                                        const globalIdx = localStart + leafIdx;
                                        return (
                                          <span
                                            key={leafIdx}
                                            className="font-mono text-green-300 font-semibold text-sm"
                                            style={{
                                              opacity: stemAnimated ? 1 : 0,
                                              transition: `opacity 0.25s ease ${rowDelay + 0.1 + leafIdx * 0.06}s`,
                                              display: "inline-block",
                                            }}
                                          >{leaf}</span>
                                        );
                                        void globalIdx;
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Footer legend */}
                            <div className="border-t border-slate-700/60 px-3 py-2 flex items-center gap-4">
                              <span className="font-body text-xs text-white/30">Kunci: Batang | Daun</span>
                              <span className="font-body text-xs text-white/30">Contoh baris pertama: {stemResult[0].stem} | {stemResult[0].leaves[0]} → <strong className="text-white/50">{stemResult[0].stem * 10 + stemResult[0].leaves[0]}</strong></span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                            style={{
                              opacity: stemAnimated ? 1 : 0,
                              transition: `opacity 0.5s ease ${stemResult.length * 0.12 + 0.4}s`,
                            }}
                          >
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>MINIMUM</p>
                              <p className="font-body text-green-300 font-bold text-lg mt-0.5">{minVal}</p>
                            </div>
                            <div className="bg-red-900/25 border border-red-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>MAKSIMUM</p>
                              <p className="font-body text-red-300 font-bold text-lg mt-0.5">{maxVal}</p>
                            </div>
                            <div className="bg-yellow-900/25 border border-yellow-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>MODUS</p>
                              <p className="font-body text-yellow-300 font-bold text-sm mt-0.5 leading-tight">{modeStr}</p>
                            </div>
                            <div className="bg-blue-900/25 border border-blue-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>MEDIAN</p>
                              <p className="font-body text-blue-300 font-bold text-lg mt-0.5">{medianVal}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal — Diagram Batang Daun" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Buatlah diagram batang daun dari data berikut (nilai ulangan 10 siswa):<br />
                      52, 58, 61, 64, 67, 70, 72, 75, 83, 89
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Data sudah urut. Pisahkan puluhan (batang) dan satuan (daun).</p>
                      <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/40 text-xs w-16 text-right shrink-0">Batang</span>
                          <span className="text-white/40 mx-2">|</span>
                          <span className="text-white/40 text-xs">Daun</span>
                        </div>
                        <div className="border-t border-slate-600/40 pt-1 space-y-1">
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">5</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">2  8</span></div>
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">6</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">1  4  7</span></div>
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">7</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">0  2  5</span></div>
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">8</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">3  9</span></div>
                        </div>
                      </div>
                      <p><strong className="text-green-300">Min = 52, Maks = 89, Banyak data = 10 ✓</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari diagram batang daun berikut, tentukan nilai minimum, maksimum, dan median!
                    </p>
                    <div className="bg-slate-900/60 rounded-lg p-3 mt-2 font-mono text-sm">
                      <div className="flex gap-2 text-white/40 text-xs mb-1"><span className="w-14 text-right">Batang</span><span className="mx-2">|</span><span>Daun</span></div>
                      <div className="border-t border-slate-600/40 pt-1 space-y-1">
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">4</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">3  7  7</span></div>
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">5</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">0  2  5  5  8</span></div>
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">6</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">1  4  9</span></div>
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">7</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">2  6</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Data terurut: 43, 47, 47, 50, 52, 55, 55, 58, 61, 64, 69, 72, 76</p>
                      <p>Banyak data = <strong>13</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• Minimum = <span className="text-green-400 font-semibold">43</span></p>
                        <p>• Maksimum = <span className="text-red-400 font-semibold">76</span></p>
                        <p>• Median = datum ke-<InlineMath math="\frac{13+1}{2} = 7" /> = <span className="text-blue-400 font-semibold">55</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dua kelas, A dan B, mengikuti ujian matematika. Data nilai (sudah diurutkan):<br />
                      Kelas A: 55, 60, 63, 65, 68, 70, 70, 72, 78, 80<br />
                      Kelas B: 58, 61, 64, 66, 69, 71, 75, 77, 82, 85<br />
                      Sajikan data ini dalam <strong>diagram batang daun berdampingan</strong>!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat diagram batang daun berdampingan (daun A di kiri, batang di tengah, daun B di kanan):</p>
                      <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                        <div className="flex gap-1 text-white/40 mb-1 justify-center">
                          <span className="w-20 text-right">Daun A</span>
                          <span className="w-8 text-center">Batang</span>
                          <span className="w-20">Daun B</span>
                        </div>
                        <div className="border-t border-slate-600/40 pt-1 space-y-1">
                          <div className="flex gap-1 items-center justify-center">
                            <span className="text-cyan-300 w-20 text-right">5</span>
                            <span className="text-white/30 w-8 text-center font-bold">5</span>
                            <span className="text-orange-300 w-20">8</span>
                          </div>
                          <div className="flex gap-1 items-center justify-center">
                            <span className="text-cyan-300 w-20 text-right">8  5  3  0</span>
                            <span className="text-white/30 w-8 text-center font-bold">6</span>
                            <span className="text-orange-300 w-20">1  4  6  9</span>
                          </div>
                          <div className="flex gap-1 items-center justify-center">
                            <span className="text-cyan-300 w-20 text-right">2  0  0</span>
                            <span className="text-white/30 w-8 text-center font-bold">7</span>
                            <span className="text-orange-300 w-20">1  5  7</span>
                          </div>
                          <div className="flex gap-1 items-center justify-center">
                            <span className="text-cyan-300 w-20 text-right">8  0</span>
                            <span className="text-white/30 w-8 text-center font-bold">8</span>
                            <span className="text-orange-300 w-20">2  5</span>
                          </div>
                        </div>
                      </div>
                      <p><strong className="text-primary">Diagram batang daun berdampingan berhasil dibuat. Nilai Kelas B secara umum lebih tinggi terlihat dari posisi daun yang lebih besar di setiap batang.</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== RANGKUMAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-yellow-400" title="🏁 Rangkuman Penyajian Data" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { emoji: "🌿", title: "Batang Daun", desc: "Data mentah tetap terlihat. Mudah baca min, maks, dan median.", color: "border-green-500/40 bg-green-900/20" },
                    { emoji: "📊", title: "Diagram Batang", desc: "Perbandingan kategori. Batang tegak/mendatar, tinggi = frekuensi.", color: "border-blue-500/40 bg-blue-900/20" },
                    { emoji: "📈", title: "Diagram Garis", desc: "Tren data dari waktu ke waktu. Titik dihubungkan garis.", color: "border-purple-500/40 bg-purple-900/20" },
                    { emoji: "🥧", title: "Diagram Lingkaran", desc: "Proporsi/persentase. Sudut = (f/total) × 360°.", color: "border-orange-500/40 bg-orange-900/20" },
                    { emoji: "📋", title: "Tabel Distribusi", desc: "Data banyak dikelompokkan berdasarkan nilai dan frekuensinya.", color: "border-cyan-500/40 bg-cyan-900/20" },
                  ].map(({ emoji, title, desc, color }) => (
                    <div key={title} className={`border ${color} rounded-xl p-3`}>
                      <p className="text-xl mb-1">{emoji}</p>
                      <p className="font-body text-sm font-bold text-white mb-1">{title}</p>
                      <p className="font-body text-xs text-white/60">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Kamu sudah menguasai Penyajian Data! 🎉</strong> Selanjutnya, lanjut ke materi Ukuran Pemusatan Data untuk belajar menghitung median secara mendalam! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenyajianDataPage;
