import React, { useState, useRef, useCallback } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useTheme } from "@/contexts/ThemeContext";

const VIEW = 300;
const RANGE = 6;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

const toSX = (x: number) => O + x * CELL;
const toSY = (y: number) => O - y * CELL;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function getRaw(e: React.PointerEvent, el: SVGSVGElement): [number, number] {
  const rect = el.getBoundingClientRect();
  const sx = (e.clientX - rect.left) * (VIEW / rect.width);
  const sy = (e.clientY - rect.top) * (VIEW / rect.height);
  return [(sx - O) / CELL, -(sy - O) / CELL];
}
function getSnapped(e: React.PointerEvent, el: SVGSVGElement): [number, number] {
  const [rx, ry] = getRaw(e, el);
  return [clamp(Math.round(rx), -RANGE, RANGE), clamp(Math.round(ry), -RANGE, RANGE)];
}

function renderGrid(axisColor: string, gridColor: string, labelFill: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const axis = i === 0;
    nodes.push(
      <line key={`v${i}`} x1={toSX(i)} y1={0} x2={toSX(i)} y2={VIEW}
        stroke={axis ? axisColor : gridColor} strokeWidth={axis ? 1.5 : 1} />,
      <line key={`h${i}`} x1={0} y1={toSY(i)} x2={VIEW} y2={toSY(i)}
        stroke={axis ? axisColor : gridColor} strokeWidth={axis ? 1.5 : 1} />
    );
    if (i !== 0) {
      nodes.push(
        <text key={`lx${i}`} className="geom-axis-label" x={toSX(i)} y={toSY(0) + 13} textAnchor="middle"
          fill={labelFill} fontSize={8} fontFamily="monospace">{i}</text>,
        <text key={`ly${i}`} className="geom-axis-label" x={toSX(0) - 5} y={toSY(i) + 3} textAnchor="end"
          fill={labelFill} fontSize={8} fontFamily="monospace">{i}</text>
      );
    }
  }
  return nodes;
}

/* ═══════════════════════════════════════════════════════════════
   1. GARIS HORIZONTAL  y = k
═══════════════════════════════════════════════════════════════ */
export function JarakGarisHorizontal() {
  const { isDark } = useTheme();
  const [ptP, setPtP] = useState<[number, number]>([3, 4]);
  const [k, setK] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"P" | "LINE" | null>(null);

  const onPDown = (e: React.PointerEvent) => {
    dragging.current = "P";
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onLineDown = (e: React.PointerEvent) => {
    dragging.current = "LINE";
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !svgRef.current) return;
    if (dragging.current === "P") setPtP(getSnapped(e, svgRef.current));
    else { const [, ry] = getRaw(e, svgRef.current); setK(clamp(Math.round(ry), -RANGE + 1, RANGE - 1)); }
  }, []);
  const onUp = useCallback(() => { dragging.current = null; }, []);

  const dist = Math.abs(ptP[1] - k);

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-500/40 shadow-xl shadow-cyan-900/30">
      {/* ── header ── */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="font-mono font-bold text-white text-xs">🎮 Garis Horizontal  y = k</p>
          <p className="text-white/65 text-xs font-body">Seret titik P (🟠) atau garis biru untuk menggeser</p>
        </div>
        <span className="text-white/75 text-xs font-mono bg-white/10 px-2 py-1 rounded-lg">d = |y<sub>P</sub>−k|</span>
      </div>

      {/* ── SVG ── */}
      <div className={`geom-diagram-bg ${isDark ? "bg-[#021018]" : "bg-sky-50"} flex justify-center`}>
        <svg ref={svgRef} width={VIEW} height={VIEW} viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
          <defs>
            <radialGradient id="bgH" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0c2030" /><stop offset="100%" stopColor="#021018" />
            </radialGradient>
          </defs>
          <rect className="geom-diagram-bg-rect" width={VIEW} height={VIEW} fill={isDark ? "url(#bgH)" : "white"} />
          {renderGrid(
            isDark ? "rgba(34,211,238,0.4)"  : "rgba(8,145,178,0.7)",
            isDark ? "rgba(34,211,238,0.08)" : "rgba(8,145,178,0.15)",
            isDark ? "rgba(255,255,255,0.28)": "rgba(8,145,178,0.8)"
          )}

          {/* invisible wide hit band for horizontal line */}
          <line x1={0} y1={toSY(k)} x2={VIEW} y2={toSY(k)}
            stroke="transparent" strokeWidth={24} onPointerDown={onLineDown}
            style={{ cursor: "ns-resize" }} />
          {/* visible line */}
          <line x1={0} y1={toSY(k)} x2={VIEW} y2={toSY(k)}
            stroke="#22d3ee" strokeWidth={2.5} opacity={0.9} style={{ pointerEvents: "none" }} />
          <text x={VIEW - 5} y={toSY(k) - 6} textAnchor="end"
            fill="#67e8f9" fontSize={10} fontFamily="monospace" fontWeight="bold"
            style={{ pointerEvents: "none" }}>y = {k}</text>

          {/* perpendicular + foot */}
          {dist > 0 && (() => {
            const S = 9;
            const Fx = toSX(ptP[0]), Fy = toSY(k);
            const ny = ptP[1] > k ? -1 : 1;
            return (<>
              <line x1={toSX(ptP[0])} y1={toSY(ptP[1])} x2={Fx} y2={Fy}
                stroke="#fbbf24" strokeWidth={2} strokeDasharray="5,3" opacity={0.9}
                style={{ pointerEvents: "none" }} />
              {/* right-angle square */}
              <polyline className="geom-marker-white" points={`${Fx+S},${Fy} ${Fx+S},${Fy+ny*S} ${Fx},${Fy+ny*S}`}
                fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.5}
                style={{ pointerEvents: "none" }} />
              <text x={Fx + 7} y={(toSY(ptP[1]) + Fy) / 2 + 4}
                fill="#fbbf24" fontSize={10} fontFamily="monospace" fontWeight="bold"
                style={{ pointerEvents: "none" }}>d={dist}</text>
            </>);
          })()}

          {/* Point P */}
          <g onPointerDown={onPDown} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={18} fill="transparent" />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={13} fill="#f97316" opacity={0.15} />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={8} fill="#f97316" stroke="white" strokeWidth={2} />
            <text x={toSX(ptP[0]) + 11} y={toSY(ptP[1]) - 10}
              fill="#fdba74" fontSize={10} fontFamily="monospace" fontWeight="bold">P({ptP[0]},{ptP[1]})</text>
          </g>
        </svg>
      </div>

      {/* ── formula panel ── */}
      <div className={`${isDark ? "bg-gradient-to-b from-slate-900 to-cyan-950/50 border-cyan-500/20" : "bg-gradient-to-b from-slate-50 to-cyan-50 border-cyan-300"} px-4 py-4 space-y-3 border-t`}>
        <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
          <span className={`${isDark ? "bg-orange-900/50 border-orange-500/40 text-orange-200" : "bg-orange-100 border-orange-400 text-orange-700"} border rounded-lg px-2.5 py-1`}>y<sub>P</sub> = {ptP[1]}</span>
          <span className={`${isDark ? "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" : "bg-cyan-100 border-cyan-400 text-cyan-700"} border rounded-lg px-2.5 py-1`}>k = {k}</span>
          <span className={`${isDark ? "bg-yellow-900/50 border-yellow-500/40 text-yellow-200" : "bg-yellow-100 border-yellow-400 text-yellow-700"} border rounded-lg px-2.5 py-1`}>|y<sub>P</sub>−k| = {Math.abs(ptP[1]-k)}</span>
        </div>
        <div className={`${isDark ? "bg-slate-800/70 border-cyan-500/20" : "bg-cyan-50 border-cyan-300"} border rounded-xl px-3 py-1 overflow-x-auto`}>
          <BlockMath math={`d = |y_P - k| = |${ptP[1]} - (${k})| = |${ptP[1] - k}| = ${dist}`} />
        </div>
        <div className="flex justify-center">
          <div className={`${isDark ? "bg-gradient-to-r from-cyan-600/20 to-sky-600/20 border-cyan-400/50" : "bg-gradient-to-r from-cyan-100 to-sky-100 border-cyan-400"} border rounded-xl px-8 py-3 text-center`}>
            <p className={`${isDark ? "text-cyan-300/60" : "text-cyan-600"} text-xs font-body mb-0.5`}>Jarak P ke garis y={k}</p>
            <p className={`font-mono font-bold text-3xl ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>d = {dist} <span className={`text-sm font-normal ${isDark ? "text-cyan-300/50" : "text-cyan-600"}`}>satuan</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. GARIS VERTIKAL  x = k
═══════════════════════════════════════════════════════════════ */
export function JarakGarisVertikal() {
  const { isDark } = useTheme();
  const [ptP, setPtP] = useState<[number, number]>([-3, 2]);
  const [k, setK] = useState(2);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"P" | "LINE" | null>(null);

  const onPDown = (e: React.PointerEvent) => {
    dragging.current = "P";
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onLineDown = (e: React.PointerEvent) => {
    dragging.current = "LINE";
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !svgRef.current) return;
    if (dragging.current === "P") setPtP(getSnapped(e, svgRef.current));
    else { const [rx] = getRaw(e, svgRef.current); setK(clamp(Math.round(rx), -RANGE + 1, RANGE - 1)); }
  }, []);
  const onUp = useCallback(() => { dragging.current = null; }, []);

  const dist = Math.abs(ptP[0] - k);

  return (
    <div className="rounded-2xl overflow-hidden border border-green-500/40 shadow-xl shadow-green-900/30">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="font-mono font-bold text-white text-xs">🎮 Garis Vertikal  x = k</p>
          <p className="text-white/65 text-xs font-body">Seret titik P (🩷) atau garis hijau untuk menggeser</p>
        </div>
        <span className="text-white/75 text-xs font-mono bg-white/10 px-2 py-1 rounded-lg">d = |x<sub>P</sub>−k|</span>
      </div>

      <div className={`geom-diagram-bg ${isDark ? "bg-[#011509]" : "bg-green-50"} flex justify-center`}>
        <svg ref={svgRef} width={VIEW} height={VIEW} viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
          <defs>
            <radialGradient id="bgV" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#061a0d" /><stop offset="100%" stopColor="#011509" />
            </radialGradient>
          </defs>
          <rect className="geom-diagram-bg-rect" width={VIEW} height={VIEW} fill={isDark ? "url(#bgV)" : "white"} />
          {renderGrid(
            isDark ? "rgba(74,222,128,0.4)"  : "rgba(22,163,74,0.7)",
            isDark ? "rgba(74,222,128,0.08)" : "rgba(22,163,74,0.15)",
            isDark ? "rgba(255,255,255,0.28)": "rgba(22,163,74,0.8)"
          )}

          <line x1={toSX(k)} y1={0} x2={toSX(k)} y2={VIEW}
            stroke="transparent" strokeWidth={24} onPointerDown={onLineDown}
            style={{ cursor: "ew-resize" }} />
          <line x1={toSX(k)} y1={0} x2={toSX(k)} y2={VIEW}
            stroke="#4ade80" strokeWidth={2.5} opacity={0.9} style={{ pointerEvents: "none" }} />
          <text x={toSX(k) + 6} y={14} fill="#86efac" fontSize={10} fontFamily="monospace" fontWeight="bold"
            style={{ pointerEvents: "none" }}>x = {k}</text>

          {dist > 0 && (() => {
            const S = 9;
            const Fx = toSX(k), Fy = toSY(ptP[1]);
            const nx = ptP[0] > k ? -1 : 1;
            return (<>
              <line x1={toSX(ptP[0])} y1={Fy} x2={Fx} y2={Fy}
                stroke="#fbbf24" strokeWidth={2} strokeDasharray="5,3" opacity={0.9}
                style={{ pointerEvents: "none" }} />
              {/* right-angle square */}
              <polyline className="geom-marker-white" points={`${Fx},${Fy+S} ${Fx+nx*S},${Fy+S} ${Fx+nx*S},${Fy}`}
                fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.5}
                style={{ pointerEvents: "none" }} />
              <text x={(toSX(ptP[0]) + Fx) / 2} y={Fy - 7}
                textAnchor="middle" fill="#fbbf24" fontSize={10} fontFamily="monospace" fontWeight="bold"
                style={{ pointerEvents: "none" }}>d={dist}</text>
            </>);
          })()}

          <g onPointerDown={onPDown} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={18} fill="transparent" />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={13} fill="#f472b6" opacity={0.15} />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={8} fill="#f472b6" stroke="white" strokeWidth={2} />
            <text x={toSX(ptP[0]) + 11} y={toSY(ptP[1]) - 10}
              fill="#f9a8d4" fontSize={10} fontFamily="monospace" fontWeight="bold">P({ptP[0]},{ptP[1]})</text>
          </g>
        </svg>
      </div>

      <div className={`${isDark ? "bg-gradient-to-b from-slate-900 to-green-950/50 border-green-500/20" : "bg-gradient-to-b from-slate-50 to-green-50 border-green-300"} px-4 py-4 space-y-3 border-t`}>
        <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
          <span className={`${isDark ? "bg-pink-900/50 border-pink-500/40 text-pink-200" : "bg-pink-100 border-pink-400 text-pink-700"} border rounded-lg px-2.5 py-1`}>x<sub>P</sub> = {ptP[0]}</span>
          <span className={`${isDark ? "bg-green-900/50 border-green-500/40 text-green-200" : "bg-green-100 border-green-400 text-green-700"} border rounded-lg px-2.5 py-1`}>k = {k}</span>
          <span className={`${isDark ? "bg-yellow-900/50 border-yellow-500/40 text-yellow-200" : "bg-yellow-100 border-yellow-400 text-yellow-700"} border rounded-lg px-2.5 py-1`}>|x<sub>P</sub>−k| = {Math.abs(ptP[0]-k)}</span>
        </div>
        <div className={`${isDark ? "bg-slate-800/70 border-green-500/20" : "bg-green-50 border-green-300"} border rounded-xl px-3 py-1 overflow-x-auto`}>
          <BlockMath math={`d = |x_P - k| = |${ptP[0]} - (${k})| = |${ptP[0] - k}| = ${dist}`} />
        </div>
        <div className="flex justify-center">
          <div className={`${isDark ? "bg-gradient-to-r from-green-600/20 to-teal-600/20 border-green-400/50" : "bg-gradient-to-r from-green-100 to-teal-100 border-green-400"} border rounded-xl px-8 py-3 text-center`}>
            <p className={`${isDark ? "text-green-300/60" : "text-green-600"} text-xs font-body mb-0.5`}>Jarak P ke garis x={k}</p>
            <p className={`font-mono font-bold text-3xl ${isDark ? "text-green-300" : "text-green-700"}`}>d = {dist} <span className={`text-sm font-normal ${isDark ? "text-green-300/50" : "text-green-600"}`}>satuan</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. GARIS MIRING  ax + by + c = 0
═══════════════════════════════════════════════════════════════ */
export function JarakGarisMiring() {
  const { isDark } = useTheme();
  const [L1, setL1] = useState<[number, number]>([-4, -2]);
  const [L2, setL2] = useState<[number, number]>([4, 2]);
  const [ptP, setPtP] = useState<[number, number]>([-2, 4]);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"L1" | "L2" | "P" | "LINE" | null>(null);
  const lineDrag = useRef<{ rawX: number; rawY: number; l1: [number,number]; l2: [number,number] } | null>(null);

  const rawOf = useCallback((e: React.PointerEvent): [number,number] => {
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (VIEW / rect.width);
    const sy = (e.clientY - rect.top) * (VIEW / rect.height);
    return [(sx - O) / CELL, -(sy - O) / CELL];
  }, []);

  const snapOf = useCallback((e: React.PointerEvent): [number,number] => {
    const [rx,ry] = rawOf(e);
    return [clamp(Math.round(rx),-RANGE,RANGE), clamp(Math.round(ry),-RANGE,RANGE)];
  }, [rawOf]);

  const onDown = (pt: "L1"|"L2"|"P") => (e: React.PointerEvent) => {
    dragging.current = pt;
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onLineDown = useCallback((e: React.PointerEvent) => {
    dragging.current = "LINE";
    const [rx,ry] = rawOf(e);
    lineDrag.current = { rawX:rx, rawY:ry, l1:[L1[0],L1[1]], l2:[L2[0],L2[1]] };
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  }, [L1, L2, rawOf]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !svgRef.current) return;
    if (dragging.current === "LINE" && lineDrag.current) {
      const [rx,ry] = rawOf(e);
      const dx = rx - lineDrag.current.rawX, dy = ry - lineDrag.current.rawY;
      setL1([clamp(Math.round(lineDrag.current.l1[0]+dx),-RANGE,RANGE), clamp(Math.round(lineDrag.current.l1[1]+dy),-RANGE,RANGE)]);
      setL2([clamp(Math.round(lineDrag.current.l2[0]+dx),-RANGE,RANGE), clamp(Math.round(lineDrag.current.l2[1]+dy),-RANGE,RANGE)]);
      return;
    }
    const pos = snapOf(e);
    if (dragging.current === "L1") setL1(pos);
    else if (dragging.current === "L2") setL2(pos);
    else if (dragging.current === "P") setPtP(pos);
  }, [rawOf, snapOf]);

  const onUp = useCallback(() => { dragging.current = null; lineDrag.current = null; }, []);

  const same = L1[0]===L2[0] && L1[1]===L2[1];
  const a = L2[1]-L1[1], b = -(L2[0]-L1[0]), c = -(a*L1[0]+b*L1[1]);
  const num = a*ptP[0]+b*ptP[1]+c;
  const denom = a*a+b*b;
  const dist = denom>0 ? Math.abs(num)/Math.sqrt(denom) : 0;
  const distStr = Number.isInteger(dist) ? `${dist}` : dist.toFixed(3);
  const footX = denom>0 ? ptP[0]-a*num/denom : ptP[0];
  const footY = denom>0 ? ptP[1]-b*num/denom : ptP[1];

  const lineExtend = (): [[number,number],[number,number]] => {
    if (same) return [[-RANGE,0],[RANGE,0]];
    const dx=L2[0]-L1[0], dy=L2[1]-L1[1];
    let t1:number, t2:number;
    if (Math.abs(dx)>=Math.abs(dy)) { t1=(-RANGE-L1[0])/dx; t2=(RANGE-L1[0])/dx; }
    else { t1=(-RANGE-L1[1])/dy; t2=(RANGE-L1[1])/dy; }
    if (t1>t2) [t1,t2]=[t2,t1];
    return [
      [clamp(L1[0]+t1*dx,-RANGE,RANGE), clamp(L1[1]+t1*dy,-RANGE,RANGE)],
      [clamp(L1[0]+t2*dx,-RANGE,RANGE), clamp(L1[1]+t2*dy,-RANGE,RANGE)],
    ];
  };
  const [lS,lE] = lineExtend();

  const eqStr = (() => {
    if (same) return "?";
    const p:string[] = [];
    if (a!==0) p.push(`${a===1?"":a===-1?"-":a}x`);
    if (b!==0) p.push(b===1?"+y":b===-1?"-y":b>0?`+${b}y`:`${b}y`);
    if (c!==0) p.push(c>0?`+${c}`:`${c}`);
    return (p.join("")||"0")+" = 0";
  })();

  return (
    <div className="rounded-2xl overflow-hidden border border-violet-500/40 shadow-xl shadow-violet-900/30">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="font-mono font-bold text-white text-xs">🎮 Garis Miring  ax + by + c = 0</p>
          <p className="text-white/65 text-xs font-body">Seret L₁, L₂, garis ungu, atau titik P (🟡)</p>
        </div>
        <span className="text-white/75 text-xs font-mono bg-white/10 px-2 py-1 rounded-lg hidden sm:block">d=|ax+by+c|/√(a²+b²)</span>
      </div>

      <div className={`geom-diagram-bg ${isDark ? "bg-[#0a0118]" : "bg-violet-50"} flex justify-center`}>
        <svg ref={svgRef} width={VIEW} height={VIEW} viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
          <defs>
            <radialGradient id="bgM" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#180530" /><stop offset="100%" stopColor="#0a0118" />
            </radialGradient>
          </defs>
          <rect className="geom-diagram-bg-rect" width={VIEW} height={VIEW} fill={isDark ? "url(#bgM)" : "white"} />
          {renderGrid(
            isDark ? "rgba(167,139,250,0.45)" : "rgba(124,58,237,0.7)",
            isDark ? "rgba(167,139,250,0.08)" : "rgba(124,58,237,0.15)",
            isDark ? "rgba(255,255,255,0.28)"  : "rgba(124,58,237,0.8)"
          )}

          {!same && <>
            {/* invisible hit area */}
            <line x1={toSX(lS[0])} y1={toSY(lS[1])} x2={toSX(lE[0])} y2={toSY(lE[1])}
              stroke="transparent" strokeWidth={22} onPointerDown={onLineDown} style={{ cursor:"move" }} />
            {/* visible line */}
            <line x1={toSX(lS[0])} y1={toSY(lS[1])} x2={toSX(lE[0])} y2={toSY(lE[1])}
              stroke="#a78bfa" strokeWidth={2.5} opacity={0.9} style={{ pointerEvents:"none" }} />
            {/* perpendicular */}
            {dist > 0.005 && (() => {
              const dx = L2[0]-L1[0], dy = L2[1]-L1[1];
              const lineLen = Math.sqrt(dx*dx+dy*dy);
              const S = 9;
              const ulx = lineLen>0 ? dx/lineLen : 1, uly = lineLen>0 ? -dy/lineLen : 0;
              const sqDenom = Math.sqrt(denom);
              const sign = num >= 0 ? 1 : -1;
              const unx = sign*a/sqDenom, uny = -sign*b/sqDenom;
              const Fx = toSX(footX), Fy = toSY(footY);
              const Ax = Fx+S*ulx, Ay = Fy+S*uly;
              const Bx = Ax+S*unx, By = Ay+S*uny;
              const Cx = Fx+S*unx, Cy = Fy+S*uny;
              return (<>
                <line x1={toSX(ptP[0])} y1={toSY(ptP[1])} x2={Fx} y2={Fy}
                  stroke="#fbbf24" strokeWidth={2} strokeDasharray="5,3" opacity={0.9} style={{ pointerEvents:"none" }} />
                {/* right-angle square */}
                <polyline className="geom-marker-white" points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                  fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.5}
                  style={{ pointerEvents:"none" }} />
                <circle cx={Fx} cy={Fy} r={4}
                  fill="#a78bfa" stroke="white" strokeWidth={1.5} style={{ pointerEvents:"none" }} />
                <text x={(toSX(ptP[0])+Fx)/2+8} y={(toSY(ptP[1])+Fy)/2}
                  fill="#fbbf24" fontSize={9} fontFamily="monospace" fontWeight="bold" style={{ pointerEvents:"none" }}>d≈{distStr}</text>
              </>);
            })()}
          </>}

          {/* L1 */}
          <g onPointerDown={onDown("L1")} style={{ cursor:"grab" }}>
            <circle cx={toSX(L1[0])} cy={toSY(L1[1])} r={16} fill="transparent" />
            <rect x={toSX(L1[0])-6} y={toSY(L1[1])-6} width={12} height={12} fill="#a78bfa" stroke="white" strokeWidth={2} rx={2}
              transform={`rotate(45,${toSX(L1[0])},${toSY(L1[1])})`} />
            <text x={toSX(L1[0])-11} y={toSY(L1[1])-11} fill="#c4b5fd" fontSize={9} fontFamily="monospace" fontWeight="bold">
              L₁({L1[0]},{L1[1]})
            </text>
          </g>
          {/* L2 */}
          <g onPointerDown={onDown("L2")} style={{ cursor:"grab" }}>
            <circle cx={toSX(L2[0])} cy={toSY(L2[1])} r={16} fill="transparent" />
            <rect x={toSX(L2[0])-6} y={toSY(L2[1])-6} width={12} height={12} fill="#c4b5fd" stroke="white" strokeWidth={2} rx={2}
              transform={`rotate(45,${toSX(L2[0])},${toSY(L2[1])})`} />
            <text x={toSX(L2[0])+10} y={toSY(L2[1])-11} fill="#c4b5fd" fontSize={9} fontFamily="monospace" fontWeight="bold">
              L₂({L2[0]},{L2[1]})
            </text>
          </g>
          {/* P */}
          <g onPointerDown={onDown("P")} style={{ cursor:"grab" }}>
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={18} fill="transparent" />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={13} fill="#f59e0b" opacity={0.15} />
            <circle cx={toSX(ptP[0])} cy={toSY(ptP[1])} r={8} fill="#f59e0b" stroke="white" strokeWidth={2} />
            <text x={toSX(ptP[0])+11} y={toSY(ptP[1])-10} fill="#fde68a" fontSize={10} fontFamily="monospace" fontWeight="bold">
              P({ptP[0]},{ptP[1]})
            </text>
          </g>
        </svg>
      </div>

      <div className={`${isDark ? "bg-gradient-to-b from-slate-900 to-violet-950/50 border-violet-500/20" : "bg-gradient-to-b from-slate-50 to-violet-50 border-violet-300"} px-4 py-4 space-y-3 border-t`}>
        {same ? (
          <p className={`${isDark ? "text-yellow-300" : "text-yellow-700"} text-xs font-mono text-center`}>⚠️ Pindahkan L₁ dan L₂ ke posisi berbeda!</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
              <span className={`${isDark ? "bg-violet-900/50 border-violet-500/40 text-violet-200" : "bg-violet-100 border-violet-400 text-violet-700"} border rounded-lg px-2 py-1`}>Garis: {eqStr}</span>
              <span className={`${isDark ? "bg-slate-700/60 border-white/15 text-white/60" : "bg-gray-100 border-gray-300 text-gray-600"} border rounded-lg px-2 py-1`}>a={a}, b={b}, c={c}</span>
              <span className={`${isDark ? "bg-amber-900/50 border-amber-500/40 text-amber-200" : "bg-amber-100 border-amber-400 text-amber-700"} border rounded-lg px-2 py-1`}>P({ptP[0]},{ptP[1]})</span>
            </div>
            <div className={`${isDark ? "bg-slate-800/70 border-violet-500/20" : "bg-violet-50 border-violet-300"} border rounded-xl px-3 py-1 overflow-x-auto space-y-0.5 text-sm`}>
              <div className={isDark ? "text-violet-300/60" : "text-violet-400"}><BlockMath math={`d = \\frac{|ax_P + by_P + c|}{\\sqrt{a^2+b^2}}`} /></div>
              <div className={isDark ? "text-white/80" : "text-gray-800"}><BlockMath math={`= \\frac{|${a}(${ptP[0]}) + (${b})(${ptP[1]}) + (${c})|}{\\sqrt{${a}^2+(${b})^2}}`} /></div>
              <div className={isDark ? "text-white/80" : "text-gray-800"}><BlockMath math={`= \\frac{|${num}|}{\\sqrt{${denom}}} = \\frac{${Math.abs(num)}}{\\sqrt{${denom}}}`} /></div>
            </div>
            <div className="flex justify-center">
              <div className={`${isDark ? "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border-violet-400/50" : "bg-gradient-to-r from-violet-100 to-fuchsia-100 border-violet-400"} border rounded-xl px-8 py-3 text-center`}>
                <p className={`${isDark ? "text-violet-300/60" : "text-violet-600"} text-xs font-body mb-0.5`}>Jarak P ke garis {eqStr}</p>
                <p className={`font-mono font-bold text-3xl ${isDark ? "text-violet-300" : "text-violet-700"}`}>d {Number.isInteger(dist)?"=":"≈"} {distStr} <span className={`text-sm font-normal ${isDark ? "text-violet-300/50" : "text-violet-600"}`}>satuan</span></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
