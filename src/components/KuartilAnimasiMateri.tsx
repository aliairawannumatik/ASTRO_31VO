import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "input" | "sorting" | "sorted" | "calculating" | "done";

interface QResult {
  value: number;
  pos: number;
  p: number;
  d: number;
  lo: number;
  hi: number;
}

function quartileByPosition(sorted: number[], k: 1 | 2 | 3): QResult {
  const n = sorted.length;
  const pos = (k * (n + 1)) / 4;
  const p = Math.floor(pos);
  const d = pos - p;
  if (d === 0) {
    return { value: sorted[p - 1], pos, p, d, lo: p - 1, hi: p - 1 };
  }
  const val = sorted[p - 1] + d * (sorted[p] - sorted[p - 1]);
  return { value: val, pos, p, d, lo: p - 1, hi: p };
}

function fmtNum(n: number) {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
}

function fmtPos(pos: number) {
  if (Number.isInteger(pos)) return String(pos);
  return pos.toFixed(2).replace(/0+$/, "").replace(".", ",");
}

interface CardProps {
  label: string;
  sublabel: string;
  colorClass: string;
  borderClass: string;
  q: QResult | null;
  show: boolean;
  sorted: number[];
}

function QuartilCard({ label, sublabel, colorClass, borderClass, q, show, sorted }: CardProps) {
  return (
    <div className="relative" style={{ minHeight: 118 }}>
      <AnimatePresence>
        {show && q ? (
          <motion.div
            key="filled"
            initial={{ scale: 0.3, opacity: 0, y: 28 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 13 }}
            className={`rounded-2xl border-2 ${borderClass} p-3 text-center shadow-xl absolute inset-0`}
          >
            <div className={`text-[11px] font-bold mb-0.5 ${colorClass}`}>{sublabel}</div>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.22, 1] }}
              transition={{ duration: 0.55 }}
              className={`text-3xl font-black ${colorClass} drop-shadow-lg leading-none`}
            >
              {fmtNum(q.value)}
            </motion.div>
            <div className={`text-xs font-black mt-0.5 ${colorClass} opacity-60`}>{label}</div>
            <div className="text-[9px] text-slate-500 mt-1.5 font-mono leading-tight">
              pos = {fmtPos(q.pos)}
              {q.d !== 0 && (
                <div>{sorted[q.lo]}+{fmtNum(q.d)}×({sorted[q.hi]}−{sorted[q.lo]})</div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="rounded-2xl border-2 border-slate-800/50 bg-slate-900/20 p-3 text-center absolute inset-0 flex flex-col items-center justify-center gap-1"
          >
            <div className={`text-[11px] font-bold ${colorClass} opacity-30`}>{sublabel}</div>
            <div className="text-slate-700 text-2xl font-black animate-pulse">?</div>
            <div className={`text-xs font-bold ${colorClass} opacity-30`}>{label}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KuartilAnimasiMateri() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [rawNums, setRawNums] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [showQ1, setShowQ1] = useState(false);
  const [showQ2, setShowQ2] = useState(false);
  const [showQ3, setShowQ3] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearT = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const reset = () => {
    clearT();
    setPhase("input"); setRawNums([]); setSorted([]);
    setShowQ1(false); setShowQ2(false); setShowQ3(false);
    setError(""); setInput("");
  };

  const handleSort = () => {
    const parts = input.split(/[,;\s]+/).map(s => s.replace(",", ".").trim()).filter(Boolean);
    const nums = parts.map(Number);
    if (parts.length < 4) { setError("Masukkan minimal 4 angka!"); return; }
    if (nums.some(isNaN)) { setError("Pastikan semua nilai adalah angka yang valid."); return; }
    setError("");
    setRawNums(nums);
    setPhase("sorting");
    const t = setTimeout(() => {
      setSorted([...nums].sort((a, b) => a - b));
      setPhase("sorted");
    }, 1400);
    timers.current.push(t);
  };

  const handleFindQ = () => {
    if (sorted.length < 4) return;
    setPhase("calculating");
    setShowQ1(false); setShowQ2(false); setShowQ3(false);
    const t1 = setTimeout(() => setShowQ2(true), 700);
    const t2 = setTimeout(() => setShowQ1(true), 1900);
    const t3 = setTimeout(() => setShowQ3(true), 3100);
    const t4 = setTimeout(() => setPhase("done"), 3800);
    timers.current.push(t1, t2, t3, t4);
  };

  const q1 = sorted.length >= 4 ? quartileByPosition(sorted, 1) : null;
  const q2 = sorted.length >= 4 ? quartileByPosition(sorted, 2) : null;
  const q3 = sorted.length >= 4 ? quartileByPosition(sorted, 3) : null;
  const n = sorted.length;

  const cardClass = (i: number): string => {
    if (!q1 || !q2 || !q3) return "bg-indigo-950/70 border-indigo-600/40 text-indigo-200";
    if (phase === "input" || phase === "sorting") return "bg-indigo-950/70 border-indigo-600/40 text-indigo-200";
    if (phase === "sorted") return "bg-slate-800/70 border-slate-600/50 text-slate-200";
    if (showQ1 && (i === q1.lo || i === q1.hi)) return "ring-2 ring-cyan-400 bg-cyan-900/60 border-cyan-400 text-cyan-100";
    if (showQ2 && (i === q2.lo || i === q2.hi)) return "ring-2 ring-amber-400 bg-amber-900/60 border-amber-400 text-amber-100";
    if (showQ3 && (i === q3.lo || i === q3.hi)) return "ring-2 ring-pink-400 bg-pink-900/60 border-pink-400 text-pink-100";
    return "bg-slate-800/70 border-slate-600/50 text-slate-200";
  };

  const posLabel = (i: number): string | null => {
    if (!q1 || !q2 || !q3) return null;
    if (showQ1 && i === q1.lo) return q1.d === 0 ? `ke-${q1.p}` : `ke-${q1.p}`;
    if (showQ1 && q1.d !== 0 && i === q1.hi && i !== q1.lo) return `ke-${q1.p + 1}`;
    if (showQ2 && i === q2.lo) return q2.d === 0 ? `ke-${q2.p}` : `ke-${q2.p}`;
    if (showQ2 && q2.d !== 0 && i === q2.hi && i !== q2.lo) return `ke-${q2.p + 1}`;
    if (showQ3 && i === q3.lo) return q3.d === 0 ? `ke-${q3.p}` : `ke-${q3.p}`;
    if (showQ3 && q3.d !== 0 && i === q3.hi && i !== q3.lo) return `ke-${q3.p + 1}`;
    return null;
  };

  const posLabelColor = (i: number): string => {
    if (!q1 || !q2 || !q3) return "";
    if (showQ1 && (i === q1.lo || i === q1.hi)) return "text-cyan-300";
    if (showQ2 && (i === q2.lo || i === q2.hi)) return "text-amber-300";
    if (showQ3 && (i === q3.lo || i === q3.hi)) return "text-pink-300";
    return "";
  };

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#0c0e24] via-[#0d1230] to-[#090c1e] p-5 mb-6 shadow-2xl shadow-violet-950/40">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <div>
          <h2 className="text-sm font-black text-violet-200 tracking-wide leading-none">Kalkulator Kuartil Interaktif</h2>
          <p className="text-[10px] text-violet-400/60 mt-0.5">
            Rumus posisi: Q<sub>k</sub> pada posisi ke-<span className="font-mono">k(n+1)/4</span>
          </p>
        </div>
        <span className="ml-auto text-[10px] text-violet-400/50 bg-violet-900/30 px-2 py-0.5 rounded-full font-mono">Q₁·Q₂·Q₃</span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── INPUT ── */}
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-slate-300">
              Ketik nilai data dipisah <span className="font-bold text-violet-300">koma</span>.
              <span className="text-slate-500 ml-2 text-xs">Contoh: 72, 65, 80, 88, 74, 91, 69</span>
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-violet-500/40 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
                placeholder="Masukkan nilai, pisahkan dengan koma…"
                value={input}
                onChange={e => { setInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSort()}
              />
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={handleSort}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-900/50 hover:from-violet-500 hover:to-indigo-500 transition-all whitespace-nowrap"
              >
                Urutkan 🔢
              </motion.button>
            </div>
            {error && <p className="text-rose-400 text-xs font-medium">⚠️ {error}</p>}
          </motion.div>
        )}

        {/* ── SORTING ANIMATION ── */}
        {phase === "sorting" && (
          <motion.div key="sorting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-amber-300 font-semibold animate-pulse">⏳ Mengurutkan dari kecil ke besar…</p>
            <div className="flex flex-wrap gap-2">
              {rawNums.map((num, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, y: 0, rotate: 0 }}
                  animate={{ scale: [1, 1.3, 0.85, 1], y: [0, -14, 5, 0], rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 0.65, delay: i * 0.07, ease: "easeInOut" }}
                  className="min-w-[36px] h-10 flex items-center justify-center rounded-xl border-2 border-amber-500/60 bg-amber-900/40 text-amber-100 font-bold text-sm shadow px-2"
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SORTED / CALCULATING / DONE ── */}
        {(phase === "sorted" || phase === "calculating" || phase === "done") && q1 && q2 && q3 && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Status */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">
                {phase === "sorted" && <span className="text-emerald-400">✅ Terurut — {n} data siap dihitung!</span>}
                {phase === "calculating" && <span className="text-violet-300 animate-pulse">🔍 Menghitung kuartil dengan rumus posisi…</span>}
                {phase === "done" && <span className="text-emerald-400">🎉 Ketiga kuartil ditemukan!</span>}
              </p>
              <button onClick={reset} className="text-xs text-slate-600 hover:text-rose-400 transition-colors underline underline-offset-2">Reset</button>
            </div>

            {/* Data tiles */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sorted.map((num, i) => {
                const lbl = posLabel(i);
                const lblColor = posLabelColor(i);
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22, delay: phase === "sorted" ? i * 0.04 : 0 }}
                    className={`relative min-w-[36px] h-10 flex flex-col items-center justify-center rounded-xl border-2 font-bold text-sm shadow transition-all duration-500 px-1.5 ${cardClass(i)}`}
                  >
                    {lbl && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black whitespace-nowrap ${lblColor}`}
                      >
                        {lbl}
                      </motion.span>
                    )}
                    {num}
                  </motion.div>
                );
              })}
            </div>

            {/* Formula preview (sorted phase only) */}
            {phase === "sorted" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-4 py-3 font-mono text-xs space-y-1"
              >
                <p className="text-slate-300 font-sans font-semibold text-[11px] mb-2">🧮 Rumus yang akan dipakai (n = {n}):</p>
                <p className="text-slate-400">Posisi Q₁ = 1×({n}+1)÷4 = <span className="text-cyan-300 font-bold">{fmtPos(q1.pos)}</span></p>
                <p className="text-slate-400">Posisi Q₂ = 2×({n}+1)÷4 = <span className="text-amber-300 font-bold">{fmtPos(q2.pos)}</span></p>
                <p className="text-slate-400">Posisi Q₃ = 3×({n}+1)÷4 = <span className="text-pink-300 font-bold">{fmtPos(q3.pos)}</span></p>
              </motion.div>
            )}

            {/* Tentukan Kuartil button */}
            {phase === "sorted" && (
              <motion.button
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleFindQ}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 hover:from-cyan-500 hover:to-violet-500 transition-all"
              >
                Tentukan Kuartil 📊
              </motion.button>
            )}

            {/* Quartile cards */}
            {(phase === "calculating" || phase === "done") && (
              <div className="grid grid-cols-3 gap-3 mt-1">
                <QuartilCard label="Q₁" sublabel="Kuartil Bawah" colorClass="text-cyan-300"
                  borderClass="border-cyan-600/60 bg-gradient-to-br from-cyan-950/70 to-cyan-900/20"
                  q={q1} show={showQ1} sorted={sorted} />
                <QuartilCard label="Q₂" sublabel="Median"        colorClass="text-amber-300"
                  borderClass="border-amber-600/60 bg-gradient-to-br from-amber-950/70 to-amber-900/20"
                  q={q2} show={showQ2} sorted={sorted} />
                <QuartilCard label="Q₃" sublabel="Kuartil Atas"  colorClass="text-pink-300"
                  borderClass="border-pink-600/60 bg-gradient-to-br from-pink-950/70 to-pink-900/20"
                  q={q3} show={showQ3} sorted={sorted} />
              </div>
            )}

            {/* Done tip */}
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="rounded-xl border border-emerald-600/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300 flex items-start gap-2"
              >
                <span className="mt-0.5">💡</span>
                <div className="leading-relaxed">
                  <span className="font-bold">Jangkauan Antarkuartil (JAK) = Q₃ − Q₁ = </span>
                  <span className="font-mono text-emerald-200">{fmtNum(q3.value - q1.value)}</span>
                  <span className="ml-2 text-emerald-500 text-xs">· sebaran 50% data tengah</span>
                  <button onClick={reset} className="ml-3 underline underline-offset-2 text-emerald-400 hover:text-white transition-colors text-xs">Coba data lain →</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-violet-800/25">
        {[
          { cls: "bg-cyan-500/50 border-cyan-400/60", label: "Posisi Q₁" },
          { cls: "bg-amber-500/50 border-amber-400/60", label: "Posisi Q₂" },
          { cls: "bg-pink-500/50 border-pink-400/60",  label: "Posisi Q₃" },
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
