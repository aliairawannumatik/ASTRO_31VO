import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "input" | "sorting" | "sorted" | "calculating" | "done";

function getMedianInfo(arr: number[]): { value: number; isAvg: boolean; lo: number; hi: number } {
  const n = arr.length;
  if (n % 2 === 1) {
    return { value: arr[Math.floor(n / 2)], isAvg: false, lo: Math.floor(n / 2), hi: Math.floor(n / 2) };
  } else {
    const lo = n / 2 - 1;
    const hi = n / 2;
    return { value: (arr[lo] + arr[hi]) / 2, isAvg: true, lo, hi };
  }
}

function computeQuartiles(sorted: number[]) {
  const n = sorted.length;
  const q2Info = getMedianInfo(sorted);

  let lower: number[];
  let upper: number[];
  if (n % 2 === 1) {
    const mid = Math.floor(n / 2);
    lower = sorted.slice(0, mid);
    upper = sorted.slice(mid + 1);
  } else {
    const half = n / 2;
    lower = sorted.slice(0, half);
    upper = sorted.slice(half);
  }

  const q1Info = getMedianInfo(lower);
  const q3Info = getMedianInfo(upper);

  let lowerIndices: number[];
  let upperIndices: number[];
  let q2Indices: number[] = [];

  if (n % 2 === 1) {
    const mid = Math.floor(n / 2);
    lowerIndices = Array.from({ length: mid }, (_, i) => i);
    q2Indices = [mid];
    upperIndices = Array.from({ length: n - mid - 1 }, (_, i) => mid + 1 + i);
  } else {
    const half = n / 2;
    lowerIndices = Array.from({ length: half }, (_, i) => i);
    upperIndices = Array.from({ length: half }, (_, i) => half + i);
  }

  const q1AbsLo = lowerIndices[q1Info.lo];
  const q1AbsHi = lowerIndices[q1Info.hi];
  const q3AbsLo = upperIndices[q3Info.lo];
  const q3AbsHi = upperIndices[q3Info.hi];

  return {
    q1: q1Info.value,
    q2: q2Info.value,
    q3: q3Info.value,
    q1IsAvg: q1Info.isAvg,
    q2IsAvg: q2Info.isAvg,
    q3IsAvg: q3Info.isAvg,
    lowerIndices,
    upperIndices,
    q2Indices,
    q1AbsLo,
    q1AbsHi,
    q2AbsLo: q2Info.lo,
    q2AbsHi: q2Info.hi,
    q3AbsLo,
    q3AbsHi,
  };
}

function fmtNum(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

const CARD_COLORS = {
  neutral: "bg-indigo-900/70 border-indigo-400/50 text-indigo-100",
  lower: "bg-cyan-900/80 border-cyan-400/70 text-cyan-100",
  q2: "bg-amber-900/80 border-amber-400/80 text-amber-100",
  upper: "bg-pink-900/80 border-pink-400/70 text-pink-100",
  q1Highlight: "bg-cyan-400/30 border-cyan-300 text-cyan-100 ring-2 ring-cyan-400",
  q2Highlight: "bg-amber-400/30 border-amber-300 text-amber-100 ring-2 ring-amber-400",
  q3Highlight: "bg-pink-400/30 border-pink-300 text-pink-100 ring-2 ring-pink-400",
};

export default function KuartilInteraktifAnimasi() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [rawNums, setRawNums] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [showQ1, setShowQ1] = useState(false);
  const [showQ2, setShowQ2] = useState(false);
  const [showQ3, setShowQ3] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  const handleReset = () => {
    clearTimers();
    setPhase("input");
    setRawNums([]);
    setSorted([]);
    setShowQ1(false);
    setShowQ2(false);
    setShowQ3(false);
    setError("");
    setInput("");
  };

  const handleSort = () => {
    const parts = input.split(/[,;\s]+/).map(s => s.replace(",", ".").trim()).filter(Boolean);
    const nums = parts.map(Number);
    if (parts.length < 3) { setError("Masukkan minimal 3 angka!"); return; }
    if (nums.some(isNaN)) { setError("Pastikan semua nilai adalah angka yang valid."); return; }
    setError("");
    setRawNums(nums);
    setPhase("sorting");
    const t = setTimeout(() => {
      setSorted([...nums].sort((a, b) => a - b));
      setPhase("sorted");
    }, 1200);
    timerRef.current.push(t);
  };

  const handleFindQuartiles = () => {
    if (sorted.length < 3) return;
    setPhase("calculating");
    setShowQ1(false); setShowQ2(false); setShowQ3(false);
    const t1 = setTimeout(() => setShowQ2(true), 600);
    const t2 = setTimeout(() => setShowQ1(true), 1600);
    const t3 = setTimeout(() => setShowQ3(true), 2600);
    const t4 = setTimeout(() => setPhase("done"), 3200);
    timerRef.current.push(t1, t2, t3, t4);
  };

  const q = sorted.length >= 3 ? computeQuartiles(sorted) : null;

  const getCardColor = (idx: number): string => {
    if (!q || phase === "input" || phase === "sorting") return CARD_COLORS.neutral;
    if (phase === "sorted") return CARD_COLORS.neutral;

    const isQ1Lo = idx === q.q1AbsLo;
    const isQ1Hi = idx === q.q1AbsHi;
    const isQ2Lo = idx === q.q2AbsLo;
    const isQ2Hi = idx === q.q2AbsHi;
    const isQ3Lo = idx === q.q3AbsLo;
    const isQ3Hi = idx === q.q3AbsHi;

    if (showQ2 && q2Indices.includes(idx)) return CARD_COLORS.q2;
    if (showQ2 && (isQ2Lo || isQ2Hi) && q.q2IsAvg) return CARD_COLORS.q2Highlight;
    if (!q.q2IsAvg && showQ2 && isQ2Lo) return CARD_COLORS.q2Highlight;

    if (showQ1 && q.lowerIndices.includes(idx)) {
      if (isQ1Lo || isQ1Hi) return CARD_COLORS.q1Highlight;
      return CARD_COLORS.lower;
    }
    if (showQ3 && q.upperIndices.includes(idx)) {
      if (isQ3Lo || isQ3Hi) return CARD_COLORS.q3Highlight;
      return CARD_COLORS.upper;
    }
    return CARD_COLORS.neutral;
  };

  const q2Indices = q?.q2Indices ?? [];

  const displayNums = phase === "input" ? rawNums : sorted;

  return (
    <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-[#0d0f2a] via-[#0e1530] to-[#0a0d20] p-5 mb-6 shadow-xl shadow-violet-900/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔢</span>
        <h2 className="text-lg font-bold text-violet-200 tracking-wide">Penjelajah Kuartil Interaktif</h2>
        <span className="ml-auto text-xs text-violet-400/70 bg-violet-900/40 px-2 py-1 rounded-full">Q₁ · Q₂ · Q₃</span>
      </div>

      {phase === "input" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm text-slate-300">Masukkan sekumpulan nilai, pisahkan dengan <span className="font-bold text-violet-300">koma</span>. Contoh: <span className="text-cyan-300 font-mono">8, 3, 5, 12, 7, 1, 9</span></p>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-violet-500/50 bg-slate-900/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
              placeholder="Contoh: 8, 3, 5, 12, 7, 1, 9"
              value={input}
              onChange={e => { setInput(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSort()}
            />
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleSort}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              Urutkan 🔢
            </motion.button>
          </div>
          {error && <p className="text-rose-400 text-xs font-medium">⚠️ {error}</p>}
        </motion.div>
      )}

      {phase === "sorting" && (
        <div className="space-y-3">
          <p className="text-sm text-amber-300 font-semibold animate-pulse">⏳ Sedang mengurutkan data dari kecil ke besar…</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {rawNums.map((n, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 0.9, 1], y: [0, -10, 4, 0] }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-amber-400/60 bg-amber-900/50 text-amber-100 font-bold text-sm shadow"
              >
                {n}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(phase === "sorted" || phase === "calculating" || phase === "done") && q && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {phase === "sorted" && <span className="text-emerald-400 font-semibold">✅ Data sudah terurut ({sorted.length} nilai) — siap cari kuartil!</span>}
              {phase === "calculating" && <span className="text-violet-300 font-semibold animate-pulse">🔍 Menentukan Q₁, Q₂, Q₃…</span>}
              {phase === "done" && <span className="text-emerald-400 font-semibold">🎉 Kuartil ditemukan!</span>}
            </p>
            <button onClick={handleReset} className="text-xs text-slate-500 hover:text-rose-400 transition-colors underline underline-offset-2">Reset</button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sorted.map((n, i) => (
              <motion.div
                key={i}
                layout
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: phase === "sorted" ? i * 0.04 : 0 }}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl border-2 font-bold text-sm shadow transition-all duration-500 ${getCardColor(i)}`}
              >
                {n}
                {showQ2 && q2Indices.includes(i) && !q.q2IsAvg && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-300 bg-amber-900 px-1 rounded">Q₂</motion.span>
                )}
                {showQ1 && (i === q.q1AbsLo || (q.q1IsAvg && i === q.q1AbsHi)) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-cyan-300 bg-cyan-900 px-1 rounded">Q₁</motion.span>
                )}
                {showQ3 && (i === q.q3AbsLo || (q.q3IsAvg && i === q.q3AbsHi)) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-pink-300 bg-pink-900 px-1 rounded">Q₃</motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {phase === "sorted" && (
            <motion.button
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleFindQuartiles}
              className="mt-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 hover:from-cyan-500 hover:to-violet-500 transition-all"
            >
              Tentukan Kuartil 📊
            </motion.button>
          )}

          {(phase === "calculating" || phase === "done") && (
            <div className="grid grid-cols-3 gap-3 pt-1">
              <AnimatePresence>
                {showQ1 && (
                  <motion.div
                    key="q1"
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
                    className="rounded-2xl border-2 border-cyan-500/70 bg-gradient-to-br from-cyan-900/60 to-cyan-800/30 p-3 text-center shadow-lg shadow-cyan-900/30"
                  >
                    <div className="text-xs text-cyan-400 font-semibold mb-1">Kuartil Bawah</div>
                    <div className="text-3xl font-black text-cyan-300 drop-shadow">{fmtNum(q.q1)}</div>
                    <div className="text-xs text-cyan-500 mt-1 font-bold">Q₁</div>
                    <div className="text-[10px] text-slate-400 mt-1">25% data terbawah</div>
                    {q.q1IsAvg && <div className="text-[10px] text-cyan-400/70 mt-0.5">rata-rata 2 tengah</div>}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showQ2 && (
                  <motion.div
                    key="q2"
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="rounded-2xl border-2 border-amber-500/70 bg-gradient-to-br from-amber-900/60 to-amber-800/30 p-3 text-center shadow-lg shadow-amber-900/30"
                  >
                    <div className="text-xs text-amber-400 font-semibold mb-1">Median</div>
                    <div className="text-3xl font-black text-amber-300 drop-shadow">{fmtNum(q.q2)}</div>
                    <div className="text-xs text-amber-500 mt-1 font-bold">Q₂</div>
                    <div className="text-[10px] text-slate-400 mt-1">50% (tengah)</div>
                    {q.q2IsAvg && <div className="text-[10px] text-amber-400/70 mt-0.5">rata-rata 2 tengah</div>}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showQ3 && (
                  <motion.div
                    key="q3"
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="rounded-2xl border-2 border-pink-500/70 bg-gradient-to-br from-pink-900/60 to-pink-800/30 p-3 text-center shadow-lg shadow-pink-900/30"
                  >
                    <div className="text-xs text-pink-400 font-semibold mb-1">Kuartil Atas</div>
                    <div className="text-3xl font-black text-pink-300 drop-shadow">{fmtNum(q.q3)}</div>
                    <div className="text-xs text-pink-500 mt-1 font-bold">Q₃</div>
                    <div className="text-[10px] text-slate-400 mt-1">75% data</div>
                    {q.q3IsAvg && <div className="text-[10px] text-pink-400/70 mt-0.5">rata-rata 2 tengah</div>}
                  </motion.div>
                )}
              </AnimatePresence>

              {!showQ1 && <div className="rounded-2xl border-2 border-slate-700/40 bg-slate-900/20 p-3 text-center animate-pulse"><div className="text-slate-600 text-2xl font-black">?</div><div className="text-xs text-slate-700 mt-1">Q₁</div></div>}
              {!showQ2 && <div className="rounded-2xl border-2 border-slate-700/40 bg-slate-900/20 p-3 text-center animate-pulse"><div className="text-slate-600 text-2xl font-black">?</div><div className="text-xs text-slate-700 mt-1">Q₂</div></div>}
              {!showQ3 && <div className="rounded-2xl border-2 border-slate-700/40 bg-slate-900/20 p-3 text-center animate-pulse"><div className="text-slate-600 text-2xl font-black">?</div><div className="text-xs text-slate-700 mt-1">Q₃</div></div>}
            </div>
          )}

          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-2 rounded-xl border border-emerald-500/30 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-300 flex items-start gap-2"
            >
              <span className="text-lg">💡</span>
              <div>
                <span className="font-bold">Ingat strateginya:</span> Urutkan → Temukan Q₂ (median) → Belah jadi dua bagian → Q₁ = median bagian bawah, Q₃ = median bagian atas.
                <button onClick={handleReset} className="ml-2 underline underline-offset-2 text-emerald-400 hover:text-white transition-colors text-xs">Coba data lain →</button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-4 pt-3 border-t border-violet-800/30">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-500/60 border border-cyan-400/50 inline-block" /><span className="text-[11px] text-slate-400">Bagian Bawah (Q₁)</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400/50 inline-block" /><span className="text-[11px] text-slate-400">Median (Q₂)</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-pink-500/60 border border-pink-400/50 inline-block" /><span className="text-[11px] text-slate-400">Bagian Atas (Q₃)</span></div>
      </div>
    </div>
  );
}
