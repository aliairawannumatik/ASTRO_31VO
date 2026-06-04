import { useState, useRef, useCallback } from "react";

const VIEW = 400;
const RANGE = 8;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

function toSX(v: number) { return O + v * CELL; }
function toSY(v: number) { return O - v * CELL; }
function fromSX(p: number) { return Math.round((p - O) / CELL); }
function fromSY(p: number) { return Math.round(-(p - O) / CELL); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

type MirrorType = "sumbu-x" | "sumbu-y" | "y=x" | "y=-x" | "titik-o";

interface MirrorDef {
  id: MirrorType;
  label: string;
  labelFull: string;
  rule: string;
  color: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}

const MIRRORS: MirrorDef[] = [
  {
    id: "sumbu-x",
    label: "Sumbu X",
    labelFull: "Sumbu X",
    rule: "(x, y) → (x, −y)",
    color: "#22d3ee",
    borderClass: "border-cyan-400/60",
    bgClass: "bg-cyan-500/15",
    textClass: "text-cyan-300",
  },
  {
    id: "sumbu-y",
    label: "Sumbu Y",
    labelFull: "Sumbu Y",
    rule: "(x, y) → (−x, y)",
    color: "#f472b6",
    borderClass: "border-pink-400/60",
    bgClass: "bg-pink-500/15",
    textClass: "text-pink-300",
  },
  {
    id: "y=x",
    label: "y = x",
    labelFull: "Garis y = x",
    rule: "(x, y) → (y, x)",
    color: "#fbbf24",
    borderClass: "border-amber-400/60",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-300",
  },
  {
    id: "y=-x",
    label: "y = −x",
    labelFull: "Garis y = −x",
    rule: "(x, y) → (−y, −x)",
    color: "#a78bfa",
    borderClass: "border-violet-400/60",
    bgClass: "bg-violet-500/15",
    textClass: "text-violet-300",
  },
  {
    id: "titik-o",
    label: "Titik O",
    labelFull: "Titik O(0,0)",
    rule: "(x, y) → (−x, −y)",
    color: "#34d399",
    borderClass: "border-emerald-400/60",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-300",
  },
];

function reflectPoint(x: number, y: number, mirror: MirrorType): [number, number] {
  switch (mirror) {
    case "sumbu-x": return [x, -y];
    case "sumbu-y": return [-x, y];
    case "y=x":     return [y, x];
    case "y=-x":    return [-y, -x];
    case "titik-o": return [-x, -y];
  }
}

const INIT_SINGLE = { x: 3, y: 2 };
const INIT_TRIANGLE = [
  { id: "A", x: 2, y: 5, fill: "#22d3ee", stroke: "#0891b2" },
  { id: "B", x: 5, y: 1, fill: "#f472b6", stroke: "#db2777" },
  { id: "C", x: 1, y: 1, fill: "#fbbf24", stroke: "#d97706" },
];

const ticks = Array.from({ length: RANGE * 2 - 1 }, (_, i) => i - RANGE + 1).filter(v => v !== 0);
const gridLines = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE);

export default function RefleksiDragAnimation() {
  const [mode, setMode] = useState<"titik" | "segitiga">("titik");
  const [mirror, setMirror] = useState<MirrorType>("sumbu-x");
  const [showReflection, setShowReflection] = useState(false);
  const [singlePt, setSinglePt] = useState(INIT_SINGLE);
  const [triangle, setTriangle] = useState(INIT_TRIANGLE);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentMirror = MIRRORS.find(m => m.id === mirror)!;

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      svgX: (e.clientX - rect.left) * (VIEW / rect.width),
      svgY: (e.clientY - rect.top) * (VIEW / rect.height),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGCircleElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
    setDraggingId(id);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingId) return;
    const pos = getSVGPos(e);
    if (!pos) return;
    const nx = clamp(fromSX(pos.svgX), -RANGE + 1, RANGE - 1);
    const ny = clamp(fromSY(pos.svgY), -RANGE + 1, RANGE - 1);
    if (draggingId === "P") {
      setSinglePt({ x: nx, y: ny });
    } else {
      setTriangle(prev => prev.map(pt => pt.id === draggingId ? { ...pt, x: nx, y: ny } : pt));
    }
  }, [draggingId, getSVGPos]);

  const handlePointerUp = useCallback(() => setDraggingId(null), []);

  const handleReset = () => {
    setSinglePt(INIT_SINGLE);
    setTriangle(INIT_TRIANGLE);
    setShowReflection(false);
  };

  const [spRx, spRy] = reflectPoint(singlePt.x, singlePt.y, mirror);
  const triangleReflected = triangle.map(pt => {
    const [rx, ry] = reflectPoint(pt.x, pt.y, mirror);
    return { ...pt, x: rx, y: ry };
  });

  const renderMirrorLine = () => {
    const c = currentMirror.color;
    const dash = "6 4";
    switch (mirror) {
      case "sumbu-x":
        return <line x1={8} y1={toSY(0)} x2={VIEW - 8} y2={toSY(0)} stroke={c} strokeWidth="2.5" strokeDasharray={dash} opacity="0.85" />;
      case "sumbu-y":
        return <line x1={toSX(0)} y1={8} x2={toSX(0)} y2={VIEW - 8} stroke={c} strokeWidth="2.5" strokeDasharray={dash} opacity="0.85" />;
      case "y=x":
        return <line x1={toSX(-RANGE)} y1={toSY(-RANGE)} x2={toSX(RANGE)} y2={toSY(RANGE)} stroke={c} strokeWidth="2" strokeDasharray={dash} opacity="0.85" />;
      case "y=-x":
        return <line x1={toSX(-RANGE)} y1={toSY(RANGE)} x2={toSX(RANGE)} y2={toSY(-RANGE)} stroke={c} strokeWidth="2" strokeDasharray={dash} opacity="0.85" />;
      case "titik-o":
        return (
          <>
            <circle cx={toSX(0)} cy={toSY(0)} r="10" fill={c} opacity="0.2" />
            <circle cx={toSX(0)} cy={toSY(0)} r="5" fill={c} opacity="0.7" />
          </>
        );
    }
  };

  const renderMirrorLabel = () => {
    const c = currentMirror.color;
    switch (mirror) {
      case "sumbu-x": return <text x={VIEW - 12} y={toSY(0) - 6} fill={c} fontSize="11" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">Sumbu X</text>;
      case "sumbu-y": return <text x={toSX(0) + 6} y={18} fill={c} fontSize="11" fontWeight="bold" fontFamily="sans-serif">Sumbu Y</text>;
      case "y=x":     return <text x={toSX(RANGE) - 4} y={toSY(RANGE) + 14} fill={c} fontSize="11" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">y=x</text>;
      case "y=-x":    return <text x={toSX(RANGE) - 4} y={toSY(-RANGE) - 4} fill={c} fontSize="11" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">y=−x</text>;
      case "titik-o": return <text x={toSX(0) + 8} y={toSY(0) - 10} fill={c} fontSize="11" fontWeight="bold" fontFamily="sans-serif">O(0,0)</text>;
    }
  };

  const renderDashedPerp = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={toSX(x1)} y1={toSY(y1)} x2={toSX(x2)} y2={toSY(y2)}
      stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-indigo-950/30 backdrop-blur mb-6">

      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-base font-bold text-cyan-300 mb-0.5">
              🪞 Animasi 1 — Refleksi Titik dan Bangun Datar
            </p>
            <p className="text-xs text-white/50 font-body">
              Seret titik/simpul · Pilih cermin · Tekan tombol untuk menampilkan bayangan
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white/60 hover:text-white transition-all cursor-pointer font-body shrink-0"
          >
            🔄 Reset
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mt-3">
          {(["titik", "segitiga"] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setShowReflection(false); }}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold font-body transition-all cursor-pointer border ${
                mode === m
                  ? "bg-cyan-500/25 border-cyan-400/60 text-cyan-200"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/75"
              }`}
            >
              {m === "titik" ? "📍 Satu Titik" : "🔺 Segitiga (Bangun Datar)"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-0">

        {/* SVG Canvas */}
        <div className="flex-1 p-3 min-w-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="w-full rounded-xl border border-white/10"
            style={{ background: "rgba(2,6,23,0.9)", maxHeight: 400, touchAction: "none", cursor: draggingId ? "grabbing" : "default" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <marker id="rfl-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.45)" />
              </marker>
            </defs>

            {/* Grid */}
            {gridLines.map(v => (
              <g key={v}>
                <line x1={toSX(v)} y1={0} x2={toSX(v)} y2={VIEW}
                  stroke={v === 0 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.055)"}
                  strokeWidth={v === 0 ? 1.5 : 1} />
                <line x1={0} y1={toSY(v)} x2={VIEW} y2={toSY(v)}
                  stroke={v === 0 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.055)"}
                  strokeWidth={v === 0 ? 1.5 : 1} />
              </g>
            ))}

            {/* Axis arrows */}
            <line x1={O} y1={VIEW - 6} x2={O} y2={6} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" markerEnd="url(#rfl-arrow)" />
            <line x1={6} y1={O} x2={VIEW - 6} y2={O} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" markerEnd="url(#rfl-arrow)" />
            <text x={VIEW - 10} y={O - 7} fill="rgba(255,255,255,0.6)" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">x</text>
            <text x={O + 7} y={16} fill="rgba(255,255,255,0.6)" fontSize="13" fontWeight="bold" fontFamily="sans-serif">y</text>
            <text x={O + 5} y={O + 14} fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">O</text>

            {/* Tick labels */}
            {ticks.filter(v => v % 2 === 0).map(v => (
              <g key={v}>
                <line x1={toSX(v)} y1={O - 3} x2={toSX(v)} y2={O + 3} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <text x={toSX(v)} y={O + 13} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">{v}</text>
                <line x1={O - 3} y1={toSY(v)} x2={O + 3} y2={toSY(v)} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <text x={O - 10} y={toSY(v) + 3} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">{v}</text>
              </g>
            ))}

            {/* Mirror line */}
            {renderMirrorLine()}
            {renderMirrorLabel()}

            {/* ── TITIK MODE ── */}
            {mode === "titik" && (
              <>
                {/* Dashed line from point to reflection */}
                {showReflection && renderDashedPerp(singlePt.x, singlePt.y, spRx, spRy)}

                {/* Reflection point */}
                {showReflection && (
                  <g>
                    <circle cx={toSX(spRx)} cy={toSY(spRy)} r={14} fill="#a78bfa" opacity="0.12" />
                    <circle cx={toSX(spRx)} cy={toSY(spRy)} r={8} fill="#a78bfa" stroke="var(--icon-stroke)" strokeWidth="2" opacity="0.9" />
                    <text
                      x={toSX(spRx) + (spRx >= 0 ? 14 : -14)}
                      y={toSY(spRy) - 10}
                      fill="#c4b5fd" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
                      textAnchor={spRx >= 0 ? "start" : "end"}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      P'({spRx},{spRy})
                    </text>
                  </g>
                )}

                {/* Original point — draggable */}
                <g>
                  {draggingId === "P" && <circle cx={toSX(singlePt.x)} cy={toSY(singlePt.y)} r={18} fill="#22d3ee" opacity="0.12" />}
                  <circle
                    cx={toSX(singlePt.x)} cy={toSY(singlePt.y)} r={draggingId === "P" ? 10 : 8}
                    fill="#22d3ee" stroke="var(--icon-stroke)" strokeWidth="2"
                    style={{ cursor: "grab" }}
                    onPointerDown={(e) => handlePointerDown(e, "P")}
                  />
                  <text
                    x={toSX(singlePt.x) + (singlePt.x >= 0 ? 14 : -14)}
                    y={toSY(singlePt.y) - 10}
                    fill="#67e8f9" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
                    textAnchor={singlePt.x >= 0 ? "start" : "end"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    P({singlePt.x},{singlePt.y})
                  </text>
                </g>
              </>
            )}

            {/* ── SEGITIGA MODE ── */}
            {mode === "segitiga" && (
              <>
                {/* Reflected polygon */}
                {showReflection && (
                  <>
                    {/* Dashed lines from each vertex to reflection */}
                    {triangle.map(pt => {
                      const [rx, ry] = reflectPoint(pt.x, pt.y, mirror);
                      return renderDashedPerp(pt.x, pt.y, rx, ry);
                    })}
                    <polygon
                      points={triangleReflected.map(pt => `${toSX(pt.x)},${toSY(pt.y)}`).join(" ")}
                      fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 3"
                    />
                    {triangleReflected.map(pt => (
                      <g key={`r-${pt.id}`}>
                        <circle cx={toSX(pt.x)} cy={toSY(pt.y)} r={7} fill="#a78bfa" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.85" />
                        <text
                          x={toSX(pt.x) + (pt.x >= 0 ? 13 : -13)}
                          y={toSY(pt.y) - 8}
                          fill="#c4b5fd" fontSize="10" fontWeight="bold" fontFamily="sans-serif"
                          textAnchor={pt.x >= 0 ? "start" : "end"}
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          {pt.id}'({pt.x},{pt.y})
                        </text>
                      </g>
                    ))}
                  </>
                )}

                {/* Original polygon */}
                <polygon
                  points={triangle.map(pt => `${toSX(pt.x)},${toSY(pt.y)}`).join(" ")}
                  fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.6)" strokeWidth="1.5"
                />
                {triangle.map(pt => (
                  <g key={pt.id}>
                    {draggingId === pt.id && <circle cx={toSX(pt.x)} cy={toSY(pt.y)} r={18} fill={pt.fill} opacity="0.12" />}
                    <circle
                      cx={toSX(pt.x)} cy={toSY(pt.y)} r={draggingId === pt.id ? 10 : 8}
                      fill={pt.fill} stroke="var(--icon-stroke)" strokeWidth="2"
                      style={{ cursor: "grab" }}
                      onPointerDown={(e) => handlePointerDown(e, pt.id)}
                    />
                    <text
                      x={toSX(pt.x) + (pt.x >= 0 ? 14 : -14)}
                      y={toSY(pt.y) - 10}
                      fill="var(--icon-color)" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
                      textAnchor={pt.x >= 0 ? "start" : "end"}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {pt.id}({pt.x},{pt.y})
                    </text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Controls Panel */}
        <div className="lg:w-64 p-3 lg:p-4 flex flex-col gap-3 lg:border-l border-white/10">

          {/* Mirror selector */}
          <div>
            <p className="text-xs font-bold text-white/60 font-body mb-2 uppercase tracking-wider">Pilih Cermin</p>
            <div className="flex flex-col gap-1.5">
              {MIRRORS.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMirror(m.id); setShowReflection(false); }}
                  className={`text-left px-3 py-2 rounded-xl border transition-all cursor-pointer font-body ${
                    mirror === m.id
                      ? `${m.bgClass} ${m.borderClass} ${m.textClass}`
                      : "bg-white/5 border-white/10 text-white/50 hover:text-white/75 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: m.color, boxShadow: mirror === m.id ? `0 0 6px ${m.color}` : "none" }}
                    />
                    <span className="text-xs font-bold">{m.label}</span>
                  </div>
                  {mirror === m.id && (
                    <p className="text-[10px] mt-0.5 ml-4.5 font-mono opacity-80">{m.rule}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Show/hide reflection button */}
          <button
            onClick={() => setShowReflection(v => !v)}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm font-body transition-all cursor-pointer border ${
              showReflection
                ? "bg-violet-500/20 border-violet-400/50 text-violet-200 hover:bg-violet-500/30"
                : "bg-cyan-500/20 border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/30"
            }`}
          >
            {showReflection ? "🙈 Sembunyikan Bayangan" : "🪞 Tampilkan Bayangan"}
          </button>

          {/* Coordinate readout */}
          {showReflection && (
            <div className={`rounded-xl border p-3 ${currentMirror.bgClass} ${currentMirror.borderClass}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 font-body ${currentMirror.textClass}`}>
                Hasil Refleksi · {currentMirror.labelFull}
              </p>
              {mode === "titik" ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-cyan-300">P({singlePt.x},{singlePt.y})</span>
                    <span className="text-white/40">→</span>
                    <span className="text-violet-300 font-bold">P'({spRx},{spRy})</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {triangle.map(pt => {
                    const [rx, ry] = reflectPoint(pt.x, pt.y, mirror);
                    return (
                      <div key={pt.id} className="flex items-center gap-2 font-mono text-xs">
                        <span style={{ color: pt.fill }}>{pt.id}({pt.x},{pt.y})</span>
                        <span className="text-white/40">→</span>
                        <span className="text-violet-300 font-bold">{pt.id}'({rx},{ry})</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className={`text-[10px] mt-2 font-mono ${currentMirror.textClass} opacity-70`}>
                Aturan: {currentMirror.rule}
              </p>
            </div>
          )}

          {/* Hint */}
          <p className="text-[10px] text-white/30 font-body text-center leading-relaxed">
            💡 Seret titik berwarna untuk menggerakkan · Garis putus-putus = cermin
          </p>
        </div>
      </div>
    </div>
  );
}
