import { useState, useRef, useCallback } from "react";

const VIEW = 400;
const RANGE = 10;
const CELL = VIEW / (RANGE * 2); // 20px per unit
const O = VIEW / 2; // origin = 200

function toSVGX(v: number) {
  return O + v * CELL;
}
function toSVGY(v: number) {
  return O - v * CELL; // SVG y is inverted: positive math y goes up
}
function fromSVGX(p: number) {
  return Math.round((p - O) / CELL);
}
function fromSVGY(p: number) {
  return Math.round(-(p - O) / CELL);
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function getQuadrant(x: number, y: number): { label: string; color: string } {
  if (x === 0 && y === 0) return { label: "Titik Pusat O(0,0)", color: "text-white" };
  if (x === 0) return { label: "Berada di Sumbu Y", color: "text-white/70" };
  if (y === 0) return { label: "Berada di Sumbu X", color: "text-white/70" };
  if (x > 0 && y > 0) return { label: "Kuadran I (+, +)", color: "text-cyan-300" };
  if (x < 0 && y > 0) return { label: "Kuadran II (−, +)", color: "text-green-300" };
  if (x < 0 && y < 0) return { label: "Kuadran III (−, −)", color: "text-yellow-300" };
  return { label: "Kuadran IV (+, −)", color: "text-pink-300" };
}

interface Point {
  id: string;
  x: number;
  y: number;
  stroke: string;
  fill: string;
  textColor: string;
  quadrantBg: string;
}

const INITIAL_POINTS: Point[] = [
  { id: "A", x: 3, y: 4, fill: "#22d3ee", stroke: "#0e7490", textColor: "text-cyan-300", quadrantBg: "bg-cyan-500/20 border-cyan-500/40" },
  { id: "B", x: -4, y: 3, fill: "#e879f9", stroke: "#a21caf", textColor: "text-fuchsia-300", quadrantBg: "bg-fuchsia-500/20 border-fuchsia-500/40" },
  { id: "C", x: -3, y: -4, fill: "#fbbf24", stroke: "#b45309", textColor: "text-yellow-300", quadrantBg: "bg-yellow-500/20 border-yellow-500/40" },
  { id: "D", x: 4, y: -2, fill: "#4ade80", stroke: "#15803d", textColor: "text-green-300", quadrantBg: "bg-green-500/20 border-green-500/40" },
];

export default function CartesianDragAnimation() {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("A");
  const svgRef = useRef<SVGSVGElement>(null);

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

  const handlePointDown = useCallback((e: React.PointerEvent<SVGCircleElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
    setDraggingId(id);
    setActiveId(id);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingId) return;
    const pos = getSVGPos(e);
    if (!pos) return;
    const newX = clamp(fromSVGX(pos.svgX), -RANGE + 1, RANGE - 1);
    const newY = clamp(fromSVGY(pos.svgY), -RANGE + 1, RANGE - 1);
    setPoints(prev =>
      prev.map(p => p.id === draggingId ? { ...p, x: newX, y: newY } : p)
    );
  }, [draggingId, getSVGPos]);

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleReset = () => {
    setPoints(INITIAL_POINTS);
    setActiveId("A");
  };

  const activePoint = points.find(p => p.id === activeId)!;
  const { label: quadLabel, color: quadColor } = getQuadrant(activePoint.x, activePoint.y);

  const ticks = Array.from({ length: RANGE * 2 - 1 }, (_, i) => i - RANGE + 1).filter(v => v !== 0);
  const gridLines = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE);

  return (
    <div className="cartesian-diagram-scope rounded-2xl overflow-hidden border border-cyan-500/30 bg-card/90 backdrop-blur">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 text-center">
        <p className="font-display text-sm font-bold text-cyan-300 mb-0.5">
          🎮 Diagram Kartesius Interaktif
        </p>
        <p className="text-xs text-white/50 font-body">
          Seret titik-titik berwarna untuk melihat koordinatnya berubah!
        </p>
      </div>

      {/* SVG Grid */}
      <div className="px-3 pb-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="w-full rounded-xl border border-white/10 cursor-crosshair"
          style={{ background: "var(--bg-card)", maxHeight: 360, touchAction: "none" }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid lines */}
          {gridLines.map(v => (
            <g key={v}>
              <line
                className={v === 0 ? "cartesian-grid-line-main" : "cartesian-grid-line"}
                x1={toSVGX(v)} y1={0} x2={toSVGX(v)} y2={VIEW}
                stroke={v === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.06)"}
                strokeWidth={v === 0 ? 1.5 : 1}
              />
              <line
                className={v === 0 ? "cartesian-grid-line-main" : "cartesian-grid-line"}
                x1={0} y1={toSVGY(v)} x2={VIEW} y2={toSVGY(v)}
                stroke={v === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.06)"}
                strokeWidth={v === 0 ? 1.5 : 1}
              />
            </g>
          ))}

          {/* Axis arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path className="cartesian-axis-line" d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>
          <line className="cartesian-axis-line" x1={O} y1={VIEW - 6} x2={O} y2={8} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          <line className="cartesian-axis-line" x1={6} y1={O} x2={VIEW - 6} y2={O} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

          {/* Axis labels */}
          <text className="cartesian-axis-label" x={VIEW - 12} y={O - 6} fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">x</text>
          <text className="cartesian-axis-label" x={O + 6} y={16} fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="bold" fontFamily="sans-serif">y</text>
          <text className="cartesian-axis-label-muted" x={O + 6} y={O + 14} fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">O</text>

          {/* Quadrant labels */}
          <text x={O + 18} y={O - 14} fill="rgba(34,211,238,0.35)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">I</text>
          <text x={O - 30} y={O - 14} fill="rgba(167,139,250,0.35)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">II</text>
          <text x={O - 34} y={O + 22} fill="rgba(251,191,36,0.35)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">III</text>
          <text x={O + 18} y={O + 22} fill="rgba(74,222,128,0.35)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">IV</text>

          {/* Tick marks & numbers */}
          {ticks.map(v => {
            const isEven = v % 2 === 0;
            return (
              <g key={v}>
                <line className={isEven ? "cartesian-tick-major" : "cartesian-tick-minor"} x1={toSVGX(v)} y1={O - (isEven ? 4 : 2.5)} x2={toSVGX(v)} y2={O + (isEven ? 4 : 2.5)} stroke={isEven ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)"} strokeWidth="1" />
                <text className={isEven ? "cartesian-tick-major" : "cartesian-tick-minor"} x={toSVGX(v)} y={O + 13} fill={isEven ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.22)"} fontSize={isEven ? 8 : 7} textAnchor="middle" fontFamily="monospace">{v}</text>
                <line className={isEven ? "cartesian-tick-major" : "cartesian-tick-minor"} x1={O - (isEven ? 4 : 2.5)} y1={toSVGY(v)} x2={O + (isEven ? 4 : 2.5)} y2={toSVGY(v)} stroke={isEven ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)"} strokeWidth="1" />
                <text className={isEven ? "cartesian-tick-major" : "cartesian-tick-minor"} x={O - 12} y={toSVGY(v) + 3} fill={isEven ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.22)"} fontSize={isEven ? 8 : 7} textAnchor="middle" fontFamily="monospace">{v}</text>
              </g>
            );
          })}

          {/* Projection dashed lines for active point */}
          {(() => {
            const ap = points.find(p => p.id === activeId);
            if (!ap) return null;
            const px = toSVGX(ap.x), py = toSVGY(ap.y);
            return (
              <g>
                <line x1={px} y1={py} x2={px} y2={O} stroke={ap.fill} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                <line x1={px} y1={py} x2={O} y2={py} stroke={ap.fill} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                <circle cx={px} cy={O} r="3" fill={ap.fill} opacity="0.6" />
                <circle cx={O} cy={py} r="3" fill={ap.fill} opacity="0.6" />
                <text x={px} y={O + 16} fill={ap.fill} fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.9">{ap.x}</text>
                <text x={O - 16} y={py + 3} fill={ap.fill} fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.9">{ap.y}</text>
              </g>
            );
          })()}

          {/* Points */}
          {points.map(pt => {
            const px = toSVGX(pt.x), py = toSVGY(pt.y);
            const isActive = pt.id === activeId;
            const isDragging = pt.id === draggingId;
            return (
              <g key={pt.id}>
                {/* Glow ring */}
                {(isActive || isDragging) && (
                  <circle cx={px} cy={py} r={isDragging ? 18 : 14} fill={pt.fill} opacity="0.15" />
                )}
                {/* Point */}
                <circle
                  cx={px} cy={py} r={isDragging ? 10 : 8}
                  fill={pt.fill} stroke="var(--icon-stroke)" strokeWidth="2"
                  style={{ cursor: "grab", transition: isDragging ? "none" : "r 0.15s ease" }}
                  onPointerDown={(e) => handlePointDown(e, pt.id)}
                />
                {/* Label */}
                <text
                  x={px + 13} y={py - 10}
                  fill="var(--icon-color)" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {pt.id}({pt.x},{pt.y})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Coordinate Cards */}
      <div className="px-3 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {points.map(pt => {
            const { label: qLabel } = getQuadrant(pt.x, pt.y);
            const isActive = pt.id === activeId;
            return (
              <button
                key={pt.id}
                onClick={() => setActiveId(pt.id)}
                className={`rounded-xl border px-3 py-2.5 text-left transition-all cursor-pointer ${pt.quadrantBg} ${isActive ? "scale-105 shadow-lg" : "opacity-70 hover:opacity-100"}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-3 h-3 rounded-full border border-white/50 flex-shrink-0" style={{ background: pt.fill }} />
                  <span className={`text-xs font-bold font-display ${pt.textColor}`}>Titik {pt.id}</span>
                </div>
                <p className="font-mono text-white text-sm font-bold leading-none mb-1">
                  ({pt.x}, {pt.y})
                </p>
                <p className="text-white/50 text-[10px] font-body leading-tight">{qLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active point detail */}
      <div className="px-3 pb-3">
        <div className="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: activePoint.fill }} />
            <span className={`text-xs font-bold font-body ${activePoint.textColor}`}>Titik {activeId} sedang aktif</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-white/60">x = <span className="text-white font-bold">{activePoint.x}</span></span>
            <span className="text-white/60">y = <span className="text-white font-bold">{activePoint.y}</span></span>
            <span className={`font-semibold font-body ${quadColor}`}>{quadLabel}</span>
          </div>
          <button
            onClick={handleReset}
            className="ml-auto text-xs px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white/60 hover:text-white transition-all cursor-pointer font-body"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="px-3 pb-4">
        <p className="text-center text-[11px] text-white/35 font-body">
          💡 Seret titik mana saja · Ketuk kartu untuk melihat detail · Garis putus-putus menunjukkan proyeksi ke sumbu
        </p>
      </div>
    </div>
  );
}
