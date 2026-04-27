import { useState, useRef, useCallback, useMemo } from "react";

const VIEW = 460;
const CX = VIEW / 2;
const CY = VIEW / 2;
const R = 150;
const PI = Math.PI;

const toCartesian = (angleDeg: number) => {
  const rad = (angleDeg * PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY - R * Math.sin(rad) };
};

const angleFromPoint = (x: number, y: number) => {
  const dx = x - CX;
  const dy = -(y - CY);
  let deg = (Math.atan2(dy, dx) * 180) / PI;
  if (deg < 0) deg += 360;
  return Math.round(deg);
};

type Challenge = {
  id: string;
  label: string;
  check: (angleAOB: number, angleACB: number) => boolean;
  hint: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: "free",
    label: "🎨 Eksplorasi Bebas",
    check: () => true,
    hint: "Geser titik A, B, atau C untuk mengamati hubungan sudut pusat dan sudut keliling.",
  },
  {
    id: "aob90",
    label: "Buat sudut pusat AOB = 90°",
    check: (aob) => aob === 90,
    hint: "Tempatkan A di kanan dan B di atas (selisih 90° pada lingkaran).",
  },
  {
    id: "aob180",
    label: "Buat sudut pusat AOB = 180° (diameter)",
    check: (aob) => aob === 180,
    hint: "A dan B harus segaris melewati pusat O. Sudut keliling C menjadi 90° (siku-siku!).",
  },
  {
    id: "acb45",
    label: "Buat sudut keliling ACB = 45°",
    check: (_, acb) => acb === 45,
    hint: "Sudut keliling = ½ sudut pusat. Buat sudut pusat = 90°.",
  },
  {
    id: "aob120",
    label: "Buat sudut pusat AOB = 120°",
    check: (aob) => aob === 120,
    hint: "Sudut keliling akan menjadi 60°.",
  },
];

export default function LingkaranInteractive() {
  const [angA, setAngA] = useState(20);
  const [angB, setAngB] = useState(110);
  const [angC, setAngC] = useState(225);
  const [dragging, setDragging] = useState<"A" | "B" | "C" | null>(null);
  const [showAngles, setShowAngles] = useState(true);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [radiusUnit, setRadiusUnit] = useState(7);
  const svgRef = useRef<SVGSVGElement>(null);

  const A = toCartesian(angA);
  const B = toCartesian(angB);
  const C = toCartesian(angC);

  // Sudut pusat AOB (sudut yang ditatap dari titik C, jadi yang TIDAK mengandung C)
  const minorArc = useMemo(() => {
    let diff = Math.abs(angB - angA);
    if (diff > 180) diff = 360 - diff;
    return diff;
  }, [angA, angB]);

  // Determine which arc (minor or major) the inscribed angle subtends
  // Sudut keliling = setengah sudut pusat yang menatap busur SAMA
  // Sudut keliling subtends the arc NOT containing C
  const arcContainsC = useMemo(() => {
    // Arc going from A to B counter-clockwise vs clockwise
    // Check if C is on the minor arc (between A and B the "short way")
    const a = angA;
    const b = angB;
    const c = angC;
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    const cInRange = c > start && c < end;
    const minorIsBetween = (end - start) <= 180;
    if (minorIsBetween) {
      return cInRange ? "minor" : "major";
    } else {
      return cInRange ? "major" : "minor";
    }
  }, [angA, angB, angC]);

  // The "subtended" central angle (the one C watches across) is the OPPOSITE arc
  const subtendedCentralAngle = arcContainsC === "minor" ? 360 - minorArc : minorArc;
  const inscribedAngle = subtendedCentralAngle / 2;

  // Properties
  const r = radiusUnit; // in cm
  const PI_VAL = 22 / 7;
  const keliling = 2 * PI_VAL * r;
  const luas = PI_VAL * r * r;
  const panjangBusurMinor = (minorArc / 360) * keliling;
  const luasJuringMinor = (minorArc / 360) * luas;

  const challenge = CHALLENGES[challengeIdx];
  const challengeMet = challenge.check(minorArc, Math.round(inscribedAngle));

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * VIEW,
      y: ((e.clientY - rect.top) / rect.height) * VIEW,
    };
  }, []);

  const handleDown = useCallback(
    (e: React.PointerEvent<SVGCircleElement>, id: "A" | "B" | "C") => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
      setDragging(id);
    },
    [],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const pos = getSVGPos(e);
      if (!pos) return;
      const ang = angleFromPoint(pos.x, pos.y);
      if (dragging === "A" && ang !== angB && ang !== angC) setAngA(ang);
      else if (dragging === "B" && ang !== angA && ang !== angC) setAngB(ang);
      else if (dragging === "C" && ang !== angA && ang !== angB) setAngC(ang);
    },
    [dragging, getSVGPos, angA, angB, angC],
  );

  const handleUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.target as SVGCircleElement).releasePointerCapture(e.pointerId);
    setDragging(null);
  }, []);

  const reset = () => {
    setAngA(20);
    setAngB(110);
    setAngC(225);
    setRadiusUnit(7);
  };

  // Sector path for sudut pusat
  const sectorPath = useMemo(() => {
    const startAng = Math.min(angA, angB);
    const endAng = Math.max(angA, angB);
    const useMinor = (endAng - startAng) <= 180;
    const sweep = useMinor ? endAng - startAng : 360 - (endAng - startAng);
    const largeArc = sweep > 180 ? 1 : 0;
    let p1, p2;
    if (useMinor) {
      p1 = toCartesian(startAng);
      p2 = toCartesian(endAng);
    } else {
      p1 = toCartesian(endAng);
      p2 = toCartesian(startAng);
    }
    return `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 0 ${p2.x} ${p2.y} Z`;
  }, [angA, angB]);

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-rose-300/20 p-3 md:p-4">
      {/* Challenge selector */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setChallengeIdx(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all border ${
              i === challengeIdx
                ? "bg-rose-400 text-slate-900 border-rose-200 shadow-[0_0_15px_rgba(251,113,133,0.6)]"
                : "border-white/20 text-white/70 bg-white/5 hover:bg-white/10"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-4 items-start">
        {/* Circle */}
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="w-full h-auto rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 touch-none"
            onPointerMove={handleMove}
          >
            {/* Sector (juring) for sudut pusat */}
            <path d={sectorPath} fill="#fb923c" fillOpacity="0.25" stroke="#fb923c" strokeWidth="1.5" />

            {/* Main circle */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#22d3ee" strokeWidth="3" style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.5))" }} />

            {/* Center O */}
            <circle cx={CX} cy={CY} r={4} fill="#fde047" stroke="#facc15" strokeWidth="1.5" />
            <text x={CX + 7} y={CY + 14} fill="#fde047" fontSize="12" fontWeight="bold">O</text>

            {/* Lines OA, OB (jari-jari) */}
            <line x1={CX} y1={CY} x2={A.x} y2={A.y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
            <line x1={CX} y1={CY} x2={B.x} y2={B.y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />

            {/* Chord AB (tali busur) */}
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#a78bfa" strokeWidth="2" />

            {/* Inscribed angle lines CA, CB */}
            <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="#34d399" strokeWidth="2.5" />
            <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} stroke="#34d399" strokeWidth="2.5" />

            {/* Radius label */}
            <text
              x={(CX + A.x) / 2 + 6}
              y={(CY + A.y) / 2 - 6}
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              r
            </text>

            {/* Sudut pusat label */}
            {showAngles && (
              <g style={{ pointerEvents: "none" }}>
                <rect x={CX - 30} y={CY - 38} width={60} height={20} rx={4} fill="#fb923c" fillOpacity="0.9" />
                <text x={CX} y={CY - 24} fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ∠AOB = {minorArc}°
                </text>
              </g>
            )}

            {/* Sudut keliling label */}
            {showAngles && (
              <g style={{ pointerEvents: "none" }}>
                <rect x={C.x - 35} y={C.y + 16} width={70} height={20} rx={4} fill="#34d399" fillOpacity="0.9" />
                <text x={C.x} y={C.y + 30} fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ∠ACB = {Math.round(inscribedAngle)}°
                </text>
              </g>
            )}

            {/* Points A, B (on circle) */}
            <circle
              cx={A.x}
              cy={A.y}
              r={11}
              fill="#fb7185"
              stroke="#9f1239"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "A")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "A" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(251,113,133,0.7))" }}
            />
            <text x={A.x} y={A.y - 16} fill="#fda4af" fontSize="13" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: "none" }}>A</text>

            <circle
              cx={B.x}
              cy={B.y}
              r={11}
              fill="#22d3ee"
              stroke="#0e7490"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "B")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "B" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.7))" }}
            />
            <text x={B.x} y={B.y - 16} fill="#67e8f9" fontSize="13" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: "none" }}>B</text>

            <circle
              cx={C.x}
              cy={C.y}
              r={11}
              fill="#34d399"
              stroke="#065f46"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "C")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "C" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(52,211,153,0.7))" }}
            />
            <text x={C.x} y={C.y - 16} fill="#6ee7b7" fontSize="13" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: "none" }}>C</text>
          </svg>
          <p className="mt-2 text-[11px] text-center text-white/55 font-body italic">
            🖱️ Seret titik A (merah), B (biru), atau C (hijau) di sepanjang lingkaran. Saksikan ∠ACB selalu = ½ × ∠AOB!
          </p>
        </div>

        {/* Info panel */}
        <div className="space-y-2">
          <div
            className={`rounded-xl border-2 p-3 transition-all ${
              challengeIdx === 0
                ? "border-rose-300/30 bg-rose-500/10"
                : challengeMet
                  ? "border-yellow-300/60 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 animate-pulse"
                  : "border-amber-300/30 bg-amber-500/10"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Tantangan</p>
            <p className="text-sm font-bold text-white">{challenge.label}</p>
            {challengeIdx !== 0 && (
              <p className="text-xs mt-1 text-white/70 italic">
                {challengeMet ? "🏆 BERHASIL!" : `💡 ${challenge.hint}`}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200/70 mb-1">Hubungan Sudut</p>
            <p className="text-sm font-display font-bold text-orange-200">∠AOB (pusat) = {minorArc}°</p>
            <p className="text-sm font-display font-bold text-emerald-200">∠ACB (keliling) = {Math.round(inscribedAngle)}°</p>
            <div className="mt-1.5 pt-1.5 border-t border-white/10">
              <p className="text-xs text-yellow-200">
                ✨ {minorArc} ÷ 2 = {(minorArc / 2).toFixed(1)} → ∠ACB = ½ × ∠AOB
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-black/30 p-3 space-y-2">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/50">Jari-jari (r)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={radiusUnit}
                  onChange={(e) => setRadiusUnit(parseInt(e.target.value))}
                  className="flex-1 accent-cyan-400"
                />
                <span className="text-sm font-bold text-cyan-200 w-12 text-right">{r} cm</span>
              </div>
            </div>
            <div className="text-xs space-y-0.5 text-white/85">
              <p>Keliling = 2πr = <span className="font-bold text-cyan-200">{keliling.toFixed(2)} cm</span></p>
              <p>Luas = πr² = <span className="font-bold text-cyan-200">{luas.toFixed(2)} cm²</span></p>
              <p className="text-orange-200">Busur AB = <span className="font-bold">{panjangBusurMinor.toFixed(2)} cm</span></p>
              <p className="text-orange-200">Juring AOB = <span className="font-bold">{luasJuringMinor.toFixed(2)} cm²</span></p>
            </div>
            <p className="text-[10px] text-white/40 italic">π ≈ 22/7</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAngles((v) => !v)}
              className="flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 transition-colors"
            >
              {showAngles ? "🔢 Sembunyikan ∠" : "🔢 Tampilkan ∠"}
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
