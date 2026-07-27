import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import Starfield from "@/components/Starfield";

/* ───────────────────────────────────────────────────────────────
   PRESET EXAMPLES
─────────────────────────────────────────────────────────────── */
interface Example {
  id: number;
  a: number;
  b: number;
  label: string;
  tip: string;
  color: string;
  arcColor: string;
  glowId: string;
}

const EXAMPLES: Example[] = [
  {
    id: 1,
    a: 2, b: 5,
    label: "Positif + Positif",
    tip: "Kedua bilangan positif → busur bergerak ke kanan, hasilnya makin besar.",
    color: "#38bdf8",
    arcColor: "#38bdf8",
    glowId: "glow-blue",
  },
  {
    id: 2,
    a: -3, b: -4,
    label: "Negatif + Negatif",
    tip: "Kedua bilangan negatif → busur bergerak ke kiri, hasilnya makin kecil.",
    color: "#f87171",
    arcColor: "#f87171",
    glowId: "glow-red",
  },
  {
    id: 3,
    a: 6, b: -4,
    label: "Positif + Negatif (hasil +)",
    tip: "Bilangan pertama lebih besar nilainya → hasilnya tetap positif.",
    color: "#fb923c",
    arcColor: "#fb923c",
    glowId: "glow-orange",
  },
  {
    id: 4,
    a: 3, b: -7,
    label: "Positif + Negatif (hasil −)",
    tip: "Bilangan kedua lebih besar nilainya → hasilnya negatif.",
    color: "#a78bfa",
    arcColor: "#a78bfa",
    glowId: "glow-violet",
  },
  {
    id: 5,
    a: -5, b: 8,
    label: "Negatif + Positif (hasil +)",
    tip: "Bilangan kedua positif lebih besar → hasilnya positif.",
    color: "#4ade80",
    arcColor: "#4ade80",
    glowId: "glow-green",
  },
  {
    id: 6,
    a: 0, b: -3,
    label: "Nol + Negatif",
    tip: "Menjumlahkan nol dengan bilangan negatif → hasilnya tetap sama dengan bilangan negatif tersebut.",
    color: "#facc15",
    arcColor: "#facc15",
    glowId: "glow-yellow",
  },
];

/* ───────────────────────────────────────────────────────────────
   NUMBER LINE WITH DOWNWARD ARCS
─────────────────────────────────────────────────────────────── */
const ARC_DUR_MS = 550;
const SVG_W = 620;
const SVG_H = 160;
const PAD = 38;
const LINE_Y = 54; // number line sits at top third; arcs hang DOWN below it

interface NumberLineProps {
  a: number;
  b: number;
  arcColor: string;
  glowId: string;
  phase: "idle" | "animating" | "done";
  animStep: number;
}

const NumberLineAnim = ({ a, b, arcColor, glowId, phase, animStep }: NumberLineProps) => {
  const result = a + b;
  const steps = Math.abs(b);
  const dir = b >= 0 ? 1 : -1;

  // dynamic range
  const keyPts = [a, result, 0];
  const rawMin = Math.min(...keyPts);
  const rawMax = Math.max(...keyPts);
  const span = rawMax - rawMin;
  const buf = Math.max(2, Math.ceil(span * 0.3) + 1);
  const low = rawMin - buf;
  const high = rawMax + buf;
  const range = Math.max(high - low, 8);
  const unitPx = (SVG_W - PAD * 2) / range;
  const toX = (n: number) => PAD + (n - low) * unitPx;

  const ticks: number[] = [];
  const tickStep = range > 24 ? 5 : range > 12 ? 2 : 1;
  for (let n = Math.ceil(low / tickStep) * tickStep; n <= Math.floor(high / tickStep) * tickStep; n += tickStep) {
    ticks.push(n);
  }
  // always include key points
  [a, result, 0].forEach(p => { if (!ticks.includes(p) && p >= low && p <= high) ticks.push(p); });
  ticks.sort((x, y) => x - y);

  const arcH = Math.min(48, Math.max(20, unitPx * 0.7));
  const isDone = phase === "done";
  const visibleArcs = phase === "idle" ? 0 : animStep;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <style>{`
          @keyframes arcDown {
            0%   { stroke-dashoffset: 100; opacity: 0; }
            12%  { opacity: 0.9; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes dotPop {
            0%   { opacity: 0; r: 2px; }
            60%  { opacity: 1; r: 9px; }
            100% { opacity: 1; r: 7px; }
          }
          @keyframes ringBurst {
            0%   { opacity: 0; transform: scale(0.4); }
            60%  { opacity: 1; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes sparkOut {
            0%   { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(2.8); }
          }
          .arc-down  { animation: arcDown 0.7s cubic-bezier(0.22,1,0.36,1) both; }
          .dot-pop   { animation: dotPop 0.5s ease-out both; }
          .ring-burst{ animation: ringBurst 0.7s cubic-bezier(0.34,1.4,0.64,1) both; transform-box: fill-box; transform-origin: center; }
          .spark-out { animation: sparkOut 0.8s ease-out both; transform-box: fill-box; }
        `}</style>

        {/* glow filters */}
        {[
          { id: "glow-blue",   rgb: "0.22 0.75 1" },
          { id: "glow-red",    rgb: "1 0.3 0.3" },
          { id: "glow-orange", rgb: "1 0.55 0.2" },
          { id: "glow-violet", rgb: "0.65 0.55 1" },
          { id: "glow-green",  rgb: "0.3 0.86 0.5" },
          { id: "glow-yellow", rgb: "1 0.8 0.1" },
          { id: "glow-amber",  rgb: "1 0.75 0.1" },
        ].map(({ id, rgb }) => (
          <filter key={id} id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feColorMatrix in="b" type="matrix"
              values={`0 0 0 0 ${rgb.split(" ")[0]}  0 0 0 0 ${rgb.split(" ")[1]}  0 0 0 0 ${rgb.split(" ")[2]}  0 0 0 1.2 0`}
              result="c"/>
            <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        ))}

        {/* axis arrows */}
        <marker id="ax-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
        </marker>
        <marker id="ax-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
          <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
        </marker>
        {/* arc arrow */}
        <marker id={`arc-arr-${arcColor.replace("#","")}`} markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill={arcColor}/>
        </marker>
      </defs>

      {/* number line axis */}
      <line x1={12} y1={LINE_Y} x2={SVG_W - 12} y2={LINE_Y}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#ax-r)" markerStart="url(#ax-l)"
        style={{ filter: "drop-shadow(0 0 3px #FFD70099)" }}
      />

      {/* ticks & labels */}
      {ticks.map(n => {
        const x = toX(n);
        const isZero = n === 0;
        const isA    = n === a;
        const isRes  = isDone && n === result;
        const prominent = isZero || isA || isRes;
        const tickColor = isRes ? "#fbbf24" : isA ? "#c084fc" : isZero ? "#fff" : "#FFD700";
        const textColor = isRes ? "#fbbf24" : isA ? "#c084fc" : isZero ? "#fff" : "#FFE57F";
        return (
          <g key={n}>
            <line
              x1={x} y1={prominent ? LINE_Y - 10 : LINE_Y - 5}
              x2={x} y2={prominent ? LINE_Y + 10 : LINE_Y + 5}
              stroke={tickColor} strokeWidth={prominent ? 2.5 : 1.5}
              style={prominent ? { filter: `drop-shadow(0 0 4px ${tickColor}88)` } : undefined}
            />
            <text x={x} y={LINE_Y - 18} textAnchor="middle"
              fill={textColor} fontSize={prominent ? 13 : 10}
              fontWeight={prominent ? "bold" : "normal"}
              fontFamily="monospace"
            >{n}</text>
          </g>
        );
      })}

      {/* start dot (purple) */}
      {phase !== "idle" && (
        <circle cx={toX(a)} cy={LINE_Y} r="7"
          fill="#c084fc" filter="url(#glow-violet)"
          className="dot-pop"
        />
      )}

      {/* DOWNWARD ARCS */}
      {phase !== "idle" && Array.from({ length: steps }, (_, i) => {
        if (i >= visibleArcs) return null;
        const from = a + i * dir;
        const to   = a + (i + 1) * dir;
        const x1   = toX(from);
        const x2   = toX(to);
        const mx   = (x1 + x2) / 2;
        const cy   = LINE_Y + arcH; // ← DOWNWARD
        const delay = `${i * (ARC_DUR_MS / 1000)}s`;
        return (
          <g key={`arc-${i}`}>
            {/* glow shadow stroke */}
            <path d={`M ${x1},${LINE_Y} Q ${mx},${cy} ${x2},${LINE_Y}`}
              fill="none" stroke={arcColor} strokeWidth="11"
              strokeOpacity="0.18" strokeLinecap="round"
              pathLength="100" strokeDasharray="100"
              className="arc-down"
              style={{ animationDelay: delay }}
            />
            {/* main arc stroke */}
            <path d={`M ${x1},${LINE_Y} Q ${mx},${cy} ${x2},${LINE_Y}`}
              fill="none" stroke={arcColor} strokeWidth="3"
              strokeLinecap="round"
              pathLength="100" strokeDasharray="100"
              filter={`url(#${glowId})`}
              className="arc-down"
              style={{ animationDelay: delay }}
              markerEnd={`url(#arc-arr-${arcColor.replace("#","")})`}
            />
            {/* step number label */}
            <text x={mx} y={cy + 18} textAnchor="middle"
              fill={arcColor} fontSize="10" fontWeight="bold"
              fontFamily="monospace" opacity="0.85"
              className="arc-down"
              style={{ animationDelay: `${i * (ARC_DUR_MS / 1000) + 0.3}s` }}
            >
              {dir > 0 ? `+1` : `−1`}
            </text>
          </g>
        );
      })}

      {/* result dot + sparkle */}
      {isDone && (
        <g>
          <circle cx={toX(result)} cy={LINE_Y} r="14"
            fill="none" stroke="#fbbf24" strokeWidth="2.5"
            filter="url(#glow-amber)"
            className="ring-burst"
          />
          <circle cx={toX(result)} cy={LINE_Y} r="7"
            fill="#fbbf24" filter="url(#glow-amber)"
            className="dot-pop"
          />
          {[0, 60, 120, 180, 240, 300].map((deg, si) => {
            const rad = (deg * Math.PI) / 180;
            const sx = toX(result) + Math.cos(rad) * 19;
            const sy = LINE_Y + Math.sin(rad) * 19;
            return (
              <circle key={si} cx={sx} cy={sy} r="2.5"
                fill="#fbbf24"
                className="spark-out"
                style={{ animationDelay: `${si * 0.055}s`, transformOrigin: `${sx}px ${sy}px` }}
              />
            );
          })}
        </g>
      )}

      {/* result label */}
      {isDone && (
        <text x={toX(result)} y={LINE_Y - 22}
          textAnchor="middle" fontSize="12" fontWeight="bold"
          fill="#fbbf24" fontFamily="monospace"
          style={{ filter: "drop-shadow(0 0 6px #fbbf24aa)" }}
        >
          = {result}
        </text>
      )}
    </svg>
  );
};

/* ───────────────────────────────────────────────────────────────
   INTERACTIVE CALCULATOR SECTION
─────────────────────────────────────────────────────────────── */
const KalkulatorInteraktif = () => {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [phase, setPhase] = useState<"idle" | "animating" | "done">("idle");
  const [animStep, setAnimStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const numA = inputA !== "" ? parseInt(inputA) : null;
  const numB = inputB !== "" ? parseInt(inputB) : null;
  const validA = numA !== null && !isNaN(numA);
  const validB = numB !== null && !isNaN(numB);
  const both = validA && validB;

  const a = validA ? Math.max(-15, Math.min(15, numA!)) : 0;
  const b = validB ? Math.max(-15, Math.min(15, numB!)) : 0;
  const steps = Math.abs(b);
  const result = a + b;

  const arcColor = b >= 0 ? "#38bdf8" : "#f87171";
  const glowId   = b >= 0 ? "glow-blue" : "glow-red";

  const bump = (setter: (v: string) => void, cur: string, delta: number, min = -15, max = 15) => {
    const v = cur === "" ? 0 : parseInt(cur);
    if (!isNaN(v)) setter(String(Math.max(min, Math.min(max, v + delta))));
    resetAnim();
  };

  const resetAnim = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    setPhase("idle");
    setAnimStep(0);
  };

  const handleOperate = () => {
    if (!both) return;
    resetAnim();
    if (steps === 0) { setPhase("done"); return; }
    setAnimStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setPhase("animating");
      let step = 1;
      intervalRef.current = setInterval(() => {
        setAnimStep(step);
        step++;
        if (step > steps) {
          clearInterval(intervalRef.current!);
          timeoutRef.current = setTimeout(() => setPhase("done"), 300);
        }
      }, ARC_DUR_MS);
    }));
  };

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current)  clearTimeout(timeoutRef.current);
  }, []);

  const isDone = phase === "done";

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-700/60 via-blue-700/50 to-indigo-700/60 px-5 py-3 flex items-center gap-2.5">
        <span className="text-lg">🧮</span>
        <span className="font-display text-sm font-bold text-white tracking-wide">Kalkulator Garis Bilangan Interaktif</span>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* inputs */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* A */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-purple-300/80">Bilangan Pertama</span>
            <div className="flex items-center">
              <button onClick={() => bump(setInputA, inputA, -1)} className="w-9 h-12 rounded-l-xl border-2 border-r-0 border-purple-500/60 bg-slate-800 text-purple-300 text-lg font-bold hover:bg-slate-700 active:scale-95 transition-all">−</button>
              <input
                type="number" value={inputA}
                onChange={e => { setInputA(e.target.value); resetAnim(); }}
                placeholder="0" min={-15} max={15}
                className="w-16 h-12 text-center text-xl font-bold border-y-2 border-purple-500/60 bg-slate-800 text-purple-200 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button onClick={() => bump(setInputA, inputA, +1)} className="w-9 h-12 rounded-r-xl border-2 border-l-0 border-purple-500/60 bg-slate-800 text-purple-300 text-lg font-bold hover:bg-slate-700 active:scale-95 transition-all">+</button>
            </div>
          </div>

          <span className="text-4xl font-black text-amber-300 mt-6">+</span>

          {/* B */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-cyan-300/80">Bilangan Kedua</span>
            <div className="flex items-center">
              <button onClick={() => bump(setInputB, inputB, -1)} className={`w-9 h-12 rounded-l-xl border-2 border-r-0 ${b >= 0 ? "border-cyan-500/60 text-cyan-300" : "border-red-500/60 text-red-300"} bg-slate-800 text-lg font-bold hover:bg-slate-700 active:scale-95 transition-all`}>−</button>
              <input
                type="number" value={inputB}
                onChange={e => { setInputB(e.target.value); resetAnim(); }}
                placeholder="0" min={-15} max={15}
                className={`w-16 h-12 text-center text-xl font-bold border-y-2 bg-slate-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${b >= 0 ? "border-cyan-500/60 text-cyan-200" : "border-red-500/60 text-red-200"}`}
              />
              <button onClick={() => bump(setInputB, inputB, +1)} className={`w-9 h-12 rounded-r-xl border-2 border-l-0 ${b >= 0 ? "border-cyan-500/60 text-cyan-300" : "border-red-500/60 text-red-300"} bg-slate-800 text-lg font-bold hover:bg-slate-700 active:scale-95 transition-all`}>+</button>
            </div>
          </div>

          <span className="text-4xl font-black text-white/30 mt-6">=</span>

          {/* result */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-amber-300/80">Hasil</span>
            <div className={`w-20 h-12 flex items-center justify-center rounded-xl border-2 text-xl font-black font-mono transition-all ${
              isDone ? "border-amber-400 bg-amber-900/30 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]" : "border-white/10 bg-slate-800/50 text-white/20"
            }`}>
              {isDone ? result : "?"}
            </div>
          </div>
        </div>

        {/* hint */}
        {both && validB && (
          <p className={`text-center text-xs font-semibold ${b >= 0 ? "text-cyan-400" : "text-red-400"}`}>
            {b >= 0
              ? `✅ Bilangan kedua positif (+${b}) → busur bergerak ke KANAN ➡️`
              : `🔴 Bilangan kedua negatif (${b}) → busur bergerak ke KIRI ⬅️`
            }
          </p>
        )}

        {/* SVG */}
        <div className="bg-slate-950/60 rounded-xl border border-white/10 p-3">
          <NumberLineAnim
            a={a} b={b}
            arcColor={arcColor} glowId={glowId}
            phase={phase} animStep={animStep}
          />
        </div>

        {/* done banner */}
        {isDone && (
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-green-900/30 border border-green-500/40 text-green-300 text-sm font-semibold">
            <span>✅</span>
            <span>{a} + ({b}) = <strong className="text-white">{result}</strong></span>
          </div>
        )}

        {/* buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleOperate}
            disabled={!both || phase === "animating"}
            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {phase === "animating" ? "Animasi…" : phase === "done" ? "Ulangi" : "Operasikan!"}
          </button>
          {(inputA || inputB) && (
            <button onClick={() => { setInputA(""); setInputB(""); resetAnim(); }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all active:scale-95">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────────────
   EXAMPLE CARD WITH AUTO-PLAY ARC ANIMATION
─────────────────────────────────────────────────────────────── */
interface ExampleCardProps {
  ex: Example;
  animKey: number;
}

const ExampleCard = ({ ex, animKey }: ExampleCardProps) => {
  const { a, b, arcColor, glowId, tip, label, color } = ex;
  const result = a + b;
  const steps  = Math.abs(b);

  const [phase, setPhase]     = useState<"idle" | "animating" | "done">("idle");
  const [animStep, setAnimStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  // auto-start on mount / animKey change
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    setPhase("idle");
    setAnimStep(0);

    const startDelay = setTimeout(() => {
      if (steps === 0) { setPhase("done"); return; }
      setPhase("animating");
      let step = 1;
      intervalRef.current = setInterval(() => {
        setAnimStep(step);
        step++;
        if (step > steps) {
          clearInterval(intervalRef.current!);
          timeoutRef.current = setTimeout(() => setPhase("done"), 300);
        }
      }, ARC_DUR_MS);
    }, 600);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    };
  }, [animKey, steps]);

  const replay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    setPhase("idle");
    setAnimStep(0);
    setTimeout(() => {
      if (steps === 0) { setPhase("done"); return; }
      setPhase("animating");
      let step = 1;
      intervalRef.current = setInterval(() => {
        setAnimStep(step);
        step++;
        if (step > steps) {
          clearInterval(intervalRef.current!);
          timeoutRef.current = setTimeout(() => setPhase("done"), 300);
        }
      }, ARC_DUR_MS);
    }, 80);
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: color + "44" }}>
      {/* header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ background: `linear-gradient(to right,${color}18,transparent)`, borderColor: color + "33" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: color + "25", border: `1.5px solid ${color}88`, color }}>
          {ex.id}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-body" style={{ color: color + "bb" }}>{label}</p>
          <div className="font-display font-bold text-xl text-white mt-0.5">
            <InlineMath math={`${a} + (${b}) = ${result}`} />
          </div>
        </div>
        <button
          onClick={replay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all active:scale-95 hover:opacity-90"
          style={{ background: color + "22", border: `1px solid ${color}55`, color }}
        >
          <RotateCcw className="w-3 h-3" /> Putar Ulang
        </button>
      </div>

      {/* number line */}
      <div className="px-4 py-4 bg-slate-950/40">
        <NumberLineAnim
          a={a} b={b}
          arcColor={arcColor} glowId={glowId}
          phase={phase} animStep={animStep}
        />
      </div>

      {/* tip */}
      <div className="px-5 pb-4">
        <div className="rounded-xl px-4 py-2.5 text-xs font-body leading-relaxed"
          style={{ background: color + "10", border: `1px solid ${color}22`, color: color + "ee" }}>
          <span className="font-bold">💡 </span>{tip}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────────────
   RULES CARD
─────────────────────────────────────────────────────────────── */
const RulesCard = () => (
  <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-900/25 to-indigo-900/20 p-5">
    <p className="font-body font-bold text-violet-300 text-sm mb-4">🔑 Aturan Kunci Penjumlahan Bilangan Bulat</p>
    <div className="grid sm:grid-cols-2 gap-2.5">
      {[
        { icon: "➕", color: "#38bdf8", text: "Positif + Positif → hasilnya selalu positif, semakin besar" },
        { icon: "➖", color: "#f87171", text: "Negatif + Negatif → hasilnya selalu negatif, semakin kecil" },
        { icon: "↔️", color: "#fb923c", text: "Positif + Negatif → lihat mana yang nilainya lebih besar" },
        { icon: "0️⃣", color: "#facc15", text: "Setiap bilangan + 0 = bilangan itu sendiri (identitas)" },
        { icon: "🔄", color: "#4ade80", text: "a + b = b + a (sifat komutatif / urutan tidak mempengaruhi hasil)" },
        { icon: "📐", color: "#a78bfa", text: "(a + b) + c = a + (b + c) (sifat asosiatif / pengelompokan bebas)" },
      ].map(({ icon, color, text }, i) => (
        <div key={i} className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-body"
          style={{ background: color + "0d", border: `1px solid ${color}22` }}>
          <span className="text-base shrink-0 mt-0.5">{icon}</span>
          <span style={{ color: color + "ee" }}>{text}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ───────────────────────────────────────────────────────────────
   MAIN PAGE
─────────────────────────────────────────────────────────────── */
const BukuAnimasiPenjumlahanPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [animKey, setAnimKey]   = useState(0);

  const handleSelect = (i: number) => {
    if (i === selected) return;
    setSelected(i);
    setAnimKey(k => k + 1);
  };

  const ex = EXAMPLES[selected];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />

      <div className="relative z-10 w-full max-w-3xl px-4 pt-5 pb-12">
        {/* back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-body text-white/50 hover:text-white/80 transition-colors mb-5">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* page title */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-body font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" /> BUKU ANIMASI MATEMATIKA · KELAS 7
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white text-glow-cyan mb-2">
            PENJUMLAHAN BILANGAN BULAT
          </h1>
          <p className="text-white/45 text-xs font-body max-w-sm mx-auto">
            Lihat bagaimana busur animasi di bawah garis bilangan menunjukkan proses penjumlahan langkah demi langkah
          </p>
        </div>

        {/* concept intro */}
        <div className="rounded-2xl border border-amber-500/25 bg-amber-900/10 px-5 py-4 mb-6">
          <p className="text-sm font-body text-amber-200/90 leading-relaxed">
            <span className="font-bold text-amber-300">📌 Cara Membaca Animasi:</span>{" "}
            Titik <span className="text-purple-300 font-semibold">ungu</span> = posisi awal.{" "}
            Setiap <span className="text-cyan-300 font-semibold">busur ke bawah</span> mewakili satu langkah (+1 atau −1) pada garis bilangan.{" "}
            Titik <span className="text-amber-300 font-semibold">kuning ✨</span> = hasil akhir.
          </p>
        </div>

        {/* example selector pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-5">
          {EXAMPLES.map((e, i) => (
            <button key={e.id} onClick={() => handleSelect(i)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-all active:scale-95"
              style={i === selected ? {
                background: e.color + "30",
                border: `1.5px solid ${e.color}`,
                color: e.color,
                boxShadow: `0 0 10px ${e.color}44`,
              } : {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.5)",
              }}>
              {e.id}. {e.a} + ({e.b})
            </button>
          ))}
        </div>

        {/* example card */}
        <div className="mb-4">
          <ExampleCard key={`ex-${selected}`} ex={ex} animKey={animKey} />
        </div>

        {/* prev / next nav */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <button onClick={() => handleSelect(Math.max(0, selected - 1))}
            disabled={selected === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-white/8 border border-white/10 text-white/70 disabled:opacity-25 hover:bg-white/15 active:scale-95 transition-all">
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <span className="text-xs text-white/30 font-body">{selected + 1} / {EXAMPLES.length}</span>
          <button onClick={() => handleSelect(Math.min(EXAMPLES.length - 1, selected + 1))}
            disabled={selected === EXAMPLES.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-white/8 border border-white/10 text-white/70 disabled:opacity-25 hover:bg-white/15 active:scale-95 transition-all">
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* rules */}
        <div className="mb-8">
          <RulesCard />
        </div>

        {/* interactive calculator */}
        <KalkulatorInteraktif />
      </div>
    </div>
  );
};

export default BukuAnimasiPenjumlahanPage;
