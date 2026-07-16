import { useState, useEffect } from "react";
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

/* ─────────────────────────────────────────────────────────────
   SHARED HELPERS
───────────────────────────────────────────────────────────── */

/** Ordinal position label, e.g. "ke-5" / "#5" / "5番目" */
const ord = (i: number, language: Language): string =>
  language === "id" ? `ke-${i}` : language === "en" ? `#${i}` : `${i}番目`;

const levelLabels: Record<string, Record<Language, string>> = {
  MUDAH: { id: "MUDAH", en: "EASY", ja: "基本" },
  SEDANG: { id: "SEDANG", en: "MEDIUM", ja: "標準" },
  SULIT: { id: "SULIT", en: "HARD", ja: "発展" },
  DIAGRAM: { id: "DIAGRAM", en: "CHART", ja: "グラフ" },
  "DIAGRAM BATANG": { id: "DIAGRAM BATANG", en: "BAR CHART", ja: "棒グラフ" },
};
function levelLabel(level: string, language: Language): string {
  return levelLabels[level]?.[language] ?? level;
}

function stepLabel(i: number, language: Language): string {
  return language === "id" ? `Langkah ${i}:` : language === "en" ? `Step ${i}:` : `ステップ${i}：`;
}

/* ─── Animasi Interaktif Penentuan Median ─── */
const MedianAnimator = () => {
  const { language } = useLanguage();
  const [screen, setScreen] = useState<"input" | "sort" | "sorted" | "median">("input");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [original, setOriginal] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [sortRevealed, setSortRevealed] = useState(false);
  const [elimStep, setElimStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [medianDone, setMedianDone] = useState(false);

  const n = sorted.length;
  const maxElim = Math.floor(n / 2);
  const isOdd = n % 2 === 1;
  const medianIdx1 = isOdd ? Math.floor(n / 2) : n / 2 - 1;
  const medianIdx2 = isOdd ? Math.floor(n / 2) : n / 2;
  const medianValue = n > 0
    ? (isOdd ? sorted[medianIdx1] : (sorted[medianIdx1] + sorted[medianIdx2]) / 2)
    : 0;
  const fmt = (v: number) =>
    Number.isInteger(v) ? v.toString() : parseFloat(v.toFixed(2)).toString();

  const t = {
    id: {
      layar1: "Layar 1 / 4", inputTitle: "🔢 Input Data",
      inputDescA: "Masukkan data angka dipisah ", inputDescBold: "koma", inputDescB: ". Boleh ganjil atau genap.",
      contohLabel: "Contoh: ",
      errMin: "Masukkan minimal 3 angka!",
      errMax: "Maksimal 13 angka agar animasi optimal.",
      errInvalid: "Pastikan semua data adalah angka yang valid.",
      btnNext1: "Lanjut → Lihat Data",
      layar2: "Layar 2 / 4", sortTitle: "🔀 Urutkan Data", back: "← Kembali",
      dataAsli: "Data asli (belum terurut):",
      sorting: "⏳ Sedang mengurutkan...",
      sortBtn: "🔀 Urutkan dari Kecil ke Besar",
      sortedLabel: "✅ Data terurut:",
      btnNext2: "Lanjut → Lihat Data Terurut",
      layar3: "Layar 3 / 4", sortedTitle: "📋 Data Terurut",
      sortedFull: "Data terurut dari kecil ke besar:",
      n: "Banyak Data (n)", jenisN: "Jenis n", ganjil: "Ganjil", genap: "Genap",
      posisiMedian: "Posisi Median",
      startAnim: "🎯 Mulai Animasi Median →",
      layar4: "Layar 4 / 4", medianTitle: "🎯 Penentuan Median",
      refLabel: "📋 Data terurut (referensi):",
      ready: "Siap memulai animasi...",
      leftArrow: "← singkirkan", rightArrow: "singkirkan →",
      medianVal: "Median (Me)",
      retryBtn: "🔄 Coba Data Lain",
    },
    en: {
      layar1: "Screen 1 / 4", inputTitle: "🔢 Input Data",
      inputDescA: "Enter numbers separated by a ", inputDescBold: "comma", inputDescB: ". Works for odd or even amounts.",
      contohLabel: "Example: ",
      errMin: "Enter at least 3 numbers!",
      errMax: "Maximum 13 numbers for a smooth animation.",
      errInvalid: "Make sure all values are valid numbers.",
      btnNext1: "Next → View Data",
      layar2: "Screen 2 / 4", sortTitle: "🔀 Sort the Data", back: "← Back",
      dataAsli: "Original data (unsorted):",
      sorting: "⏳ Sorting...",
      sortBtn: "🔀 Sort from Smallest to Largest",
      sortedLabel: "✅ Sorted data:",
      btnNext2: "Next → View Sorted Data",
      layar3: "Screen 3 / 4", sortedTitle: "📋 Sorted Data",
      sortedFull: "Data sorted from smallest to largest:",
      n: "Data Count (n)", jenisN: "Type of n", ganjil: "Odd", genap: "Even",
      posisiMedian: "Median Position",
      startAnim: "🎯 Start Median Animation →",
      layar4: "Screen 4 / 4", medianTitle: "🎯 Finding the Median",
      refLabel: "📋 Sorted data (reference):",
      ready: "Ready to start the animation...",
      leftArrow: "← remove", rightArrow: "remove →",
      medianVal: "Median (Me)",
      retryBtn: "🔄 Try Other Data",
    },
    ja: {
      layar1: "画面 1 / 4", inputTitle: "🔢 データ入力",
      inputDescA: "数値を", inputDescBold: "カンマ", inputDescB: "で区切って入力してください。奇数個でも偶数個でもOKです。",
      contohLabel: "例：",
      errMin: "最低3つの数値を入力してください！",
      errMax: "アニメーションのため最大13個までです。",
      errInvalid: "すべてのデータが有効な数値であることを確認してください。",
      btnNext1: "次へ → データを見る",
      layar2: "画面 2 / 4", sortTitle: "🔀 データを並べ替える", back: "← 戻る",
      dataAsli: "元のデータ（未並べ替え）：",
      sorting: "⏳ 並べ替え中...",
      sortBtn: "🔀 小さい順に並べ替える",
      sortedLabel: "✅ 並べ替えたデータ：",
      btnNext2: "次へ → 並べ替えたデータを見る",
      layar3: "画面 3 / 4", sortedTitle: "📋 並べ替えたデータ",
      sortedFull: "小さい順から大きい順に並べたデータ：",
      n: "データの個数 (n)", jenisN: "nの種類", ganjil: "奇数", genap: "偶数",
      posisiMedian: "中央値の位置",
      startAnim: "🎯 中央値アニメーションを開始 →",
      layar4: "画面 4 / 4", medianTitle: "🎯 中央値の決定",
      refLabel: "📋 並べ替えたデータ（参考）：",
      ready: "アニメーション開始準備中...",
      leftArrow: "← 除外", rightArrow: "除外 →",
      medianVal: "中央値 (Me)",
      retryBtn: "🔄 別のデータで試す",
    },
  }[language];

  /* auto-step animasi eliminasi */
  useEffect(() => {
    if (!isAnimating) return;
    if (elimStep >= maxElim) {
      const tt = setTimeout(() => { setMedianDone(true); setIsAnimating(false); }, 700);
      return () => clearTimeout(tt);
    }
    const tt = setTimeout(() => {
      setElimStep(prev => prev + 1);
      playPopSound();
    }, 900);
    return () => clearTimeout(tt);
  }, [isAnimating, elimStep, maxElim]);

  const goToInput = () => {
    playPopSound();
    setScreen("input");
    setIsSorting(false);
    setSortRevealed(false);
    setElimStep(0);
    setIsAnimating(false);
    setMedianDone(false);
  };

  const handleSubmit = () => {
    playPopSound();
    setError("");
    const parts = input.split(",").map(s => s.trim()).filter(s => s !== "");
    if (parts.length < 3) { setError(t.errMin); return; }
    if (parts.length > 13) { setError(t.errMax); return; }
    const vals = parts.map(p => parseFloat(p.replace(",", ".")));
    if (vals.some(isNaN)) { setError(t.errInvalid); return; }
    setOriginal(vals);
    setSorted([...vals].sort((a, b) => a - b));
    setSortRevealed(false);
    setElimStep(0);
    setMedianDone(false);
    setIsAnimating(false);
    setScreen("sort");
  };

  const handleSort = () => {
    if (isSorting || sortRevealed) return;
    playPopSound();
    setIsSorting(true);
    setTimeout(() => { setIsSorting(false); setSortRevealed(true); playPopSound(); }, 1400);
  };

  const goToSorted = () => {
    playPopSound();
    setScreen("sorted");
  };

  const startMedianAnimation = () => {
    playPopSound();
    setElimStep(0);
    setMedianDone(false);
    setScreen("median");
    setTimeout(() => setIsAnimating(true), 500);
  };

  /* reusable chip row — data terurut (selalu tampil, tidak berubah) */
  const SortedReferenceRow = ({ label }: { label: string }) => (
    <div>
      <p className="font-body text-xs text-purple-300/70 mb-2 uppercase tracking-wide font-semibold">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map((v, i) => {
          const isMedPos = isOdd ? i === medianIdx1 : i === medianIdx1 || i === medianIdx2;
          return (
            <div
              key={i}
              className={`rounded-lg px-2.5 py-1.5 text-center border ${
                isMedPos
                  ? "bg-purple-700/50 border-purple-400/60 ring-1 ring-purple-400/50"
                  : "bg-slate-700/40 border-slate-600/40"
              }`}
            >
              <p className={`font-bold text-xs font-body ${isMedPos ? "text-purple-200" : "text-white/60"}`}>{fmt(v)}</p>
              <p className="text-white/25 text-[10px] font-body">{ord(i + 1, language)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ── Layar 1: Input ── */
  if (screen === "input") return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar1}</span>
        <p className="font-body text-sm font-bold text-purple-300">{t.inputTitle}</p>
      </div>
      <p className="font-body text-xs text-white/55 leading-relaxed">
        {t.inputDescA}<strong className="text-purple-300">{t.inputDescBold}</strong>{t.inputDescB}
        <br /><span className="text-white/35">{t.contohLabel}</span><span className="text-purple-300 font-mono">9, 3, 7, 5, 11, 1, 13</span>
      </p>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="9, 3, 7, 5, 11, 1, 13"
        className="w-full bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2.5 outline-none focus:border-purple-500 placeholder:text-white/25"
      />
      {error && <p className="text-red-400 text-xs font-body">⚠️ {error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        {t.btnNext1}
      </button>
    </div>
  );

  /* ── Layar 2: Urutkan ── */
  if (screen === "sort") return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar2}</span>
          <p className="font-body text-sm font-bold text-purple-300">{t.sortTitle}</p>
        </div>
        <button onClick={goToInput} className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors">{t.back}</button>
      </div>

      <div>
        <p className="font-body text-xs text-white/40 mb-2 uppercase tracking-wide font-semibold">{t.dataAsli}</p>
        <div className="flex flex-wrap gap-2">
          {original.map((v, i) => (
            <div
              key={i}
              className="bg-slate-700/60 border border-slate-500/50 rounded-lg px-3 py-2 text-center transition-all duration-500"
              style={{ opacity: isSorting ? 0.25 : 1, transform: isSorting ? "scale(0.85)" : "scale(1)" }}
            >
              <p className="text-white/80 font-bold text-sm font-body">{fmt(v)}</p>
            </div>
          ))}
        </div>
      </div>

      {!sortRevealed ? (
        <button
          onClick={handleSort}
          disabled={isSorting}
          className={`w-full text-sm font-bold font-body py-2.5 rounded-lg transition-all cursor-pointer ${
            isSorting ? "bg-purple-800/50 text-purple-400" : "bg-purple-600 hover:bg-purple-500 text-white"
          }`}
        >
          {isSorting ? t.sorting : t.sortBtn}
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="font-body text-xs text-purple-300 mb-2 uppercase tracking-wide font-bold">{t.sortedLabel}</p>
            <div className="flex flex-wrap gap-2">
              {sorted.map((v, i) => (
                <div
                  key={i}
                  className="bg-purple-800/50 border border-purple-500/50 rounded-lg px-3 py-2 text-center transition-all duration-500"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <p className="text-purple-200 font-bold text-sm font-body">{fmt(v)}</p>
                  <p className="text-purple-400/60 text-xs font-body">{ord(i + 1, language)}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={goToSorted}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {t.btnNext2}
          </button>
        </div>
      )}
    </div>
  );

  /* ── Layar 3: Data Terurut (permanen) ── */
  if (screen === "sorted") return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar3}</span>
          <p className="font-body text-sm font-bold text-purple-300">{t.sortedTitle}</p>
        </div>
        <button
          onClick={() => { playPopSound(); setScreen("sort"); setSortRevealed(true); }}
          className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors"
        >
          {t.back}
        </button>
      </div>

      {/* Chips terurut — ukuran penuh, label lengkap */}
      <div>
        <p className="font-body text-xs text-purple-300 mb-3 uppercase tracking-wide font-bold">{t.sortedFull}</p>
        <div className="flex flex-wrap gap-2">
          {sorted.map((v, i) => (
            <div
              key={i}
              className="bg-purple-800/50 border border-purple-500/50 rounded-lg px-3 py-2 text-center"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <p className="text-purple-200 font-bold text-sm font-body">{fmt(v)}</p>
              <p className="text-purple-400/60 text-xs font-body">{ord(i + 1, language)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info n dan posisi median */}
      <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
          <div className="bg-slate-900/60 rounded-lg p-2.5">
            <p className="text-white/40 mb-1">{t.n}</p>
            <p className="text-white font-bold text-lg">{n}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2.5">
            <p className="text-white/40 mb-1">{t.jenisN}</p>
            <p className={`font-bold text-lg ${isOdd ? "text-purple-300" : "text-cyan-300"}`}>
              {isOdd ? t.ganjil : t.genap}
            </p>
          </div>
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-2.5">
            <p className="text-white/40 mb-1">{t.posisiMedian}</p>
            <p className="text-purple-300 font-bold text-xs leading-tight">
              {isOdd ? ord(medianIdx1 + 1, language) : `${ord(medianIdx1 + 1, language)} & ${ord(medianIdx2 + 1, language)}`}
            </p>
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          {isOdd ? (
            <p className="font-body text-xs text-white/60">
              {language === "id"
                ? <>n = {n} (ganjil) → posisi tengah = <strong className="text-purple-300">{`(${n}+1)/2 = ${medianIdx1 + 1}`}</strong> → nilai {ord(medianIdx1 + 1, language)} = <strong className="text-purple-300">{fmt(sorted[medianIdx1])}</strong></>
                : language === "en"
                ? <>n = {n} (odd) → middle position = <strong className="text-purple-300">{`(${n}+1)/2 = ${medianIdx1 + 1}`}</strong> → value {ord(medianIdx1 + 1, language)} = <strong className="text-purple-300">{fmt(sorted[medianIdx1])}</strong></>
                : <>n = {n}（奇数）→ 中央の位置 = <strong className="text-purple-300">{`(${n}+1)/2 = ${medianIdx1 + 1}`}</strong> → {ord(medianIdx1 + 1, language)}の値 = <strong className="text-purple-300">{fmt(sorted[medianIdx1])}</strong></>}
            </p>
          ) : (
            <p className="font-body text-xs text-white/60">
              {language === "id"
                ? <>n = {n} (genap) → dua nilai tengah = <strong className="text-purple-300">{ord(medianIdx1 + 1, language)}</strong> dan <strong className="text-purple-300">{ord(medianIdx2 + 1, language)}</strong> → rata-ratakan keduanya</>
                : language === "en"
                ? <>n = {n} (even) → the two middle values = <strong className="text-purple-300">{ord(medianIdx1 + 1, language)}</strong> and <strong className="text-purple-300">{ord(medianIdx2 + 1, language)}</strong> → average them</>
                : <>n = {n}（偶数）→ 中央の2つの値 = <strong className="text-purple-300">{ord(medianIdx1 + 1, language)}</strong> と <strong className="text-purple-300">{ord(medianIdx2 + 1, language)}</strong> → その平均を取る</>}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={startMedianAnimation}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        {t.startAnim}
      </button>
    </div>
  );

  /* ── Layar 4: Penentuan Median (Slow Motion) ── */
  return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar4}</span>
          <p className="font-body text-sm font-bold text-purple-300">{t.medianTitle}</p>
        </div>
        <button
          onClick={() => { playPopSound(); setScreen("sorted"); setIsAnimating(false); }}
          className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors"
        >
          {t.back}
        </button>
      </div>

      {/* Baris referensi — data terurut SELALU tampil, tidak berubah */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-3">
        <SortedReferenceRow label={t.refLabel} />
      </div>

      <div className="border-t border-slate-700/50 pt-3 space-y-3">
        {!medianDone && (
          <p className="font-body text-xs text-white/40 text-center">
            {isAnimating
              ? `⬅️ ${language === "id" ? "Menyingkirkan data dari ujung kiri & kanan..." : language === "en" ? "Removing data from both ends..." : "両端からデータを除外中..."} (${elimStep}/${maxElim}) ➡️`
              : t.ready}
          </p>
        )}

        {/* Chip animasi eliminasi */}
        <div className="flex flex-wrap gap-2 justify-center">
          {sorted.map((v, i) => {
            const isElim = elimStep > 0 && (i < elimStep || i >= n - elimStep);
            const isMid = medianDone && !isElim;
            const isActiveLeft = !medianDone && isAnimating && i === elimStep - 1;
            const isActiveRight = !medianDone && isAnimating && i === n - elimStep;
            return (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-center border transition-all duration-500 ${
                  isMid
                    ? "bg-purple-700/70 border-purple-400 ring-2 ring-purple-400 scale-110 shadow-lg shadow-purple-500/40"
                    : isElim
                    ? "bg-slate-800/30 border-slate-700/30 opacity-20 scale-90"
                    : isActiveLeft || isActiveRight
                    ? "bg-red-900/40 border-red-500/60 scale-105"
                    : "bg-slate-700/60 border-slate-500/50"
                }`}
              >
                <p className={`font-bold text-sm font-body ${
                  isMid ? "text-purple-200" : isElim ? "text-white/30 line-through" : "text-white/80"
                }`}>
                  {fmt(v)}
                </p>
                <p className={`text-xs font-body ${isMid ? "text-purple-400" : "text-white/30"}`}>
                  {ord(i + 1, language)}
                </p>
              </div>
            );
          })}
        </div>

        {isAnimating && !medianDone && (
          <div className="flex justify-between text-xs font-body px-2">
            <span className="text-red-400 font-bold">{t.leftArrow}</span>
            <span className="text-red-400 font-bold">{t.rightArrow}</span>
          </div>
        )}

        {/* Hasil */}
        {medianDone && (
          <div className="space-y-3">
            <div className="bg-slate-900/70 rounded-lg p-3 text-center overflow-x-auto">
              {isOdd ? (
                <BlockMath math={`\\text{Me} = x_{\\left(\\frac{${n}+1}{2}\\right)} = x_{(${medianIdx1 + 1})} = ${fmt(sorted[medianIdx1])}`} />
              ) : (
                <BlockMath math={`\\text{Me} = \\frac{x_{(${medianIdx1 + 1})} + x_{(${medianIdx2 + 1})}}{2} = \\frac{${fmt(sorted[medianIdx1])} + ${fmt(sorted[medianIdx2])}}{2} = ${fmt(medianValue)}`} />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
              <div className="bg-slate-800/60 rounded-lg p-2">
                <p className="text-white/40 mb-1">{t.n}</p>
                <p className="text-white font-bold text-base">{n}</p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-2">
                <p className="text-white/40 mb-1">{t.jenisN}</p>
                <p className={`font-bold text-base ${isOdd ? "text-purple-300" : "text-cyan-300"}`}>
                  {isOdd ? t.ganjil : t.genap}
                </p>
              </div>
              <div className="bg-purple-900/50 border border-purple-500/40 rounded-lg p-2">
                <p className="text-white/40 mb-1">{t.medianVal}</p>
                <p className="text-purple-300 font-bold text-base">{fmt(medianValue)}</p>
              </div>
            </div>
            <button
              onClick={goToInput}
              className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-white text-sm font-bold font-body py-2 rounded-lg transition-colors cursor-pointer"
            >
              {t.retryBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Animasi Interaktif Modus Data Tunggal ─── */
const ModusAnimator = () => {
  const { language } = useLanguage();
  const [screen, setScreen] = useState<"input" | "count" | "result">("input");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<number[]>([]);
  const [countStep, setCountStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countDone, setCountDone] = useState(false);

  const fmt = (v: number) =>
    Number.isInteger(v) ? v.toString() : parseFloat(v.toFixed(2)).toString();

  const n = data.length;
  const uniqueVals = [...new Set(data)].sort((a, b) => a - b);

  const t = {
    id: {
      layar1: "Layar 1 / 3", inputTitle: "🔢 Input Data",
      inputDescA: "Masukkan data angka dipisah ", inputDescBold: "koma", inputDescB: ". Boleh ada nilai yang berulang.",
      contohLabel: "Contoh: ",
      errMin: "Masukkan minimal 3 angka!",
      errMax: "Maksimal 15 angka agar animasi optimal.",
      errInvalid: "Pastikan semua data adalah angka yang valid.",
      btnNext1: "Lanjut → Hitung Frekuensi",
      layar2: "Layar 2 / 3", countTitle: "📊 Hitung Frekuensi", back: "← Kembali",
      dataLabel: (n: number) => `Data (${n} nilai):`,
      freqTableLabel: "Tabel frekuensi:",
      countingBtn: (step: number, n: number) => `⏳ Menghitung... (${step}/${n})`,
      startCountBtn: "▶ Mulai Hitung Frekuensi",
      seeModeBtn: "🏆 Lihat Modus →",
      layar3: "Layar 3 / 3", resultTitle: "🏆 Modus Ditemukan!",
      chartLabel: "📊 Grafik Frekuensi:",
      modeBadge: "← MODUS",
      appearedA: "Nilai yang muncul ", appearedB: "× (terbanyak):",
      timesAppeared: "× muncul",
      modusEq: "Modus (Mo)",
      dan: " dan ",
      noModeA: "Semua nilai muncul ", noModeB: "× — tidak ada nilai yang dominan.",
      retryBtn: "🔄 Coba Data Lain",
      noMode: "Tidak Ada Modus",
    },
    en: {
      layar1: "Screen 1 / 3", inputTitle: "🔢 Input Data",
      inputDescA: "Enter numbers separated by a ", inputDescBold: "comma", inputDescB: ". Repeated values are allowed.",
      contohLabel: "Example: ",
      errMin: "Enter at least 3 numbers!",
      errMax: "Maximum 15 numbers for a smooth animation.",
      errInvalid: "Make sure all values are valid numbers.",
      btnNext1: "Next → Count Frequencies",
      layar2: "Screen 2 / 3", countTitle: "📊 Count Frequencies", back: "← Back",
      dataLabel: (n: number) => `Data (${n} values):`,
      freqTableLabel: "Frequency table:",
      countingBtn: (step: number, n: number) => `⏳ Counting... (${step}/${n})`,
      startCountBtn: "▶ Start Counting Frequencies",
      seeModeBtn: "🏆 View Mode →",
      layar3: "Screen 3 / 3", resultTitle: "🏆 Mode Found!",
      chartLabel: "📊 Frequency Chart:",
      modeBadge: "← MODE",
      appearedA: "Value(s) appearing ", appearedB: "× (the most):",
      timesAppeared: "× occurrences",
      modusEq: "Mode (Mo)",
      dan: " and ",
      noModeA: "Every value appears ", noModeB: "× — no value is dominant.",
      retryBtn: "🔄 Try Other Data",
      noMode: "No Mode",
    },
    ja: {
      layar1: "画面 1 / 3", inputTitle: "🔢 データ入力",
      inputDescA: "数値を", inputDescBold: "カンマ", inputDescB: "で区切って入力してください。同じ値が複数あってもOKです。",
      contohLabel: "例：",
      errMin: "最低3つの数値を入力してください！",
      errMax: "アニメーションのため最大15個までです。",
      errInvalid: "すべてのデータが有効な数値であることを確認してください。",
      btnNext1: "次へ → 度数を数える",
      layar2: "画面 2 / 3", countTitle: "📊 度数を数える", back: "← 戻る",
      dataLabel: (n: number) => `データ（${n}個）：`,
      freqTableLabel: "度数表：",
      countingBtn: (step: number, n: number) => `⏳ 数えています... (${step}/${n})`,
      startCountBtn: "▶ 度数を数え始める",
      seeModeBtn: "🏆 最頻値を見る →",
      layar3: "画面 3 / 3", resultTitle: "🏆 最頻値が見つかりました！",
      chartLabel: "📊 度数グラフ：",
      modeBadge: "← 最頻値",
      appearedA: "", appearedB: "回（最多）出現した値：",
      timesAppeared: "回出現",
      modusEq: "最頻値 (Mo)",
      dan: "と",
      noModeA: "すべての値が", noModeB: "回出現 — 支配的な値はありません。",
      retryBtn: "🔄 別のデータで試す",
      noMode: "最頻値なし",
    },
  }[language];

  /* frekuensi berjalan sampai countStep */
  const runningFreq: Record<string, number> = {};
  for (let i = 0; i < countStep; i++) {
    const k = fmt(data[i]);
    runningFreq[k] = (runningFreq[k] || 0) + 1;
  }

  /* frekuensi lengkap */
  const fullFreq: Record<string, number> = {};
  for (const v of data) {
    const k = fmt(v);
    fullFreq[k] = (fullFreq[k] || 0) + 1;
  }

  const maxFreq = uniqueVals.length > 0 ? Math.max(...uniqueVals.map(v => fullFreq[fmt(v)] || 0)) : 0;
  const modeVals = uniqueVals.filter(v => fullFreq[fmt(v)] === maxFreq);
  const hasMode = modeVals.length < uniqueVals.length;
  const modeType = !hasMode ? t.noMode
    : modeVals.length === 1 ? "Unimodal"
    : modeVals.length === 2 ? "Bimodal"
    : "Multimodal";

  /* auto-step animasi hitung */
  useEffect(() => {
    if (!isAnimating) return;
    if (countStep >= n) {
      const tt = setTimeout(() => { setCountDone(true); setIsAnimating(false); }, 500);
      return () => clearTimeout(tt);
    }
    const tt = setTimeout(() => {
      setCountStep(prev => prev + 1);
      playPopSound();
    }, 650);
    return () => clearTimeout(tt);
  }, [isAnimating, countStep, n]);

  const goToInput = () => {
    playPopSound();
    setScreen("input");
    setCountStep(0);
    setIsAnimating(false);
    setCountDone(false);
  };

  const handleSubmit = () => {
    playPopSound();
    setError("");
    const parts = input.split(",").map(s => s.trim()).filter(s => s !== "");
    if (parts.length < 3) { setError(t.errMin); return; }
    if (parts.length > 15) { setError(t.errMax); return; }
    const vals = parts.map(p => parseFloat(p.replace(",", ".")));
    if (vals.some(isNaN)) { setError(t.errInvalid); return; }
    setData(vals);
    setCountStep(0);
    setCountDone(false);
    setIsAnimating(false);
    setScreen("count");
  };

  const startCounting = () => {
    if (isAnimating) return;
    playPopSound();
    setCountStep(0);
    setCountDone(false);
    setTimeout(() => setIsAnimating(true), 300);
  };

  /* ── Layar 1: Input ── */
  if (screen === "input") return (
    <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar1}</span>
        <p className="font-body text-sm font-bold text-orange-300">{t.inputTitle}</p>
      </div>
      <p className="font-body text-xs text-white/55 leading-relaxed">
        {t.inputDescA}<strong className="text-orange-300">{t.inputDescBold}</strong>{t.inputDescB}
        <br /><span className="text-white/35">{t.contohLabel}</span><span className="text-orange-300 font-mono">4, 7, 2, 7, 9, 7, 3, 5, 7</span>
      </p>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="4, 7, 2, 7, 9, 7, 3, 5, 7"
        className="w-full bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2.5 outline-none focus:border-orange-500 placeholder:text-white/25"
      />
      {error && <p className="text-red-400 text-xs font-body">⚠️ {error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        {t.btnNext1}
      </button>
    </div>
  );

  /* ── Layar 2: Hitung Frekuensi (Slow Motion) ── */
  if (screen === "count") return (
    <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar2}</span>
          <p className="font-body text-sm font-bold text-orange-300">{t.countTitle}</p>
        </div>
        <button onClick={goToInput} className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors">{t.back}</button>
      </div>

      {/* Chips data — chip aktif menyala oranye */}
      <div>
        <p className="font-body text-xs text-white/40 mb-2 uppercase tracking-wide font-semibold">
          {t.dataLabel(n)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {data.map((v, i) => {
            const isPast = i < countStep;
            const isCurrent = i === countStep - 1;
            return (
              <div
                key={i}
                className={`rounded-lg px-2.5 py-1.5 text-center border transition-all duration-300 ${
                  isCurrent
                    ? "bg-orange-600/70 border-orange-400 ring-2 ring-orange-400 scale-110 shadow-md shadow-orange-500/30"
                    : isPast
                    ? "bg-orange-900/30 border-orange-700/40"
                    : "bg-slate-700/50 border-slate-600/40"
                }`}
              >
                <p className={`font-bold text-sm font-body ${
                  isCurrent ? "text-orange-200" : isPast ? "text-orange-300/60" : "text-white/50"
                }`}>
                  {fmt(v)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabel frekuensi terbentuk secara real-time */}
      <div>
        <p className="font-body text-xs text-white/40 mb-2 uppercase tracking-wide font-semibold">{t.freqTableLabel}</p>
        <div className="space-y-1.5">
          {uniqueVals.map(v => {
            const k = fmt(v);
            const freq = runningFreq[k] || 0;
            return (
              <div
                key={k}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition-all duration-300 ${
                  freq > 0 ? "bg-orange-900/20 border-orange-700/30" : "bg-slate-800/30 border-slate-700/20 opacity-40"
                }`}
              >
                <div className="w-8 text-center">
                  <span className={`font-bold text-sm font-body ${freq > 0 ? "text-orange-300" : "text-white/30"}`}>
                    {fmt(v)}
                  </span>
                </div>
                <div className="flex gap-1 flex-1 flex-wrap min-h-[1.25rem]">
                  {Array.from({ length: freq }).map((_, ti) => (
                    <span key={ti} className="text-orange-400 text-base leading-none">●</span>
                  ))}
                </div>
                <div className="w-6 text-center">
                  <span className={`font-bold text-sm font-body ${freq > 0 ? "text-white" : "text-white/20"}`}>
                    {freq > 0 ? freq : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!countDone ? (
        <button
          onClick={startCounting}
          disabled={isAnimating}
          className={`w-full text-sm font-bold font-body py-2.5 rounded-lg transition-all cursor-pointer ${
            isAnimating ? "bg-orange-800/50 text-orange-400" : "bg-orange-600 hover:bg-orange-500 text-white"
          }`}
        >
          {isAnimating ? t.countingBtn(countStep, n) : t.startCountBtn}
        </button>
      ) : (
        <button
          onClick={() => { playPopSound(); setScreen("result"); }}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          {t.seeModeBtn}
        </button>
      )}
    </div>
  );

  /* ── Layar 3: Hasil Modus ── */
  return (
    <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">{t.layar3}</span>
          <p className="font-body text-sm font-bold text-orange-300">{t.resultTitle}</p>
        </div>
        <button
          onClick={() => { playPopSound(); setScreen("count"); }}
          className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors"
        >
          {t.back}
        </button>
      </div>

      {/* Bar chart frekuensi */}
      <div>
        <p className="font-body text-xs text-orange-300 mb-3 uppercase tracking-wide font-bold">{t.chartLabel}</p>
        <div className="space-y-2">
          {uniqueVals.map(v => {
            const k = fmt(v);
            const freq = fullFreq[k];
            const isMode = hasMode && freq === maxFreq;
            const barPct = Math.round((freq / maxFreq) * 100);
            return (
              <div
                key={k}
                className={`rounded-lg p-2.5 border transition-all duration-500 ${
                  isMode
                    ? "bg-orange-900/40 border-orange-400/60 ring-1 ring-orange-400/40 shadow-md shadow-orange-500/20"
                    : "bg-slate-800/40 border-slate-700/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 text-center font-bold text-sm font-body ${isMode ? "text-orange-300" : "text-white/60"}`}>
                    {fmt(v)}
                  </div>
                  <div className="flex-1 bg-slate-900/60 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isMode ? "bg-orange-500" : "bg-slate-600"}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <div className={`w-6 text-center font-bold text-sm font-body ${isMode ? "text-orange-300" : "text-white/50"}`}>
                    {freq}×
                  </div>
                  {isMode && <span className="text-orange-400 text-xs font-bold">{t.modeBadge}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hasil & label tipe modus */}
      <div className={`rounded-xl p-4 space-y-3 border ${
        hasMode ? "bg-orange-900/30 border-orange-500/40" : "bg-slate-800/50 border-slate-600/40"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-body ${
            !hasMode ? "bg-slate-600/40 text-slate-300"
            : modeVals.length === 1 ? "bg-orange-500/20 text-orange-300"
            : modeVals.length === 2 ? "bg-yellow-500/20 text-yellow-300"
            : "bg-red-500/20 text-red-300"
          }`}>
            {modeType}
          </span>
        </div>

        {hasMode ? (
          <div className="space-y-2">
            <p className="font-body text-xs text-white/55">
              {t.appearedA}<strong className="text-orange-300">{maxFreq}</strong>{t.appearedB}
            </p>
            <div className="flex flex-wrap gap-2">
              {modeVals.map(v => (
                <div
                  key={fmt(v)}
                  className="bg-orange-600/40 border-2 border-orange-400 ring-2 ring-orange-400/50 rounded-lg px-4 py-2 text-center shadow-lg shadow-orange-500/20"
                >
                  <p className="text-orange-200 font-bold text-xl font-body">{fmt(v)}</p>
                  <p className="text-orange-400 text-xs font-body">{maxFreq}{t.timesAppeared}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2.5 text-center">
              <p className="font-body text-xs text-white/60">
                <strong className="text-orange-300">{t.modusEq}</strong> ={" "}
                <strong className="text-white">{modeVals.map(v => fmt(v)).join(t.dan)}</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="font-body text-sm text-slate-400 text-center py-1">
            {t.noModeA}<strong className="text-white">{maxFreq}</strong>{t.noModeB}
          </p>
        )}
      </div>

      <button
        onClick={goToInput}
        className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-white text-sm font-bold font-body py-2 rounded-lg transition-colors cursor-pointer"
      >
        {t.retryBtn}
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE-LEVEL TRANSLATIONS
───────────────────────────────────────────────────────────── */

const pageTrans = {
  id: {
    h1: "UKURAN PEMUSATAN DATA",
    h2: "Median & Modus",
    ctx: "Kelas 9 · Statistika · Materi Matematika",
    back: "← Kembali ke Statistika",
    contohLabel: "Contoh",
    pembahasan: "PEMBAHASAN:",
    langkah: "Langkah",
  },
  en: {
    h1: "MEASURES OF CENTRAL TENDENCY",
    h2: "Median & Mode",
    ctx: "Grade 9 · Statistics · Math Material",
    back: "← Back to Statistics",
    contohLabel: "Example",
    pembahasan: "SOLUTION:",
    langkah: "Step",
  },
  ja: {
    h1: "データの中心を示す尺度",
    h2: "中央値と最頻値",
    ctx: "中学3年・統計・数学教材",
    back: "← 統計に戻る",
    contohLabel: "例題",
    pembahasan: "解説：",
    langkah: "ステップ",
  },
} as const;

const sectionTitles = {
  id: {
    intro: "🌟 Median & Modus — Dua Saudara Rata-Rata",
    konsep1: "📘 Sub-Bab 1: Median Data Tunggal (Jumlah Data Ganjil)",
    contoh1: "📝 Contoh Soal — Median Data Ganjil",
    konsep2: "📘 Sub-Bab 2: Median Data Tunggal (Jumlah Data Genap)",
    contoh2: "📝 Contoh Soal — Median Data Tunggal (Genap)",
    konsep4: "📘 Sub-Bab 4: Modus Data Tunggal",
    contoh4: "📝 Contoh Soal — Modus Data Tunggal",
    rangkuman: "🏁 Rangkuman Median & Modus",
  },
  en: {
    intro: "🌟 Median & Mode — Two Siblings of the Average",
    konsep1: "📘 Sub-Topic 1: Median of Single Data (Odd Count)",
    contoh1: "📝 Examples — Median with Odd Data",
    konsep2: "📘 Sub-Topic 2: Median of Single Data (Even Count)",
    contoh2: "📝 Examples — Median of Single Data (Even)",
    konsep4: "📘 Sub-Topic 4: Mode of Single Data",
    contoh4: "📝 Examples — Mode of Single Data",
    rangkuman: "🏁 Summary — Median & Mode",
  },
  ja: {
    intro: "🌟 中央値と最頻値 — 平均のふたごの兄弟",
    konsep1: "📘 サブトピック1：単一データの中央値（データ数が奇数）",
    contoh1: "📝 例題 — 奇数個のデータの中央値",
    konsep2: "📘 サブトピック2：単一データの中央値（データ数が偶数）",
    contoh2: "📝 例題 — 単一データの中央値（偶数）",
    konsep4: "📘 サブトピック4：単一データの最頻値",
    contoh4: "📝 例題 — 単一データの最頻値",
    rangkuman: "🏁 まとめ — 中央値と最頻値",
  },
} as const;

const introTrans = {
  id: {
    lead: "Selain rata-rata, ada dua ukuran pemusatan data lain yang sering digunakan:",
    medianDesc: "Nilai tengah setelah data diurutkan. Tidak terpengaruh nilai ekstrem.",
    medianNote: "Cocok untuk data yang ada nilai sangat besar/kecil.",
    modusDesc: "Nilai yang paling sering muncul dalam data. Bisa lebih dari satu.",
    modusNote: "Cocok untuk data kategori atau nilai terpopuler.",
    compareLabel: "Perbandingan singkat:",
    compareText: " Gaji 5 karyawan = 3, 3, 4, 5, 100 juta. Rata-rata = 23 juta (tidak representatif karena terpengaruh angka 100). Median = 4 juta (lebih representatif). Modus = 3 juta (paling sering muncul). 🚀",
  },
  en: {
    lead: "Besides the mean, there are two other commonly used measures of central tendency:",
    medianDesc: "The middle value once the data is sorted. Unaffected by extreme values.",
    medianNote: "Great for data containing a very large or very small value.",
    modusDesc: "The value that appears most often in the data. There can be more than one.",
    modusNote: "Great for categorical data or the most popular value.",
    compareLabel: "Quick comparison:",
    compareText: " Salaries of 5 employees = 3, 3, 4, 5, 100 million. Mean = 23 million (not representative, skewed by the 100). Median = 4 million (more representative). Mode = 3 million (appears most often). 🚀",
  },
  ja: {
    lead: "平均値のほかに、よく使われるデータの中心を示す尺度が2つあります：",
    medianDesc: "データを並べ替えたあとの中央の値。極端な値の影響を受けません。",
    medianNote: "非常に大きい・小さい値があるデータに向いています。",
    modusDesc: "データの中で最も頻繁に出現する値。複数ある場合もあります。",
    modusNote: "カテゴリーデータや最も人気のある値に向いています。",
    compareLabel: "簡単な比較：",
    compareText: " 5人の従業員の給料 = 300万、300万、400万、500万、1億円。平均 = 2300万円（1億円に引っ張られ、代表的ではない）。中央値 = 400万円（より代表的）。最頻値 = 300万円（最も多く出現）。🚀",
  },
} as const;

const konsep1Trans = {
  id: {
    heading: "🎯 Ringkasan Intisari",
    intro1: "Ketika banyak data (", intro2: ") adalah ", intro3: "bilangan ganjil", intro4: ", ada tepat satu nilai di posisi tengah setelah data diurutkan. Nilai inilah yang menjadi median.",
    rumusLabel: "Rumus posisi median (n ganjil)",
    rumusNote1: "Median = nilai data pada urutan ke-",
    illustTitle: "📌 Ilustrasi Median Data Ganjil (n = 7)",
    illustData: "Data terurut: 12, 15, 18, ",
    illustExplainA: " (ganjil) → posisi median = ",
    illustResultA: "Median = data urutan ke-4 = ",
    tipsLabel: "Langkah mencari median:",
    tipsText1: " (1) Urutkan data dari kecil ke besar. (2) Hitung banyak data (", tipsText2: "). (3) Jika ", tipsText3: " ganjil, median = data urutan ke-",
    tryLabel: "🎮 Coba Sendiri — Animasi Penentuan Median",
    tryDesc: "Masukkan data kamu sendiri dan lihat proses penentuan median secara visual, langkah demi langkah. Berlaku untuk n ganjil maupun genap!",
  },
  en: {
    heading: "🎯 Key Summary",
    intro1: "When the amount of data (", intro2: ") is an ", intro3: "odd number", intro4: ", there is exactly one value at the middle position once the data is sorted. That value becomes the median.",
    rumusLabel: "Median position formula (n odd)",
    rumusNote1: "Median = the value at position ",
    illustTitle: "📌 Illustration of an Odd-Data Median (n = 7)",
    illustData: "Sorted data: 12, 15, 18, ",
    illustExplainA: " (odd) → median position = ",
    illustResultA: "Median = the value at position 4 = ",
    tipsLabel: "Steps to find the median:",
    tipsText1: " (1) Sort the data from smallest to largest. (2) Count the amount of data (", tipsText2: "). (3) If ", tipsText3: " is odd, the median = the value at position ",
    tryLabel: "🎮 Try It Yourself — Median Animation",
    tryDesc: "Enter your own data and watch the median-finding process visually, step by step. Works for both odd and even n!",
  },
  ja: {
    heading: "🎯 要点まとめ",
    intro1: "データの個数（", intro2: "）が", intro3: "奇数", intro4: "のとき、データを並べ替えた後、中央の位置にちょうど1つの値があります。この値が中央値になります。",
    rumusLabel: "中央値の位置の公式（nが奇数）",
    rumusNote1: "中央値 = 順位が",
    illustTitle: "📌 奇数データの中央値の例（n = 7）",
    illustData: "並べ替えたデータ：12, 15, 18, ",
    illustExplainA: "（奇数）→ 中央値の位置 = ",
    illustResultA: "中央値 = 順位4番目の値 = ",
    tipsLabel: "中央値を求めるステップ：",
    tipsText1: "（1）データを小さい順に並べ替える。（2）データの個数（", tipsText2: "）を数える。（3）", tipsText3: "が奇数の場合、中央値 = 順位が",
    tryLabel: "🎮 自分で試そう — 中央値決定アニメーション",
    tryDesc: "自分のデータを入力して、中央値を求める過程を1ステップずつ視覚的に確認しましょう。nが奇数でも偶数でも使えます！",
  },
} as const;

const konsep2Trans = {
  id: {
    heading: "🎯 Ringkasan Intisari",
    intro1: "Ketika banyak data (", intro2: ") adalah ", intro3: "bilangan genap", intro4: ", tidak ada satu nilai tepat di tengah. Median diperoleh dengan merata-ratakan dua nilai yang berada di posisi tengah.",
    rumusLabel: "Rumus Median (n genap)",
    rumusNote1: "Median = rata-rata data urutan ke-", rumusNote2: " dan ke-",
    illustTitle: "📌 Ilustrasi Median Data Genap (n = 8)",
    illustData: "Data terurut: 10, 14, 18, ",
    illustExplainA: " (genap) → dua nilai tengah = ke-4 dan ke-5",
    compareTitle: "🔍 Perbandingan: Ganjil vs Genap",
    colKondisi: "Kondisi", colGanjil: "n Ganjil", colGenap: "n Genap",
    rowPosisi: "Posisi tengah", rowNilai: "Nilai median",
    rowNilai1: "1 nilai langsung", rowNilai2: "Rata-rata 2 nilai tengah",
    rowContoh9: "Contoh (n=9)", rowContoh10: "Contoh (n=10)",
    dataKe5: "data ke-5", rata2: "rata2 data ke-5 & ke-6",
    tipsLabel: "Tips cepat:",
    tipsText: " Selalu urutkan data terlebih dahulu! Ini adalah langkah paling sering terlupakan yang menyebabkan kesalahan dalam mencari median.",
  },
  en: {
    heading: "🎯 Key Summary",
    intro1: "When the amount of data (", intro2: ") is an ", intro3: "even number", intro4: ", there is no single value exactly in the middle. The median is found by averaging the two values at the middle positions.",
    rumusLabel: "Median formula (n even)",
    rumusNote1: "Median = the average of the values at position ", rumusNote2: " and ",
    illustTitle: "📌 Illustration of an Even-Data Median (n = 8)",
    illustData: "Sorted data: 10, 14, 18, ",
    illustExplainA: " (even) → the two middle values = positions 4 and 5",
    compareTitle: "🔍 Comparison: Odd vs Even",
    colKondisi: "Condition", colGanjil: "n Odd", colGenap: "n Even",
    rowPosisi: "Middle position", rowNilai: "Median value",
    rowNilai1: "1 value directly", rowNilai2: "Average of 2 middle values",
    rowContoh9: "Example (n=9)", rowContoh10: "Example (n=10)",
    dataKe5: "value at position 5", rata2: "average of values at positions 5 & 6",
    tipsLabel: "Quick tip:",
    tipsText: " Always sort the data first! This is the most commonly forgotten step, and skipping it causes errors when finding the median.",
  },
  ja: {
    heading: "🎯 要点まとめ",
    intro1: "データの個数（", intro2: "）が", intro3: "偶数", intro4: "のとき、ちょうど中央にある値は1つもありません。中央値は、中央の位置にある2つの値の平均を取って求めます。",
    rumusLabel: "中央値の公式（nが偶数）",
    rumusNote1: "中央値 = 順位が", rumusNote2: "番目と",
    illustTitle: "📌 偶数データの中央値の例（n = 8）",
    illustData: "並べ替えたデータ：10, 14, 18, ",
    illustExplainA: "（偶数）→ 中央の2つの値 = 4番目と5番目",
    compareTitle: "🔍 比較：奇数 vs 偶数",
    colKondisi: "条件", colGanjil: "nが奇数", colGenap: "nが偶数",
    rowPosisi: "中央の位置", rowNilai: "中央値",
    rowNilai1: "1つの値がそのまま", rowNilai2: "中央の2つの値の平均",
    rowContoh9: "例（n=9）", rowContoh10: "例（n=10）",
    dataKe5: "5番目の値", rata2: "5番目と6番目の値の平均",
    tipsLabel: "クイックヒント：",
    tipsText: " 必ず先にデータを並べ替えましょう！これは最も忘れられがちなステップで、中央値の計算ミスの原因になります。",
  },
} as const;

const konsep4Trans = {
  id: {
    heading: "🎯 Ringkasan Intisari",
    intro1: "Modus", intro2: " adalah nilai yang paling sering muncul dalam sekumpulan data. Berbeda dengan rata-rata dan median, modus ", intro3: "tidak perlu mengurutkan data", intro4: " — cukup cari nilai yang frekuensinya terbesar.",
    uniLabel: "Unimodal", uniDesc: "Hanya satu nilai terbanyak", uniData: "Data: 2, 3, ", uniResult: "Modus = ",
    biLabel: "Bimodal", biDesc: "Dua nilai terbanyak (sama frekuensi)", biData: "Data: 2, ", biResultLabel: "Modus = ", biResult: "3 dan 5",
    noneLabel: "Tidak Memiliki Modus", noneDesc: "Semua nilai frekuensinya sama", noneData: "Data: 2, 3, 5, 7, 8, 9", noneResultLabel: "Modus = ", noneResult: "tidak ada",
    exampleTitle: "📌 Contoh Mencari Modus",
    exampleData: "Data: 4, 7, 2, 7, 9, 7, 3, 5, 7, 2, 4",
    exampleResultA: "Angka 7 muncul 4 kali → Modus = ",
    tipsLabel: "Tips:",
    tipsText: " Cara paling mudah mencari modus data tunggal adalah membuat tabel frekuensi sederhana, lalu lihat nilai mana yang frekuensinya paling tinggi.",
    tryLabel: "🎮 Coba Sendiri — Animasi Penentuan Modus",
    tryDesc: "Masukkan data kamu dan lihat proses penghitungan frekuensi secara visual — modus akan ditemukan otomatis!",
  },
  en: {
    heading: "🎯 Key Summary",
    intro1: "Mode", intro2: " is the value that appears most often in a set of data. Unlike the mean and median, finding the mode ", intro3: "does not require sorting the data", intro4: " — you just need to find the value with the highest frequency.",
    uniLabel: "Unimodal", uniDesc: "Only one most-frequent value", uniData: "Data: 2, 3, ", uniResult: "Mode = ",
    biLabel: "Bimodal", biDesc: "Two most-frequent values (equal frequency)", biData: "Data: 2, ", biResultLabel: "Mode = ", biResult: "3 and 5",
    noneLabel: "No Mode", noneDesc: "Every value has the same frequency", noneData: "Data: 2, 3, 5, 7, 8, 9", noneResultLabel: "Mode = ", noneResult: "none",
    exampleTitle: "📌 Example: Finding the Mode",
    exampleData: "Data: 4, 7, 2, 7, 9, 7, 3, 5, 7, 2, 4",
    exampleResultA: "The number 7 appears 4 times → Mode = ",
    tipsLabel: "Tip:",
    tipsText: " The easiest way to find the mode of single data is to make a simple frequency table, then see which value has the highest frequency.",
    tryLabel: "🎮 Try It Yourself — Mode Animation",
    tryDesc: "Enter your own data and watch the frequency-counting process visually — the mode will be found automatically!",
  },
  ja: {
    heading: "🎯 要点まとめ",
    intro1: "最頻値", intro2: "とは、データの集まりの中で最も頻繁に出現する値です。平均値や中央値と異なり、最頻値を求めるには", intro3: "データを並べ替える必要はありません", intro4: "。頻度が最も高い値を探すだけです。",
    uniLabel: "単峰性（ユニモーダル）", uniDesc: "最多の値がひとつだけ", uniData: "データ：2, 3, ", uniResult: "最頻値 = ",
    biLabel: "双峰性（バイモーダル）", biDesc: "最多の値が2つ（同じ頻度）", biData: "データ：2, ", biResultLabel: "最頻値 = ", biResult: "3と5",
    noneLabel: "最頻値なし", noneDesc: "すべての値の頻度が同じ", noneData: "データ：2, 3, 5, 7, 8, 9", noneResultLabel: "最頻値 = ", noneResult: "なし",
    exampleTitle: "📌 最頻値を求める例",
    exampleData: "データ：4, 7, 2, 7, 9, 7, 3, 5, 7, 2, 4",
    exampleResultA: "数字7が4回出現 → 最頻値 = ",
    tipsLabel: "ヒント：",
    tipsText: " 単一データの最頻値を求める最も簡単な方法は、簡単な度数表を作り、どの値の頻度が最も高いかを見ることです。",
    tryLabel: "🎮 自分で試そう — 最頻値決定アニメーション",
    tryDesc: "自分のデータを入力して、度数を数える過程を視覚的に確認しましょう — 最頻値が自動的に見つかります！",
  },
} as const;

const rangkumanTrans = {
  id: {
    rumusTitle: "⭐ Rumus-Rumus Kunci Median & Modus",
    medianLabel: "MEDIAN", modusLabel: "MODUS",
    dataTunggalGanjil: "Data tunggal — n ganjil:",
    dataTunggalGenap: "Data tunggal — n genap:",
    dataBerkelompok: "Data berkelompok:",
    modusFreqText: "Nilai dengan frekuensi terbesar",
    colUkuran: "Ukuran", colRata: "Rata-rata", colMedian: "Median", colModus: "Modus",
    rowEkstrem: "Dipengaruhi nilai ekstrem?", rowUrut: "Perlu diurutkan?", rowSatu: "Selalu ada 1 nilai?",
    ya: "Ya", tidak: "Tidak", bisaLebih: "Bisa lebih dari 1",
    footerLabel: "Selamat! 🎉",
    footerText: " Kamu sudah menguasai Median dan Modus. Lanjutkan ke materi berikutnya: Ukuran Letak Data (Kuartil) untuk belajar cara membagi data menjadi bagian-bagian yang lebih detail! 🚀",
  },
  en: {
    rumusTitle: "⭐ Key Formulas — Median & Mode",
    medianLabel: "MEDIAN", modusLabel: "MODE",
    dataTunggalGanjil: "Single data — n odd:",
    dataTunggalGenap: "Single data — n even:",
    dataBerkelompok: "Grouped data:",
    modusFreqText: "The value with the highest frequency",
    colUkuran: "Measure", colRata: "Mean", colMedian: "Median", colModus: "Mode",
    rowEkstrem: "Affected by extreme values?", rowUrut: "Needs sorting?", rowSatu: "Always exactly 1 value?",
    ya: "Yes", tidak: "No", bisaLebih: "Can be more than 1",
    footerLabel: "Congratulations! 🎉",
    footerText: " You've mastered Median and Mode. Move on to the next topic: Measures of Position (Quartiles), to learn how to divide data into more detailed parts! 🚀",
  },
  ja: {
    rumusTitle: "⭐ 中央値と最頻値の重要な公式",
    medianLabel: "中央値", modusLabel: "最頻値",
    dataTunggalGanjil: "単一データ — nが奇数：",
    dataTunggalGenap: "単一データ — nが偶数：",
    dataBerkelompok: "グループデータ：",
    modusFreqText: "頻度が最も高い値",
    colUkuran: "尺度", colRata: "平均値", colMedian: "中央値", colModus: "最頻値",
    rowEkstrem: "極端な値の影響を受ける？", rowUrut: "並べ替えが必要？", rowSatu: "必ず1つの値になる？",
    ya: "はい", tidak: "いいえ", bisaLebih: "2つ以上になることがある",
    footerLabel: "おめでとうございます！🎉",
    footerText: " 中央値と最頻値を習得しました。次のトピック「位置の尺度（四分位数）」に進んで、データをさらに細かく分ける方法を学びましょう！🚀",
  },
} as const;

const rangkumanSectionTrans = {
  id: {
    judul: "Rangkuman — Median & Modus",
    subjudul: "Dua alternatif rata-rata yang lebih kuat saat data memiliki nilai ekstrem!",
    ringkasan: [
      { emoji: "⬆️", judul: "Median Data Ganjil", isi: "Urutkan data, lalu ambil nilai tepat di posisi tengah. Posisi tengah = (n+1)/2. Contoh: n=7, posisi median = data ke-4 setelah diurutkan." },
      { emoji: "🔀", judul: "Median Data Genap", isi: "Tidak ada satu nilai tepat di tengah. Median = rata-rata dua nilai tengah. Posisi = data ke-(n/2) dan data ke-(n/2 + 1) setelah diurutkan." },
      { emoji: "👑", judul: "Modus", isi: "Nilai yang paling sering muncul (frekuensi tertinggi). Data bisa punya: 0 modus (semua sama), 1 modus (unimodal), 2 modus (bimodal), atau lebih (multimodal)." },
      { emoji: "⚖️", judul: "Perbandingan Ketiganya", isi: "Mean terpengaruh outlier. Median tahan outlier. Modus paling mudah dicari. Distribusi normal: Mean = Median = Modus. Gunakan sesuai karakteristik data!" },
    ],
    rumus: [
      { label: "Median — n Ganjil", rumus: "\\text{Me} = x_{\\left(\\frac{n+1}{2}\\right)}" },
      { label: "Median — n Genap", rumus: "\\text{Me} = \\frac{x_{\\left(\\frac{n}{2}\\right)} + x_{\\left(\\frac{n}{2}+1\\right)}}{2}" },
    ],
    tips: [
      { emoji: "⚠️", teks: "WAJIB urutkan data dari terkecil ke terbesar SEBELUM mencari median! Median yang dicari dari data tidak terurut akan menghasilkan jawaban salah." },
      { emoji: "🎯", teks: "Modus tidak memerlukan pengurutan — cukup temukan nilai yang paling sering muncul. Jika ada dua nilai sama-sama paling sering, keduanya adalah modus." },
      { emoji: "🛡️", teks: "Median tidak terpengaruh outlier. Contoh: data gaji 10 karyawan dengan 1 bos bergaji sangat tinggi — gunakan median bukan mean agar lebih adil!" },
      { emoji: "💡", teks: "Distribusi data: jika Mean > Median > Modus, data miring ke kanan (positif). Jika Mean < Median < Modus, data miring ke kiri (negatif)." },
    ],
    kesimpulan: "Median dan Modus adalah pasangan sempurna rata-rata yang tahan terhadap nilai ekstrem. Median dipakai di statistik pendapatan nasional dan survei perumahan. Modus dipakai untuk analisis preferensi konsumen, tren fashion, dan hasil pemilihan umum. Tiga ukuran, satu tujuan: memahami pusat data!",
  },
  en: {
    judul: "Summary — Median & Mode",
    subjudul: "Two alternatives to the mean that hold up better when data has extreme values!",
    ringkasan: [
      { emoji: "⬆️", judul: "Median of Odd Data", isi: "Sort the data, then take the value exactly at the middle position. Middle position = (n+1)/2. Example: n=7, the median position is the 4th value once sorted." },
      { emoji: "🔀", judul: "Median of Even Data", isi: "There's no single value exactly in the middle. Median = average of the two middle values. Positions = the (n/2)-th and (n/2 + 1)-th values once sorted." },
      { emoji: "👑", judul: "Mode", isi: "The value that appears most often (highest frequency). Data can have: 0 modes (all equal), 1 mode (unimodal), 2 modes (bimodal), or more (multimodal)." },
      { emoji: "⚖️", judul: "Comparing All Three", isi: "The mean is affected by outliers. The median resists outliers. The mode is the easiest to find. In a normal distribution: Mean = Median = Mode. Use whichever fits your data's characteristics!" },
    ],
    rumus: [
      { label: "Median — n Odd", rumus: "\\text{Me} = x_{\\left(\\frac{n+1}{2}\\right)}" },
      { label: "Median — n Even", rumus: "\\text{Me} = \\frac{x_{\\left(\\frac{n}{2}\\right)} + x_{\\left(\\frac{n}{2}+1\\right)}}{2}" },
    ],
    tips: [
      { emoji: "⚠️", teks: "You MUST sort the data from smallest to largest BEFORE finding the median! Finding the median from unsorted data will give a wrong answer." },
      { emoji: "🎯", teks: "The mode doesn't need sorting — just find the value that appears most often. If two values are tied for most frequent, both are modes." },
      { emoji: "🛡️", teks: "The median is unaffected by outliers. Example: the salaries of 10 employees with one boss earning an extremely high salary — use the median, not the mean, for fairness!" },
      { emoji: "💡", teks: "Data distribution: if Mean > Median > Mode, the data is skewed right (positive). If Mean < Median < Mode, the data is skewed left (negative)." },
    ],
    kesimpulan: "Median and Mode are the perfect pair of averages that resist extreme values. The median is used in national income statistics and housing surveys. The mode is used to analyze consumer preferences, fashion trends, and election results. Three measures, one goal: understanding the center of data!",
  },
  ja: {
    judul: "まとめ — 中央値と最頻値",
    subjudul: "データに極端な値があるときに、より頼りになる平均の代替指標！",
    ringkasan: [
      { emoji: "⬆️", judul: "奇数データの中央値", isi: "データを並べ替えて、ちょうど中央の位置にある値を取ります。中央の位置 = (n+1)/2。例：n=7のとき、並べ替えた後の4番目の値が中央値の位置です。" },
      { emoji: "🔀", judul: "偶数データの中央値", isi: "ちょうど中央にある値は1つもありません。中央値 = 中央の2つの値の平均。位置 = 並べ替えた後の(n/2)番目と(n/2 + 1)番目の値。" },
      { emoji: "👑", judul: "最頻値", isi: "最も頻繁に出現する値（頻度が最も高い）。データには、最頻値0個（すべて同じ）、1個（単峰性）、2個（双峰性）、それ以上（多峰性）の場合があります。" },
      { emoji: "⚖️", judul: "3つの比較", isi: "平均値は外れ値の影響を受けます。中央値は外れ値に強いです。最頻値は最も求めやすいです。正規分布では：平均値 = 中央値 = 最頻値。データの特徴に合わせて使い分けましょう！" },
    ],
    rumus: [
      { label: "中央値 — nが奇数", rumus: "\\text{Me} = x_{\\left(\\frac{n+1}{2}\\right)}" },
      { label: "中央値 — nが偶数", rumus: "\\text{Me} = \\frac{x_{\\left(\\frac{n}{2}\\right)} + x_{\\left(\\frac{n}{2}+1\\right)}}{2}" },
    ],
    tips: [
      { emoji: "⚠️", teks: "中央値を求める前に、必ずデータを小さい順から大きい順に並べ替えましょう！並べ替えていないデータから中央値を求めると、間違った答えになります。" },
      { emoji: "🎯", teks: "最頻値は並べ替えが不要です — 最も頻繁に出現する値を見つけるだけです。2つの値が同じ最多頻度なら、両方が最頻値になります。" },
      { emoji: "🛡️", teks: "中央値は外れ値の影響を受けません。例：10人の従業員の給料のうち1人の上司が非常に高い給料をもらっている場合 — 公平にするため、平均値ではなく中央値を使いましょう！" },
      { emoji: "💡", teks: "データの分布：平均値 > 中央値 > 最頻値なら右に偏っている（正の歪み）。平均値 < 中央値 < 最頻値なら左に偏っている（負の歪み）。" },
    ],
    kesimpulan: "中央値と最頻値は、極端な値に強い平均の完璧なペアです。中央値は国民所得の統計や住宅調査で使われます。最頻値は消費者の好みの分析、ファッションの流行、選挙結果の分析に使われます。3つの尺度、1つの目的：データの中心を理解すること！",
  },
} as const;

const MedianModusPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pt = pageTrans[language];
  const st = sectionTitles[language];
  const it = introTrans[language];
  const k1 = konsep1Trans[language];
  const k2 = konsep2Trans[language];
  const k4 = konsep4Trans[language];
  const rt = rangkumanTrans[language];
  const rst = rangkumanSectionTrans[language];

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
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
          {pt.h1}
        </h1>
        <p className="font-display text-sm font-semibold text-purple-400 text-center mb-1">{pt.h2}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {pt.ctx}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={st.intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {it.lead}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 border border-purple-500/40 rounded-xl p-4">
                    <p className="font-display text-3xl font-bold text-purple-300 text-center mb-2">Me</p>
                    <p className="font-body text-sm font-bold text-white text-center mb-2">{rt.medianLabel}</p>
                    <p className="font-body text-xs text-white/60 text-center">{it.medianDesc}</p>
                    <p className="font-body text-xs text-purple-400 text-center mt-2 italic">{it.medianNote}</p>
                  </div>
                  <div className="bg-orange-900/40 border border-orange-500/40 rounded-xl p-4">
                    <p className="font-display text-3xl font-bold text-orange-300 text-center mb-2">Mo</p>
                    <p className="font-body text-sm font-bold text-white text-center mb-2">{rt.modusLabel}</p>
                    <p className="font-body text-xs text-white/60 text-center">{it.modusDesc}</p>
                    <p className="font-body text-xs text-orange-400 text-center mt-2 italic">{it.modusNote}</p>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>{it.compareLabel}</strong>{it.compareText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 1: MEDIAN DATA TUNGGAL (JUMLAH GANJIL) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={st.konsep1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{k1.heading}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {k1.intro1}<InlineMath math="n" />{k1.intro2}<strong className="text-purple-300">{k1.intro3}</strong>{k1.intro4}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">{k1.rumusLabel}</p>
                    <BlockMath math="\text{Me} = x_{\left(\frac{n+1}{2}\right)}" />
                    <p className="font-body text-xs text-white/50">
                      {k1.rumusNote1}<InlineMath math="\dfrac{n+1}{2}" />
                    </p>
                  </div>
                </div>

                {/* Visual median ganjil */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">{k1.illustTitle}</p>
                  <p className="font-body text-xs text-white/50 mb-3">{k1.illustData}<span className="text-purple-300 font-bold">21</span>, 25, 30, 35</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[12,15,18,21,25,30,35].map((v,i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border ${i === 3 ? "bg-purple-700/60 border-purple-400 ring-2 ring-purple-400" : "bg-slate-700/50 border-slate-600/40"}`}>
                        <p className={`font-bold text-sm ${i === 3 ? "text-purple-200" : "text-white/70"}`}>{v}</p>
                        <p className="text-white/30 text-xs">{ord(i+1, language)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1"><InlineMath math="n = 7" />{k1.illustExplainA}<InlineMath math="\frac{7+1}{2} = 4" /></p>
                    <p className="font-body text-sm text-purple-300 font-bold">{k1.illustResultA}<strong>21</strong></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{k1.tipsLabel}</strong>{k1.tipsText1}<InlineMath math="n" />{k1.tipsText2}<InlineMath math="n" />{k1.tipsText3}<InlineMath math="\frac{n+1}{2}" />.
                  </p>
                </div>

                {/* Animasi Interaktif */}
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide">{k1.tryLabel}</p>
                  <p className="font-body text-xs text-white/45 leading-relaxed">
                    {k1.tryDesc}
                  </p>
                  <MedianAnimator />
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title={st.contoh1} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("MUDAH", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? "Tentukan median dari data berikut: 9, 3, 7, 5, 11, 1, 13"
                        : language === "en" ? "Find the median of the following data: 9, 3, 7, 5, 11, 1, 13"
                        : "次のデータの中央値を求めなさい：9, 3, 7, 5, 11, 1, 13"}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? "Urutkan" : language === "en" ? "Sort" : "並べ替える"}: 1, 3, 5, <strong className="text-purple-300">7</strong>, 9, 11, 13</p>
                      <p><strong>{stepLabel(2, language)}</strong> <InlineMath math="n = 7" /> {language === "id" ? "(ganjil) → posisi tengah = " : language === "en" ? "(odd) → middle position = " : "（奇数）→ 中央の位置 = "}<InlineMath math="\frac{7+1}{2} = 4" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-purple-300 font-semibold">
                          {language === "id" ? <>Median = data urutan {ord(4, language)} = <strong>7</strong></>
                            : language === "en" ? <>Median = the value at position {ord(4, language)} = <strong>7</strong></>
                            : <>中央値 = {ord(4, language)}の値 = <strong>7</strong></>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTOH 2 — Tabel Distribusi Frekuensi Data Tunggal */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SEDANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? "Tabel distribusi frekuensi nilai ulangan Bahasa Indonesia disajikan berikut. Tentukan median nilainya!"
                        : language === "en" ? "The following frequency distribution table shows Language Arts quiz scores. Find the median score!"
                        : "以下は国語の小テストの点数の度数分布表です。点数の中央値を求めなさい！"}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1.5 text-left text-white/70">{language === "id" ? "Nilai (xᵢ)" : language === "en" ? "Score (xᵢ)" : "点数 (xᵢ)"}</th><th className="px-3 py-1.5 text-center text-white/70">{language === "id" ? "Frekuensi (fᵢ)" : language === "en" ? "Frequency (fᵢ)" : "度数 (fᵢ)"}</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["70","2"],["75","4"],["80","5"],["85","3"],["90","1"]].map(([x,f]) => (
                            <tr key={x}><td className="px-3 py-1.5 text-white font-semibold">{x}</td><td className="px-3 py-1.5 text-center text-yellow-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? <>Hitung total data <InlineMath math="n" /> dan buat frekuensi kumulatif:</> : language === "en" ? <>Calculate the total data <InlineMath math="n" /> and build the cumulative frequency:</> : <>データの合計 <InlineMath math="n" /> を計算し、累積度数を作る：</>}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">{language === "id" ? "Nilai (xᵢ)" : language === "en" ? "Score (xᵢ)" : "点数 (xᵢ)"}</th><th className="px-2 py-1 text-center text-white/50">fᵢ</th><th className="px-2 py-1 text-center text-white/50">{language === "id" ? "Frekuensi Kumulatif" : language === "en" ? "Cumulative Frequency" : "累積度数"}</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["70","2","2"],["75","4","6"],["80","5","11"],["85","3","14"],["90","1","15"]].map(([x,f,fk], i) => (
                              <tr key={x} className={i===2 ? "bg-purple-900/30" : ""}>
                                <td className={`px-2 py-1 font-semibold ${i===2 ? "text-purple-300" : "text-white/70"}`}>{x}</td>
                                <td className="px-2 py-1 text-center text-yellow-300">{f}</td>
                                <td className={`px-2 py-1 text-center font-bold ${i===2 ? "text-purple-300" : "text-white/60"}`}>{fk}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">{language === "id" ? "Total" : language === "en" ? "Total" : "合計"}</td><td className="px-2 py-1 text-center text-yellow-400">15</td><td></td></tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>{stepLabel(2, language)}</strong> <InlineMath math="n = 15" /> {language === "id" ? "(ganjil) → posisi median = " : language === "en" ? "(odd) → median position = " : "（奇数）→ 中央値の位置 = "}<InlineMath math="\frac{15+1}{2} = 8" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/50">
                          {language === "id" ? <>Data {ord(1, language)} s.d. {ord(2, language)} → Nilai <strong className="text-white">70</strong></>
                            : language === "en" ? <>Data {ord(1, language)} through {ord(2, language)} → Value <strong className="text-white">70</strong></>
                            : <>{ord(1, language)}から{ord(2, language)}のデータ → 値 <strong className="text-white">70</strong></>}
                        </p>
                        <p className="text-xs text-white/50">
                          {language === "id" ? <>Data {ord(3, language)} s.d. {ord(6, language)} → Nilai <strong className="text-white">75</strong></>
                            : language === "en" ? <>Data {ord(3, language)} through {ord(6, language)} → Value <strong className="text-white">75</strong></>
                            : <>{ord(3, language)}から{ord(6, language)}のデータ → 値 <strong className="text-white">75</strong></>}
                        </p>
                        <p className="text-xs text-purple-300 font-semibold">
                          {language === "id" ? <>Data {ord(7, language)} s.d. {ord(11, language)} → Nilai <strong>80</strong> ← posisi {ord(8, language)} ada di sini!</>
                            : language === "en" ? <>Data {ord(7, language)} through {ord(11, language)} → Value <strong>80</strong> ← position {ord(8, language)} is here!</>
                            : <>{ord(7, language)}から{ord(11, language)}のデータ → 値 <strong>80</strong> ← {ord(8, language)}の位置はここです！</>}
                        </p>
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "Median = 80" : language === "en" ? "Median = 80" : "中央値 = 80"}</strong></p>
                    </div>
                  </div>
                </div>

                {/* CONTOH 3 — Diagram Batang */}
                <div className="border-l-4 border-orange-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("DIAGRAM", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? "Diagram batang berikut menunjukkan nilai ulangan harian siswa kelas 9A. Tentukan median nilai ulangan tersebut!"
                        : language === "en" ? "The following bar chart shows the daily quiz scores of Grade 9A students. Find the median of the quiz scores!"
                        : "以下の棒グラフは9A組の生徒の日々の小テストの点数を示しています。この点数の中央値を求めなさい！"}
                    </p>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs text-white/50 text-center mb-2">
                        {language === "id" ? "📊 Diagram Batang Nilai Ulangan Kelas 9A" : language === "en" ? "📊 Bar Chart of Grade 9A Quiz Scores" : "📊 9A組の小テストの点数の棒グラフ"}
                      </p>
                      <svg viewBox="0 0 260 140" className="w-full max-h-40">
                        {/* Grid lines & y-axis labels */}
                        {[0,2,4,6].map(v => (
                          <g key={v}>
                            <line x1="35" y1={115 - v*15} x2="250" y2={115 - v*15} stroke="#334155" strokeWidth="0.5"/>
                            <text x="30" y={115 - v*15 + 3} textAnchor="end" fontSize="7" fill="#64748b">{v}</text>
                          </g>
                        ))}
                        {/* Bars */}
                        {[
                          {val:"6", f:2, cx:60,  color:"#ef4444"},
                          {val:"7", f:5, cx:100, color:"#f59e0b"},
                          {val:"8", f:6, cx:140, color:"#22c55e"},
                          {val:"9", f:4, cx:180, color:"#3b82f6"},
                          {val:"10",f:2, cx:220, color:"#a855f7"},
                        ].map(({val,f,cx,color}) => (
                          <g key={val}>
                            <rect x={cx-14} y={115-f*15} width="28" height={f*15} fill={color} fillOpacity="0.8" rx="2"/>
                            <text x={cx} y="128" textAnchor="middle" fontSize="8" fill="#94a3b8">{val}</text>
                          </g>
                        ))}
                        {/* Axes */}
                        <line x1="35" y1="20" x2="35" y2="115" stroke="#475569" strokeWidth="1"/>
                        <line x1="35" y1="115" x2="250" y2="115" stroke="#475569" strokeWidth="1"/>
                        <text x="143" y="138" textAnchor="middle" fontSize="7" fill="#64748b">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</text>
                        <text x="12" y="72" textAnchor="middle" fontSize="7" fill="#64748b" transform="rotate(-90,12,72)">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-orange-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? "Baca data dari diagram batang dan buat tabel frekuensi kumulatif:" : language === "en" ? "Read the data from the bar chart and build a cumulative frequency table:" : "棒グラフからデータを読み取り、累積度数表を作る："}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</th><th className="px-2 py-1 text-center text-white/50">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</th><th className="px-2 py-1 text-center text-white/50">{language === "id" ? "Frekuensi Kumulatif" : language === "en" ? "Cumulative Frequency" : "累積度数"}</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["6","2","2"],["7","5","7"],["8","6","13"],["9","4","17"],["10","2","19"]].map(([x,f,fk], i) => (
                              <tr key={x} className={i===2 ? "bg-purple-900/30" : ""}>
                                <td className={`px-2 py-1 font-semibold ${i===2 ? "text-purple-300" : "text-white/70"}`}>{x}</td>
                                <td className="px-2 py-1 text-center text-orange-300">{f}</td>
                                <td className={`px-2 py-1 text-center font-bold ${i===2 ? "text-purple-300" : "text-white/60"}`}>{fk}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">{language === "id" ? "Total" : language === "en" ? "Total" : "合計"}</td><td className="px-2 py-1 text-center text-orange-400">19</td><td></td></tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>{stepLabel(2, language)}</strong> <InlineMath math="n = 19" /> {language === "id" ? "(ganjil) → posisi median = " : language === "en" ? "(odd) → median position = " : "（奇数）→ 中央値の位置 = "}<InlineMath math="\frac{19+1}{2} = 10" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/50">
                          {language === "id" ? <>Data {ord(1, language)} s.d. {ord(2, language)} → Nilai <strong className="text-white">6</strong></>
                            : language === "en" ? <>Data {ord(1, language)} through {ord(2, language)} → Value <strong className="text-white">6</strong></>
                            : <>{ord(1, language)}から{ord(2, language)}のデータ → 値 <strong className="text-white">6</strong></>}
                        </p>
                        <p className="text-xs text-white/50">
                          {language === "id" ? <>Data {ord(3, language)} s.d. {ord(7, language)} → Nilai <strong className="text-white">7</strong></>
                            : language === "en" ? <>Data {ord(3, language)} through {ord(7, language)} → Value <strong className="text-white">7</strong></>
                            : <>{ord(3, language)}から{ord(7, language)}のデータ → 値 <strong className="text-white">7</strong></>}
                        </p>
                        <p className="text-xs text-purple-300 font-semibold">
                          {language === "id" ? <>Data {ord(8, language)} s.d. {ord(13, language)} → Nilai <strong>8</strong> ← posisi {ord(10, language)} ada di sini!</>
                            : language === "en" ? <>Data {ord(8, language)} through {ord(13, language)} → Value <strong>8</strong> ← position {ord(10, language)} is here!</>
                            : <>{ord(8, language)}から{ord(13, language)}のデータ → 値 <strong>8</strong> ← {ord(10, language)}の位置はここです！</>}
                        </p>
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "Median = 8" : language === "en" ? "Median = 8" : "中央値 = 8"}</strong></p>
                    </div>
                  </div>
                </div>

                {/* CONTOH 4 — SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SULIT", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id"
                        ? <>Data terdiri dari 11 bilangan yang sudah terurut. Diketahui median = 45, dan semua data di bawah median adalah 20, 25, 28, 32, <InlineMath math="a" />. Jika rata-rata data di bawah median = 27, tentukan nilai <InlineMath math="a" />!</>
                        : language === "en"
                        ? <>A dataset consists of 11 already-sorted numbers. The median = 45, and all the data below the median is 20, 25, 28, 32, <InlineMath math="a" />. If the mean of the data below the median = 27, find the value of <InlineMath math="a" />!</>
                        : <>すでに並べ替えられた11個の数からなるデータがあります。中央値 = 45で、中央値より下のデータはすべて20, 25, 28, 32, <InlineMath math="a" /> です。中央値より下のデータの平均が27のとき、<InlineMath math="a" />の値を求めなさい！</>}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>
                        {language === "id"
                          ? <><InlineMath math="n=11" /> ganjil, median = data {ord(6, language)} = 45. Data di bawah median: posisi 1–5 = 20, 25, 28, 32, <InlineMath math="a" /></>
                          : language === "en"
                          ? <><InlineMath math="n=11" /> is odd, median = the value at position {ord(6, language)} = 45. Data below the median: positions 1–5 = 20, 25, 28, 32, <InlineMath math="a" /></>
                          : <><InlineMath math="n=11" />は奇数、中央値 = {ord(6, language)}の値 = 45。中央値より下のデータ：位置1–5 = 20, 25, 28, 32, <InlineMath math="a" /></>}
                      </p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math={language === "id" ? "\\bar{x}_{\\text{bawah}} = \\frac{20+25+28+32+a}{5} = 27" : language === "en" ? "\\bar{x}_{\\text{below}} = \\frac{20+25+28+32+a}{5} = 27" : "\\bar{x}_{\\text{下}} = \\frac{20+25+28+32+a}{5} = 27"} />
                        <BlockMath math="105 + a = 135" />
                        <BlockMath math="a = 30" />
                      </div>
                      <p>
                        {language === "id" ? "Cek urutan: 20, 25, 28, 30, 32 ✓ (terurut naik, semua < 45 ✓)"
                          : language === "en" ? "Check the order: 20, 25, 28, 30, 32 ✓ (increasing, all < 45 ✓)"
                          : "順序を確認：20, 25, 28, 30, 32 ✓（昇順、すべて45未満 ✓）"}
                      </p>
                      <p><strong className="text-primary">a = 30</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 2: MEDIAN DATA TUNGGAL (JUMLAH GENAP) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-indigo-400" title={st.konsep2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-indigo-300">{k2.heading}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {k2.intro1}<InlineMath math="n" />{k2.intro2}<strong className="text-indigo-300">{k2.intro3}</strong>{k2.intro4}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">{k2.rumusLabel}</p>
                    <BlockMath math="\text{Me} = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}" />
                    <p className="font-body text-xs text-white/50">
                      {k2.rumusNote1}<InlineMath math="\frac{n}{2}" />{k2.rumusNote2}<InlineMath math="\frac{n}{2}+1" />
                    </p>
                  </div>
                </div>

                {/* Visual median genap */}
                <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">{k2.illustTitle}</p>
                  <p className="font-body text-xs text-white/50 mb-3">{k2.illustData}<span className="text-indigo-300 font-bold">20</span>, <span className="text-indigo-300 font-bold">24</span>, 28, 32, 36</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[10,14,18,20,24,28,32,36].map((v,i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border ${(i===3||i===4) ? "bg-indigo-700/60 border-indigo-400 ring-2 ring-indigo-400" : "bg-slate-700/50 border-slate-600/40"}`}>
                        <p className={`font-bold text-sm ${(i===3||i===4) ? "text-indigo-200" : "text-white/70"}`}>{v}</p>
                        <p className="text-white/30 text-xs">{ord(i+1, language)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1"><InlineMath math="n = 8" />{k2.illustExplainA}</p>
                    <BlockMath math="\text{Me} = \frac{20 + 24}{2} = \frac{44}{2} = 22" />
                  </div>
                </div>

                {/* Tabel ringkas perbandingan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl overflow-hidden">
                  <div className="bg-slate-700/40 px-4 py-2">
                    <p className="font-body text-xs font-bold text-slate-200 uppercase tracking-wide">{k2.compareTitle}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/30">
                        <th className="px-3 py-2 text-left text-white/50">{k2.colKondisi}</th>
                        <th className="px-3 py-2 text-center text-purple-300 font-bold">{k2.colGanjil}</th>
                        <th className="px-3 py-2 text-center text-indigo-300 font-bold">{k2.colGenap}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        <tr><td className="px-3 py-2 text-white/70">{k2.rowPosisi}</td><td className="px-3 py-2 text-center text-purple-300"><InlineMath math="\frac{n+1}{2}" /></td><td className="px-3 py-2 text-center text-indigo-300"><InlineMath math="\frac{n}{2}" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="\frac{n}{2}+1" /></td></tr>
                        <tr><td className="px-3 py-2 text-white/70">{k2.rowNilai}</td><td className="px-3 py-2 text-center text-purple-300">{k2.rowNilai1}</td><td className="px-3 py-2 text-center text-indigo-300">{k2.rowNilai2}</td></tr>
                        <tr><td className="px-3 py-2 text-white/70">{k2.rowContoh9}</td><td className="px-3 py-2 text-center text-purple-300">{k2.dataKe5}</td><td className="px-3 py-2 text-center text-indigo-300">—</td></tr>
                        <tr><td className="px-3 py-2 text-white/70">{k2.rowContoh10}</td><td className="px-3 py-2 text-center text-purple-300">—</td><td className="px-3 py-2 text-center text-indigo-300">{k2.rata2}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{k2.tipsLabel}</strong>{k2.tipsText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-indigo-400" title={st.contoh2} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("MUDAH", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? "Tentukan median dari data: 14, 8, 22, 5, 18, 11, 27, 3"
                        : language === "en" ? "Find the median of the data: 14, 8, 22, 5, 18, 11, 27, 3"
                        : "次のデータの中央値を求めなさい：14, 8, 22, 5, 18, 11, 27, 3"}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? "Urutkan" : language === "en" ? "Sort" : "並べ替える"}: 3, 5, 8, <strong className="text-indigo-300">11</strong>, <strong className="text-indigo-300">14</strong>, 18, 22, 27</p>
                      <p><strong>{stepLabel(2, language)}</strong> <InlineMath math="n = 8" /> {language === "id" ? "(genap) → dua nilai tengah = ke-4 dan ke-5" : language === "en" ? "(even) → the two middle values = positions 4 and 5" : "（偶数）→ 中央の2つの値 = 4番目と5番目"}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{11 + 14}{2} = \frac{25}{2} = 12{,}5" />
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "Median = 12,5" : language === "en" ? "Median = 12.5" : "中央値 = 12.5"}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SEDANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? "Data nilai matematika 12 siswa disajikan dalam tabel distribusi frekuensi tunggal berikut. Tentukan median data tersebut!"
                        : language === "en" ? "The math scores of 12 students are shown in the following single frequency distribution table. Find the median!"
                        : "12人の生徒の数学の点数が以下の単純度数分布表に示されています。データの中央値を求めなさい！"}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="text-xs font-body border-collapse">
                        <thead>
                          <tr className="bg-indigo-800/40">
                            <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</td>
                            {[60,65,70,75,80,85].map(v => (
                              <td key={v} className="border border-indigo-500/40 px-4 py-2 text-white font-bold text-center">{v}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-700/30">
                            <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</td>
                            {[1,2,3,3,2,1].map((f,i) => (
                              <td key={i} className="border border-indigo-500/40 px-4 py-2 text-green-300 font-bold text-center">{f}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? <>Hitung total data: <InlineMath math="n = 1+2+3+3+2+1 = 12" /> (genap)</> : language === "en" ? <>Calculate the total data: <InlineMath math="n = 1+2+3+3+2+1 = 12" /> (even)</> : <>データの合計を計算：<InlineMath math="n = 1+2+3+3+2+1 = 12" />（偶数）</>}</p>
                      <p><strong>{stepLabel(2, language)}</strong> {language === "id" ? "Susun data terurut dari tabel:" : language === "en" ? "Arrange the sorted data from the table:" : "表から並べ替えたデータを作る："}<br />
                        60, 65, 65, 70, 70, <strong className="text-indigo-300">70</strong>, <strong className="text-indigo-300">75</strong>, 75, 75, 80, 80, 85
                      </p>
                      <p><strong>{stepLabel(3, language)}</strong> <InlineMath math="n=12" /> {language === "id" ? <>(genap) → dua nilai tengah = data {ord(6, language)} dan {ord(7, language)}</> : language === "en" ? <>(even) → the two middle values = data {ord(6, language)} and {ord(7, language)}</> : <>（偶数）→ 中央の2つの値 = {ord(6, language)}と{ord(7, language)}のデータ</>}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{x_{(6)} + x_{(7)}}{2} = \frac{70 + 75}{2} = \frac{145}{2} = 72{,}5" />
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "Median = 72,5" : language === "en" ? "Median = 72.5" : "中央値 = 72.5"}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("DIAGRAM BATANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? "Diagram batang berikut menunjukkan banyak buku yang dibaca siswa kelas 9A selama satu bulan. Tentukan median data tersebut!"
                        : language === "en" ? "The following bar chart shows the number of books read by Grade 9A students over one month. Find the median!"
                        : "以下の棒グラフは9A組の生徒が1か月間に読んだ本の冊数を示しています。データの中央値を求めなさい！"}
                    </p>
                    {/* Diagram Batang dengan sumbu tegak & datar */}
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">
                        {language === "id" ? "Banyak Buku yang Dibaca Siswa Kelas 9A" : language === "en" ? "Number of Books Read by Grade 9A Students" : "9A組の生徒が読んだ本の冊数"}
                      </p>
                      <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto" aria-label={language === "id" ? "Diagram batang banyak buku" : language === "en" ? "Bar chart of books read" : "読んだ本の冊数の棒グラフ"}>
                        {/* Grid lines + Y-axis ticks */}
                        {[0,1,2,3,4,5,6].map(v => {
                          const y = 155 - v * (135/6);
                          return (
                            <g key={v}>
                              <line x1="38" y1={y} x2="288" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="33" y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        {/* Sumbu tegak (Y) */}
                        <line x1="38" y1="15" x2="38" y2="155" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {/* Sumbu datar (X) */}
                        <line x1="38" y1="155" x2="288" y2="155" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {/* Batang */}
                        {[{val:1,f:3},{val:2,f:5},{val:3,f:4},{val:4,f:6},{val:5,f:2}].map(({val,f},i) => {
                          const slotW = 50;
                          const barW = 34;
                          const x = 38 + i * slotW + (slotW - barW) / 2;
                          const barH = f * (135/6);
                          const y = 155 - barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(99,102,241,0.7)" stroke="rgba(129,140,248,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x + barW/2} y={y - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#a5b4fc">{f}</text>
                              <text x={x + barW/2} y="169" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        {/* Label sumbu datar */}
                        <text x="163" y="188" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{language === "id" ? "Banyak Buku" : language === "en" ? "Number of Books" : "本の冊数"}</text>
                        {/* Label sumbu tegak */}
                        <text x="10" y="85" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,85)">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-blue-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? "Baca data dari diagram batang:" : language === "en" ? "Read the data from the bar chart:" : "棒グラフからデータを読み取る："}</p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse w-full max-w-sm">
                          <thead>
                            <tr className="bg-indigo-800/40">
                              <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">{language === "id" ? "Banyak Buku" : language === "en" ? "Books" : "本の冊数"}</td>
                              {[1,2,3,4,5].map(v => <td key={v} className="border border-indigo-500/40 px-3 py-2 text-white font-bold text-center">{v}</td>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-slate-700/30">
                              <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</td>
                              {[3,5,4,6,2].map((f,i) => <td key={i} className="border border-indigo-500/40 px-3 py-2 text-green-300 font-bold text-center">{f}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>{stepLabel(2, language)}</strong> {language === "id" ? <>Total data: <InlineMath math="n = 3+5+4+6+2 = 20" /> (genap)</> : language === "en" ? <>Total data: <InlineMath math="n = 3+5+4+6+2 = 20" /> (even)</> : <>データの合計：<InlineMath math="n = 3+5+4+6+2 = 20" />（偶数）</>}</p>
                      <p><strong>{stepLabel(3, language)}</strong> {language === "id" ? <>Cari posisi dua nilai tengah = {ord(10, language)} dan {ord(11, language)}.</> : language === "en" ? <>Find the positions of the two middle values = {ord(10, language)} and {ord(11, language)}.</> : <>中央の2つの値の位置を求める = {ord(10, language)}と{ord(11, language)}。</>}</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p>• {language === "id" ? "Buku 1: posisi 1 – 3 (fk = 3)" : language === "en" ? "1 book: positions 1 – 3 (cf = 3)" : "本1冊：位置1～3（累積度数 = 3）"}</p>
                        <p>• {language === "id" ? "Buku 2: posisi 4 – 8 (fk = 8)" : language === "en" ? "2 books: positions 4 – 8 (cf = 8)" : "本2冊：位置4～8（累積度数 = 8）"}</p>
                        <p>• {language === "id" ? <>Buku 3: posisi 9 – 12 (fk = 12) <span className="text-indigo-300">← {ord(10, language)} dan {ord(11, language)} ada di sini ✓</span></> : language === "en" ? <>3 books: positions 9 – 12 (cf = 12) <span className="text-indigo-300">← {ord(10, language)} and {ord(11, language)} are here ✓</span></> : <>本3冊：位置9～12（累積度数 = 12） <span className="text-indigo-300">← {ord(10, language)}と{ord(11, language)}はここです ✓</span></>}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{x_{(10)} + x_{(11)}}{2} = \frac{3 + 3}{2} = 3" />
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "Median = 3 buku" : language === "en" ? "Median = 3 books" : "中央値 = 3冊"}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SULIT", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? "Terdapat 12 data terurut. Nilai terkecil 40, terbesar 95. Median = 68. Jika semua nilai di atas median dinaikkan 5, tentukan median yang baru!"
                        : language === "en" ? "There are 12 sorted data values. The smallest value is 40, the largest is 95. Median = 68. If every value above the median is increased by 5, find the new median!"
                        : "並べ替えられた12個のデータがあります。最小値は40、最大値は95です。中央値 = 68。中央値より上のすべての値を5増やすと、新しい中央値はどうなりますか？"}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{language === "id" ? <><InlineMath math="n=12" /> (genap) → median = rata-rata data {ord(6, language)} dan {ord(7, language)}.</> : language === "en" ? <><InlineMath math="n=12" /> (even) → median = the average of data {ord(6, language)} and {ord(7, language)}.</> : <><InlineMath math="n=12" />（偶数）→ 中央値 = {ord(6, language)}と{ord(7, language)}のデータの平均。</>}</p>
                      <p>{language === "id" ? <>Median awal = 68 berarti: <InlineMath math="\frac{x_6 + x_7}{2} = 68 \implies x_6 + x_7 = 136" /></> : language === "en" ? <>The original median = 68 means: <InlineMath math="\frac{x_6 + x_7}{2} = 68 \implies x_6 + x_7 = 136" /></> : <>元の中央値 = 68とは：<InlineMath math="\frac{x_6 + x_7}{2} = 68 \implies x_6 + x_7 = 136" /></>}</p>
                      <p>{language === "id" ? <>Nilai di atas median = data {ord(7, language)} s.d. {ord(12, language)}. Data {ord(7, language)} termasuk "di atas median" (nilai {ord(7, language)} ≥ nilai {ord(6, language)}).</> : language === "en" ? <>Values above the median = data {ord(7, language)} through {ord(12, language)}. Data {ord(7, language)} is included as "above the median" (value {ord(7, language)} ≥ value {ord(6, language)}).</> : <>中央値より上の値 = {ord(7, language)}から{ord(12, language)}のデータ。{ord(7, language)}のデータは「中央値より上」に含まれます（{ord(7, language)}の値 ≥ {ord(6, language)}の値）。</>}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p>{language === "id" ? <>Setelah data {ord(7, language)} s.d. {ord(12, language)} dinaikkan 5:</> : language === "en" ? <>After data {ord(7, language)} through {ord(12, language)} are increased by 5:</> : <>{ord(7, language)}から{ord(12, language)}のデータを5増やした後：</>}</p>
                        <p>• <InlineMath math="x_6" /> {language === "id" ? "tetap (tidak berubah)" : language === "en" ? "stays the same (unchanged)" : "は変わらない（そのまま）"}</p>
                        <p>• <InlineMath math="x_7" /> {language === "id" ? "menjadi" : language === "en" ? "becomes" : "は次のようになる："} <InlineMath math="x_7 + 5" /></p>
                        <BlockMath math={language === "id" ? "\\text{Me}_{\\text{baru}} = \\frac{x_6 + (x_7+5)}{2} = \\frac{x_6+x_7}{2} + \\frac{5}{2} = 68 + 2{,}5 = 70{,}5" : language === "en" ? "\\text{Me}_{\\text{new}} = \\frac{x_6 + (x_7+5)}{2} = \\frac{x_6+x_7}{2} + \\frac{5}{2} = 68 + 2.5 = 70.5" : "\\text{Me}_{\\text{新}} = \\frac{x_6 + (x_7+5)}{2} = \\frac{x_6+x_7}{2} + \\frac{5}{2} = 68 + 2.5 = 70.5"} />
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "Median baru = 70,5" : language === "en" ? "New median = 70.5" : "新しい中央値 = 70.5"}</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 4: MODUS DATA TUNGGAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title={st.konsep4} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{k4.heading}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">{k4.intro1}</strong>{k4.intro2}<em>{k4.intro3}</em>{k4.intro4}
                  </p>
                </div>

                {/* Jenis-jenis modus */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">{k4.uniLabel}</p>
                    <p className="font-body text-xs text-white/60 mb-2">{k4.uniDesc}</p>
                    <p className="font-body text-xs text-white/80">{k4.uniData}<strong className="text-orange-300">5</strong>, <strong className="text-orange-300">5</strong>, 7, 8</p>
                    <p className="font-body text-xs text-orange-400 mt-1">{k4.uniResult}<strong>5</strong></p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-yellow-300 mb-1">{k4.biLabel}</p>
                    <p className="font-body text-xs text-white/60 mb-2">{k4.biDesc}</p>
                    <p className="font-body text-xs text-white/80">{k4.biData}<strong className="text-yellow-300">3</strong>, <strong className="text-yellow-300">3</strong>, <strong className="text-yellow-300">5</strong>, <strong className="text-yellow-300">5</strong>, 8</p>
                    <p className="font-body text-xs text-yellow-400 mt-1">{k4.biResultLabel}<strong>{k4.biResult}</strong></p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-600/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-slate-300 mb-1">{k4.noneLabel}</p>
                    <p className="font-body text-xs text-white/60 mb-2">{k4.noneDesc}</p>
                    <p className="font-body text-xs text-white/80">{k4.noneData}</p>
                    <p className="font-body text-xs text-slate-400 mt-1">{k4.noneResultLabel}<strong>{k4.noneResult}</strong></p>
                  </div>
                </div>

                {/* Visual modus */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">{k4.exampleTitle}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="font-body text-xs text-white/50 mb-2">{k4.exampleData}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[4,7,2,7,9,7,3,5,7,2,4].map((v,i) => (
                          <div key={i} className={`rounded-md px-2 py-1 text-xs font-bold ${v===7 ? "bg-orange-600/50 text-orange-200 ring-1 ring-orange-500" : "bg-slate-700/50 text-white/60"}`}>{v}</div>
                        ))}
                      </div>
                      <p className="font-body text-xs text-orange-300 font-semibold">{k4.exampleResultA}<strong>7</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{k4.tipsLabel}</strong>{k4.tipsText}
                  </p>
                </div>

                {/* Animasi Interaktif Modus */}
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide">{k4.tryLabel}</p>
                  <p className="font-body text-xs text-white/45 leading-relaxed">
                    {k4.tryDesc}
                  </p>
                  <ModusAnimator />
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title={st.contoh4} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("MUDAH", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? "Tentukan modus dari data nilai ulangan berikut: 7, 8, 6, 9, 8, 7, 8, 6, 10, 8"
                        : language === "en" ? "Find the mode of the following quiz scores: 7, 8, 6, 9, 8, 7, 8, 6, 10, 8"
                        : "次の小テストの点数の最頻値を求めなさい：7, 8, 6, 9, 8, 7, 8, 6, 10, 8"}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{language === "id" ? "Hitung frekuensi tiap nilai:" : language === "en" ? "Count the frequency of each value:" : "各値の頻度を数える："}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <div className="flex flex-wrap gap-3 text-xs">
                          {[["6","2×"],["7","2×"],["8","4×"],["9","1×"],["10","1×"]].map(([v,f]) => (
                            <div key={v} className={`rounded-lg px-3 py-2 text-center border ${v==="8" ? "bg-orange-700/40 border-orange-400 ring-1 ring-orange-400" : "bg-slate-700/40 border-slate-600/40"}`}>
                              <p className={`font-bold text-sm ${v==="8" ? "text-orange-200" : "text-white/70"}`}>{v}</p>
                              <p className={v==="8" ? "text-orange-400" : "text-white/40"}>{f}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p>{language === "id" ? <>Nilai 8 muncul paling banyak (4 kali). <strong className="text-primary">Modus = 8</strong></> : language === "en" ? <>Value 8 appears most often (4 times). <strong className="text-primary">Mode = 8</strong></> : <>値8が最も多く出現（4回）。<strong className="text-primary">最頻値 = 8</strong></>}</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SEDANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? "Data ukuran sepatu 20 siswa kelas 9B disajikan dalam tabel distribusi frekuensi tunggal berikut. Tentukan modus data tersebut!"
                        : language === "en" ? "The shoe sizes of 20 Grade 9B students are shown in the following single frequency distribution table. Find the mode!"
                        : "9B組の生徒20人の靴のサイズが以下の単純度数分布表に示されています。データの最頻値を求めなさい！"}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="text-xs font-body border-collapse">
                        <thead>
                          <tr className="bg-orange-800/40">
                            <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">{language === "id" ? "Ukuran Sepatu" : language === "en" ? "Shoe Size" : "靴のサイズ"}</td>
                            {[37,38,39,40,41].map(v => (
                              <td key={v} className="border border-orange-500/40 px-4 py-2 text-white font-bold text-center">{v}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-700/30">
                            <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</td>
                            {[2,5,7,4,2].map((f,i) => (
                              <td key={i} className="border border-orange-500/40 px-4 py-2 text-green-300 font-bold text-center">{f}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{language === "id" ? "Baca frekuensi dari tabel:" : language === "en" ? "Read the frequencies from the table:" : "表から度数を読み取る："}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        {[[37,2],[38,5],[39,7],[40,4],[41,2]].map(([v,f]) => (
                          <div key={v} className={`rounded-lg px-3 py-2 text-center border ${f===7 ? "bg-orange-700/40 border-orange-400 ring-1 ring-orange-400" : "bg-slate-700/40 border-slate-600/40"}`}>
                            <p className={`font-bold text-sm ${f===7 ? "text-orange-200" : "text-white/70"}`}>{language === "id" ? "No." : language === "en" ? "Size" : "サイズ"} {v}</p>
                            <p className={f===7 ? "text-orange-400" : "text-white/40"}>{f}×</p>
                          </div>
                        ))}
                      </div>
                      <p>{language === "id" ? "Ukuran 39 memiliki frekuensi tertinggi (7 siswa)." : language === "en" ? "Size 39 has the highest frequency (7 students)." : "サイズ39が最も高い頻度です（7人）。"}</p>
                      <p><strong className="text-primary">{language === "id" ? "Modus = 39" : language === "en" ? "Mode = 39" : "最頻値 = 39"}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("DIAGRAM BATANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? "Diagram batang berikut menunjukkan nilai ulangan IPA siswa kelas 9C. Tentukan modus data tersebut!"
                        : language === "en" ? "The following bar chart shows the Science quiz scores of Grade 9C students. Find the mode!"
                        : "以下の棒グラフは9C組の生徒の理科の小テストの点数を示しています。データの最頻値を求めなさい！"}
                    </p>
                    {/* Diagram Batang dengan sumbu tegak & datar */}
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">
                        {language === "id" ? "Nilai Ulangan IPA Kelas 9C" : language === "en" ? "Grade 9C Science Quiz Scores" : "9C組の理科の小テストの点数"}
                      </p>
                      <svg viewBox="0 0 320 210" className="w-full max-w-xs mx-auto" aria-label={language === "id" ? "Diagram batang nilai IPA" : language === "en" ? "Bar chart of science scores" : "理科の点数の棒グラフ"}>
                        {/* Grid lines + Y-axis ticks: 0,2,4,6,8 */}
                        {[0,2,4,6,8].map(v => {
                          const y = 160 - v * (140/8);
                          return (
                            <g key={v}>
                              <line x1="38" y1={y} x2="308" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="33" y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        {/* Sumbu tegak (Y) */}
                        <line x1="38" y1="15" x2="38" y2="160" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {/* Sumbu datar (X) */}
                        <line x1="38" y1="160" x2="308" y2="160" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {/* Batang */}
                        {[{val:6,f:3},{val:7,f:8},{val:8,f:8},{val:9,f:5},{val:10,f:1}].map(({val,f},i) => {
                          const slotW = 54;
                          const barW = 36;
                          const x = 38 + i * slotW + (slotW - barW) / 2;
                          const barH = f * (140/8);
                          const y = 160 - barH;
                          const isModus = f === 8;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH}
                                fill={isModus ? "rgba(249,115,22,0.75)" : "rgba(100,116,139,0.6)"}
                                stroke={isModus ? "rgba(251,146,60,0.9)" : "rgba(148,163,184,0.5)"}
                                strokeWidth="1" rx="2"/>
                              <text x={x + barW/2} y={y - 4} textAnchor="middle" fontSize="9" fontWeight="bold"
                                fill={isModus ? "#fdba74" : "#94a3b8"}>{f}</text>
                              <text x={x + barW/2} y="174" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        {/* Label sumbu datar */}
                        <text x="173" y="193" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</text>
                        {/* Label sumbu tegak */}
                        <text x="10" y="88" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,88)">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-blue-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{stepLabel(1, language)}</strong> {language === "id" ? "Baca data dari diagram batang:" : language === "en" ? "Read the data from the bar chart:" : "棒グラフからデータを読み取る："}</p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse w-full max-w-sm">
                          <thead>
                            <tr className="bg-orange-800/40">
                              <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</td>
                              {[6,7,8,9,10].map(v => <td key={v} className="border border-orange-500/40 px-3 py-2 text-white font-bold text-center">{v}</td>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-slate-700/30">
                              <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</td>
                              {[3,8,8,5,1].map((f,i) => <td key={i} className="border border-orange-500/40 px-3 py-2 text-green-300 font-bold text-center">{f}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>{stepLabel(2, language)}</strong> {language === "id" ? "Cari frekuensi terbesar." : language === "en" ? "Find the highest frequency." : "最大の度数を見つける。"}</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p>• {language === "id" ? "Nilai 6 → 3 siswa" : language === "en" ? "Score 6 → 3 students" : "点数6 → 3人"}</p>
                        <p>• {language === "id" ? <>Nilai 7 → <strong className="text-orange-300">8 siswa</strong> ← tertinggi bersama nilai 8</> : language === "en" ? <>Score 7 → <strong className="text-orange-300">8 students</strong> ← tied highest with score 8</> : <>点数7 → <strong className="text-orange-300">8人</strong> ← 点数8と並んで最多</>}</p>
                        <p>• {language === "id" ? <>Nilai 8 → <strong className="text-orange-300">8 siswa</strong> ← tertinggi bersama nilai 7</> : language === "en" ? <>Score 8 → <strong className="text-orange-300">8 students</strong> ← tied highest with score 7</> : <>点数8 → <strong className="text-orange-300">8人</strong> ← 点数7と並んで最多</>}</p>
                        <p>• {language === "id" ? "Nilai 9 → 5 siswa" : language === "en" ? "Score 9 → 5 students" : "点数9 → 5人"}</p>
                        <p>• {language === "id" ? "Nilai 10 → 1 siswa" : language === "en" ? "Score 10 → 1 student" : "点数10 → 1人"}</p>
                      </div>
                      <p>{language === "id" ? "Nilai 7 dan 8 sama-sama memiliki frekuensi tertinggi (8 siswa)." : language === "en" ? "Scores 7 and 8 are tied for the highest frequency (8 students)." : "点数7と8は両方とも最も高い頻度です（8人）。"}</p>
                      <p><strong className="text-primary">{language === "id" ? "Modus = 7 dan 8 (data bimodal)" : language === "en" ? "Mode = 7 and 8 (bimodal data)" : "最頻値 = 7と8（双峰性データ）"}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SULIT", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id"
                        ? <>Data: 5, 8, <InlineMath math="p" />, 8, 12, 5, 15, <InlineMath math="p" />, 8, 5. Jika modus data tersebut adalah 5, tentukan nilai <InlineMath math="p" /> yang mungkin, disertai penjelasan!</>
                        : language === "en"
                        ? <>Data: 5, 8, <InlineMath math="p" />, 8, 12, 5, 15, <InlineMath math="p" />, 8, 5. If the mode of this data is 5, find the possible value(s) of <InlineMath math="p" />, with an explanation!</>
                        : <>データ：5, 8, <InlineMath math="p" />, 8, 12, 5, 15, <InlineMath math="p" />, 8, 5。このデータの最頻値が5であるとき、<InlineMath math="p" />としてありうる値を、説明とともに求めなさい！</>}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{language === "id" ? <>Frekuensi nilai yang sudah diketahui: 5 muncul 3×, 8 muncul 3×, 12 muncul 1×, 15 muncul 1×. Nilai <InlineMath math="p" /> muncul 2×.</> : language === "en" ? <>Frequency of the known values: 5 appears 3×, 8 appears 3×, 12 appears 1×, 15 appears 1×. The value <InlineMath math="p" /> appears 2×.</> : <>既知の値の頻度：5は3回、8は3回、12は1回、15は1回出現。<InlineMath math="p" />の値は2回出現。</>}</p>
                      <p>{language === "id" ? <>Agar modus = 5, maka frekuensi 5 (=3) harus <strong>lebih besar</strong> dari semua frekuensi lain.</> : language === "en" ? <>For the mode to be 5, the frequency of 5 (=3) must be <strong>greater</strong> than every other frequency.</> : <>最頻値が5になるためには、5の頻度（=3）が他のすべての頻度より<strong>大きく</strong>なければなりません。</>}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• {language === "id" ? <>Nilai 8 sudah 3× → sama dengan 5. Agar 5 satu-satunya modus, nilai 8 tidak boleh bertambah. Jadi <InlineMath math="p \neq 8" />.</> : language === "en" ? <>Value 8 is already 3× → tied with 5. For 5 to be the sole mode, 8's frequency must not increase. So <InlineMath math="p \neq 8" />.</> : <>値8はすでに3回 → 5と同じ。5だけが最頻値になるには、8の頻度が増えてはいけません。よって<InlineMath math="p \neq 8" />。</>}</p>
                        <p>• {language === "id" ? <>Nilai <InlineMath math="p" /> muncul 2×, sudah lebih kecil dari 3 → oke selama <InlineMath math="p \neq 5" /> dan <InlineMath math="p \neq 8" />.</> : language === "en" ? <>The value <InlineMath math="p" /> appears 2×, already less than 3 → fine as long as <InlineMath math="p \neq 5" /> and <InlineMath math="p \neq 8" />.</> : <><InlineMath math="p" />の値は2回出現し、すでに3より小さい → <InlineMath math="p \neq 5" />かつ<InlineMath math="p \neq 8" />である限り問題ありません。</>}</p>
                      </div>
                      <p><strong className="text-primary">{language === "id" ? "p bisa berupa nilai apapun kecuali 5 dan 8, misalnya p = 3, 7, 10, 11, dll." : language === "en" ? "p can be any value except 5 and 8, for example p = 3, 7, 10, 11, etc." : "pは5と8以外の任意の値になれます。例：p = 3, 7, 10, 11など。"}</strong></p>
                      <p className="text-xs text-white/50">
                        {language === "id" ? "(Jika p=5, maka 5 muncul 5× → modus tetap 5 ✓. Jika p=8, maka 8 muncul 5× → modus menjadi 8, bukan 5 ✗)"
                          : language === "en" ? "(If p=5, then 5 appears 5× → the mode stays 5 ✓. If p=8, then 8 appears 5× → the mode becomes 8, not 5 ✗)"
                          : "（p=5の場合、5は5回出現 → 最頻値は5のままです ✓。p=8の場合、8は5回出現 → 最頻値は5ではなく8になります ✗）"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-yellow-400" title={st.rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-bold text-purple-300 text-center mb-2">{rt.rumusTitle}</p>

                  <div className="space-y-3">
                    <div className="border border-purple-500/30 bg-purple-900/20 rounded-xl p-3">
                      <p className="font-body text-xs font-bold text-purple-300 mb-2">{rt.medianLabel}</p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">{rt.dataTunggalGanjil}</p>
                          <BlockMath math="\text{Me} = x_{\left(\frac{n+1}{2}\right)}" />
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">{rt.dataTunggalGenap}</p>
                          <BlockMath math="\text{Me} = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}" />
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">{rt.dataBerkelompok}</p>
                          <BlockMath math="\text{Me} = T_b + p \cdot \frac{\frac{n}{2} - F}{f}" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-orange-500/30 bg-orange-900/20 rounded-xl p-3">
                      <p className="font-body text-xs font-bold text-orange-300 mb-2">{rt.modusLabel}</p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">{rt.dataTunggalGanjil.replace(/ — n.*/, ":")}</p>
                          <p className="font-body text-xs text-orange-300">{rt.modusFreqText}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">{rt.dataBerkelompok}</p>
                          <BlockMath math="\text{Mo} = T_b + p \cdot \frac{d_1}{d_1+d_2}" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabel perbandingan */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-2 py-2 text-left text-white/50">{rt.colUkuran}</th>
                        <th className="px-2 py-2 text-center text-cyan-300">{rt.colRata}</th>
                        <th className="px-2 py-2 text-center text-purple-300">{rt.colMedian}</th>
                        <th className="px-2 py-2 text-center text-orange-300">{rt.colModus}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        <tr>
                          <td className="px-2 py-2 text-white/70">{rt.rowEkstrem}</td>
                          <td className="px-2 py-2 text-center text-red-400">{rt.ya}</td>
                          <td className="px-2 py-2 text-center text-green-400">{rt.tidak}</td>
                          <td className="px-2 py-2 text-center text-green-400">{rt.tidak}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-white/70">{rt.rowUrut}</td>
                          <td className="px-2 py-2 text-center text-green-400">{rt.tidak}</td>
                          <td className="px-2 py-2 text-center text-red-400">{rt.ya}</td>
                          <td className="px-2 py-2 text-center text-green-400">{rt.tidak}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-white/70">{rt.rowSatu}</td>
                          <td className="px-2 py-2 text-center text-green-400">{rt.ya}</td>
                          <td className="px-2 py-2 text-center text-green-400">{rt.ya}</td>
                          <td className="px-2 py-2 text-center text-red-400">{rt.bisaLebih}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>{rt.footerLabel}</strong>{rt.footerText}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <RangkumanSection
          gradientFrom="from-purple-900"
          gradientVia="via-violet-900"
          gradientTo="to-indigo-900"
          borderColor="border-purple-500/40"
          accentColor="text-purple-300"
          headerIcon="📍"
          judul={rst.judul}
          subjudul={rst.subjudul}
          ringkasan={rst.ringkasan.map((r, i) => ({
            ...r,
            bg: ["bg-purple-900/50", "bg-violet-900/50", "bg-indigo-900/50", "bg-fuchsia-900/50"][i],
            border: ["border-purple-500/40", "border-violet-500/40", "border-indigo-500/40", "border-fuchsia-500/40"][i],
            textColor: ["text-purple-200", "text-violet-200", "text-indigo-200", "text-fuchsia-200"][i],
          }))}
          rumus={rst.rumus.map((r, i) => ({
            ...r,
            bg: ["bg-purple-900/60", "bg-violet-900/60"][i],
            border: ["border-purple-400/40", "border-violet-400/40"][i],
            labelColor: ["text-purple-300", "text-violet-300"][i],
          }))}
          tips={rst.tips}
          kesimpulan={rst.kesimpulan}
          kesimpulanBg="bg-gradient-to-r from-purple-900/80 to-violet-900/80"
          kesimpulanBorder="border-purple-400/50"
          kesimpulanTextColor="text-purple-100"
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

export default MedianModusPage;
