import { useState, useRef, useCallback } from "react";

const VIEW = 360;
const RANGE = 7;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

function toSX(v: number) { return O + v * CELL; }
function toSY(v: number) { return O - v * CELL; }
function fromSX(p: number) { return Math.round((p - O) / CELL); }
function fromSY(p: number) { return Math.round(-(p - O) / CELL); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function describeDirection(dx: number, dy: number, name: string, acuan: string): string[] {
  const parts: string[] = [];
  if (dx > 0) parts.push(`${dx} satuan di kanan ${acuan}`);
  else if (dx < 0) parts.push(`${Math.abs(dx)} satuan di kiri ${acuan}`);
  else parts.push(`sejajar vertikal dengan ${acuan}`);
  if (dy > 0) parts.push(`${dy} satuan di atas ${acuan}`);
  else if (dy < 0) parts.push(`${Math.abs(dy)} satuan di bawah ${acuan}`);
  else parts.push(`sejajar horizontal dengan ${acuan}`);
  return parts;
}

/* ─────────────────────────────────────────────────────────────
   BAGIAN 1: Drag titik acuan + dua titik → posisi relatif
───────────────────────────────────────────────────────────── */
export function InteraktifTitikAcuan() {
  const [ptA, setPtA] = useState<[number, number]>([2, 1]);
  const [ptP, setPtP] = useState<[number, number]>([-1, 4]);
  const [ptQ, setPtQ] = useState<[number, number]>([4, -2]);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"A" | "P" | "Q" | null>(null);

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (VIEW / rect.width);
    const sy = (e.clientY - rect.top) * (VIEW / rect.height);
    return [clamp(fromSX(sx), -RANGE, RANGE), clamp(fromSY(sy), -RANGE, RANGE)] as [number, number];
  }, []);

  const onDown = useCallback((pt: "A" | "P" | "Q") => (e: React.PointerEvent) => {
    dragging.current = pt;
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const pos = getSVGPos(e);
    if (dragging.current === "A") setPtA(pos);
    else if (dragging.current === "P") setPtP(pos);
    else setPtQ(pos);
  }, [getSVGPos]);

  const onUp = useCallback(() => { dragging.current = null; }, []);

  const dxP = ptP[0] - ptA[0];
  const dyP = ptP[1] - ptA[1];
  const dxQ = ptQ[0] - ptA[0];
  const dyQ = ptQ[1] - ptA[1];

  const gridLines = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const isAxis = i === 0;
    gridLines.push(
      <line key={`v${i}`} x1={toSX(i)} y1={0} x2={toSX(i)} y2={VIEW}
        stroke={isAxis ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.07)"} strokeWidth={isAxis ? 1.5 : 1} />,
      <line key={`h${i}`} x1={0} y1={toSY(i)} x2={VIEW} y2={toSY(i)}
        stroke={isAxis ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.07)"} strokeWidth={isAxis ? 1.5 : 1} />
    );
    if (i !== 0 && i % 2 === 0) {
      gridLines.push(
        <text key={`lx${i}`} x={toSX(i)} y={toSY(0) + 14} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i}</text>,
        <text key={`ly${i}`} x={toSX(0) - 8} y={toSY(i) + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i}</text>
      );
    }
  }

  const DragPoint = ({ pt, color, label, handler }: {
    pt: [number, number]; color: string; label: string; handler: "A" | "P" | "Q";
  }) => (
    <g onPointerDown={onDown(handler)} style={{ cursor: "grab" }}>
      <circle cx={toSX(pt[0])} cy={toSY(pt[1])} r={14} fill="transparent" />
      <circle cx={toSX(pt[0])} cy={toSY(pt[1])} r={7} fill={color} stroke="white" strokeWidth={2} />
      <text x={toSX(pt[0]) + 10} y={toSY(pt[1]) - 8} fill={color} fontSize={11} fontFamily="monospace" fontWeight="bold">
        {label}({pt[0]},{pt[1]})
      </text>
    </g>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-xl overflow-hidden border border-orange-500/30 bg-slate-900/90 shadow-lg shadow-orange-900/20">
        <div className="absolute top-2 left-3 text-xs text-white/40 font-mono z-10">seret titik untuk menggerakkan</div>
        <svg
          ref={svgRef}
          width={VIEW} height={VIEW}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          {gridLines}
          {/* Arrow from A to P */}
          <defs>
            <marker id="arrowP" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" opacity="0.7" />
            </marker>
            <marker id="arrowQ" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" opacity="0.7" />
            </marker>
          </defs>
          <line x1={toSX(ptA[0])} y1={toSY(ptA[1])} x2={toSX(ptP[0])} y2={toSY(ptP[1])}
            stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6} markerEnd="url(#arrowP)" />
          <line x1={toSX(ptA[0])} y1={toSY(ptA[1])} x2={toSX(ptQ[0])} y2={toSY(ptQ[1])}
            stroke="#4ade80" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6} markerEnd="url(#arrowQ)" />
          {/* Delta lines */}
          <line x1={toSX(ptA[0])} y1={toSY(ptA[1])} x2={toSX(ptP[0])} y2={toSY(ptA[1])}
            stroke="#22d3ee" strokeWidth={1} opacity={0.35} />
          <line x1={toSX(ptP[0])} y1={toSY(ptA[1])} x2={toSX(ptP[0])} y2={toSY(ptP[1])}
            stroke="#22d3ee" strokeWidth={1} opacity={0.35} />
          <DragPoint pt={ptQ} color="#4ade80" label="Q" handler="Q" />
          <DragPoint pt={ptP} color="#22d3ee" label="P" handler="P" />
          <DragPoint pt={ptA} color="#fb923c" label="A" handler="A" />
          {/* Acuan diamond marker */}
          <path d={`M ${toSX(ptA[0])} ${toSY(ptA[1]) - 9} L ${toSX(ptA[0]) + 7} ${toSY(ptA[1])} L ${toSX(ptA[0])} ${toSY(ptA[1]) + 9} L ${toSX(ptA[0]) - 7} ${toSY(ptA[1])} Z`}
            fill="#fb923c" opacity={0.35} />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono flex-wrap justify-center">
        <span className="flex items-center gap-1.5 text-orange-300">
          <span className="w-3 h-3 bg-orange-400 rounded-sm inline-block rotate-45" />A = Titik Acuan
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-3 h-3 bg-cyan-400 rounded-full inline-block" />P = Titik 1
        </span>
        <span className="flex items-center gap-1.5 text-green-300">
          <span className="w-3 h-3 bg-green-400 rounded-full inline-block" />Q = Titik 2
        </span>
      </div>

      {/* Output */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-cyan-900/30 border border-cyan-500/40 rounded-xl p-4 space-y-1.5">
          <p className="text-cyan-300 font-mono font-bold text-sm">📍 P relatif terhadap A</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg px-3 py-1.5 font-mono font-bold text-cyan-200 text-lg">
              ({dxP > 0 ? "+" : ""}{dxP}, {dyP > 0 ? "+" : ""}{dyP})
            </span>
          </div>
          <div className="text-xs font-body space-y-0.5 mt-1">
            {describeDirection(dxP, dyP, "P", "A").map((d, i) => (
              <p key={i} className="text-white/60">→ {d}</p>
            ))}
          </div>
          <p className="text-white/30 text-xs font-mono mt-1">
            Δx = {ptP[0]}−({ptA[0]}) = {dxP} &nbsp;|&nbsp; Δy = {ptP[1]}−({ptA[1]}) = {dyP}
          </p>
        </div>

        <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4 space-y-1.5">
          <p className="text-green-300 font-mono font-bold text-sm">📍 Q relatif terhadap A</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-1.5 font-mono font-bold text-green-200 text-lg">
              ({dxQ > 0 ? "+" : ""}{dxQ}, {dyQ > 0 ? "+" : ""}{dyQ})
            </span>
          </div>
          <div className="text-xs font-body space-y-0.5 mt-1">
            {describeDirection(dxQ, dyQ, "Q", "A").map((d, i) => (
              <p key={i} className="text-white/60">→ {d}</p>
            ))}
          </div>
          <p className="text-white/30 text-xs font-mono mt-1">
            Δx = {ptQ[0]}−({ptA[0]}) = {dxQ} &nbsp;|&nbsp; Δy = {ptQ[1]}−({ptA[1]}) = {dyQ}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   BAGIAN 2: Drag garis (2 titik ujung) + titik P
───────────────────────────────────────────────────────────── */
export function InteraktifGaris() {
  const [L1, setL1] = useState<[number, number]>([-4, -2]);
  const [L2, setL2] = useState<[number, number]>([4, 2]);
  const [ptP, setPtP] = useState<[number, number]>([-2, 3]);
  const svgRef2 = useRef<SVGSVGElement>(null);
  const dragging = useRef<"L1" | "L2" | "P" | null>(null);

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const rect = svgRef2.current!.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (VIEW / rect.width);
    const sy = (e.clientY - rect.top) * (VIEW / rect.height);
    return [clamp(fromSX(sx), -RANGE, RANGE), clamp(fromSY(sy), -RANGE, RANGE)] as [number, number];
  }, []);

  const onDown = useCallback((pt: "L1" | "L2" | "P") => (e: React.PointerEvent) => {
    dragging.current = pt;
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const pos = getSVGPos(e);
    if (dragging.current === "L1") setL1(pos);
    else if (dragging.current === "L2") setL2(pos);
    else setPtP(pos);
  }, [getSVGPos]);

  const onUp = useCallback(() => { dragging.current = null; }, []);

  const samePoint = L1[0] === L2[0] && L1[1] === L2[1];

  const a = L2[1] - L1[1];
  const b = -(L2[0] - L1[0]);
  const c = -(a * L1[0] + b * L1[1]);
  const fP = a * ptP[0] + b * ptP[1] + c;

  const lineExtend = (): [[number, number], [number, number]] => {
    if (samePoint) return [[-RANGE, 0], [RANGE, 0]];
    const dx = L2[0] - L1[0];
    const dy = L2[1] - L1[1];
    let t1: number, t2: number;
    if (Math.abs(dx) > Math.abs(dy)) {
      t1 = (-RANGE - L1[0]) / dx;
      t2 = (RANGE - L1[0]) / dx;
    } else {
      t1 = (-RANGE - L1[1]) / dy;
      t2 = (RANGE - L1[1]) / dy;
    }
    return [
      [clamp(L1[0] + t1 * dx, -RANGE, RANGE), clamp(L1[1] + t1 * dy, -RANGE, RANGE)],
      [clamp(L1[0] + t2 * dx, -RANGE, RANGE), clamp(L1[1] + t2 * dy, -RANGE, RANGE)],
    ];
  };

  const [lStart, lEnd] = lineExtend();

  const status = samePoint
    ? { label: "Dua titik garis bertumpuk!", color: "text-yellow-300", bg: "bg-yellow-900/30 border-yellow-500/40", emoji: "⚠️" }
    : fP > 0
    ? { label: "Sisi POSITIF garis", color: "text-pink-300", bg: "bg-pink-900/30 border-pink-500/40", emoji: "🔴" }
    : fP === 0
    ? { label: "TEPAT PADA garis ✓", color: "text-green-300", bg: "bg-green-900/30 border-green-500/40", emoji: "✅" }
    : { label: "Sisi NEGATIF garis", color: "text-cyan-300", bg: "bg-cyan-900/30 border-cyan-500/40", emoji: "🔵" };

  const formatLinear = (coef: number, varName: string) => {
    if (coef === 0) return "";
    const sign = coef > 0 ? "+" : "−";
    const abs = Math.abs(coef);
    return ` ${sign} ${abs === 1 ? "" : abs}${varName}`;
  };

  const lineEqStr = (() => {
    if (samePoint) return "undefined";
    const parts: string[] = [];
    if (a !== 0) parts.push(`${a === 1 ? "" : a === -1 ? "−" : a}x`);
    if (b !== 0) {
      const bStr = b === 1 ? "+y" : b === -1 ? "−y" : b > 0 ? `+${b}y` : `${b}y`;
      parts.push(bStr);
    }
    if (c !== 0) parts.push(c > 0 ? `+${c}` : `${c}`);
    return parts.join("") + " = 0";
  })();

  const gridLines = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const isAxis = i === 0;
    gridLines.push(
      <line key={`v${i}`} x1={toSX(i)} y1={0} x2={toSX(i)} y2={VIEW}
        stroke={isAxis ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.07)"} strokeWidth={isAxis ? 1.5 : 1} />,
      <line key={`h${i}`} x1={0} y1={toSY(i)} x2={VIEW} y2={toSY(i)}
        stroke={isAxis ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.07)"} strokeWidth={isAxis ? 1.5 : 1} />
    );
    if (i !== 0 && i % 2 === 0) {
      gridLines.push(
        <text key={`lx${i}`} x={toSX(i)} y={toSY(0) + 14} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i}</text>,
        <text key={`ly${i}`} x={toSX(0) - 8} y={toSY(i) + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i}</text>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-xl overflow-hidden border border-violet-500/30 bg-slate-900/90 shadow-lg shadow-violet-900/20">
        <div className="absolute top-2 left-3 text-xs text-white/40 font-mono z-10">seret titik untuk menggerakkan</div>
        <svg
          ref={svgRef2}
          width={VIEW} height={VIEW}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          {gridLines}
          {/* Extended line */}
          {!samePoint && (
            <line
              x1={toSX(lStart[0])} y1={toSY(lStart[1])}
              x2={toSX(lEnd[0])} y2={toSY(lEnd[1])}
              stroke="#a78bfa" strokeWidth={2.5} opacity={0.85}
            />
          )}
          {/* Dashed guide from P to line */}
          {!samePoint && fP !== 0 && (
            <line
              x1={toSX(ptP[0])} y1={toSY(ptP[1])}
              x2={toSX(ptP[0] - a * fP / (a * a + b * b))} y2={toSY(ptP[1] - b * fP / (a * a + b * b))}
              stroke={fP > 0 ? "#f472b6" : "#22d3ee"} strokeWidth={1} strokeDasharray="4,3" opacity={0.45}
            />
          )}
          {/* L1 point */}
          <g onPointerDown={onDown("L1")} style={{ cursor: "grab" }}>
            <circle cx={toSX(L1[0])} cy={toSY(L1[1])} r={14} fill="transparent" />
            <rect x={toSX(L1[0]) - 6} y={toSY(L1[1]) - 6} width={12} height={12}
              fill="#a78bfa" stroke="white" strokeWidth={2} rx={2} transform={`rotate(45,${toSX(L1[0])},${toSY(L1[1])})`} />
            <text x={toSX(L1[0]) - 12} y={toSY(L1[1]) - 12} fill="#a78bfa" fontSize={10} fontFamily="monospace" fontWeight="bold">
              L₁({L1[0]},{L1[1]})
            </text>
          </g>
          {/* L2 point */}
          <g onPointerDown={onDown("L2")} style={{ cursor: "grab" }}>
            <circle cx={toSX(L2[0])} cy={toSY(L2[1])} r={14} fill="transparent" />
            <rect x={toSX(L2[0]) - 6} y={toSY(L2[1]) - 6} width={12} height={12}
              fill="#c4b5fd" stroke="white" strokeWidth={2} rx={2} transform={`rotate(45,${toSX(L2[0])},${toSY(L2[1])})`} />
            <text x={toSX(L2[0]) + 10} y={toSY(L2[1]) - 10} fill="#c4b5fd" fontSize={10} fontFamily="monospace" fontWeight="bold">
              L₂({L2[0]},{L2[1]})
            </text>
          </g>
          {/* P point */}
          <g onPointerDown={onDown("P")} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={14} fill="transparent" />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={8}
              fill={fP > 0 ? "#f472b6" : fP === 0 ? "#4ade80" : "#22d3ee"}
              stroke="white" strokeWidth={2} />
            <text x={toSX(ptP[0]) + 11} y={toSY(ptP[1]) - 9} fill={fP > 0 ? "#f472b6" : fP === 0 ? "#4ade80" : "#22d3ee"}
              fontSize={11} fontFamily="monospace" fontWeight="bold">
              P({ptP[0]},{ptP[1]})
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono flex-wrap justify-center">
        <span className="flex items-center gap-1.5 text-violet-300">
          <span className="w-3 h-3 bg-violet-400 rounded-sm inline-block rotate-45" />L₁, L₂ = Titik pada Garis
        </span>
        <span className="flex items-center gap-1.5 text-pink-300">
          <span className="w-3 h-3 bg-pink-400 rounded-full inline-block" />P = Titik yang dicek
        </span>
      </div>

      {/* Output */}
      <div className="w-full space-y-3">
        <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-4">
          <p className="text-violet-300 font-mono font-bold text-sm mb-2">📐 Persamaan Garis (dari L₁ dan L₂)</p>
          {samePoint ? (
            <p className="text-yellow-300 text-sm font-mono">⚠️ Pindahkan L₁ dan L₂ ke posisi berbeda!</p>
          ) : (
            <div className="space-y-1">
              <p className="font-mono text-white text-base font-bold">{lineEqStr}</p>
              <p className="text-white/40 text-xs font-mono">
                a={a}, b={b}, c={c} &nbsp;→&nbsp; f(x,y) = {a !== 1 ? a : ""}x {b >= 0 ? `+ ${b !== 1 ? b : ""}y` : `− ${Math.abs(b) !== 1 ? Math.abs(b) : ""}y`} {c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}
              </p>
            </div>
          )}
        </div>

        <div className={`border rounded-xl p-4 space-y-2 ${status.bg}`}>
          <p className={`font-mono font-bold text-sm ${status.color}`}>{status.emoji} Posisi titik P({ptP[0]},{ptP[1]})</p>
          {!samePoint && (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/60 text-sm font-mono">f(P) =</span>
                <span className="text-white/60 text-sm font-mono">
                  {a}({ptP[0]}) + ({b})({ptP[1]}) + ({c})
                </span>
                <span className="text-white font-bold text-sm font-mono">=</span>
                <span className={`font-mono font-bold text-xl px-3 py-1 rounded-lg border ${status.bg} ${status.color}`}>
                  {fP}
                </span>
              </div>
              <p className={`font-bold text-base ${status.color}`}>
                {fP > 0 ? "f(P) > 0 → Sisi POSITIF garis" : fP === 0 ? "f(P) = 0 → P TEPAT PADA garis" : "f(P) < 0 → Sisi NEGATIF garis"}
              </p>
              <p className="text-white/40 text-xs font-body">{fP > 0 ? "Titik P berada di sisi positif dari persamaan garis." : fP === 0 ? "Koordinat P memenuhi persamaan garis — P tepat di atasnya!" : "Titik P berada di sisi negatif dari persamaan garis."}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
