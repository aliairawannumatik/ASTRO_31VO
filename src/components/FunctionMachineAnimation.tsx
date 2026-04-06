import { useState, useRef } from "react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";

const FUNCTIONS = [
  {
    id: "f1", label: "2x + 3", latex: "f(x) = 2x + 3",
    fn: (x: number) => 2 * x + 3,
    steps: (x: number) => [
      { desc: "Substitusi x", expr: `f(${x}) = 2(${x}) + 3` },
      { desc: "Kalikan", expr: `= ${2 * x} + 3` },
      { desc: "Hasil", expr: `= ${2 * x + 3}` },
    ],
    color: "#a78bfa", bg: "bg-violet-500/20 border-violet-500/40",
  },
  {
    id: "f2", label: "x² − 1", latex: "f(x) = x^2 - 1",
    fn: (x: number) => x * x - 1,
    steps: (x: number) => [
      { desc: "Substitusi x", expr: `f(${x}) = (${x})² − 1` },
      { desc: "Pangkatkan", expr: `= ${x * x} − 1` },
      { desc: "Hasil", expr: `= ${x * x - 1}` },
    ],
    color: "#22d3ee", bg: "bg-cyan-500/20 border-cyan-500/40",
  },
  {
    id: "f3", label: "3x − 5", latex: "f(x) = 3x - 5",
    fn: (x: number) => 3 * x - 5,
    steps: (x: number) => [
      { desc: "Substitusi x", expr: `f(${x}) = 3(${x}) − 5` },
      { desc: "Kalikan", expr: `= ${3 * x} − 5` },
      { desc: "Hasil", expr: `= ${3 * x - 5}` },
    ],
    color: "#f472b6", bg: "bg-pink-500/20 border-pink-500/40",
  },
  {
    id: "f4", label: "x² + 2x", latex: "f(x) = x^2 + 2x",
    fn: (x: number) => x * x + 2 * x,
    steps: (x: number) => [
      { desc: "Substitusi x", expr: `f(${x}) = (${x})² + 2(${x})` },
      { desc: "Hitung", expr: `= ${x * x} + ${2 * x}` },
      { desc: "Hasil", expr: `= ${x * x + 2 * x}` },
    ],
    color: "#fbbf24", bg: "bg-yellow-500/20 border-yellow-500/40",
  },
  {
    id: "f5", label: "−x + 10", latex: "f(x) = -x + 10",
    fn: (x: number) => -x + 10,
    steps: (x: number) => [
      { desc: "Substitusi x", expr: `f(${x}) = −(${x}) + 10` },
      { desc: "Negatifkan", expr: `= ${-x} + 10` },
      { desc: "Hasil", expr: `= ${-x + 10}` },
    ],
    color: "#4ade80", bg: "bg-green-500/20 border-green-500/40",
  },
];

type Phase = "idle" | "feeding" | "processing" | "outputting" | "done";
const PRESETS = [-3, -2, -1, 0, 1, 2, 3, 5];

function GearSVG({ size, speed, clockwise, color, spinning }: {
  size: number; speed: number; clockwise: boolean; color: string; spinning: boolean;
}) {
  const teeth = 8;
  const r = size / 2;
  const rInner = r * 0.55;
  const rOuter = r * 0.88;
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = ((i * 2 * Math.PI) / teeth) - Math.PI / teeth / 2;
    const a1 = a0 + Math.PI / teeth / 2;
    const a2 = a1 + Math.PI / teeth / 2;
    const a3 = a2 + Math.PI / teeth / 2;
    points.push(
      `${rInner * Math.cos(a0)},${rInner * Math.sin(a0)}`,
      `${rOuter * Math.cos(a1)},${rOuter * Math.sin(a1)}`,
      `${rOuter * Math.cos(a2)},${rOuter * Math.sin(a2)}`,
      `${rInner * Math.cos(a3)},${rInner * Math.sin(a3)}`,
    );
  }
  const dur = spinning ? speed * 0.3 : speed;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{ overflow: "visible" }}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={clockwise ? "0;360" : "360;0"}
        dur={`${dur}s`}
        repeatCount="indefinite"
      />
      <polygon points={points.join(" ")} fill={color} opacity={spinning ? 0.95 : 0.45} />
      <circle r={r * 0.32} fill="#0f172a" />
      <circle r={r * 0.14} fill={color} opacity={spinning ? 0.9 : 0.4} />
    </svg>
  );
}

function Ball({ value, color, visible, animClass, label, sublabel }: {
  value: string; color: string; visible: boolean; animClass?: string;
  label: string; sublabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-white/40 font-body uppercase tracking-widest">{label}</span>
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-500 ${animClass ?? ""}`}
        style={{
          borderColor: visible ? color : "rgba(255,255,255,0.15)",
          color: visible ? color : "rgba(255,255,255,0.2)",
          background: visible ? `${color}22` : "rgba(255,255,255,0.03)",
          boxShadow: visible ? `0 0 18px ${color}50` : "none",
        }}
      >
        {value}
      </div>
      <span className="text-[10px] text-white/30 font-body">{sublabel}</span>
    </div>
  );
}

function Arrow({ color, active, vertical }: { color: string; active: boolean; vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center" style={{ height: 36 }}>
        <svg width="24" height="36" viewBox="0 0 24 36" className="overflow-visible">
          <line x1="12" y1="0" x2="12" y2="28"
            stroke={color} strokeWidth="2" strokeDasharray="6 3"
            opacity={active ? 1 : 0.25}
          >
            {active && <animate attributeName="stroke-dashoffset" values="36;0" dur="0.5s" repeatCount="indefinite" />}
          </line>
          <polygon points="6,26 12,36 18,26" fill={color} opacity={active ? 1 : 0.25} />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex-1 flex items-center justify-center min-w-0">
      <svg width="100%" height="24" viewBox="0 0 60 24" preserveAspectRatio="none" className="overflow-visible" style={{ minWidth: 32, maxWidth: 80 }}>
        <line x1="0" y1="12" x2="50" y2="12"
          stroke={color} strokeWidth="2" strokeDasharray="7 3"
          opacity={active ? 1 : 0.25}
        >
          {active && <animate attributeName="stroke-dashoffset" values="50;0" dur="0.5s" repeatCount="indefinite" />}
        </line>
        <polygon points="50,7 60,12 50,17" fill={color} opacity={active ? 1 : 0.25} />
      </svg>
    </div>
  );
}

export default function FunctionMachineAnimation() {
  const [fn, setFn] = useState(FUNCTIONS[0]);
  const [inputVal, setInputVal] = useState("3");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const addTimer = (cb: () => void, delay: number) => { timerRefs.current.push(setTimeout(cb, delay)); };

  const run = () => {
    const x = parseInt(inputVal);
    if (isNaN(x)) return;
    playPopSound();
    clearTimers();
    const output = fn.fn(x);
    const steps = fn.steps(x);
    setResult(null);
    setVisibleSteps(0);
    setPhase("feeding");
    addTimer(() => setPhase("processing"), 700);
    steps.forEach((_, i) => addTimer(() => setVisibleSteps(i + 1), 700 + 500 + i * 450));
    addTimer(() => setPhase("outputting"), 700 + 500 + steps.length * 450);
    addTimer(() => { setResult(output); setPhase("done"); }, 700 + 500 + steps.length * 450 + 600);
  };

  const reset = () => { playPopSound(); clearTimers(); setPhase("idle"); setResult(null); setVisibleSteps(0); };
  const handleFnChange = (f: typeof FUNCTIONS[0]) => { playPopSound(); clearTimers(); setFn(f); setPhase("idle"); setResult(null); setVisibleSteps(0); };

  const x = parseInt(inputVal);
  const xValid = !isNaN(x);
  const steps = xValid ? fn.steps(x) : [];
  const isRunning = phase === "feeding" || phase === "processing" || phase === "outputting";

  const inputVisible = phase !== "processing" && phase !== "outputting" && phase !== "done";
  const outputVisible = phase === "done";
  const arrowLeftActive = phase === "feeding" || phase === "processing";
  const arrowRightActive = phase === "outputting" || phase === "done";
  const spinning = phase === "processing";

  return (
    <div className="rounded-2xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-slate-900/90 to-violet-950/30 backdrop-blur">
      <style>{`
        @keyframes fma-ball-enter {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes fma-bounce-result {
          0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
          60%  { transform: scale(1.18) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fma-step-in {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fma-machine-glow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes fma-dot-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        .fma-ball-enter  { animation: fma-ball-enter 0.45s ease forwards; }
        .fma-bounce-result { animation: fma-bounce-result 0.5s ease forwards; }
        .fma-step-in { animation: fma-step-in 0.35s ease forwards; }
        .fma-glow    { animation: fma-machine-glow 0.7s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="px-4 pt-4 pb-2 text-center">
        <p className="font-display text-sm font-bold text-violet-300 mb-0.5">⚙️ Mesin Fungsi Interaktif</p>
        <p className="text-xs text-white/50 font-body">Masukkan nilai domain, lihat mesin memproses dan menghasilkan f(x)!</p>
      </div>

      {/* Function Selector */}
      <div className="flex flex-wrap gap-1.5 justify-center px-4 pb-3">
        {FUNCTIONS.map(f => (
          <button
            key={f.id}
            onClick={() => handleFnChange(f)}
            className="text-xs px-2.5 py-1.5 rounded-full border font-mono font-semibold transition-all cursor-pointer"
            style={fn.id === f.id
              ? { borderColor: f.color, color: f.color, background: `${f.color}18`, borderWidth: 2 }
              : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.45)" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ===== MACHINE VISUAL ===== */}
      {/* Mobile: vertical stack. Tablet/Desktop: horizontal row */}
      <div className="px-3 pb-3">

        {/* HORIZONTAL layout — sm and above */}
        <div className="hidden sm:flex items-center justify-center gap-0">
          {/* Input */}
          <Ball
            value={xValid ? String(x) : "?"}
            color={fn.color}
            visible={inputVisible}
            animClass={phase === "feeding" ? "fma-ball-enter" : ""}
            label="Input"
            sublabel="domain"
          />

          {/* Arrow left */}
          <Arrow color={fn.color} active={arrowLeftActive} />

          {/* Machine */}
          <div
            className="relative rounded-2xl border-2 flex flex-col items-center justify-center px-4 py-4 flex-shrink-0 transition-all duration-300"
            style={{
              width: 148,
              borderColor: fn.color,
              background: `linear-gradient(135deg, #0f172a 0%, ${fn.color}1a 100%)`,
              boxShadow: spinning
                ? `0 0 32px ${fn.color}80, 0 0 64px ${fn.color}30`
                : `0 0 12px ${fn.color}25`,
            }}
          >
            <div className="flex items-center gap-1 mb-2" style={{ opacity: spinning ? 1 : 0.45 }}>
              <GearSVG size={26} speed={1.8} clockwise={true}  color={fn.color} spinning={spinning} />
              <GearSVG size={18} speed={1.2} clockwise={false} color={fn.color} spinning={spinning} />
              <GearSVG size={22} speed={1.5} clockwise={true}  color={fn.color} spinning={spinning} />
            </div>
            <div className="text-[9px] text-white/40 font-body uppercase tracking-wider mb-0.5">fungsi</div>
            <div style={{ color: fn.color }} className="font-mono text-xs font-bold">
              <InlineMath math={fn.latex} />
            </div>
            {spinning ? (
              <div className="flex gap-1 mt-2">
                {[0, 0.15, 0.3].map((d, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full fma-glow"
                    style={{ background: fn.color, animationDelay: `${d}s` }} />
                ))}
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>

          {/* Arrow right */}
          <Arrow color={fn.color} active={arrowRightActive} />

          {/* Output */}
          <Ball
            value={phase === "done" && result !== null ? String(result) : "?"}
            color={fn.color}
            visible={outputVisible}
            animClass={phase === "done" ? "fma-bounce-result" : ""}
            label="Output"
            sublabel="kodomain"
          />
        </div>

        {/* VERTICAL layout — mobile only */}
        <div className="flex sm:hidden flex-col items-center gap-0">
          {/* Input */}
          <Ball
            value={xValid ? String(x) : "?"}
            color={fn.color}
            visible={inputVisible}
            animClass={phase === "feeding" ? "fma-ball-enter" : ""}
            label="Input"
            sublabel="domain"
          />

          {/* Arrow down */}
          <Arrow color={fn.color} active={arrowLeftActive} vertical />

          {/* Machine */}
          <div
            className="rounded-2xl border-2 flex flex-col items-center justify-center px-5 py-4 w-full max-w-[220px] transition-all duration-300"
            style={{
              borderColor: fn.color,
              background: `linear-gradient(135deg, #0f172a 0%, ${fn.color}1a 100%)`,
              boxShadow: spinning
                ? `0 0 28px ${fn.color}80, 0 0 56px ${fn.color}30`
                : `0 0 10px ${fn.color}25`,
            }}
          >
            <div className="flex items-center gap-2 mb-2" style={{ opacity: spinning ? 1 : 0.45 }}>
              <GearSVG size={28} speed={1.8} clockwise={true}  color={fn.color} spinning={spinning} />
              <GearSVG size={20} speed={1.2} clockwise={false} color={fn.color} spinning={spinning} />
              <GearSVG size={24} speed={1.5} clockwise={true}  color={fn.color} spinning={spinning} />
            </div>
            <div className="text-[9px] text-white/40 font-body uppercase tracking-wider mb-0.5">fungsi</div>
            <div style={{ color: fn.color }} className="font-mono text-sm font-bold">
              <InlineMath math={fn.latex} />
            </div>
            {spinning ? (
              <div className="flex gap-1.5 mt-2">
                {[0, 0.15, 0.3].map((d, i) => (
                  <div key={i} className="w-2 h-2 rounded-full fma-glow"
                    style={{ background: fn.color, animationDelay: `${d}s` }} />
                ))}
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>

          {/* Arrow down */}
          <Arrow color={fn.color} active={arrowRightActive} vertical />

          {/* Output */}
          <Ball
            value={phase === "done" && result !== null ? String(result) : "?"}
            color={fn.color}
            visible={outputVisible}
            animClass={phase === "done" ? "fma-bounce-result" : ""}
            label="Output"
            sublabel="kodomain"
          />
        </div>
      </div>

      {/* Step-by-step */}
      <div className="px-4 pb-3">
        <div className={`rounded-xl border px-4 py-3 transition-all min-h-[72px] ${fn.bg}`}>
          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2 font-body">Langkah Pengerjaan</p>
          {visibleSteps === 0 && phase === "idle" && (
            <p className="text-white/30 text-xs font-body italic">Masukkan nilai x dan tekan "Jalankan" untuk melihat proses...</p>
          )}
          {steps.slice(0, visibleSteps).map((step, i) => (
            <div key={i} className="fma-step-in flex items-center gap-3 mb-1.5" style={{ animationDelay: `${i * 0.05}s` }}>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full font-body flex-shrink-0"
                style={{ background: `${fn.color}25`, color: fn.color }}
              >
                {step.desc}
              </span>
              <span className="font-mono text-sm text-white/90">{step.expr}</span>
            </div>
          ))}
          {phase === "done" && result !== null && (
            <div className="fma-bounce-result mt-2 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="font-mono font-bold text-base" style={{ color: fn.color }}>
                f({x}) = {result}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl border border-slate-600 px-3 py-2">
            <span className="text-white/60 text-sm font-mono">x =</span>
            <input
              type="number"
              value={inputVal}
              onChange={e => { setInputVal(e.target.value); reset(); }}
              className="w-14 bg-transparent text-white font-mono text-sm font-bold outline-none text-center"
              disabled={isRunning}
            />
          </div>
          <button
            onClick={run}
            disabled={!xValid || isRunning}
            className="flex-1 min-w-[120px] py-2 rounded-xl font-display font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ background: `${fn.color}30`, border: `1px solid ${fn.color}60`, color: fn.color }}
          >
            {isRunning ? "⚙️ Memproses..." : "▶ Jalankan Mesin"}
          </button>
          {phase === "done" && (
            <button
              onClick={reset}
              className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white/60 hover:text-white text-xs font-body transition-all cursor-pointer"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Preset values */}
      <div className="px-4 pb-4">
        <p className="text-[10px] text-white/30 font-body mb-2 uppercase tracking-wider">Coba nilai domain:</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(v => (
            <button
              key={v}
              onClick={() => { setInputVal(String(v)); reset(); }}
              className="w-9 h-9 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer hover:scale-110 active:scale-95"
              style={{
                background: inputVal === String(v) ? `${fn.color}25` : "rgba(255,255,255,0.05)",
                borderColor: inputVal === String(v) ? fn.color : "rgba(255,255,255,0.1)",
                color: inputVal === String(v) ? fn.color : "rgba(255,255,255,0.5)",
                boxShadow: inputVal === String(v) ? `0 0 8px ${fn.color}40` : "none",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
