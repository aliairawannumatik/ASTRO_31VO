import { useState, useRef } from "react";

export type CongruentShapeType =
  | "triangle" | "square" | "rectangle" | "parallelogram"
  | "rhombus" | "kite" | "circle" | "trapezoid";

function mkTick(
  x1: number, y1: number, x2: number, y2: number,
  count: 1 | 2 | 3, color: string
) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag < 0.001) return <g />;
  const px = -dy / mag * 6, py = dx / mag * 6;
  const ux = dx / mag * 4, uy = dy / mag * 4;
  const ln = (ox: number, oy: number, k: number) => (
    <line key={k}
      x1={mx - px + ox} y1={my - py + oy}
      x2={mx + px + ox} y2={my + py + oy}
      stroke={color} strokeWidth="1.8" strokeLinecap="round"
    />
  );
  if (count === 1) return <g>{ln(0, 0, 0)}</g>;
  if (count === 2) return <g>{ln(-ux, -uy, 0)}{ln(ux, uy, 1)}</g>;
  return <g>{ln(-ux, -uy, 0)}{ln(0, 0, 1)}{ln(ux, uy, 2)}</g>;
}

function renderTriangle(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const ax = cx - 55, ay = cy + 55, bx = cx + 55, by = cy + 55, ccx = cx, ccy = cy - 55;
  return (
    <g>
      <polygon points={`${ax},${ay} ${bx},${by} ${ccx},${ccy}`}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      {mkTick(ax, ay, bx, by, 2, stroke)}
      {mkTick(ax, ay, ccx, ccy, 1, stroke)}
      {mkTick(bx, by, ccx, ccy, 3, stroke)}
    </g>
  );
}

function renderSquare(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const s = 43;
  return (
    <g>
      <rect x={cx - s} y={cy - s} width={s * 2} height={s * 2}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" />
      {mkTick(cx - s, cy - s, cx + s, cy - s, 1, stroke)}
      {mkTick(cx + s, cy - s, cx + s, cy + s, 1, stroke)}
      {mkTick(cx + s, cy + s, cx - s, cy + s, 1, stroke)}
      {mkTick(cx - s, cy + s, cx - s, cy - s, 1, stroke)}
    </g>
  );
}

function renderRectangle(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const pw = 52, ph = 34;
  return (
    <g>
      <rect x={cx - pw} y={cy - ph} width={pw * 2} height={ph * 2}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" />
      {mkTick(cx - pw, cy - ph, cx + pw, cy - ph, 2, stroke)}
      {mkTick(cx + pw, cy - ph, cx + pw, cy + ph, 1, stroke)}
      {mkTick(cx + pw, cy + ph, cx - pw, cy + ph, 2, stroke)}
      {mkTick(cx - pw, cy + ph, cx - pw, cy - ph, 1, stroke)}
    </g>
  );
}

function renderParallelogram(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const ax = cx - 30, ay = cy + 42, bx = cx + 52, by = cy + 42;
  const ccx = cx + 30, ccy = cy - 42, dx = cx - 52, dy = cy - 42;
  return (
    <g>
      <polygon points={`${ax},${ay} ${bx},${by} ${ccx},${ccy} ${dx},${dy}`}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      {mkTick(ax, ay, bx, by, 2, stroke)}
      {mkTick(dx, dy, ccx, ccy, 2, stroke)}
      {mkTick(ax, ay, dx, dy, 1, stroke)}
      {mkTick(bx, by, ccx, ccy, 1, stroke)}
    </g>
  );
}

function renderRhombus(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const ax = cx, ay = cy - 55, bx = cx + 60, by = cy, ccx = cx, ccy = cy + 55, dx = cx - 60, dy = cy;
  return (
    <g>
      <polygon points={`${ax},${ay} ${bx},${by} ${ccx},${ccy} ${dx},${dy}`}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      {mkTick(ax, ay, bx, by, 1, stroke)}
      {mkTick(bx, by, ccx, ccy, 1, stroke)}
      {mkTick(ccx, ccy, dx, dy, 1, stroke)}
      {mkTick(dx, dy, ax, ay, 1, stroke)}
    </g>
  );
}

function renderKite(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const ax = cx, ay = cy - 72, bx = cx - 46, by = cy + 5, ccx = cx, ccy = cy + 80, dx = cx + 46, dy = cy + 5;
  return (
    <g>
      <polygon points={`${ax},${ay} ${bx},${by} ${ccx},${ccy} ${dx},${dy}`}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      {mkTick(ax, ay, bx, by, 1, stroke)}
      {mkTick(ax, ay, dx, dy, 1, stroke)}
      {mkTick(bx, by, ccx, ccy, 2, stroke)}
      {mkTick(dx, dy, ccx, ccy, 2, stroke)}
    </g>
  );
}

function renderCircle(cx: number, cy: number, fill: string, stroke: string, op: number) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={52} fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" />
      <line x1={cx} y1={cy} x2={cx + 52} y2={cy}
        stroke={stroke} strokeWidth="1.6" strokeDasharray="4 3" opacity="0.75" />
      <circle cx={cx} cy={cy} r={2.5} fill={stroke} />
      <text x={cx + 14} y={cy - 5} fontSize="11" fill={stroke} fontFamily="sans-serif" opacity="0.9">r</text>
    </g>
  );
}

function renderTrapezoid(cx: number, cy: number, fill: string, stroke: string, op: number) {
  const ax = cx - 55, ay = cy + 42, bx = cx + 55, by = cy + 42;
  const ccx = cx + 33, ccy = cy - 42, dx = cx - 33, dy = cy - 42;
  return (
    <g>
      <polygon points={`${ax},${ay} ${bx},${by} ${ccx},${ccy} ${dx},${dy}`}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      {mkTick(ax, ay, bx, by, 3, stroke)}
      {mkTick(dx, dy, ccx, ccy, 1, stroke)}
      {mkTick(ax, ay, dx, dy, 2, stroke)}
      {mkTick(bx, by, ccx, ccy, 2, stroke)}
    </g>
  );
}

type RenderFn = (cx: number, cy: number, fill: string, stroke: string, op: number) => React.ReactNode;

const SHAPES: Record<CongruentShapeType, { render: RenderFn; vbH: number; cy: number }> = {
  triangle:      { render: renderTriangle,      vbH: 185, cy: 90  },
  square:        { render: renderSquare,         vbH: 185, cy: 90  },
  rectangle:     { render: renderRectangle,      vbH: 185, cy: 90  },
  parallelogram: { render: renderParallelogram,  vbH: 190, cy: 93  },
  rhombus:       { render: renderRhombus,        vbH: 200, cy: 100 },
  kite:          { render: renderKite,           vbH: 230, cy: 112 },
  circle:        { render: renderCircle,         vbH: 185, cy: 90  },
  trapezoid:     { render: renderTrapezoid,      vbH: 190, cy: 93  },
};

export const DragCongruenceDemo = ({ shape }: { shape: CongruentShapeType }) => {
  const { render, vbH, cy: CY } = SHAPES[shape];
  const VBW = 300;
  const TARGET = { x: 75, y: CY };
  const START  = { x: 225, y: CY };
  const SNAP_D = { x: TARGET.x - START.x, y: TARGET.y - START.y };
  const SNAP_THRESHOLD = 55;

  const [delta, setDelta]         = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);
  const [isSnapped, setSnapped]   = useState(false);
  const [showBurst, setBurst]     = useState(false);
  const svgRef  = useRef<SVGSVGElement>(null);
  const ptrOff  = useRef({ x: 0, y: 0 });
  const lastD   = useRef({ x: 0, y: 0 });

  const toSVG = (cx: number, cy: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return { x: (cx - r.left) * VBW / r.width, y: (cy - r.top) * vbH / r.height };
  };

  const onDown = (e: React.PointerEvent) => {
    if (isSnapped) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
    const pt = toSVG(e.clientX, e.clientY);
    ptrOff.current = { x: pt.x - (START.x + delta.x), y: pt.y - (START.y + delta.y) };
    setDragging(true);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    const pt = toSVG(e.clientX, e.clientY);
    const nd = { x: pt.x - ptrOff.current.x - START.x, y: pt.y - ptrOff.current.y - START.y };
    setDelta(nd);
    lastD.current = nd;
  };

  const onUp = () => {
    if (!isDragging) return;
    setDragging(false);
    const dist = Math.hypot(lastD.current.x - SNAP_D.x, lastD.current.y - SNAP_D.y);
    if (dist < SNAP_THRESHOLD) {
      setDelta(SNAP_D);
      setSnapped(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 1800);
    }
  };

  const reset = () => {
    setDelta({ x: 0, y: 0 });
    setSnapped(false);
    setBurst(false);
    setDragging(false);
    lastD.current = { x: 0, y: 0 };
  };

  const burstLines = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return (
      <line key={i}
        x1={TARGET.x} y1={TARGET.y}
        x2={TARGET.x + Math.cos(a) * 70} y2={TARGET.y + Math.sin(a) * 70}
        stroke={i % 2 === 0 ? "#facc15" : "#4ade80"} strokeWidth="2.5" strokeLinecap="round"
      >
        <animate attributeName="opacity" values="0;1;0" dur="0.8s" fill="freeze" />
      </line>
    );
  });

  return (
    <div className="space-y-2 select-none">
      <div className="bg-slate-950/70 border border-slate-700/40 rounded-xl overflow-hidden">
        <svg ref={svgRef} viewBox={`0 0 ${VBW} ${vbH}`}
          className="w-full" style={{ touchAction: "none" }}
        >
          {!isSnapped && (
            <line x1={VBW / 2} y1="6" x2={VBW / 2} y2={vbH - 6}
              stroke="#1e3a5f" strokeWidth="1" strokeDasharray="5 4" />
          )}

          {!isSnapped && (
            <g opacity="0.2">
              {render(TARGET.x, TARGET.y, "#64748b", "#94a3b8", 0.12)}
            </g>
          )}

          {render(TARGET.x, TARGET.y, "#facc15", "#fde047", isSnapped ? 0.45 : 0.58)}

          {!isSnapped && (
            <g
              transform={`translate(${delta.x},${delta.y})`}
              onPointerDown={onDown} onPointerMove={onMove}
              onPointerUp={onUp} onPointerCancel={onUp}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {render(START.x, START.y, "#4ade80", "#86efac", 0.62)}

              {!isDragging && (
                <g opacity="0.55">
                  <circle cx={START.x} cy={START.y - (shape === "kite" ? 0 : 0)} r="26"
                    fill="none" stroke="#4ade80" strokeWidth="1.2" strokeDasharray="3 3">
                    <animate attributeName="r" values="22;34;22" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.55;0;0.55" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x={START.x} y={START.y + 4} textAnchor="middle"
                    fontSize="13" fill="#4ade80" fontFamily="sans-serif" fontWeight="bold">
                    ✋
                  </text>
                </g>
              )}
            </g>
          )}

          {isSnapped && (
            <g style={{ pointerEvents: "none" }}>
              {render(TARGET.x, TARGET.y, "#22c55e", "#4ade80", 0.50)}
            </g>
          )}

          {showBurst && burstLines}

          {isSnapped && (
            <circle cx={TARGET.x} cy={TARGET.y} r="60" fill="none"
              stroke="#22c55e" strokeWidth="2" opacity="0.3">
              <animate attributeName="r" values="55;82;55" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite" />
            </circle>
          )}

          {!isSnapped ? (
            <>
              <text x={TARGET.x} y={vbH - 7} textAnchor="middle" fontSize="8.5" fill="#475569" fontFamily="sans-serif">Bangun 1 (diam)</text>
              <text x={START.x}  y={vbH - 7} textAnchor="middle" fontSize="8.5" fill="#4ade80" fontFamily="sans-serif">← Geser ke kiri</text>
            </>
          ) : (
            <text x={TARGET.x} y={vbH - 7} textAnchor="middle" fontSize="9.5" fill="#22c55e"
              fontWeight="bold" fontFamily="sans-serif">✓ BERIMPIT SEMPURNA — KONGRUEN!</text>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between gap-2 px-1">
        {!isSnapped
          ? (
            <p className="font-body text-xs text-white/55">
              👆 <span className="text-green-400 font-semibold">Seret bangun hijau</span> ke kiri — tumpangkan tepat di atas bangun kuning!
            </p>
          ) : (
            <p className="font-body text-xs font-semibold text-green-400">
              🎉 Kedua bangun <span className="text-yellow-300">berimpit sempurna</span> — itulah makna <strong className="text-white">KONGRUEN</strong>!
            </p>
          )
        }
        <button onClick={reset}
          className="shrink-0 text-xs text-white/40 hover:text-white/80 border border-white/10 hover:border-white/30 rounded px-2 py-1 font-body transition-colors"
        >↺ Ulangi</button>
      </div>
    </div>
  );
};
