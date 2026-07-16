import { useState } from "react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

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
  pulse?: boolean;
  glowColor?: string;
}

function FractionCircle({ cx, cy, r, numerator, denominator, fillColor, dimColor, pulse, glowColor }: CircleProps) {
  return (
    <g style={{
      animation: pulse ? "pulse-scale-mul 0.6s ease" : undefined,
      transformOrigin: `${cx}px ${cy}px`,
    }}>
      {glowColor && (
        <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={glowColor} strokeWidth="3" opacity="0.4"
          style={{ animation: "glow-ring 1s ease infinite alternate" }} />
      )}
      {Array.from({ length: denominator }, (_, i) => (
        <path
          key={i}
          d={slicePath(cx, cy, r, denominator, i)}
          fill={i < numerator ? fillColor : dimColor}
          stroke="var(--icon-stroke)"
          strokeWidth="1.5"
          style={{ transition: "fill 0.5s ease" }}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--icon-stroke)" strokeWidth="2" />
    </g>
  );
}

const PRESETS = [
  { label: "½ × ⅓", n1: 1, d1: 2, n2: 1, d2: 3 },
  { label: "¾ × ⅔", n1: 3, d1: 4, n2: 2, d2: 3 },
  { label: "⅔ × ½", n1: 2, d1: 3, n2: 1, d2: 2 },
  { label: "¾ × ½", n1: 3, d1: 4, n2: 1, d2: 2 },
  { label: "⅗ × ⅔", n1: 3, d1: 5, n2: 2, d2: 3 },
];

const STEPS = [
  "Lihat kedua pecahan",
  "Kalikan pembilang × pembilang",
  "Kalikan penyebut × penyebut",
  "Lihat hasilnya!",
];

export default function FractionMultiplicationAnimation() {
  const { isDark } = useTheme();
  const [preset, setPreset] = useState(0);
  const [step, setStep] = useState(0);

  const { n1, d1, n2, d2 } = PRESETS[preset];
  const resNum = n1 * n2;
  const resDen = d1 * d2;
  const g = gcd(resNum, resDen);
  const simplNum = resNum / g;
  const simplDen = resDen / g;
  const isSimplified = g > 1;

  const CX1 = 75, CX2 = 245, CX3 = 415, CY = 88, R = 60;
  const FILL1 = "#e879f9";
  const DIM1 = "rgba(232,121,249,0.12)";
  const FILL2 = "#22d3ee";
  const DIM2 = "rgba(34,211,238,0.12)";
  const FILL_RES = "#a78bfa";
  const DIM_RES = "rgba(167,139,250,0.12)";

  const handlePreset = (i: number) => {
    playPopSound();
    setPreset(i);
    setStep(0);
  };

  const handleNext = () => {
    playPopSound();
    if (step < 3) setStep(step + 1);
  };

  const handleReset = () => {
    playPopSound();
    setStep(0);
  };

  const btnLabel = step === 0
    ? "✖️ Kalikan Pembilang →"
    : step === 1
    ? "✖️ Kalikan Penyebut →"
    : step === 2
    ? "🎯 Lihat Hasil →"
    : null;

  return (
    <div className={`rounded-2xl overflow-hidden border border-cyan-500/30 backdrop-blur ${isDark ? "bg-gradient-to-br from-slate-900/80 to-cyan-950/50" : "bg-white/90"}`}>
      <style>{`
        @keyframes pulse-scale-mul {
          0% { transform: scale(1); }
          50% { transform: scale(1.09); }
          100% { transform: scale(1); }
        }
        @keyframes glow-ring {
          0% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
        @keyframes bounce-num {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-center font-display text-sm font-bold text-cyan-300 mb-1">
          🎯 Animasi Interaktif: Cara Kerja Perkalian Pecahan
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
                ? "bg-cyan-600 border-cyan-400 text-white"
                : isDark ? "bg-slate-800 border-slate-600 text-white/60 hover:border-cyan-400 hover:text-white" : "bg-slate-100 border-slate-300 text-slate-500 hover:border-cyan-500 hover:text-slate-800"
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
              s === step ? "w-8 bg-cyan-400" : s < step ? "w-4 bg-cyan-500" : `w-4 ${isDark ? "bg-slate-600" : "bg-slate-300"}`
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs font-body text-cyan-300 mb-1 font-semibold">
        Langkah {step + 1}: {STEPS[step]}
      </p>

      {/* SVG Visualization */}
      <div className="px-4">
        <svg viewBox="0 0 490 230" className="w-full" style={{ maxHeight: 260 }}>

          {/* Circle 1 */}
          <FractionCircle
            cx={CX1} cy={CY} r={R}
            numerator={n1} denominator={d1}
            fillColor={FILL1} dimColor={DIM1}
            glowColor={step === 1 ? "#e879f9" : undefined}
          />
          <text x={CX1} y={CY + R + 18} textAnchor="middle" fill="var(--icon-color)" fontSize="13" fontFamily="serif">
            {n1}/{d1}
          </text>

          {/* Sub-label circle 1 */}
          {step === 1 && (
            <text x={CX1} y={CY + R + 33} textAnchor="middle" fill="#e879f9" fontSize="10" fontFamily="serif">
              pembilang: {n1}
            </text>
          )}
          {step === 2 && (
            <text x={CX1} y={CY + R + 33} textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="serif">
              penyebut: {d1}
            </text>
          )}

          {/* × operator */}
          <text x="160" y={CY + 8} textAnchor="middle" fill="var(--icon-color)" fontSize="28" fontWeight="bold" fontFamily="sans-serif">×</text>

          {/* Circle 2 */}
          <FractionCircle
            cx={CX2} cy={CY} r={R}
            numerator={n2} denominator={d2}
            fillColor={FILL2} dimColor={DIM2}
            glowColor={step === 2 ? "#22d3ee" : undefined}
          />
          <text x={CX2} y={CY + R + 18} textAnchor="middle" fill="var(--icon-color)" fontSize="13" fontFamily="serif">
            {n2}/{d2}
          </text>

          {/* Sub-label circle 2 */}
          {step === 1 && (
            <text x={CX2} y={CY + R + 33} textAnchor="middle" fill="#e879f9" fontSize="10" fontFamily="serif">
              pembilang: {n2}
            </text>
          )}
          {step === 2 && (
            <text x={CX2} y={CY + R + 33} textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="serif">
              penyebut: {d2}
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
            <g style={{ animation: "pulse-scale-mul 0.6s ease", transformOrigin: `${CX3}px ${CY}px` }}>
              <FractionCircle
                cx={CX3} cy={CY} r={R}
                numerator={resNum} denominator={resDen}
                fillColor={FILL_RES} dimColor={DIM_RES}
                glowColor="#a78bfa"
              />
              <text x={CX3} y={CY + R + 18} textAnchor="middle" fill="var(--icon-color)" fontSize="12" fontFamily="serif">
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

          {/* Step 1: formula box — numerator multiplication */}
          {step === 1 && (
            <g>
              <rect x="100" y="192" width="290" height="28" rx="8" fill="rgba(232,121,249,0.15)" stroke="#e879f9" strokeWidth="1"/>
              <text x="245" y="211" textAnchor="middle" fill="#e879f9" fontSize="12" fontFamily="serif">
                Pembilang: {n1} × {n2} = {n1 * n2}
              </text>
            </g>
          )}

          {/* Step 2: formula box — denominator multiplication */}
          {step === 2 && (
            <g>
              <rect x="100" y="192" width="290" height="28" rx="8" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
              <text x="245" y="211" textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="serif">
                Penyebut: {d1} × {d2} = {d1 * d2}
              </text>
            </g>
          )}

          {/* Step 3: formula box — full result */}
          {step === 3 && (
            <g>
              <rect x="80" y="192" width="330" height="28" rx="8" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1"/>
              <text x="245" y="211" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="serif">
                {n1}/{d1} × {n2}/{d2} = {resNum}/{resDen}{isSimplified ? ` = ${simplNum}/${simplDen}` : ""}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Message boxes per step */}
      <div className="px-4 pb-2 min-h-[68px]">
        {step === 0 && (
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl px-4 py-3 text-center">
            <p className="text-white/80 text-xs font-body leading-relaxed">
              Ini adalah <span className="text-pink-400 font-semibold">{n1}/{d1}</span> dan <span className="text-cyan-400 font-semibold">{n2}/{d2}</span>.{" "}
              Perkalian pecahan <strong className="text-white">tidak perlu menyamakan penyebut</strong> — cukup kalikan langsung!
            </p>
          </div>
        )}
        {step === 1 && (
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-pink-300 text-xs font-body font-semibold mb-1">
              ✖️ Pembilang dikalikan pembilang
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`${n1} \\times ${n2} = ${n1 * n2}`} />
              <span className="mx-2">→</span>
              <span className="text-pink-300 font-semibold">Pembilang hasil = {n1 * n2}</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-cyan-300 text-xs font-body font-semibold mb-1">
              ✖️ Penyebut dikalikan penyebut
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`${d1} \\times ${d2} = ${d1 * d2}`} />
              <span className="mx-2">→</span>
              <span className="text-cyan-300 font-semibold">Penyebut hasil = {d1 * d2}</span>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-purple-300 text-xs font-body font-semibold mb-1">
              🎉 Hasil perkalian pecahan:
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`\\frac{${n1}}{${d1}} \\times \\frac{${n2}}{${d2}} = \\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${resNum}}{${resDen}}${isSimplified ? ` = \\frac{${simplNum}}{${simplDen}}` : ""}`} />
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
            className="text-xs px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-body font-semibold transition-all cursor-pointer shadow-lg shadow-cyan-900/40 hover:scale-105 active:scale-95"
          >
            {btnLabel}
          </button>
        )}
        {step > 0 && (
          <button
            onClick={handleReset}
            className={`text-xs px-4 py-2.5 rounded-xl font-body transition-all cursor-pointer ${isDark ? "bg-slate-700 hover:bg-slate-600 text-white/70 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"}`}
          >
            🔄 Ulangi
          </button>
        )}
      </div>
    </div>
  );
}
