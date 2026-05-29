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

function renderTriangle(cx: number, cy: number, fill: string, stroke: string, op: number, hideTicks?: number[]) {
  const ax = cx - 55, ay = cy + 55, bx = cx + 55, by = cy + 55, ccx = cx, ccy = cy - 55;
  const hide = hideTicks ?? [];
  return (
    <g>
      <polygon points={`${ax},${ay} ${bx},${by} ${ccx},${ccy}`}
        fill={fill} fillOpacity={op} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      {!hide.includes(0) && mkTick(ax, ay, bx, by, 2, stroke)}
      {!hide.includes(1) && mkTick(ax, ay, ccx, ccy, 1, stroke)}
      {!hide.includes(2) && mkTick(bx, by, ccx, ccy, 3, stroke)}
    </g>
  );
}

// Renders angle-arc markers at each vertex of the triangle.
// symbols[0]=A/P, symbols[1]=B/Q, symbols[2]=C/R
// Marks move WITH the shape — always call this inside the same <g> as the shape.
function renderTriangleAngleMarks(
  cx: number, cy: number,
  symbols: readonly string[],
  color: string
) {
  // Half-edge vectors from each vertex toward its two neighbours.
  // A=(cx-55,cy+55), B=(cx+55,cy+55), C=(cx,cy-55)
  const MAG = Math.sqrt(55 * 55 + 110 * 110); // ≈ 123.09
  const R = 13;     // arc radius
  const SYM = 21;   // symbol distance from vertex (along bisector)

  // unit vectors from each vertex to its neighbours
  const uAB = { x: 1, y: 0 };
  const uAC = { x: 55 / MAG, y: -110 / MAG };
  const uBA = { x: -1, y: 0 };
  const uBC = { x: -55 / MAG, y: -110 / MAG };
  const uCA = { x: -55 / MAG, y: 110 / MAG };
  const uCB = { x: 55 / MAG, y: 110 / MAG };

  // arc start / end for each vertex
  const p1A = { x: cx - 55 + R * uAB.x, y: cy + 55 + R * uAB.y };
  const p2A = { x: cx - 55 + R * uAC.x, y: cy + 55 + R * uAC.y };
  const p1B = { x: cx + 55 + R * uBA.x, y: cy + 55 + R * uBA.y };
  const p2B = { x: cx + 55 + R * uBC.x, y: cy + 55 + R * uBC.y };
  const p1C = { x: cx + R * uCA.x, y: cy - 55 + R * uCA.y };
  const p2C = { x: cx + R * uCB.x, y: cy - 55 + R * uCB.y };

  // bisector directions (normalised average of the two edge unit-vectors)
  function bisect(u1: {x:number,y:number}, u2: {x:number,y:number}, ox: number, oy: number) {
    const bx = (u1.x + u2.x) / 2, by = (u1.y + u2.y) / 2;
    const bm = Math.sqrt(bx * bx + by * by);
    return { x: ox + SYM * bx / bm, y: oy + SYM * by / bm };
  }
  const sA = bisect(uAB, uAC, cx - 55, cy + 55);
  const sB = bisect(uBA, uBC, cx + 55, cy + 55);
  const sC = bisect(uCA, uCB, cx,       cy - 55);

  // sweep flags: derived from cross-product rule for SVG y-down coords
  // A: cross(uAB,uAC)<0 → sweep=0   B: cross(uBA,uBC)>0 → sweep=1   C: cross(uCA,uCB)<0 → sweep=0
  const sweepA = 0, sweepB = 1, sweepC = 0;

  function renderSym(sym: string, sx: number, sy: number) {
    if (sym === "○") {
      return <circle key="sym" cx={sx} cy={sy} r={2.5} fill={color} stroke="none" />;
    }
    return (
      <text key="sym" x={sx} y={sy} textAnchor="middle" dominantBaseline="middle"
        fontSize="7.5" fill={color} fontFamily="sans-serif" fontWeight="bold">
        {sym}
      </text>
    );
  }

  return (
    <g style={{ pointerEvents: "none" }}>
      {!!symbols[0] && <>
        <path d={`M ${p1A.x} ${p1A.y} A ${R} ${R} 0 0 ${sweepA} ${p2A.x} ${p2A.y}`}
          fill="none" stroke={color} strokeWidth="1.4" />
        {renderSym(symbols[0], sA.x, sA.y)}
      </>}
      {!!symbols[1] && <>
        <path d={`M ${p1B.x} ${p1B.y} A ${R} ${R} 0 0 ${sweepB} ${p2B.x} ${p2B.y}`}
          fill="none" stroke={color} strokeWidth="1.4" />
        {renderSym(symbols[1], sB.x, sB.y)}
      </>}
      {!!symbols[2] && <>
        <path d={`M ${p1C.x} ${p1C.y} A ${R} ${R} 0 0 ${sweepC} ${p2C.x} ${p2C.y}`}
          fill="none" stroke={color} strokeWidth="1.4" />
        {renderSym(symbols[2], sC.x, sC.y)}
      </>}
    </g>
  );
}

function mkRightAngle(cx: number, cy: number, dx: number, dy: number, color: string) {
  return (
    <g opacity="0.75">
      <line x1={cx + dx} y1={cy} x2={cx + dx} y2={cy + dy} stroke={color} strokeWidth="1.4" />
      <line x1={cx} y1={cy + dy} x2={cx + dx} y2={cy + dy} stroke={color} strokeWidth="1.4" />
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
      {mkRightAngle(cx - s, cy - s, +8, +8, stroke)}
      {mkRightAngle(cx + s, cy - s, -8, +8, stroke)}
      {mkRightAngle(cx + s, cy + s, -8, -8, stroke)}
      {mkRightAngle(cx - s, cy + s, +8, -8, stroke)}
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
      {mkRightAngle(cx - pw, cy - ph, +8, +8, stroke)}
      {mkRightAngle(cx + pw, cy - ph, -8, +8, stroke)}
      {mkRightAngle(cx + pw, cy + ph, -8, -8, stroke)}
      {mkRightAngle(cx - pw, cy + ph, +8, -8, stroke)}
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
  const ax = cx, ay = cy - 72, bx = cx - 46, by = cy + 5, ccx = cx, ccy = cy + 108, dx = cx + 46, dy = cy + 5;
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
  kite:          { render: renderKite,           vbH: 258, cy: 112 },
  circle:        { render: renderCircle,         vbH: 185, cy: 90  },
  trapezoid:     { render: renderTrapezoid,      vbH: 190, cy: 93  },
};

type VertexDef = { dx: number; dy: number; anchor: "start" | "end" | "middle"; lx: number; ly: number };

// Vertex positions (relative to shape center) and label offset/anchor per shape.
// Order matches the ABCD / PQRS labeling used in the page content.
const SHAPE_VERTS: Partial<Record<CongruentShapeType, VertexDef[]>> = {
  // triangle: A=bottom-left, B=bottom-right, C=top
  triangle: [
    { dx: -55, dy: +55, anchor: "end",    lx: -5, ly: +14 },
    { dx: +55, dy: +55, anchor: "start",  lx: +5, ly: +14 },
    { dx:   0, dy: -55, anchor: "middle", lx:  0, ly:  -7 },
  ],
  // square: A=top-left, B=top-right, C=bottom-right, D=bottom-left
  square: [
    { dx: -43, dy: -43, anchor: "end",    lx: -3, ly:  -5 },
    { dx: +43, dy: -43, anchor: "start",  lx: +4, ly:  -5 },
    { dx: +43, dy: +43, anchor: "start",  lx: +4, ly: +14 },
    { dx: -43, dy: +43, anchor: "end",    lx: -3, ly: +14 },
  ],
  // rectangle: A=top-left, B=top-right, C=bottom-right, D=bottom-left
  rectangle: [
    { dx: -52, dy: -34, anchor: "end",    lx: -3, ly:  -5 },
    { dx: +52, dy: -34, anchor: "start",  lx: +4, ly:  -5 },
    { dx: +52, dy: +34, anchor: "start",  lx: +4, ly: +14 },
    { dx: -52, dy: +34, anchor: "end",    lx: -3, ly: +14 },
  ],
  // parallelogram: A=bottom-left, B=bottom-right, C=top-right, D=top-left
  parallelogram: [
    { dx: -30, dy: +42, anchor: "end",    lx: -4, ly: +13 },
    { dx: +52, dy: +42, anchor: "start",  lx: +4, ly: +13 },
    { dx: +30, dy: -42, anchor: "start",  lx: +4, ly:  -5 },
    { dx: -52, dy: -42, anchor: "end",    lx: -4, ly:  -5 },
  ],
  // trapezoid: A=bottom-left, B=bottom-right, C=top-right, D=top-left
  trapezoid: [
    { dx: -55, dy: +42, anchor: "end",    lx: -4, ly: +13 },
    { dx: +55, dy: +42, anchor: "start",  lx: +4, ly: +13 },
    { dx: +33, dy: -42, anchor: "start",  lx: +4, ly:  -5 },
    { dx: -33, dy: -42, anchor: "end",    lx: -4, ly:  -5 },
  ],
  // rhombus: A=top, B=right, C=bottom, D=left
  rhombus: [
    { dx:   0, dy: -55, anchor: "middle", lx:  0, ly:  -7 },
    { dx: +60, dy:   0, anchor: "start",  lx: +5, ly: +4  },
    { dx:   0, dy: +55, anchor: "middle", lx:  0, ly: +14 },
    { dx: -60, dy:   0, anchor: "end",    lx: -5, ly: +4  },
  ],
  // kite: A=top, B=left, C=bottom, D=right
  kite: [
    { dx:   0, dy:  -72, anchor: "middle", lx:  0, ly:  -7 },
    { dx: -46, dy:   +5, anchor: "end",    lx: -5, ly: +4  },
    { dx:   0, dy: +108, anchor: "middle", lx:  0, ly: +14 },
    { dx: +46, dy:   +5, anchor: "start",  lx: +5, ly: +4  },
  ],
  // circle: single center point — label positioned above the circle
  circle: [
    { dx: 0, dy: -58, anchor: "middle", lx: 0, ly: 0 },
  ],
};

export const DragCongruenceDemo = ({
  shape,
  leftLabels,
  rightLabels,
  angleMarks,
  hideTicks,
}: {
  shape: CongruentShapeType;
  leftLabels?: readonly string[];
  rightLabels?: readonly string[];
  /** symbols for angle arcs — only used when shape="triangle". Index: [0]=A/P, [1]=B/Q, [2]=C/R */
  angleMarks?: readonly string[];
  /** tick indices to hide — only used when shape="triangle". 0=AB(double), 1=AC(single), 2=BC(triple) */
  hideTicks?: number[];
}) => {
  const { render: _render, vbH, cy: CY } = SHAPES[shape];
  const render = (hideTicks && shape === "triangle")
    ? (cx: number, cy: number, fill: string, stroke: string, op: number) =>
        renderTriangle(cx, cy, fill, stroke, op, hideTicks)
    : _render;
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

  const verts = SHAPE_VERTS[shape];

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

          {/* Left-shape angle marks — stationary, rendered outside any translate */}
          {angleMarks && shape === "triangle" &&
            renderTriangleAngleMarks(TARGET.x, TARGET.y, angleMarks, "#fde047")}

          {!isSnapped && (
            <g
              transform={`translate(${delta.x},${delta.y})`}
              onPointerDown={onDown} onPointerMove={onMove}
              onPointerUp={onUp} onPointerCancel={onUp}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {render(START.x, START.y, "#4ade80", "#86efac", 0.62)}

              {/* Right-shape angle marks — inside translate so they follow the drag */}
              {angleMarks && shape === "triangle" &&
                renderTriangleAngleMarks(START.x, START.y, angleMarks, "#86efac")}

              {!isDragging && (
                <g opacity="0.55">
                  <circle cx={START.x} cy={START.y} r="26"
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

          {/* Fixed left vertex labels — rendered at absolute TARGET vertex positions, never inside translate */}
          {leftLabels && verts && verts.map((v, i) =>
            leftLabels[i] ? (
              <text key={`ll-${i}`}
                x={TARGET.x + v.dx + v.lx}
                y={TARGET.y + v.dy + v.ly}
                textAnchor={v.anchor}
                fontSize="11" fill="#fde047" fontWeight="bold" fontFamily="serif"
                style={{ pointerEvents: "none" }}
              >
                {leftLabels[i]}
              </text>
            ) : null
          )}

          {/* Fixed right vertex labels — rendered at absolute START vertex positions, hidden when snapped */}
          {rightLabels && verts && !isSnapped && verts.map((v, i) =>
            rightLabels[i] ? (
              <text key={`rl-${i}`}
                x={START.x + v.dx + v.lx}
                y={START.y + v.dy + v.ly}
                textAnchor={v.anchor}
                fontSize="11" fill="#86efac" fontWeight="bold" fontFamily="serif"
                style={{ pointerEvents: "none" }}
              >
                {rightLabels[i]}
              </text>
            ) : null
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
