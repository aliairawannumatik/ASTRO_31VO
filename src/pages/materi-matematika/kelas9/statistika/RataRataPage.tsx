import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ─── Kalkulator Rata-rata Interaktif ─── */
const MeanCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ values: number[]; sum: number; mean: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    playPopSound();
    setError("");
    setResult(null);
    const parts = input.split(",").map(s => s.trim()).filter(s => s !== "");
    if (parts.length === 0) { setError("Masukkan minimal satu angka!"); return; }
    const values = parts.map(p => parseFloat(p.replace(",", ".")));
    if (values.some(isNaN)) { setError("Pastikan semua data adalah angka yang valid."); return; }
    const sum = values.reduce((a, b) => a + b, 0);
    setResult({ values, sum, mean: sum / values.length });
  };

  const fmt = (n: number) => Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(4)).toString();

  const buildLatex = () => {
    if (!result) return "";
    const { values, sum, mean } = result;
    const n = values.length;
    let numerator: string;
    if (n <= 8) {
      numerator = values.map(fmt).join("+");
    } else {
      numerator = `${fmt(values[0])}+${fmt(values[1])}+\\cdots+${fmt(values[n-1])}`;
    }
    return `\\bar{x} = \\frac{${numerator}}{${n}} = \\frac{${fmt(sum)}}{${n}} = ${fmt(mean)}`;
  };

  return (
    <div className="bg-green-950/40 border border-green-500/30 rounded-xl p-4 space-y-4">
      <p className="font-body text-sm font-bold text-green-300">🧮 Kalkulator Rata-rata Data Tunggal</p>
      <p className="font-body text-xs text-white/55">
        Masukkan data/nilai dipisah <strong className="text-green-300">koma</strong>. Contoh: <span className="text-green-300 font-mono">70, 80, 90, 60, 75</span>
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && calculate()}
          placeholder="Contoh: 70, 80, 90, 60, 75"
          className="flex-1 bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2 outline-none focus:border-green-500 placeholder:text-white/25"
        />
        <button
          onClick={calculate}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold font-body px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          Hitung
        </button>
      </div>
      {error && <p className="text-red-400 text-xs font-body">⚠️ {error}</p>}
      {result && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {result.values.map((v, i) => (
              <div key={i} className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-1.5 text-center">
                <p className="text-green-300 font-bold text-sm font-body">{fmt(v)}</p>
              </div>
            ))}
            <span className="text-white/40 text-lg">→</span>
            <div className="bg-cyan-900/50 border-2 border-cyan-500/60 rounded-lg px-4 py-1.5 text-center">
              <p className="text-white/50 text-xs font-body">Rata-rata</p>
              <p className="text-cyan-300 font-bold text-xl font-body">{fmt(result.mean)}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-3 text-center overflow-x-auto">
            <BlockMath math={buildLatex()} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
            <div className="bg-slate-800/60 rounded-lg p-2">
              <p className="text-white/40 mb-1">Banyak Data (n)</p>
              <p className="text-white font-bold text-base">{result.values.length}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2">
              <p className="text-white/40 mb-1">Jumlah (Σx)</p>
              <p className="text-yellow-300 font-bold text-base">{fmt(result.sum)}</p>
            </div>
            <div className="bg-cyan-900/50 border border-cyan-500/40 rounded-lg p-2">
              <p className="text-white/40 mb-1">Rata-rata (x̄)</p>
              <p className="text-cyan-300 font-bold text-base">{fmt(result.mean)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RataRataPage = () => {
  const navigate = useNavigate();
  const expandedSections = [
    "intro",
    "konsep1","contoh1",
    "konsep2","contoh2",
    "konsep3","contoh3",
    "konsep4","contoh4",
    "konsep5","contoh5",
    "rangkuman",
  ];

  const SectionHeader = ({
    id: _id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4 border-b border-border/30">
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
          UKURAN PEMUSATAN DATA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Rata-Rata & Rata-Rata Gabungan</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Ukuran Pemusatan Data?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Setelah kamu bisa menyajikan data dalam berbagai bentuk diagram, saatnya kamu belajar <strong className="text-cyan-300">mengolah dan menganalisis</strong> data tersebut. Salah satu cara paling dasar adalah mencari <strong className="text-cyan-300">ukuran pemusatan data</strong> — nilai tunggal yang mewakili keseluruhan data.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { simbol: "x̄", nama: "Rata-rata", desc: "Jumlah semua data dibagi banyaknya data", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
                    { simbol: "Me", nama: "Median", desc: "Nilai tengah setelah data diurutkan", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                    { simbol: "Mo", nama: "Modus", desc: "Nilai yang paling sering muncul", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
                  ].map(({ simbol, nama, desc, color }) => (
                    <div key={nama} className={`border ${color} rounded-xl p-3 text-center`}>
                      <p className="font-display text-2xl font-bold mb-1">{simbol}</p>
                      <p className="font-body text-xs font-bold text-white mb-1">{nama}</p>
                      <p className="font-body text-xs text-white/50">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    Di halaman ini kita fokus pada <strong>Rata-rata (Mean)</strong> — mulai dari data tunggal sederhana hingga rata-rata gabungan yang lebih menantang! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 1: RATA-RATA DATA TUNGGAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Rata-Rata Data Tunggal" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Rata-rata (mean)</strong> adalah nilai yang diperoleh dengan menjumlahkan seluruh data lalu membaginya dengan banyaknya data. Ini cara paling umum dipakai untuk merangkum sekumpulan data menjadi satu angka representatif.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">Rumus Rata-rata Data Tunggal</p>
                    <BlockMath math="\bar{x} = \frac{x_1 + x_2 + x_3 + \cdots + x_n}{n} = \frac{\sum_{i=1}^{n} x_i}{n}" />
                    <p className="font-body text-xs text-white/50">
                      <InlineMath math="\bar{x}" /> = rata-rata &nbsp;|&nbsp; <InlineMath math="x_i" /> = nilai data ke-<InlineMath math="i" /> &nbsp;|&nbsp; <InlineMath math="n" /> = banyak data
                    </p>
                  </div>
                </div>

                {/* Contoh visual sederhana */}
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-green-300 mb-3 uppercase tracking-wide">📌 Ilustrasi Rata-rata</p>
                  <p className="font-body text-xs text-white/60 mb-3">Data nilai 5 siswa: 70, 80, 90, 60, 75</p>
                  <div className="flex items-center gap-2 flex-wrap justify-center mb-3">
                    {[70,80,90,60,75].map((v,i) => (
                      <div key={i} className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-center">
                        <p className="text-green-300 font-bold text-sm">{v}</p>
                      </div>
                    ))}
                    <span className="text-white/40 text-lg">→</span>
                    <div className="bg-cyan-900/50 border-2 border-cyan-500/60 rounded-lg px-4 py-2 text-center">
                      <p className="text-white/50 text-xs">Rata-rata</p>
                      <p className="text-cyan-300 font-bold text-xl">75</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                    <BlockMath math="\bar{x} = \frac{70+80+90+60+75}{5} = \frac{375}{5} = 75" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Rata-rata sangat dipengaruhi oleh nilai ekstrem (sangat besar atau sangat kecil). Jika ada outlier, rata-rata bisa jadi tidak representatif. Dalam kasus itu, median lebih baik digunakan.
                  </p>
                </div>

                <MeanCalculator />
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal — Rata-Rata Data Tunggal" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Nilai ulangan matematika 6 siswa adalah: 72, 85, 68, 90, 78, 83. Hitunglah rata-ratanya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{72+85+68+90+78+83}{6} = \frac{476}{6} \approx 79{,}33" />
                      </div>
                      <p><strong className="text-primary">Rata-rata nilai = 79,33</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata nilai ulangan 8 siswa adalah 75. Jika ditambahkan satu siswa baru dengan nilai 83, berapakah rata-rata nilai seluruh siswa sekarang?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari total nilai 8 siswa awal:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sum x = \bar{x} \times n = 75 \times 8 = 600" />
                      </div>
                      <p><strong>Langkah 2:</strong> Tambahkan nilai siswa baru, hitung rata-rata baru:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x}_{\text{baru}} = \frac{600 + 83}{9} = \frac{683}{9} \approx 75{,}89" />
                      </div>
                      <p><strong className="text-primary">Rata-rata baru = 75,89</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata dari 5 bilangan adalah 48. Jika setiap bilangan dikalikan 3, kemudian dikurangi 4, tentukan rata-rata data yang baru!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Misalkan data baru = <InlineMath math="y_i = 3x_i - 4" />, maka:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{y} = \frac{\sum y_i}{n} = \frac{\sum (3x_i - 4)}{n}" />
                        <BlockMath math="= \frac{3\sum x_i - 4n}{n} = 3 \cdot \frac{\sum x_i}{n} - 4" />
                        <BlockMath math="= 3\bar{x} - 4 = 3(48) - 4 = 144 - 4 = 140" />
                      </div>
                      <p><strong className="text-primary">Rata-rata data baru = 140</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 2: RATA-RATA PADA TABEL DISTRIBUSI FREKUENSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Sub-Bab 2: Rata-Rata pada Tabel Distribusi Frekuensi" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika data disajikan dalam tabel distribusi frekuensi (data berkelompok), kita tidak bisa langsung menjumlahkan nilai aslinya. Sebagai gantinya, kita gunakan <strong className="text-blue-300">titik tengah tiap kelas</strong> sebagai representasi seluruh data dalam kelas tersebut.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">Rumus Rata-rata Data Berkelompok</p>
                    <BlockMath math="\bar{x} = \frac{\sum f_i \cdot x_i}{\sum f_i}" />
                    <div className="grid grid-cols-3 gap-2 text-xs font-body mt-2">
                      <div className="bg-blue-900/30 rounded p-2 text-center">
                        <p className="text-blue-300 font-bold"><InlineMath math="f_i" /></p>
                        <p className="text-white/50">frekuensi kelas ke-i</p>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2 text-center">
                        <p className="text-blue-300 font-bold"><InlineMath math="x_i" /></p>
                        <p className="text-white/50">titik tengah kelas ke-i</p>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2 text-center">
                        <p className="text-blue-300 font-bold"><InlineMath math="\sum f_i" /></p>
                        <p className="text-white/50">total frekuensi</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-blue-200">
                      <strong>Titik tengah kelas</strong> = <InlineMath math="\dfrac{\text{batas bawah} + \text{batas atas}}{2}" />
                    </p>
                  </div>
                </div>

                {/* Contoh tabel */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">📋 Contoh Tabel Distribusi Frekuensi Nilai 40 Siswa</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-2 py-2 text-left text-blue-300 font-bold">Kelas</th>
                          <th className="px-2 py-2 text-center text-white/70">f</th>
                          <th className="px-2 py-2 text-center text-white/70">xᵢ (titik tengah)</th>
                          <th className="px-2 py-2 text-center text-white/70">f · xᵢ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["50 – 59","4","54,5","218"],
                          ["60 – 69","8","64,5","516"],
                          ["70 – 79","14","74,5","1.043"],
                          ["80 – 89","10","84,5","845"],
                          ["90 – 99","4","94,5","378"],
                        ].map(([k,f,xi,fxi]) => (
                          <tr key={k} className="hover:bg-slate-700/20">
                            <td className="px-2 py-2 text-white font-semibold">{k}</td>
                            <td className="px-2 py-2 text-center text-green-300">{f}</td>
                            <td className="px-2 py-2 text-center text-yellow-300">{xi}</td>
                            <td className="px-2 py-2 text-center text-cyan-300">{fxi}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 border-t border-slate-500/50">
                          <td className="px-2 py-2 text-white font-bold">Total</td>
                          <td className="px-2 py-2 text-center text-green-400 font-bold">40</td>
                          <td className="px-2 py-2 text-center">—</td>
                          <td className="px-2 py-2 text-center text-cyan-400 font-bold">3.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-3">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\bar{x} = \frac{3000}{40} = 75" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Hasil rata-rata data berkelompok adalah nilai <em>perkiraan</em>, bukan nilai pasti, karena kita menggunakan titik tengah sebagai representasi tiap kelas.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Rata-Rata Tabel Distribusi Frekuensi" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">Dari tabel distribusi frekuensi berat badan berikut, hitunglah rata-ratanya!</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-2 py-1 text-left text-white/70">Berat (kg)</th><th className="px-2 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["40–44","3"],["45–49","7"],["50–54","10"],["55–59","6"],["60–64","4"]].map(([k,f]) => (
                            <tr key={k}><td className="px-2 py-1 text-white">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Kelas</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-white/50">xᵢ</th><th className="px-2 py-1 text-center text-white/50">f·xᵢ</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["40–44","3","42","126"],["45–49","7","47","329"],["50–54","10","52","520"],["55–59","6","57","342"],["60–64","4","62","248"]].map(([k,f,xi,fxi]) => (
                              <tr key={k}><td className="px-2 py-1 text-white/70">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td><td className="px-2 py-1 text-center text-yellow-300">{xi}</td><td className="px-2 py-1 text-center text-cyan-300">{fxi}</td></tr>
                            ))}
                            <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">Total</td><td className="px-2 py-1 text-center text-green-400">30</td><td></td><td className="px-2 py-1 text-center text-cyan-400">1.565</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{1565}{30} \approx 52{,}17 \text{ kg}" />
                      </div>
                      <p><strong className="text-primary">Rata-rata berat badan ≈ 52,17 kg</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari tabel distribusi frekuensi, diketahui <InlineMath math="\sum f_i \cdot x_i = 4.320" /> dan rata-ratanya adalah 72. Tentukan banyak data (<InlineMath math="n" />) yang digunakan!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Gunakan rumus rata-rata, lalu selesaikan untuk <InlineMath math="n" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{x} = \frac{\sum f_i \cdot x_i}{n}" />
                        <BlockMath math="72 = \frac{4320}{n}" />
                        <BlockMath math="n = \frac{4320}{72} = 60" />
                      </div>
                      <p><strong className="text-primary">Banyak data = 60</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tabel distribusi frekuensi tinggi badan 50 siswa memiliki 5 kelas dengan panjang kelas 5 cm. Batas bawah kelas pertama adalah 150 cm. Frekuensi tiap kelas: 6, 12, 18, 10, 4. Hitunglah rata-rata tinggi badan!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan kelas dan titik tengahnya:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Kelas</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-white/50">xᵢ</th><th className="px-2 py-1 text-center text-white/50">f·xᵢ</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["150–154","6","152","912"],["155–159","12","157","1.884"],["160–164","18","162","2.916"],["165–169","10","167","1.670"],["170–174","4","172","688"]].map(([k,f,xi,fxi]) => (
                              <tr key={k}><td className="px-2 py-1 text-white/70">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td><td className="px-2 py-1 text-center text-yellow-300">{xi}</td><td className="px-2 py-1 text-center text-cyan-300">{fxi}</td></tr>
                            ))}
                            <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">Total</td><td className="px-2 py-1 text-center text-green-400">50</td><td></td><td className="px-2 py-1 text-center text-cyan-400">8.070</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{8070}{50} = 161{,}4 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">Rata-rata tinggi badan = 161,4 cm</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 3: RATA-RATA PADA DIAGRAM BATANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 3: Rata-Rata pada Diagram Batang" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kadang data disajikan dalam <strong className="text-purple-300">diagram batang</strong>, bukan tabel. Untuk menghitung rata-rata, kamu perlu terlebih dahulu <em>membaca nilai dan frekuensi</em> dari tiap batang, lalu menerapkan rumus rata-rata seperti biasa.
                  </p>
                  <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-purple-200 space-y-1">
                      <strong>Langkah-langkah:</strong><br />
                      1. Baca setiap nilai kategori pada sumbu X<br />
                      2. Baca tinggi batang (frekuensi) pada sumbu Y<br />
                      3. Kalikan nilai × frekuensi untuk setiap batang<br />
                      4. Jumlahkan semua hasil perkalian dan bagi dengan total frekuensi
                    </p>
                  </div>
                </div>

                {/* Visual diagram batang contoh */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl overflow-hidden">
                  <div className="bg-purple-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-purple-200 uppercase tracking-wide">📊 Contoh Diagram Batang: Nilai Ujian Siswa</p>
                  </div>
                  <div className="p-4">
                    <div className="relative h-40 flex items-end gap-4 px-8 pb-7">
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between pb-7 pt-2">
                        {[20,15,10,5,0].map(v => <span key={v} className="text-white/30 text-xs font-body">{v}</span>)}
                      </div>
                      <div className="absolute left-7 right-2 top-2 bottom-7">
                        {[0,1,2,3,4].map(i => <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i/4)*100}%` }} />)}
                      </div>
                      {[
                        { val: "60", f: 5, color: "bg-red-500" },
                        { val: "70", f: 12, color: "bg-yellow-500" },
                        { val: "80", f: 18, color: "bg-green-500" },
                        { val: "90", f: 10, color: "bg-blue-500" },
                        { val: "100", f: 5, color: "bg-purple-500" },
                      ].map(({ val, f, color }) => (
                        <div key={val} className="flex flex-col items-center gap-1 flex-1 ml-7">
                          <span className="text-white/60 text-xs font-body">{f}</span>
                          <div className={`w-full ${color} rounded-t-sm`} style={{ height: `${(f / 20) * 120}px` }} />
                          <span className="text-white/40 text-xs font-body absolute bottom-0">{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 bg-slate-900/50 rounded-lg p-3">
                      <BlockMath math="\bar{x} = \frac{(60\times5)+(70\times12)+(80\times18)+(90\times10)+(100\times5)}{5+12+18+10+5}" />
                      <BlockMath math="= \frac{300+840+1440+900+500}{50} = \frac{3980}{50} = 79{,}6" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Saat membaca diagram batang, pastikan kamu membaca tinggi batang dengan teliti. Kalau tingginya di antara dua angka skala, perkirakan nilainya secara proporsional.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Rata-Rata dari Diagram Batang" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Dari diagram batang nilai ulangan IPA berikut, hitunglah rata-ratanya!
                    </p>
                    <div className="bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="border-b border-slate-600/50"><th className="px-3 py-1 text-left text-white/50">Nilai</th><th className="px-3 py-1 text-center text-white/50">Tinggi Batang (Frekuensi)</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["70","4"],["75","6"],["80","8"],["85","5"],["90","2"]].map(([v,f]) => <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-green-300">{f}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/50 mb-1">Hitung nilai × frekuensi:</p>
                        <p>70 × 4 = 280 &nbsp; 75 × 6 = 450 &nbsp; 80 × 8 = 640</p>
                        <p>85 × 5 = 425 &nbsp; 90 × 2 = 180</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{280+450+640+425+180}{4+6+8+5+2} = \frac{1975}{25} = 79" />
                      </div>
                      <p><strong className="text-primary">Rata-rata = 79</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari diagram batang, diketahui banyak siswa per nilai: Nilai 6 ada 3 siswa, Nilai 7 ada 10 siswa, Nilai 8 ada 12 siswa, Nilai 9 ada <InlineMath math="k" /> siswa. Jika rata-rata nilainya adalah 7,8, tentukan nilai <InlineMath math="k" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{x} = \frac{(6\times3)+(7\times10)+(8\times12)+(9\times k)}{3+10+12+k} = 7{,}8" />
                        <BlockMath math="\frac{18+70+96+9k}{25+k} = 7{,}8" />
                        <BlockMath math="184 + 9k = 7{,}8(25+k) = 195 + 7{,}8k" />
                        <BlockMath math="9k - 7{,}8k = 195 - 184 \implies 1{,}2k = 11 \implies k = \frac{11}{1{,}2} \approx 9{,}17" />
                      </div>
                      <p>Karena <InlineMath math="k" /> harus bilangan bulat, dibulatkan: <strong className="text-primary">k = 9 siswa</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diagram batang menunjukkan nilai ulangan dua kelas. Kelas A: (70→5 siswa), (80→8 siswa), (90→7 siswa). Kelas B: (70→4 siswa), (80→10 siswa), (90→6 siswa). Jika kedua kelas digabung, tentukan rata-rata nilai gabungan!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-xs text-white/50">Kelas A: n=20, Kelas B: n=20</p>
                        <BlockMath math="\sum(\text{A}) = 70(5)+80(8)+90(7) = 350+640+630 = 1620" />
                        <BlockMath math="\sum(\text{B}) = 70(4)+80(10)+90(6) = 280+800+540 = 1620" />
                        <BlockMath math="\bar{x}_{\text{gabungan}} = \frac{1620+1620}{20+20} = \frac{3240}{40} = 81" />
                      </div>
                      <p><strong className="text-primary">Rata-rata gabungan kedua kelas = 81</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 4: RATA-RATA GABUNGAN DATA BARU MASUK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 4: Rata-Rata Gabungan — Data Baru Masuk" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dalam kehidupan nyata, data sering bertambah — misalnya ada siswa baru masuk kelas. Daripada menghitung ulang dari awal, kita gunakan <strong className="text-cyan-300">rumus rata-rata gabungan</strong> yang efisien.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-1">Rumus Rata-rata Gabungan (Penggabungan Dua Kelompok)</p>
                    <BlockMath math="\bar{x}_{\text{gab}} = \frac{n_1 \cdot \bar{x}_1 + n_2 \cdot \bar{x}_2}{n_1 + n_2}" />
                    <div className="grid grid-cols-2 gap-2 text-xs font-body">
                      <div className="bg-cyan-900/30 rounded p-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="n_1, \bar{x}_1" /></p>
                        <p className="text-white/50">banyak data & rata-rata kelompok lama</p>
                      </div>
                      <div className="bg-cyan-900/30 rounded p-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="n_2, \bar{x}_2" /></p>
                        <p className="text-white/50">banyak data & rata-rata kelompok baru</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual alur penggabungan */}
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">🔗 Ilustrasi Penggabungan Data</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-cyan-300 font-bold">Kelompok Lama</p>
                        <p className="text-white text-sm font-bold"><InlineMath math="n_1 = 30, \; \bar{x}_1 = 75" /></p>
                      </div>
                      <div className="text-primary text-2xl font-bold">+</div>
                      <div className="bg-green-900/40 border border-green-500/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-green-300 font-bold">Kelompok Baru</p>
                        <p className="text-white text-sm font-bold"><InlineMath math="n_2 = 10, \; \bar{x}_2 = 85" /></p>
                      </div>
                      <div className="text-primary text-2xl font-bold">=</div>
                      <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-xl p-3 text-center">
                        <p className="text-xs text-yellow-300 font-bold">Gabungan</p>
                        <p className="text-yellow-200 text-sm font-bold"><InlineMath math="\bar{x} = \frac{30(75)+10(85)}{40} = 77{,}5" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Perhatikan:</strong> Rata-rata gabungan <em>tidak sama dengan</em> rata-rata dari dua rata-rata (<InlineMath math="\frac{\bar{x}_1 + \bar{x}_2}{2}" />) kecuali <InlineMath math="n_1 = n_2" />. Selalu gunakan rumus dengan bobot <InlineMath math="n_1" /> dan <InlineMath math="n_2" />!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal — Rata-Rata Gabungan Data Baru Masuk" />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Kelas A memiliki 20 siswa dengan rata-rata nilai 78. Kelas B memiliki 10 siswa dengan rata-rata nilai 84. Jika kedua kelas digabung, berapa rata-rata nilainya?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x}_{\text{gab}} = \frac{20 \times 78 + 10 \times 84}{20 + 10} = \frac{1560 + 840}{30} = \frac{2400}{30} = 80" />
                      </div>
                      <p><strong className="text-primary">Rata-rata gabungan = 80</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata berat 25 siswa kelas IX-A adalah 52 kg. Kemudian 5 siswa baru masuk dengan berat 48, 54, 56, 50, 52 kg. Tentukan rata-rata berat seluruh siswa sekarang!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari rata-rata 5 siswa baru:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x}_2 = \frac{48+54+56+50+52}{5} = \frac{260}{5} = 52 \text{ kg}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung rata-rata gabungan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x}_{\text{gab}} = \frac{25 \times 52 + 5 \times 52}{30} = \frac{1300+260}{30} = \frac{1560}{30} = 52 \text{ kg}" />
                      </div>
                      <p><strong className="text-primary">Rata-rata berat tetap 52 kg</strong> (karena rata-rata siswa baru sama dengan rata-rata awal).</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata nilai ujian <InlineMath math="n" /> siswa adalah 72. Setelah 8 siswa baru bergabung dengan rata-rata nilai 80, rata-rata keseluruhan menjadi 74. Tentukan nilai <InlineMath math="n" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Gunakan rumus rata-rata gabungan dan selesaikan untuk <InlineMath math="n" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\frac{n \cdot 72 + 8 \cdot 80}{n + 8} = 74" />
                        <BlockMath math="72n + 640 = 74(n+8) = 74n + 592" />
                        <BlockMath math="640 - 592 = 74n - 72n" />
                        <BlockMath math="48 = 2n \implies n = 24" />
                      </div>
                      <p><strong className="text-primary">Banyak siswa awal = 24 siswa</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 5: RATA-RATA GABUNGAN DATA LAMA KELUAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Sub-Bab 5: Rata-Rata Gabungan — Data Lama Keluar" />
            {expandedSections.includes("konsep5") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Sebaliknya, kadang ada data yang keluar/dihapus dari kumpulan data — misalnya ada siswa yang pindah sekolah. Untuk menghitung rata-rata setelah data dikeluarkan, gunakan pendekatan kebalikan dari penggabungan.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs text-white/50 text-center mb-1">Rumus Setelah Data Dikeluarkan</p>
                    <BlockMath math="\bar{x}_{\text{sisa}} = \frac{n_{\text{awal}} \cdot \bar{x}_{\text{awal}} - \sum x_{\text{keluar}}}{n_{\text{awal}} - n_{\text{keluar}}}" />
                    <p className="font-body text-xs text-white/50 text-center">atau jika yang keluar adalah satu kelompok dengan rata-rata tertentu:</p>
                    <BlockMath math="\bar{x}_{\text{sisa}} = \frac{n_1 \bar{x}_1 - n_2 \bar{x}_2}{n_1 - n_2}" />
                  </div>

                  {/* Visual alur pengeluaran data */}
                  <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">🔀 Ilustrasi Data Keluar</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <div className="bg-orange-900/40 border border-orange-500/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-orange-300 font-bold">Data Awal</p>
                        <p className="text-white text-sm font-bold"><InlineMath math="n=40, \bar{x}=80" /></p>
                      </div>
                      <div className="text-red-400 text-2xl font-bold">−</div>
                      <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-red-300 font-bold">Data Keluar</p>
                        <p className="text-white text-sm font-bold"><InlineMath math="n=5, \bar{x}=90" /></p>
                      </div>
                      <div className="text-primary text-2xl font-bold">=</div>
                      <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-xl p-3 text-center">
                        <p className="text-xs text-yellow-300 font-bold">Data Sisa</p>
                        <p className="text-yellow-200 text-sm font-bold"><InlineMath math="\bar{x} = \frac{40(80)-5(90)}{35} \approx 78{,}6" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Logikanya:</strong> Total nilai semua data = rata-rata × banyak data. Kalau ada data yang keluar, kurangi total dengan nilai data yang keluar, lalu bagi dengan banyak data yang tersisa.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh5" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title="📝 Contoh Soal — Rata-Rata Gabungan Data Lama Keluar" />
            {expandedSections.includes("contoh5") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata tinggi badan 30 siswa adalah 162 cm. Jika 3 siswa dengan tinggi 170, 168, dan 165 cm pindah sekolah, tentukan rata-rata tinggi badan siswa yang tersisa!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Total awal} = 30 \times 162 = 4860" />
                        <BlockMath math="\text{Total keluar} = 170+168+165 = 503" />
                        <BlockMath math="\bar{x}_{\text{sisa}} = \frac{4860 - 503}{30 - 3} = \frac{4357}{27} \approx 161{,}4 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">Rata-rata tinggi sisa ≈ 161,4 cm</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata nilai ujian 40 siswa adalah 76. Setelah 8 siswa dikeluarkan dari perhitungan (karena tidak hadir), rata-rata menjadi 75. Tentukan rata-rata nilai 8 siswa yang dikeluarkan!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Total awal} = 40 \times 76 = 3040" />
                        <BlockMath math="\text{Total sisa} = 32 \times 75 = 2400" />
                        <BlockMath math="\text{Total keluar} = 3040 - 2400 = 640" />
                        <BlockMath math="\bar{x}_{\text{keluar}} = \frac{640}{8} = 80" />
                      </div>
                      <p><strong className="text-primary">Rata-rata nilai 8 siswa yang dikeluarkan = 80</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rata-rata nilai 50 siswa adalah 74. Setelah 10 siswa pindah keluar, rata-rata menjadi 72. Kemudian 5 siswa baru masuk dengan rata-rata nilai 80. Tentukan rata-rata nilai seluruh siswa akhirnya!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Setelah 10 siswa keluar (40 siswa sisa, rata-rata 72):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-xs text-white/50 mb-1">Verifikasi:</p>
                        <BlockMath math="\text{Total sisa} = 40 \times 72 = 2880 \checkmark" />
                        <p className="text-xs text-white/50">(Total awal = 50×74=3700; total keluar = 3700−2880=820; rata2 keluar = 820/10 = 82)</p>
                      </div>
                      <p><strong>Langkah 2:</strong> Masuk 5 siswa baru (total menjadi 45):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x}_{\text{akhir}} = \frac{40 \times 72 + 5 \times 80}{45} = \frac{2880 + 400}{45} = \frac{3280}{45} \approx 72{,}89" />
                      </div>
                      <p><strong className="text-primary">Rata-rata akhir ≈ 72,89</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-yellow-400" title="🏁 Rangkuman Rata-Rata" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-cyan-300 text-center mb-3">⭐ Rumus-Rumus Kunci</p>
                  <div className="space-y-3">
                    {[
                      { label: "Rata-rata data tunggal", formula: "\\bar{x} = \\dfrac{\\sum x_i}{n}", color: "border-green-500/40 bg-green-900/20" },
                      { label: "Rata-rata data berkelompok", formula: "\\bar{x} = \\dfrac{\\sum f_i \\cdot x_i}{\\sum f_i}", color: "border-blue-500/40 bg-blue-900/20" },
                      { label: "Rata-rata gabungan", formula: "\\bar{x}_{\\text{gab}} = \\dfrac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2}", color: "border-cyan-500/40 bg-cyan-900/20" },
                      { label: "Rata-rata setelah data keluar", formula: "\\bar{x}_{\\text{sisa}} = \\dfrac{n_1 \\bar{x}_1 - n_2 \\bar{x}_2}{n_1 - n_2}", color: "border-orange-500/40 bg-orange-900/20" },
                    ].map(({ label, formula, color }) => (
                      <div key={label} className={`border ${color} rounded-xl p-3`}>
                        <p className="font-body text-xs text-white/60 mb-2">{label}</p>
                        <div className="bg-slate-900/50 rounded p-2">
                          <BlockMath math={formula} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Siap lanjut? 🎉</strong> Kamu sudah menguasai seluruh konsep Rata-rata! Lanjutkan ke materi berikutnya: Median dan Modus — dua ukuran pemusatan data lainnya yang sama pentingnya! 🚀
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

export default RataRataPage;
