import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Language } from "@/contexts/LanguageContext";

type Phase = "input" | "sorting" | "quartiles" | "jik" | "done";

interface QResult { value: number; pos: number; p: number; d: number; lo: number; hi: number; }

function calcQ(sorted: number[], k: 1 | 2 | 3): QResult {
  const n = sorted.length;
  const pos = (k * (n + 1)) / 4;
  const p = Math.floor(pos);
  const d = pos - p;
  if (d === 0) return { value: sorted[p - 1], pos, p, d, lo: p - 1, hi: p - 1 };
  return { value: sorted[p - 1] + d * (sorted[p] - sorted[p - 1]), pos, p, d, lo: p - 1, hi: p };
}

function fmt(n: number, lang: Language) {
  if (Number.isInteger(n)) return String(n);
  return lang === "id" ? n.toFixed(2).replace(/\.?0+$/, "").replace(".", ",") : n.toFixed(2).replace(/\.?0+$/, "");
}
function fmtPos(pos: number, lang: Language) {
  if (Number.isInteger(pos)) return String(pos);
  return lang === "id" ? pos.toFixed(2).replace(/0+$/, "").replace(".", ",") : pos.toFixed(2).replace(/0+$/, "");
}

const trans = {
  id: {
    title: "Kalkulator JIK & SK Interaktif",
    subtitle: "JIK = Q₃ − Q₁ · SK = JIK ÷ 2",
    instruction: "Ketik nilai data dipisah ",
    instructionBold: "koma",
    example: "Contoh: 60, 45, 72, 88, 55, 79, 63, 91",
    placeholder: "Masukkan nilai, pisahkan dengan koma…",
    sortButton: "Urutkan 🔢",
    errMin: "Masukkan minimal 4 angka!",
    errInvalid: "Pastikan semua nilai adalah angka yang valid.",
    sorting: "⏳ Mengurutkan dari kecil ke besar…",
    calculatingQ: "🔍 Menghitung Q₁, Q₂, Q₃…",
    quartilesFound: "✅ Kuartil ditemukan — siap hitung JIK & SK!",
    calculatingJikSk: "⚡ Menghitung JIK dan SK…",
    done: "🎉 JIK dan SK berhasil ditentukan!",
    reset: "Reset",
    formulaTitle: (n: number) => `🧮 Rumus posisi (n = ${n}):`,
    posQ1: (n: number, v: string) => `Posisi Q₁ = 1×(${n}+1)÷4 = ${v}`,
    posQ2: (n: number, v: string) => `Posisi Q₂ = 2×(${n}+1)÷4 = ${v}`,
    posQ3: (n: number, v: string) => `Posisi Q₃ = 3×(${n}+1)÷4 = ${v}`,
    posLbl: (p: number) => `ke-${p}`,
    subQ1: "Kuartil Bawah",
    subQ2: "Median",
    subQ3: "Kuartil Atas",
    findQButton: "Tentukan Q₁, Q₂, Q₃ 📊",
    jikSkButton: "Hitung JIK & SK 📐",
    jikBoxTitle: "Jangkauan Interkuartil (JIK)",
    jikExplain: "JIK mengukur sebaran 50% data di bagian tengah — tidak terpengaruh nilai ekstrem.",
    skBoxTitleP1: "Simpangan Kuartil (SK / Q",
    skExplain: "SK = setengah JIK. Menunjukkan rata-rata jarak data dari Q₂ dalam rentang 50% tengah.",
    tipPrefix: "Ingat:",
    tipMiddle: "Keduanya tidak terpengaruh nilai ekstrem (pencilan).",
    tryAgain: "Coba data lain →",
    legendQ2: "Q₂ (Median)",
  },
  en: {
    title: "Interactive IQR & QD Calculator",
    subtitle: "IQR = Q₃ − Q₁ · QD = IQR ÷ 2",
    instruction: "Type data values separated by a ",
    instructionBold: "comma",
    example: "Example: 60, 45, 72, 88, 55, 79, 63, 91",
    placeholder: "Enter values, separated by commas…",
    sortButton: "Sort 🔢",
    errMin: "Enter at least 4 numbers!",
    errInvalid: "Make sure all values are valid numbers.",
    sorting: "⏳ Sorting from smallest to largest…",
    calculatingQ: "🔍 Calculating Q₁, Q₂, Q₃…",
    quartilesFound: "✅ Quartiles found — ready to calculate IQR & QD!",
    calculatingJikSk: "⚡ Calculating IQR and QD…",
    done: "🎉 IQR and QD successfully determined!",
    reset: "Reset",
    formulaTitle: (n: number) => `🧮 Position formula (n = ${n}):`,
    posQ1: (n: number, v: string) => `Q₁ position = 1×(${n}+1)÷4 = ${v}`,
    posQ2: (n: number, v: string) => `Q₂ position = 2×(${n}+1)÷4 = ${v}`,
    posQ3: (n: number, v: string) => `Q₃ position = 3×(${n}+1)÷4 = ${v}`,
    posLbl: (p: number) => `#${p}`,
    subQ1: "Lower Quartile",
    subQ2: "Median",
    subQ3: "Upper Quartile",
    findQButton: "Find Q₁, Q₂, Q₃ 📊",
    jikSkButton: "Calculate IQR & QD 📐",
    jikBoxTitle: "Interquartile Range (IQR)",
    jikExplain: "IQR measures the spread of the middle 50% of data — unaffected by extreme values.",
    skBoxTitleP1: "Quartile Deviation (QD / Q",
    skExplain: "QD = half of IQR. Shows the average distance of data from Q₂ within the middle 50% range.",
    tipPrefix: "Remember:",
    tipMiddle: "Neither is affected by extreme values (outliers).",
    tryAgain: "Try other data →",
    legendQ2: "Q₂ (Median)",
  },
  ja: {
    title: "四分位範囲・四分位偏差インタラクティブ計算機",
    subtitle: "四分位範囲 = Q₃ − Q₁ · 四分位偏差 = 四分位範囲 ÷ 2",
    instruction: "データの値を",
    instructionBold: "カンマ",
    example: "例：60, 45, 72, 88, 55, 79, 63, 91",
    placeholder: "値を入力し、カンマで区切ってください…",
    sortButton: "並べ替える 🔢",
    errMin: "少なくとも4つの数値を入力してください！",
    errInvalid: "すべての値が有効な数値であることを確認してください。",
    sorting: "⏳ 小さい順に並べ替え中…",
    calculatingQ: "🔍 Q₁、Q₂、Q₃を計算中…",
    quartilesFound: "✅ 四分位数が見つかりました — 四分位範囲・四分位偏差を計算する準備ができました！",
    calculatingJikSk: "⚡ 四分位範囲と四分位偏差を計算中…",
    done: "🎉 四分位範囲と四分位偏差が決定しました！",
    reset: "リセット",
    formulaTitle: (n: number) => `🧮 位置の公式（n = ${n}）：`,
    posQ1: (n: number, v: string) => `Q₁の位置 = 1×(${n}+1)÷4 = ${v}`,
    posQ2: (n: number, v: string) => `Q₂の位置 = 2×(${n}+1)÷4 = ${v}`,
    posQ3: (n: number, v: string) => `Q₃の位置 = 3×(${n}+1)÷4 = ${v}`,
    posLbl: (p: number) => `${p}番目`,
    subQ1: "第1四分位数（下位）",
    subQ2: "中央値",
    subQ3: "第3四分位数（上位）",
    findQButton: "Q₁、Q₂、Q₃を求める 📊",
    jikSkButton: "四分位範囲・四分位偏差を計算 📐",
    jikBoxTitle: "四分位範囲（IQR）",
    jikExplain: "四分位範囲はデータ中央50%の散らばりを測ります — 極端な値の影響を受けません。",
    skBoxTitleP1: "四分位偏差（QD / Q",
    skExplain: "四分位偏差 = 四分位範囲の半分。中央50%の範囲内でQ₂からの平均距離を示します。",
    tipPrefix: "覚えておこう：",
    tipMiddle: "どちらも極端な値（外れ値）の影響を受けません。",
    tryAgain: "他のデータを試す →",
    legendQ2: "Q₂（中央値）",
  },
} as const;

export default function JIKdanSKAnimasi({ language = "id" }: { language?: Language }) {
  const t = trans[language] ?? trans.id;
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [rawNums, setRawNums] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);

  const [showQ1, setShowQ1] = useState(false);
  const [showQ2, setShowQ2] = useState(false);
  const [showQ3, setShowQ3] = useState(false);
  const [showJIK, setShowJIK] = useState(false);
  const [showSK, setShowSK]  = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearT = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const reset = () => {
    clearT();
    setPhase("input"); setRawNums([]); setSorted([]);
    setShowQ1(false); setShowQ2(false); setShowQ3(false);
    setShowJIK(false); setShowSK(false);
    setError(""); setInput("");
  };

  const handleSort = () => {
    const parts = input.split(/[,;\s]+/).map(s => s.replace(",", ".").trim()).filter(Boolean);
    const nums = parts.map(Number);
    if (parts.length < 4) { setError(t.errMin); return; }
    if (nums.some(isNaN)) { setError(t.errInvalid); return; }
    setError(""); setRawNums(nums); setPhase("sorting");
  };

  useEffect(() => {
    if (phase !== "sorting" || rawNums.length === 0) return;
    clearT();
    const t = setTimeout(() => {
      setSorted([...rawNums].sort((a, b) => a - b));
      setPhase("quartiles");
    }, 1300);
    timers.current.push(t);
  }, [phase, rawNums]);

  const handleFindQ = () => {
    setPhase("quartiles");
    setShowQ1(false); setShowQ2(false); setShowQ3(false);
    setShowJIK(false); setShowSK(false);
    const t1 = setTimeout(() => setShowQ2(true), 600);
    const t2 = setTimeout(() => setShowQ1(true), 1700);
    const t3 = setTimeout(() => setShowQ3(true), 2800);
    timers.current.push(t1, t2, t3);
  };

  const handleJIK = () => {
    setPhase("jik");
    const t1 = setTimeout(() => setShowJIK(true), 600);
    const t2 = setTimeout(() => setShowSK(true), 1900);
    const t3 = setTimeout(() => setPhase("done"), 2700);
    timers.current.push(t1, t2, t3);
  };

  const n = sorted.length;
  const q1 = n >= 4 ? calcQ(sorted, 1) : null;
  const q2 = n >= 4 ? calcQ(sorted, 2) : null;
  const q3 = n >= 4 ? calcQ(sorted, 3) : null;
  const jik = q1 && q3 ? q3.value - q1.value : 0;
  const sk  = jik / 2;

  const allQShown = showQ1 && showQ2 && showQ3;

  // Tile colour on data row
  const tileClass = (i: number): string => {
    if (!q1 || !q2 || !q3) return "bg-slate-800/70 border-slate-600/40 text-slate-200";
    if (phase === "input" || phase === "sorting") return "bg-indigo-950/70 border-indigo-600/40 text-indigo-200";
    if (showQ1 && (i === q1.lo || i === q1.hi)) return "ring-2 ring-cyan-400 bg-cyan-900/60 border-cyan-400 text-cyan-100";
    if (showQ2 && (i === q2.lo || i === q2.hi)) return "ring-2 ring-amber-400 bg-amber-900/60 border-amber-400 text-amber-100";
    if (showQ3 && (i === q3.lo || i === q3.hi)) return "ring-2 ring-pink-400 bg-pink-900/60 border-pink-400 text-pink-100";
    return "bg-slate-800/70 border-slate-600/50 text-slate-300";
  };

  const posLbl = (i: number) => {
    if (!q1 || !q2 || !q3) return null;
    if (showQ1 && i === q1.lo) return { txt: t.posLbl(q1.p), col: "text-cyan-300" };
    if (showQ1 && q1.d && i === q1.hi && i !== q1.lo) return { txt: t.posLbl(q1.p + 1), col: "text-cyan-300" };
    if (showQ2 && i === q2.lo) return { txt: t.posLbl(q2.p), col: "text-amber-300" };
    if (showQ2 && q2.d && i === q2.hi && i !== q2.lo) return { txt: t.posLbl(q2.p + 1), col: "text-amber-300" };
    if (showQ3 && i === q3.lo) return { txt: t.posLbl(q3.p), col: "text-pink-300" };
    if (showQ3 && q3.d && i === q3.hi && i !== q3.lo) return { txt: t.posLbl(q3.p + 1), col: "text-pink-300" };
    return null;
  };

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#0e0a1e] via-[#100e28] to-[#0a0d1e] p-5 mb-6 shadow-2xl shadow-violet-950/40">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📐</span>
        <div>
          <h2 className="text-sm font-black text-violet-200 leading-none">{t.title}</h2>
          <p className="text-[10px] text-violet-400/60 mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <span className="ml-auto text-[10px] text-violet-400/50 bg-violet-900/30 px-2 py-0.5 rounded-full font-mono">JIK·SK</span>
      </div>

      <AnimatePresence mode="wait">

        {/* INPUT */}
        {phase === "input" && (
          <motion.div key="inp" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-slate-300">
              {t.instruction}<span className="font-bold text-violet-300">{t.instructionBold}</span>.
              <span className="text-slate-500 ml-2 text-xs">{t.example}</span>
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-violet-500/40 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
                placeholder={t.placeholder}
                value={input}
                onChange={e => { setInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSort()}
              />
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={handleSort}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-900/50 hover:from-violet-500 hover:to-indigo-500 transition-all whitespace-nowrap"
              >
                {t.sortButton}
              </motion.button>
            </div>
            {error && <p className="text-rose-400 text-xs font-medium">⚠️ {error}</p>}
          </motion.div>
        )}

        {/* SORTING */}
        {phase === "sorting" && (
          <motion.div key="sort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-amber-300 font-semibold animate-pulse">{t.sorting}</p>
            <div className="flex flex-wrap gap-2">
              {rawNums.map((num, i) => (
                <motion.div key={i}
                  initial={{ scale: 1, y: 0, rotate: 0 }}
                  animate={{ scale: [1, 1.3, 0.85, 1], y: [0, -14, 5, 0], rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 0.65, delay: i * 0.07 }}
                  className="min-w-[36px] h-10 flex items-center justify-center rounded-xl border-2 border-amber-500/60 bg-amber-900/40 text-amber-100 font-bold text-sm shadow px-2"
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* QUARTILES + JIK + DONE */}
        {(phase === "quartiles" || phase === "jik" || phase === "done") && q1 && q2 && q3 && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Status */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">
                {phase === "quartiles" && !allQShown && <span className="text-violet-300 animate-pulse">{t.calculatingQ}</span>}
                {phase === "quartiles" && allQShown && <span className="text-emerald-400">{t.quartilesFound}</span>}
                {phase === "jik" && <span className="text-violet-300 animate-pulse">{t.calculatingJikSk}</span>}
                {phase === "done" && <span className="text-emerald-400">{t.done}</span>}
              </p>
              <button onClick={reset} className="text-xs text-slate-600 hover:text-rose-400 transition-colors underline underline-offset-2">{t.reset}</button>
            </div>

            {/* Formula preview */}
            {phase === "quartiles" && !showQ1 && !showQ2 && !showQ3 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-4 py-3 font-mono text-xs space-y-1">
                <p className="text-slate-300 font-sans font-semibold text-[11px] mb-2">{t.formulaTitle(n)}</p>
                <p className="text-slate-400">{t.posQ1(n, "")}<span className="text-cyan-300 font-bold">{fmtPos(q1.pos, language)}</span></p>
                <p className="text-slate-400">{t.posQ2(n, "")}<span className="text-amber-300 font-bold">{fmtPos(q2.pos, language)}</span></p>
                <p className="text-slate-400">{t.posQ3(n, "")}<span className="text-pink-300 font-bold">{fmtPos(q3.pos, language)}</span></p>
              </motion.div>
            )}

            {/* Data tiles */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sorted.map((num, i) => {
                const lbl = posLbl(i);
                return (
                  <motion.div key={i} layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22, delay: i * 0.035 }}
                    className={`relative min-w-[36px] h-10 flex items-center justify-center rounded-xl border-2 font-bold text-sm shadow transition-all duration-500 px-1.5 ${tileClass(i)}`}
                  >
                    {lbl && (
                      <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black whitespace-nowrap ${lbl.col}`}>
                        {lbl.txt}
                      </motion.span>
                    )}
                    {num}
                  </motion.div>
                );
              })}
            </div>

            {/* Quartile result cards */}
            {(showQ1 || showQ2 || showQ3) && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Q₁", sublabel: t.subQ1, color: "text-cyan-300", border: "border-cyan-600/60 bg-cyan-950/50", q: q1, show: showQ1 },
                  { label: "Q₂", sublabel: t.subQ2, color: "text-amber-300", border: "border-amber-600/60 bg-amber-950/50", q: q2, show: showQ2 },
                  { label: "Q₃", sublabel: t.subQ3,  color: "text-pink-300",  border: "border-pink-600/60 bg-pink-950/50",   q: q3, show: showQ3 },
                ].map(({ label, sublabel, color, border, q, show }) => (
                  <div key={label} className="relative" style={{ minHeight: 100 }}>
                    <AnimatePresence>
                      {show ? (
                        <motion.div key="filled"
                          initial={{ scale: 0.3, opacity: 0, y: 24 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 170, damping: 14 }}
                          className={`rounded-2xl border-2 ${border} p-3 text-center absolute inset-0`}
                        >
                          <div className={`text-[10px] font-bold mb-0.5 ${color}`}>{sublabel}</div>
                          <motion.div initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.2, 1] }} transition={{ duration: 0.5 }}
                            className={`text-2xl font-black ${color} leading-none`}>{fmt(q.value, language)}</motion.div>
                          <div className={`text-[10px] font-black mt-0.5 ${color} opacity-60`}>{label}</div>
                          <div className="text-[8px] text-slate-600 mt-1 font-mono">pos={fmtPos(q.pos, language)}</div>
                        </motion.div>
                      ) : (
                        <motion.div key="empty"
                          className="rounded-2xl border-2 border-slate-800/40 bg-slate-900/20 p-3 text-center absolute inset-0 flex flex-col items-center justify-center gap-1">
                          <div className={`text-[10px] font-bold ${color} opacity-25`}>{sublabel}</div>
                          <div className="text-slate-700 text-xl font-black animate-pulse">?</div>
                          <div className={`text-[10px] font-bold ${color} opacity-25`}>{label}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* Button: Find Quartiles */}
            {phase === "quartiles" && !showQ1 && !showQ2 && !showQ3 && (
              <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleFindQ}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all"
              >
                {t.findQButton}
              </motion.button>
            )}

            {/* Button: Find JIK + SK */}
            {phase === "quartiles" && allQShown && (
              <motion.button
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleJIK}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all"
              >
                {t.jikSkButton}
              </motion.button>
            )}

            {/* JIK + SK results */}
            {(phase === "jik" || phase === "done") && (
              <div className="space-y-3">

                {/* JIK */}
                <AnimatePresence>
                  {showJIK && (
                    <motion.div key="jik"
                      initial={{ opacity: 0, y: 12, scale: 0.93 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                      className="rounded-2xl border-2 border-violet-500/60 bg-gradient-to-br from-violet-950/70 to-violet-900/20 p-4"
                    >
                      <div className="text-[11px] font-bold text-violet-400 mb-2 uppercase tracking-wide">
                        {t.jikBoxTitle}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="text-slate-300 font-bold text-sm">JIK</span>
                        <span className="text-violet-400 font-black text-lg">=</span>
                        <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                          className="bg-pink-900/60 border border-pink-500/50 text-pink-300 font-black px-3 py-1 rounded-xl text-sm">
                          Q₃ = {fmt(q3.value, language)}
                        </motion.span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                          className="text-violet-400 font-black text-xl">−</motion.span>
                        <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                          className="bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 font-black px-3 py-1 rounded-xl text-sm">
                          Q₁ = {fmt(q1.value, language)}
                        </motion.span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                          className="text-violet-400 font-black text-xl">=</motion.span>
                        <motion.span
                          initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.3, 1], opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.55 }}
                          className="bg-violet-700/60 border-2 border-violet-400/70 text-violet-100 font-black px-4 py-1.5 rounded-xl text-xl shadow-lg shadow-violet-900/40">
                          {fmt(jik, language)}
                        </motion.span>
                      </div>
                      <p className="text-[11px] text-violet-400/70">
                        {t.jikExplain}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SK */}
                <AnimatePresence>
                  {showSK && (
                    <motion.div key="sk"
                      initial={{ scale: 0.4, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 160, damping: 13 }}
                      className="rounded-2xl border-2 border-rose-500/60 bg-gradient-to-br from-rose-950/70 to-rose-900/20 p-4"
                    >
                      <div className="text-[11px] font-bold text-rose-400 mb-2 uppercase tracking-wide">
                        {t.skBoxTitleP1}<sub>d</sub>)
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="text-slate-300 font-bold text-sm">SK</span>
                        <span className="text-rose-400 font-black text-lg">=</span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                          className="font-mono text-rose-200 text-sm bg-rose-900/40 border border-rose-500/30 px-3 py-1 rounded-xl">
                          JIK ÷ 2
                        </motion.span>
                        <span className="text-rose-400 font-black text-lg">=</span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                          className="font-mono text-rose-200 text-sm">
                          {fmt(jik, language)} ÷ 2
                        </motion.span>
                        <span className="text-rose-400 font-black text-lg">=</span>
                        <motion.span
                          initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.35, 1], opacity: 1 }}
                          transition={{ duration: 0.65, delay: 0.35 }}
                          className="bg-rose-700/60 border-2 border-rose-400/70 text-rose-100 font-black px-4 py-1.5 rounded-xl text-xl shadow-lg shadow-rose-900/40">
                          {fmt(sk, language)}
                        </motion.span>
                      </div>
                      <p className="text-[11px] text-rose-400/70">
                        {t.skExplain}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Done tip */}
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="rounded-xl border border-emerald-600/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300 flex items-start gap-2"
              >
                <span className="mt-0.5">💡</span>
                <div className="leading-relaxed text-xs">
                  <strong>{t.tipPrefix}</strong> JIK = Q₃ − Q₁ = <span className="font-mono text-violet-300">{fmt(jik, language)}</span> &nbsp;·&nbsp;
                  SK = JIK ÷ 2 = <span className="font-mono text-rose-300">{fmt(sk, language)}</span>.
                  {t.tipMiddle}
                  <button onClick={reset} className="ml-3 underline underline-offset-2 text-emerald-400 hover:text-white transition-colors">{t.tryAgain}</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-violet-800/25">
        {[
          { cls: "bg-cyan-500/50 border-cyan-400/60",    label: "Q₁" },
          { cls: "bg-amber-500/50 border-amber-400/60",  label: t.legendQ2 },
          { cls: "bg-pink-500/50 border-pink-400/60",    label: "Q₃" },
          { cls: "bg-violet-500/50 border-violet-400/60",label: "JIK = Q₃−Q₁" },
          { cls: "bg-rose-500/50 border-rose-400/60",    label: "SK = JIK÷2" },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded border inline-block ${cls}`} />
            <span className="text-[11px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
