import React, { useState, useRef } from "react";

const CELL = 22;
const COLS = 11;
const ROWS = 8;
const PAD = 14;
const W = PAD * 2 + COLS * CELL;
const H = PAD * 2 + ROWS * CELL;

const toSVG = (gx: number, gy: number): [number, number] => [
  PAD + gx * CELL,
  H - PAD - gy * CELL,
];
const toGrid = (sx: number, sy: number): [number, number] => [
  (sx - PAD) / CELL,
  (H - PAD - sy) / CELL,
];
const snap = (v: number, max: number) =>
  Math.max(0, Math.min(max, Math.round(v)));

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function calcM(dx: number, dy: number): string {
  if (dx === 0) return "∞";
  if (dy === 0) return "0";
  const g = gcd(Math.abs(dx), Math.abs(dy));
  const num = Math.abs(dy / g);
  const den = Math.abs(dx / g);
  const sign = dx * dy > 0 ? "+" : "−";
  return den === 1 ? `${sign}${num}` : `${sign}${num}/${den}`;
}

interface PanelProps {
  initP1: [number, number];
  initP2: [number, number];
  lineColor: string;
  accentClass: string;
  labelText: string;
}

function DraggableGrid({ initP1, initP2, lineColor, accentClass, labelText }: PanelProps) {
  const [p1, setP1] = useState<[number, number]>(initP1);
  const [p2, setP2] = useState<[number, number]>(initP2);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"p1" | "p2" | null>(null);

  const getGridPos = (clientX: number, clientY: number): [number, number] => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const sx = (clientX - rect.left) * (W / rect.width);
    const sy = (clientY - rect.top) * (H / rect.height);
    const [gx, gy] = toGrid(sx, sy);
    return [snap(gx, COLS), snap(gy, ROWS)];
  };

  const onMove = (clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const pos = getGridPos(clientX, clientY);
    if (dragging.current === "p1") setP1(pos);
    else setP2(pos);
  };

  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [sx1, sy1] = toSVG(x1, y1);
  const [sx2, sy2] = toSVG(x2, y2);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const samePoint = dx === 0 && dy === 0;
  const csx = sx2;
  const csy = sy1;
  const m = calcM(dx, dy);

  return (
    <div className="space-y-1.5">
      <p className={`text-xs font-bold font-body ${accentClass}`}>{labelText}</p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{
          background: "rgba(10,18,35,0.88)",
          borderRadius: 10,
          userSelect: "none",
          touchAction: "none",
        }}
        onMouseMove={e => onMove(e.clientX, e.clientY)}
        onMouseUp={() => { dragging.current = null; }}
        onMouseLeave={() => { dragging.current = null; }}
        onTouchMove={e => {
          e.preventDefault();
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={() => { dragging.current = null; }}
      >
        {/* Grid columns */}
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <line
            key={`vc${i}`}
            x1={PAD + i * CELL} y1={PAD}
            x2={PAD + i * CELL} y2={H - PAD}
            stroke="#1a2744" strokeWidth="1"
          />
        ))}
        {/* Grid rows */}
        {Array.from({ length: ROWS + 1 }, (_, i) => (
          <line
            key={`hr${i}`}
            x1={PAD} y1={PAD + i * CELL}
            x2={W - PAD} y2={PAD + i * CELL}
            stroke="#1a2744" strokeWidth="1"
          />
        ))}

        {/* Extended faint line */}
        {dx !== 0 && (() => {
          const slope = dy / dx;
          const yAt0 = y1 + slope * (0 - x1);
          const yAtMax = y1 + slope * (COLS - x1);
          return (
            <line
              x1={PAD} y1={H - PAD - yAt0 * CELL}
              x2={W - PAD} y2={H - PAD - yAtMax * CELL}
              stroke={lineColor} strokeWidth="1.2" opacity="0.22" strokeLinecap="round"
            />
          );
        })()}

        {/* Triangle dashes */}
        {!samePoint && dx !== 0 && dy !== 0 && (
          <>
            {/* sisi datar */}
            <line x1={sx1} y1={sy1} x2={csx} y2={csy}
              stroke="#4ade80" strokeWidth="1.8" strokeDasharray="4,2" opacity="0.9" />
            {/* sisi tegak */}
            <line x1={csx} y1={csy} x2={sx2} y2={sy2}
              stroke="#f472b6" strokeWidth="1.8" strokeDasharray="4,2" opacity="0.9" />
            {/* right-angle mark */}
            <polyline
              points={`${csx + (dx > 0 ? -5 : 5)},${csy} ${csx + (dx > 0 ? -5 : 5)},${csy + (dy > 0 ? 5 : -5)} ${csx},${csy + (dy > 0 ? 5 : -5)}`}
              fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3"
            />
            {/* datar number */}
            <text
              x={(sx1 + csx) / 2}
              y={csy + (dy >= 0 ? 12 : -4)}
              fill="#4ade80" fontSize="9.5" fontWeight="bold" textAnchor="middle"
            >
              {Math.abs(dx)}
            </text>
            {/* tegak number */}
            <text
              x={csx + (dx >= 0 ? 9 : -9)}
              y={(csy + sy2) / 2 + 4}
              fill="#f472b6" fontSize="9.5" fontWeight="bold"
              textAnchor={dx >= 0 ? "start" : "end"}
            >
              {Math.abs(dy)}
            </text>
          </>
        )}

        {/* Main segment */}
        {!samePoint && (
          <line x1={sx1} y1={sy1} x2={sx2} y2={sy2}
            stroke={lineColor} strokeWidth="3" strokeLinecap="round" />
        )}

        {/* P1 handle */}
        <g
          style={{ cursor: "grab" }}
          onMouseDown={e => { e.preventDefault(); dragging.current = "p1"; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = "p1"; }}
        >
          <circle cx={sx1} cy={sy1} r="11" fill={lineColor} opacity="0.12" />
          <circle cx={sx1} cy={sy1} r="5" fill={lineColor} stroke="white" strokeWidth="1.5" />
        </g>

        {/* P2 handle */}
        <g
          style={{ cursor: "grab" }}
          onMouseDown={e => { e.preventDefault(); dragging.current = "p2"; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = "p2"; }}
        >
          <circle cx={sx2} cy={sy2} r="11" fill={lineColor} opacity="0.12" />
          <circle cx={sx2} cy={sy2} r="5" fill={lineColor} stroke="white" strokeWidth="1.5" />
        </g>

        {/* Hint when same point */}
        {samePoint && (
          <text x={W / 2} y={H / 2} fill="#475569" fontSize="9" textAnchor="middle">
            Seret titik ke posisi berbeda
          </text>
        )}
      </svg>

      {/* Result row */}
      <div
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-body"
        style={{ background: `${lineColor}14`, border: `1px solid ${lineColor}38` }}
      >
        {samePoint || dx === 0 ? (
          <span className="text-white/40">Geser titik untuk melihat gradien</span>
        ) : (
          <>
            <span style={{ color: "#4ade80" }} className="font-bold">{Math.abs(dx)}</span>
            <span className="text-white/35">datar</span>
            <span className="text-white/25 mx-0.5">/</span>
            <span style={{ color: "#f472b6" }} className="font-bold">{Math.abs(dy)}</span>
            <span className="text-white/35">tegak</span>
            <span className="text-white/30 mx-1">→</span>
            <span className="font-bold text-base font-mono" style={{ color: lineColor }}>
              m = {m}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function GradienInvariantAnimation() {
  return (
    <div className="space-y-5">
      <DraggableGrid
        initP1={[1, 1]}
        initP2={[7, 5]}
        lineColor="#4ade80"
        accentClass="text-green-300"
        labelText="↗ Gradien Positif — seret titik untuk mengukur di bagian mana pun"
      />
      <DraggableGrid
        initP1={[1, 7]}
        initP2={[7, 3]}
        lineColor="#f87171"
        accentClass="text-red-300"
        labelText="↘ Gradien Negatif — seret titik untuk mengukur di bagian mana pun"
      />
    </div>
  );
}
