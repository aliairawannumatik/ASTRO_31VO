import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Language } from "@/contexts/LanguageContext";

type Phase = "input" | "scanning" | "found" | "calculating" | "done";

const trans = {
  id: {
    title: "Kalkulator Jangkauan Interaktif",
    subtitle: "Jangkauan = Nilai Terbesar − Nilai Terkecil",
    instruction: "Ketik nilai data dipisah ",
    instructionBold: "koma",
    example: "Contoh: 45, 72, 38, 91, 56, 63",
    placeholder: "Masukkan nilai, pisahkan dengan koma…",
    scanButton: "Cari Min & Max 🔍",
    errMin: "Masukkan minimal 2 angka!",
    errInvalid: "Pastikan semua nilai adalah angka yang valid.",
    scanning: "🔍 Memindai data…",
    found: "✅ Nilai terbesar dan terkecil ditemukan!",
    calculating: "⚡ Menghitung jangkauan…",
    done: "🎉 Jangkauan berhasil ditentukan!",
    reset: "Reset",
    min: "min",
    max: "max",
    minMax: "min&max",
    smallestValue: "Nilai Terkecil",
    largestValue: "Nilai Terbesar",
    calcButton: "Tentukan Jangkauan 📐",
    formulaLabel: "Rumus Jangkauan:",
    formulaWord: "Jangkauan",
    resultLabel: "JANGKAUAN (J)",
    tip: "Semakin besar jangkauan, semakin tersebar datanya. Semakin kecil, data semakin seragam/terpusat.",
    tryAgain: "Coba data lain →",
    legendMin: "Nilai Terkecil (min)",
    legendMax: "Nilai Terbesar (max)",
    legendRange: "Jangkauan (max−min)",
  },
  en: {
    title: "Interactive Range Calculator",
    subtitle: "Range = Largest Value − Smallest Value",
    instruction: "Type data values separated by a ",
    instructionBold: "comma",
    example: "Example: 45, 72, 38, 91, 56, 63",
    placeholder: "Enter values, separated by commas…",
    scanButton: "Find Min & Max 🔍",
    errMin: "Enter at least 2 numbers!",
    errInvalid: "Make sure all values are valid numbers.",
    scanning: "🔍 Scanning data…",
    found: "✅ Largest and smallest values found!",
    calculating: "⚡ Calculating the range…",
    done: "🎉 Range successfully determined!",
    reset: "Reset",
    min: "min",
    max: "max",
    minMax: "min&max",
    smallestValue: "Smallest Value",
    largestValue: "Largest Value",
    calcButton: "Determine the Range 📐",
    formulaLabel: "Range Formula:",
    formulaWord: "Range",
    resultLabel: "RANGE (J)",
    tip: "The larger the range, the more spread out the data. The smaller it is, the more uniform/concentrated the data.",
    tryAgain: "Try other data →",
    legendMin: "Smallest Value (min)",
    legendMax: "Largest Value (max)",
    legendRange: "Range (max−min)",
  },
  ja: {
    title: "範囲インタラクティブ計算機",
    subtitle: "範囲 = 最大値 − 最小値",
    instruction: "データの値を",
    instructionBold: "カンマ",
    example: "例：45, 72, 38, 91, 56, 63",
    placeholder: "値を入力し、カンマで区切ってください…",
    scanButton: "最小値・最大値を探す 🔍",
    errMin: "少なくとも2つの数値を入力してください！",
    errInvalid: "すべての値が有効な数値であることを確認してください。",
    scanning: "🔍 データをスキャン中…",
    found: "✅ 最大値と最小値が見つかりました！",
    calculating: "⚡ 範囲を計算中…",
    done: "🎉 範囲が決定しました！",
    reset: "リセット",
    min: "最小",
    max: "最大",
    minMax: "最小&最大",
    smallestValue: "最小値",
    largestValue: "最大値",
    calcButton: "範囲を求める 📐",
    formulaLabel: "範囲の公式：",
    formulaWord: "範囲",
    resultLabel: "範囲（J）",
    tip: "範囲が大きいほどデータの散らばりが大きく、小さいほどデータは均一・集中しています。",
    tryAgain: "他のデータを試す →",
    legendMin: "最小値（min）",
    legendMax: "最大値（max）",
    legendRange: "範囲（max−min）",
  },
} as const;

export default function JangkauanAnimasi({ language = "id" }: { language?: Language }) {
  const t = trans[language] ?? trans.id;
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [nums, setNums] = useState<number[]>([]);
  const [scanIdx, setScanIdx] = useState(-1);
  const [currentMin, setCurrentMin] = useState<number | null>(null);
  const [currentMax, setCurrentMax] = useState<number | null>(null);
  const [showFormula, setShowFormula] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearT = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const reset = () => {
    clearT();
    setPhase("input"); setNums([]); setScanIdx(-1);
    setCurrentMin(null); setCurrentMax(null);
    setShowFormula(false); setShowResult(false);
    setError(""); setInput("");
  };

  const handleScan = () => {
    const parts = input.split(/[,;\s]+/).map(s => s.replace(",", ".").trim()).filter(Boolean);
    const parsed = parts.map(Number);
    if (parts.length < 2) { setError(t.errMin); return; }
    if (parsed.some(isNaN)) { setError(t.errInvalid); return; }
    setError("");
    setNums(parsed);
    setPhase("scanning");
    setScanIdx(-1);
    setCurrentMin(null);
    setCurrentMax(null);
  };

  // Run scan animation after nums + phase are set
  useEffect(() => {
    if (phase !== "scanning" || nums.length === 0) return;
    clearT();

    let runMin = Infinity;
    let runMax = -Infinity;

    nums.forEach((n, i) => {
      const t = setTimeout(() => {
        setScanIdx(i);
        if (n < runMin) { runMin = n; setCurrentMin(n); }
        if (n > runMax) { runMax = n; setCurrentMax(n); }

        if (i === nums.length - 1) {
          const t2 = setTimeout(() => setPhase("found"), 600);
          timers.current.push(t2);
        }
      }, 350 + i * 320);
      timers.current.push(t);
    });
  }, [phase, nums]);

  const handleCalc = () => {
    setPhase("calculating");
    const t1 = setTimeout(() => setShowFormula(true), 500);
    const t2 = setTimeout(() => setShowResult(true), 1600);
    const t3 = setTimeout(() => setPhase("done"), 2200);
    timers.current.push(t1, t2, t3);
  };

  const min = currentMin ?? Math.min(...nums);
  const max = currentMax ?? Math.max(...nums);
  const jangkauan = max - min;

  const tileClass = (i: number, num: number): string => {
    const isMin = num === min;
    const isMax = num === max;
    const isScanned = i <= scanIdx;
    const isScanning = i === scanIdx;

    if (phase === "input") return "bg-slate-800/70 border-slate-600/40 text-slate-300";
    if (phase === "scanning") {
      if (isScanning) return "ring-2 ring-white bg-white/20 border-white text-white scale-110";
      if (!isScanned) return "bg-slate-800/50 border-slate-700/40 text-slate-500";
      if (isMin && isMax) return "ring-2 ring-violet-400 bg-violet-800/60 border-violet-400 text-violet-100";
      if (isMin) return "ring-2 ring-emerald-400 bg-emerald-900/60 border-emerald-400 text-emerald-100";
      if (isMax) return "ring-2 ring-rose-400 bg-rose-900/60 border-rose-400 text-rose-100";
      return "bg-slate-800/60 border-slate-600/40 text-slate-400";
    }
    // found / calculating / done
    if (isMin && isMax) return "ring-2 ring-violet-400 bg-violet-800/60 border-violet-400 text-violet-100";
    if (isMin) return "ring-2 ring-emerald-400 bg-emerald-900/60 border-emerald-400 text-emerald-100";
    if (isMax) return "ring-2 ring-rose-400 bg-rose-900/60 border-rose-400 text-rose-100";
    return "bg-slate-800/60 border-slate-600/40 text-slate-400";
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1a12] via-[#0d1a20] to-[#090f1e] p-5 mb-6 shadow-2xl shadow-emerald-950/40">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📏</span>
        <div>
          <h2 className="text-sm font-black text-emerald-200 tracking-wide leading-none">{t.title}</h2>
          <p className="text-[10px] text-emerald-400/60 mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <span className="ml-auto text-[10px] text-emerald-400/50 bg-emerald-900/30 px-2 py-0.5 rounded-full font-mono">x<sub>max</sub> − x<sub>min</sub></span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── INPUT ── */}
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-slate-300">
              {t.instruction}<span className="font-bold text-emerald-300">{t.instructionBold}</span>.
              <span className="text-slate-500 ml-2 text-xs">{t.example}</span>
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-emerald-500/40 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder={t.placeholder}
                value={input}
                onChange={e => { setInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleScan()}
              />
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={handleScan}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 hover:from-emerald-500 hover:to-teal-500 transition-all whitespace-nowrap"
              >
                {t.scanButton}
              </motion.button>
            </div>
            {error && <p className="text-rose-400 text-xs font-medium">⚠️ {error}</p>}
          </motion.div>
        )}

        {/* ── SCANNING + FOUND + CALCULATING + DONE ── */}
        {phase !== "input" && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Status */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">
                {phase === "scanning" && (
                  <span className="text-amber-300 animate-pulse">
                    {t.scanning} {scanIdx >= 0 ? `(${scanIdx + 1}/${nums.length})` : ""}
                  </span>
                )}
                {phase === "found" && <span className="text-emerald-400">{t.found}</span>}
                {phase === "calculating" && <span className="text-violet-300 animate-pulse">{t.calculating}</span>}
                {phase === "done" && <span className="text-emerald-400">{t.done}</span>}
              </p>
              <button onClick={reset} className="text-xs text-slate-600 hover:text-rose-400 transition-colors underline underline-offset-2">{t.reset}</button>
            </div>

            {/* Data tiles */}
            <div className="flex flex-wrap gap-2 pt-1">
              {nums.map((num, i) => {
                const isMin = num === min;
                const isMax = num === max;
                const labelVisible = phase !== "scanning"
                  ? (isMin || isMax)
                  : i <= scanIdx && (isMin || isMax);
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20, delay: i * 0.04 }}
                    className={`relative min-w-[40px] h-11 flex flex-col items-center justify-center rounded-xl border-2 font-bold text-sm shadow transition-all duration-300 px-2 ${tileClass(i, num)}`}
                  >
                    {labelVisible && isMin && !isMax && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-emerald-300 whitespace-nowrap"
                      >
                        {t.min}
                      </motion.span>
                    )}
                    {labelVisible && isMax && !isMin && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-rose-300 whitespace-nowrap"
                      >
                        {t.max}
                      </motion.span>
                    )}
                    {labelVisible && isMin && isMax && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-violet-300 whitespace-nowrap"
                      >
                        {t.minMax}
                      </motion.span>
                    )}
                    {num}
                  </motion.div>
                );
              })}
            </div>

            {/* Min/Max info boxes (shown when found) */}
            {(phase === "found" || phase === "calculating" || phase === "done") && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <motion.div
                  initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="rounded-2xl border-2 border-emerald-500/60 bg-emerald-950/50 p-3 text-center"
                >
                  <div className="text-[11px] font-bold text-emerald-400 mb-0.5">{t.smallestValue}</div>
                  <motion.div
                    initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.2, 1] }} transition={{ duration: 0.5 }}
                    className="text-3xl font-black text-emerald-300 drop-shadow-lg"
                  >
                    {min}
                  </motion.div>
                  <div className="text-[10px] text-emerald-500 font-mono mt-1">x<sub>min</sub></div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/50 p-3 text-center"
                >
                  <div className="text-[11px] font-bold text-rose-400 mb-0.5">{t.largestValue}</div>
                  <motion.div
                    initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.2, 1] }} transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl font-black text-rose-300 drop-shadow-lg"
                  >
                    {max}
                  </motion.div>
                  <div className="text-[10px] text-rose-500 font-mono mt-1">x<sub>max</sub></div>
                </motion.div>
              </motion.div>
            )}

            {/* Tentukan Jangkauan button */}
            {phase === "found" && (
              <motion.button
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleCalc}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-violet-600 to-emerald-600 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all"
              >
                {t.calcButton}
              </motion.button>
            )}

            {/* Formula + Result */}
            {(phase === "calculating" || phase === "done") && (
              <div className="space-y-3">
                <AnimatePresence>
                  {showFormula && (
                    <motion.div
                      key="formula"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                      className="rounded-xl border border-violet-500/40 bg-violet-950/40 px-5 py-4"
                    >
                      <p className="text-[11px] text-violet-400 font-bold mb-3 uppercase tracking-wide">{t.formulaLabel}</p>
                      <div className="flex items-center justify-center gap-2 text-lg font-black flex-wrap">
                        <span className="text-slate-300">{t.formulaWord}</span>
                        <span className="text-violet-400">=</span>
                        <motion.span
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                          className="bg-rose-900/60 border border-rose-500/50 text-rose-300 px-3 py-1 rounded-xl"
                        >
                          {max}
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                          className="text-violet-400 text-2xl"
                        >
                          −
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                          className="bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-xl"
                        >
                          {min}
                        </motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      key="result"
                      initial={{ scale: 0.4, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 160, damping: 12 }}
                      className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-950/70 to-amber-900/20 p-4 text-center shadow-xl shadow-amber-900/30"
                    >
                      <div className="text-xs font-bold text-amber-400 mb-1">{t.resultLabel}</div>
                      <motion.div
                        initial={{ scale: 0.3 }} animate={{ scale: [0.3, 1.3, 1] }} transition={{ duration: 0.7 }}
                        className="text-5xl font-black text-amber-300 drop-shadow-lg"
                      >
                        {jangkauan}
                      </motion.div>
                      <div className="text-xs text-amber-500 font-mono mt-2">= {max} − {min}</div>
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
                <div className="leading-relaxed">
                  {t.tip}
                  <button onClick={reset} className="ml-3 underline underline-offset-2 text-emerald-400 hover:text-white transition-colors text-xs">{t.tryAgain}</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-emerald-800/25">
        {[
          { cls: "bg-emerald-500/50 border-emerald-400/60", label: t.legendMin },
          { cls: "bg-rose-500/50 border-rose-400/60",     label: t.legendMax },
          { cls: "bg-amber-500/50 border-amber-400/60",   label: t.legendRange },
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
