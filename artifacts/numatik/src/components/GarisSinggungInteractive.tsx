import { useState, useRef, useCallback, useMemo } from "react";

const VIEW = 460;
const CX = VIEW / 2;
const CY = VIEW / 2;

type Challenge = {
  id: string;
  label: string;
  check: (r: number, d: number, t: number) => boolean;
  hint: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: "free",
    label: "🎨 Eksplorasi Bebas",
    check: () => true,
    hint: "Geser titik P (luar lingkaran) atau ubah jari-jari. Saksikan panjang garis singgung berubah.",
  },
  {
    id: "t345",
    label: "Bentuk segitiga 3-4-5 (r=3, OP=5, garis singgung=4)",
    check: (r, d, t) => r === 3 && d === 5 && t === 4,
    hint: "Atur jari-jari = 3 dan jarak OP = 5. Panjang garis singgung akan = 4 (Triple 3-4-5).",
  },
  {
    id: "t512",
    label: "Bentuk segitiga 5-12-13 (r=5, OP=13, garis singgung=12)",
    check: (r, d, t) => r === 5 && d === 13 && t === 12,
    hint: "Atur r = 5 dan OP = 13. Garis singgung akan menjadi 12.",
  },
  {
    id: "t815",
    label: "Bentuk segitiga 8-15-17 (r=8, OP=17, garis singgung=15)",
    check: (r, d, t) => r === 8 && d === 17 && t === 15,
    hint: "Atur r = 8 dan OP = 17. Garis singgung akan = 15.",
  },
];

export default function GarisSinggungInteractive() {
  const [r, setR] = useState(60);
  const [P, setP] = useState({ x: CX + 160, y: CY - 40 });
  const [draggingP, setDraggingP] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [unitScale, setUnitScale] = useState(20);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const dx = P.x - CX;
  const dy = P.y - CY;
  const distOP = Math.sqrt(dx * dx + dy * dy);
  const isOutside = distOP > r + 1;

  // Tangent line: from P to circle. Tangent length t = sqrt(OP² − r²)
  const tangentLen = isOutside ? Math.sqrt(distOP * distOP - r * r) : 0;

  // Tangent points (T1, T2): use the formula
  // angle alpha from OP to OT = arccos(r / OP)
  const computeTangentPoints = useMemo(() => {
    if (!isOutside) return null;
    const angOP = Math.atan2(dy, dx);
    const alpha = Math.acos(r / distOP);
    const t1Ang = angOP + alpha;
    const t2Ang = angOP - alpha;
    return {
      T1: { x: CX + r * Math.cos(t1Ang), y: CY + r * Math.sin(t1Ang) },
      T2: { x: CX + r * Math.cos(t2Ang), y: CY + r * Math.sin(t2Ang) },
    };
  }, [isOutside, dx, dy, distOP, r]);

  // Convert pixel measurements to "cm" using unitScale (px per cm)
  const rUnit = Math.round(r / unitScale);
  const distUnit = Math.round(distOP / unitScale);
  const tangentUnit = isOutside
    ? Math.round(Math.sqrt(distUnit * distUnit - rUnit * rUnit) * 100) / 100
    : 0;
  const tangentIsInteger =
    isOutside && Number.isInteger(rUnit) && Number.isInteger(distUnit) &&
    Math.abs(tangentUnit - Math.round(tangentUnit)) < 0.01;

  const challenge = CHALLENGES[challengeIdx];
  const challengeMet = challenge.check(rUnit, distUnit, Math.round(tangentUnit));

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * VIEW,
      y: ((e.clientY - rect.top) / rect.height) * VIEW,
    };
  }, []);

  const handleDown = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
    setDraggingP(true);
  }, []);

  const handleMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!draggingP) return;
      const pos = getSVGPos(e);
      if (!pos) return;
      // Snap to integer multiples of unitScale relative to center
      const relX = pos.x - CX;
      const relY = pos.y - CY;
      const snappedX = CX + Math.round(relX / unitScale) * unitScale;
      const snappedY = CY + Math.round(relY / unitScale) * unitScale;
      // Constrain within view
      const newX = Math.max(20, Math.min(VIEW - 20, snappedX));
      const newY = Math.max(20, Math.min(VIEW - 20, snappedY));
      setP({ x: newX, y: newY });
    },
    [draggingP, getSVGPos, unitScale],
  );

  const handleUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.target as SVGCircleElement).releasePointerCapture(e.pointerId);
    setDraggingP(false);
  }, []);

  const reset = () => {
    setR(60);
    setP({ x: CX + 160, y: CY - 40 });
    setUnitScale(20);
  };

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-violet-300/20 p-3 md:p-4">
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setChallengeIdx(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all border ${
              i === challengeIdx
                ? "bg-violet-400 text-slate-900 border-violet-200 shadow-[0_0_15px_rgba(167,139,250,0.6)]"
                : "border-white/20 text-white/70 bg-white/5 hover:bg-white/10"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-4 items-start">
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="w-full h-auto rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 touch-none"
            onPointerMove={handleMove}
          >
            {/* Grid */}
            {Array.from({ length: 24 }).map((_, i) => (
              <g key={`gr${i}`} opacity="0.12">
                <line x1={i * (VIEW / 23)} y1={0} x2={i * (VIEW / 23)} y2={VIEW} stroke="#475569" strokeWidth="0.5" />
                <line x1={0} y1={i * (VIEW / 23)} x2={VIEW} y2={i * (VIEW / 23)} stroke="#475569" strokeWidth="0.5" />
              </g>
            ))}

            {/* Circle */}
            <circle cx={CX} cy={CY} r={r} fill="none" stroke="#22d3ee" strokeWidth="3" style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.4))" }} />

            {/* Center O */}
            <circle cx={CX} cy={CY} r={4} fill="#fde047" stroke="#facc15" strokeWidth="1.5" />
            <text x={CX - 12} y={CY + 14} fill="#fde047" fontSize="13" fontWeight="bold">O</text>

            {/* Line OP */}
            <line x1={CX} y1={CY} x2={P.x} y2={P.y} stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 4" />
            <text
              x={(CX + P.x) / 2 + 6}
              y={(CY + P.y) / 2 - 6}
              fill="#c4b5fd"
              fontSize="12"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              {distUnit}
            </text>

            {/* Tangent lines and points */}
            {isOutside && computeTangentPoints && (
              <>
                {/* Radius lines OT1 and OT2 */}
                <line x1={CX} y1={CY} x2={computeTangentPoints.T1.x} y2={computeTangentPoints.T1.y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
                <line x1={CX} y1={CY} x2={computeTangentPoints.T2.x} y2={computeTangentPoints.T2.y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />

                {/* Tangent line PT1 */}
                <line
                  x1={P.x}
                  y1={P.y}
                  x2={computeTangentPoints.T1.x}
                  y2={computeTangentPoints.T1.y}
                  stroke={tangentIsInteger && challengeIdx > 0 && challengeMet ? "#fde047" : "#34d399"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.6))" }}
                />
                {/* Tangent line PT2 */}
                <line
                  x1={P.x}
                  y1={P.y}
                  x2={computeTangentPoints.T2.x}
                  y2={computeTangentPoints.T2.y}
                  stroke={tangentIsInteger && challengeIdx > 0 && challengeMet ? "#fde047" : "#34d399"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.6))" }}
                />

                {/* Right angle marker at T1 */}
                {showRight && (() => {
                  const T1 = computeTangentPoints.T1;
                  // Vector along radius (from T1 toward O)
                  const rx = (CX - T1.x) / r;
                  const ry = (CY - T1.y) / r;
                  // Perpendicular (along tangent toward P)
                  const dpx = P.x - T1.x;
                  const dpy = P.y - T1.y;
                  const dpL = Math.sqrt(dpx * dpx + dpy * dpy);
                  const px = dpx / dpL;
                  const py = dpy / dpL;
                  const sz = 12;
                  return (
                    <polyline
                      points={`${T1.x + rx * sz},${T1.y + ry * sz} ${T1.x + (rx + px) * sz},${T1.y + (ry + py) * sz} ${T1.x + px * sz},${T1.y + py * sz}`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                  );
                })()}

                {/* Right angle marker at T2 */}
                {showRight && (() => {
                  const T2 = computeTangentPoints.T2;
                  const rx = (CX - T2.x) / r;
                  const ry = (CY - T2.y) / r;
                  const dpx = P.x - T2.x;
                  const dpy = P.y - T2.y;
                  const dpL = Math.sqrt(dpx * dpx + dpy * dpy);
                  const px = dpx / dpL;
                  const py = dpy / dpL;
                  const sz = 12;
                  return (
                    <polyline
                      points={`${T2.x + rx * sz},${T2.y + ry * sz} ${T2.x + (rx + px) * sz},${T2.y + (ry + py) * sz} ${T2.x + px * sz},${T2.y + py * sz}`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                  );
                })()}

                {/* Tangent points T1, T2 */}
                <circle cx={computeTangentPoints.T1.x} cy={computeTangentPoints.T1.y} r={6} fill="#34d399" stroke="#065f46" strokeWidth="2" />
                <text x={computeTangentPoints.T1.x + 9} y={computeTangentPoints.T1.y - 9} fill="#6ee7b7" fontSize="12" fontWeight="bold">T₁</text>
                <circle cx={computeTangentPoints.T2.x} cy={computeTangentPoints.T2.y} r={6} fill="#34d399" stroke="#065f46" strokeWidth="2" />
                <text x={computeTangentPoints.T2.x + 9} y={computeTangentPoints.T2.y + 18} fill="#6ee7b7" fontSize="12" fontWeight="bold">T₂</text>

                {/* Tangent length label */}
                <text
                  x={(P.x + computeTangentPoints.T1.x) / 2 + 6}
                  y={(P.y + computeTangentPoints.T1.y) / 2 - 6}
                  fill="#a7f3d0"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {tangentUnit}
                </text>

                {/* Radius label */}
                <text
                  x={(CX + computeTangentPoints.T1.x) / 2 - 8}
                  y={(CY + computeTangentPoints.T1.y) / 2 - 4}
                  fill="#fbbf24"
                  fontSize="11"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  r={rUnit}
                </text>
              </>
            )}

            {!isOutside && (
              <text x={CX} y={VIEW - 20} fill="#fb7185" fontSize="13" fontWeight="bold" textAnchor="middle">
                ⚠️ Geser titik P keluar lingkaran agar dapat membuat garis singgung
              </text>
            )}

            {/* Point P */}
            <circle
              cx={P.x}
              cy={P.y}
              r={11}
              fill="#a78bfa"
              stroke="#4c1d95"
              strokeWidth={3}
              onPointerDown={handleDown}
              onPointerUp={handleUp}
              style={{ cursor: draggingP ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(167,139,250,0.7))" }}
            />
            <text x={P.x + 14} y={P.y - 12} fill="#c4b5fd" fontSize="13" fontWeight="bold" style={{ pointerEvents: "none" }}>P</text>
          </svg>
          <p className="mt-2 text-[11px] text-center text-white/55 font-body italic">
            🖱️ Seret titik P (ungu) di luar lingkaran. Saksikan: jari-jari OT₁ ⊥ garis singgung PT₁ (kotak kuning siku-siku).
          </p>
        </div>

        {/* Info panel */}
        <div className="space-y-2">
          <div className={`rounded-xl border-2 p-3 transition-all ${
            challengeIdx === 0
              ? "border-violet-300/30 bg-violet-500/10"
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
            <p className="text-[10px] uppercase tracking-wider text-emerald-200/70 mb-1">Teorema Pythagoras</p>
            <p className="text-sm font-display font-bold text-violet-200">OP² = r² + PT²</p>
            <p className="text-sm font-display font-bold text-emerald-100 mt-1">
              {distUnit}² = {rUnit}² + PT²
            </p>
            <p className="text-base font-display font-bold text-yellow-200 mt-1">
              PT = √({distUnit * distUnit} − {rUnit * rUnit}) = √{Math.max(0, distUnit * distUnit - rUnit * rUnit)}
            </p>
            <p className="text-lg font-display font-bold text-yellow-100">
              = {tangentIsInteger ? Math.round(tangentUnit) : tangentUnit.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-black/30 p-3 space-y-2">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/50">Jari-jari (r)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={20}
                  value={r}
                  onChange={(e) => setR(parseInt(e.target.value))}
                  className="flex-1 accent-cyan-400"
                />
                <span className="text-sm font-bold text-cyan-200 w-12 text-right">{rUnit}</span>
              </div>
            </div>
            <div className="text-xs space-y-0.5 text-white/85">
              <p>OP (jarak P ke pusat) = <span className="font-bold text-violet-200">{distUnit}</span></p>
              <p>r (jari-jari) = <span className="font-bold text-cyan-200">{rUnit}</span></p>
              <p>PT (garis singgung) = <span className="font-bold text-emerald-200">{tangentIsInteger ? Math.round(tangentUnit) : tangentUnit.toFixed(2)}</span></p>
              <p>PT₁ = PT₂ <span className="text-yellow-200 italic">(dua garis singgung dari P selalu sama panjang)</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-black/30 p-2.5 text-xs text-white/75 text-center">
            {tangentIsInteger ? (
              <p className="text-yellow-200 font-bold">⭐ Triple Pythagoras: {rUnit}-{Math.round(tangentUnit)}-{distUnit}</p>
            ) : (
              <p>PT = bilangan irasional ({tangentUnit.toFixed(2)})</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowRight((v) => !v)}
              className="flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 transition-colors"
            >
              {showRight ? "□ Sembunyikan ⊥" : "□ Tampilkan ⊥"}
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
