import { useState } from "react";
import { RotateCcw, ChevronRight } from "lucide-react";

type ScaleItem = {
  label: string;
  bg: string;
  text: string;
};

type Step = {
  title: string;
  equation: string;
  description: string;
  leftItems: ScaleItem[];
  rightItems: ScaleItem[];
  tilt: number;
  isBalanced: boolean;
  hint?: string;
};

const STEPS: Step[] = [
  {
    title: "Persamaan Awal",
    equation: "x − 7 = 3",
    description:
      "Timbangan seimbang karena persamaan x − 7 = 3 benar untuk nilai tertentu. Ruas kiri = Ruas kanan.",
    leftItems: [
      { label: "x", bg: "bg-cyan-400", text: "text-slate-900" },
      { label: "−7", bg: "bg-red-400", text: "text-white" },
    ],
    rightItems: [{ label: "3", bg: "bg-green-400", text: "text-slate-900" }],
    tilt: 0,
    isBalanced: true,
    hint: "Klik tombol di bawah untuk melihat apa yang terjadi jika kita hanya menambahkan ke satu sisi!",
  },
  {
    title: "Tambah +7 ke Ruas Kiri Saja ❌",
    equation: "(x − 7 + 7) ≠ 3",
    description:
      "Timbangan menjadi TIDAK SEIMBANG! Jika kita hanya menambah ke satu sisi, persamaan rusak.",
    leftItems: [
      { label: "x", bg: "bg-cyan-400", text: "text-slate-900" },
      { label: "−7", bg: "bg-red-400", text: "text-white" },
      { label: "+7", bg: "bg-yellow-400", text: "text-slate-900" },
    ],
    rightItems: [{ label: "3", bg: "bg-green-400", text: "text-slate-900" }],
    tilt: -1,
    isBalanced: false,
    hint: "Agar seimbang, kita harus menambahkan +7 ke kedua ruas!",
  },
  {
    title: "Tambah +7 ke Kedua Ruas ✓",
    equation: "(x − 7 + 7) = (3 + 7)",
    description:
      "Timbangan tetap SEIMBANG! Menambahkan nilai yang sama ke kedua ruas tidak mengubah keseimbangan persamaan.",
    leftItems: [
      { label: "x", bg: "bg-cyan-400", text: "text-slate-900" },
      { label: "−7", bg: "bg-red-400", text: "text-white" },
      { label: "+7", bg: "bg-yellow-400", text: "text-slate-900" },
    ],
    rightItems: [
      { label: "3", bg: "bg-green-400", text: "text-slate-900" },
      { label: "+7", bg: "bg-yellow-400", text: "text-slate-900" },
    ],
    tilt: 0,
    isBalanced: true,
    hint: "Sekarang sederhanakan: −7 + 7 = 0 (saling meniadakan), dan 3 + 7 = 10.",
  },
  {
    title: "Hasil Akhir 🎉",
    equation: "x = 10",
    description:
      "Setelah −7 dan +7 saling meniadakan di ruas kiri, kita dapat nilai x = 10. Timbangan tetap seimbang!",
    leftItems: [{ label: "x", bg: "bg-cyan-400", text: "text-slate-900" }],
    rightItems: [
      { label: "10", bg: "bg-green-400", text: "text-slate-900" },
    ],
    tilt: 0,
    isBalanced: true,
  },
];

const BEAM_WIDTH = 220;
const BEAM_Y = 72;
const CENTER_X = 150;
const PAN_Y_OFFSET = 56;

function ScaleSVG({ tilt }: { tilt: number }) {
  const angle = tilt * 16;

  const leftEndX = CENTER_X - BEAM_WIDTH / 2;
  const leftEndY = BEAM_Y;
  const rightEndX = CENTER_X + BEAM_WIDTH / 2;
  const rightEndY = BEAM_Y;

  const rad = (angle * Math.PI) / 180;
  const rotLeft = {
    x: CENTER_X + (leftEndX - CENTER_X) * Math.cos(rad) - (leftEndY - BEAM_Y) * Math.sin(rad),
    y: BEAM_Y + (leftEndX - CENTER_X) * Math.sin(rad) + (leftEndY - BEAM_Y) * Math.cos(rad),
  };
  const rotRight = {
    x: CENTER_X + (rightEndX - CENTER_X) * Math.cos(rad) - (rightEndY - BEAM_Y) * Math.sin(rad),
    y: BEAM_Y + (rightEndX - CENTER_X) * Math.sin(rad) + (rightEndY - BEAM_Y) * Math.cos(rad),
  };

  const leftPanY = rotLeft.y + PAN_Y_OFFSET;
  const rightPanY = rotRight.y + PAN_Y_OFFSET;

  const beamColor = tilt === 0 ? "#22d3ee" : "#f87171";
  const glowColor = tilt === 0 ? "rgba(34,211,238,0.4)" : "rgba(248,113,113,0.4)";

  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full max-w-xs mx-auto"
      style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
    >
      <defs>
        <linearGradient id="poleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="panGradL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tilt === 0 ? "#164e63" : tilt === -1 ? "#7f1d1d" : "#1e3a5f"} />
          <stop offset="100%" stopColor={tilt === 0 ? "#0e7490" : tilt === -1 ? "#dc2626" : "#1d4ed8"} />
        </linearGradient>
        <linearGradient id="panGradR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tilt === 0 ? "#14532d" : tilt === 1 ? "#7f1d1d" : "#14532d"} />
          <stop offset="100%" stopColor={tilt === 0 ? "#16a34a" : tilt === 1 ? "#dc2626" : "#16a34a"} />
        </linearGradient>
      </defs>

      {/* Base */}
      <polygon
        points={`${CENTER_X - 6},185 ${CENTER_X + 6},185 ${CENTER_X + 24},175 ${CENTER_X - 24},175`}
        fill="url(#poleGrad)"
        rx="2"
      />
      {/* Pole */}
      <rect x={CENTER_X - 3} y={BEAM_Y} width={6} height={175 - BEAM_Y} fill="url(#poleGrad)" rx="3" />
      {/* Pivot circle */}
      <circle cx={CENTER_X} cy={BEAM_Y} r={8} fill="#94a3b8" stroke="#cbd5e1" strokeWidth={1.5} />

      {/* Beam */}
      <line
        x1={rotLeft.x}
        y1={rotLeft.y}
        x2={rotRight.x}
        y2={rotRight.y}
        stroke={beamColor}
        strokeWidth={5}
        strokeLinecap="round"
        style={{ transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      />

      {/* Left chain */}
      <line
        x1={rotLeft.x}
        y1={rotLeft.y}
        x2={rotLeft.x}
        y2={leftPanY - 10}
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeDasharray="3,2"
        style={{ transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      {/* Right chain */}
      <line
        x1={rotRight.x}
        y1={rotRight.y}
        x2={rotRight.x}
        y2={rightPanY - 10}
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeDasharray="3,2"
        style={{ transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      />

      {/* Left Pan */}
      <ellipse
        cx={rotLeft.x}
        cy={leftPanY}
        rx={30}
        ry={8}
        fill="url(#panGradL)"
        stroke={tilt === -1 ? "#f87171" : "#22d3ee"}
        strokeWidth={1.5}
        style={{ transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      {/* Right Pan */}
      <ellipse
        cx={rotRight.x}
        cy={rightPanY}
        rx={30}
        ry={8}
        fill="url(#panGradR)"
        stroke={tilt === 1 ? "#f87171" : "#22d3ee"}
        strokeWidth={1.5}
        style={{ transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      />

      {/* Balance indicator */}
      {tilt === 0 ? (
        <text x={CENTER_X} y={196} textAnchor="middle" fontSize="11" fill="#22d3ee" fontWeight="bold">
          ⚖ SEIMBANG
        </text>
      ) : (
        <text x={CENTER_X} y={196} textAnchor="middle" fontSize="11" fill="#f87171" fontWeight="bold">
          ✗ TIDAK SEIMBANG
        </text>
      )}
    </svg>
  );
}

export default function BalanceScaleAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };

  const handleReset = () => setStepIndex(0);

  return (
    <div className="rounded-xl border border-green-500/30 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">⚖️</span>
        <span className="font-body font-semibold text-green-300 text-sm">
          Simulasi Timbangan Persamaan
        </span>
        <span className="ml-auto text-xs text-white/40 font-body">
          Langkah {stepIndex + 1} / {STEPS.length}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Step progress dots */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? "w-6 bg-green-400"
                  : i < stepIndex
                  ? "w-2 bg-green-600"
                  : "w-2 bg-slate-600"
              }`}
            />
          ))}
        </div>

        {/* Equation display */}
        <div
          className={`text-center font-mono text-base font-bold py-2 px-4 rounded-lg transition-colors duration-500 ${
            step.isBalanced
              ? "bg-green-500/15 text-green-300 border border-green-500/30"
              : "bg-red-500/15 text-red-300 border border-red-500/30"
          }`}
        >
          {step.equation}
        </div>

        {/* Scale SVG */}
        <div className="py-2">
          <ScaleSVG tilt={step.tilt} />
        </div>

        {/* Pan labels */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left pan items */}
          <div className="space-y-1">
            <p className="text-xs text-white/40 font-body text-center">Ruas Kiri</p>
            <div className="flex flex-wrap gap-1 justify-center min-h-[36px] items-center">
              {step.leftItems.map((item, i) => (
                <span
                  key={i}
                  className={`${item.bg} ${item.text} text-xs font-bold px-2 py-1 rounded-lg shadow font-mono transition-all duration-500`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          {/* Right pan items */}
          <div className="space-y-1">
            <p className="text-xs text-white/40 font-body text-center">Ruas Kanan</p>
            <div className="flex flex-wrap gap-1 justify-center min-h-[36px] items-center">
              {step.rightItems.map((item, i) => (
                <span
                  key={i}
                  className={`${item.bg} ${item.text} text-xs font-bold px-2 py-1 rounded-lg shadow font-mono transition-all duration-500`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step title & description */}
        <div
          className={`rounded-lg p-3 transition-colors duration-500 ${
            step.isBalanced
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          <p
            className={`font-body font-semibold text-sm mb-1 ${
              step.isBalanced ? "text-green-300" : "text-red-300"
            }`}
          >
            {step.title}
          </p>
          <p className="font-body text-xs text-white/70 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Hint */}
        {step.hint && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="font-body text-xs text-yellow-200 leading-relaxed">
              💡 {step.hint}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/60 hover:text-white text-xs font-body transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ulangi
          </button>
          {!isLast ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-600/70 hover:bg-green-500/80 text-white text-xs font-body font-semibold transition-all cursor-pointer"
            >
              {stepIndex === 0
                ? "Coba: Tambah ke Satu Sisi Saja"
                : stepIndex === 1
                ? "Tambah ke Kedua Ruas"
                : "Lihat Hasil"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600/40 border border-cyan-500/30 text-cyan-300 text-xs font-body font-semibold">
              🎉 x = 10 ditemukan!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
