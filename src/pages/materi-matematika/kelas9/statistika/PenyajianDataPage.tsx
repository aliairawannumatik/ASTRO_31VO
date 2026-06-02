import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
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

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1", "contoh1",
    "konsep2", "contoh2",
    "konsep3", "contoh3",
    "konsep4", "contoh4",
    "konsep5", "contoh5",
    "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
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

          {/* ===== SUB-BAB 1: DIAGRAM BATANG DAUN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Diagram Batang Daun (Stem-and-Leaf)" />
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
                    Kelebihan utama: data asli tetap terlihat, mudah menentukan nilai minimum, maksimum, median, dan modus secara langsung!
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
                      <div className="bg-yellow-900/30 rounded p-2 text-center">
                        <p className="text-white/50">Modus</p>
                        <p className="text-yellow-300 font-bold text-base">73 & 78</p>
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
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
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
                      Dari diagram batang daun berikut, tentukan nilai minimum, maksimum, modus, dan median!
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
                        <p>• Modus = <span className="text-yellow-400 font-semibold">47 dan 55</span> (masing-masing muncul 2 kali)</p>
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
                      Sajikan data ini dalam <strong>diagram batang daun berdampingan</strong> dan tentukan kelas mana yang memiliki rata-rata lebih tinggi!
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
                      <p><strong>Langkah 2:</strong> Hitung rata-rata:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{x}_A = \frac{55+60+63+65+68+70+70+72+78+80}{10} = \frac{681}{10} = 68{,}1" />
                        <BlockMath math="\bar{x}_B = \frac{58+61+64+66+69+71+75+77+82+85}{10} = \frac{708}{10} = 70{,}8" />
                      </div>
                      <p><strong className="text-primary">Kelas B memiliki rata-rata lebih tinggi (70,8 &gt; 68,1)</strong></p>
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
                      Dari diagram batang ganda (dua kelompok), diketahui nilai rata-rata ulangan siswa Kelas A dan B per mata pelajaran:<br />
                      Matematika: A=78, B=82 | IPA: A=85, B=79 | Bhs.Indo: A=88, B=90 | IPS: A=75, B=74<br />
                      (a) Pada mata pelajaran apa Kelas A lebih unggul? (b) Hitung selisih rata-rata total kedua kelas!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>(a)</strong> Bandingkan A vs B per mata pelajaran:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Matematika: A=78 vs B=82 → <span className="text-red-400">B unggul</span></p>
                        <p>IPA: A=85 vs B=79 → <span className="text-cyan-400">A unggul (+6)</span></p>
                        <p>Bhs.Indo: A=88 vs B=90 → <span className="text-red-400">B unggul</span></p>
                        <p>IPS: A=75 vs B=74 → <span className="text-cyan-400">A unggul (+1)</span></p>
                      </div>
                      <p>→ Kelas A lebih unggul pada <strong className="text-cyan-300">IPA dan IPS</strong>.</p>
                      <p><strong>(b)</strong> Rata-rata total:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{x}_A = \frac{78+85+88+75}{4} = \frac{326}{4} = 81{,}5" />
                        <BlockMath math="\bar{x}_B = \frac{82+79+90+74}{4} = \frac{325}{4} = 81{,}25" />
                        <p className="text-sm text-white/80">Selisih = <InlineMath math="81{,}5 - 81{,}25 = 0{,}25" /></p>
                      </div>
                      <p><strong className="text-primary">Rata-rata total Kelas A sedikit lebih tinggi (81,5 vs 81,25), selisih 0,25.</strong></p>
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
                      Hitunglah rata-rata penjualan dan tentukan pada bulan mana penjualan di atas rata-rata!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{80+95+90+110+105+120}{6} = \frac{600}{6} = 100" />
                      </div>
                      <p>Rata-rata = <strong>100</strong> (× 1000 ml)</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Jan: 80 &lt; 100 → di bawah rata-rata</p>
                        <p>Feb: 95 &lt; 100 → di bawah rata-rata</p>
                        <p>Mar: 90 &lt; 100 → di bawah rata-rata</p>
                        <p>Apr: 110 &gt; 100 → <span className="text-yellow-400">di atas rata-rata ✓</span></p>
                        <p>Mei: 105 &gt; 100 → <span className="text-yellow-400">di atas rata-rata ✓</span></p>
                        <p>Jun: 120 &gt; 100 → <span className="text-yellow-400">di atas rata-rata ✓</span></p>
                      </div>
                      <p><strong className="text-primary">Penjualan di atas rata-rata terjadi pada bulan April, Mei, dan Juni.</strong></p>
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
                      <text x="100" y="95" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">DATA</text>
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

          {/* ===== SUB-BAB 5: TABEL DISTRIBUSI FREKUENSI ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 5: Tabel Distribusi Frekuensi" />
            {expandedSections.includes("konsep5") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika data sangat banyak, menyajikannya satu per satu tidak efisien. <strong className="text-cyan-300">Tabel distribusi frekuensi</strong> mengelompokkan data ke dalam kelas-kelas (interval) dan menghitung berapa banyak data yang masuk ke setiap kelas.
                  </p>

                  {/* Langkah Membuat Tabel */}
                  <div className="space-y-2">
                    <p className="font-body text-xs font-bold text-cyan-300">📋 Langkah Membuat Tabel Distribusi Frekuensi:</p>
                    {[
                      ["1", "Tentukan Jangkauan (J)", "J = nilai maks − nilai min"],
                      ["2", "Tentukan Banyak Kelas (k)", "Gunakan aturan Sturges: k = 1 + 3,3 log n (dibulatkan)"],
                      ["3", "Tentukan Panjang Kelas (p)", "p = J ÷ k (dibulatkan ke atas)"],
                      ["4", "Tentukan Batas Kelas", "Mulai dari nilai minimum, tambah p untuk setiap kelas"],
                      ["5", "Hitung Frekuensi", "Hitung berapa data yang masuk tiap kelas"],
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

                {/* Rumus Penting */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">📐 Istilah Penting dalam Tabel Distribusi Frekuensi</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-cyan-300 font-bold">Istilah</th>
                          <th className="px-3 py-2 text-left text-white/70">Keterangan</th>
                          <th className="px-3 py-2 text-left text-white/70">Simbol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["Kelas / Interval", "Rentang nilai dalam satu kelompok", "mis. 60–69"],
                          ["Frekuensi (f)", "Banyak data yang masuk satu kelas", "f"],
                          ["Batas Bawah Kelas", "Nilai terkecil dalam satu kelas", "b bawah"],
                          ["Batas Atas Kelas", "Nilai terbesar dalam satu kelas", "b atas"],
                          ["Tepi Bawah Kelas", "Batas bawah − 0,5", "Tb"],
                          ["Tepi Atas Kelas", "Batas atas + 0,5", "Ta"],
                          ["Titik Tengah / Nilai Tengah", "(Batas bawah + batas atas) ÷ 2", "xi"],
                          ["Frekuensi Kumulatif", "Jumlah frekuensi s.d. kelas tsb.", "fk"],
                        ].map(([ist, ket, sim]) => (
                          <tr key={ist} className="hover:bg-slate-700/20">
                            <td className="px-3 py-2 text-cyan-300 font-semibold">{ist}</td>
                            <td className="px-3 py-2 text-white/70">{ket}</td>
                            <td className="px-3 py-2 text-yellow-300 font-mono">{sim}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Contoh Tabel */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl overflow-hidden">
                  <div className="bg-cyan-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-cyan-200 uppercase tracking-wide">📋 Contoh: Distribusi Frekuensi Nilai Ulangan 30 Siswa</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-2 py-2 text-left text-cyan-300 font-bold">Kelas</th>
                          <th className="px-2 py-2 text-center text-white/70">f</th>
                          <th className="px-2 py-2 text-center text-white/70">Titik Tengah (xᵢ)</th>
                          <th className="px-2 py-2 text-center text-white/70">fk</th>
                          <th className="px-2 py-2 text-center text-white/70">f·xᵢ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["50 – 59","3","54,5","3","163,5"],
                          ["60 – 69","7","64,5","10","451,5"],
                          ["70 – 79","10","74,5","20","745"],
                          ["80 – 89","7","84,5","27","591,5"],
                          ["90 – 99","3","94,5","30","283,5"],
                        ].map(([kelas, f, tt, fk, fxi]) => (
                          <tr key={kelas} className="hover:bg-slate-700/20">
                            <td className="px-2 py-2 text-white font-semibold">{kelas}</td>
                            <td className="px-2 py-2 text-center text-green-300">{f}</td>
                            <td className="px-2 py-2 text-center text-yellow-300">{tt}</td>
                            <td className="px-2 py-2 text-center text-purple-300">{fk}</td>
                            <td className="px-2 py-2 text-center text-cyan-300">{fxi}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 border-t border-slate-500/50">
                          <td className="px-2 py-2 text-white font-bold">TOTAL</td>
                          <td className="px-2 py-2 text-center text-green-400 font-bold">30</td>
                          <td className="px-2 py-2 text-center text-white/40">—</td>
                          <td className="px-2 py-2 text-center text-white/40">—</td>
                          <td className="px-2 py-2 text-center text-cyan-400 font-bold">2.235</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-3">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\bar{x} = \frac{\sum f \cdot x_i}{\sum f} = \frac{2235}{30} = 74{,}5" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Tabel distribusi frekuensi menyederhanakan data banyak. Titik tengah digunakan untuk menghitung rata-rata data berkelompok. Frekuensi kumulatif berguna untuk mencari median dan kuartil!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 5 */}
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
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Perhatikan tabel distribusi frekuensi berikut:
                    </p>
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Kelas</th><th className="px-3 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["40–49","4"],["50–59","8"],["60–69","12"],["70–79","6"]].map(([k,f]) => (
                            <tr key={k}><td className="px-3 py-1 text-white">{k}</td><td className="px-3 py-1 text-center text-green-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">Tentukan: (a) Total frekuensi, (b) Titik tengah kelas 60–69.</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p>(a) Total frekuensi = <InlineMath math="4 + 8 + 12 + 6 = \mathbf{30}" /></p>
                        <p>(b) Titik tengah 60–69 = <InlineMath math="\frac{60+69}{2} = \frac{129}{2} = \mathbf{64,5}" /></p>
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
                      Data berat badan (kg) 20 siswa: 45, 48, 50, 52, 53, 55, 56, 57, 58, 60, 61, 62, 63, 65, 66, 68, 70, 72, 75, 78.<br />
                      Buat tabel distribusi frekuensi dengan 4 kelas, lalu hitung rata-ratanya!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Jangkauan: <InlineMath math="J = 78 - 45 = 33" /></p>
                        <p>Panjang kelas: <InlineMath math="p = \lceil 33/4 \rceil = 9" /> → gunakan 9</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body mt-2">
                          <thead><tr className="bg-slate-700/40">
                            <th className="px-2 py-1 text-left text-cyan-300">Kelas</th>
                            <th className="px-2 py-1 text-center text-white/70">f</th>
                            <th className="px-2 py-1 text-center text-white/70">xᵢ</th>
                            <th className="px-2 py-1 text-center text-white/70">f·xᵢ</th>
                          </tr></thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              ["45 – 53","5","49","245"],
                              ["54 – 62","8","58","464"],
                              ["63 – 71","5","67","335"],
                              ["72 – 80","2","76","152"],
                            ].map(([k,f,xi,fxi]) => (
                              <tr key={k}>
                                <td className="px-2 py-1 text-white">{k}</td>
                                <td className="px-2 py-1 text-center text-green-300">{f}</td>
                                <td className="px-2 py-1 text-center text-yellow-300">{xi}</td>
                                <td className="px-2 py-1 text-center text-cyan-300">{fxi}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold">
                              <td className="px-2 py-1 text-white">Total</td>
                              <td className="px-2 py-1 text-center text-green-400">20</td>
                              <td className="px-2 py-1"></td>
                              <td className="px-2 py-1 text-center text-cyan-400">1.196</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{1196}{20} = 59{,}8 \text{ kg}" />
                      </div>
                      <p><strong className="text-primary">Rata-rata berat badan = 59,8 kg</strong></p>
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
                      Dari tabel distribusi frekuensi berikut:
                    </p>
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40">
                          <th className="px-2 py-1 text-left text-white/70">Kelas</th>
                          <th className="px-2 py-1 text-center text-white/70">f</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["50–59","3"],["60–69","6"],["70–79","14"],["80–89","10"],["90–99","7"]].map(([k,f]) => (
                            <tr key={k}><td className="px-2 py-1 text-white">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">
                      Tentukan: (a) Rata-rata data berkelompok, (b) Kelas modus, (c) Frekuensi kumulatif untuk kelas 70–79.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung titik tengah dan f·xᵢ:</p>
                      <div className="bg-slate-900/50 rounded p-2 overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="border-b border-slate-600/50">
                            <th className="px-2 py-1 text-left text-white/50">Kelas</th>
                            <th className="px-2 py-1 text-center text-white/50">f</th>
                            <th className="px-2 py-1 text-center text-white/50">xᵢ</th>
                            <th className="px-2 py-1 text-center text-white/50">f·xᵢ</th>
                            <th className="px-2 py-1 text-center text-white/50">fk</th>
                          </tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[
                              ["50–59","3","54,5","163,5","3"],
                              ["60–69","6","64,5","387","9"],
                              ["70–79","14","74,5","1043","23"],
                              ["80–89","10","84,5","845","33"],
                              ["90–99","7","94,5","661,5","40"],
                            ].map(([k,f,xi,fxi,fk]) => (
                              <tr key={k}>
                                <td className="px-2 py-1 text-white">{k}</td>
                                <td className="px-2 py-1 text-center text-green-300">{f}</td>
                                <td className="px-2 py-1 text-center text-yellow-300">{xi}</td>
                                <td className="px-2 py-1 text-center text-cyan-300">{fxi}</td>
                                <td className="px-2 py-1 text-center text-purple-300">{fk}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold">
                              <td className="px-2 py-1 text-white">Total</td>
                              <td className="px-2 py-1 text-center text-green-400">40</td>
                              <td></td>
                              <td className="px-2 py-1 text-center text-cyan-400">3.100</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>(a)</strong> Rata-rata:</p>
                        <BlockMath math="\bar{x} = \frac{3100}{40} = 77{,}5" />
                        <p><strong>(b)</strong> Kelas modus = kelas dengan frekuensi tertinggi = <span className="text-red-400 font-semibold">70–79</span> (f = 14)</p>
                        <p><strong>(c)</strong> Frekuensi kumulatif kelas 70–79 = <InlineMath math="3 + 6 + 14 = \mathbf{23}" /></p>
                      </div>
                      <p><strong className="text-primary">Rata-rata = 77,5; Kelas modus = 70–79; fk 70–79 = 23</strong></p>
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
                    { emoji: "🌿", title: "Batang Daun", desc: "Data mentah tetap terlihat. Mudah baca min, maks, median, modus.", color: "border-green-500/40 bg-green-900/20" },
                    { emoji: "📊", title: "Diagram Batang", desc: "Perbandingan kategori. Batang tegak/mendatar, tinggi = frekuensi.", color: "border-blue-500/40 bg-blue-900/20" },
                    { emoji: "📈", title: "Diagram Garis", desc: "Tren data dari waktu ke waktu. Titik dihubungkan garis.", color: "border-purple-500/40 bg-purple-900/20" },
                    { emoji: "🥧", title: "Diagram Lingkaran", desc: "Proporsi/persentase. Sudut = (f/total) × 360°.", color: "border-orange-500/40 bg-orange-900/20" },
                    { emoji: "📋", title: "Tabel Distribusi", desc: "Data banyak dikelompokkan. Rata-rata = Σ(f·xᵢ)/Σf.", color: "border-cyan-500/40 bg-cyan-900/20" },
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
                    <strong>Kamu sudah menguasai Penyajian Data! 🎉</strong> Selanjutnya, lanjut ke materi Ukuran Pemusatan Data untuk belajar menghitung rata-rata, median, dan modus secara mendalam! 🚀
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
