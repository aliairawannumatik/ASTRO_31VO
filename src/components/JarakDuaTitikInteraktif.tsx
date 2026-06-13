import React, { useState, useRef, useCallback } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const VIEW = 360;
const RANGE = 7;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

const toSX = (x: number) => O + x * CELL;
const toSY = (y: number) => O - y * CELL;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function getSVGCoords(e: React.PointerEvent, el: SVGSVGElement): [number, number] {
  const rect = el.getBoundingClientRect();
  const sx = (e.clientX - rect.left) * (VIEW / rect.width);
  const sy = (e.clientY - rect.top) * (VIEW / rect.height);
  return [
    clamp(Math.round((sx - O) / CELL), -RANGE, RANGE),
    clamp(Math.round(-(sy - O) / CELL), -RANGE, RANGE),
  ];
}

function fmtCoef(n: number, showPos = false): string {
  if (n === 0) return "0";
  const s = n < 0 ? `-${Math.abs(n)}` : showPos ? `+${n}` : `${n}`;
  return s;
}

export default function JarakDuaTitikInteraktif() {
  const [ptA, setPtA] = useState<[number, number]>([-3, -2]);
  const [ptB, setPtB] = useState<[number, number]>([4, 3]);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"A" | "B" | null>(null);

  const onDown = (pt: "A" | "B") => (e: React.PointerEvent) => {
    dragging.current = pt;
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !svgRef.current) return;
    const pos = getSVGCoords(e, svgRef.current);
    if (dragging.current === "A") setPtA(pos);
    else setPtB(pos);
  }, []);

  const onUp = useCallback(() => { dragging.current = null; }, []);

  const dx = ptB[0] - ptA[0];
  const dy = ptB[1] - ptA[1];
  const distSq = dx * dx + dy * dy;
  const dist = Math.sqrt(distSq);
  const isExact = Number.isInteger(dist);
  const distDisplay = isExact ? `${dist}` : dist.toFixed(3);

  /* foot of the right-angle helper: horizontal from A then vertical to B */
  const foot: [number, number] = [ptB[0], ptA[1]];
  const samePoint = ptA[0] === ptB[0] && ptA[1] === ptB[1];

  /* grid lines */
  const grid: React.ReactNode[] = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const axis = i === 0;
    grid.push(
      <line key={`v${i}`} x1={toSX(i)} y1={0} x2={toSX(i)} y2={VIEW}
        stroke={axis ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.07)"}
        strokeWidth={axis ? 1.5 : 1} />,
      <line key={`h${i}`} x1={0} y1={toSY(i)} x2={VIEW} y2={toSY(i)}
        stroke={axis ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.07)"}
        strokeWidth={axis ? 1.5 : 1} />
    );
    if (i !== 0 && i % 2 === 0) {
      grid.push(
        <text key={`lx${i}`} x={toSX(i)} y={toSY(0) + 14} textAnchor="middle"
          fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i}</text>,
        <text key={`ly${i}`} x={toSX(0) - 7} y={toSY(i) + 3} textAnchor="end"
          fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i}</text>
      );
    }
  }

  /* KaTeX formula strings with substituted values */
  const dxStr = fmtCoef(ptB[0]) + (ptA[0] >= 0 ? ` - ${ptA[0]}` : ` - (${ptA[0]})`);
  const dyStr = fmtCoef(ptB[1]) + (ptA[1] >= 0 ? ` - ${ptA[1]}` : ` - (${ptA[1]})`);

  const formulaStep1 = `d(AB) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`;
  const formulaStep2 = `= \\sqrt{\\bigl(${fmtCoef(ptB[0])} - (${fmtCoef(ptA[0])})\\bigr)^2 + \\bigl(${fmtCoef(ptB[1])} - (${fmtCoef(ptA[1])})\\bigr)^2}`;
  const formulaStep3 = `= \\sqrt{(${dx})^2 + (${dy})^2}`;
  const formulaStep4 = `= \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${distSq}}`;
  const formulaStep5 = isExact
    ? `= ${distDisplay} \\text{ satuan}`
    : `\\approx ${distDisplay} \\text{ satuan}`;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* SVG grid */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900/90 shadow-lg shadow-cyan-900/20">
        <div className="absolute top-2 left-3 text-xs text-white/35 font-mono z-10 pointer-events-none">
          seret titik A atau B
        </div>
        <svg
          ref={svgRef}
          width={VIEW} height={VIEW}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          {grid}

          {!samePoint && (
            <>
              {/* right-angle helper: horizontal leg */}
              <line
                x1={toSX(ptA[0])} y1={toSY(ptA[1])}
                x2={toSX(foot[0])} y2={toSY(foot[1])}
                stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.55}
              />
              {/* right-angle helper: vertical leg */}
              <line
                x1={toSX(foot[0])} y1={toSY(foot[1])}
                x2={toSX(ptB[0])} y2={toSY(ptB[1])}
                stroke="#4ade80" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.55}
              />
              {/* right-angle box at foot */}
              {dx !== 0 && dy !== 0 && (
                <rect
                  x={toSX(foot[0]) - (dx > 0 ? 6 : 0)}
                  y={toSY(foot[1]) - (dy > 0 ? 6 : 0)}
                  width={6} height={6}
                  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1}
                />
              )}
              {/* Δx label */}
              {dx !== 0 && (
                <text
                  x={(toSX(ptA[0]) + toSX(foot[0])) / 2}
                  y={toSY(foot[1]) + (dy >= 0 ? 14 : -6)}
                  textAnchor="middle" fill="#22d3ee" fontSize={9} fontFamily="monospace">
                  Δx={dx}
                </text>
              )}
              {/* Δy label */}
              {dy !== 0 && (
                <text
                  x={toSX(foot[0]) + (dx >= 0 ? 10 : -10)}
                  y={(toSY(foot[1]) + toSY(ptB[1])) / 2 + 3}
                  textAnchor={dx >= 0 ? "start" : "end"} fill="#4ade80" fontSize={9} fontFamily="monospace">
                  Δy={dy}
                </text>
              )}
              {/* AB distance line */}
              <line
                x1={toSX(ptA[0])} y1={toSY(ptA[1])}
                x2={toSX(ptB[0])} y2={toSY(ptB[1])}
                stroke="#f59e0b" strokeWidth={2.5} opacity={0.9}
              />
              {/* distance midpoint label */}
              <text
                x={(toSX(ptA[0]) + toSX(ptB[0])) / 2 + 8}
                y={(toSY(ptA[1]) + toSY(ptB[1])) / 2 - 6}
                fill="#f59e0b" fontSize={9} fontFamily="monospace" fontWeight="bold">
                d≈{distDisplay}
              </text>
            </>
          )}

          {/* Point A */}
          <g onPointerDown={onDown("A")} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptA[0])} cy={toSY(ptA[1])} r={15} fill="transparent" />
            <circle cx={toSX(ptA[0])} cy={toSY(ptA[1])} r={8}
              fill="#f472b6" stroke="white" strokeWidth={2} />
            <text x={toSX(ptA[0]) - 12} y={toSY(ptA[1]) - 12}
              fill="#f472b6" fontSize={11} fontFamily="monospace" fontWeight="bold">
              A({ptA[0]},{ptA[1]})
            </text>
          </g>

          {/* Point B */}
          <g onPointerDown={onDown("B")} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptB[0])} cy={toSY(ptB[1])} r={15} fill="transparent" />
            <circle cx={toSX(ptB[0])} cy={toSY(ptB[1])} r={8}
              fill="#a78bfa" stroke="white" strokeWidth={2} />
            <text x={toSX(ptB[0]) + 11} y={toSY(ptB[1]) - 12}
              fill="#a78bfa" fontSize={11} fontFamily="monospace" fontWeight="bold">
              B({ptB[0]},{ptB[1]})
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono justify-center">
        <span className="flex items-center gap-1.5 text-pink-300">
          <span className="w-3 h-3 bg-pink-400 rounded-full" />A(x₁, y₁)
        </span>
        <span className="flex items-center gap-1.5 text-violet-300">
          <span className="w-3 h-3 bg-violet-400 rounded-full" />B(x₂, y₂)
        </span>
        <span className="flex items-center gap-1.5 text-amber-300">
          <span className="inline-block w-6 h-0.5 bg-amber-400" />d(AB) = jarak
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="inline-block w-5 h-0.5 bg-cyan-400 opacity-60" style={{ borderTop: "2px dashed" }} />Δx
        </span>
        <span className="flex items-center gap-1.5 text-green-300">
          <span className="inline-block w-5 h-0.5 bg-green-400 opacity-60" style={{ borderTop: "2px dashed" }} />Δy
        </span>
      </div>

      {/* Formula panel */}
      {samePoint ? (
        <div className="w-full bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-yellow-300 text-sm font-mono">⚠️ Pindahkan A dan B ke posisi yang berbeda!</p>
        </div>
      ) : (
        <div className="w-full bg-slate-800/70 border border-amber-500/30 rounded-xl p-4 space-y-3">
          <p className="text-amber-300 font-mono font-bold text-sm">📐 Rumus Jarak — Langkah demi Langkah</p>

          {/* substituted x1 y1 x2 y2 info */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="bg-pink-900/40 border border-pink-500/30 rounded-lg px-2 py-1 text-pink-300">
              x₁ = {ptA[0]}
            </span>
            <span className="bg-pink-900/40 border border-pink-500/30 rounded-lg px-2 py-1 text-pink-300">
              y₁ = {ptA[1]}
            </span>
            <span className="bg-violet-900/40 border border-violet-500/30 rounded-lg px-2 py-1 text-violet-300">
              x₂ = {ptB[0]}
            </span>
            <span className="bg-violet-900/40 border border-violet-500/30 rounded-lg px-2 py-1 text-violet-300">
              y₂ = {ptB[1]}
            </span>
            <span className="bg-cyan-900/40 border border-cyan-500/30 rounded-lg px-2 py-1 text-cyan-300">
              Δx = {dx}
            </span>
            <span className="bg-green-900/40 border border-green-500/30 rounded-lg px-2 py-1 text-green-300">
              Δy = {dy}
            </span>
          </div>

          {/* step-by-step formula */}
          <div className="space-y-1 overflow-x-auto">
            <div className="text-white/50 text-xs font-body">
              <BlockMath math={formulaStep1} />
            </div>
            <div className="text-white/80">
              <BlockMath math={formulaStep2} />
            </div>
            <div className="text-white/80">
              <BlockMath math={formulaStep3} />
            </div>
            <div className="text-white/80">
              <BlockMath math={formulaStep4} />
            </div>
            <div className="text-amber-300 font-bold">
              <BlockMath math={formulaStep5} />
            </div>
          </div>

          {/* distance result badge */}
          <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/10">
            <span className="text-white/50 text-sm font-body">Jarak A ke B:</span>
            <span className="bg-amber-500/20 border border-amber-400/50 rounded-xl px-5 py-2 font-mono font-bold text-2xl text-amber-300">
              {isExact ? distDisplay : `≈ ${distDisplay}`}
              <span className="text-sm font-normal text-amber-300/70 ml-1">satuan</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
