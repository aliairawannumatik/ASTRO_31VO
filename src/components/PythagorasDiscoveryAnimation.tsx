import React, { useState, useEffect, useCallback } from "react";

const STEPS = [
  { label: "Segitiga Siku-Siku", desc: "Perhatikan segitiga siku-siku dengan sisi a, b, dan c (sisi miring)." },
  { label: "Persegi pada sisi a", desc: "Bangun persegi di sisi a. Luasnya = a² = 9 satuan²." },
  { label: "Persegi pada sisi b", desc: "Bangun persegi di sisi b. Luasnya = b² = 16 satuan²." },
  { label: "Persegi pada sisi c", desc: "Bangun persegi di sisi miring c. Luasnya = c² = 25 satuan²." },
  { label: "Terbukti!", desc: "Luas persegi a + luas persegi b = luas persegi c → a² + b² = c²  ✓" },
];

const SCALE = 35;
const RX = 220, RY = 275;
const BX = RX + 4 * SCALE, BY = RY;
const AX = RX, AY = RY - 3 * SCALE;

const sqAPoints = [[AX, AY], [AX - 3 * SCALE, AY], [AX - 3 * SCALE, RY], [RX, RY]] as [number, number][];
const sqBPoints = [[RX, RY], [BX, BY], [BX, RY + 4 * SCALE], [RX, RY + 4 * SCALE]] as [number, number][];
const sqCPoints = [[AX, AY], [BX, BY], [BX + 3 * SCALE, BY - 4 * SCALE], [AX + 3 * SCALE, AY - 4 * SCALE]] as [number, number][];

function centroid(pts: [number, number][]): [number, number] {
  const x = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const y = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [x, y];
}

const [cAx, cAy] = centroid(sqAPoints);
const [cBx, cBy] = centroid(sqBPoints);
const [cCx, cCy] = centroid(sqCPoints);

function toPolygon(pts: [number, number][]) {
  return pts.map(p => p.join(",")).join(" ");
}

interface FadeGroupProps {
  visible: boolean;
  children: React.ReactNode;
  delay?: number;
}

const FadeGroup: React.FC<FadeGroupProps> = ({ visible, children, delay = 0 }) => (
  <g
    style={{
      opacity: visible ? 1 : 0,
      transition: `opacity 0.7s ease ${delay}s`,
      pointerEvents: "none",
    }}
  >
    {children}
  </g>
);

const PythagorasDiscoveryAnimation: React.FC = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  const advance = useCallback(() => {
    setStep(prev => {
      if (prev >= STEPS.length - 1) {
        setPlaying(false);
        setFinished(true);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    const delay = step === 0 ? 900 : 1600;
    const t = setTimeout(advance, delay);
    return () => clearTimeout(t);
  }, [step, playing, advance]);

  const handlePlay = () => {
    if (finished) {
      setStep(0);
      setFinished(false);
      setTimeout(() => setPlaying(true), 50);
    } else {
      setPlaying(p => !p);
    }
  };

  const handleStep = (i: number) => {
    setPlaying(false);
    setStep(i);
    setFinished(i === STEPS.length - 1);
  };

  const showTriangle = step >= 0;
  const showSqA = step >= 1;
  const showSqB = step >= 2;
  const showSqC = step >= 3;
  const showFinal = step >= 4;

  return (
    <div className="w-full flex flex-col items-center gap-3">

      <div
        className="w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900/70"
        style={{ maxWidth: 540 }}
      >
        <svg
          viewBox="20 0 500 430"
          className="w-full"
          aria-label="Animasi Penemuan Teorema Pythagoras"
        >
          <defs>
            <filter id="glow-a">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-b">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-c">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-eq">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Square on a (blue, left) ── */}
          <FadeGroup visible={showSqA}>
            <polygon
              points={toPolygon(sqAPoints)}
              fill="#3b82f6"
              fillOpacity={showFinal ? 0.55 : 0.35}
              stroke="#60a5fa"
              strokeWidth="2"
              filter={showFinal ? "url(#glow-a)" : undefined}
              style={{ transition: "fill-opacity 0.5s" }}
            />
            <text x={cAx} y={cAy - 8} textAnchor="middle" fill="#bfdbfe" fontSize="16" fontWeight="bold" fontFamily="monospace">a²</text>
            <text x={cAx} y={cAy + 10} textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="monospace">= 9</text>
          </FadeGroup>

          {/* ── Square on b (green, below) ── */}
          <FadeGroup visible={showSqB}>
            <polygon
              points={toPolygon(sqBPoints)}
              fill="#22c55e"
              fillOpacity={showFinal ? 0.55 : 0.35}
              stroke="#4ade80"
              strokeWidth="2"
              filter={showFinal ? "url(#glow-b)" : undefined}
              style={{ transition: "fill-opacity 0.5s" }}
            />
            <text x={cBx} y={cBy - 8} textAnchor="middle" fill="#bbf7d0" fontSize="16" fontWeight="bold" fontFamily="monospace">b²</text>
            <text x={cBx} y={cBy + 10} textAnchor="middle" fill="#86efac" fontSize="12" fontFamily="monospace">= 16</text>
          </FadeGroup>

          {/* ── Square on c (orange, hypotenuse) ── */}
          <FadeGroup visible={showSqC}>
            <polygon
              points={toPolygon(sqCPoints)}
              fill="#f97316"
              fillOpacity={showFinal ? 0.6 : 0.35}
              stroke="#fb923c"
              strokeWidth="2.5"
              filter={showFinal ? "url(#glow-c)" : undefined}
              style={{ transition: "fill-opacity 0.5s" }}
            />
            <text x={cCx} y={cCy - 8} textAnchor="middle" fill="#fed7aa" fontSize="16" fontWeight="bold" fontFamily="monospace">c²</text>
            <text x={cCx} y={cCy + 10} textAnchor="middle" fill="#fdba74" fontSize="12" fontFamily="monospace">= 25</text>
          </FadeGroup>

          {/* ── Triangle (always on top) ── */}
          <FadeGroup visible={showTriangle}>
            <polygon
              points={`${RX},${RY} ${BX},${BY} ${AX},${AY}`}
              fill="#1e3a5f"
              fillOpacity="0.85"
              stroke="#7dd3fc"
              strokeWidth="2.5"
            />
            {/* Right angle mark */}
            <polyline
              points={`${RX},${RY - 12} ${RX + 12},${RY - 12} ${RX + 12},${RY}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Side labels */}
            <text x={AX - 18} y={(AY + RY) / 2 + 5} textAnchor="middle" fill="#60a5fa" fontSize="15" fontWeight="bold" fontFamily="monospace">a</text>
            <text x={(RX + BX) / 2} y={BY + 18} textAnchor="middle" fill="#4ade80" fontSize="15" fontWeight="bold" fontFamily="monospace">b</text>
            <text x={(AX + BX) / 2 + 18} y={(AY + BY) / 2 - 5} textAnchor="middle" fill="#fb923c" fontSize="15" fontWeight="bold" fontFamily="monospace">c</text>
            {/* Vertex labels */}
            <text x={RX - 14} y={RY + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace">C (90°)</text>
            <text x={BX + 4} y={BY + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace">B</text>
            <text x={AX - 10} y={AY - 6} fill="#94a3b8" fontSize="9" fontFamily="monospace">A</text>
          </FadeGroup>

          {/* ── Side value labels ── */}
          <FadeGroup visible={showSqA}>
            <text x={AX - 70} y={RY + 30} textAnchor="middle" fill="#3b82f6" fontSize="11" fontFamily="monospace">a = 3</text>
          </FadeGroup>
          <FadeGroup visible={showSqB}>
            <text x={(RX + BX) / 2} y={RY + 4 * SCALE + 28} textAnchor="middle" fill="#22c55e" fontSize="11" fontFamily="monospace">b = 4</text>
          </FadeGroup>
          <FadeGroup visible={showSqC}>
            <text x={BX + 3 * SCALE + 8} y={(BY + BY - 4 * SCALE) / 2 + 20} textAnchor="start" fill="#f97316" fontSize="11" fontFamily="monospace">c = 5</text>
          </FadeGroup>

          {/* ── Final equation banner ── */}
          <FadeGroup visible={showFinal} delay={0.3}>
            <rect
              x="100" y="1" width="340" height="44"
              rx="10"
              fill="#1e293b"
              fillOpacity="0.92"
              stroke="#eab308"
              strokeWidth="2"
              filter="url(#glow-eq)"
            />
            <text x="270" y="18" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold" fontFamily="monospace">
              a² + b² = c²
            </text>
            <text x="270" y="36" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily="monospace">
              9 + 16 = 25  ✓  Teorema Pythagoras Terbukti!
            </text>
          </FadeGroup>

          {/* ── Plus sign between a² and b² when final ── */}
          <FadeGroup visible={showFinal} delay={0.5}>
            <text x={(cAx + cBx) / 2} y={(cAy + cBy) / 2} textAnchor="middle" fill="#facc15" fontSize="28" fontWeight="bold" fontFamily="monospace" filter="url(#glow-eq)">+</text>
            <text x={cCx - 40} y={cCy - 5} textAnchor="middle" fill="#facc15" fontSize="28" fontWeight="bold" fontFamily="monospace" filter="url(#glow-eq)">=</text>
          </FadeGroup>
        </svg>
      </div>

      {/* Step description */}
      <div
        className="w-full max-w-lg rounded-lg px-4 py-3 text-center border transition-all duration-500"
        style={{
          background: "var(--bg-card)",
          borderColor: showFinal ? "rgba(234,179,8,0.6)" : "rgba(56,189,248,0.3)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{ color: showFinal ? "#fbbf24" : "#7dd3fc" }}>
          {STEPS[step].label}
        </p>
        <p className="text-sm text-white/80 font-body leading-relaxed">{STEPS[step].desc}</p>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => handleStep(i)}
            title={STEPS[i].label}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === step ? 28 : 10,
              height: 10,
              background: i <= step
                ? (i === step ? (showFinal ? "#fbbf24" : "#38bdf8") : "rgba(56,189,248,0.5)")
                : "rgba(100,116,139,0.4)",
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handlePlay}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: playing ? "rgba(239,68,68,0.2)" : "rgba(56,189,248,0.2)",
            border: `1.5px solid ${playing ? "rgba(239,68,68,0.6)" : "rgba(56,189,248,0.6)"}`,
            color: playing ? "#fca5a5" : "#7dd3fc",
          }}
        >
          {finished ? "🔄 Ulangi" : playing ? "⏸ Jeda" : step === 0 ? "▶ Mulai Animasi" : "▶ Lanjutkan"}
        </button>
        {step < STEPS.length - 1 && (
          <button
            onClick={advance}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(168,85,247,0.15)",
              border: "1.5px solid rgba(168,85,247,0.5)",
              color: "#d8b4fe",
            }}
          >
            Langkah Berikutnya →
          </button>
        )}
      </div>
    </div>
  );
};

export default PythagorasDiscoveryAnimation;
