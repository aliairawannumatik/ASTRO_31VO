import { useState, useRef, useCallback, useMemo } from "react";

const VIEW = 400;
const RANGE = 8;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

const toSVGX = (v: number) => O + v * CELL;
const toSVGY = (v: number) => O - v * CELL;
const fromSVGX = (p: number) => Math.round((p - O) / CELL);
const fromSVGY = (p: number) => Math.round(-(p - O) / CELL);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Challenge = {
  id: string;
  label: string;
  check: (m: number | null, c: number | null) => boolean;
  hint: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: "free",
    label: "🎨 Eksplorasi Bebas",
    check: () => true,
    hint: "Geser titik biru atau merah ke mana saja. Perhatikan bagaimana m dan c berubah.",
  },
  {
    id: "m2",
    label: "Buat garis dengan m = 2",
    check: (m) => m === 2,
    hint: "Naik 2 satuan setiap geser 1 satuan ke kanan.",
  },
  {
    id: "mneg1",
    label: "Buat garis dengan m = −1",
    check: (m) => m === -1,
    hint: "Turun 1 satuan setiap geser 1 satuan ke kanan.",
  },
  {
    id: "horizontal",
    label: "Buat garis MENDATAR (m = 0)",
    check: (m) => m === 0,
    hint: "Posisikan kedua titik di ketinggian (y) yang sama.",
  },
  {
    id: "intercept3",
    label: "Buat garis y = x + 3",
    check: (m, c) => m === 1 && c === 3,
    hint: "Gradien 1 dan memotong sumbu y di titik 3.",
  },
  {
    id: "throughorigin",
    label: "Buat garis melewati titik (0, 0) dengan m = 3",
    check: (m, c) => m === 3 && c === 0,
    hint: "Salah satu titik harus di (0, 0).",
  },
];

export default function PGLGradientInteractive() {
  const [pA, setPA] = useState({ x: -2, y: -1 });
  const [pB, setPB] = useState({ x: 3, y: 4 });
  const [dragging, setDragging] = useState<"A" | "B" | null>(null);
  const [showRiseRun, setShowRiseRun] = useState(true);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const isVertical = dx === 0;
  const m = isVertical ? null : dy / dx;
  const c = m === null ? null : pA.y - m * pA.x;

  const challenge = CHALLENGES[challengeIdx];
  const challengeMet = challenge.check(m, c);

  const lineEnds = useMemo(() => {
    if (isVertical) {
      return [
        { x: pA.x, y: -RANGE },
        { x: pA.x, y: RANGE },
      ];
    }
    if (m === null) return [];
    const points: { x: number; y: number }[] = [];
    for (const x of [-RANGE, RANGE]) {
      const y = m * x + (c ?? 0);
      if (y >= -RANGE && y <= RANGE) points.push({ x, y });
    }
    if (m !== 0) {
      for (const y of [-RANGE, RANGE]) {
        const x = (y - (c ?? 0)) / m;
        if (x >= -RANGE && x <= RANGE) points.push({ x, y });
      }
    }
    const unique = points.filter(
      (p, i, arr) => arr.findIndex((q) => Math.abs(q.x - p.x) < 0.001 && Math.abs(q.y - p.y) < 0.001) === i,
    );
    return unique.slice(0, 2);
  }, [m, c, isVertical, pA]);

  const lineColor = useMemo(() => {
    if (m === null) return "#94a3b8";
    if (m > 0) return "#34d399";
    if (m < 0) return "#fb7185";
    return "#22d3ee";
  }, [m]);

  const formatEquation = () => {
    if (isVertical) return `x = ${pA.x}`;
    if (m === null || c === null) return "—";
    const mPart = m === 0 ? "" : m === 1 ? "x" : m === -1 ? "−x" : `${m}x`;
    const cPart = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
    if (m === 0) return `y = ${c}`;
    return `y = ${mPart}${cPart}`;
  };

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      svgX: ((e.clientX - rect.left) / rect.width) * VIEW,
      svgY: ((e.clientY - rect.top) / rect.height) * VIEW,
    };
  }, []);

  const handleDown = useCallback(
    (e: React.PointerEvent<SVGCircleElement>, id: "A" | "B") => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
      setDragging(id);
    },
    [],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const pos = getSVGPos(e);
      if (!pos) return;
      const x = clamp(fromSVGX(pos.svgX), -RANGE, RANGE);
      const y = clamp(fromSVGY(pos.svgY), -RANGE, RANGE);
      const newPoint = { x, y };
      if (dragging === "A" && (newPoint.x !== pB.x || newPoint.y !== pB.y)) setPA(newPoint);
      else if (dragging === "B" && (newPoint.x !== pA.x || newPoint.y !== pA.y)) setPB(newPoint);
    },
    [dragging, getSVGPos, pA, pB],
  );

  const handleUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.target as SVGCircleElement).releasePointerCapture(e.pointerId);
    setDragging(null);
  }, []);

  const reset = () => {
    setPA({ x: -2, y: -1 });
    setPB({ x: 3, y: 4 });
  };

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-emerald-300/20 p-3 md:p-4">
      {/* Challenge selector */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setChallengeIdx(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all border ${
              i === challengeIdx
                ? "bg-emerald-500 text-slate-900 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                : "border-white/20 text-white/70 bg-white/5 hover:bg-white/10"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-4 items-start">
        {/* Graph */}
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="w-full h-auto rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 touch-none"
            onPointerMove={handleMove}
          >
            {/* Grid */}
            {Array.from({ length: RANGE * 2 + 1 }).map((_, i) => {
              const v = i - RANGE;
              return (
                <g key={`g${i}`}>
                  <line
                    x1={toSVGX(v)}
                    y1={0}
                    x2={toSVGX(v)}
                    y2={VIEW}
                    stroke={v === 0 ? "#64748b" : "#1e293b"}
                    strokeWidth={v === 0 ? 1.5 : 0.6}
                  />
                  <line
                    x1={0}
                    y1={toSVGY(v)}
                    x2={VIEW}
                    y2={toSVGY(v)}
                    stroke={v === 0 ? "#64748b" : "#1e293b"}
                    strokeWidth={v === 0 ? 1.5 : 0.6}
                  />
                </g>
              );
            })}

            {/* Axis labels */}
            {[-6, -4, -2, 2, 4, 6].map((v) => (
              <g key={`lbl${v}`}>
                <text x={toSVGX(v)} y={O + 12} fill="#64748b" fontSize="9" textAnchor="middle">{v}</text>
                <text x={O - 6} y={toSVGY(v) + 3} fill="#64748b" fontSize="9" textAnchor="end">{v}</text>
              </g>
            ))}
            <text x={VIEW - 8} y={O - 4} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">x</text>
            <text x={O + 4} y={12} fill="#94a3b8" fontSize="11" fontWeight="bold">y</text>

            {/* Line */}
            {lineEnds.length === 2 && (
              <line
                x1={toSVGX(lineEnds[0].x)}
                y1={toSVGY(lineEnds[0].y)}
                x2={toSVGX(lineEnds[1].x)}
                y2={toSVGY(lineEnds[1].y)}
                stroke={lineColor}
                strokeWidth={3}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${lineColor})` }}
              />
            )}

            {/* Rise/Run visualization */}
            {showRiseRun && !isVertical && dx !== 0 && (
              <>
                <line
                  x1={toSVGX(pA.x)}
                  y1={toSVGY(pA.y)}
                  x2={toSVGX(pB.x)}
                  y2={toSVGY(pA.y)}
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
                <line
                  x1={toSVGX(pB.x)}
                  y1={toSVGY(pA.y)}
                  x2={toSVGX(pB.x)}
                  y2={toSVGY(pB.y)}
                  stroke="#a78bfa"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
                <text
                  x={(toSVGX(pA.x) + toSVGX(pB.x)) / 2}
                  y={toSVGY(pA.y) + (pA.y > pB.y ? -6 : 14)}
                  fill="#fbbf24"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  Δx = {dx}
                </text>
                <text
                  x={toSVGX(pB.x) + (dx > 0 ? 6 : -6)}
                  y={(toSVGY(pA.y) + toSVGY(pB.y)) / 2}
                  fill="#a78bfa"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor={dx > 0 ? "start" : "end"}
                  style={{ pointerEvents: "none" }}
                >
                  Δy = {dy}
                </text>
              </>
            )}

            {/* Y-intercept marker */}
            {!isVertical && m !== null && c !== null && c >= -RANGE && c <= RANGE && (
              <>
                <circle cx={toSVGX(0)} cy={toSVGY(c)} r={5} fill="#fde047" stroke="#facc15" strokeWidth={2} />
                <text x={toSVGX(0) + 8} y={toSVGY(c) - 6} fill="#fde047" fontSize="10" fontWeight="bold">
                  c={c}
                </text>
              </>
            )}

            {/* Point A (blue) */}
            <circle
              cx={toSVGX(pA.x)}
              cy={toSVGY(pA.y)}
              r={11}
              fill="#22d3ee"
              stroke="#0e7490"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "A")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "A" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.7))" }}
            />
            <text
              x={toSVGX(pA.x) - 14}
              y={toSVGY(pA.y) - 12}
              fill="#22d3ee"
              fontSize="12"
              fontWeight="bold"
              textAnchor="end"
              style={{ pointerEvents: "none" }}
            >
              A({pA.x}, {pA.y})
            </text>

            {/* Point B (pink) */}
            <circle
              cx={toSVGX(pB.x)}
              cy={toSVGY(pB.y)}
              r={11}
              fill="#f472b6"
              stroke="#9f1239"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "B")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "B" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(244,114,182,0.7))" }}
            />
            <text
              x={toSVGX(pB.x) + 14}
              y={toSVGY(pB.y) - 12}
              fill="#f472b6"
              fontSize="12"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              B({pB.x}, {pB.y})
            </text>
          </svg>
          <p className="mt-2 text-[11px] text-center text-white/55 font-body italic">
            🖱️ Seret titik biru (A) atau merah muda (B). Kuning = perubahan x, ungu = perubahan y.
          </p>
        </div>

        {/* Info panel */}
        <div className="space-y-2">
          <div className={`rounded-xl border-2 p-3 transition-all ${
            challengeIdx === 0
              ? "border-emerald-300/30 bg-emerald-500/10"
              : challengeMet
                ? "border-yellow-300/60 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 animate-pulse"
                : "border-amber-300/30 bg-amber-500/10"
          }`}>
            <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Tantangan</p>
            <p className="text-sm font-bold text-white">{challenge.label}</p>
            {challengeIdx !== 0 && (
              <p className="text-xs mt-1 text-white/70 italic">
                {challengeMet ? "🏆 BERHASIL!" : `💡 ${challenge.hint}`}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200/70 mb-1">Persamaan Garis</p>
            <p className="text-xl font-display font-bold text-emerald-100">{formatEquation()}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-black/30 p-3 space-y-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Gradien (m)</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold" style={{ color: lineColor }}>
                  {m === null ? "∞" : m % 1 === 0 ? m : m.toFixed(2)}
                </span>
                <span className="text-[11px] text-white/60">
                  = Δy/Δx = {dy}/{isVertical ? "0" : dx}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Konstanta (c)</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-yellow-200">
                  {c === null ? "—" : c % 1 === 0 ? c : c.toFixed(2)}
                </span>
                <span className="text-[11px] text-white/60">titik potong sumbu y</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-black/30 p-3 text-xs text-white/75">
            <p className="font-bold text-white/85 mb-1">📊 Jenis Garis:</p>
            {m === null && <p>↕️ Garis VERTIKAL (gradien tak hingga)</p>}
            {m !== null && m === 0 && <p>↔️ Garis MENDATAR (gradien nol)</p>}
            {m !== null && m > 0 && <p className="text-emerald-300">↗️ NAIK ke kanan (m positif)</p>}
            {m !== null && m < 0 && <p className="text-rose-300">↘️ TURUN ke kanan (m negatif)</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowRiseRun((v) => !v)}
              className="flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 transition-colors"
            >
              {showRiseRun ? "📐 Sembunyikan Δ" : "📐 Tampilkan Δ"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 transition-colors"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
