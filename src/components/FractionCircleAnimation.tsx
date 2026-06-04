import { useState } from "react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
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
  shake?: boolean;
  pulse?: boolean;
}

function FractionCircle({ cx, cy, r, numerator, denominator, fillColor, dimColor, shake, pulse }: CircleProps) {
  return (
    <g style={{
      transform: shake ? undefined : undefined,
      animation: shake ? "shake 0.5s ease" : pulse ? "pulse-scale 0.6s ease" : undefined,
      transformOrigin: `${cx}px ${cy}px`,
    }}>
      {Array.from({ length: denominator }, (_, i) => (
        <path
          key={i}
          d={slicePath(cx, cy, r, denominator, i)}
          fill={i < numerator ? fillColor : dimColor}
          stroke="var(--icon-stroke)"
          strokeWidth="1.5"
          style={{ transition: "fill 0.6s ease, d 0.6s ease" }}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--icon-stroke)" strokeWidth="2" />
    </g>
  );
}

const PRESETS = [
  { label: "½ + ⅓", n1: 1, d1: 2, n2: 1, d2: 3, op: "+" },
  { label: "¾ + ⅙", n1: 3, d1: 4, n2: 1, d2: 6, op: "+" },
  { label: "⅔ − ¼", n1: 2, d1: 3, n2: 1, d2: 4, op: "-" },
  { label: "½ − ⅓", n1: 1, d1: 2, n2: 1, d2: 3, op: "-" },
  { label: "⅝ + ¼", n1: 5, d1: 8, n2: 1, d2: 4, op: "+" },
];

export default function FractionCircleAnimation() {
  const [preset, setPreset] = useState(0);
  const [step, setStep] = useState(0);
  const [shakeActive, setShakeActive] = useState(false);

  const { n1, d1, n2, d2, op } = PRESETS[preset];
  const common = lcm(d1, d2);
  const newN1 = n1 * (common / d1);
  const newN2 = n2 * (common / d2);
  const resNum = op === "+" ? newN1 + newN2 : newN1 - newN2;
  const resDen = common;
  const gcdRes = gcd(Math.abs(resNum), resDen);
  const simplNum = resNum / gcdRes;
  const simplDen = resDen / gcdRes;

  const isAlreadySame = d1 === d2;

  const CX1 = 80, CX2 = 250, CX3 = 420, CY = 90, R = 62;
  const FILL1 = "#e879f9";
  const DIM1 = "rgba(232,121,249,0.15)";
  const FILL2 = "#22d3ee";
  const DIM2 = "rgba(34,211,238,0.15)";
  const FILL_RES = "#a78bfa";
  const DIM_RES = "rgba(167,139,250,0.15)";

  const handlePreset = (i: number) => {
    playPopSound();
    setPreset(i);
    setStep(0);
    setShakeActive(false);
  };

  const handleNext = () => {
    playPopSound();
    if (step === 0) {
      if (isAlreadySame) {
        setStep(2);
      } else {
        setShakeActive(true);
        setTimeout(() => setShakeActive(false), 600);
        setStep(1);
      }
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleReset = () => {
    playPopSound();
    setStep(0);
    setShakeActive(false);
  };

  const stepLabel = ["Lihat kedua pecahan", "Mencoba digabung langsung...", "Samakan penyebut (KPK)", "Lihat hasilnya!"];
  const btnLabel = step === 0
    ? (isAlreadySame ? "✅ Langsung Gabungkan →" : "🤔 Coba Gabung Langsung →")
    : step === 1
    ? "🔑 Samakan Penyebut →"
    : step === 2
    ? `${op === "+" ? "➕" : "➖"} Gabungkan Sekarang →`
    : null;

  const den1Display = step >= 2 ? common : d1;
  const den2Display = step >= 2 ? common : d2;
  const num1Display = step >= 2 ? newN1 : n1;
  const num2Display = step >= 2 ? newN2 : n2;

  return (
    <div className="rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-slate-900/80 to-purple-950/50 backdrop-blur">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pulse-scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .shake-anim { animation: shake 0.5s ease; }
        .pulse-anim { animation: pulse-scale 0.6s ease; }
      `}</style>

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-center font-display text-sm font-bold text-purple-300 mb-1">
          🎯 Animasi Interaktif: Mengapa Penyebut Harus Disamakan?
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
                ? "bg-purple-500 border-purple-400 text-white"
                : "bg-slate-800 border-slate-600 text-white/60 hover:border-purple-400 hover:text-white"
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
              s === step ? "w-8 bg-purple-400" : s < step ? "w-4 bg-purple-600" : "w-4 bg-slate-600"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs font-body text-purple-300 mb-1 font-semibold">
        Langkah {step + 1}: {stepLabel[step]}
      </p>

      {/* SVG Visualization */}
      <div className="px-4">
        <svg viewBox="0 0 500 190" className="w-full" style={{ maxHeight: 220 }}>
          {/* Circle 1 */}
          <g className={shakeActive && step === 1 ? "shake-anim" : ""}>
            <FractionCircle cx={CX1} cy={CY} r={R} numerator={num1Display} denominator={den1Display} fillColor={FILL1} dimColor={DIM1} />
          </g>
          <text x={CX1} y={CY + R + 18} textAnchor="middle" fill="var(--icon-color)" fontSize="13" fontFamily="serif">
            {step >= 2 ? `${newN1}/${common}` : `${n1}/${d1}`}
          </text>
          {step >= 2 && !isAlreadySame && (
            <text x={CX1} y={CY + R + 32} textAnchor="middle" fill="#e879f9" fontSize="10" fontFamily="serif">
              ({n1}/{d1} × {common / d1}/{common / d1})
            </text>
          )}

          {/* Operator */}
          <text x="165" y={CY + 8} textAnchor="middle" fill="var(--icon-color)" fontSize="28" fontWeight="bold" fontFamily="sans-serif">
            {op}
          </text>

          {/* Circle 2 */}
          <g className={shakeActive && step === 1 ? "shake-anim" : ""} style={{ animationDelay: "0.1s" }}>
            <FractionCircle cx={CX2} cy={CY} r={R} numerator={num2Display} denominator={den2Display} fillColor={FILL2} dimColor={DIM2} />
          </g>
          <text x={CX2} y={CY + R + 18} textAnchor="middle" fill="var(--icon-color)" fontSize="13" fontFamily="serif">
            {step >= 2 ? `${newN2}/${common}` : `${n2}/${d2}`}
          </text>
          {step >= 2 && !isAlreadySame && (
            <text x={CX2} y={CY + R + 32} textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="serif">
              ({n2}/{d2} × {common / d2}/{common / d2})
            </text>
          )}

          {/* Equals */}
          <text x="335" y={CY + 8} textAnchor="middle" fill={step >= 3 ? "white" : "rgba(255,255,255,0.2)"} fontSize="28" fontWeight="bold" fontFamily="sans-serif">
            =
          </text>

          {/* Result Circle */}
          {step >= 3 ? (
            <g className="pulse-anim">
              <FractionCircle cx={CX3} cy={CY} r={R} numerator={resNum} denominator={resDen} fillColor={FILL_RES} dimColor={DIM_RES} pulse />
              <text x={CX3} y={CY + R + 18} textAnchor="middle" fill="var(--icon-color)" fontSize="13" fontFamily="serif">
                {resNum}/{resDen}
                {gcdRes > 1 ? ` = ${simplNum}/${simplDen}` : ""}
              </text>
            </g>
          ) : (
            <>
              <circle cx={CX3} cy={CY} r={R} fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
              <text x={CX3} y={CY + 5} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="22" fontFamily="serif">?</text>
            </>
          )}
        </svg>
      </div>

      {/* Message boxes per step */}
      <div className="px-4 pb-2 min-h-[64px]">
        {step === 0 && (
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl px-4 py-3 text-center">
            <p className="text-white/80 text-xs font-body leading-relaxed">
              Ini adalah <span className="text-pink-400 font-semibold">{n1}/{d1}</span> dan <span className="text-cyan-400 font-semibold">{n2}/{d2}</span>.
              Perhatikan <strong className="text-white">ukuran potongannya berbeda</strong> karena penyebutnya berbeda ({d1} vs {d2}).
            </p>
          </div>
        )}
        {step === 1 && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-center">
            <p className="text-red-300 text-xs font-body leading-relaxed font-semibold">
              ❌ Tidak bisa! Ukuran potongannya berbeda.
            </p>
            <p className="text-white/70 text-xs font-body mt-1">
              Seperti mencoba menjumlahkan irisan pizza berukuran ½ dengan irisan kue berukuran ⅓ — potongannya tidak sama, jadi kita tidak bisa langsung menggabungkan jumlahnya!
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-yellow-300 text-xs font-body font-semibold mb-1">
              ✅ KPK dari {d1} dan {d2} = {common}
            </p>
            <p className="text-white/70 text-xs font-body">
              Sekarang kedua lingkaran dibagi menjadi <strong className="text-yellow-300">{common} potongan sama besar</strong>.
              {!isAlreadySame && (
                <span> <span className="text-pink-400">{n1}/{d1} = {newN1}/{common}</span> dan <span className="text-cyan-400">{n2}/{d2} = {newN2}/{common}</span> — potongannya sudah sama!</span>
              )}
            </p>
          </div>
        )}
        {step === 3 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 text-center">
            <p className="text-purple-300 text-xs font-body font-semibold mb-1">
              🎉 Hasil: {newN1} {op} {newN2} = {resNum} potongan dari {resDen}
            </p>
            <div className="text-xs text-white/70 font-body">
              <InlineMath math={`\\frac{${newN1}}{${common}} ${op === "+" ? "+" : "-"} \\frac{${newN2}}{${common}} = \\frac{${resNum}}{${resDen}}${gcdRes > 1 ? ` = \\frac{${simplNum}}{${simplDen}}` : ""}`} />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 px-4 pb-4">
        {btnLabel && (
          <button
            onClick={handleNext}
            className="text-xs px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-body font-semibold transition-all cursor-pointer shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95"
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
