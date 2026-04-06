import { useState } from "react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, total: number, idx: number): string {
  if (total === 1) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }
  const a0 = (idx / total) * 360;
  const a1 = ((idx + 1) / total) * 360;
  const s = polarToXY(cx, cy, r, a0);
  const e = polarToXY(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)} Z`;
}

interface CircleProps {
  cx: number;
  cy: number;
  r: number;
  numerator: number;
  denominator: number;
  fillColor: string;
  dimColor: string;
  glowColor?: string;
  pulse?: boolean;
  flip?: boolean;
}

function FractionCircle({ cx, cy, r, numerator, denominator, fillColor, dimColor, glowColor, pulse, flip }: CircleProps) {
  return (
    <g style={{
      animation: pulse ? "pulse-scale-div 0.6s ease" : flip ? "flip-circle 0.5s ease" : undefined,
      transformOrigin: `${cx}px ${cy}px`,
    }}>
      {glowColor && (
        <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={glowColor} strokeWidth="3" opacity="0.4"
          style={{ animation: "glow-ring-div 1s ease infinite alternate" }} />
      )}
      {Array.from({ length: denominator }, (_, i) => (
        <path
          key={i}
          d={slicePath(cx, cy, r, denominator, i)}
          fill={i < numerator ? fillColor : dimColor}
          stroke="white"
          strokeWidth="1.5"
          style={{ transition: "fill 0.5s ease" }}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="2" />
    </g>
  );
}

const PRESETS = [
  { label: "½ ÷ ¼", n1: 1, d1: 2, n2: 1, d2: 4 },
  { label: "¾ ÷ ½", n1: 3, d1: 4, n2: 1, d2: 2 },
  { label: "⅔ ÷ ⅓", n1: 2, d1: 3, n2: 1, d2: 3 },
  { label: "⅗ ÷ ⅕", n1: 3, d1: 5, n2: 1, d2: 5 },
  { label: "½ ÷ ⅓", n1: 1, d1: 2, n2: 1, d2: 3 },
];

const STEPS = [
  "Lihat kedua pecahan",
  "Balik pecahan pembagi!",
  "Ubah ÷ menjadi ×",
  "Lihat hasilnya!",
];

export default function FractionDivisionAnimation() {
  const [preset, setPreset] = useState(0);
  const [step, setStep] = useState(0);
  const [flipActive, setFlipActive] = useState(false);

  const { n1, d1, n2, d2 } = PRESETS[preset];

  // After flip: reciprocal of divider
  const flippedN = d2;
  const flippedD = n2;

  // Result: a/b × d/c
  const resNum = n1 * flippedN;
  const resDen = d1 * flippedD;
  const g = gcd(resNum, resDen);
  const simplNum = resNum / g;
  const simplDen = resDen / g;
  const isSimplified = g > 1;

  // Display values for circle 2
  const circ2N = step >= 1 ? flippedN : n2;
  const circ2D = step >= 1 ? flippedD : d2;

  const CX1 = 75, CX2 = 245, CX3 = 415, CY = 88, R = 60;
  const FILL1 = "#e879f9";
  const DIM1 = "rgba(232,121,249,0.12)";
  const FILL2 = "#f97316";
  const DIM2 = "rgba(249,115,22,0.12)";
  const FILL_RES = "#a78bfa";
  const DIM_RES = "rgba(167,139,250,0.12)";

  const handlePreset = (i: number) => {
    playPopSound();
    setPreset(i);
    setStep(0);
    setFlipActive(false);
  };

  const handleNext = () => {
    playPopSound();
    if (step === 0) {
      setFlipActive(true);
      setTimeout(() => setFlipActive(false), 600);
      setStep(1);
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    playPopSound();
    setStep(0);
    setFlipActive(false);
  };

  const btnLabel = step === 0
    ? "🔄 Balik Pecahan Pembagi →"
    : step === 1
    ? "✖️ Ubah ke Perkalian →"
    : step === 2
    ? "🎯 Lihat Hasil →"
    : null;

  // Operator display
  const operatorText = step >= 2 ? "×" : "÷";
  const operatorColor = step >= 2 ? "white" : "white";

  return (
    <div className="rounded-2xl overflow-hidden border border-orange-500/30 bg-gradient-to-br from-slate-900/80 to-orange-950/40 backdrop-blur">
      <style>{`
        @keyframes pulse-scale-div {
          0% { transform: scale(1); }
          50% { transform: scale(1.09); }
          100% { transform: scale(1); }
        }
        @keyframes glow-ring-div {
          0% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
        @keyframes flip-circle {
          0%   { transform: scaleX(1); }
          50%  { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-center font-display text-sm font-bold text-orange-300 mb-1">
          🎯 Animasi Interaktif: Cara Kerja Pembagian Pecahan
        </p>
        <p className="text-center text-xs text-white/50 font-body">
          Pilih contoh pecahan, lalu ikuti langkah-langkahnya!
        </p>
      </div>

      {/* Preset selector */}
      <div className="flex flex-wrap gap-2 justify-center px-4 py-2">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePreset(i)}
            className={`text-xs px-3 py-1.5 rounded-full border font-body font-semibold transition-all cursor-pointer ${
              preset === i
                ? "bg-orange-600 border-orange-400 text-white"
                : "bg-slate-800 border-slate-600 text-white/60 hover:border-orange-400 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-1.5 py-2">
        {[0, 1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              s === step ? "w-8 bg-orange-400" : s < step ? "w-4 bg-orange-700" : "w-4 bg-slate-600"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs font-body text-orange-300 mb-1 font-semibold">
        Langkah {step + 1}: {STEPS[step]}
      </p>

      {/* SVG Visualization */}
      <div className="px-4">
        <svg viewBox="0 0 490 230" className="w-full" style={{ maxHeight: 260 }}>

          {/* Circle 1 — stays unchanged */}
          <FractionCircle
            cx={CX1} cy={CY} r={R}
            numerator={n1} denominator={d1}
            fillColor={FILL1} dimColor={DIM1}
          />
          <text x={CX1} y={CY + R + 18} textAnchor="middle" fill="white" fontSize="13" fontFamily="serif">
            {n1}/{d1}
          </text>
          <text x={CX1} y={CY + R + 33} textAnchor="middle" fill="#e879f9" fontSize="10" fontFamily="serif">
            {step >= 1 ? `pembilang: ${n1}` : "yang dibagi"}
          </text>

          {/* Operator */}
          <text x="160" y={CY + 8} textAnchor="middle" fill={step >= 2 ? "#86efac" : "#fb923c"}
            fontSize="26" fontWeight="bold" fontFamily="sans-serif"
            style={{ transition: "fill 0.4s ease" }}>
            {operatorText}
          </text>

          {/* Circle 2 — flips at step 1 */}
          <g style={{
            animation: flipActive ? "flip-circle 0.5s ease" : undefined,
            transformOrigin: `${CX2}px ${CY}px`,
          }}>
            <FractionCircle
              cx={CX2} cy={CY} r={R}
              numerator={circ2N} denominator={circ2D}
              fillColor={FILL2} dimColor={DIM2}
              glowColor={step === 1 ? "#f97316" : undefined}
            />
          </g>
          <text x={CX2} y={CY + R + 18} textAnchor="middle" fill="white" fontSize="13" fontFamily="serif">
            {circ2N}/{circ2D}
          </text>

          {/* Sub-label circle 2 */}
          {step === 0 && (
            <text x={CX2} y={CY + R + 33} textAnchor="middle" fill="#fb923c" fontSize="10" fontFamily="serif">
              pembagi
            </text>
          )}
          {step === 1 && (
            <text x={CX2} y={CY + R + 33} textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="serif">
              dibalik! {n2}/{d2} → {d2}/{n2}
            </text>
          )}
          {step >= 2 && (
            <text x={CX2} y={CY + R + 33} textAnchor="middle" fill="#86efac" fontSize="10" fontFamily="serif">
              penyebut: {circ2D}
            </text>
          )}

          {/* = sign */}
          <text x="330" y={CY + 8} textAnchor="middle"
            fill={step >= 3 ? "white" : "rgba(255,255,255,0.2)"}
            fontSize="28" fontWeight="bold" fontFamily="sans-serif">
            =
          </text>

          {/* Result Circle */}
          {step >= 3 ? (
            <g style={{ animation: "pulse-scale-div 0.6s ease", transformOrigin: `${CX3}px ${CY}px` }}>
              <FractionCircle
                cx={CX3} cy={CY} r={R}
                numerator={simplNum} denominator={simplDen}
                fillColor={FILL_RES} dimColor={DIM_RES}
                glowColor="#a78bfa"
              />
              <text x={CX3} y={CY + R + 18} textAnchor="middle" fill="white" fontSize="12" fontFamily="serif">
                {resNum}/{resDen}
              </text>
              {isSimplified && (
                <text x={CX3} y={CY + R + 33} textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="serif">
                  = {simplNum}/{simplDen}
                </text>
              )}
            </g>
          ) : (
            <>
              <circle cx={CX3} cy={CY} r={R} fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
              <text x={CX3} y={CY + 5} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="22" fontFamily="serif">?</text>
            </>
          )}

          {/* Step 1: flip reminder */}
          {step === 1 && (
            <g>
              <rect x="80" y="192" width="330" height="28" rx="8" fill="rgba(249,115,22,0.15)" stroke="#f97316" strokeWidth="1"/>
              <text x="245" y="211" textAnchor="middle" fill="#f97316" fontSize="12" fontFamily="serif">
                Pembagi dibalik: {n2}/{d2} menjadi {d2}/{n2}
              </text>
            </g>
          )}

          {/* Step 2: now it's multiplication */}
          {step === 2 && (
            <g>
              <rect x="80" y="192" width="330" height="28" rx="8" fill="rgba(134,239,172,0.12)" stroke="#86efac" strokeWidth="1"/>
              <text x="245" y="211" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily="serif">
                {n1}/{d1} ÷ {n2}/{d2} = {n1}/{d1} × {d2}/{n2}
              </text>
            </g>
          )}

          {/* Step 3: full result */}
          {step === 3 && (
            <g>
              <rect x="80" y="192" width="330" height="28" rx="8" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1"/>
              <text x="245" y="211" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="serif">
                {n1}/{d1} × {d2}/{n2} = {resNum}/{resDen}{isSimplified ? ` = ${simplNum}/${simplDen}` : ""}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Message boxes per step */}
      <div className="px-4 pb-2 min-h-[72px]">
        {step === 0 && (
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl px-4 py-3 text-center">
            <p className="text-white/80 text-xs font-body leading-relaxed">
              Ini adalah <span className="text-pink-400 font-semibold">{n1}/{d1}</span> (yang dibagi) dan{" "}
              <span className="text-orange-400 font-semibold">{n2}/{d2}</span> (pembagi).{" "}
              Rahasia pembagian pecahan: <strong className="text-white">balik pembagi, lalu kalikan!</strong>
            </p>
          </div>
        )}
        {step === 1 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-orange-300 text-xs font-body font-semibold mb-1">
              🔄 Pecahan pembagi dibalik (diresiprokkan)!
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`\\frac{${n2}}{${d2}} \\rightarrow \\frac{${d2}}{${n2}}`} />
              <span className="mx-2 text-white/40">→</span>
              <span className="text-orange-300">pembilang & penyebut ditukar posisinya</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-green-300 text-xs font-body font-semibold mb-1">
              ✖️ Tanda ÷ berubah menjadi ×
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}} = \\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}}`} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-purple-300 text-xs font-body font-semibold mb-1">
              🎉 Hasil pembagian pecahan:
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}} = \\frac{${n1} \\times ${d2}}{${d1} \\times ${n2}} = \\frac{${resNum}}{${resDen}}${isSimplified ? ` = \\frac{${simplNum}}{${simplDen}}` : ""}`} />
            </div>
            {isSimplified && (
              <p className="text-yellow-300 text-xs font-body mt-1">✨ Disederhanakan dengan GCD = {g}</p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 px-4 pb-4">
        {btnLabel && (
          <button
            onClick={handleNext}
            className="text-xs px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-body font-semibold transition-all cursor-pointer shadow-lg shadow-orange-900/40 hover:scale-105 active:scale-95"
          >
            {btnLabel}
          </button>
        )}
        {step > 0 && (
          <button
            onClick={handleReset}
            className="text-xs px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white/70 font-body transition-all cursor-pointer hover:text-white"
          >
            🔄 Ulangi
          </button>
        )}
      </div>
    </div>
  );
}
