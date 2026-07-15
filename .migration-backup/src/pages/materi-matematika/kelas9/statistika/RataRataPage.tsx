import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Kalkulator Rata-rata Interaktif ─── */
const MeanCalculator = () => {
  const { language } = useLanguage();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ values: number[]; sum: number; mean: number } | null>(null);
  const [error, setError] = useState("");

  const tc = {
    title:       language === "id" ? "Kalkulator Rata-rata Data Tunggal"    : language === "en" ? "Mean Calculator (Individual Data)"    : "平均計算機（個別データ）",
    hint:        language === "id" ? "Masukkan data/nilai dipisah"           : language === "en" ? "Enter data/values separated by"        : "データを",
    hintSep:     language === "id" ? "koma"                                  : language === "en" ? "commas"                                 : "コンマで区切って入力",
    placeholder: "70, 80, 90, 60, 75",
    calcBtn:     language === "id" ? "Hitung"     : language === "en" ? "Calculate" : "計算",
    meanLabel:   language === "id" ? "Rata-rata"  : language === "en" ? "Mean"       : "平均",
    nLabel:      language === "id" ? "Banyak Data (n)" : language === "en" ? "Count (n)" : "データ数 (n)",
    sumLabel:    language === "id" ? "Jumlah (Σx)"     : language === "en" ? "Sum (Σx)"  : "合計 (Σx)",
    errEmpty:    language === "id" ? "Masukkan minimal satu angka!"                    : language === "en" ? "Enter at least one number!"                        : "少なくとも1つの数値を入力してください！",
    errInvalid:  language === "id" ? "Pastikan semua data adalah angka yang valid."    : language === "en" ? "Make sure all data are valid numbers."              : "すべてのデータが有効な数値であることを確認してください。",
  };

  const calculate = () => {
    playPopSound();
    setError("");
    setResult(null);
    const parts = input.split(",").map(s => s.trim()).filter(s => s !== "");
    if (parts.length === 0) { setError(tc.errEmpty); return; }
    const values = parts.map(p => parseFloat(p.replace(",", ".")));
    if (values.some(isNaN)) { setError(tc.errInvalid); return; }
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
      <p className="font-body text-sm font-bold text-green-300">🧮 {tc.title}</p>
      <p className="font-body text-xs text-white/55">
        {tc.hint}{" "}<strong className="text-green-300">{tc.hintSep}</strong>
        {language !== "ja" && <>. {language === "id" ? "Contoh:" : "Example:"}{" "}<span className="text-green-300 font-mono">70, 80, 90, 60, 75</span></>}
        {language === "ja" && <>。例：<span className="text-green-300 font-mono">70, 80, 90, 60, 75</span></>}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && calculate()}
          placeholder={tc.placeholder}
          className="flex-1 bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2 outline-none focus:border-green-500 placeholder:text-white/25"
        />
        <button
          onClick={calculate}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold font-body px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          {tc.calcBtn}
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
              <p className="text-white/50 text-xs font-body">{tc.meanLabel}</p>
              <p className="text-cyan-300 font-bold text-xl font-body">{fmt(result.mean)}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-3 text-center overflow-x-auto">
            <BlockMath math={buildLatex()} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
            <div className="bg-slate-800/60 rounded-lg p-2">
              <p className="text-white/40 mb-1">{tc.nLabel}</p>
              <p className="text-white font-bold text-base">{result.values.length}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2">
              <p className="text-white/40 mb-1">{tc.sumLabel}</p>
              <p className="text-yellow-300 font-bold text-base">{fmt(result.sum)}</p>
            </div>
            <div className="bg-cyan-900/50 border border-cyan-500/40 rounded-lg p-2">
              <p className="text-white/40 mb-1">{tc.meanLabel} (x̄)</p>
              <p className="text-cyan-300 font-bold text-base">{fmt(result.mean)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Kalkulator Rata-rata Gabungan ─── */
const CombinedMeanCalculator = () => {
  const { language } = useLanguage();
  const [groups, setGroups] = useState([
    { n: "", mean: "", label: language === "id" ? "Kelompok Lama" : language === "en" ? "Old Group" : "既存グループ" },
    { n: "", mean: "", label: language === "id" ? "Kelompok Baru" : language === "en" ? "New Group" : "新グループ" },
  ]);
  const [result, setResult] = useState<{
    groups: { n: number; mean: number; label: string }[];
    totalN: number; totalSum: number; combinedMean: number;
  } | null>(null);
  const [error, setError] = useState("");

  const tc = {
    title:       language === "id" ? "Kalkulator Rata-rata Gabungan"   : language === "en" ? "Combined Mean Calculator"     : "合成平均計算機",
    addGroup:    language === "id" ? "+ Tambah Kelompok"               : language === "en" ? "+ Add Group"                  : "+ グループ追加",
    hint:        language === "id" ? "Isi"                             : language === "en" ? "Fill in"                      : "各グループの",
    hintN:       language === "id" ? "n"                               : language === "en" ? "n"                            : "n",
    hintMean:    language === "id" ? "x̄"                              : language === "en" ? "x̄"                           : "x̄",
    hintCalc:    language === "id" ? "lalu klik Hitung"               : language === "en" ? "then click Calculate"         : "を入力してから計算をクリック",
    nLabel:      language === "id" ? "n (banyak data)"                : language === "en" ? "n (data count)"               : "n（データ数）",
    meanInputLabel: language === "id" ? "x̄ (rata-rata)"             : language === "en" ? "x̄ (mean)"                    : "x̄（平均）",
    calcBtn:     language === "id" ? "Hitung Rata-rata Gabungan"      : language === "en" ? "Calculate Combined Mean"      : "合成平均を計算",
    removeBtn:   language === "id" ? "✕ Hapus"                        : language === "en" ? "✕ Remove"                     : "✕ 削除",
    combinedLabel: language === "id" ? "x̄ gabungan"                  : language === "en" ? "Combined x̄"                  : "合成 x̄",
    totalNLabel: language === "id" ? "Total Data (n)"                 : language === "en" ? "Total Data (n)"               : "データ合計 (n)",
    totalSumLabel: language === "id" ? "Jumlah (Σn·x̄)"              : language === "en" ? "Sum (Σn·x̄)"                  : "合計 (Σn·x̄)",
    groupLabel:  (i: number) => language === "id" ? `Kelompok ${i+1}` : language === "en" ? `Group ${i+1}`                 : `グループ${i+1}`,
    oldLabel:    language === "id" ? "Kelompok Lama"                  : language === "en" ? "Old Group"                    : "既存グループ",
    newLabel:    language === "id" ? "Kelompok Baru"                  : language === "en" ? "New Group"                    : "新グループ",
    errInvalid:  language === "id" ? "Pastikan semua kolom n dan rata-rata terisi dengan angka yang valid." : language === "en" ? "Make sure all n and mean fields are filled with valid numbers." : "すべてのnと平均フィールドに有効な数値が入力されていることを確認してください。",
    errNPos:     language === "id" ? "Banyak data (n) harus lebih dari 0." : language === "en" ? "Data count (n) must be greater than 0." : "データ数（n）は0より大きくなければなりません。",
  };

  const updateGroup = (i: number, field: "n" | "mean", val: string) => {
    setGroups(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: val } : g));
    setResult(null); setError("");
  };

  const addGroup = () => {
    playPopSound();
    const newLabel = tc.groupLabel(groups.length - 1);
    setGroups(prev => [
      ...prev.slice(0, -1),
      { n: "", mean: "", label: newLabel },
      { ...prev[prev.length - 1], label: tc.newLabel },
    ]);
    setResult(null);
  };

  const removeGroup = (i: number) => {
    if (groups.length <= 2) return;
    playPopSound();
    const next = groups.filter((_, idx) => idx !== i);
    next[next.length - 1] = { ...next[next.length - 1], label: tc.newLabel };
    setGroups(next); setResult(null);
  };

  const calculate = () => {
    playPopSound(); setError(""); setResult(null);
    const parsed = groups.map(g => ({
      n: parseFloat(g.n), mean: parseFloat(g.mean.replace(",", ".")), label: g.label,
    }));
    if (parsed.some(g => isNaN(g.n) || isNaN(g.mean))) { setError(tc.errInvalid); return; }
    if (parsed.some(g => g.n <= 0)) { setError(tc.errNPos); return; }
    const totalN = parsed.reduce((a, g) => a + g.n, 0);
    const totalSum = parsed.reduce((a, g) => a + g.n * g.mean, 0);
    setResult({ groups: parsed, totalN, totalSum, combinedMean: totalSum / totalN });
  };

  const fmt = (n: number) => Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(4)).toString();

  const buildLatex = () => {
    if (!result) return "";
    const { groups: g, totalN, totalSum, combinedMean } = result;
    const step1 = g.map(gr => `${fmt(gr.n)} \\times ${fmt(gr.mean)}`).join(" + ");
    const step2 = g.map(gr => fmt(gr.n * gr.mean)).join(" + ");
    return `\\bar{x}_{\\text{gab}} = \\frac{${step1}}{${fmt(totalN)}} = \\frac{${step2}}{${fmt(totalN)}} = \\frac{${fmt(totalSum)}}{${fmt(totalN)}} = ${fmt(combinedMean)}`;
  };

  const groupColors = [
    { bg: "bg-cyan-900/25 border-cyan-500/30", label: "text-cyan-300", card: "bg-cyan-900/40 border-cyan-500/40", val: "text-cyan-300" },
    { bg: "bg-green-900/25 border-green-500/30", label: "text-green-300", card: "bg-green-900/40 border-green-500/40", val: "text-green-300" },
    { bg: "bg-purple-900/25 border-purple-500/30", label: "text-purple-300", card: "bg-purple-900/40 border-purple-500/40", val: "text-purple-300" },
    { bg: "bg-orange-900/25 border-orange-500/30", label: "text-orange-300", card: "bg-orange-900/40 border-orange-500/40", val: "text-orange-300" },
  ];
  const colorOf = (i: number, key: keyof typeof groupColors[0]) => groupColors[Math.min(i, groupColors.length - 1)][key];

  return (
    <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-body text-sm font-bold text-cyan-300">🧮 {tc.title}</p>
        <button onClick={addGroup} className="text-xs font-body font-bold text-cyan-300 border border-cyan-500/40 bg-cyan-900/30 hover:bg-cyan-800/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          {tc.addGroup}
        </button>
      </div>
      <p className="font-body text-xs text-white/55">
        {language === "ja" ? (
          <>各グループの <strong className="text-cyan-300">n</strong>（データ数）と <strong className="text-cyan-300">x̄</strong>（平均）を入力してから、<strong className="text-cyan-300">計算</strong>をクリック。</>
        ) : (
          <>Fill in <strong className="text-cyan-300">n</strong> ({language === "id" ? "banyak data" : "data count"}) and <strong className="text-cyan-300">x̄</strong> ({language === "id" ? "rata-rata" : "mean"}) for each group, then click <strong className="text-cyan-300">{language === "id" ? "Hitung" : "Calculate"}</strong>.</>
        )}
      </p>

      <div className="space-y-3">
        {groups.map((g, i) => (
          <div key={i} className={`rounded-xl p-3 space-y-2 border ${colorOf(i, "bg")}`}>
            <div className="flex items-center justify-between">
              <p className={`font-body text-xs font-bold ${colorOf(i, "label")}`}>{g.label}</p>
              {groups.length > 2 && i > 0 && i < groups.length - 1 && (
                <button onClick={() => removeGroup(i)} className="text-red-400/60 hover:text-red-400 text-xs font-body cursor-pointer transition-colors">{tc.removeBtn}</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-body text-xs text-white/40 mb-1">{tc.nLabel}</label>
                <input type="number" value={g.n} onChange={e => updateGroup(i, "n", e.target.value)}
                  placeholder={language === "id" ? "Contoh: 30" : language === "en" ? "e.g. 30" : "例：30"}
                  className="w-full bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2 outline-none focus:border-cyan-500 placeholder:text-white/25" />
              </div>
              <div>
                <label className="block font-body text-xs text-white/40 mb-1">{tc.meanInputLabel}</label>
                <input type="text" value={g.mean} onChange={e => updateGroup(i, "mean", e.target.value)}
                  placeholder={language === "id" ? "Contoh: 75" : language === "en" ? "e.g. 75" : "例：75"}
                  className="w-full bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2 outline-none focus:border-cyan-500 placeholder:text-white/25" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={calculate} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer">
        {tc.calcBtn}
      </button>

      {error && <p className="text-red-400 text-xs font-body">⚠️ {error}</p>}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {result.groups.flatMap((g, i) => [
              i > 0 ? <span key={`sep-${i}`} className="text-white/40 text-base font-bold">+</span> : null,
              <div key={`grp-${i}`} className={`border ${colorOf(i, "card")} rounded-xl p-2.5 text-center min-w-[90px]`}>
                <p className={`text-xs font-body font-bold mb-0.5 ${colorOf(i, "val")}`}>{g.label}</p>
                <p className="text-white/60 text-xs font-body">n={fmt(g.n)}, x̄={fmt(g.mean)}</p>
                <p className="text-yellow-300 text-sm font-bold font-body mt-1">{fmt(g.n)}×{fmt(g.mean)} = {fmt(g.n * g.mean)}</p>
              </div>,
            ]).filter(Boolean)}
            <span className="text-primary text-xl font-bold">=</span>
            <div className="bg-yellow-900/50 border-2 border-yellow-500/60 rounded-xl px-4 py-2.5 text-center">
              <p className="text-white/50 text-xs font-body">{tc.combinedLabel}</p>
              <p className="text-yellow-200 font-bold text-xl font-body">{fmt(result.combinedMean)}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-3 text-center overflow-x-auto">
            <BlockMath math={buildLatex()} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
            <div className="bg-slate-800/60 rounded-lg p-2">
              <p className="text-white/40 mb-1">{tc.totalNLabel}</p>
              <p className="text-white font-bold text-base">{fmt(result.totalN)}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2">
              <p className="text-white/40 mb-1">{tc.totalSumLabel}</p>
              <p className="text-yellow-300 font-bold text-base">{fmt(result.totalSum)}</p>
            </div>
            <div className="bg-cyan-900/50 border border-cyan-500/40 rounded-lg p-2">
              <p className="text-white/40 mb-1">{tc.combinedLabel}</p>
              <p className="text-cyan-300 font-bold text-base">{fmt(result.combinedMean)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ─── */
const RataRataPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = {
    pageTitle:  language === "id" ? "UKURAN PEMUSATAN DATA"           : language === "en" ? "MEASURES OF CENTRAL TENDENCY"        : "データの中心傾向",
    subtitle:   language === "id" ? "Rata-Rata & Rata-Rata Gabungan"  : language === "en" ? "Mean & Combined Mean"                 : "平均と合成平均",
    breadcrumb: language === "id" ? "Kelas 9 · Statistika · Materi Matematika" : language === "en" ? "Grade 9 · Statistics · Mathematics" : "中学3年 · 統計学 · 数学",
    easy:   language === "id" ? "MUDAH"  : language === "en" ? "EASY"   : "基本",
    medium: language === "id" ? "SEDANG" : language === "en" ? "MEDIUM" : "標準",
    hard:   language === "id" ? "SULIT"  : language === "en" ? "HARD"   : "発展",
    example:    language === "id" ? "Contoh"       : language === "en" ? "Example"     : "例題",
    discussion: language === "id" ? "PEMBAHASAN:"  : language === "en" ? "DISCUSSION:" : "解説：",
    step: (n: number) => language === "id" ? `Langkah ${n}:` : language === "en" ? `Step ${n}:` : `ステップ${n}：`,
    total:      language === "id" ? "Total"        : language === "en" ? "Total"       : "合計",
    freq:       language === "id" ? "Frekuensi"    : language === "en" ? "Frequency"   : "度数",
    score:      language === "id" ? "Nilai"        : language === "en" ? "Score"       : "点数",
    backBtn:    language === "id" ? "← Kembali ke Statistika" : language === "en" ? "← Back to Statistics" : "← 統計学に戻る",
    mean:       language === "id" ? "Rata-rata"    : language === "en" ? "Mean"        : "平均",
    combinedMean: language === "id" ? "Rata-rata Gabungan" : language === "en" ? "Combined Mean" : "合成平均",
    weightedMean: language === "id" ? "Rata-rata Berbobot"  : language === "en" ? "Weighted Mean"  : "加重平均",
    students:   (n: number | string) => language === "id" ? `${n} siswa` : language === "en" ? `${n} students` : `${n}人`,
    kg:         language === "id" ? "kg" : language === "en" ? "kg" : "kg",
  };

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

  /* ── Rangkuman data per language ── */
  const rangkumanData = {
    id: {
      judul: "Rangkuman — Rata-Rata (Mean)",
      subjudul: "Ukuran pemusatan paling populer di dunia — satu angka yang merangkum seluruh data!",
      ringkasan: [
        { emoji: "➕", judul: "Rata-Rata Data Tunggal", isi: "Jumlahkan semua nilai lalu bagi dengan banyak data (n). Setiap nilai berpengaruh terhadap hasil rata-rata — termasuk nilai terbesar dan terkecil!", bg: "bg-green-900/50", border: "border-green-500/40", textColor: "text-green-200" },
        { emoji: "📋", judul: "Rata-Rata dari Tabel Frekuensi", isi: "Kalikan setiap nilai (xi) dengan frekuensinya (fi), jumlahkan hasilnya, lalu bagi total frekuensi. Rumus: x̄ = Σ(fi·xi) / Σ(fi).", bg: "bg-emerald-900/50", border: "border-emerald-500/40", textColor: "text-emerald-200" },
        { emoji: "🔄", judul: "Sifat Transformasi Linear", isi: "Jika yi = axi + b, maka rata-rata y = a·(rata-rata x) + b. Rata-rata mengikuti transformasi linear secara langsung!", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
        { emoji: "🔗", judul: "Rata-Rata Gabungan", isi: "Untuk menggabungkan dua kelompok: x̄_gab = (n₁·x̄₁ + n₂·x̄₂)/(n₁+n₂). Rata-rata gabungan TIDAK sama dengan rata-rata dari dua rata-rata kecuali n₁=n₂.", bg: "bg-cyan-900/50", border: "border-cyan-500/40", textColor: "text-cyan-200" },
      ],
      rumus: [
        { label: "Rata-Rata Data Tunggal", rumus: "\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}", bg: "bg-green-900/60", border: "border-green-400/40", labelColor: "text-green-300" },
        { label: "Rata-Rata dari Tabel Frekuensi", rumus: "\\bar{x} = \\frac{\\sum f_i \\cdot x_i}{\\sum f_i}", bg: "bg-emerald-900/60", border: "border-emerald-400/40", labelColor: "text-emerald-300" },
      ],
      tips: [
        { emoji: "💡", teks: "Rata-rata sangat sensitif terhadap outlier (nilai ekstrem). Satu nilai yang jauh berbeda dapat menarik rata-rata jauh dari nilai 'wajar'. Cek selalu nilai terbesar dan terkecil!" },
        { emoji: "🔄", teks: "Transformasi linear: jika y = 3x - 4, maka rata-rata y = 3·(rata-rata x) - 4. Sangat berguna untuk penyederhanaan perhitungan!" },
        { emoji: "🎯", teks: "Cek hasil: rata-rata harus berada di antara nilai terkecil dan terbesar data. Jika di luar rentang itu, ada kesalahan perhitungan." },
        { emoji: "📊", teks: "Rata-rata digunakan di rapor sekolah, statistik olahraga (rata-rata gol/poin), analisis ekonomi (pendapatan per kapita), dan hampir semua bidang ilmu." },
      ],
      kesimpulan: "Rata-rata adalah jembatan antara data individual dan gambaran keseluruhan. Satu angka yang merangkum ribuan nilai — digunakan di rapor, laporan bisnis, riset ilmiah, hingga kecerdasan buatan. Kuasai rata-rata, kamu kuasai bahasa angka dunia!",
    },
    en: {
      judul: "Summary — Mean",
      subjudul: "The most popular measure of central tendency — one number that summarizes all the data!",
      ringkasan: [
        { emoji: "➕", judul: "Mean of Individual Data", isi: "Sum all values then divide by the count (n). Every value affects the mean — including the largest and smallest!", bg: "bg-green-900/50", border: "border-green-500/40", textColor: "text-green-200" },
        { emoji: "📋", judul: "Mean from a Frequency Table", isi: "Multiply each value (xi) by its frequency (fi), sum the products, then divide by total frequency. Formula: x̄ = Σ(fi·xi) / Σ(fi).", bg: "bg-emerald-900/50", border: "border-emerald-500/40", textColor: "text-emerald-200" },
        { emoji: "🔄", judul: "Linear Transformation Property", isi: "If yi = axi + b, then mean of y = a·(mean of x) + b. The mean follows linear transformations directly!", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
        { emoji: "🔗", judul: "Combined Mean", isi: "To combine two groups: x̄_combined = (n₁·x̄₁ + n₂·x̄₂)/(n₁+n₂). The combined mean is NOT the average of two means unless n₁=n₂.", bg: "bg-cyan-900/50", border: "border-cyan-500/40", textColor: "text-cyan-200" },
      ],
      rumus: [
        { label: "Mean of Individual Data", rumus: "\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}", bg: "bg-green-900/60", border: "border-green-400/40", labelColor: "text-green-300" },
        { label: "Mean from Frequency Table", rumus: "\\bar{x} = \\frac{\\sum f_i \\cdot x_i}{\\sum f_i}", bg: "bg-emerald-900/60", border: "border-emerald-400/40", labelColor: "text-emerald-300" },
      ],
      tips: [
        { emoji: "💡", teks: "The mean is highly sensitive to outliers (extreme values). One very different value can pull the mean far from the 'typical' value. Always check the max and min!" },
        { emoji: "🔄", teks: "Linear transformation: if y = 3x - 4, then mean of y = 3·(mean of x) - 4. Very useful for simplifying calculations!" },
        { emoji: "🎯", teks: "Check your result: the mean must lie between the smallest and largest values in the data. If it's outside that range, there's a calculation error." },
        { emoji: "📊", teks: "The mean is used in school report cards, sports statistics (average goals/points), economic analysis (per capita income), and almost every field of study." },
      ],
      kesimpulan: "The mean is the bridge between individual data points and the overall picture. One number that summarizes thousands of values — used in report cards, business reports, scientific research, and artificial intelligence. Master the mean, and you master the language of numbers!",
    },
    ja: {
      judul: "まとめ — 平均（Mean）",
      subjudul: "世界で最も使われる中心傾向の指標 — すべてのデータを1つの数値に集約！",
      ringkasan: [
        { emoji: "➕", judul: "個別データの平均", isi: "すべての値を合計してデータ数（n）で割ります。最大値と最小値を含むすべての値が平均に影響します！", bg: "bg-green-900/50", border: "border-green-500/40", textColor: "text-green-200" },
        { emoji: "📋", judul: "度数分布表からの平均", isi: "各値（xi）にその度数（fi）を掛け、積を合計してから総度数で割ります。公式：x̄ = Σ(fi·xi) / Σ(fi)。", bg: "bg-emerald-900/50", border: "border-emerald-500/40", textColor: "text-emerald-200" },
        { emoji: "🔄", judul: "一次変換の性質", isi: "yi = axi + b の場合、yの平均 = a·(xの平均) + b。平均は一次変換に直接従います！", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
        { emoji: "🔗", judul: "合成平均", isi: "2グループの合成：x̄_合成 = (n₁·x̄₁ + n₂·x̄₂)/(n₁+n₂)。合成平均はn₁=n₂の場合を除き、2つの平均の平均とは異なります。", bg: "bg-cyan-900/50", border: "border-cyan-500/40", textColor: "text-cyan-200" },
      ],
      rumus: [
        { label: "個別データの平均", rumus: "\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}", bg: "bg-green-900/60", border: "border-green-400/40", labelColor: "text-green-300" },
        { label: "度数分布表からの平均", rumus: "\\bar{x} = \\frac{\\sum f_i \\cdot x_i}{\\sum f_i}", bg: "bg-emerald-900/60", border: "border-emerald-400/40", labelColor: "text-emerald-300" },
      ],
      tips: [
        { emoji: "💡", teks: "平均は外れ値（極端な値）に非常に敏感です。1つの非常に異なる値が平均を「典型的な」値から遠ざける可能性があります。常に最大値と最小値を確認しましょう！" },
        { emoji: "🔄", teks: "一次変換：y = 3x - 4 の場合、yの平均 = 3·(xの平均) - 4。計算を簡略化するのに非常に役立ちます！" },
        { emoji: "🎯", teks: "結果を確認：平均はデータの最小値と最大値の間になければなりません。その範囲外にある場合は計算エラーがあります。" },
        { emoji: "📊", teks: "平均は学校の通知表、スポーツ統計（平均得点/ゴール）、経済分析（1人当たり収入）、ほぼすべての学問分野で使われています。" },
      ],
      kesimpulan: "平均は個々のデータポイントと全体像をつなぐ橋です。何千もの値を1つの数値に集約します — 通知表、ビジネスレポート、科学研究、人工知能で使われています。平均をマスターすれば、数の世界の言語をマスターできます！",
    },
  };
  const rst = rangkumanData[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title={language === "id" ? "🌟 Apa Itu Ukuran Pemusatan Data?" : language === "en" ? "🌟 What Are Measures of Central Tendency?" : "🌟 データの中心傾向とは？"} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {language === "id" ? <>Setelah kamu bisa menyajikan data dalam berbagai bentuk diagram, saatnya kamu belajar <strong className="text-cyan-300">mengolah dan menganalisis</strong> data tersebut. Salah satu cara paling dasar adalah mencari <strong className="text-cyan-300">ukuran pemusatan data</strong> — nilai tunggal yang mewakili keseluruhan data.</>
                : language === "en" ? <>Now that you can present data in various chart forms, it's time to learn how to <strong className="text-cyan-300">process and analyze</strong> that data. One of the most basic methods is finding the <strong className="text-cyan-300">measure of central tendency</strong> — a single value that represents the entire dataset.</>
                : <>様々なグラフ形式でデータを提示できるようになったら、そのデータを<strong className="text-cyan-300">処理・分析</strong>する方法を学ぶ時です。最も基本的な方法の1つは、<strong className="text-cyan-300">中心傾向の指標</strong>を求めることです — データセット全体を代表する1つの値。</>}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { simbol: "x̄", nama: language === "id" ? "Rata-rata" : language === "en" ? "Mean" : "平均", desc: language === "id" ? "Jumlah semua data dibagi banyaknya data" : language === "en" ? "Sum of all data divided by the count" : "すべての値の合計をデータ数で割る", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
                  { simbol: "Me", nama: language === "id" ? "Median" : language === "en" ? "Median" : "中央値", desc: language === "id" ? "Nilai tengah setelah data diurutkan" : language === "en" ? "The middle value after sorting the data" : "データを並べたときの中央の値", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                  { simbol: "Mo", nama: language === "id" ? "Modus" : language === "en" ? "Mode" : "最頻値", desc: language === "id" ? "Nilai yang paling sering muncul" : language === "en" ? "The value that appears most often" : "最も頻繁に現れる値", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
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
                  {language === "id" ? <>Di halaman ini kita fokus pada <strong>Rata-rata (Mean)</strong> — mulai dari data tunggal sederhana hingga rata-rata gabungan yang lebih menantang! 🚀</>
                  : language === "en" ? <>On this page we focus on the <strong>Mean</strong> — from simple individual data to the more challenging combined mean! 🚀</>
                  : <>このページでは<strong>平均（Mean）</strong>に焦点を当てます — 簡単な個別データから、より挑戦的な合成平均まで！🚀</>}
                </p>
              </div>
            </div>
          </div>

          {/* SUB-BAB 1: RATA-RATA DATA TUNGGAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title={language === "id" ? "📘 Sub-Bab 1: Rata-Rata Data Tunggal" : language === "en" ? "📘 Chapter 1: Mean of Individual Data" : "📘 第1節：個別データの平均"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-green-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? <><strong className="text-green-300">Rata-rata (mean)</strong> adalah nilai yang diperoleh dengan menjumlahkan seluruh data lalu membaginya dengan banyaknya data. Ini cara paling umum dipakai untuk merangkum sekumpulan data menjadi satu angka representatif.</>
                  : language === "en" ? <><strong className="text-green-300">The mean</strong> is the value obtained by summing all data then dividing by the count. It is the most common way to summarize a dataset into one representative number.</>
                  : <><strong className="text-green-300">平均（Mean）</strong>は、すべてのデータを合計してデータ数で割ることで得られる値です。データセットを1つの代表的な数値に要約する最も一般的な方法です。</>}
                </p>
                <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-3">
                  <p className="font-body text-xs text-white/50 mb-1">
                    {language === "id" ? "Rumus Rata-rata Data Tunggal" : language === "en" ? "Mean Formula (Individual Data)" : "個別データの平均公式"}
                  </p>
                  <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg px-4 py-2">
                    <p className="font-body text-sm text-white">
                      <span className="text-cyan-300 font-bold">{t.mean}</span>
                      <span className="text-white/60"> = </span>
                      <span className="text-yellow-300 font-bold">
                        {language === "id" ? "jumlah nilai (data)" : language === "en" ? "sum of values" : "値の合計"}
                      </span>
                      <span className="text-white/60"> ÷ </span>
                      <span className="text-green-300 font-bold">
                        {language === "id" ? "banyak nilai (data)" : language === "en" ? "count of values" : "データ数"}
                      </span>
                    </p>
                  </div>
                  <BlockMath math="\bar{x} = \frac{x_1 + x_2 + x_3 + \cdots + x_n}{n} = \frac{\sum_{i=1}^{n} x_i}{n}" />
                  <p className="font-body text-xs text-white/50">
                    <InlineMath math="\bar{x}" /> = {t.mean} &nbsp;|&nbsp; <InlineMath math="x_i" /> = {language === "id" ? "nilai data ke-" : language === "en" ? "value at index " : "i番目のデータ値"}<InlineMath math="i" /> &nbsp;|&nbsp; <InlineMath math="n" /> = {language === "id" ? "banyak data" : language === "en" ? "data count" : "データ数"}
                  </p>
                </div>
              </div>

              {/* Illustration */}
              <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-4">
                <p className="font-body text-xs font-bold text-green-300 mb-3 uppercase tracking-wide">
                  📌 {language === "id" ? "Ilustrasi Rata-rata" : language === "en" ? "Mean Illustration" : "平均のイラスト"}
                </p>
                <p className="font-body text-xs text-white/60 mb-3">
                  {language === "id" ? "Data nilai 5 siswa: 70, 80, 90, 60, 75" : language === "en" ? "Scores of 5 students: 70, 80, 90, 60, 75" : "5人の生徒の点数：70、80、90、60、75"}
                </p>
                <div className="flex items-center gap-2 flex-wrap justify-center mb-3">
                  {[70,80,90,60,75].map((v,i) => (
                    <div key={i} className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-center">
                      <p className="text-green-300 font-bold text-sm">{v}</p>
                    </div>
                  ))}
                  <span className="text-white/40 text-lg">→</span>
                  <div className="bg-cyan-900/50 border-2 border-cyan-500/60 rounded-lg px-4 py-2 text-center">
                    <p className="text-white/50 text-xs">{t.mean}</p>
                    <p className="text-cyan-300 font-bold text-xl">75</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <BlockMath math="\bar{x} = \frac{70+80+90+60+75}{5} = \frac{375}{5} = 75" />
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? <><strong>Tips:</strong> Rata-rata sangat dipengaruhi oleh nilai ekstrem (sangat besar atau sangat kecil). Jika ada outlier, rata-rata bisa jadi tidak representatif. Dalam kasus itu, median lebih baik digunakan.</>
                  : language === "en" ? <><strong>Tip:</strong> The mean is heavily influenced by extreme values (very large or very small). If there are outliers, the mean may not be representative. In that case, the median is better to use.</>
                  : <><strong>ヒント：</strong>平均は極端な値（非常に大きいまたは非常に小さい値）に大きく影響されます。外れ値がある場合、平均は代表的でない可能性があります。その場合は中央値の方が適切です。</>}
                </p>
              </div>
              <MeanCalculator />
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400"
              title={language === "id" ? "📝 Contoh Soal — Rata-Rata Data Tunggal" : language === "en" ? "📝 Practice Problems — Mean of Individual Data" : "📝 練習問題 — 個別データの平均"} />
            <div className="px-5 pb-5 space-y-6">

              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Nilai ulangan matematika 6 siswa adalah: 72, 85, 68, 90, 78, 83. Hitunglah rata-ratanya!"
                    : language === "en" ? "The math quiz scores of 6 students are: 72, 85, 68, 90, 78, 83. Calculate the mean!"
                    : "6人の生徒の数学の小テストの点数は：72、85、68、90、78、83。平均を計算しなさい！"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x} = \frac{72+85+68+90+78+83}{6} = \frac{476}{6} \approx 79{,}33" />
                    </div>
                    <p><strong className="text-primary">{t.mean} = 79.33</strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rata-rata nilai ulangan 8 siswa adalah 75. Jika ditambahkan satu siswa baru dengan nilai 83, berapakah rata-rata nilai seluruh siswa sekarang?"
                    : language === "en" ? "The mean score of 8 students is 75. If one new student with a score of 83 is added, what is the new mean of all students?"
                    : "8人の生徒の平均点は75です。点数83の新しい生徒が1人加わった場合、全生徒の新しい平均は何ですか？"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.step(1)}</strong>{" "}{language === "id" ? "Cari total nilai 8 siswa awal:" : language === "en" ? "Find the total score of the original 8 students:" : "最初の8人の生徒の合計点を求める："}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\sum x = \bar{x} \times n = 75 \times 8 = 600" />
                    </div>
                    <p><strong>{t.step(2)}</strong>{" "}{language === "id" ? "Tambahkan nilai siswa baru, hitung rata-rata baru:" : language === "en" ? "Add the new student's score, calculate the new mean:" : "新しい生徒の点数を加え、新しい平均を計算する："}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x}_{\text{new}} = \frac{600 + 83}{9} = \frac{683}{9} \approx 75{,}89" />
                    </div>
                    <p><strong className="text-primary">{language === "id" ? "Rata-rata baru = 75,89" : language === "en" ? "New mean = 75.89" : "新しい平均 = 75.89"}</strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rata-rata dari 5 bilangan adalah 48. Jika setiap bilangan dikalikan 3, kemudian dikurangi 4, tentukan rata-rata data yang baru!"
                    : language === "en" ? "The mean of 5 numbers is 48. If each number is multiplied by 3 and then reduced by 4, find the new mean!"
                    : "5つの数の平均は48です。各数を3倍してから4を引いた場合、新しい平均を求めなさい！"}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>{language === "id" ? "Misalkan data baru = " : language === "en" ? "Let the new data = " : "新しいデータを "}<InlineMath math="y_i = 3x_i - 4" />{language === "id" ? ", maka:" : language === "en" ? ", then:" : " とすると："}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <BlockMath math="\bar{y} = \frac{\sum y_i}{n} = \frac{\sum (3x_i - 4)}{n}" />
                      <BlockMath math="= \frac{3\sum x_i - 4n}{n} = 3 \cdot \frac{\sum x_i}{n} - 4" />
                      <BlockMath math="= 3\bar{x} - 4 = 3(48) - 4 = 144 - 4 = 140" />
                    </div>
                    <p><strong className="text-primary">{language === "id" ? "Rata-rata data baru = 140" : language === "en" ? "New mean = 140" : "新しい平均 = 140"}</strong></p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SUB-BAB 2: TABEL DISTRIBUSI FREKUENSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400"
              title={language === "id" ? "📘 Sub-Bab 2: Rata-Rata pada Tabel Distribusi Frekuensi" : language === "en" ? "📘 Chapter 2: Mean from a Frequency Distribution Table" : "📘 第2節：度数分布表からの平均"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-blue-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? <>Ketika data disajikan dalam <strong className="text-blue-300">tabel distribusi frekuensi data tunggal</strong>, setiap baris menunjukkan satu nilai data (<InlineMath math="x_i" />) beserta berapa kali nilai itu muncul (frekuensinya). Untuk menghitung rata-rata, kalikan setiap nilai dengan frekuensinya, jumlahkan semuanya, lalu bagi dengan total frekuensi.</>
                  : language === "en" ? <>When data is presented in a <strong className="text-blue-300">frequency distribution table</strong>, each row shows one data value (<InlineMath math="x_i" />) along with how many times it appears (its frequency). To calculate the mean, multiply each value by its frequency, sum everything up, then divide by the total frequency.</>
                  : <>データが<strong className="text-blue-300">度数分布表</strong>で提示されている場合、各行は1つのデータ値（<InlineMath math="x_i" />）とその出現回数（度数）を示します。平均を計算するには、各値にその度数を掛け、すべてを合計してから総度数で割ります。</>}
                </p>
                <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                  <p className="font-body text-xs text-white/50 mb-1">
                    {language === "id" ? "Rumus Rata-rata dari Tabel Distribusi Frekuensi" : language === "en" ? "Mean Formula from Frequency Distribution Table" : "度数分布表からの平均公式"}
                  </p>
                  <BlockMath math="\bar{x} = \frac{\sum f_i \cdot x_i}{\sum f_i}" />
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-2">
                    {[
                      { sym: "f_i", label: language === "id" ? "frekuensi nilai ke-i" : language === "en" ? "frequency of value i" : "i番目の値の度数" },
                      { sym: "x_i", label: language === "id" ? "nilai data ke-i" : language === "en" ? "value at index i" : "i番目のデータ値" },
                      { sym: "\\sum f_i", label: language === "id" ? "total frekuensi (n)" : language === "en" ? "total frequency (n)" : "総度数 (n)" },
                    ].map(({ sym, label }) => (
                      <div key={sym} className="bg-blue-900/30 rounded p-2 text-center">
                        <p className="text-blue-300 font-bold"><InlineMath math={sym} /></p>
                        <p className="text-white/50">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Example table */}
              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                <div className="bg-blue-800/30 px-4 py-2">
                  <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">
                    📋 {language === "id" ? "Contoh Tabel Distribusi Frekuensi Nilai Ulangan 40 Siswa" : language === "en" ? "Example: Frequency Distribution Table — Scores of 40 Students" : "例：40人の生徒の点数の度数分布表"}
                  </p>
                </div>
                <div className="p-3 overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-700/40">
                        <th className="px-2 py-2 text-left text-blue-300 font-bold">
                          {language === "id" ? "Nilai (xᵢ)" : language === "en" ? "Score (xᵢ)" : "点数 (xᵢ)"}
                        </th>
                        <th className="px-2 py-2 text-center text-white/70">
                          {language === "id" ? "Frekuensi (fᵢ)" : language === "en" ? "Frequency (fᵢ)" : "度数 (fᵢ)"}
                        </th>
                        <th className="px-2 py-2 text-center text-white/70">fᵢ · xᵢ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {[["60","4","240"],["70","8","560"],["75","12","900"],["80","10","800"],["90","6","540"]].map(([x,f,fx]) => (
                        <tr key={x} className="hover:bg-slate-700/20">
                          <td className="px-2 py-2 text-white font-semibold">{x}</td>
                          <td className="px-2 py-2 text-center text-green-300">{f}</td>
                          <td className="px-2 py-2 text-center text-cyan-300">{fx}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-700/30 border-t border-slate-500/50">
                        <td className="px-2 py-2 text-white font-bold">{t.total}</td>
                        <td className="px-2 py-2 text-center text-green-400 font-bold">40</td>
                        <td className="px-2 py-2 text-center text-cyan-400 font-bold">3.040</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-4 pb-3">
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="\bar{x} = \frac{3040}{40} = 76" />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? <><strong>Tips:</strong> Tabel distribusi frekuensi data tunggal cocok digunakan saat banyak nilai yang <em>sama</em> muncul berulang kali — lebih ringkas daripada menulis satu per satu!</>
                  : language === "en" ? <><strong>Tip:</strong> A frequency distribution table is best used when many <em>identical</em> values appear repeatedly — more concise than listing them one by one!</>
                  : <><strong>ヒント：</strong>度数分布表は、同じ値が繰り返し現れる場合に最も適しています — 1つ1つ列挙するよりも簡潔です！</>}
                </p>
              </div>
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={language === "id" ? "📝 Contoh Soal — Rata-Rata Tabel Distribusi Frekuensi" : language === "en" ? "📝 Practice Problems — Mean from Frequency Distribution Table" : "📝 練習問題 — 度数分布表からの平均"} />
            <div className="px-5 pb-5 space-y-6">

              {/* CONTOH 1 */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Tabel distribusi frekuensi nilai ulangan IPA 25 siswa disajikan seperti berikut. Hitunglah rata-ratanya!"
                    : language === "en" ? "The frequency distribution table of science quiz scores for 25 students is shown below. Calculate the mean!"
                    : "25人の生徒の理科の小テストの点数の度数分布表が以下の通りです。平均を計算しなさい！"}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-3 py-1.5 text-left text-white/70">{language === "id" ? "Nilai (xᵢ)" : language === "en" ? "Score (xᵢ)" : "点数 (xᵢ)"}</th>
                        <th className="px-3 py-1.5 text-center text-white/70">{language === "id" ? "Frekuensi (fᵢ)" : language === "en" ? "Frequency (fᵢ)" : "度数 (fᵢ)"}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["70","3"],["75","6"],["80","8"],["85","5"],["90","3"]].map(([x,f]) => (
                          <tr key={x}><td className="px-3 py-1.5 text-white font-semibold">{x}</td><td className="px-3 py-1.5 text-center text-green-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Bar chart */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs text-white/50 text-center mb-2">
                      📊 {language === "id" ? "Diagram Batang Nilai Ulangan IPA" : language === "en" ? "Bar Chart — Science Quiz Scores" : "棒グラフ — 理科の小テスト点数"}
                    </p>
                    <svg viewBox="0 0 260 130" className="w-full max-h-36">
                      {[0,2,4,6,8].map(v => (
                        <g key={v}>
                          <line x1="35" y1={105 - v*12} x2="250" y2={105 - v*12} stroke="#334155" strokeWidth="0.5"/>
                          <text x="30" y={105 - v*12 + 3} textAnchor="end" fontSize="7" fill="#64748b">{v}</text>
                        </g>
                      ))}
                      {[{x:"70",f:3,cx:60,color:"#ef4444"},{x:"75",f:6,cx:100,color:"#f59e0b"},{x:"80",f:8,cx:140,color:"#22c55e"},{x:"85",f:5,cx:180,color:"#3b82f6"},{x:"90",f:3,cx:220,color:"#a855f7"}].map(({x,f,cx,color}) => (
                        <g key={x}>
                          <rect x={cx-14} y={105-f*12} width="28" height={f*12} fill={color} fillOpacity="0.8" rx="2"/>
                          <text x={cx} y={100-f*12} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{f}</text>
                          <text x={cx} y="118" textAnchor="middle" fontSize="8" fill="#94a3b8">{x}</text>
                        </g>
                      ))}
                      <line x1="35" y1="15" x2="35" y2="105" stroke="#475569" strokeWidth="1"/>
                      <line x1="35" y1="105" x2="250" y2="105" stroke="#475569" strokeWidth="1"/>
                      <text x="143" y="128" textAnchor="middle" fontSize="7" fill="#64748b">{t.score}</text>
                      <text x="12" y="65" textAnchor="middle" fontSize="7" fill="#64748b" transform="rotate(-90,12,65)">{t.freq}</text>
                    </svg>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/30">
                          <th className="px-2 py-1 text-left text-white/50">{t.score}</th>
                          <th className="px-2 py-1 text-center text-white/50">fᵢ</th>
                          <th className="px-2 py-1 text-center text-white/50">fᵢ · xᵢ</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-700/20">
                          {[["70","3","210"],["75","6","450"],["80","8","640"],["85","5","425"],["90","3","270"]].map(([x,f,fx]) => (
                            <tr key={x}><td className="px-2 py-1 text-white/70">{x}</td><td className="px-2 py-1 text-center text-green-300">{f}</td><td className="px-2 py-1 text-center text-cyan-300">{fx}</td></tr>
                          ))}
                          <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">{t.total}</td><td className="px-2 py-1 text-center text-green-400">25</td><td className="px-2 py-1 text-center text-cyan-400">1.995</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x} = \frac{1995}{25} = 79{,}8" />
                    </div>
                    <p><strong className="text-primary">{t.mean} = 79.8</strong></p>
                  </div>
                </div>
              </div>

              {/* CONTOH 2 */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Data nilai ulangan Matematika 25 siswa disajikan dalam tabel berikut. Tentukan rata-rata nilai ulangan tersebut!"
                    : language === "en" ? "The math quiz scores for 25 students are shown in the table below. Find the mean score!"
                    : "25人の生徒の数学の小テストの点数が以下の表に示されています。平均点を求めなさい！"}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-3 py-1.5 text-left text-white/70">{t.score}</th>
                        <th className="px-3 py-1.5 text-center text-white/70">{t.freq}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["65","3"],["70","5"],["75","8"],["80","6"],["85","3"]].map(([x,f]) => (
                          <tr key={x}><td className="px-3 py-1.5 text-white font-semibold">{x}</td><td className="px-3 py-1.5 text-center text-yellow-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Line chart */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs text-white/50 text-center mb-2">
                      📈 {language === "id" ? "Diagram Garis Nilai Ulangan Matematika" : language === "en" ? "Line Chart — Math Quiz Scores" : "折れ線グラフ — 数学の小テスト点数"}
                    </p>
                    <svg viewBox="0 0 260 130" className="w-full max-h-36">
                      {[0,2,4,6,8].map(v => (
                        <g key={v}>
                          <line x1="35" y1={105 - v*12} x2="250" y2={105 - v*12} stroke="#334155" strokeWidth="0.5"/>
                          <text x="30" y={105 - v*12 + 3} textAnchor="end" fontSize="7" fill="#64748b">{v}</text>
                        </g>
                      ))}
                      {(() => {
                        const pts: {f:number;cx:number}[] = [{f:3,cx:60},{f:5,cx:100},{f:8,cx:140},{f:6,cx:180},{f:3,cx:220}];
                        const points = pts.map(p => `${p.cx},${105-p.f*12}`).join(" ");
                        return (
                          <g>
                            <polyline points={points} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>
                            {pts.map(({f,cx}) => (
                              <g key={cx}>
                                <circle cx={cx} cy={105-f*12} r="4" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5"/>
                                <text x={cx} y={105-f*12-7} textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">{f}</text>
                              </g>
                            ))}
                          </g>
                        );
                      })()}
                      {[{x:"65",cx:60},{x:"70",cx:100},{x:"75",cx:140},{x:"80",cx:180},{x:"85",cx:220}].map(({x,cx}) => (
                        <text key={x} x={cx} y="118" textAnchor="middle" fontSize="8" fill="#94a3b8">{x}</text>
                      ))}
                      <line x1="35" y1="15" x2="35" y2="105" stroke="#475569" strokeWidth="1"/>
                      <line x1="35" y1="105" x2="250" y2="105" stroke="#475569" strokeWidth="1"/>
                      <text x="143" y="128" textAnchor="middle" fontSize="7" fill="#64748b">{t.score}</text>
                      <text x="12" y="65" textAnchor="middle" fontSize="7" fill="#64748b" transform="rotate(-90,12,65)">{t.freq}</text>
                    </svg>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/30">
                          <th className="px-2 py-1 text-left text-white/50">{t.score}</th>
                          <th className="px-2 py-1 text-center text-white/50">fᵢ</th>
                          <th className="px-2 py-1 text-center text-white/50">fᵢ · xᵢ</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-700/20">
                          {[["65","3","195"],["70","5","350"],["75","8","600"],["80","6","480"],["85","3","255"]].map(([x,f,fx]) => (
                            <tr key={x}><td className="px-2 py-1 text-white/70">{x}</td><td className="px-2 py-1 text-center text-yellow-300">{f}</td><td className="px-2 py-1 text-center text-cyan-300">{fx}</td></tr>
                          ))}
                          <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">{t.total}</td><td className="px-2 py-1 text-center text-yellow-400">25</td><td className="px-2 py-1 text-center text-cyan-400">1.880</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x} = \frac{1880}{25} = 75{,}2" />
                    </div>
                    <p><strong className="text-primary">{t.mean} = 75.2</strong></p>
                  </div>
                </div>
              </div>

              {/* CONTOH 3 */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? <>Tabel distribusi frekuensi nilai ujian IPS siswa disajikan berikut. Jika rata-rata nilai ujian adalah 79, tentukan nilai <InlineMath math="k" />!</>
                    : language === "en" ? <>The frequency distribution table of social studies exam scores is shown below. If the mean score is 79, find the value of <InlineMath math="k" />!</>
                    : <>以下に社会の試験点数の度数分布表が示されています。平均点が79の場合、<InlineMath math="k" />の値を求めなさい！</>}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-3 py-1.5 text-left text-white/70">{t.score}</th>
                        <th className="px-3 py-1.5 text-center text-white/70">{t.freq}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["70","4"],["75","8"],["80","k"],["85","6"],["90","2"]].map(([x,f]) => (
                          <tr key={x}><td className="px-3 py-1.5 text-white font-semibold">{x}</td><td className="px-3 py-1.5 text-center text-red-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.step(1)}</strong>{" "}{language === "id" ? "Susun persamaan rata-rata:" : language === "en" ? "Set up the mean equation:" : "平均の方程式を立てる："}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <BlockMath math="\frac{(70 \times 4)+(75 \times 8)+(80 \times k)+(85 \times 6)+(90 \times 2)}{4+8+k+6+2} = 79" />
                      <BlockMath math="\frac{280+600+80k+510+180}{20+k} = 79" />
                      <BlockMath math="\frac{1570+80k}{20+k} = 79" />
                    </div>
                    <p><strong>{t.step(2)}</strong>{" "}{language === "id" ? "Selesaikan persamaan:" : language === "en" ? "Solve the equation:" : "方程式を解く："}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="1570 + 80k = 79(20+k) = 1580 + 79k" />
                      <BlockMath math="80k - 79k = 1580 - 1570 \implies k = 10" />
                    </div>
                    <p><strong className="text-primary">k = 10{" "}{language === "id" ? "siswa" : language === "en" ? "students" : "人"} &nbsp;|&nbsp; Total = 30{" "}{language === "id" ? "siswa" : language === "en" ? "students" : "人"}</strong></p>
                    {/* Pie chart illustration */}
                    <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                      <p className="font-body text-xs text-white/50 text-center mb-2">
                        🥧 {language === "id" ? "Diagram Lingkaran Distribusi Nilai (setelah k = 10)" : language === "en" ? "Pie Chart — Score Distribution (with k = 10)" : "円グラフ — 点数分布（k = 10 の場合）"}
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <svg viewBox="0 0 200 200" className="w-36 h-36 flex-shrink-0">
                          <path d="M 100 100 L 100 15 A 85 85 0 0 1 163.2 43.1 Z" fill="#ef4444" fillOpacity="0.85"/>
                          <path d="M 100 100 L 163.2 43.1 A 85 85 0 0 1 150.0 168.8 Z" fill="#f59e0b" fillOpacity="0.85"/>
                          <path d="M 100 100 L 150.0 168.8 A 85 85 0 0 1 15.5 108.9 Z" fill="#22c55e" fillOpacity="0.85"/>
                          <path d="M 100 100 L 15.5 108.9 A 85 85 0 0 1 65.4 22.4 Z" fill="#3b82f6" fillOpacity="0.85"/>
                          <path d="M 100 100 L 65.4 22.4 A 85 85 0 0 1 100 15 Z" fill="#a855f7" fillOpacity="0.85"/>
                          <circle cx="100" cy="100" r="30" fill="#0f172a"/>
                          <text x="100" y="97" textAnchor="middle" fontSize="8" fill="#94a3b8">n=30</text>
                          <text x="100" y="107" textAnchor="middle" fontSize="7" fill="#64748b">
                            {language === "id" ? "siswa" : language === "en" ? "students" : "人"}
                          </text>
                        </svg>
                        <div className="grid grid-cols-1 gap-1.5 text-xs font-body">
                          {[{val:"70",f:4,pct:"13,3%",color:"bg-red-500"},{val:"75",f:8,pct:"26,7%",color:"bg-amber-500"},{val:"80",f:10,pct:"33,3%",color:"bg-green-500"},{val:"85",f:6,pct:"20,0%",color:"bg-blue-500"},{val:"90",f:2,pct:"6,7%",color:"bg-purple-500"}].map(({val,f,pct,color}) => (
                            <div key={val} className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${color}`}/>
                              <span className="text-white/70">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"} <strong className="text-white">{val}</strong> — {f}{" "}{language === "id" ? "siswa" : language === "en" ? "students" : "人"} ({pct})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-BAB 3: RATA-RATA DARI DIAGRAM BATANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400"
              title={language === "id" ? "📘 Sub-Bab 3: Rata-Rata pada Diagram Batang" : language === "en" ? "📘 Chapter 3: Mean from a Bar Chart" : "📘 第3節：棒グラフからの平均"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-purple-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? <>Kadang data disajikan dalam <strong className="text-purple-300">diagram batang</strong>, bukan tabel. Untuk menghitung rata-rata, kamu perlu terlebih dahulu <em>membaca nilai dan frekuensi</em> dari tiap batang, lalu menerapkan rumus rata-rata seperti biasa.</>
                  : language === "en" ? <>Sometimes data is presented in a <strong className="text-purple-300">bar chart</strong> rather than a table. To calculate the mean, you first need to <em>read the value and frequency</em> from each bar, then apply the mean formula as usual.</>
                  : <>データが表ではなく<strong className="text-purple-300">棒グラフ</strong>で提示されることもあります。平均を計算するには、まず各棒から<em>値と度数を読み取り</em>、通常通り平均公式を適用します。</>}
                </p>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                  <p className="font-body text-xs text-purple-200 space-y-1">
                    <strong>{language === "id" ? "Langkah-langkah:" : language === "en" ? "Steps:" : "手順："}</strong><br />
                    {language === "id" ? <>1. Baca setiap nilai kategori pada sumbu X<br />2. Baca tinggi batang (frekuensi) pada sumbu Y<br />3. Kalikan nilai × frekuensi untuk setiap batang<br />4. Jumlahkan semua hasil perkalian dan bagi dengan total frekuensi</>
                    : language === "en" ? <>1. Read each category value on the X-axis<br />2. Read the bar height (frequency) on the Y-axis<br />3. Multiply value × frequency for each bar<br />4. Sum all products and divide by total frequency</>
                    : <>1. X軸の各カテゴリー値を読む<br />2. Y軸の棒の高さ（度数）を読む<br />3. 各棒の値 × 度数を計算する<br />4. すべての積を合計して総度数で割る</>}
                  </p>
                </div>
              </div>

              {/* Bar chart example */}
              <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl overflow-hidden">
                <div className="bg-purple-800/30 px-4 py-2">
                  <p className="font-body text-xs font-bold text-purple-200 uppercase tracking-wide">
                    📊 {language === "id" ? "Contoh Diagram Batang: Nilai Ujian Siswa" : language === "en" ? "Example Bar Chart: Student Exam Scores" : "例：棒グラフ — 生徒の試験点数"}
                  </p>
                </div>
                <div className="p-4">
                  <div className="relative h-40 flex items-end gap-4 px-8 pb-7">
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between pb-7 pt-2">
                      {[20,15,10,5,0].map(v => <span key={v} className="text-white/30 text-xs font-body">{v}</span>)}
                    </div>
                    <div className="absolute left-7 right-2 top-2 bottom-7">
                      {[0,1,2,3,4].map(i => <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i/4)*100}%` }} />)}
                    </div>
                    {[{val:"60",f:5,color:"bg-red-500"},{val:"70",f:12,color:"bg-yellow-500"},{val:"80",f:18,color:"bg-green-500"},{val:"90",f:10,color:"bg-blue-500"},{val:"100",f:5,color:"bg-purple-500"}].map(({ val, f, color }) => (
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
                  {language === "id" ? <><strong>Tips:</strong> Saat membaca diagram batang, pastikan kamu membaca tinggi batang dengan teliti. Kalau tingginya di antara dua angka skala, perkirakan nilainya secara proporsional.</>
                  : language === "en" ? <><strong>Tip:</strong> When reading a bar chart, make sure you read the bar height carefully. If the height falls between two scale numbers, estimate the value proportionally.</>
                  : <><strong>ヒント：</strong>棒グラフを読む際は、棒の高さを注意深く読んでください。高さが2つの目盛りの間にある場合は、比例的に値を推定しましょう。</>}
                </p>
              </div>
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400"
              title={language === "id" ? "📝 Contoh Soal — Rata-Rata dari Diagram Batang" : language === "en" ? "📝 Practice Problems — Mean from a Bar Chart" : "📝 練習問題 — 棒グラフからの平均"} />
            <div className="px-5 pb-5 space-y-6">

              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white mb-2">
                    {language === "id" ? "Dari diagram batang nilai ulangan IPA berikut, hitunglah rata-ratanya!"
                    : language === "en" ? "From the following bar chart of science quiz scores, calculate the mean!"
                    : "以下の理科の小テスト点数の棒グラフから、平均を計算しなさい！"}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="border-b border-slate-600/50">
                        <th className="px-3 py-1 text-left text-white/50">{t.score}</th>
                        <th className="px-3 py-1 text-center text-white/50">{language === "id" ? "Tinggi Batang (Frekuensi)" : language === "en" ? "Bar Height (Frequency)" : "棒の高さ（度数）"}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["70","4"],["75","6"],["80","8"],["85","5"],["90","2"]].map(([v,f]) => (
                          <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-green-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <p className="text-xs text-white/50 mb-1">{language === "id" ? "Hitung nilai × frekuensi:" : language === "en" ? "Calculate value × frequency:" : "値 × 度数を計算："}</p>
                      <p>70 × 4 = 280 &nbsp; 75 × 6 = 450 &nbsp; 80 × 8 = 640</p>
                      <p>85 × 5 = 425 &nbsp; 90 × 2 = 180</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x} = \frac{280+450+640+425+180}{4+6+8+5+2} = \frac{1975}{25} = 79" />
                    </div>
                    <p><strong className="text-primary">{t.mean} = 79</strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? <>Dari diagram batang, diketahui banyak siswa per nilai: Nilai 6 ada 3 siswa, Nilai 7 ada 10 siswa, Nilai 8 ada 12 siswa, Nilai 9 ada <InlineMath math="k" /> siswa. Jika rata-rata nilainya adalah 7,8, tentukan nilai <InlineMath math="k" />!</>
                    : language === "en" ? <>From a bar chart, the number of students per score: Score 6 has 3 students, Score 7 has 10, Score 8 has 12, Score 9 has <InlineMath math="k" /> students. If the mean is 7.8, find <InlineMath math="k" />!</>
                    : <>棒グラフから、点数別の生徒数：点数6が3人、点数7が10人、点数8が12人、点数9が<InlineMath math="k" />人。平均が7.8の場合、<InlineMath math="k" />を求めなさい！</>}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <BlockMath math="\frac{(6\times3)+(7\times10)+(8\times12)+(9\times k)}{3+10+12+k} = 7{,}8" />
                      <BlockMath math="\frac{18+70+96+9k}{25+k} = 7{,}8" />
                      <BlockMath math="184 + 9k = 7{,}8(25+k) = 195 + 7{,}8k" />
                      <BlockMath math="9k - 7{,}8k = 195 - 184 \implies 1{,}2k = 11 \implies k \approx 9{,}17" />
                    </div>
                    <p>{language === "id" ? "Karena " : language === "en" ? "Since " : ""}<InlineMath math="k" />{language === "id" ? " harus bilangan bulat, dibulatkan:" : language === "en" ? " must be a whole number, round to:" : "は整数でなければならないため、四捨五入："}{" "}<strong className="text-primary">k = 9{" "}{language === "id" ? "siswa" : language === "en" ? "students" : "人"}</strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Diagram batang menunjukkan nilai ulangan dua kelas. Kelas A: (70→5 siswa), (80→8 siswa), (90→7 siswa). Kelas B: (70→4 siswa), (80→10 siswa), (90→6 siswa). Jika kedua kelas digabung, tentukan rata-rata nilai gabungan!"
                    : language === "en" ? "A bar chart shows quiz scores for two classes. Class A: (70→5 students), (80→8), (90→7). Class B: (70→4 students), (80→10), (90→6). If the classes are combined, find the combined mean!"
                    : "棒グラフが2つのクラスの小テストの点数を示しています。Aクラス：(70→5人)、(80→8人)、(90→7人)。Bクラス：(70→4人)、(80→10人)、(90→6人)。2つのクラスを合わせた場合の合成平均を求めなさい！"}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <p className="text-xs text-white/50">
                        {language === "id" ? "Kelas A: n=20, Kelas B: n=20" : language === "en" ? "Class A: n=20, Class B: n=20" : "Aクラス：n=20、Bクラス：n=20"}
                      </p>
                      <BlockMath math="\Sigma_A = 70(5)+80(8)+90(7) = 350+640+630 = 1620" />
                      <BlockMath math="\Sigma_B = 70(4)+80(10)+90(6) = 280+800+540 = 1620" />
                      <BlockMath math="\bar{x}_{\text{combined}} = \frac{1620+1620}{20+20} = \frac{3240}{40} = 81" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Rata-rata gabungan kedua kelas = 81" : language === "en" ? "Combined mean of both classes = 81" : "2クラスの合成平均 = 81"}
                    </strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-BAB 4: RATA-RATA GABUNGAN DATA BARU MASUK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={language === "id" ? "📘 Sub-Bab 4: Rata-Rata Gabungan — Data Baru Masuk" : language === "en" ? "📘 Chapter 4: Combined Mean — Adding New Data" : "📘 第4節：合成平均 — 新しいデータの追加"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? <>Dalam kehidupan nyata, data sering bertambah — misalnya ada siswa baru masuk kelas. Daripada menghitung ulang dari awal, kita gunakan <strong className="text-cyan-300">rumus rata-rata gabungan</strong> yang efisien.</>
                  : language === "en" ? <>In real life, data often grows — for example, new students join a class. Instead of recalculating from scratch, we use the efficient <strong className="text-cyan-300">combined mean formula</strong>.</>
                  : <>現実には、データが増えることがよくあります — 例えば、クラスに新しい生徒が加わる場合。最初から再計算する代わりに、効率的な<strong className="text-cyan-300">合成平均公式</strong>を使います。</>}
                </p>
                <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                  <p className="font-body text-xs text-white/50 text-center mb-1">
                    {language === "id" ? "Rumus Rata-rata Gabungan (Penggabungan Dua Kelompok)" : language === "en" ? "Combined Mean Formula (Two Groups)" : "合成平均公式（2グループ）"}
                  </p>
                  <BlockMath math="\bar{x}_{\text{combined}} = \frac{n_1 \cdot \bar{x}_1 + n_2 \cdot \bar{x}_2}{n_1 + n_2}" />
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-cyan-900/30 rounded p-2">
                      <p className="text-cyan-300 font-bold"><InlineMath math="n_1, \bar{x}_1" /></p>
                      <p className="text-white/50">
                        {language === "id" ? "banyak data & rata-rata kelompok lama" : language === "en" ? "count & mean of old group" : "既存グループのデータ数と平均"}
                      </p>
                    </div>
                    <div className="bg-cyan-900/30 rounded p-2">
                      <p className="text-cyan-300 font-bold"><InlineMath math="n_2, \bar{x}_2" /></p>
                      <p className="text-white/50">
                        {language === "id" ? "banyak data & rata-rata kelompok baru" : language === "en" ? "count & mean of new group" : "新グループのデータ数と平均"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual illustration */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">
                    🔗 {language === "id" ? "Ilustrasi Penggabungan Data" : language === "en" ? "Data Combination Illustration" : "データ結合のイラスト"}
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-cyan-300 font-bold">
                        {language === "id" ? "Kelompok Lama" : language === "en" ? "Old Group" : "既存グループ"}
                      </p>
                      <p className="text-white text-sm font-bold"><InlineMath math="n_1 = 30, \; \bar{x}_1 = 75" /></p>
                    </div>
                    <div className="text-primary text-2xl font-bold">+</div>
                    <div className="bg-green-900/40 border border-green-500/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-green-300 font-bold">
                        {language === "id" ? "Kelompok Baru" : language === "en" ? "New Group" : "新グループ"}
                      </p>
                      <p className="text-white text-sm font-bold"><InlineMath math="n_2 = 10, \; \bar{x}_2 = 85" /></p>
                    </div>
                    <div className="text-primary text-2xl font-bold">=</div>
                    <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-xl p-3 text-center">
                      <p className="text-xs text-yellow-300 font-bold">
                        {language === "id" ? "Gabungan" : language === "en" ? "Combined" : "合成"}
                      </p>
                      <p className="text-yellow-200 text-sm font-bold"><InlineMath math="\bar{x} = \frac{30(75)+10(85)}{40} = 77{,}5" /></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? <><strong>Perhatikan:</strong> Rata-rata gabungan <em>tidak sama dengan</em> rata-rata dari dua rata-rata (<InlineMath math="\frac{\bar{x}_1 + \bar{x}_2}{2}" />) kecuali <InlineMath math="n_1 = n_2" />. Selalu gunakan rumus dengan bobot <InlineMath math="n_1" /> dan <InlineMath math="n_2" />!</>
                  : language === "en" ? <><strong>Note:</strong> The combined mean is <em>not the same as</em> the average of two means (<InlineMath math="\frac{\bar{x}_1 + \bar{x}_2}{2}" />) unless <InlineMath math="n_1 = n_2" />. Always use the weighted formula with <InlineMath math="n_1" /> and <InlineMath math="n_2" />!</>
                  : <><strong>注意：</strong>合成平均は<InlineMath math="n_1 = n_2" />の場合を除き、2つの平均の平均（<InlineMath math="\frac{\bar{x}_1 + \bar{x}_2}{2}" />）とは<em>異なります</em>。常に<InlineMath math="n_1" />と<InlineMath math="n_2" />を使った加重公式を使いましょう！</>}
                </p>
              </div>
              <CombinedMeanCalculator />
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400"
              title={language === "id" ? "📝 Contoh Soal — Rata-Rata Gabungan Data Baru Masuk" : language === "en" ? "📝 Practice Problems — Combined Mean (Adding New Data)" : "📝 練習問題 — 合成平均（新しいデータの追加）"} />
            <div className="px-5 pb-5 space-y-6">

              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Kelas A memiliki 20 siswa dengan rata-rata nilai 78. Kelas B memiliki 10 siswa dengan rata-rata nilai 84. Jika kedua kelas digabung, berapa rata-rata nilainya?"
                    : language === "en" ? "Class A has 20 students with a mean score of 78. Class B has 10 students with a mean score of 84. If the classes are combined, what is the combined mean?"
                    : "Aクラスは平均点78の生徒20人。Bクラスは平均点84の生徒10人。2つのクラスを合わせた場合の平均点は何ですか？"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x}_{\text{combined}} = \frac{20 \times 78 + 10 \times 84}{20 + 10} = \frac{1560 + 840}{30} = \frac{2400}{30} = 80" />
                    </div>
                    <p><strong className="text-primary">{t.combinedMean} = 80</strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rata-rata berat 25 siswa kelas IX-A adalah 52 kg. Kemudian 5 siswa baru masuk dengan berat 48, 54, 56, 50, 52 kg. Tentukan rata-rata berat seluruh siswa sekarang!"
                    : language === "en" ? "The mean weight of 25 students in class IX-A is 52 kg. Then 5 new students join with weights 48, 54, 56, 50, 52 kg. Find the new mean weight of all students!"
                    : "IX-Aクラス25人の生徒の平均体重は52kgです。その後、体重48、54、56、50、52kgの5人の新しい生徒が加わりました。全生徒の新しい平均体重を求めなさい！"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.step(1)}</strong>{" "}{language === "id" ? "Cari rata-rata 5 siswa baru:" : language === "en" ? "Find the mean of the 5 new students:" : "5人の新しい生徒の平均を求める："}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x}_2 = \frac{48+54+56+50+52}{5} = \frac{260}{5} = 52 \,\mathrm{kg}" />
                    </div>
                    <p><strong>{t.step(2)}</strong>{" "}{language === "id" ? "Hitung rata-rata gabungan:" : language === "en" ? "Calculate the combined mean:" : "合成平均を計算する："}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x}_{\text{combined}} = \frac{25 \times 52 + 5 \times 52}{30} = \frac{1300+260}{30} = \frac{1560}{30} = 52 \,\mathrm{kg}" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Rata-rata berat tetap 52 kg" : language === "en" ? "Mean weight remains 52 kg" : "平均体重は52kgのまま"}
                    </strong>{" "}
                    ({language === "id" ? "karena rata-rata siswa baru sama dengan rata-rata awal" : language === "en" ? "because the new students' mean equals the original mean" : "新しい生徒の平均が元の平均と同じため"}).</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? <>Rata-rata nilai ujian <InlineMath math="n" /> siswa adalah 72. Setelah 8 siswa baru bergabung dengan rata-rata nilai 80, rata-rata keseluruhan menjadi 74. Tentukan nilai <InlineMath math="n" />!</>
                    : language === "en" ? <>The mean score of <InlineMath math="n" /> students is 72. After 8 new students join with a mean score of 80, the overall mean becomes 74. Find <InlineMath math="n" />!</>
                    : <><InlineMath math="n" />人の生徒の試験の平均点は72です。平均点80の8人の新しい生徒が加わった後、全体の平均が74になりました。<InlineMath math="n" />を求めなさい！</>}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>
                      {language === "id" ? <>Gunakan rumus rata-rata gabungan dan selesaikan untuk <InlineMath math="n" />:</>
                      : language === "en" ? <>Use the combined mean formula and solve for <InlineMath math="n" />:</>
                      : <>合成平均公式を使って<InlineMath math="n" />について解く：</>}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <BlockMath math="\frac{n \cdot 72 + 8 \cdot 80}{n + 8} = 74" />
                      <BlockMath math="72n + 640 = 74(n+8) = 74n + 592" />
                      <BlockMath math="640 - 592 = 74n - 72n" />
                      <BlockMath math="48 = 2n \implies n = 24" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Banyak siswa awal = 24 siswa" : language === "en" ? "Original number of students = 24" : "最初の生徒数 = 24人"}
                    </strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-BAB 5: DATA LAMA KELUAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title={language === "id" ? "📘 Sub-Bab 5: Rata-Rata Gabungan — Data Lama Keluar" : language === "en" ? "📘 Chapter 5: Mean After Data is Removed" : "📘 第5節：データが除外された後の平均"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-orange-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? "Sebaliknya, kadang ada data yang keluar/dihapus dari kumpulan data — misalnya ada siswa yang pindah sekolah. Untuk menghitung rata-rata setelah data dikeluarkan, gunakan pendekatan kebalikan dari penggabungan."
                  : language === "en" ? "Conversely, sometimes data is removed from a dataset — for example, a student transfers schools. To calculate the mean after data is removed, use the reverse approach of combination."
                  : "逆に、データセットからデータが除外されることがあります — 例えば、生徒が転校する場合。データが除外された後の平均を計算するには、結合の逆のアプローチを使います。"}
                </p>
                <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                  <p className="font-body text-xs text-white/50 text-center mb-1">
                    {language === "id" ? "Rumus Setelah Data Dikeluarkan" : language === "en" ? "Formula After Data is Removed" : "データ除外後の公式"}
                  </p>
                  <BlockMath math="\bar{x}_{\text{remaining}} = \frac{n_{\text{initial}} \cdot \bar{x}_{\text{initial}} - \sum x_{\text{removed}}}{n_{\text{initial}} - n_{\text{removed}}}" />
                  <p className="font-body text-xs text-white/50 text-center">
                    {language === "id" ? "atau jika yang keluar adalah satu kelompok dengan rata-rata tertentu:" : language === "en" ? "or if the removed data is a group with a known mean:" : "または、除外されたデータが既知の平均を持つグループの場合："}
                  </p>
                  <BlockMath math="\bar{x}_{\text{remaining}} = \frac{n_1 \bar{x}_1 - n_2 \bar{x}_2}{n_1 - n_2}" />
                </div>

                {/* Visual illustration */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">
                    🔀 {language === "id" ? "Ilustrasi Data Keluar" : language === "en" ? "Data Removal Illustration" : "データ除外のイラスト"}
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="bg-orange-900/40 border border-orange-500/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-orange-300 font-bold">
                        {language === "id" ? "Data Awal" : language === "en" ? "Initial Data" : "初期データ"}
                      </p>
                      <p className="text-white text-sm font-bold"><InlineMath math="n=40, \bar{x}=80" /></p>
                    </div>
                    <div className="text-red-400 text-2xl font-bold">−</div>
                    <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-red-300 font-bold">
                        {language === "id" ? "Data Keluar" : language === "en" ? "Removed Data" : "除外データ"}
                      </p>
                      <p className="text-white text-sm font-bold"><InlineMath math="n=5, \bar{x}=90" /></p>
                    </div>
                    <div className="text-primary text-2xl font-bold">=</div>
                    <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-xl p-3 text-center">
                      <p className="text-xs text-yellow-300 font-bold">
                        {language === "id" ? "Data Sisa" : language === "en" ? "Remaining Data" : "残りデータ"}
                      </p>
                      <p className="text-yellow-200 text-sm font-bold"><InlineMath math="\bar{x} = \frac{40(80)-5(90)}{35} \approx 78{,}6" /></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? <><strong>Logikanya:</strong> Total nilai semua data = rata-rata × banyak data. Kalau ada data yang keluar, kurangi total dengan nilai data yang keluar, lalu bagi dengan banyak data yang tersisa.</>
                  : language === "en" ? <><strong>The logic:</strong> Total of all data = mean × count. If some data is removed, subtract the removed total from the overall total, then divide by the remaining count.</>
                  : <><strong>論理：</strong>すべてのデータの合計 = 平均 × データ数。データが除外される場合、全体の合計から除外された合計を引き、残りのデータ数で割ります。</>}
                </p>
              </div>
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh5" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400"
              title={language === "id" ? "📝 Contoh Soal — Rata-Rata Gabungan Data Lama Keluar" : language === "en" ? "📝 Practice Problems — Mean After Data Removal" : "📝 練習問題 — データ除外後の平均"} />
            <div className="px-5 pb-5 space-y-6">

              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rata-rata tinggi badan 30 siswa adalah 162 cm. Jika 3 siswa dengan tinggi 170, 168, dan 165 cm pindah sekolah, tentukan rata-rata tinggi badan siswa yang tersisa!"
                    : language === "en" ? "The mean height of 30 students is 162 cm. If 3 students with heights 170, 168, and 165 cm transfer schools, find the mean height of the remaining students!"
                    : "30人の生徒の平均身長は162cmです。身長170、168、165cmの3人の生徒が転校した場合、残りの生徒の平均身長を求めなさい！"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <BlockMath math="\text{Total}_{\text{initial}} = 30 \times 162 = 4860" />
                      <BlockMath math="\text{Total}_{\text{removed}} = 170+168+165 = 503" />
                      <BlockMath math="\bar{x}_{\text{remaining}} = \frac{4860 - 503}{30 - 3} = \frac{4357}{27} \approx 161{,}4 \,\mathrm{cm}" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Rata-rata tinggi sisa ≈ 161,4 cm" : language === "en" ? "Mean height of remaining students ≈ 161.4 cm" : "残りの生徒の平均身長 ≈ 161.4 cm"}
                    </strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rata-rata nilai ujian 40 siswa adalah 76. Setelah 8 siswa dikeluarkan dari perhitungan (karena tidak hadir), rata-rata menjadi 75. Tentukan rata-rata nilai 8 siswa yang dikeluarkan!"
                    : language === "en" ? "The mean score of 40 students is 76. After 8 absent students are removed from the calculation, the mean becomes 75. Find the mean score of the 8 removed students!"
                    : "40人の生徒の試験の平均点は76です。8人の欠席した生徒が計算から除外された後、平均が75になりました。除外された8人の生徒の平均点を求めなさい！"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <BlockMath math="\text{Total}_{\text{initial}} = 40 \times 76 = 3040" />
                      <BlockMath math="\text{Total}_{\text{remaining}} = 32 \times 75 = 2400" />
                      <BlockMath math="\text{Total}_{\text{removed}} = 3040 - 2400 = 640" />
                      <BlockMath math="\bar{x}_{\text{removed}} = \frac{640}{8} = 80" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Rata-rata nilai 8 siswa yang dikeluarkan = 80" : language === "en" ? "Mean score of the 8 removed students = 80" : "除外された8人の生徒の平均点 = 80"}
                    </strong></p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rata-rata nilai 50 siswa adalah 74. Setelah 10 siswa pindah keluar, rata-rata menjadi 72. Kemudian 5 siswa baru masuk dengan rata-rata nilai 80. Tentukan rata-rata nilai seluruh siswa akhirnya!"
                    : language === "en" ? "The mean score of 50 students is 74. After 10 students leave, the mean becomes 72. Then 5 new students join with a mean score of 80. Find the final mean score of all students!"
                    : "50人の生徒の平均点は74です。10人の生徒が転校した後、平均が72になりました。その後、平均点80の5人の新しい生徒が加わりました。全生徒の最終的な平均点を求めなさい！"}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.step(1)}</strong>{" "}
                      {language === "id" ? "Setelah 10 siswa keluar (40 siswa sisa, rata-rata 72):" : language === "en" ? "After 10 students leave (40 remaining, mean 72):" : "10人の生徒が転校後（残り40人、平均72）："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-xs text-white/50 mb-1">
                        {language === "id" ? "Verifikasi:" : language === "en" ? "Verify:" : "確認："}
                      </p>
                      <BlockMath math="\text{Total}_{\text{remaining}} = 40 \times 72 = 2880 \checkmark" />
                    </div>
                    <p><strong>{t.step(2)}</strong>{" "}
                      {language === "id" ? "Masuk 5 siswa baru (total menjadi 45):" : language === "en" ? "5 new students join (total becomes 45):" : "5人の新しい生徒が加入（合計45人）："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x}_{\text{final}} = \frac{40 \times 72 + 5 \times 80}{45} = \frac{2880 + 400}{45} = \frac{3280}{45} \approx 72{,}89" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Rata-rata akhir ≈ 72,89" : language === "en" ? "Final mean ≈ 72.89" : "最終平均 ≈ 72.89"}
                    </strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-yellow-400"
              title={language === "id" ? "🏁 Rangkuman Rata-Rata" : language === "en" ? "🏁 Mean Summary" : "🏁 平均のまとめ"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-bold text-cyan-300 text-center mb-3">
                  ⭐ {language === "id" ? "Rumus-Rumus Kunci" : language === "en" ? "Key Formulas" : "主要公式"}
                </p>
                <div className="space-y-3">
                  {[
                    { label: language === "id" ? "Rata-rata data tunggal" : language === "en" ? "Mean of individual data" : "個別データの平均", formula: "\\bar{x} = \\dfrac{\\sum x_i}{n}", color: "border-green-500/40 bg-green-900/20" },
                    { label: language === "id" ? "Rata-rata data berkelompok" : language === "en" ? "Mean from frequency table" : "度数分布表からの平均", formula: "\\bar{x} = \\dfrac{\\sum f_i \\cdot x_i}{\\sum f_i}", color: "border-blue-500/40 bg-blue-900/20" },
                    { label: language === "id" ? "Rata-rata gabungan" : language === "en" ? "Combined mean" : "合成平均", formula: "\\bar{x}_{\\text{combined}} = \\dfrac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2}", color: "border-cyan-500/40 bg-cyan-900/20" },
                    { label: language === "id" ? "Rata-rata setelah data keluar" : language === "en" ? "Mean after data removed" : "データ除外後の平均", formula: "\\bar{x}_{\\text{remaining}} = \\dfrac{n_1 \\bar{x}_1 - n_2 \\bar{x}_2}{n_1 - n_2}", color: "border-orange-500/40 bg-orange-900/20" },
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
                  {language === "id" ? <><strong>Siap lanjut? 🎉</strong> Kamu sudah menguasai seluruh konsep Rata-rata! Lanjutkan ke materi berikutnya: Median dan Modus — dua ukuran pemusatan data lainnya yang sama pentingnya! 🚀</>
                  : language === "en" ? <><strong>Ready to continue? 🎉</strong> You've mastered all the Mean concepts! Move on to the next topic: Median and Mode — two equally important measures of central tendency! 🚀</>
                  : <><strong>続ける準備はできていますか？🎉</strong>平均のすべての概念をマスターしました！次の単元に進みましょう：中央値と最頻値 — 同様に重要な2つの中心傾向の指標！🚀</>}
                </p>
              </div>
            </div>
          </div>

        </div>

        <RangkumanSection
          gradientFrom="from-green-900"
          gradientVia="via-emerald-900"
          gradientTo="to-teal-900"
          borderColor="border-green-500/40"
          accentColor="text-green-300"
          headerIcon="📐"
          judul={rst.judul}
          subjudul={rst.subjudul}
          ringkasan={rst.ringkasan}
          rumus={rst.rumus}
          tips={rst.tips}
          kesimpulan={rst.kesimpulan}
          kesimpulanBg="bg-gradient-to-r from-green-900/80 to-emerald-900/80"
          kesimpulanBorder="border-green-400/50"
          kesimpulanTextColor="text-green-100"
        />

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RataRataPage;
