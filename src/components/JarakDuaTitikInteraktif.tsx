import React, { useState, useRef, useCallback } from "react";
import { BlockMath } from "react-katex";
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
  const samePoint = ptA[0] === ptB[0] && ptA[1] === ptB[1];
  const foot: [number, number] = [ptB[0], ptA[1]];

  /* formula strings */
  const fs2 = `= \\sqrt{\\bigl(${ptB[0]} - (${ptA[0]})\\bigr)^2 + \\bigl(${ptB[1]} - (${ptA[1]})\\bigr)^2}`;
  const fs3 = `= \\sqrt{(${dx})^2 + (${dy})^2}`;
  const fs4 = `= \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${distSq}}`;
  const fs5 = isExact ? `= ${distDisplay}` : `\\approx ${distDisplay}`;

  /* grid */
  const grid: React.ReactNode[] = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const axis = i === 0;
    grid.push(
      <line key={`v${i}`} x1={toSX(i)} y1={0} x2={toSX(i)} y2={VIEW}
        stroke={axis ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.12)"}
        strokeWidth={axis ? 1.5 : 1} />,
      <line key={`h${i}`} x1={0} y1={toSY(i)} x2={VIEW} y2={toSY(i)}
        stroke={axis ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.12)"}
        strokeWidth={axis ? 1.5 : 1} />
    );
    if (i !== 0) {
      grid.push(
        <text key={`lx${i}`} x={toSX(i)} y={toSY(0) + 14} textAnchor="middle"
          fill="rgba(167,139,250,0.5)" fontSize={8} fontFamily="monospace">{i}</text>,
        <text key={`ly${i}`} x={toSX(0) - 5} y={toSY(i) + 3} textAnchor="end"
          fill="rgba(167,139,250,0.5)" fontSize={8} fontFamily="monospace">{i}</text>
      );
    }
  }

  return (
    <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-indigo-500/40 shadow-xl shadow-indigo-900/30">
      {/* ── header strip ── */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3 flex items-center justify-between">
        <div>
          <p className="font-mono font-bold text-white text-sm">🎮 Animasi Interaktif — Jarak Dua Titik</p>
          <p className="text-white/70 text-xs font-body mt-0.5">Seret titik A atau B — rumus otomatis diperbarui</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-3 h-3 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50" />
          <span className="text-white/70 font-mono text-xs">A</span>
          <span className="w-3 h-3 rounded-full bg-violet-300 shadow-lg shadow-violet-500/50 ml-1" />
          <span className="text-white/70 font-mono text-xs">B</span>
        </div>
      </div>

      {/* ── SVG grid ── */}
      <div className="geom-diagram-bg bg-[#0d0d1a] flex justify-center">
        <svg
          ref={svgRef}
          width={VIEW} height={VIEW}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          style={{ display: "block", maxWidth: "100%", touchAction: "none" }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0d0d1a" />
            </radialGradient>
          </defs>
          <rect className="geom-diagram-bg-rect" width={VIEW} height={VIEW} fill="url(#bgGlow)" />
          {grid}

          {!samePoint && (
            <>
              {/* horizontal Δx leg */}
              <line x1={toSX(ptA[0])} y1={toSY(ptA[1])} x2={toSX(foot[0])} y2={toSY(foot[1])}
                stroke="#06b6d4" strokeWidth={2} strokeDasharray="6,3" opacity={0.8} />
              {/* vertical Δy leg */}
              <line x1={toSX(foot[0])} y1={toSY(foot[1])} x2={toSX(ptB[0])} y2={toSY(ptB[1])}
                stroke="#4ade80" strokeWidth={2} strokeDasharray="6,3" opacity={0.8} />
              {/* right-angle box */}
              {dx !== 0 && dy !== 0 && (
                <rect
                  x={toSX(foot[0]) - (dx > 0 ? 7 : 0)}
                  y={toSY(foot[1]) - (dy > 0 ? 7 : 0)}
                  width={7} height={7}
                  className="geom-marker-white"
                  fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} />
              )}
              {/* Δx label */}
              {dx !== 0 && (
                <text x={(toSX(ptA[0]) + toSX(foot[0])) / 2} y={toSY(foot[1]) + (dy >= 0 ? 15 : -6)}
                  textAnchor="middle" fill="#22d3ee" fontSize={10} fontFamily="monospace" fontWeight="bold">
                  Δx={dx}
                </text>
              )}
              {/* Δy label */}
              {dy !== 0 && (
                <text x={toSX(foot[0]) + (dx >= 0 ? 11 : -11)} y={(toSY(foot[1]) + toSY(ptB[1])) / 2 + 4}
                  textAnchor={dx >= 0 ? "start" : "end"} fill="#4ade80" fontSize={10} fontFamily="monospace" fontWeight="bold">
                  Δy={dy}
                </text>
              )}
              {/* glowing AB line */}
              <line x1={toSX(ptA[0])} y1={toSY(ptA[1])} x2={toSX(ptB[0])} y2={toSY(ptB[1])}
                stroke="#f59e0b" strokeWidth={3} opacity={0.25} />
              <line x1={toSX(ptA[0])} y1={toSY(ptA[1])} x2={toSX(ptB[0])} y2={toSY(ptB[1])}
                stroke="#fbbf24" strokeWidth={1.8} opacity={0.95} />
              {/* distance midpoint badge */}
              <text
                x={(toSX(ptA[0]) + toSX(ptB[0])) / 2 + 8}
                y={(toSY(ptA[1]) + toSY(ptB[1])) / 2 - 7}
                fill="#fbbf24" fontSize={10} fontFamily="monospace" fontWeight="bold" opacity={0.9}>
                d ≈ {distDisplay}
              </text>
            </>
          )}

          {/* Point A glow + handle */}
          <g onPointerDown={onDown("A")} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptA[0])} cy={toSY(ptA[1])} r={18} fill="transparent" />
            <circle cx={toSX(ptA[0])} cy={toSY(ptA[1])} r={13} fill="#f472b6" opacity={0.15} />
            <circle cx={toSX(ptA[0])} cy={toSY(ptA[1])} r={9} fill="#f472b6" stroke="white" strokeWidth={2} />
            <text x={toSX(ptA[0]) - 14} y={toSY(ptA[1]) - 13}
              fill="#f9a8d4" fontSize={11} fontFamily="monospace" fontWeight="bold">
              A({ptA[0]},{ptA[1]})
            </text>
          </g>

          {/* Point B glow + handle */}
          <g onPointerDown={onDown("B")} style={{ cursor: "grab" }}>
            <circle cx={toSX(ptB[0])} cy={toSY(ptB[1])} r={18} fill="transparent" />
            <circle cx={toSX(ptB[0])} cy={toSY(ptB[1])} r={13} fill="#a78bfa" opacity={0.18} />
            <circle cx={toSX(ptB[0])} cy={toSY(ptB[1])} r={9} fill="#a78bfa" stroke="white" strokeWidth={2} />
            <text x={toSX(ptB[0]) + 12} y={toSY(ptB[1]) - 13}
              fill="#c4b5fd" fontSize={11} fontFamily="monospace" fontWeight="bold">
              B({ptB[0]},{ptB[1]})
            </text>
          </g>
        </svg>
      </div>

      {/* ── legend strip ── */}
      <div className="bg-indigo-950/80 px-4 py-2 flex flex-wrap gap-x-5 gap-y-1 justify-center border-t border-indigo-500/20">
        <span className="flex items-center gap-1.5 text-xs font-mono text-pink-300">
          <span className="w-3 h-3 rounded-full bg-pink-400" />A(x₁, y₁)
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono text-violet-300">
          <span className="w-3 h-3 rounded-full bg-violet-400" />B(x₂, y₂)
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono text-amber-300">
          <span className="inline-block w-6 h-0.5 bg-amber-400 rounded" />jarak d(AB)
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
          <span className="inline-block w-5 border-t-2 border-dashed border-cyan-400" />Δx
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono text-green-300">
          <span className="inline-block w-5 border-t-2 border-dashed border-green-400" />Δy
        </span>
      </div>

      {/* ── formula panel ── */}
      {samePoint ? (
        <div className="bg-yellow-950/60 px-5 py-4 text-center border-t border-yellow-500/20">
          <p className="text-yellow-300 font-mono text-sm">⚠️ Pindahkan A dan B ke posisi yang berbeda!</p>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-slate-900 to-indigo-950/60 px-5 py-4 space-y-4 border-t border-indigo-500/20">
          {/* coordinate badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "x₁", val: ptA[0], color: "bg-pink-900/60 border-pink-500/50 text-pink-200" },
              { label: "y₁", val: ptA[1], color: "bg-pink-900/60 border-pink-500/50 text-pink-200" },
              { label: "x₂", val: ptB[0], color: "bg-violet-900/60 border-violet-500/50 text-violet-200" },
              { label: "y₂", val: ptB[1], color: "bg-violet-900/60 border-violet-500/50 text-violet-200" },
              { label: "Δx", val: dx, color: "bg-cyan-900/60 border-cyan-500/50 text-cyan-200" },
              { label: "Δy", val: dy, color: "bg-green-900/60 border-green-500/50 text-green-200" },
            ].map(({ label, val, color }) => (
              <span key={label} className={`border rounded-lg px-3 py-1.5 text-sm font-mono font-bold ${color}`}>
                {label} = <span className="text-white">{val}</span>
              </span>
            ))}
          </div>

          {/* step-by-step formula */}
          <div className="bg-indigo-950/60 border border-indigo-500/25 rounded-xl px-4 py-3 space-y-1 overflow-x-auto">
            <p className="text-indigo-300 font-mono font-bold text-xs mb-2 uppercase tracking-wide">📐 Langkah Perhitungan</p>
            <div className="text-indigo-300/60 text-sm">
              <BlockMath math={`d(AB) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`} />
            </div>
            <div className="text-white/80">
              <BlockMath math={fs2} />
            </div>
            <div className="text-cyan-300">
              <BlockMath math={fs3} />
            </div>
            <div className="text-amber-300">
              <BlockMath math={fs4} />
            </div>
            <div className="text-amber-400 font-bold">
              <BlockMath math={fs5} />
            </div>
          </div>

          {/* result badge */}
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-400/50 rounded-2xl px-8 py-4 flex items-center gap-4 shadow-lg shadow-amber-900/20">
              <div className="text-center">
                <p className="text-amber-300/70 text-xs font-body mb-1">Jarak A ke B</p>
                <p className="font-mono font-bold text-4xl text-amber-300 leading-none">
                  {isExact ? distDisplay : `≈${distDisplay}`}
                </p>
                <p className="text-amber-300/50 text-xs font-body mt-1">satuan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
