import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, RotateCcw, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { InlineMath } from "react-katex";
import coinImg from "@assets/koin_fix_1776223721630.png";
import { playPopSound } from "@/hooks/useAudio";

/* ─── DICE FACE (SVG dots) ─────────────────────────────── */
const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]],
};

const DiceFace = ({ value, size = 96 }: { value: number; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="3" y="3" width="94" height="94" rx="16" ry="16"
      fill="#fffdf5" stroke="#c9a84c" strokeWidth="3"
      style={{ filter: "drop-shadow(0 2px 8px #0008)" }} />
    <rect x="5" y="5" width="90" height="90" rx="13" ry="13"
      fill="url(#dicegrad)" />
    <defs>
      <radialGradient id="dicegrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fffbe8" />
        <stop offset="100%" stopColor="#e8d48b" />
      </radialGradient>
    </defs>
    {(DOTS[value] || []).map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="7.5" fill="#1a1230" />
    ))}
  </svg>
);

/* ─── COIN FACE ─────────────────────────────────────────── */
const CoinFace = ({ side, size = 96 }: { side: "angka" | "gambar"; size?: number }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full overflow-hidden border-2 border-yellow-400/60 shadow-lg shadow-yellow-900/40 shrink-0"
  >
    <img
      src={coinImg}
      alt={side === "angka" ? "Angka" : "Gambar"}
      style={{
        width: size * 2,
        height: size,
        objectFit: "cover",
        objectPosition: side === "angka" ? "left center" : "right center",
        display: "block",
      }}
    />
  </div>
);

/* ─── TYPES ─────────────────────────────────────────────── */
type Mode = "koin" | "dadu";
type CoinResult = "angka" | "gambar";
type DiceResult = 1 | 2 | 3 | 4 | 5 | 6;
type HistoryEntry = { id: number; result: CoinResult | DiceResult };

const BATCH_OPTIONS = [1, 5, 10, 50];

/* ─── MAIN COMPONENT ────────────────────────────────────── */
const LabPercobaanEmpirik: React.FC = () => {
  const [mode, setMode] = useState<Mode>("koin");
  const [isThrown, setIsThrown] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<CoinResult | DiceResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [batch, setBatch] = useState(1);
  const [showHistory, setShowHistory] = useState(true);
  const idRef = useRef(0);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showHistory && historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [history.length, showHistory]);

  const resetLab = useCallback(() => {
    playPopSound();
    setHistory([]);
    setCurrentResult(null);
    setIsThrown(false);
    setSpinning(false);
  }, []);

  const handleThrow = useCallback(() => {
    if (spinning) return;
    playPopSound();
    setSpinning(true);
    setIsThrown(true);

    const delay = batch === 1 ? 900 : batch <= 10 ? 700 : 500;

    setTimeout(() => {
      const newEntries: HistoryEntry[] = Array.from({ length: batch }, () => {
        idRef.current += 1;
        if (mode === "koin") {
          return { id: idRef.current, result: Math.random() < 0.5 ? "angka" : ("gambar" as CoinResult) };
        } else {
          return { id: idRef.current, result: (Math.floor(Math.random() * 6) + 1) as DiceResult };
        }
      });

      const last = newEntries[newEntries.length - 1];
      setCurrentResult(last.result);
      setHistory((prev) => [...prev, ...newEntries]);
      setSpinning(false);
    }, delay);
  }, [spinning, batch, mode]);

  /* ─── Stats ─── */
  const n = history.filter((h) =>
    mode === "koin" ? h.result === "angka" || h.result === "gambar" : typeof h.result === "number"
  ).length;

  const coinStats = {
    angka: history.filter((h) => h.result === "angka").length,
    gambar: history.filter((h) => h.result === "gambar").length,
  };

  const diceStats = [1, 2, 3, 4, 5, 6].reduce((acc, v) => {
    acc[v] = history.filter((h) => h.result === v).length;
    return acc;
  }, {} as Record<number, number>);

  const pct = (f: number) => (n === 0 ? "0" : (f / n).toFixed(3));

  /* ─── Convergence bar ─── */
  const ConvergenceBar = ({ freq, total, theoretical, label, color }: {
    freq: number; total: number; theoretical: number; label: string; color: string;
  }) => {
    const empirical = total === 0 ? 0 : freq / total;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-body">
          <span className="text-white/70">{label}</span>
          <span className={color}>Emp: {empirical.toFixed(3)} | Teor: {theoretical.toFixed(3)}</span>
        </div>
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`absolute left-0 top-0 h-full rounded-full ${color.replace("text-", "bg-")}`}
            animate={{ width: `${empirical * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-white/60"
            style={{ left: `${theoretical * 100}%` }}
            title={`Teoritik: ${theoretical}`}
          />
        </div>
      </div>
    );
  };

  /* ─── Animated object ─── */
  const spinVariants = {
    spinning: {
      rotate: [0, 360, 720, 1080],
      scale: [1, 1.1, 0.95, 1.05, 1],
      transition: { duration: 0.85, ease: "easeInOut" },
    },
    idle: { rotate: 0, scale: 1 },
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-cyan-950/60 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-xl shadow-cyan-900/30">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/20 bg-cyan-900/20">
        <FlaskConical className="w-5 h-5 text-cyan-400 shrink-0" />
        <div>
          <p className="font-display text-sm font-bold text-cyan-300">🧪 Laboratorium Peluang Empirik</p>
          <p className="font-body text-xs text-white/50">Lempar & buktikan sendiri — semakin banyak percobaan, semakin akurat!</p>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">

        {/* ── Mode Selector ── */}
        <div className="flex gap-2">
          {(["koin", "dadu"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { playPopSound(); setMode(m); resetLab(); }}
              className={`flex-1 py-2 px-3 rounded-xl font-body text-sm font-semibold transition-all border ${
                mode === m
                  ? "bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/40"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
              }`}
            >
              {m === "koin" ? "🪙 Koin" : "🎲 Dadu"}
            </button>
          ))}
        </div>

        {/* ── Throw Area ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 rounded-xl p-4 border border-white/10">

          {/* Animated Object */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <motion.div
              animate={spinning ? "spinning" : "idle"}
              variants={spinVariants}
              className="flex items-center justify-center"
              style={{ width: 96, height: 96 }}
            >
              {mode === "koin" ? (
                <CoinFace
                  side={
                    spinning
                      ? "angka"
                      : currentResult === "gambar"
                      ? "gambar"
                      : "angka"
                  }
                  size={96}
                />
              ) : (
                <DiceFace value={spinning ? 3 : (currentResult as DiceResult) || 1} size={96} />
              )}
            </motion.div>

            {/* Result Badge */}
            <AnimatePresence mode="wait">
              {!spinning && currentResult !== null && (
                <motion.div
                  key={String(currentResult)}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-display font-bold text-sm text-center"
                >
                  {mode === "koin"
                    ? currentResult === "angka" ? "🪙 ANGKA" : "🪙 GAMBAR"
                    : `🎲 Mata ${currentResult}`}
                </motion.div>
              )}
              {spinning && (
                <motion.div
                  key="spinning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-white/50 font-body animate-pulse"
                >
                  Melempar...
                </motion.div>
              )}
              {!spinning && currentResult === null && (
                <p className="text-xs text-white/30 font-body">Belum dilempar</p>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex-1 w-full space-y-3">
            {/* Batch selector */}
            <div className="space-y-1">
              <p className="font-body text-xs text-white/50">Jumlah lemparan sekaligus:</p>
              <div className="flex gap-1.5 flex-wrap">
                {BATCH_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() => { playPopSound(); setBatch(b); }}
                    className={`px-3 py-1 rounded-lg font-body text-xs font-semibold border transition-all ${
                      batch === b
                        ? "bg-cyan-500/30 border-cyan-400 text-cyan-200"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    {b}×
                  </button>
                ))}
              </div>
            </div>

            {/* Throw + Reset */}
            <div className="flex gap-2">
              <motion.button
                onClick={handleThrow}
                disabled={spinning}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-sm shadow-lg shadow-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110"
              >
                {spinning ? "⏳ Melempar..." : `🚀 LEMPAR${batch > 1 ? ` (${batch}×)` : ""}`}
              </motion.button>
              <button
                onClick={resetLab}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Total counter */}
            <div className="flex items-center justify-between">
              <p className="font-body text-xs text-white/40">Total percobaan:</p>
              <motion.span
                key={n}
                initial={{ scale: 1.3, color: "#22d3ee" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="font-display font-bold text-lg text-white"
              >
                {n}
              </motion.span>
            </div>
          </div>
        </div>

        {/* ── Statistics Table ── */}
        {n > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Stat cards */}
            {mode === "koin" ? (
              <div className="grid grid-cols-2 gap-2">
                {(["angka", "gambar"] as CoinResult[]).map((side) => (
                  <div key={side} className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3 text-center">
                    <CoinFace side={side} size={36} />
                    <p className="font-display text-xs font-bold text-white mt-1 capitalize">{side}</p>
                    <p className="font-body text-xl font-bold text-cyan-300">{coinStats[side]}</p>
                    <p className="font-body text-xs text-white/50">
                      P = {pct(coinStats[side])}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((v) => (
                  <div key={v} className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-2 text-center">
                    <DiceFace value={v} size={32} />
                    <p className="font-body text-lg font-bold text-yellow-300 mt-1">{diceStats[v]}</p>
                    <p className="font-body text-xs text-white/40">{pct(diceStats[v])}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Convergence bars */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <p className="font-body text-xs font-semibold text-cyan-300">Konvergensi ke Peluang Teoretik</p>
                <span className="text-xs text-white/30 font-body">(garis putih = nilai teori)</span>
              </div>
              {mode === "koin" ? (
                <div className="space-y-2">
                  <ConvergenceBar freq={coinStats.angka} total={n} theoretical={0.5} label="🪙 Angka" color="text-cyan-400" />
                  <ConvergenceBar freq={coinStats.gambar} total={n} theoretical={0.5} label="🪙 Gambar" color="text-green-400" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 5, 6].map((v, i) => {
                    const colors = ["text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-cyan-400", "text-violet-400"];
                    return (
                      <ConvergenceBar
                        key={v}
                        freq={diceStats[v]}
                        total={n}
                        theoretical={1 / 6}
                        label={`🎲 Mata ${v}`}
                        color={colors[i]}
                      />
                    );
                  })}
                </div>
              )}
              <p className="font-body text-xs text-white/30 text-center pt-1">
                Coba lempar makin banyak — lihat bagaimana nilainya mendekati peluang teoritis!
              </p>
            </div>

            {/* Rumus live */}
            <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl px-4 py-3 text-center space-y-1">
              <p className="font-body text-xs text-white/50">Rumus yang sedang dihitung:</p>
              {mode === "koin" ? (
                <div className="font-body text-sm text-cyan-200">
                  <InlineMath math={`P(\\text{Angka}) = \\dfrac{${coinStats.angka}}{${n}} = ${pct(coinStats.angka)}`} />
                </div>
              ) : (
                <div className="font-body text-sm text-yellow-200">
                  <InlineMath math={`P(\\text{Mata }k) = \\dfrac{f_k}{${n}}`} />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── History ── */}
        {history.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => { playPopSound(); setShowHistory((v) => !v); }}
              className="flex items-center gap-2 text-xs font-body text-white/50 hover:text-white/80 transition-colors"
            >
              {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Riwayat ({history.length} lemparan)
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-32 overflow-y-auto rounded-xl bg-slate-900/50 border border-white/10 p-2">
                    <div className="flex flex-wrap gap-1">
                      <AnimatePresence>
                        {history.map((entry, i) => (
                          <motion.span
                            key={entry.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: Math.min(i * 0.02, 0.3) }}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-body font-semibold ${
                              mode === "koin"
                                ? entry.result === "angka"
                                  ? "bg-cyan-900/60 text-cyan-300 border border-cyan-600/30"
                                  : "bg-green-900/60 text-green-300 border border-green-600/30"
                                : "bg-yellow-900/50 text-yellow-200 border border-yellow-600/30"
                            }`}
                          >
                            {mode === "koin"
                              ? entry.result === "angka" ? "A" : "G"
                              : String(entry.result)}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      <div ref={historyEndRef} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Insight message ── */}
        {n >= 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"
          >
            <p className="font-body text-xs text-yellow-200 leading-relaxed">
              💡 <strong>Kamu sudah melempar {n} kali!</strong>{" "}
              {mode === "koin"
                ? `Peluang empirik Angka = ${pct(coinStats.angka)} (mendekati 0,5 — peluang teoritisnya). Semakin banyak lemparan, semakin akurat!`
                : `Lihat bagaimana setiap mata dadu mendekati nilai 0,167 (= 1/6). Itulah Hukum Bilangan Besar!`}
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default LabPercobaanEmpirik;
