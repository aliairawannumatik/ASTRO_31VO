import { useState, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const VIEW = 400;
const RANGE = 8;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

const toSVGX = (v: number) => O + v * CELL;
const toSVGY = (v: number) => O - v * CELL;
const fromSVGX = (p: number) => Math.round(((p - O) / CELL) * 2) / 2;
const fromSVGY = (p: number) => Math.round((-(p - O) / CELL) * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Equation = {
  a: number;
  b: number;
  c: number;
  label: string;
  color: string;
  glow: string;
};

type System = {
  id: string;
  titles: { id: string; en: string; ja: string };
  eq1: Equation;
  eq2: Equation;
  solution: { x: number; y: number };
};

const SYSTEMS: System[] = [
  {
    id: "s1",
    titles: { id: "Sistem 1 — Mudah", en: "System 1 — Easy", ja: "問題1 — 基本" },
    eq1: { a: 1, b: 1, c: 5, label: "x + y = 5", color: "#22d3ee", glow: "drop-shadow(0 0 6px #22d3ee)" },
    eq2: { a: 1, b: -1, c: 1, label: "x − y = 1", color: "#f472b6", glow: "drop-shadow(0 0 6px #f472b6)" },
    solution: { x: 3, y: 2 },
  },
  {
    id: "s2",
    titles: { id: "Sistem 2 — Sedang", en: "System 2 — Medium", ja: "問題2 — 標準" },
    eq1: { a: 2, b: 1, c: 8, label: "2x + y = 8", color: "#fbbf24", glow: "drop-shadow(0 0 6px #fbbf24)" },
    eq2: { a: 1, b: 1, c: 5, label: "x + y = 5", color: "#a78bfa", glow: "drop-shadow(0 0 6px #a78bfa)" },
    solution: { x: 3, y: 2 },
  },
  {
    id: "s3",
    titles: { id: "Sistem 3 — Tantangan", en: "System 3 — Challenge", ja: "問題3 — 発展" },
    eq1: { a: 3, b: 2, c: 12, label: "3x + 2y = 12", color: "#34d399", glow: "drop-shadow(0 0 6px #34d399)" },
    eq2: { a: 1, b: -1, c: -1, label: "x − y = −1", color: "#fb7185", glow: "drop-shadow(0 0 6px #fb7185)" },
    solution: { x: 2, y: 3 },
  },
];

const ui = {
  id: {
    systemLabel: "Sistem Persamaan",
    checkLabel: "Cek Substitusi",
    eq1Label: "Pers 1",
    eq2Label: "Pers 2",
    solved: "SOLUSI DITEMUKAN!",
    solvedSub: (x: number, y: number) => `(${x}, ${y}) memenuhi keduanya.`,
    hint1: "Sudah pas di garis 1, geser sedikit agar pas di garis 2 juga.",
    hint2: "Sudah pas di garis 2, geser sedikit agar pas di garis 1 juga.",
    hintNone: "Geser titik ke arah perpotongan dua garis.",
    showBtn: "💡 Tunjukkan",
    resetBtn: "🔄 Ulang",
    dragHint: "🖱️ Seret titik putih ke perpotongan dua garis untuk menemukan solusinya.",
  },
  en: {
    systemLabel: "System of Equations",
    checkLabel: "Substitution Check",
    eq1Label: "Eq 1",
    eq2Label: "Eq 2",
    solved: "SOLUTION FOUND!",
    solvedSub: (x: number, y: number) => `(${x}, ${y}) satisfies both equations.`,
    hint1: "On line 1 — move slightly to also land on line 2.",
    hint2: "On line 2 — move slightly to also land on line 1.",
    hintNone: "Drag the point toward the intersection of the two lines.",
    showBtn: "💡 Show",
    resetBtn: "🔄 Reset",
    dragHint: "🖱️ Drag the white point to the intersection of the two lines to find the solution.",
  },
  ja: {
    systemLabel: "連立方程式",
    checkLabel: "代入チェック",
    eq1Label: "式1",
    eq2Label: "式2",
    solved: "解が見つかりました！",
    solvedSub: (x: number, y: number) => `(${x}, ${y}) が両方の式を満たします。`,
    hint1: "直線1上にいます。直線2にも重なるよう少し動かしてください。",
    hint2: "直線2上にいます。直線1にも重なるよう少し動かしてください。",
    hintNone: "2本の直線の交点に向かって点をドラッグしてください。",
    showBtn: "💡 表示",
    resetBtn: "🔄 リセット",
    dragHint: "🖱️ 白い点を2本の直線の交点にドラッグして解を見つけよう。",
  },
};

function getLineEndpoints(eq: Equation) {
  const points: { x: number; y: number }[] = [];
  if (eq.b !== 0) {
    for (const x of [-RANGE, RANGE]) {
      const y = (eq.c - eq.a * x) / eq.b;
      if (y >= -RANGE && y <= RANGE) points.push({ x, y });
    }
  }
  if (eq.a !== 0) {
    for (const y of [-RANGE, RANGE]) {
      const x = (eq.c - eq.b * y) / eq.a;
      if (x >= -RANGE && x <= RANGE) points.push({ x, y });
    }
  }
  const unique = points.filter(
    (p, i, arr) => arr.findIndex((q) => Math.abs(q.x - p.x) < 0.001 && Math.abs(q.y - p.y) < 0.001) === i,
  );
  return unique.slice(0, 2);
}

export default function SPLDVGraphInteractive() {
  const { language } = useLanguage();
  const t = ui[language];

  const [systemIdx, setSystemIdx] = useState(0);
  const [point, setPoint] = useState({ x: -2, y: -2 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const system = SYSTEMS[systemIdx];
  const systemTitle = system.titles[language];

  const eq1Endpoints = useMemo(() => getLineEndpoints(system.eq1), [system]);
  const eq2Endpoints = useMemo(() => getLineEndpoints(system.eq2), [system]);

  const onLine1 = Math.abs(system.eq1.a * point.x + system.eq1.b * point.y - system.eq1.c) < 0.5;
  const onLine2 = Math.abs(system.eq2.a * point.x + system.eq2.b * point.y - system.eq2.c) < 0.5;
  const isSolution = onLine1 && onLine2 && Math.abs(point.x - system.solution.x) < 0.6 && Math.abs(point.y - system.solution.y) < 0.6;

  const lhs1 = system.eq1.a * point.x + system.eq1.b * point.y;
  const lhs2 = system.eq2.a * point.x + system.eq2.b * point.y;

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const scaleX = VIEW / rect.width;
    const scaleY = VIEW / rect.height;
    return {
      svgX: (e.clientX - rect.left) * scaleX,
      svgY: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const updatePoint = useCallback((sx: number, sy: number) => {
    const x = clamp(fromSVGX(sx), -RANGE, RANGE);
    const y = clamp(fromSVGY(sy), -RANGE, RANGE);
    setPoint({ x, y });
  }, []);

  const handleDown = useCallback(
    (e: React.PointerEvent<SVGCircleElement>) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
      setDragging(true);
      const pos = getSVGPos(e);
      if (pos) updatePoint(pos.svgX, pos.svgY);
    },
    [getSVGPos, updatePoint],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const pos = getSVGPos(e);
      if (pos) updatePoint(pos.svgX, pos.svgY);
    },
    [dragging, getSVGPos, updatePoint],
  );

  const handleUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.target as SVGCircleElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  }, []);

  const snapToSolution = () => setPoint(system.solution);
  const resetPoint = () => setPoint({ x: -2, y: -2 });

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-cyan-300/20 p-3 md:p-4">
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {SYSTEMS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSystemIdx(i);
              setPoint({ x: -2, y: -2 });
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all border ${
              i === systemIdx
                ? "bg-cyan-500 text-slate-900 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                : "border-white/20 text-white/70 bg-white/5 hover:bg-white/10"
            }`}
          >
            {s.titles[language]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_220px] gap-4 items-start">
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="w-full h-auto rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 touch-none"
            onPointerMove={handleMove}
          >
            {Array.from({ length: RANGE * 2 + 1 }).map((_, i) => {
              const v = i - RANGE;
              return (
                <g key={`g${i}`}>
                  <line x1={toSVGX(v)} y1={0} x2={toSVGX(v)} y2={VIEW} stroke={v === 0 ? "#64748b" : "#1e293b"} strokeWidth={v === 0 ? 1.5 : 0.6} />
                  <line x1={0} y1={toSVGY(v)} x2={VIEW} y2={toSVGY(v)} stroke={v === 0 ? "#64748b" : "#1e293b"} strokeWidth={v === 0 ? 1.5 : 0.6} />
                </g>
              );
            })}
            {[-6, -4, -2, 2, 4, 6].map((v) => (
              <g key={`l${v}`}>
                <text x={toSVGX(v)} y={O + 12} fill="#64748b" fontSize="9" textAnchor="middle">{v}</text>
                <text x={O - 6} y={toSVGY(v) + 3} fill="#64748b" fontSize="9" textAnchor="end">{v}</text>
              </g>
            ))}
            <text x={VIEW - 8} y={O - 4} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">x</text>
            <text x={O + 4} y={12} fill="#94a3b8" fontSize="11" fontWeight="bold">y</text>

            {eq1Endpoints.length === 2 && (
              <line x1={toSVGX(eq1Endpoints[0].x)} y1={toSVGY(eq1Endpoints[0].y)} x2={toSVGX(eq1Endpoints[1].x)} y2={toSVGY(eq1Endpoints[1].y)} stroke={system.eq1.color} strokeWidth={3} strokeLinecap="round" style={{ filter: system.eq1.glow }} />
            )}
            {eq2Endpoints.length === 2 && (
              <line x1={toSVGX(eq2Endpoints[0].x)} y1={toSVGY(eq2Endpoints[0].y)} x2={toSVGX(eq2Endpoints[1].x)} y2={toSVGY(eq2Endpoints[1].y)} stroke={system.eq2.color} strokeWidth={3} strokeLinecap="round" style={{ filter: system.eq2.glow }} />
            )}
            {isSolution && (
              <>
                <circle cx={toSVGX(system.solution.x)} cy={toSVGY(system.solution.y)} r={20} fill="none" stroke="#fde047" strokeWidth={2} opacity={0.7} className="animate-ping" />
                <circle cx={toSVGX(system.solution.x)} cy={toSVGY(system.solution.y)} r={14} fill="none" stroke="#facc15" strokeWidth={2} opacity={0.9} />
              </>
            )}
            <circle cx={toSVGX(point.x)} cy={toSVGY(point.y)} r={11} fill={isSolution ? "#facc15" : "#f8fafc"} stroke={isSolution ? "#fde047" : "#22d3ee"} strokeWidth={3} onPointerDown={handleDown} onPointerUp={handleUp} style={{ cursor: dragging ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))" }} />
            <text x={toSVGX(point.x) + 14} y={toSVGY(point.y) - 12} fill={isSolution ? "#fde047" : "#e2e8f0"} fontSize="12" fontWeight="bold" style={{ pointerEvents: "none" }}>({point.x}, {point.y})</text>
          </svg>
          <p className="mt-2 text-[11px] text-center text-white/55 font-body italic">{t.dragHint}</p>
        </div>

        <div className="space-y-2">
          <div className="rounded-xl border border-white/15 bg-black/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">{t.systemLabel}</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: system.eq1.color }} />
                <span className="text-sm font-bold text-white">{system.eq1.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: system.eq2.color }} />
                <span className="text-sm font-bold text-white">{system.eq2.label}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-black/30 p-3 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-white/50">{t.checkLabel}</p>
            <div className={`rounded-lg px-2 py-1.5 text-xs font-bold ${onLine1 ? "bg-emerald-500/20 text-emerald-200 border border-emerald-300/40" : "bg-white/5 text-white/70 border border-white/10"}`}>
              <span className="opacity-70">{t.eq1Label}: </span>
              {system.eq1.a}({point.x}) {system.eq1.b >= 0 ? "+" : "−"} {Math.abs(system.eq1.b)}({point.y}) = {lhs1}
              {onLine1 ? " ✓" : ` ≠ ${system.eq1.c}`}
            </div>
            <div className={`rounded-lg px-2 py-1.5 text-xs font-bold ${onLine2 ? "bg-emerald-500/20 text-emerald-200 border border-emerald-300/40" : "bg-white/5 text-white/70 border border-white/10"}`}>
              <span className="opacity-70">{t.eq2Label}: </span>
              {system.eq2.a}({point.x}) {system.eq2.b >= 0 ? "+" : "−"} {Math.abs(system.eq2.b)}({point.y}) = {lhs2}
              {onLine2 ? " ✓" : ` ≠ ${system.eq2.c}`}
            </div>
          </div>

          {isSolution ? (
            <div className="rounded-xl border-2 border-yellow-300/60 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 p-3 text-center animate-pulse">
              <p className="text-2xl mb-1">🏆</p>
              <p className="text-sm font-bold text-yellow-100">{t.solved}</p>
              <p className="text-xs text-yellow-200 mt-1">{t.solvedSub(system.solution.x, system.solution.y)}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-3 text-center">
              <p className="text-xs text-cyan-100 font-body">
                {onLine1 && !onLine2 && t.hint1}
                {onLine2 && !onLine1 && t.hint2}
                {!onLine1 && !onLine2 && t.hintNone}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={snapToSolution} className="flex-1 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-bold py-2 transition-colors">{t.showBtn}</button>
            <button type="button" onClick={resetPoint} className="flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 transition-colors">{t.resetBtn}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
