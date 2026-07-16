import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

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

const levelLabels = {
  id: { MUDAH: "MUDAH", SEDANG: "SEDANG", SULIT: "SULIT" },
  en: { MUDAH: "EASY",  SEDANG: "MEDIUM", SULIT: "HARD"  },
  ja: { MUDAH: "基本",  SEDANG: "標準",   SULIT: "発展"  },
} as const;

const pageTrans = {
  id: {
    h1: "PENYAJIAN DATA",
    context: "Kelas 9 · Statistika · Materi Matematika",
    back: "← Kembali ke Statistika",
  },
  en: {
    h1: "DATA PRESENTATION",
    context: "Grade 9 · Statistics · Math Material",
    back: "← Back to Statistics",
  },
  ja: {
    h1: "データの表現",
    context: "中学3年・統計・数学教材",
    back: "← 統計に戻る",
  },
} as const;

const sectionTitles = {
  id: {
    intro:    "🌟 Mengapa Penyajian Data Penting?",
    konsep1:  "📘 Sub-Bab 1: Tabel Distribusi Frekuensi",
    contoh1:  "📝 Contoh Soal — Tabel Distribusi Frekuensi",
    konsep2:  "📘 Sub-Bab 2: Diagram Batang",
    contoh2:  "📝 Contoh Soal — Diagram Batang",
    konsep3:  "📘 Sub-Bab 3: Diagram Garis",
    contoh3:  "📝 Contoh Soal — Diagram Garis",
    konsep4:  "📘 Sub-Bab 4: Diagram Lingkaran (Pie Chart)",
    contoh4:  "📝 Contoh Soal — Diagram Lingkaran",
    konsep5:  "📘 Sub-Bab 5: Diagram Batang Daun (Stem-and-Leaf)",
    contoh5:  "📝 Contoh Soal — Diagram Batang Daun",
    rangkuman:"🏁 Rangkuman Penyajian Data",
  },
  en: {
    intro:    "🌟 Why Does Data Presentation Matter?",
    konsep1:  "📘 Sub-Topic 1: Frequency Distribution Table",
    contoh1:  "📝 Example Problems — Frequency Distribution Table",
    konsep2:  "📘 Sub-Topic 2: Bar Chart",
    contoh2:  "📝 Example Problems — Bar Chart",
    konsep3:  "📘 Sub-Topic 3: Line Chart",
    contoh3:  "📝 Example Problems — Line Chart",
    konsep4:  "📘 Sub-Topic 4: Pie Chart",
    contoh4:  "📝 Example Problems — Pie Chart",
    konsep5:  "📘 Sub-Topic 5: Stem-and-Leaf Plot",
    contoh5:  "📝 Example Problems — Stem-and-Leaf Plot",
    rangkuman:"🏁 Summary — Data Presentation",
  },
  ja: {
    intro:    "🌟 データの表現はなぜ重要か？",
    konsep1:  "📘 サブトピック1：度数分布表",
    contoh1:  "📝 例題 — 度数分布表",
    konsep2:  "📘 サブトピック2：棒グラフ",
    contoh2:  "📝 例題 — 棒グラフ",
    konsep3:  "📘 サブトピック3：折れ線グラフ",
    contoh3:  "📝 例題 — 折れ線グラフ",
    konsep4:  "📘 サブトピック4：円グラフ",
    contoh4:  "📝 例題 — 円グラフ",
    konsep5:  "📘 サブトピック5：幹葉図",
    contoh5:  "📝 例題 — 幹葉図",
    rangkuman:"🏁 まとめ — データの表現",
  },
} as const;

// ── UI string dictionaries ─────────────────────────────────────────────────
function getTrans(language: Language) {
  const id = {
    // freq table interactive
    freqTitle:      "🛠️ Coba Sendiri — Buat Tabel Distribusi Frekuensi",
    freqDesc:       (n: number) => `Ketikkan data angka (bilangan bulat 0–999) dipisahkan koma — maks ${n} angka. Klik Buat Tabel dan lihat tabel serta diagram frekuensi muncul dengan animasi!`,
    freqLabel:      "Data mentah (dipisah koma, maks 40):",
    freqSwap:       "Ganti contoh ↗",
    freqPlaceholder:"Contoh: 70, 75, 80, 70, 85, 80, 75...",
    freqBuildBtn:   "Buat Tabel & Diagram",
    freqReset:      "↺ Reset",
    freqResultTitle:"📊 Hasil Tabel Distribusi Frekuensi",
    freqDataCount:  (total: number, unique: number) => `${total} data · ${unique} nilai unik`,
    freqValHeader:  "Nilai",
    freqFrekHeader: "Frekuensi (f)",
    freqTotal:      "TOTAL",
    freqNLabel:     "BANYAK DATA (n)",
    freqUniqueLabel:"NILAI UNIK",
    freqSumNote:    (n: number) => `Jumlah seluruh frekuensi = banyaknya data = ${n}.`,
    freqErrMin:     "Masukkan minimal 2 angka.",
    freqErrMax:     "Maksimal 40 angka.",
    freqErrInvalid: "Semua data harus bilangan bulat antara 0–999.",
    // bar chart interactive
    barTitle:       "🛠️ Coba Sendiri — Buat Diagram Batang",
    barDesc:        "Isi tabel dengan data kamu, tambah atau hapus baris sesuai kebutuhan, lalu klik Konversi ke Diagram Batang untuk melihat hasilnya secara animasi!",
    barCatHeader:   "Kategori / Label",
    barValHeader:   "Nilai",
    barPlaceholder: "Contoh: Pramuka",
    barAddRow:      "＋ Tambah Baris",
    barMaxNote:     "(maks 10)",
    barBuildBtn:    "Konversi ke Diagram Batang",
    barReset:       "↺ Reset",
    barResultTitle: "📊 Hasil Diagram Batang",
    barBiggest:     "TERBESAR",
    barTotal:       "TOTAL",
    barSmallest:    "TERKECIL",
    barDataCount:   (n: number) => `${n} data`,
    // line chart interactive
    lineTitle:      "🛠️ Coba Sendiri — Buat Diagram Garis",
    lineDesc:       "Isi tabel dengan data kamu — tambah atau hapus baris sesuai kebutuhan (minimal 2 baris), lalu klik Buat Diagram Garis untuk melihat hasilnya secara animasi!",
    lineLabelHeader:"Label (waktu/kategori)",
    lineValHeader:  "Nilai",
    linePlaceholder:"Contoh: Jan",
    lineAddRow:     "＋ Tambah Baris",
    lineMaxNote:    "(maks 12)",
    lineBuildBtn:   "Buat Diagram Garis",
    lineReset:      "↺ Reset",
    lineResultTitle:"📈 Hasil Diagram Garis",
    lineTrend:      "TREN",
    lineHighest:    "TERTINGGI",
    lineAvg:        "RATA-RATA",
    lineLowest:     "TERENDAH",
    lineTrendUp:    (d: number) => `📈 Naik +${d}`,
    lineTrendDown:  (d: number) => `📉 Turun ${d}`,
    lineTrendFlat:  "➡️ Stabil",
    // pie chart interactive
    pieTitle:       "🛠️ Coba Sendiri — Buat Diagram Lingkaran",
    pieDesc:        "Isi tabel dengan kategori dan frekuensinya (nilai > 0), tambah atau hapus baris sesuai kebutuhan, lalu klik Buat Diagram Lingkaran.",
    pieCatHeader:   "Kategori / Label",
    pieFreqHeader:  "Frekuensi",
    pieAddRow:      "＋ Tambah Baris",
    pieMaxNote:     "(maks 10)",
    pieBuildBtn:    "Buat Diagram Lingkaran",
    pieReset:       "↺ Reset",
    pieTogglePct:   "% Persen",
    pieToggleDeg:   "° Derajat",
    pieResultTitle: "🥧 Hasil Diagram Lingkaran",
    pieFreqCol:     "Freq",
    pieTotal:       "TOTAL",
    piePctFormula:  "(f / total) × 100%",
    pieDegFormula:  "(f / total) × 360°",
    piePctLabel:    "RUMUS PERSEN",
    pieDegLabel:    "RUMUS DERAJAT",
    // stem-and-leaf interactive
    stemTitle:      "🛠️ Coba Sendiri — Buat Diagram Batang Daun",
    stemDesc:       "Masukkan data angka (0–999) dipisahkan koma, lalu klik Buat Diagram untuk melihat animasi batang daun lengkap dengan statistiknya!",
    stemLabel:      "Data angka (dipisah koma, maks 30):",
    stemSwap:       "Ganti contoh ↗",
    stemPlaceholder:"Contoh: 72, 65, 78, 83, 91, 75, 90...",
    stemBuildBtn:   "Buat Diagram Batang Daun",
    stemReset:      "↺ Reset",
    stemResultTitle:"🌿 Hasil Diagram Batang Daun",
    stemSorted:     "Data terurut:",
    stemStemHeader: "Batang",
    stemLeafHeader: "Daun",
    stemKeyNote:    "Kunci: Batang | Daun",
    stemKeyEx:      (stem: number, leaf: number, val: number) => `Contoh baris pertama: ${stem} | ${leaf} → ${val}`,
    stemMin:        "MINIMUM",
    stemMax:        "MAKSIMUM",
    stemMode:       "MODUS",
    stemMedian:     "MEDIAN",
    stemNoMode:     "Tidak ada",
    stemDataCount:  (n: number) => `${n} data · terurut`,
    stemErrMin:     "Masukkan minimal 2 angka, dipisahkan koma.",
    stemErrMax:     "Maksimal 30 angka.",
    stemErrInvalid: "Semua angka harus valid dan berada di antara 0–999.",
    // misc
    solution:   "PEMBAHASAN:",
    example:    (n: number) => `Contoh ${n}`,
    step:       (n: number) => `Langkah ${n}`,
    total:      "TOTAL",
    school:     "SMP Internasional",
    storeLabel: "Toko Pintar",
  };

  const en = {
    freqTitle:      "🛠️ Try It Yourself — Build a Frequency Distribution Table",
    freqDesc:       (n: number) => `Enter integer data (0–999) separated by commas — max ${n} numbers. Click Build Table to see the table and frequency chart appear with animation!`,
    freqLabel:      "Raw data (comma-separated, max 40):",
    freqSwap:       "Load new example ↗",
    freqPlaceholder:"Example: 70, 75, 80, 70, 85, 80, 75...",
    freqBuildBtn:   "Build Table & Chart",
    freqReset:      "↺ Reset",
    freqResultTitle:"📊 Frequency Distribution Table Result",
    freqDataCount:  (total: number, unique: number) => `${total} data points · ${unique} unique values`,
    freqValHeader:  "Value",
    freqFrekHeader: "Frequency (f)",
    freqTotal:      "TOTAL",
    freqNLabel:     "DATA COUNT (n)",
    freqUniqueLabel:"UNIQUE VALUES",
    freqSumNote:    (n: number) => `Sum of all frequencies = number of data = ${n}.`,
    freqErrMin:     "Enter at least 2 numbers.",
    freqErrMax:     "Maximum 40 numbers.",
    freqErrInvalid: "All data must be integers between 0–999.",
    barTitle:       "🛠️ Try It Yourself — Build a Bar Chart",
    barDesc:        "Fill in the table with your data, add or remove rows as needed, then click Convert to Bar Chart to see the animated result!",
    barCatHeader:   "Category / Label",
    barValHeader:   "Value",
    barPlaceholder: "Example: Scouts",
    barAddRow:      "＋ Add Row",
    barMaxNote:     "(max 10)",
    barBuildBtn:    "Convert to Bar Chart",
    barReset:       "↺ Reset",
    barResultTitle: "📊 Bar Chart Result",
    barBiggest:     "HIGHEST",
    barTotal:       "TOTAL",
    barSmallest:    "LOWEST",
    barDataCount:   (n: number) => `${n} data`,
    lineTitle:      "🛠️ Try It Yourself — Build a Line Chart",
    lineDesc:       "Fill in the table with your data — add or remove rows as needed (min 2 rows), then click Build Line Chart to see the animated result!",
    lineLabelHeader:"Label (time/category)",
    lineValHeader:  "Value",
    linePlaceholder:"Example: Jan",
    lineAddRow:     "＋ Add Row",
    lineMaxNote:    "(max 12)",
    lineBuildBtn:   "Build Line Chart",
    lineReset:      "↺ Reset",
    lineResultTitle:"📈 Line Chart Result",
    lineTrend:      "TREND",
    lineHighest:    "HIGHEST",
    lineAvg:        "AVERAGE",
    lineLowest:     "LOWEST",
    lineTrendUp:    (d: number) => `📈 Up +${d}`,
    lineTrendDown:  (d: number) => `📉 Down ${d}`,
    lineTrendFlat:  "➡️ Stable",
    pieTitle:       "🛠️ Try It Yourself — Build a Pie Chart",
    pieDesc:        "Fill in the table with categories and their frequencies (value > 0), add or remove rows as needed, then click Build Pie Chart.",
    pieCatHeader:   "Category / Label",
    pieFreqHeader:  "Frequency",
    pieAddRow:      "＋ Add Row",
    pieMaxNote:     "(max 10)",
    pieBuildBtn:    "Build Pie Chart",
    pieReset:       "↺ Reset",
    pieTogglePct:   "% Percent",
    pieToggleDeg:   "° Degrees",
    pieResultTitle: "🥧 Pie Chart Result",
    pieFreqCol:     "Freq",
    pieTotal:       "TOTAL",
    piePctFormula:  "(f / total) × 100%",
    pieDegFormula:  "(f / total) × 360°",
    piePctLabel:    "% FORMULA",
    pieDegLabel:    "° FORMULA",
    stemTitle:      "🛠️ Try It Yourself — Build a Stem-and-Leaf Plot",
    stemDesc:       "Enter numbers (0–999) separated by commas, then click Build Plot to see the animated stem-and-leaf diagram with statistics!",
    stemLabel:      "Numbers (comma-separated, max 30):",
    stemSwap:       "Load new example ↗",
    stemPlaceholder:"Example: 72, 65, 78, 83, 91, 75, 90...",
    stemBuildBtn:   "Build Stem-and-Leaf Plot",
    stemReset:      "↺ Reset",
    stemResultTitle:"🌿 Stem-and-Leaf Plot Result",
    stemSorted:     "Sorted data:",
    stemStemHeader: "Stem",
    stemLeafHeader: "Leaf",
    stemKeyNote:    "Key: Stem | Leaf",
    stemKeyEx:      (stem: number, leaf: number, val: number) => `First row example: ${stem} | ${leaf} → ${val}`,
    stemMin:        "MINIMUM",
    stemMax:        "MAXIMUM",
    stemMode:       "MODE",
    stemMedian:     "MEDIAN",
    stemNoMode:     "None",
    stemDataCount:  (n: number) => `${n} data · sorted`,
    stemErrMin:     "Enter at least 2 numbers, separated by commas.",
    stemErrMax:     "Maximum 30 numbers.",
    stemErrInvalid: "All numbers must be valid and between 0–999.",
    solution:   "SOLUTION:",
    example:    (n: number) => `Example ${n}`,
    step:       (n: number) => `Step ${n}`,
    total:      "TOTAL",
    school:     "International Middle School",
    storeLabel: "Smart Store",
  };

  const ja = {
    freqTitle:      "🛠️ 自分で試そう — 度数分布表を作ろう",
    freqDesc:       (n: number) => `整数データ（0〜999）をカンマ区切りで入力してください — 最大${n}個。「表を作る」ボタンでアニメーション付きの表と度数グラフが表示されます！`,
    freqLabel:      "生データ（カンマ区切り、最大40個）：",
    freqSwap:       "例を変える ↗",
    freqPlaceholder:"例：70, 75, 80, 70, 85, 80, 75...",
    freqBuildBtn:   "表・グラフを作る",
    freqReset:      "↺ リセット",
    freqResultTitle:"📊 度数分布表の結果",
    freqDataCount:  (total: number, unique: number) => `${total}個のデータ · ${unique}種類の値`,
    freqValHeader:  "値",
    freqFrekHeader: "度数 (f)",
    freqTotal:      "合計",
    freqNLabel:     "データ数 (n)",
    freqUniqueLabel:"ユニーク値",
    freqSumNote:    (n: number) => `全度数の合計 = データ数 = ${n}。`,
    freqErrMin:     "少なくとも2つの数を入力してください。",
    freqErrMax:     "最大40個です。",
    freqErrInvalid: "すべてのデータは0〜999の整数でなければなりません。",
    barTitle:       "🛠️ 自分で試そう — 棒グラフを作ろう",
    barDesc:        "表にデータを入力し、必要に応じて行を追加・削除してから「棒グラフに変換」をクリックしてアニメーション結果を見てみましょう！",
    barCatHeader:   "カテゴリ / ラベル",
    barValHeader:   "値",
    barPlaceholder: "例：スカウト",
    barAddRow:      "＋ 行を追加",
    barMaxNote:     "（最大10行）",
    barBuildBtn:    "棒グラフに変換",
    barReset:       "↺ リセット",
    barResultTitle: "📊 棒グラフの結果",
    barBiggest:     "最大",
    barTotal:       "合計",
    barSmallest:    "最小",
    barDataCount:   (n: number) => `${n}データ`,
    lineTitle:      "🛠️ 自分で試そう — 折れ線グラフを作ろう",
    lineDesc:       "表にデータを入力し（最低2行）、必要に応じて行を追加・削除してから「折れ線グラフを作る」をクリックしてアニメーション結果を見てみましょう！",
    lineLabelHeader:"ラベル（時間/カテゴリ）",
    lineValHeader:  "値",
    linePlaceholder:"例：1月",
    lineAddRow:     "＋ 行を追加",
    lineMaxNote:    "（最大12行）",
    lineBuildBtn:   "折れ線グラフを作る",
    lineReset:      "↺ リセット",
    lineResultTitle:"📈 折れ線グラフの結果",
    lineTrend:      "傾向",
    lineHighest:    "最高値",
    lineAvg:        "平均",
    lineLowest:     "最低値",
    lineTrendUp:    (d: number) => `📈 上昇 +${d}`,
    lineTrendDown:  (d: number) => `📉 下降 ${d}`,
    lineTrendFlat:  "➡️ 横ばい",
    pieTitle:       "🛠️ 自分で試そう — 円グラフを作ろう",
    pieDesc:        "カテゴリと度数（値 > 0）を表に入力し、必要に応じて行を追加・削除してから「円グラフを作る」をクリックしてください。",
    pieCatHeader:   "カテゴリ / ラベル",
    pieFreqHeader:  "度数",
    pieAddRow:      "＋ 行を追加",
    pieMaxNote:     "（最大10行）",
    pieBuildBtn:    "円グラフを作る",
    pieReset:       "↺ リセット",
    pieTogglePct:   "% パーセント",
    pieToggleDeg:   "° 角度",
    pieResultTitle: "🥧 円グラフの結果",
    pieFreqCol:     "度数",
    pieTotal:       "合計",
    piePctFormula:  "(f / 合計) × 100%",
    pieDegFormula:  "(f / 合計) × 360°",
    piePctLabel:    "% 公式",
    pieDegLabel:    "° 公式",
    stemTitle:      "🛠️ 自分で試そう — 幹葉図を作ろう",
    stemDesc:       "数字（0〜999）をカンマ区切りで入力し、「幹葉図を作る」をクリックして統計付きのアニメーションを見てみましょう！",
    stemLabel:      "数値（カンマ区切り、最大30個）：",
    stemSwap:       "例を変える ↗",
    stemPlaceholder:"例：72, 65, 78, 83, 91, 75, 90...",
    stemBuildBtn:   "幹葉図を作る",
    stemReset:      "↺ リセット",
    stemResultTitle:"🌿 幹葉図の結果",
    stemSorted:     "整列済みデータ：",
    stemStemHeader: "幹",
    stemLeafHeader: "葉",
    stemKeyNote:    "凡例：幹 | 葉",
    stemKeyEx:      (stem: number, leaf: number, val: number) => `最初の行の例：${stem} | ${leaf} → ${val}`,
    stemMin:        "最小値",
    stemMax:        "最大値",
    stemMode:       "最頻値",
    stemMedian:     "中央値",
    stemNoMode:     "なし",
    stemDataCount:  (n: number) => `${n}個 · 整列済み`,
    stemErrMin:     "カンマ区切りで最低2つの数を入力してください。",
    stemErrMax:     "最大30個です。",
    stemErrInvalid: "すべての数は0〜999の範囲でなければなりません。",
    solution:   "解説：",
    example:    (n: number) => `例題${n}`,
    step:       (n: number) => `ステップ${n}`,
    total:      "合計",
    school:     "国際中学校",
    storeLabel: "スマートショップ",
  };

  return { id, en, ja }[language];
}

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

const PenyajianDataPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pt  = pageTrans[language];
  const st  = sectionTitles[language];
  const lvl = levelLabels[language];
  const t   = getTrans(language);

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
    if (parts.length < 2) { setStemError(t.stemErrMin); return; }
    if (parts.length > 30) { setStemError(t.stemErrMax); return; }
    const nums = parts.map(p => parseInt(p.trim(), 10));
    if (nums.some(n => isNaN(n) || n < 0 || n > 999)) { setStemError(t.stemErrInvalid); return; }
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
    if (parts.length < 2) { setFreqError(t.freqErrMin); return; }
    if (parts.length > 40) { setFreqError(t.freqErrMax); return; }
    const nums = parts.map(p => Number(p.trim()));
    if (nums.some(n => isNaN(n) || !Number.isInteger(n) || n < 0 || n > 999)) {
      setFreqError(t.freqErrInvalid); return;
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

  // School subjects, transport, fruits per language
  const subjectLabels = language === "id"
    ? { mat: "Matematika", ipa: "IPA", bhs: "Bhs.Indo", ips: "IPS" }
    : language === "en"
    ? { mat: "Math", ipa: "Science", bhs: "Lang.Arts", ips: "Soc.Studies" }
    : { mat: "数学", ipa: "理科", bhs: "国語", ips: "社会" };

  const transportLabels = language === "id"
    ? ["Jalan Kaki", "Sepeda", "Angkot", "Motor", "Mobil"]
    : language === "en"
    ? ["Walking", "Bicycle", "Minibus", "Motorcycle", "Car"]
    : ["徒歩", "自転車", "ミニバス", "バイク", "車"];

  const fruitLabels = language === "id"
    ? { mangga: "Mangga", jeruk: "Jeruk", apel: "Apel", pisang: "Pisang", lainnya: "Lainnya" }
    : language === "en"
    ? { mangga: "Mango", jeruk: "Orange", apel: "Apple", pisang: "Banana", lainnya: "Other" }
    : { mangga: "マンゴー", jeruk: "オレンジ", apel: "リンゴ", pisang: "バナナ", lainnya: "その他" };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {pt.h1}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {pt.context}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===== PENGANTAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={st.intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {language === "id" ? (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bayangkan kamu punya ratusan nilai ujian dalam satu lembar kertas berisi angka-angka acak. Susah dibaca, kan? Nah, di sinilah penyajian data berperan — mengubah kumpulan angka mentah menjadi tampilan yang <strong className="text-cyan-300">informatif, rapi, dan mudah dipahami</strong>.
                  </p>
                ) : language === "en" ? (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Imagine having hundreds of exam scores on a single sheet of paper full of random numbers. Hard to read, right? That's where data presentation comes in — transforming raw numbers into something <strong className="text-cyan-300">informative, organised, and easy to understand</strong>.
                  </p>
                ) : (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    数百の試験の点数がランダムな数字で1枚の紙に書かれている場面を想像してみてください。読みにくいですよね？そこで活躍するのがデータの表現です — 生の数値を<strong className="text-cyan-300">わかりやすく、整然と、伝わりやすい</strong>形に変えます。
                  </p>
                )}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-cyan-200 leading-relaxed">
                      Di sub-bab ini kamu akan belajar lima bentuk penyajian data: Diagram Batang Daun, Diagram Batang, Diagram Garis, Diagram Lingkaran, dan Tabel Distribusi Frekuensi. Setiap bentuk punya keunggulannya masing-masing! 📊🚀
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-cyan-200 leading-relaxed">
                      In this section you'll learn five forms of data presentation: Stem-and-Leaf Plot, Bar Chart, Line Chart, Pie Chart, and Frequency Distribution Table. Each has its own advantages! 📊🚀
                    </p>
                  ) : (
                    <p className="font-body text-sm text-cyan-200 leading-relaxed">
                      このサブトピックでは、データ表現の5つの形式を学びます：幹葉図、棒グラフ、折れ線グラフ、円グラフ、度数分布表。それぞれに独自の利点があります！📊🚀
                    </p>
                  )}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Catatan:</strong> Pastikan kamu sudah memahami Pengantar Statistika sebelum masuk ke sini. Kemampuan membaca dan membuat diagram sangat dibutuhkan di ujian!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Note:</strong> Make sure you understand the Introduction to Statistics before studying this section. The ability to read and create diagrams is essential for exams!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>注意：</strong>このセクションに進む前に、統計の入門を理解していることを確認してください。図表を読み、作成する能力は試験で非常に重要です！
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ===== SUB-BAB 1: TABEL DISTRIBUSI FREKUENSI ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={st.konsep1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">
                    {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                  </p>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-cyan-300">Tabel distribusi frekuensi</strong> adalah cara menyajikan data dengan menghitung <strong className="text-cyan-300">berapa kali setiap nilai muncul</strong> dalam kumpulan data. Nilai yang dihitung kemunculannya disebut <strong className="text-cyan-300">frekuensi</strong>.
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      A <strong className="text-cyan-300">frequency distribution table</strong> presents data by counting <strong className="text-cyan-300">how many times each value appears</strong> in the dataset. The count of each value's occurrences is called its <strong className="text-cyan-300">frequency</strong>.
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-cyan-300">度数分布表</strong>は、データセット内で<strong className="text-cyan-300">各値が何回出現するか</strong>を数えることでデータを表現する方法です。各値の出現回数を<strong className="text-cyan-300">度数</strong>と呼びます。
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-cyan-300">
                        {language === "id" ? "NILAI" : language === "en" ? "VALUE" : "値"}
                      </p>
                      <p className="font-body text-xs text-white/70 mt-1">
                        {language === "id" ? "Data yang diamati" : language === "en" ? "The observed data" : "観測されたデータ"}
                      </p>
                      <p className="font-body text-xs text-cyan-400 mt-1">
                        {language === "id" ? "mis. 70, 75, 80 ..." : language === "en" ? "e.g. 70, 75, 80 ..." : "例：70, 75, 80 ..."}
                      </p>
                    </div>
                    <div className="bg-teal-900/40 border border-teal-500/40 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-teal-300">
                        {language === "id" ? "FREKUENSI" : language === "en" ? "FREQUENCY" : "度数"}
                      </p>
                      <p className="font-body text-xs text-white/70 mt-1">
                        {language === "id" ? "Berapa kali nilai itu muncul" : language === "en" ? "How many times that value appears" : "その値が出現する回数"}
                      </p>
                      <p className="font-body text-xs text-teal-400 mt-1">
                        {language === "id" ? "dihitung dari data mentah" : language === "en" ? "counted from raw data" : "生データから数える"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-body text-xs font-bold text-cyan-300">
                      {language === "id" ? "📋 Cara Membuat Tabel Distribusi Frekuensi:" : language === "en" ? "📋 How to Build a Frequency Distribution Table:" : "📋 度数分布表の作り方："}
                    </p>
                    {(language === "id" ? [
                      ["1", "Catat semua data mentah", "Kumpulkan seluruh data yang ada"],
                      ["2", "Tentukan nilai-nilai berbeda", "Catat semua nilai unik yang muncul"],
                      ["3", "Hitung kemunculan tiap nilai", "Berapa kali nilai itu ada dalam data?"],
                      ["4", "Tulis dalam tabel", "Kolom Nilai | Kolom Frekuensi"],
                    ] : language === "en" ? [
                      ["1", "Record all raw data", "Gather all available data"],
                      ["2", "Identify distinct values", "Note every unique value that appears"],
                      ["3", "Count occurrences of each value", "How many times does each value appear?"],
                      ["4", "Write in a table", "Value column | Frequency column"],
                    ] : [
                      ["1", "すべての生データを記録する", "利用可能なすべてのデータを収集する"],
                      ["2", "異なる値を特定する", "出現するすべてのユニークな値をメモする"],
                      ["3", "各値の出現回数を数える", "各値は何回出現するか？"],
                      ["4", "表に書き込む", "値の列 | 度数の列"],
                    ]).map(([no, judul, ket]) => (
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
                        <p className="font-body text-xs font-bold text-cyan-200 uppercase tracking-wide">
                          {language === "id"
                            ? "📋 Contoh: Distribusi Frekuensi Nilai Ulangan 20 Siswa"
                            : language === "en"
                            ? "📋 Example: Frequency Distribution of Quiz Scores for 20 Students"
                            : "📋 例：20人の生徒の小テストの点数の度数分布"}
                        </p>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="font-body text-xs text-white/50 mb-2">
                            {language === "id"
                              ? `Diketahui nilai matematika 20 siswa ${t.school}:`
                              : language === "en"
                              ? `Given the math scores of 20 students at ${t.school}:`
                              : `${t.school}の20人の生徒の数学の点数：`}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {contohData.map((v, i) => (
                              <span key={i} className="bg-slate-700/60 border border-cyan-500/20 rounded px-2 py-1 font-mono text-xs text-cyan-300">{v}</span>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-cyan-500/20 max-w-xs">
                          <div className="grid bg-cyan-950/60" style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300">{t.freqValHeader}</div>
                            <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300 text-center">{t.freqFrekHeader}</div>
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
                              <div className="px-3 py-2 font-body text-xs font-bold text-white">{t.freqTotal}</div>
                              <div className="px-3 py-2 text-center font-body text-xs font-bold text-cyan-400">{contohData.length}</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3 font-body text-xs text-white/70 leading-relaxed">
                          {language === "id" ? (
                            <><strong className="text-cyan-300">Cara membaca:</strong> Nilai 80 muncul <strong className="text-green-300">5 kali</strong> → frekuensinya 5. Nilai 95 muncul <strong className="text-green-300">1 kali</strong> → frekuensinya 1. Jumlah seluruh frekuensi = <strong className="text-cyan-300">20</strong> (= banyak data).</>
                          ) : language === "en" ? (
                            <><strong className="text-cyan-300">How to read:</strong> Value 80 appears <strong className="text-green-300">5 times</strong> → frequency 5. Value 95 appears <strong className="text-green-300">1 time</strong> → frequency 1. Sum of all frequencies = <strong className="text-cyan-300">20</strong> (= number of data).</>
                          ) : (
                            <><strong className="text-cyan-300">読み方：</strong>値80は<strong className="text-green-300">5回</strong>出現 → 度数5。値95は<strong className="text-green-300">1回</strong>出現 → 度数1。全度数の合計 = <strong className="text-cyan-300">20</strong>（= データ数）。</>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ===== ANIMASI INTERAKTIF: FREQ TABLE ===== */}
                <div className="bg-slate-800/70 border border-cyan-500/30 rounded-xl overflow-hidden">
                  <div className="bg-cyan-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-cyan-200">{t.freqTitle}</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      {t.freqDesc(40)}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body text-xs font-semibold text-cyan-300">{t.freqLabel}</label>
                        <button
                          onClick={loadFreqExample}
                          className="font-body text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors underline underline-offset-2"
                        >{t.freqSwap}</button>
                      </div>
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
                        placeholder={t.freqPlaceholder}
                        rows={2}
                        className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-cyan-400/60 transition-colors resize-none"
                      />
                      {freqError && (
                        <p className="font-body text-xs text-red-400">⚠ {freqError}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={buildFreqTable}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 border border-cyan-500/50 text-white text-xs font-body font-bold hover:bg-cyan-500 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        {t.freqBuildBtn}
                      </button>
                      {freqVisible && (
                        <button
                          onClick={resetFreqTable}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >{t.freqReset}</button>
                      )}
                    </div>

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
                            <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wider">{t.freqResultTitle}</p>
                            <span className="font-body text-xs text-white/35">{t.freqDataCount(total, freqResult.length)}</span>
                          </div>

                          <div className="rounded-lg overflow-hidden border border-cyan-500/20 max-w-xs">
                            <div className="grid bg-cyan-950/70" style={{ gridTemplateColumns: "1fr 1fr" }}>
                              <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300">{t.freqValHeader}</div>
                              <div className="px-3 py-2 font-body text-xs font-bold text-cyan-300 text-center">{t.freqFrekHeader}</div>
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
                                <div className="px-3 py-2 font-body text-xs font-bold text-white">{t.freqTotal}</div>
                                <div className="px-3 py-2 text-center font-body text-xs font-bold text-cyan-400">{total}</div>
                              </div>
                            </div>
                          </div>

                          <div
                            className="grid grid-cols-2 gap-2"
                            style={{
                              opacity: freqAnimated ? 1 : 0,
                              transition: `opacity 0.4s ease ${freqResult.length * 0.07 + 0.3}s`,
                            }}
                          >
                            <div className="bg-cyan-900/25 border border-cyan-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.freqNLabel}</p>
                              <p className="font-body text-cyan-300 font-bold text-sm mt-0.5">{total}</p>
                            </div>
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.freqUniqueLabel}</p>
                              <p className="font-body text-green-300 font-bold text-sm mt-0.5">{freqResult.length}</p>
                            </div>
                          </div>

                          <p className="font-body text-xs text-white/40 leading-relaxed">
                            {t.freqSumNote(total)}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Ingat:</strong> Tabel distribusi frekuensi data tunggal mencatat berapa kali setiap nilai muncul. Jumlah semua frekuensi harus sama dengan banyaknya seluruh data (n). Semakin tinggi batang pada diagram, semakin sering nilai tersebut muncul!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Remember:</strong> A single-data frequency distribution table records how many times each value appears. The sum of all frequencies must equal the total number of data points (n). The taller the bar in the chart, the more often that value appears!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>覚えておこう：</strong>単一データの度数分布表は、各値が何回出現するかを記録します。すべての度数の合計はデータの総数（n）と等しくなければなりません。グラフの棒が高いほど、その値は頻繁に出現します！
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title={st.contoh1} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                    <span className="font-body font-semibold text-white">{t.example(1)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    {language === "id" ? (
                      <>
                        <p className="font-body text-sm text-white">
                          Data nilai ulangan IPA 10 siswa: <strong className="text-cyan-300">70, 80, 75, 90, 80, 75, 70, 85, 90, 75</strong>.
                        </p>
                        <p className="font-body text-sm text-white">
                          Buat tabel distribusi frekuensi data tunggal, lalu tentukan:<br />
                          (a) Total frekuensi &nbsp; (b) Nilai yang paling sering muncul dari tabel
                        </p>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p className="font-body text-sm text-white">
                          Science quiz scores of 10 students: <strong className="text-cyan-300">70, 80, 75, 90, 80, 75, 70, 85, 90, 75</strong>.
                        </p>
                        <p className="font-body text-sm text-white">
                          Build a single-data frequency distribution table, then determine:<br />
                          (a) Total frequency &nbsp; (b) The value that appears most often
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-body text-sm text-white">
                          10人の生徒の理科の小テストの点数：<strong className="text-cyan-300">70, 80, 75, 90, 80, 75, 70, 85, 90, 75</strong>。
                        </p>
                        <p className="font-body text-sm text-white">
                          単一データの度数分布表を作成し、次を求めなさい：<br />
                          (a) 度数の合計 &nbsp; (b) 最も頻繁に出現する値
                        </p>
                      </>
                    )}
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step(1)}:</strong>{" "}{language === "id" ? "Urutkan data → 70, 70, 75, 75, 75, 80, 80, 85, 90, 90" : language === "en" ? "Sort the data → 70, 70, 75, 75, 75, 80, 80, 85, 90, 90" : "データを整列 → 70, 70, 75, 75, 75, 80, 80, 85, 90, 90"}</p>
                      <p><strong>{t.step(2)}:</strong>{" "}{language === "id" ? "Hitung kemunculan tiap nilai:" : language === "en" ? "Count occurrences of each value:" : "各値の出現回数を数える："}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-slate-700/40">
                              <th className="px-3 py-1.5 text-left text-white/70">{language === "id" ? "Nilai (x)" : language === "en" ? "Value (x)" : "値 (x)"}</th>
                              <th className="px-3 py-1.5 text-center text-white/70">{language === "id" ? "Turus" : language === "en" ? "Tally" : "正の字"}</th>
                              <th className="px-3 py-1.5 text-center text-white/70">{t.freqFrekHeader}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              ["70","||","2"],
                              ["75","|||","3"],
                              ["80","||","2"],
                              ["85","|","1"],
                              ["90","||","2"],
                            ].map(([x,tally,f],i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : ""}>
                                <td className="px-3 py-1.5 text-green-300 font-bold">{x}</td>
                                <td className="px-3 py-1.5 text-center text-cyan-300 tracking-widest">{tally}</td>
                                <td className="px-3 py-1.5 text-center text-white font-bold">{f}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold bg-slate-700/20">
                              <td className="px-3 py-1.5 text-yellow-300">{language === "id" ? "Jumlah" : language === "en" ? "Sum" : "合計"}</td>
                              <td className="px-3 py-1.5 text-center">—</td>
                              <td className="px-3 py-1.5 text-center text-yellow-300">10</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1.5">
                        {language === "id" ? (
                          <>
                            <p>(a) Total frekuensi = <InlineMath math="2 + 3 + 2 + 1 + 2 = \mathbf{10}" /> ✓ (sama dengan banyak data)</p>
                            <p>(b) Nilai yang paling sering muncul = <span className="text-green-400 font-bold">75</span> (muncul 3 kali, frekuensi tertinggi)</p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p>(a) Total frequency = <InlineMath math="2 + 3 + 2 + 1 + 2 = \mathbf{10}" /> ✓ (equals number of data)</p>
                            <p>(b) Most frequent value = <span className="text-green-400 font-bold">75</span> (appears 3 times, highest frequency)</p>
                          </>
                        ) : (
                          <>
                            <p>(a) 度数の合計 = <InlineMath math="2 + 3 + 2 + 1 + 2 = \mathbf{10}" /> ✓（データ数と等しい）</p>
                            <p>(b) 最も頻繁に出現する値 = <span className="text-green-400 font-bold">75</span>（3回出現、最高度数）</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                    <span className="font-body font-semibold text-white">{t.example(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Data berikut adalah hasil pencatatan banyak anak dalam keluarga pada sebuah desa.
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        The following data records the number of children per family in a village.
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        次のデータは、ある村の家族ごとの子供の人数を記録したものです。
                      </p>
                    )}
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
                      <strong>a.</strong>{" "}
                      {language === "id" ? "Buatlah tabel distribusi frekuensinya!" : language === "en" ? "Build the frequency distribution table!" : "度数分布表を作りなさい！"}
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step(1)}:</strong>{" "}{language === "id" ? "Tentukan nilai-nilai yang berbeda → 1, 2, 3, 4, 5, 6" : language === "en" ? "Identify distinct values → 1, 2, 3, 4, 5, 6" : "異なる値を特定 → 1, 2, 3, 4, 5, 6"}</p>
                      <p><strong>{t.step(2)}:</strong>{" "}{language === "id" ? "Hitung frekuensi kemunculan tiap nilai dari 40 data:" : language === "en" ? "Count the frequency of each value from 40 data points:" : "40個のデータから各値の度数を数える："}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-slate-700/40">
                              <th className="px-3 py-1.5 text-left text-white/70">{language === "id" ? "Banyak Anak (x)" : language === "en" ? "No. of Children (x)" : "子供の人数 (x)"}</th>
                              <th className="px-3 py-1.5 text-center text-white/70">{language === "id" ? "Turus" : language === "en" ? "Tally" : "正の字"}</th>
                              <th className="px-3 py-1.5 text-center text-white/70">{t.freqFrekHeader}</th>
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
                            ].map(([x,tally,f],i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : ""}>
                                <td className="px-3 py-1.5 text-yellow-300 font-bold">{x}</td>
                                <td className="px-3 py-1.5 text-center text-cyan-300 tracking-widest">{tally}</td>
                                <td className="px-3 py-1.5 text-center text-white font-bold">{f}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50 font-bold bg-slate-700/20">
                              <td className="px-3 py-1.5 text-yellow-300">{language === "id" ? "Jumlah" : language === "en" ? "Sum" : "合計"}</td>
                              <td className="px-3 py-1.5 text-center">—</td>
                              <td className="px-3 py-1.5 text-center text-yellow-300">40</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1.5">
                        {language === "id" ? (
                          <p>Total frekuensi = <InlineMath math="6 + 10 + 10 + 7 + 5 + 2 = \mathbf{40}" /> ✓ (sama dengan banyak data)</p>
                        ) : language === "en" ? (
                          <p>Total frequency = <InlineMath math="6 + 10 + 10 + 7 + 5 + 2 = \mathbf{40}" /> ✓ (equals number of data)</p>
                        ) : (
                          <p>度数の合計 = <InlineMath math="6 + 10 + 10 + 7 + 5 + 2 = \mathbf{40}" /> ✓（データ数と等しい）</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                    <span className="font-body font-semibold text-white">{t.example(3)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    {language === "id" ? (
                      <>
                        <p className="font-body text-sm text-white">Data nilai ulangan matematika 25 siswa:</p>
                        <p className="font-body text-sm text-cyan-300 font-semibold leading-relaxed">
                          60, 70, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 70, 90, 80, 70
                        </p>
                        <p className="font-body text-sm text-white mt-1">
                          Buat tabel distribusi frekuensi data tunggal lengkap dengan frekuensi kumulatif (fk), lalu tentukan:<br />
                          (a) Persentase siswa yang mendapat nilai ≥ 80 &nbsp;
                          (b) Banyak siswa yang mendapat nilai di bawah 80
                        </p>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p className="font-body text-sm text-white">Math quiz scores of 25 students:</p>
                        <p className="font-body text-sm text-cyan-300 font-semibold leading-relaxed">
                          60, 70, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 70, 90, 80, 70
                        </p>
                        <p className="font-body text-sm text-white mt-1">
                          Build a frequency distribution table with cumulative frequency (cf), then determine:<br />
                          (a) Percentage of students scoring ≥ 80 &nbsp;
                          (b) Number of students scoring below 80
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-body text-sm text-white">25人の生徒の数学の小テストの点数：</p>
                        <p className="font-body text-sm text-cyan-300 font-semibold leading-relaxed">
                          60, 70, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 90, 70, 80, 70, 60, 80, 70, 90, 80, 70
                        </p>
                        <p className="font-body text-sm text-white mt-1">
                          累積度数（cf）付きの度数分布表を作成し、次を求めなさい：<br />
                          (a) 80点以上の生徒の割合 &nbsp;
                          (b) 80点未満の生徒の人数
                        </p>
                      </>
                    )}
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step(1)}:</strong>{" "}
                        {language === "id" ? "Hitung frekuensi tiap nilai dan frekuensi kumulatif (fk = jumlah f dari atas s.d. baris tersebut):"
                          : language === "en" ? "Count the frequency of each value and cumulative frequency (cf = sum of f from top to that row):"
                          : "各値の度数と累積度数を計算する（cf = 上から当該行までのfの合計）："}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-slate-700/40">
                              <th className="px-2 py-1.5 text-left text-white/70">{language === "id" ? "Nilai (x)" : language === "en" ? "Value (x)" : "値 (x)"}</th>
                              <th className="px-2 py-1.5 text-center text-white/70">{t.freqFrekHeader}</th>
                              <th className="px-2 py-1.5 text-center text-white/70">{language === "id" ? "Frek. Kumulatif (fk)" : language === "en" ? "Cumul. Freq. (cf)" : "累積度数 (cf)"}</th>
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
                              <td className="px-2 py-1.5 text-yellow-300">{language === "id" ? "Jumlah" : language === "en" ? "Sum" : "合計"}</td>
                              <td className="px-2 py-1.5 text-center text-yellow-300">25</td>
                              <td className="px-2 py-1.5 text-center text-slate-400">—</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        {language === "id" ? (
                          <>
                            <p><strong>(a)</strong> Siswa nilai ≥ 80 = f(80) + f(90) = 8 + 4 = 12 siswa</p>
                            <p>Persentase = <InlineMath math="\frac{12}{25} \times 100\% = \mathbf{48\%}" /></p>
                            <p><strong>(b)</strong> Siswa nilai &lt; 80 = f(60) + f(70) = 4 + 9 = <span className="text-red-400 font-bold">13 siswa</span></p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p><strong>(a)</strong> Students scoring ≥ 80 = f(80) + f(90) = 8 + 4 = 12 students</p>
                            <p>Percentage = <InlineMath math="\frac{12}{25} \times 100\% = \mathbf{48\%}" /></p>
                            <p><strong>(b)</strong> Students scoring &lt; 80 = f(60) + f(70) = 4 + 9 = <span className="text-red-400 font-bold">13 students</span></p>
                          </>
                        ) : (
                          <>
                            <p><strong>(a)</strong> 80点以上の生徒 = f(80) + f(90) = 8 + 4 = 12人</p>
                            <p>割合 = <InlineMath math="\frac{12}{25} \times 100\% = \mathbf{48\%}" /></p>
                            <p><strong>(b)</strong> 80点未満の生徒 = f(60) + f(70) = 4 + 9 = <span className="text-red-400 font-bold">13人</span></p>
                          </>
                        )}
                      </div>
                      <p><strong className="text-primary">
                        {language === "id" ? "48% siswa nilai ≥ 80; 13 siswa nilai < 80"
                          : language === "en" ? "48% of students scored ≥ 80; 13 students scored < 80"
                          : "48%の生徒が80点以上；13人が80点未満"}
                      </strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 2: DIAGRAM BATANG ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title={st.konsep2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">
                    {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                  </p>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-blue-300">Diagram batang</strong> menggunakan batang-batang persegi panjang untuk mewakili data. Tinggi (atau panjang) batang menunjukkan nilai/frekuensi data. Sangat efektif untuk <strong className="text-blue-300">membandingkan beberapa kategori</strong> secara visual.
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      A <strong className="text-blue-300">bar chart</strong> uses rectangular bars to represent data. The height (or length) of each bar shows the data value or frequency. It is very effective for <strong className="text-blue-300">comparing multiple categories</strong> visually.
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-blue-300">棒グラフ</strong>は長方形の棒を使ってデータを表します。各棒の高さ（または長さ）はデータの値や度数を示します。複数のカテゴリを<strong className="text-blue-300">視覚的に比較する</strong>のに非常に効果的です。
                    </p>
                  )}
                </div>

                {/* Visual Diagram Batang */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">
                      {language === "id" ? "📊 Contoh: Jumlah Siswa yang Memilih Ekskul"
                        : language === "en" ? "📊 Example: Number of Students Choosing Extracurriculars"
                        : "📊 例：課外活動を選んだ生徒数"}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="relative h-44 flex items-end gap-3 px-2 pb-8">
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between pb-8 pt-2">
                        {[30, 25, 20, 15, 10, 5, 0].map((v) => (
                          <span key={v} className="text-white/30 text-xs font-body">{v}</span>
                        ))}
                      </div>
                      <div className="absolute left-7 right-2 top-0 h-full pb-8">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i / 6) * 100}%` }} />
                        ))}
                      </div>
                      {[
                        { label: language === "id" ? "Pramuka" : language === "en" ? "Scouts" : "スカウト", value: 24, color: "bg-blue-500" },
                        { label: language === "id" ? "Musik" : language === "en" ? "Music" : "音楽", value: 18, color: "bg-purple-500" },
                        { label: "Futsal", value: 30, color: "bg-green-500" },
                        { label: language === "id" ? "Tari" : language === "en" ? "Dance" : "ダンス", value: 12, color: "bg-pink-500" },
                        { label: language === "id" ? "Robotik" : language === "en" ? "Robotics" : "ロボット", value: 21, color: "bg-orange-500" },
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
                    <p className="font-body text-xs text-white/40 text-center mt-2">
                      {language === "id" ? "Diagram Batang: Pilihan Ekskul Siswa"
                        : language === "en" ? "Bar Chart: Student Extracurricular Choices"
                        : "棒グラフ：生徒の課外活動の選択"}
                    </p>
                  </div>
                </div>

                {/* Komponen Diagram Batang */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">
                    {language === "id" ? "🔍 Komponen Diagram Batang" : language === "en" ? "🔍 Bar Chart Components" : "🔍 棒グラフの構成要素"}
                  </p>
                  <div className="space-y-2 font-body text-sm">
                    {(language === "id" ? [
                      ["Sumbu X (horizontal)", "kategori atau nama data"],
                      ["Sumbu Y (vertikal)", "nilai atau frekuensi"],
                      ["Batang", "mewakili nilai tiap kategori; lebar sama, ada jarak antar batang"],
                      ["Judul", "menjelaskan isi diagram"],
                    ] : language === "en" ? [
                      ["X-axis (horizontal)", "categories or data labels"],
                      ["Y-axis (vertical)", "values or frequencies"],
                      ["Bars", "represent each category's value; same width, with gaps between bars"],
                      ["Title", "explains the content of the chart"],
                    ] : [
                      ["X軸（横軸）", "カテゴリまたはデータラベル"],
                      ["Y軸（縦軸）", "値または度数"],
                      ["棒", "各カテゴリの値を表す；同じ幅、棒の間に隙間あり"],
                      ["タイトル", "グラフの内容を説明する"],
                    ]).map(([name, desc]) => (
                      <div key={name} className="flex gap-3 items-start">
                        <span className="text-blue-400 shrink-0">▸</span>
                        <p className="text-white/80"><strong className="text-blue-300">{name}</strong> → {desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ===== DIAGRAM BATANG INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-blue-500/30 rounded-xl overflow-hidden">
                  <div className="bg-blue-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-blue-200">{t.barTitle}</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">{t.barDesc}</p>

                    <div className="rounded-lg overflow-hidden border border-slate-600/50">
                      <div className="grid bg-blue-950/60" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                        <div className="px-3 py-2 font-body text-xs font-bold text-blue-300 uppercase tracking-wide">{t.barCatHeader}</div>
                        <div className="px-3 py-2 font-body text-xs font-bold text-blue-300 uppercase tracking-wide">{t.barValHeader}</div>
                        <div />
                      </div>
                      <div className="divide-y divide-slate-700/40">
                        {tableRows.map((row) => (
                          <div key={row.id} className="grid items-center gap-2 px-2 py-1.5 bg-slate-900/30" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) => updateRow(row.id, "label", e.target.value)}
                              placeholder={t.barPlaceholder}
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

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={addRow}
                        disabled={tableRows.length >= 10}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-500/40 text-white/75 text-xs font-body font-semibold hover:bg-slate-600/60 hover:border-slate-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                      >
                        {t.barAddRow}
                        {tableRows.length >= 10 && <span className="text-white/30">{t.barMaxNote}</span>}
                      </button>

                      <button
                        onClick={convertToChart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 border border-blue-500/50 text-white text-xs font-body font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        {t.barBuildBtn}
                      </button>

                      {chartVisible && (
                        <button
                          onClick={resetChart}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >{t.barReset}</button>
                      )}
                    </div>

                    {chartVisible && chartData.length > 0 && (() => {
                      const maxVal = Math.max(...chartData.map(d => d.value), 1);
                      const total  = chartData.reduce((s, d) => s + d.value, 0);
                      const biggest = chartData.reduce((a, b) => a.value >= b.value ? a : b);
                      const smallest = chartData.reduce((a, b) => a.value <= b.value ? a : b);
                      const ySteps = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];
                      return (
                        <div className="bg-slate-900/60 border border-blue-500/20 rounded-xl p-4 space-y-3">
                          <p className="font-body text-xs font-bold text-blue-300 text-center uppercase tracking-wider">{t.barResultTitle}</p>

                          <div className="relative" style={{ height: "200px" }}>
                            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between" style={{ width: "30px" }}>
                              {ySteps.map((v) => (
                                <span key={v} className="font-body text-white/35 text-right pr-1 leading-none" style={{ fontSize: "9px" }}>{v}</span>
                              ))}
                            </div>
                            <div className="absolute top-0 bottom-6 right-0" style={{ left: "32px" }}>
                              {[0, 0.25, 0.5, 0.75, 1].map((r) => (
                                <div key={r} className="absolute w-full border-t border-slate-700/40" style={{ top: `${r * 100}%` }} />
                              ))}
                            </div>
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
                            <div className="absolute bottom-0 right-0 flex" style={{ left: "34px", height: "22px" }}>
                              {chartData.map((item, idx) => (
                                <div key={`lbl-${idx}`} className="flex-1 flex items-end justify-center pb-0.5">
                                  <span className="font-body text-white/50 text-center leading-tight" style={{ fontSize: "9px" }}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>

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

                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <div className="bg-blue-900/25 border border-blue-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.barBiggest}</p>
                              <p className="font-body text-blue-300 font-bold text-sm mt-0.5">{biggest.value}</p>
                              <p className="font-body text-white/40 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{biggest.label}</p>
                            </div>
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.barTotal}</p>
                              <p className="font-body text-green-300 font-bold text-sm mt-0.5">{total}</p>
                              <p className="font-body text-white/40 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{t.barDataCount(chartData.length)}</p>
                            </div>
                            <div className="bg-orange-900/25 border border-orange-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.barSmallest}</p>
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
                  {language === "id" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Tips:</strong> Diagram batang paling tepat dipakai untuk membandingkan nilai antar kategori. Gunakan warna berbeda untuk setiap batang agar lebih mudah dibaca!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Tips:</strong> A bar chart is best for comparing values across categories. Use different colours for each bar to make it easier to read!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>ヒント：</strong>棒グラフはカテゴリ間の値を比較するのに最適です。各棒に異なる色を使うと読みやすくなります！
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title={st.contoh2} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                    <span className="font-body font-semibold text-white">{t.example(1)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dari diagram batang berikut, diketahui jumlah pengunjung perpustakaan selama 5 hari: Senin 40, Selasa 55, Rabu 30, Kamis 60, Jumat 45.<br />
                        Tentukan: (a) Hari dengan pengunjung terbanyak, (b) Total pengunjung seluruhnya.
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        The bar chart shows library visitors over 5 days: Mon 40, Tue 55, Wed 30, Thu 60, Fri 45.<br />
                        Determine: (a) The day with the most visitors, (b) Total visitors overall.
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        棒グラフから、5日間の図書館来館者数がわかります：月 40、火 55、水 30、木 60、金 45。<br />
                        次を求めなさい：(a) 来館者が最も多い曜日、(b) 来館者の合計。
                      </p>
                    )}
                  </div>
                  <div className="bg-slate-900/70 border border-green-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3 text-center">
                      {language === "id" ? "📊 Diagram Batang — Pengunjung Perpustakaan"
                        : language === "en" ? "📊 Bar Chart — Library Visitors"
                        : "📊 棒グラフ — 図書館来館者数"}
                    </p>
                    <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto block" aria-label="bar chart library visitors">
                      {[0,20,40,60].map((v) => {
                        const y = 160 - (v/60)*150;
                        return (
                          <g key={v}>
                            <line x1="50" y1={y} x2="340" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
                            <text x="44" y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                          </g>
                        );
                      })}
                      <text x="12" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,12,90)">
                        {language === "id" ? "Pengunjung" : language === "en" ? "Visitors" : "来館者"}
                      </text>
                      <line x1="50" y1="10" x2="50" y2="160" stroke="#475569" strokeWidth="1.5" />
                      <line x1="50" y1="160" x2="340" y2="160" stroke="#475569" strokeWidth="1.5" />
                      {(language === "id"
                        ? [{ label:"Senin", val:40, x:63 }, { label:"Selasa", val:55, x:117 }, { label:"Rabu", val:30, x:171 }, { label:"Kamis", val:60, x:225 }, { label:"Jumat", val:45, x:279 }]
                        : language === "en"
                        ? [{ label:"Mon", val:40, x:63 }, { label:"Tue", val:55, x:117 }, { label:"Wed", val:30, x:171 }, { label:"Thu", val:60, x:225 }, { label:"Fri", val:45, x:279 }]
                        : [{ label:"月", val:40, x:63 }, { label:"火", val:55, x:117 }, { label:"水", val:30, x:171 }, { label:"木", val:60, x:225 }, { label:"金", val:45, x:279 }]
                      ).map(({ label, val, x }) => {
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
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong>(a)</strong> Batang tertinggi → <span className="text-green-400 font-semibold">Kamis (60 pengunjung)</span></p>
                          <p><strong>(b)</strong> Total pengunjung:</p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p>40 + 55 + 30 + 60 + 45 = <strong className="text-cyan-300">230</strong> {language === "id" ? "pengunjung" : "visitors"}</p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong>(a)</strong> Tallest bar → <span className="text-green-400 font-semibold">Thursday (60 visitors)</span></p>
                          <p><strong>(b)</strong> Total visitors:</p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p>40 + 55 + 30 + 60 + 45 = <strong className="text-cyan-300">230</strong> visitors</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>(a)</strong> 最も高い棒 → <span className="text-green-400 font-semibold">木曜日（60人）</span></p>
                          <p><strong>(b)</strong> 来館者合計：</p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p>40 + 55 + 30 + 60 + 45 = <strong className="text-cyan-300">230</strong>人</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                    <span className="font-body font-semibold text-white">{t.example(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Data penjualan buku di {t.storeLabel} dalam 4 bulan: Jan = 120, Feb = 95, Mar = 145, Apr = 110. Jika target penjualan per bulan adalah 115 buku, tentukan pada bulan mana target terpenuhi dan berapa buku di atas/bawah target?
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        Book sales at {t.storeLabel} over 4 months: Jan = 120, Feb = 95, Mar = 145, Apr = 110. If the monthly sales target is 115 books, determine which months met the target and by how many books above/below?
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        {t.storeLabel}の4ヶ月間の本の販売数：1月 = 120、2月 = 95、3月 = 145、4月 = 110。月間目標販売数が115冊の場合、どの月に目標を達成し、何冊上回った/下回ったか求めなさい。
                      </p>
                    )}
                  </div>
                  <div className="bg-slate-900/70 border border-yellow-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3 text-center">
                      {language === "id" ? "📊 Diagram Batang — Penjualan Buku + Garis Target"
                        : language === "en" ? "📊 Bar Chart — Book Sales + Target Line"
                        : "📊 棒グラフ — 本の販売数 + 目標線"}
                    </p>
                    <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto block" aria-label="bar chart book sales">
                      {[0,50,100,150].map((v) => {
                        const y = 160 - (v/160)*150;
                        return (
                          <g key={v}>
                            <line x1="50" y1={y} x2="300" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
                            <text x="44" y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                          </g>
                        );
                      })}
                      <text x="12" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,12,90)">
                        {language === "id" ? "Buku" : language === "en" ? "Books" : "冊"}
                      </text>
                      <line x1="50" y1="10" x2="50" y2="160" stroke="#475569" strokeWidth="1.5" />
                      <line x1="50" y1="160" x2="300" y2="160" stroke="#475569" strokeWidth="1.5" />
                      {[
                        { label: language === "id" ? "Jan" : language === "en" ? "Jan" : "1月", val:120, x:65 },
                        { label: language === "id" ? "Feb" : language === "en" ? "Feb" : "2月", val:95, x:125 },
                        { label: language === "id" ? "Mar" : language === "en" ? "Mar" : "3月", val:145, x:185 },
                        { label: language === "id" ? "Apr" : language === "en" ? "Apr" : "4月", val:110, x:245 },
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
                      {(() => {
                        const ty = 160 - (115/160)*150;
                        return (
                          <g>
                            <line x1="50" y1={ty} x2="300" y2={ty} stroke="#f87171" strokeWidth="1.5" strokeDasharray="6 3" />
                            <text x="303" y={ty+4} fontSize="9" fill="#f87171" fontWeight="bold">115</text>
                            <text x="175" y={ty-5} textAnchor="middle" fontSize="8" fill="#f87171">
                              {language === "id" ? "Target" : language === "en" ? "Target" : "目標"}
                            </text>
                          </g>
                        );
                      })()}
                      <rect x="60" y="185" width="10" height="8" rx="2" fill="#eab308" />
                      <text x="74" y="193" fontSize="8" fill="#94a3b8">
                        {language === "id" ? "Target terpenuhi" : language === "en" ? "Target met" : "目標達成"}
                      </text>
                      <rect x="170" y="185" width="10" height="8" rx="2" fill="#b45309" opacity="0.65" />
                      <text x="184" y="193" fontSize="8" fill="#94a3b8">
                        {language === "id" ? "Di bawah target" : language === "en" ? "Below target" : "目標未達"}
                      </text>
                    </svg>
                    <p className="font-body text-xs text-slate-500 text-center mt-1">
                      {language === "id" ? "Garis merah = target 115 buku/bulan"
                        : language === "en" ? "Red line = target 115 books/month"
                        : "赤線 = 目標115冊/月"}
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        {language === "id" ? (
                          <>
                            <p>Jan: 120 &gt; 115 → <span className="text-green-400">✓ Terpenuhi</span>, surplus <InlineMath math="120-115 = 5" /> buku</p>
                            <p>Feb: 95 &lt; 115 → <span className="text-red-400">✗ Tidak terpenuhi</span>, kurang <InlineMath math="115-95 = 20" /> buku</p>
                            <p>Mar: 145 &gt; 115 → <span className="text-green-400">✓ Terpenuhi</span>, surplus <InlineMath math="145-115 = 30" /> buku</p>
                            <p>Apr: 110 &lt; 115 → <span className="text-red-400">✗ Tidak terpenuhi</span>, kurang <InlineMath math="115-110 = 5" /> buku</p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p>Jan: 120 &gt; 115 → <span className="text-green-400">✓ Target met</span>, surplus <InlineMath math="120-115 = 5" /> books</p>
                            <p>Feb: 95 &lt; 115 → <span className="text-red-400">✗ Below target</span>, short <InlineMath math="115-95 = 20" /> books</p>
                            <p>Mar: 145 &gt; 115 → <span className="text-green-400">✓ Target met</span>, surplus <InlineMath math="145-115 = 30" /> books</p>
                            <p>Apr: 110 &lt; 115 → <span className="text-red-400">✗ Below target</span>, short <InlineMath math="115-110 = 5" /> books</p>
                          </>
                        ) : (
                          <>
                            <p>1月：120 &gt; 115 → <span className="text-green-400">✓ 目標達成</span>、余剰 <InlineMath math="120-115 = 5" />冊</p>
                            <p>2月：95 &lt; 115 → <span className="text-red-400">✗ 目標未達</span>、不足 <InlineMath math="115-95 = 20" />冊</p>
                            <p>3月：145 &gt; 115 → <span className="text-green-400">✓ 目標達成</span>、余剰 <InlineMath math="145-115 = 30" />冊</p>
                            <p>4月：110 &lt; 115 → <span className="text-red-400">✗ 目標未達</span>、不足 <InlineMath math="115-110 = 5" />冊</p>
                          </>
                        )}
                      </div>
                      <p><strong className="text-primary">
                        {language === "id" ? "Target terpenuhi di bulan Januari dan Maret."
                          : language === "en" ? "Target met in January and March."
                          : "目標を達成したのは1月と3月です。"}
                      </strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                    <span className="font-body font-semibold text-white">{t.example(3)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dari diagram batang ganda, diketahui nilai ulangan siswa Kelas A dan B per mata pelajaran:<br />
                        Matematika: A=78, B=82 | IPA: A=85, B=79 | Bhs.Indo: A=88, B=90 | IPS: A=75, B=74<br />
                        Pada mata pelajaran apa saja Kelas A lebih unggul dibanding Kelas B?
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        A double bar chart shows quiz scores for Class A and Class B by subject:<br />
                        {subjectLabels.mat}: A=78, B=82 | {subjectLabels.ipa}: A=85, B=79 | {subjectLabels.bhs}: A=88, B=90 | {subjectLabels.ips}: A=75, B=74<br />
                        In which subjects did Class A outperform Class B?
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        二重棒グラフから、教科ごとのクラスAとBの小テスト点数がわかります：<br />
                        {subjectLabels.mat}：A=78, B=82 | {subjectLabels.ipa}：A=85, B=79 | {subjectLabels.bhs}：A=88, B=90 | {subjectLabels.ips}：A=75, B=74<br />
                        クラスAがクラスBより優れていた教科はどれですか？
                      </p>
                    )}
                  </div>
                  <div className="bg-slate-900/70 border border-red-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3 text-center">
                      {language === "id" ? "📊 Diagram Batang Ganda — Nilai Kelas A vs B"
                        : language === "en" ? "📊 Double Bar Chart — Class A vs B Scores"
                        : "📊 二重棒グラフ — クラスA vs Bの点数"}
                    </p>
                    <svg viewBox="0 0 380 215" className="w-full max-w-md mx-auto block" aria-label="double bar chart class A vs B">
                      {[60,70,80,90,100].map((v) => {
                        const y = 160 - ((v-60)/40)*150;
                        return (
                          <g key={v}>
                            <line x1="54" y1={y} x2="355" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
                            <text x="48" y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
                          </g>
                        );
                      })}
                      <text x="12" y="90" textAnchor="middle" fontSize="9" fill="#64748b" transform="rotate(-90,12,90)">
                        {language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}
                      </text>
                      <line x1="54" y1="10" x2="54" y2="160" stroke="#475569" strokeWidth="1.5" />
                      <line x1="54" y1="160" x2="355" y2="160" stroke="#475569" strokeWidth="1.5" />
                      {[
                        { label: subjectLabels.mat, a:78, b:82, gx:64 },
                        { label: subjectLabels.ipa, a:85, b:79, gx:145 },
                        { label: subjectLabels.bhs, a:88, b:90, gx:226 },
                        { label: subjectLabels.ips, a:75, b:74, gx:307 },
                      ].map(({ label, a, b, gx }) => {
                        const hA = ((a-60)/40)*150;
                        const hB = ((b-60)/40)*150;
                        const yA = 160 - hA;
                        const yB = 160 - hB;
                        const aWins = a > b;
                        return (
                          <g key={label}>
                            <rect x={gx} y={yA} width="26" height={hA} rx="3" fill="#22d3ee" opacity={aWins ? 1 : 0.55} />
                            <text x={gx+13} y={yA-4} textAnchor="middle" fontSize="8" fill="#67e8f9" fontWeight="bold">{a}</text>
                            <rect x={gx+29} y={yB} width="26" height={hB} rx="3" fill="#fb923c" opacity={!aWins ? 1 : 0.55} />
                            <text x={gx+42} y={yB-4} textAnchor="middle" fontSize="8" fill="#fdba74" fontWeight="bold">{b}</text>
                            <text x={gx+27} y="174" textAnchor="middle" fontSize="8" fill="#94a3b8">{label}</text>
                          </g>
                        );
                      })}
                      <rect x="80" y="188" width="12" height="9" rx="2" fill="#22d3ee" />
                      <text x="96" y="197" fontSize="9" fill="#94a3b8">{language === "id" ? "Kelas A" : language === "en" ? "Class A" : "クラスA"}</text>
                      <rect x="160" y="188" width="12" height="9" rx="2" fill="#fb923c" />
                      <text x="176" y="197" fontSize="9" fill="#94a3b8">{language === "id" ? "Kelas B" : language === "en" ? "Class B" : "クラスB"}</text>
                      <text x="240" y="197" fontSize="8" fill="#64748b">
                        {language === "id" ? "Warna terang = unggul" : language === "en" ? "Brighter = higher" : "明るい色 = 優勢"}
                      </text>
                    </svg>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        {language === "id" ? (
                          <>
                            <p>Matematika: A=78 vs B=82 → <span className="text-red-400">B unggul</span></p>
                            <p>IPA: A=85 vs B=79 → <span className="text-cyan-400">A unggul (+6)</span></p>
                            <p>Bhs.Indo: A=88 vs B=90 → <span className="text-red-400">B unggul</span></p>
                            <p>IPS: A=75 vs B=74 → <span className="text-cyan-400">A unggul (+1)</span></p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p>{subjectLabels.mat}: A=78 vs B=82 → <span className="text-red-400">B higher</span></p>
                            <p>{subjectLabels.ipa}: A=85 vs B=79 → <span className="text-cyan-400">A higher (+6)</span></p>
                            <p>{subjectLabels.bhs}: A=88 vs B=90 → <span className="text-red-400">B higher</span></p>
                            <p>{subjectLabels.ips}: A=75 vs B=74 → <span className="text-cyan-400">A higher (+1)</span></p>
                          </>
                        ) : (
                          <>
                            <p>{subjectLabels.mat}：A=78 vs B=82 → <span className="text-red-400">Bが優勢</span></p>
                            <p>{subjectLabels.ipa}：A=85 vs B=79 → <span className="text-cyan-400">Aが優勢（+6）</span></p>
                            <p>{subjectLabels.bhs}：A=88 vs B=90 → <span className="text-red-400">Bが優勢</span></p>
                            <p>{subjectLabels.ips}：A=75 vs B=74 → <span className="text-cyan-400">Aが優勢（+1）</span></p>
                          </>
                        )}
                      </div>
                      <p><strong className="text-primary">
                        {language === "id" ? `Kelas A lebih unggul pada mata pelajaran ${subjectLabels.ipa} dan ${subjectLabels.ips}.`
                          : language === "en" ? `Class A outperformed Class B in ${subjectLabels.ipa} and ${subjectLabels.ips}.`
                          : `クラスAは${subjectLabels.ipa}と${subjectLabels.ips}でクラスBより優れていました。`}
                      </strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 3: DIAGRAM GARIS ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={st.konsep3} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">
                    {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                  </p>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-purple-300">Diagram garis</strong> menghubungkan titik-titik data dengan garis lurus. Sangat efektif untuk menggambarkan <strong className="text-purple-300">perubahan data dari waktu ke waktu</strong> (tren).
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      A <strong className="text-purple-300">line chart</strong> connects data points with straight lines. Very effective for showing <strong className="text-purple-300">changes in data over time</strong> (trends).
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-purple-300">折れ線グラフ</strong>は直線でデータの点を結びます。<strong className="text-purple-300">時間の経過に伴うデータの変化</strong>（傾向）を表すのに非常に効果的です。
                    </p>
                  )}
                </div>

                {/* Visual Diagram Garis */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl overflow-hidden">
                  <div className="bg-purple-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-purple-200 uppercase tracking-wide">
                      {language === "id" ? "📈 Contoh: Perkembangan Nilai Ulangan Bulanan"
                        : language === "en" ? "📈 Example: Monthly Quiz Score Progress"
                        : "📈 例：月別小テスト点数の推移"}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="relative h-40 flex items-end px-2 pb-6">
                      <div className="absolute left-7 right-2 top-2 bottom-6">
                        {[0,1,2,3,4].map(i => (
                          <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${(i/4)*100}%` }} />
                        ))}
                      </div>
                      <div className="absolute left-0 top-2 bottom-6 flex flex-col justify-between">
                        {["100","80","60","40","20"].map(v => (
                          <span key={v} className="text-white/30 text-xs">{v}</span>
                        ))}
                      </div>
                      <svg className="absolute left-7 right-2 top-2 bottom-6 w-[calc(100%-2.25rem)] h-[calc(100%-2rem)]" viewBox="0 0 300 120" preserveAspectRatio="none">
                        <polyline
                          points="0,84 60,60 120,48 180,36 240,24 300,12"
                          fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round"
                        />
                        {[[0,84],[60,60],[120,48],[180,36],[240,24],[300,12]].map(([x,y], i) => (
                          <circle key={i} cx={x} cy={y} r="5" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
                        ))}
                      </svg>
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
                  <p className="font-body text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                    {language === "id" ? "📌 Cara Membaca Diagram Garis" : language === "en" ? "📌 How to Read a Line Chart" : "📌 折れ線グラフの読み方"}
                  </p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
                        <p>• <strong className="text-purple-300">Garis naik</strong> → data meningkat</p>
                        <p>• <strong className="text-purple-300">Garis turun</strong> → data menurun</p>
                        <p>• <strong className="text-purple-300">Garis datar</strong> → data stabil/tetap</p>
                        <p>• Semakin curam garis → semakin besar perubahannya</p>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p>• <strong className="text-purple-300">Rising line</strong> → data is increasing</p>
                        <p>• <strong className="text-purple-300">Falling line</strong> → data is decreasing</p>
                        <p>• <strong className="text-purple-300">Flat line</strong> → data is stable/constant</p>
                        <p>• Steeper slope → greater change</p>
                      </>
                    ) : (
                      <>
                        <p>• <strong className="text-purple-300">上昇線</strong> → データが増加している</p>
                        <p>• <strong className="text-purple-300">下降線</strong> → データが減少している</p>
                        <p>• <strong className="text-purple-300">水平線</strong> → データが安定/一定</p>
                        <p>• 傾きが急なほど → 変化が大きい</p>
                      </>
                    )}
                  </div>
                </div>

                {/* ===== DIAGRAM GARIS INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-purple-500/30 rounded-xl overflow-hidden">
                  <div className="bg-purple-900/50 px-4 py-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-purple-200">{t.lineTitle}</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">{t.lineDesc}</p>

                    <div className="rounded-lg overflow-hidden border border-slate-600/50">
                      <div className="grid bg-purple-950/60" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                        <div className="px-3 py-2 font-body text-xs font-bold text-purple-300 uppercase tracking-wide">{t.lineLabelHeader}</div>
                        <div className="px-3 py-2 font-body text-xs font-bold text-purple-300 uppercase tracking-wide">{t.lineValHeader}</div>
                        <div />
                      </div>
                      <div className="divide-y divide-slate-700/40">
                        {lineRows.map((row) => (
                          <div key={row.id} className="grid items-center gap-2 px-2 py-1.5 bg-slate-900/30" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) => updateLineRow(row.id, "label", e.target.value)}
                              placeholder={t.linePlaceholder}
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

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={addLineRow}
                        disabled={lineRows.length >= 12}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-500/40 text-white/75 text-xs font-body font-semibold hover:bg-slate-600/60 hover:border-slate-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                      >
                        {t.lineAddRow}
                        {lineRows.length >= 12 && <span className="text-white/30">{t.lineMaxNote}</span>}
                      </button>

                      <button
                        onClick={convertToLineChart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 border border-purple-500/50 text-white text-xs font-body font-bold hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        {t.lineBuildBtn}
                      </button>

                      {lineChartVisible && (
                        <button
                          onClick={resetLineChart}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >{t.lineReset}</button>
                      )}
                    </div>

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
                      const trendLabel = trendDiff > 0 ? t.lineTrendUp(trendDiff) : trendDiff < 0 ? t.lineTrendDown(trendDiff) : t.lineTrendFlat;
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
                          <p className="font-body text-xs font-bold text-purple-300 text-center uppercase tracking-wider">{t.lineResultTitle}</p>

                          <div className="w-full overflow-x-auto">
                            <svg
                              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                              className="w-full"
                              style={{ minWidth: "260px", maxHeight: "200px" }}
                            >
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

                              <polygon
                                points={areaPoints}
                                fill="rgba(168,85,247,0.07)"
                                style={{
                                  opacity: lineChartAnimated ? 1 : 0,
                                  transition: "opacity 0.7s ease 1.0s",
                                }}
                              />

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

                          <div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                            style={{
                              opacity: lineChartAnimated ? 1 : 0,
                              transition: "opacity 0.5s ease 1.3s",
                            }}
                          >
                            <div className="bg-purple-900/25 border border-purple-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.lineTrend}</p>
                              <p className={`font-body font-bold text-xs mt-0.5 ${trendColor}`}>{trendLabel}</p>
                            </div>
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.lineHighest}</p>
                              <p className="font-body text-green-300 font-bold text-sm mt-0.5">{maxPoint.value}</p>
                              <p className="font-body text-white/35 leading-tight mt-0.5" style={{ fontSize: "9px" }}>{maxPoint.label}</p>
                            </div>
                            <div className="bg-blue-900/25 border border-blue-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.lineAvg}</p>
                              <p className="font-body text-blue-300 font-bold text-sm mt-0.5">{avg}</p>
                            </div>
                            <div className="bg-orange-900/25 border border-orange-500/20 rounded-lg p-2 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.lineLowest}</p>
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
                  {language === "id" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Tips:</strong> Diagram garis ideal untuk data berurutan waktu. Kalau mau membandingkan dua kelompok, gunakan dua garis dengan warna berbeda dalam satu diagram.
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Tips:</strong> Line charts are ideal for time-series data. To compare two groups, use two lines with different colours in one chart.
                    </p>
                  ) : (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>ヒント：</strong>折れ線グラフは時系列データに最適です。2つのグループを比較する場合は、1つのグラフに異なる色の2本の線を使いましょう。
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title={st.contoh3} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                    <span className="font-body font-semibold text-white">{t.example(1)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Suhu udara di suatu kota selama 6 jam dicatat: 06.00 = 22°C, 08.00 = 25°C, 10.00 = 28°C, 12.00 = 32°C, 14.00 = 30°C, 16.00 = 27°C.<br />
                        Pada jam berapa suhu tertinggi terjadi, dan bagaimana trennya setelah itu?
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        Air temperature in a city over 6 hours: 06:00 = 22°C, 08:00 = 25°C, 10:00 = 28°C, 12:00 = 32°C, 14:00 = 30°C, 16:00 = 27°C.<br />
                        At what time did the highest temperature occur, and what is the trend after that?
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        ある都市の6時間の気温：06:00 = 22°C、08:00 = 25°C、10:00 = 28°C、12:00 = 32°C、14:00 = 30°C、16:00 = 27°C。<br />
                        最高気温はいつ、その後の傾向はどうなっているか？
                      </p>
                    )}
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p>• Suhu tertinggi: <span className="text-red-400 font-semibold">32°C pada pukul 12.00</span></p>
                          <p>• Tren 06.00–12.00 → <span className="text-green-400">naik terus (garis naik)</span></p>
                          <p>• Tren 12.00–16.00 → <span className="text-blue-400">turun (garis turun)</span></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-green-300">Setelah pukul 12.00, suhu menurun menuju sore hari.</p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p>• Highest temperature: <span className="text-red-400 font-semibold">32°C at 12:00</span></p>
                          <p>• Trend 06:00–12:00 → <span className="text-green-400">continuously rising</span></p>
                          <p>• Trend 12:00–16:00 → <span className="text-blue-400">falling (line goes down)</span></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-green-300">After 12:00, temperature decreases toward the afternoon.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>• 最高気温：<span className="text-red-400 font-semibold">12:00に32°C</span></p>
                          <p>• 06:00〜12:00の傾向 → <span className="text-green-400">継続上昇</span></p>
                          <p>• 12:00〜16:00の傾向 → <span className="text-blue-400">下降（線が下がる）</span></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-green-300">12:00以降、午後に向けて気温が低下します。</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                    <span className="font-body font-semibold text-white">{t.example(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Penjualan minuman A (ml × 1000): Jan=80, Feb=95, Mar=90, Apr=110, Mei=105, Jun=120.<br />
                        Tentukan bulan dengan penjualan tertinggi dan terendah, serta identifikasi tren perubahan penjualan!
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        Drink A sales (ml × 1,000): Jan=80, Feb=95, Mar=90, Apr=110, May=105, Jun=120.<br />
                        Identify the months with the highest and lowest sales, and describe the sales trend!
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        飲料Aの販売量（ml × 1,000）：1月=80、2月=95、3月=90、4月=110、5月=105、6月=120。<br />
                        最高・最低販売月を特定し、販売傾向を説明しなさい！
                      </p>
                    )}
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p>• Penjualan <span className="text-green-400 font-semibold">tertinggi</span> → Juni (120 × 1000 ml)</p>
                          <p>• Penjualan <span className="text-red-400 font-semibold">terendah</span> → Januari (80 × 1000 ml)</p>
                          <p>• Tren umum: <span className="text-yellow-400">meningkat</span> dari Januari ke Juni</p>
                          <p><strong className="text-primary">Penjualan tertinggi di bulan Juni, terendah di Januari, tren meningkat secara keseluruhan.</strong></p>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p>• <span className="text-green-400 font-semibold">Highest</span> sales → June (120 × 1,000 ml)</p>
                          <p>• <span className="text-red-400 font-semibold">Lowest</span> sales → January (80 × 1,000 ml)</p>
                          <p>• Overall trend: <span className="text-yellow-400">increasing</span> from January to June</p>
                          <p><strong className="text-primary">Highest sales in June, lowest in January, overall upward trend.</strong></p>
                        </>
                      ) : (
                        <>
                          <p>• <span className="text-green-400 font-semibold">最高</span>販売 → 6月（120 × 1,000 ml）</p>
                          <p>• <span className="text-red-400 font-semibold">最低</span>販売 → 1月（80 × 1,000 ml）</p>
                          <p>• 全体的な傾向：1月から6月にかけて<span className="text-yellow-400">増加</span></p>
                          <p><strong className="text-primary">最高販売は6月、最低は1月、全体的に上昇傾向。</strong></p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                    <span className="font-body font-semibold text-white">{t.example(3)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dua produk, X dan Y, memiliki data penjualan (unit) per kuartal:<br />
                        Q1: X=200, Y=150 | Q2: X=220, Y=180 | Q3: X=210, Y=220 | Q4: X=240, Y=260<br />
                        (a) Pada kuartal berapa Y mulai melampaui X? (b) Hitung selisih total penjualan X dan Y selama setahun!
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        Two products, X and Y, have quarterly sales data (units):<br />
                        Q1: X=200, Y=150 | Q2: X=220, Y=180 | Q3: X=210, Y=220 | Q4: X=240, Y=260<br />
                        (a) In which quarter did Y first surpass X? (b) Calculate the difference in total annual sales between X and Y!
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        2つの製品XとYの四半期別販売データ（個）：<br />
                        Q1：X=200, Y=150 | Q2：X=220, Y=180 | Q3：X=210, Y=220 | Q4：X=240, Y=260<br />
                        (a) YがXを初めて超えたのはどの四半期か？(b) XとYの年間販売合計の差を計算しなさい！
                      </p>
                    )}
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>(a)</strong>{" "}
                        {language === "id" ? "Bandingkan X vs Y per kuartal:"
                          : language === "en" ? "Compare X vs Y per quarter:"
                          : "四半期ごとにXとYを比較："}
                      </p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        {language === "id" ? (
                          <>
                            <p>Q1: X=200 &gt; Y=150 → X unggul</p>
                            <p>Q2: X=220 &gt; Y=180 → X unggul</p>
                            <p>Q3: X=210 &lt; Y=220 → <span className="text-red-400">Y mulai unggul!</span></p>
                            <p>Q4: X=240 &lt; Y=260 → Y tetap unggul</p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p>Q1: X=200 &gt; Y=150 → X leads</p>
                            <p>Q2: X=220 &gt; Y=180 → X leads</p>
                            <p>Q3: X=210 &lt; Y=220 → <span className="text-red-400">Y takes the lead!</span></p>
                            <p>Q4: X=240 &lt; Y=260 → Y still leads</p>
                          </>
                        ) : (
                          <>
                            <p>Q1：X=200 &gt; Y=150 → Xが優勢</p>
                            <p>Q2：X=220 &gt; Y=180 → Xが優勢</p>
                            <p>Q3：X=210 &lt; Y=220 → <span className="text-red-400">Yが逆転！</span></p>
                            <p>Q4：X=240 &lt; Y=260 → Yが引き続き優勢</p>
                          </>
                        )}
                      </div>
                      <p>→ {language === "id" ? "Y mulai melampaui X pada" : language === "en" ? "Y first surpassed X in" : "YがXを初めて超えたのは"} <strong className="text-red-300">{language === "id" ? "Kuartal 3 (Q3)" : language === "en" ? "Quarter 3 (Q3)" : "第3四半期（Q3）"}</strong></p>
                      <p><strong>(b)</strong>{" "}
                        {language === "id" ? "Total penjualan:" : language === "en" ? "Total sales:" : "販売合計："}
                      </p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p>{language === "id" ? "Total X" : language === "en" ? "Total X" : "X合計"} = 200+220+210+240 = <strong className="text-cyan-300">870</strong> {language === "id" ? "unit" : language === "en" ? "units" : "個"}</p>
                        <p>{language === "id" ? "Total Y" : language === "en" ? "Total Y" : "Y合計"} = 150+180+220+260 = <strong className="text-orange-300">810</strong> {language === "id" ? "unit" : language === "en" ? "units" : "個"}</p>
                        <p>{language === "id" ? "Selisih" : language === "en" ? "Difference" : "差"} = 870 - 810 = <strong className="text-primary">60</strong> {language === "id" ? "unit" : language === "en" ? "units" : "個"}</p>
                      </div>
                      <p><strong className="text-primary">
                        {language === "id" ? "Y unggul mulai Q3; total X lebih banyak 60 unit dari Y."
                          : language === "en" ? "Y surpassed X from Q3; total X exceeded Y by 60 units."
                          : "YはQ3からXを超えた；XはYより合計60個多い。"}
                      </strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 4: DIAGRAM LINGKARAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title={st.konsep4} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">
                    {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                  </p>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-orange-300">Diagram lingkaran</strong> membagi lingkaran menjadi sektor-sektor yang menggambarkan proporsi tiap data terhadap keseluruhan. Ideal untuk menunjukkan <strong className="text-orange-300">persentase atau bagian dari total</strong>.
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      A <strong className="text-orange-300">pie chart</strong> divides a circle into sectors representing each data category's proportion of the whole. Ideal for showing <strong className="text-orange-300">percentages or parts of a total</strong>.
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-orange-300">円グラフ</strong>は、円を各データカテゴリの全体に対する割合を表すセクターに分割します。<strong className="text-orange-300">割合やパーセンテージ</strong>を示すのに最適です。
                    </p>
                  )}
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-orange-300 mb-2">
                      {language === "id" ? "Rumus Konversi:" : language === "en" ? "Conversion Formulas:" : "変換公式："}
                    </p>
                    <p className="font-body text-xs text-white/70 mb-2">
                      {language === "id" ? "Sudut sektor:" : language === "en" ? "Sector angle:" : "扇形の角度："}
                    </p>
                    <BlockMath math="\theta = \frac{f_i}{\sum f} \times 360°" />
                    <p className="font-body text-xs text-white/70 mb-2 mt-1">
                      {language === "id" ? "Persentase:" : language === "en" ? "Percentage:" : "パーセント："}
                    </p>
                    <BlockMath math="p = \frac{f_i}{\sum f} \times 100\%" />
                    <p className="font-body text-xs text-white/60 mt-2">
                      {language === "id" ? "Di mana " : language === "en" ? "Where " : "ここで"}<InlineMath math="f_i" />{" "}
                      {language === "id" ? "= frekuensi kategori ke-" : language === "en" ? "= frequency of category " : "= カテゴリ"}<InlineMath math="i" />{language === "ja" ? "の度数" : ""}{language === "id" ? ", " : language === "en" ? ", " : "、"}<InlineMath math="\sum f" />{" "}
                      {language === "id" ? "= total frekuensi" : language === "en" ? "= total frequency" : "= 度数の合計"}
                    </p>
                  </div>
                </div>

                {/* Visual Diagram Lingkaran */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl overflow-hidden">
                  <div className="bg-orange-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-orange-200 uppercase tracking-wide">
                      {language === "id" ? `🥧 Contoh: Jenis Transportasi yang Digunakan Siswa`
                        : language === "en" ? `🥧 Example: Modes of Transport Used by Students`
                        : `🥧 例：生徒が利用する交通手段`}
                    </p>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row items-center gap-6">
                    <svg viewBox="0 0 200 200" className="w-44 h-44 shrink-0">
                      <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#f97316" opacity="0.85" />
                      <path d="M100,100 L190,100 A90,90 0 0,1 127.8,190 Z" fill="#a855f7" opacity="0.85" />
                      <path d="M100,100 L127.8,190 A90,90 0 0,1 10,127.8 Z" fill="#22d3ee" opacity="0.85" />
                      <path d="M100,100 L10,127.8 A90,90 0 0,1 10,72.2 Z" fill="#4ade80" opacity="0.85" />
                      <path d="M100,100 L10,72.2 A90,90 0 0,1 100,10 Z" fill="#f43f5e" opacity="0.85" />
                      <circle cx="100" cy="100" r="35" fill="#1e293b" />
                      <text x="100" y="95" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold">
                        {language === "id" ? "DATA" : language === "en" ? "DATA" : "データ"}
                      </text>
                      <text x="100" y="110" textAnchor="middle" fill="#94a3b8" fontSize="8">
                        {language === "id" ? "TRANSPORTASI" : language === "en" ? "TRANSPORT" : "交通手段"}
                      </text>
                    </svg>
                    <div className="space-y-2 w-full">
                      {[
                        { label: transportLabels[0], pct: "25%", sudut: "90°", color: "bg-orange-500" },
                        { label: transportLabels[1], pct: "20%", sudut: "72°", color: "bg-purple-500" },
                        { label: transportLabels[2], pct: "30%", sudut: "108°", color: "bg-cyan-400" },
                        { label: transportLabels[3], pct: "15%", sudut: "54°", color: "bg-green-400" },
                        { label: transportLabels[4], pct: "10%", sudut: "36°", color: "bg-rose-500" },
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
                    <p className="font-body text-sm font-bold text-orange-200">{t.pieTitle}</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">{t.pieDesc}</p>

                    <div className="rounded-lg overflow-hidden border border-slate-600/50">
                      <div className="grid bg-orange-950/60" style={{ gridTemplateColumns: "1fr 120px 36px" }}>
                        <div className="px-3 py-2 font-body text-xs font-bold text-orange-300 uppercase tracking-wide">{t.pieCatHeader}</div>
                        <div className="px-3 py-2 font-body text-xs font-bold text-orange-300 uppercase tracking-wide">{t.pieFreqHeader}</div>
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
                                placeholder={t.barPlaceholder}
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

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={addPieRow}
                        disabled={pieRows.length >= 10}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-500/40 text-white/75 text-xs font-body font-semibold hover:bg-slate-600/60 hover:border-slate-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                      >
                        {t.pieAddRow}
                        {pieRows.length >= 10 && <span className="text-white/30">{t.pieMaxNote}</span>}
                      </button>

                      <button
                        onClick={buildPieChart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 border border-orange-500/50 text-white text-xs font-body font-bold hover:bg-orange-500 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        {t.pieBuildBtn}
                      </button>

                      {pieVisible && (
                        <button
                          onClick={resetPie}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >{t.pieReset}</button>
                      )}
                    </div>

                    {pieVisible && pieData.length >= 2 && (() => {
                      const total = pieData.reduce((s, d) => s + d.value, 0);
                      const CX = 100, CY = 100, R = 78, R_INNER = 34;

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

                          <div className="flex items-center justify-between">
                            <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wider">{t.pieResultTitle}</p>
                            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-600/50 rounded-lg p-1">
                              <button
                                onClick={() => setPieMode("persen")}
                                className={`px-3 py-1 rounded-md text-xs font-body font-bold transition-all ${
                                  pieMode === "persen"
                                    ? "bg-orange-500 text-white shadow"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                              >{t.pieTogglePct}</button>
                              <button
                                onClick={() => setPieMode("derajat")}
                                className={`px-3 py-1 rounded-md text-xs font-body font-bold transition-all ${
                                  pieMode === "derajat"
                                    ? "bg-violet-500 text-white shadow"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                              >{t.pieToggleDeg}</button>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-5">

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

                                <circle
                                  cx={CX} cy={CY} r={R_INNER}
                                  fill="#0f172a"
                                  style={{
                                    opacity: pieAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${pieData.length * 0.1 + 0.1}s`,
                                  }}
                                />

                                <text
                                  x={CX} y={CY - 5}
                                  textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fdba74"
                                  style={{
                                    opacity: pieAnimated ? 1 : 0,
                                    transition: `opacity 0.3s ease ${pieData.length * 0.1 + 0.25}s`,
                                  }}
                                >{t.freqTotal}</text>
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
                                >{language === "id" ? "data" : language === "en" ? "data" : "データ"}</text>

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

                            <div
                              className="flex-1 w-full space-y-1.5"
                              style={{
                                opacity: pieAnimated ? 1 : 0,
                                transition: `opacity 0.4s ease ${pieData.length * 0.1 + 0.2}s`,
                              }}
                            >
                              <div className="grid text-xs font-body font-bold uppercase tracking-wide text-white/35 pb-1 border-b border-slate-700/50" style={{ gridTemplateColumns: "1fr 48px 52px 52px" }}>
                                <span>{language === "id" ? "Kategori" : language === "en" ? "Category" : "カテゴリ"}</span>
                                <span className="text-right">{t.pieFreqCol}</span>
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
                              <div className="grid items-center gap-1 pt-1.5 border-t border-slate-700/50" style={{ gridTemplateColumns: "1fr 48px 52px 52px" }}>
                                <span className="font-body text-xs font-bold text-white/60">{t.pieTotal}</span>
                                <span className="font-body text-xs font-bold text-white/60 text-right">{total}</span>
                                <span className="font-body text-xs font-bold text-orange-400/80 text-right">100%</span>
                                <span className="font-body text-xs font-bold text-violet-400/80 text-right">360°</span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="grid grid-cols-2 gap-2"
                            style={{
                              opacity: pieAnimated ? 1 : 0,
                              transition: `opacity 0.4s ease ${pieData.length * 0.1 + 0.5}s`,
                            }}
                          >
                            <div className={`rounded-lg px-3 py-2 text-center border transition-all ${pieMode === "persen" ? "bg-orange-900/30 border-orange-500/40" : "bg-slate-800/40 border-slate-600/30"}`}>
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.piePctLabel}</p>
                              <p className="font-body text-orange-300 font-bold text-xs mt-0.5">{t.piePctFormula}</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 text-center border transition-all ${pieMode === "derajat" ? "bg-violet-900/30 border-violet-500/40" : "bg-slate-800/40 border-slate-600/30"}`}>
                              <p className="font-body text-white/40" style={{ fontSize: "9px" }}>{t.pieDegLabel}</p>
                              <p className="font-body text-violet-300 font-bold text-xs mt-0.5">{t.pieDegFormula}</p>
                            </div>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Cek:</strong> Jumlah semua sudut sektor harus = 360°, dan jumlah semua persentase harus = 100%. Selalu lakukan pengecekan ini setelah membuat diagram lingkaran!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Check:</strong> The sum of all sector angles must equal 360°, and the sum of all percentages must equal 100%. Always verify this after building a pie chart!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>確認：</strong>すべての扇形の角度の合計は360°、すべてのパーセントの合計は100%でなければなりません。円グラフを作成した後は必ずこれを確認しましょう！
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title={st.contoh4} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                    <span className="font-body font-semibold text-white">{t.example(1)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dari diagram lingkaran diketahui persentase buah favorit 100 siswa: Mangga 35%, Jeruk 25%, Apel 20%, Pisang 15%, Lainnya 5%.<br />
                        Tentukan jumlah siswa yang menyukai mangga dan besar sudut sektornya!
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        A pie chart shows the favourite fruit of 100 students: Mango 35%, Orange 25%, Apple 20%, Banana 15%, Other 5%.<br />
                        Determine the number of students who like mango and the size of its sector angle!
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        円グラフから100人の生徒の好きな果物がわかります：マンゴー35%、オレンジ25%、リンゴ20%、バナナ15%、その他5%。<br />
                        マンゴーが好きな生徒の人数と扇形の角度を求めなさい！
                      </p>
                    )}
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        {language === "id" ? (
                          <>
                            <p>Siswa menyukai {fruitLabels.mangga} = 35% × 100 = <strong className="text-green-300">35 siswa</strong></p>
                            <p>Sudut sektor {fruitLabels.mangga} = <InlineMath math="\frac{35}{100} \times 360° = 126°" /></p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p>Students who like {fruitLabels.mangga} = 35% × 100 = <strong className="text-green-300">35 students</strong></p>
                            <p>Sector angle for {fruitLabels.mangga} = <InlineMath math="\frac{35}{100} \times 360° = 126°" /></p>
                          </>
                        ) : (
                          <>
                            <p>{fruitLabels.mangga}が好きな生徒 = 35% × 100 = <strong className="text-green-300">35人</strong></p>
                            <p>{fruitLabels.mangga}の扇形の角度 = <InlineMath math="\frac{35}{100} \times 360° = 126°" /></p>
                          </>
                        )}
                      </div>
                      <p><strong className="text-primary">
                        {language === "id" ? `35 siswa menyukai mangga; sudut sektor = 126°`
                          : language === "en" ? `35 students like mango; sector angle = 126°`
                          : `マンゴーが好きな生徒は35人；扇形の角度 = 126°`}
                      </strong></p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                    <span className="font-body font-semibold text-white">{t.example(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Anggaran belanja bulanan sebuah keluarga adalah Rp 4.000.000. Pengeluaran: Makanan Rp 1.600.000, Pendidikan Rp 800.000, Transportasi Rp 600.000, Kesehatan Rp 400.000, Hiburan Rp 400.000, Tabungan sisanya.<br />
                        Tentukan persentase dan sudut sektor tabungan!
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        A family's monthly budget is Rp 4,000,000. Expenses: Food Rp 1,600,000, Education Rp 800,000, Transport Rp 600,000, Health Rp 400,000, Entertainment Rp 400,000, Savings = the remainder.<br />
                        Find the percentage and sector angle for savings!
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        ある家族の月間予算は400万ルピア。支出：食費160万、教育費80万、交通費60万、医療費40万、娯楽費40万、貯蓄は残り。<br />
                        貯蓄のパーセントと扇形の角度を求めなさい！
                      </p>
                    )}
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        {language === "id" ? (
                          <>
                            <p>Tabungan = 4.000.000 − (1.600.000 + 800.000 + 600.000 + 400.000 + 400.000)</p>
                            <p>= 4.000.000 − 3.800.000 = <strong className="text-yellow-300">200.000</strong></p>
                            <p>% Tabungan = <InlineMath math="\frac{200.000}{4.000.000} \times 100\% = 5\%" /></p>
                            <p>Sudut = 5% × 360° = <strong className="text-yellow-300">18°</strong></p>
                          </>
                        ) : language === "en" ? (
                          <>
                            <p>Savings = 4,000,000 − (1,600,000 + 800,000 + 600,000 + 400,000 + 400,000)</p>
                            <p>= 4,000,000 − 3,800,000 = <strong className="text-yellow-300">200,000</strong></p>
                            <p>% Savings = <InlineMath math="\frac{200{,}000}{4{,}000{,}000} \times 100\% = 5\%" /></p>
                            <p>Sector angle = 5% × 360° = <strong className="text-yellow-300">18°</strong></p>
                          </>
                        ) : (
                          <>
                            <p>貯蓄 = 400万 − (160万 + 80万 + 60万 + 40万 + 40万)</p>
                            <p>= 400万 − 380万 = <strong className="text-yellow-300">20万</strong></p>
                            <p>貯蓄% = <InlineMath math="\frac{20}{400} \times 100\% = 5\%" /></p>
                            <p>扇形の角度 = 5% × 360° = <strong className="text-yellow-300">18°</strong></p>
                          </>
                        )}
                      </div>
                      <p><strong className="text-primary">
                        {language === "id" ? "Tabungan = Rp200.000 = 5%; sudut sektor = 18°"
                          : language === "en" ? "Savings = Rp 200,000 = 5%; sector angle = 18°"
                          : "貯蓄 = 20万ルピア = 5%；扇形の角度 = 18°"}
                      </strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                    <span className="font-body font-semibold text-white">{t.example(3)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dari diagram lingkaran, diketahui sudut sektor untuk 5 kategori pelajaran favorit: Matematika 90°, IPA 72°, Bhs.Indo 108°, IPS 54°, Seni 36°. Jika total siswa adalah 300, tentukan:<br />
                        (a) Persentase dan jumlah siswa tiap kategori.<br />
                        (b) Verifikasi bahwa total sudut = 360°.
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        A pie chart shows sector angles for 5 favourite subjects: {subjectLabels.mat} 90°, {subjectLabels.ipa} 72°, {subjectLabels.bhs} 108°, {subjectLabels.ips} 54°, Arts 36°. If there are 300 students total, determine:<br />
                        (a) The percentage and number of students per category.<br />
                        (b) Verify that the total angle = 360°.
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        円グラフから5つの好きな教科の扇形の角度がわかります：{subjectLabels.mat} 90°、{subjectLabels.ipa} 72°、{subjectLabels.bhs} 108°、{subjectLabels.ips} 54°、芸術 36°。生徒の合計が300人の場合、次を求めなさい：<br />
                        (a) 各カテゴリのパーセントと生徒数。<br />
                        (b) 角度の合計 = 360°であることを確認。
                      </p>
                    )}
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step(1)}:</strong>{" "}
                        {language === "id" ? "% = (sudut/360°) × 100%, jumlah = % × 300"
                          : language === "en" ? "% = (angle/360°) × 100%, count = % × 300"
                          : "% = (角度/360°) × 100%、人数 = % × 300"}
                      </p>
                      <div className="bg-slate-900/50 rounded p-3 overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="border-b border-slate-600/50">
                              <th className="text-left py-1 text-white/50">{language === "id" ? "Pelajaran" : language === "en" ? "Subject" : "教科"}</th>
                              <th className="text-right py-1 text-white/50">{language === "id" ? "Sudut" : language === "en" ? "Angle" : "角度"}</th>
                              <th className="text-right py-1 text-white/50">%</th>
                              <th className="text-right py-1 text-white/50">{language === "id" ? "Siswa" : language === "en" ? "Students" : "生徒数"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {[
                              [subjectLabels.mat,"90°","25%","75"],
                              [subjectLabels.ipa,"72°","20%","60"],
                              [subjectLabels.bhs,"108°","30%","90"],
                              [subjectLabels.ips,"54°","15%","45"],
                              [language === "id" ? "Seni" : language === "en" ? "Arts" : "芸術","36°","10%","30"],
                            ].map(([p,s,pct,jml]) => (
                              <tr key={p}>
                                <td className="py-1 text-white/70">{p}</td>
                                <td className="py-1 text-right text-orange-300">{s}</td>
                                <td className="py-1 text-right text-yellow-300">{pct}</td>
                                <td className="py-1 text-right text-cyan-300 font-bold">{jml}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/50">
                              <td className="py-1 text-white font-bold">{t.freqTotal}</td>
                              <td className="py-1 text-right text-orange-400 font-bold">360°</td>
                              <td className="py-1 text-right text-yellow-400 font-bold">100%</td>
                              <td className="py-1 text-right text-cyan-400 font-bold">300</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>{t.step(2)}:</strong>{" "}
                        {language === "id" ? "Verifikasi:" : language === "en" ? "Verification:" : "確認："}{" "}
                        <InlineMath math="90+72+108+54+36 = 360°" /> ✓
                      </p>
                      <p><strong className="text-primary">
                        {language === "id" ? "Total sudut = 360°, total siswa = 300 ✓"
                          : language === "en" ? "Total angle = 360°, total students = 300 ✓"
                          : "角度の合計 = 360°、生徒合計 = 300 ✓"}
                      </strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 5: DIAGRAM BATANG DAUN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={st.konsep5} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">
                    {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                  </p>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-green-300">Diagram batang daun</strong> adalah cara penyajian data yang unik — data angka dipisah menjadi dua bagian:
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      A <strong className="text-green-300">stem-and-leaf plot</strong> is a unique data presentation method — numeric data is split into two parts:
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-green-300">幹葉図</strong>はユニークなデータ表現方法です — 数値データを2つの部分に分けます：
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-900/40 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-300">
                        {language === "id" ? "BATANG" : language === "en" ? "STEM" : "幹"}
                      </p>
                      <p className="font-body text-xs text-white/70 mt-1">
                        {language === "id" ? "Digit depan (puluhan)" : language === "en" ? "Leading digit(s) (tens)" : "先頭の桁（十の位）"}
                      </p>
                      <p className="font-body text-xs text-green-400 mt-1">
                        {language === "id" ? "Ditulis di kiri" : language === "en" ? "Written on the left" : "左側に書く"}
                      </p>
                    </div>
                    <div className="bg-teal-900/40 border border-teal-500/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-teal-300">
                        {language === "id" ? "DAUN" : language === "en" ? "LEAF" : "葉"}
                      </p>
                      <p className="font-body text-xs text-white/70 mt-1">
                        {language === "id" ? "Digit belakang (satuan)" : language === "en" ? "Trailing digit (ones)" : "末尾の桁（一の位）"}
                      </p>
                      <p className="font-body text-xs text-teal-400 mt-1">
                        {language === "id" ? "Ditulis di kanan" : language === "en" ? "Written on the right" : "右側に書く"}
                      </p>
                    </div>
                  </div>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      Kelebihan utama: data asli tetap terlihat, mudah menentukan nilai minimum, maksimum, dan median secara langsung!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      Main advantage: original data values remain visible, and you can easily identify the minimum, maximum, and median directly!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      主な利点：元のデータ値がそのまま見え、最小値、最大値、中央値を直接簡単に特定できます！
                    </p>
                  )}
                </div>

                {/* Contoh Diagram Batang Daun */}
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl overflow-hidden">
                  <div className="bg-green-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-green-200 uppercase tracking-wide">
                      {language === "id" ? "📋 Contoh Diagram Batang Daun"
                        : language === "en" ? "📋 Stem-and-Leaf Plot Example"
                        : "📋 幹葉図の例"}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="font-body text-xs text-white/60 mb-3">
                      {language === "id" ? "Data nilai ulangan 15 siswa: 62, 65, 68, 71, 73, 73, 75, 78, 78, 82, 85, 87, 88, 91, 95"
                        : language === "en" ? "Quiz scores of 15 students: 62, 65, 68, 71, 73, 73, 75, 78, 78, 82, 85, 87, 88, 91, 95"
                        : "15人の生徒の小テストの点数：62, 65, 68, 71, 73, 73, 75, 78, 78, 82, 85, 87, 88, 91, 95"}
                    </p>
                    <div className="bg-slate-900/70 rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white/40 text-xs w-20 text-right shrink-0">{t.stemStemHeader}</span>
                        <span className="text-white/40 text-xs mx-2">|</span>
                        <span className="text-white/40 text-xs">{t.stemLeafHeader}</span>
                      </div>
                      <div className="border-t border-slate-600/40 pt-2 space-y-1">
                        {[
                          [6, "2  5  8"],
                          [7, "1  3  3  5  8  8"],
                          [8, "2  5  7  8"],
                          [9, "1  5"],
                        ].map(([stem, leaves]) => (
                          <div key={String(stem)} className="flex items-center gap-2">
                            <span className="text-cyan-300 font-bold w-20 text-right shrink-0">{stem}</span>
                            <span className="text-white/40 mx-2">|</span>
                            <span className="text-green-300">{leaves}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
                      <div className="bg-green-900/30 rounded p-2 text-center">
                        <p className="text-white/50">{t.stemMin}</p>
                        <p className="text-green-300 font-bold text-base">62</p>
                      </div>
                      <div className="bg-red-900/30 rounded p-2 text-center">
                        <p className="text-white/50">{t.stemMax}</p>
                        <p className="text-red-300 font-bold text-base">95</p>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2 text-center">
                        <p className="text-white/50">{t.stemMedian}</p>
                        <p className="text-blue-300 font-bold text-base">78</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>Cara membuat:</strong> (1) Urutkan data dari kecil ke besar. (2) Ambil digit puluhan sebagai batang. (3) Tulis digit satuan sebagai daun di sebelah kanan batangnya.
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>How to build:</strong> (1) Sort data from smallest to largest. (2) Use the tens digit as the stem. (3) Write the ones digit as the leaf to the right of its stem.
                    </p>
                  ) : (
                    <p className="font-body text-sm text-yellow-200">
                      <strong>作り方：</strong>(1) データを小さい順に並べる。(2) 十の位を幹として使う。(3) 一の位を対応する幹の右に葉として書く。
                    </p>
                  )}
                </div>

                {/* ===== DIAGRAM BATANG DAUN INTERAKTIF ===== */}
                <div className="bg-slate-800/70 border border-green-500/30 rounded-xl overflow-hidden">
                  <div className="bg-green-900/50 px-4 py-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400 shrink-0" />
                    <p className="font-body text-sm font-bold text-green-200">{t.stemTitle}</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="font-body text-xs text-white/55 leading-relaxed">{t.stemDesc}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body text-xs font-semibold text-green-300">{t.stemLabel}</label>
                        <button
                          onClick={loadStemExample}
                          className="font-body text-xs text-green-400/60 hover:text-green-400 transition-colors underline underline-offset-2"
                        >{t.stemSwap}</button>
                      </div>
                      <input
                        type="text"
                        value={stemInput}
                        onChange={(e) => { setStemInput(e.target.value); setStemError(""); setStemVisible(false); }}
                        placeholder={t.stemPlaceholder}
                        className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm font-body text-white/90 placeholder-white/25 focus:outline-none focus:border-green-400/60 transition-colors"
                      />
                      {stemError && (
                        <p className="font-body text-xs text-red-400">⚠ {stemError}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={buildStemLeaf}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 border border-green-500/50 text-white text-xs font-body font-bold hover:bg-green-500 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                      >
                        <Target className="w-3.5 h-3.5" />
                        {t.stemBuildBtn}
                      </button>
                      {stemVisible && (
                        <button
                          onClick={resetStem}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white/50 text-xs font-body hover:bg-slate-600/50 hover:text-white/70 transition-all"
                        >{t.stemReset}</button>
                      )}
                    </div>

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
                      const modeStr = maxFreq === 1 ? t.stemNoMode : modes.join(" & ");

                      let globalLeafIdx = 0;

                      return (
                        <div className="bg-slate-900/60 border border-green-500/20 rounded-xl p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wider">{t.stemResultTitle}</p>
                            <span className="font-body text-xs text-white/35">{t.stemDataCount(n)}</span>
                          </div>

                          <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                            <p className="font-body text-xs text-white/35 mb-1">{t.stemSorted}</p>
                            <p className="font-body text-xs text-white/70 leading-relaxed">{stemRaw.join(", ")}</p>
                          </div>

                          <div className="bg-slate-900/80 rounded-xl overflow-hidden border border-green-500/15">
                            <div className="flex items-center gap-0 border-b border-slate-700/60">
                              <div className="w-16 px-3 py-2 text-right font-body text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">{t.stemStemHeader}</div>
                              <div className="w-px self-stretch bg-slate-600/60" />
                              <div className="px-3 py-2 font-body text-xs font-bold text-slate-400 uppercase tracking-wide">{t.stemLeafHeader}</div>
                            </div>
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
                                        void globalIdx;
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
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="border-t border-slate-700/60 px-3 py-2 flex items-center gap-4">
                              <span className="font-body text-xs text-white/30">{t.stemKeyNote}</span>
                              <span className="font-body text-xs text-white/30">{t.stemKeyEx(stemResult[0].stem, stemResult[0].leaves[0], stemResult[0].stem * 10 + stemResult[0].leaves[0])}</span>
                            </div>
                          </div>

                          <div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                            style={{
                              opacity: stemAnimated ? 1 : 0,
                              transition: `opacity 0.5s ease ${stemResult.length * 0.12 + 0.4}s`,
                            }}
                          >
                            <div className="bg-green-900/25 border border-green-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>{t.stemMin}</p>
                              <p className="font-body text-green-300 font-bold text-lg mt-0.5">{minVal}</p>
                            </div>
                            <div className="bg-red-900/25 border border-red-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>{t.stemMax}</p>
                              <p className="font-body text-red-300 font-bold text-lg mt-0.5">{maxVal}</p>
                            </div>
                            <div className="bg-yellow-900/25 border border-yellow-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>{t.stemMode}</p>
                              <p className="font-body text-yellow-300 font-bold text-sm mt-0.5 leading-tight">{modeStr}</p>
                            </div>
                            <div className="bg-blue-900/25 border border-blue-500/20 rounded-lg p-2.5 text-center">
                              <p className="font-body text-white/40" style={{ fontSize: "10px" }}>{t.stemMedian}</p>
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
            <SectionHeader id="contoh5" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title={st.contoh5} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                    <span className="font-body font-semibold text-white">{t.example(1)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Buatlah diagram batang daun dari data berikut (nilai ulangan 10 siswa):<br />
                        52, 58, 61, 64, 67, 70, 72, 75, 83, 89
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        Build a stem-and-leaf plot from the following data (quiz scores of 10 students):<br />
                        52, 58, 61, 64, 67, 70, 72, 75, 83, 89
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        次のデータ（10人の生徒の小テストの点数）から幹葉図を作りなさい：<br />
                        52, 58, 61, 64, 67, 70, 72, 75, 83, 89
                      </p>
                    )}
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step(1)}:</strong>{" "}
                        {language === "id" ? "Data sudah urut. Pisahkan puluhan (batang) dan satuan (daun)."
                          : language === "en" ? "Data is already sorted. Separate tens (stem) from ones (leaf)."
                          : "データはすでに整列されています。十の位（幹）と一の位（葉）を分ける。"}
                      </p>
                      <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/40 text-xs w-16 text-right shrink-0">{t.stemStemHeader}</span>
                          <span className="text-white/40 mx-2">|</span>
                          <span className="text-white/40 text-xs">{t.stemLeafHeader}</span>
                        </div>
                        <div className="border-t border-slate-600/40 pt-1 space-y-1">
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">5</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">2  8</span></div>
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">6</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">1  4  7</span></div>
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">7</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">0  2  5</span></div>
                          <div className="flex gap-2"><span className="text-cyan-300 font-bold w-16 text-right shrink-0">8</span><span className="text-white/30 mx-2">|</span><span className="text-green-300">3  9</span></div>
                        </div>
                      </div>
                      <p><strong className="text-green-300">
                        {language === "id" ? "Min = 52, Maks = 89, Banyak data = 10 ✓"
                          : language === "en" ? "Min = 52, Max = 89, Data count = 10 ✓"
                          : "最小値 = 52、最大値 = 89、データ数 = 10 ✓"}
                      </strong></p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                    <span className="font-body font-semibold text-white">{t.example(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dari diagram batang daun berikut, tentukan nilai minimum, maksimum, dan median!
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        From the following stem-and-leaf plot, find the minimum, maximum, and median values!
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        次の幹葉図から、最小値、最大値、中央値を求めなさい！
                      </p>
                    )}
                    <div className="bg-slate-900/60 rounded-lg p-3 mt-2 font-mono text-sm">
                      <div className="flex gap-2 text-white/40 text-xs mb-1">
                        <span className="w-14 text-right">{t.stemStemHeader}</span>
                        <span className="mx-2">|</span>
                        <span>{t.stemLeafHeader}</span>
                      </div>
                      <div className="border-t border-slate-600/40 pt-1 space-y-1">
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">4</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">3  7  7</span></div>
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">5</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">0  2  5  5  8</span></div>
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">6</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">1  4  9</span></div>
                        <div className="flex gap-2"><span className="text-cyan-300 font-bold w-14 text-right">7</span><span className="text-white/30 mx-2">|</span><span className="text-yellow-300">2  6</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>
                        {language === "id" ? "Data terurut: 43, 47, 47, 50, 52, 55, 55, 58, 61, 64, 69, 72, 76"
                          : language === "en" ? "Sorted data: 43, 47, 47, 50, 52, 55, 55, 58, 61, 64, 69, 72, 76"
                          : "整列データ：43, 47, 47, 50, 52, 55, 55, 58, 61, 64, 69, 72, 76"}
                      </p>
                      <p>
                        {language === "id" ? "Banyak data = " : language === "en" ? "Data count = " : "データ数 = "}<strong>13</strong>
                      </p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• {t.stemMin} = <span className="text-green-400 font-semibold">43</span></p>
                        <p>• {t.stemMax} = <span className="text-red-400 font-semibold">76</span></p>
                        <p>• {t.stemMedian} = {language === "id" ? "datum ke-" : language === "en" ? "the " : ""}<InlineMath math="\frac{13+1}{2} = 7" />{language === "ja" ? "番目" : language === "en" ? "th value" : ""} = <span className="text-blue-400 font-semibold">55</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                    <span className="font-body font-semibold text-white">{t.example(3)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    {language === "id" ? (
                      <p className="font-body text-sm text-white">
                        Dua kelas, A dan B, mengikuti ujian matematika. Data nilai (sudah diurutkan):<br />
                        Kelas A: 55, 60, 63, 65, 68, 70, 70, 72, 78, 80<br />
                        Kelas B: 58, 61, 64, 66, 69, 71, 75, 77, 82, 85<br />
                        Sajikan data ini dalam <strong>diagram batang daun berdampingan</strong>!
                      </p>
                    ) : language === "en" ? (
                      <p className="font-body text-sm text-white">
                        Two classes, A and B, took a math exam. Sorted scores:<br />
                        Class A: 55, 60, 63, 65, 68, 70, 70, 72, 78, 80<br />
                        Class B: 58, 61, 64, 66, 69, 71, 75, 77, 82, 85<br />
                        Present this data in a <strong>back-to-back stem-and-leaf plot</strong>!
                      </p>
                    ) : (
                      <p className="font-body text-sm text-white">
                        2つのクラスAとBが数学試験を受けました。整列済みの点数：<br />
                        クラスA：55, 60, 63, 65, 68, 70, 70, 72, 78, 80<br />
                        クラスB：58, 61, 64, 66, 69, 71, 75, 77, 82, 85<br />
                        このデータを<strong>背中合わせの幹葉図</strong>で表しなさい！
                      </p>
                    )}
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step(1)}:</strong>{" "}
                        {language === "id" ? "Buat diagram batang daun berdampingan (daun A di kiri, batang di tengah, daun B di kanan):"
                          : language === "en" ? "Build a back-to-back plot (A's leaves on left, stem in middle, B's leaves on right):"
                          : "背中合わせの幹葉図を作る（Aの葉は左、幹は中央、Bの葉は右）："}
                      </p>
                      <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                        <div className="flex gap-1 text-white/40 mb-1 justify-center">
                          <span className="w-20 text-right">
                            {language === "id" ? "Daun A" : language === "en" ? "Leaf A" : "葉A"}
                          </span>
                          <span className="w-8 text-center">
                            {language === "id" ? "Batang" : language === "en" ? "Stem" : "幹"}
                          </span>
                          <span className="w-20">
                            {language === "id" ? "Daun B" : language === "en" ? "Leaf B" : "葉B"}
                          </span>
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
                      <p><strong className="text-primary">
                        {language === "id" ? "Diagram batang daun berdampingan berhasil dibuat. Nilai Kelas B secara umum lebih tinggi terlihat dari posisi daun yang lebih besar di setiap batang."
                          : language === "en" ? "Back-to-back stem-and-leaf plot successfully built. Class B's scores are generally higher, visible from the larger leaf values in each stem."
                          : "背中合わせの幹葉図が完成しました。クラスBの点数は各幹で葉の値が大きいことから、全体的に高いことがわかります。"}
                      </strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== RANGKUMAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-yellow-400" title={st.rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(language === "id" ? [
                    { emoji: "🌿", title: "Batang Daun", desc: "Data mentah tetap terlihat. Mudah baca min, maks, dan median.", color: "border-green-500/40 bg-green-900/20" },
                    { emoji: "📊", title: "Diagram Batang", desc: "Perbandingan kategori. Batang tegak/mendatar, tinggi = frekuensi.", color: "border-blue-500/40 bg-blue-900/20" },
                    { emoji: "📈", title: "Diagram Garis", desc: "Tren data dari waktu ke waktu. Titik dihubungkan garis.", color: "border-purple-500/40 bg-purple-900/20" },
                    { emoji: "🥧", title: "Diagram Lingkaran", desc: "Proporsi/persentase. Sudut = (f/total) × 360°.", color: "border-orange-500/40 bg-orange-900/20" },
                    { emoji: "📋", title: "Tabel Distribusi", desc: "Data banyak dikelompokkan berdasarkan nilai dan frekuensinya.", color: "border-cyan-500/40 bg-cyan-900/20" },
                  ] : language === "en" ? [
                    { emoji: "🌿", title: "Stem-and-Leaf Plot", desc: "Raw data remains visible. Easy to read min, max, and median.", color: "border-green-500/40 bg-green-900/20" },
                    { emoji: "📊", title: "Bar Chart", desc: "Compares categories. Bar height = frequency.", color: "border-blue-500/40 bg-blue-900/20" },
                    { emoji: "📈", title: "Line Chart", desc: "Data trend over time. Points connected by lines.", color: "border-purple-500/40 bg-purple-900/20" },
                    { emoji: "🥧", title: "Pie Chart", desc: "Proportions/percentages. Angle = (f/total) × 360°.", color: "border-orange-500/40 bg-orange-900/20" },
                    { emoji: "📋", title: "Frequency Distribution Table", desc: "Large data grouped by value and frequency.", color: "border-cyan-500/40 bg-cyan-900/20" },
                  ] : [
                    { emoji: "🌿", title: "幹葉図", desc: "生データがそのまま見える。最小値・最大値・中央値が簡単にわかる。", color: "border-green-500/40 bg-green-900/20" },
                    { emoji: "📊", title: "棒グラフ", desc: "カテゴリを比較する。棒の高さ = 度数。", color: "border-blue-500/40 bg-blue-900/20" },
                    { emoji: "📈", title: "折れ線グラフ", desc: "時間的なデータの傾向。点を線で結ぶ。", color: "border-purple-500/40 bg-purple-900/20" },
                    { emoji: "🥧", title: "円グラフ", desc: "割合/パーセント。角度 = (f/合計) × 360°。", color: "border-orange-500/40 bg-orange-900/20" },
                    { emoji: "📋", title: "度数分布表", desc: "大量のデータを値と度数でグループ化する。", color: "border-cyan-500/40 bg-cyan-900/20" },
                  ]).map(({ emoji, title, desc, color }) => (
                    <div key={title} className={`border ${color} rounded-xl p-3`}>
                      <p className="text-xl mb-1">{emoji}</p>
                      <p className="font-body text-sm font-bold text-white mb-1">{title}</p>
                      <p className="font-body text-xs text-white/60">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-cyan-200">
                      <strong>Kamu sudah menguasai Penyajian Data! 🎉</strong> Selanjutnya, lanjut ke materi Ukuran Pemusatan Data untuk belajar menghitung median secara mendalam! 🚀
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-cyan-200">
                      <strong>You've mastered Data Presentation! 🎉</strong> Next, move on to Measures of Central Tendency to dive deeper into calculating the median! 🚀
                    </p>
                  ) : (
                    <p className="font-body text-sm text-cyan-200">
                      <strong>データの表現をマスターしました！🎉</strong> 次は、中心傾向の尺度に進んで中央値の計算を深く学びましょう！🚀
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        <RangkumanSection
          gradientFrom="from-blue-900"
          gradientVia="via-indigo-900"
          gradientTo="to-violet-900"
          borderColor="border-blue-500/40"
          accentColor="text-blue-300"
          headerIcon="📈"
          judul={
            language === "id" ? "Rangkuman — Penyajian Data"
              : language === "en" ? "Summary — Data Presentation"
              : "まとめ — データの表現"
          }
          subjudul={
            language === "id" ? "Lima bentuk penyajian data — ubah angka mentah menjadi visualisasi yang powerful!"
              : language === "en" ? "Five forms of data presentation — transform raw numbers into powerful visualisations!"
              : "データ表現の5つの形式 — 生の数値を強力な視覚化に変換しよう！"
          }
          ringkasan={[
            {
              emoji: "📋",
              judul: language === "id" ? "Tabel Distribusi Frekuensi"
                : language === "en" ? "Frequency Distribution Table"
                : "度数分布表",
              isi: language === "id"
                ? "Hitung berapa kali setiap nilai muncul (frekuensi). Wajib: jumlah semua frekuensi = n (total data). Gunakan frekuensi kumulatif untuk pertanyaan 'berapa yang kurang dari x?'"
                : language === "en"
                ? "Count how many times each value appears (frequency). Required: sum of all frequencies = n (total data). Use cumulative frequency for questions like 'how many are less than x?'"
                : "各値が何回出現するかを数える（度数）。必須：全度数の合計 = n（データ総数）。「xより小さいものはいくつ？」という問いには累積度数を使う。",
              bg: "bg-blue-900/50",
              border: "border-blue-500/40",
              textColor: "text-blue-200",
            },
            {
              emoji: "📊",
              judul: language === "id" ? "Diagram Batang & Garis"
                : language === "en" ? "Bar Chart & Line Chart"
                : "棒グラフ・折れ線グラフ",
              isi: language === "id"
                ? "Batang: membandingkan nilai antar kategori. Tinggi batang = frekuensi. Garis: menampilkan tren/perubahan data dari waktu ke waktu."
                : language === "en"
                ? "Bar: compares values across categories. Bar height = frequency. Line: shows trend/change in data over time."
                : "棒：カテゴリ間の値を比較する。棒の高さ = 度数。折れ線：時間的なデータの傾向・変化を示す。",
              bg: "bg-indigo-900/50",
              border: "border-indigo-500/40",
              textColor: "text-indigo-200",
            },
            {
              emoji: "🥧",
              judul: language === "id" ? "Diagram Lingkaran"
                : language === "en" ? "Pie Chart"
                : "円グラフ",
              isi: language === "id"
                ? "Menampilkan proporsi/persentase bagian dari keseluruhan. Sudut = (f/n) x 360 derajat. Persentase = (f/n) x 100%. Total semua sudut = 360 derajat."
                : language === "en"
                ? "Displays proportions/percentages of parts of a whole. Angle = (f/n) × 360°. Percentage = (f/n) × 100%. Total of all angles = 360°."
                : "全体に対する各部分の割合を示す。角度 = (f/n) × 360°。パーセント = (f/n) × 100%。全角度の合計 = 360°。",
              bg: "bg-violet-900/50",
              border: "border-violet-500/40",
              textColor: "text-violet-200",
            },
            {
              emoji: "🌿",
              judul: language === "id" ? "Diagram Batang Daun"
                : language === "en" ? "Stem-and-Leaf Plot"
                : "幹葉図",
              isi: language === "id"
                ? "Mempertahankan nilai asli data sekaligus menampilkan distribusi. Bagian | memisahkan puluhan (batang) dengan satuan (daun). Sangat berguna untuk data berukuran sedang."
                : language === "en"
                ? "Preserves original data values while showing distribution. The | separator divides the stem (tens) from the leaf (ones). Very useful for medium-sized datasets."
                : "元のデータ値を保持しながら分布を示す。「|」区切りが幹（十の位）と葉（一の位）を分ける。中規模のデータセットに非常に便利。",
              bg: "bg-purple-900/50",
              border: "border-purple-500/40",
              textColor: "text-purple-200",
            },
          ]}
          rumus={[
            {
              label: language === "id" ? "Sudut Diagram Lingkaran"
                : language === "en" ? "Pie Chart Sector Angle"
                : "円グラフの扇形の角度",
              rumus: "\\theta = \\frac{f}{n} \\times 360°",
              bg: "bg-blue-900/60",
              border: "border-blue-400/40",
              labelColor: "text-blue-300",
            },
            {
              label: language === "id" ? "Persentase Frekuensi"
                : language === "en" ? "Frequency Percentage"
                : "度数のパーセント",
              rumus: "p = \\frac{f}{n} \\times 100\\%",
              bg: "bg-indigo-900/60",
              border: "border-indigo-400/40",
              labelColor: "text-indigo-300",
            },
          ]}
          tips={[
            {
              emoji: "✅",
              teks: language === "id"
                ? "Cek wajib: jumlah semua frekuensi harus sama dengan banyak data (n). Jika tidak sama, ada kesalahan penghitungan!"
                : language === "en"
                ? "Required check: the sum of all frequencies must equal the total number of data (n). If not, there is a counting error!"
                : "必須確認：すべての度数の合計はデータ総数（n）と等しくなければなりません。等しくない場合は計算ミスがあります！",
            },
            {
              emoji: "🎯",
              teks: language === "id"
                ? "Pilih diagram batang untuk membandingkan kategori, garis untuk tren waktu, lingkaran untuk persentase, batang daun untuk melihat nilai asli."
                : language === "en"
                ? "Choose a bar chart to compare categories, a line chart for time trends, a pie chart for percentages, and a stem-and-leaf plot to see original values."
                : "カテゴリ比較には棒グラフ、時系列傾向には折れ線グラフ、パーセントには円グラフ、元の値を見るには幹葉図を選ぼう。",
            },
            {
              emoji: "🔢",
              teks: language === "id"
                ? "Frekuensi kumulatif (fk): jumlahkan frekuensi dari baris pertama hingga baris tersebut. Berguna untuk mencari median dan kuartil dari tabel."
                : language === "en"
                ? "Cumulative frequency (cf): add up the frequencies from the first row to that row. Useful for finding the median and quartiles from a table."
                : "累積度数（cf）：最初の行からその行までの度数を合計する。表から中央値や四分位数を求めるのに便利。",
            },
            {
              emoji: "💡",
              teks: language === "id"
                ? "Diagram yang baik langsung menyampaikan informasi tanpa pembaca perlu berpikir keras. Pilih bentuk yang paling sesuai dengan jenis dan tujuan datamu."
                : language === "en"
                ? "A good chart communicates information immediately without the reader having to think hard. Choose the form that best suits your data type and purpose."
                : "良いグラフは読者が深く考えなくても情報がすぐ伝わります。データの種類と目的に最も合った形式を選びましょう。",
            },
          ]}
          kesimpulan={
            language === "id"
              ? "Penyajian data yang tepat mengubah tumpukan angka menjadi informasi visual yang langsung dipahami. Inilah skill yang digunakan jurnalis, analis data, ilmuwan, dan manajer bisnis setiap hari. Data tanpa penyajian hanya angka — data dengan penyajian yang baik adalah cerita!"
              : language === "en"
              ? "Effective data presentation transforms a pile of numbers into instantly understandable visual information. This is the skill used daily by journalists, data analysts, scientists, and business managers. Data without presentation is just numbers — data with good presentation is a story!"
              : "適切なデータの表現は、数字の山を瞬時に理解できる視覚的な情報に変えます。これは、ジャーナリスト、データアナリスト、科学者、ビジネスマネージャーが毎日使うスキルです。表現のないデータはただの数字 — 良い表現のあるデータはストーリーです！"
          }
          kesimpulanBg="bg-gradient-to-r from-blue-900/80 to-indigo-900/80"
          kesimpulanBorder="border-blue-400/50"
          kesimpulanTextColor="text-blue-100"
        />

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {pt.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenyajianDataPage;
