import { useState, useRef } from "react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import { Pencil, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

type StepLabels = {
  substituteX: string;
  multiply: string;
  power: string;
  negate: string;
  compute: string;
  result: string;
  formula: string;
};

const STEP_LABELS: Record<string, StepLabels> = {
  id: {
    substituteX: "Substitusi x",
    multiply: "Kalikan",
    power: "Pangkatkan",
    negate: "Negatifkan",
    compute: "Hitung",
    result: "Hasil",
    formula: "Rumus",
  },
  en: {
    substituteX: "Substitute x",
    multiply: "Multiply",
    power: "Apply power",
    negate: "Negate",
    compute: "Compute",
    result: "Result",
    formula: "Formula",
  },
  ja: {
    substituteX: "x を代入",
    multiply: "掛け算",
    power: "べき乗",
    negate: "符号反転",
    compute: "計算",
    result: "結果",
    formula: "式",
  },
};

const UI = {
  id: {
    header: "Mesin Fungsi Interaktif",
    subtitle: "Masukkan nilai domain → mesin memproses → lihat f(x) keluar!",
    custom: "Buat Sendiri",
    placeholder: "contoh: 2x^2 - 3x + 1",
    invalidFormula: "Rumus tidak valid. Gunakan: angka, x, +, -, ^, ()",
    validFormula: "Rumus valid — f(x) =",
    quickExamples: "Contoh cepat:",
    hint: "Gunakan",
    hintVar: "x",
    hintAsPow: "sebagai variabel,",
    hintPow: "untuk pangkat (mis.",
    hintBracket: "), tanda kurung",
    hintJika: "jika perlu.",
    stepsTitle: "Langkah Pengerjaan",
    idleHint: 'Masukkan nilai x dan tekan "Jalankan" untuk melihat proses...',
    invalidHint: "Tulis rumus fungsi yang valid terlebih dahulu...",
    tryDomain: "Coba nilai domain:",
    run: "▶ Jalankan Mesin",
    processing: "⚙️ Memproses...",
    machineLabel: "fungsi",
    inputLabel: "Input",
    inputSub: "domain",
    outputLabel: "Output",
    outputSub: "kodomain",
  },
  en: {
    header: "Interactive Function Machine",
    subtitle: "Enter a domain value → machine processes → see f(x) output!",
    custom: "Custom",
    placeholder: "example: 2x^2 - 3x + 1",
    invalidFormula: "Invalid formula. Use: numbers, x, +, -, ^, ()",
    validFormula: "Valid formula — f(x) =",
    quickExamples: "Quick examples:",
    hint: "Use",
    hintVar: "x",
    hintAsPow: "as variable,",
    hintPow: "for powers (e.g.",
    hintBracket: "), parentheses",
    hintJika: "when needed.",
    stepsTitle: "Step-by-Step",
    idleHint: 'Enter x value and press "Run" to see the process...',
    invalidHint: "Write a valid function formula first...",
    tryDomain: "Try domain values:",
    run: "▶ Run Machine",
    processing: "⚙️ Processing...",
    machineLabel: "function",
    inputLabel: "Input",
    inputSub: "domain",
    outputLabel: "Output",
    outputSub: "codomain",
  },
  ja: {
    header: "関数マシン・インタラクティブ",
    subtitle: "定義域の値を入力 → マシンが処理 → f(x) が出力！",
    custom: "自作",
    placeholder: "例: 2x^2 - 3x + 1",
    invalidFormula: "無効な式。数字、x、+、-、^、() を使ってください",
    validFormula: "有効な式 — f(x) =",
    quickExamples: "クイック例:",
    hint: "",
    hintVar: "x",
    hintAsPow: "を変数として使用、",
    hintPow: "はべき乗 (例:",
    hintBracket: ")、括弧",
    hintJika: "も使えます。",
    stepsTitle: "計算ステップ",
    idleHint: 'x の値を入力して「実行」を押してください...',
    invalidHint: "先に有効な関数式を入力してください...",
    tryDomain: "定義域の値を試す:",
    run: "▶ 実行",
    processing: "⚙️ 処理中...",
    machineLabel: "関数",
    inputLabel: "入力",
    inputSub: "定義域",
    outputLabel: "出力",
    outputSub: "値域",
  },
};

const FUNCTIONS = [
  {
    id: "f1", label: "2x + 3", latex: "f(x) = 2x + 3",
    fn: (x: number) => 2 * x + 3,
    makeSteps: (x: number, L: StepLabels) => [
      { desc: L.substituteX, expr: `f(${x}) = 2(${x}) + 3` },
      { desc: L.multiply, expr: `= ${2 * x} + 3` },
      { desc: L.result, expr: `= ${2 * x + 3}` },
    ],
    color: "#a78bfa", bg: "bg-violet-500/20 border-violet-500/40",
  },
  {
    id: "f2", label: "x² − 1", latex: "f(x) = x^2 - 1",
    fn: (x: number) => x * x - 1,
    makeSteps: (x: number, L: StepLabels) => [
      { desc: L.substituteX, expr: `f(${x}) = (${x})² − 1` },
      { desc: L.power, expr: `= ${x * x} − 1` },
      { desc: L.result, expr: `= ${x * x - 1}` },
    ],
    color: "#22d3ee", bg: "bg-cyan-500/20 border-cyan-500/40",
  },
  {
    id: "f3", label: "3x − 5", latex: "f(x) = 3x - 5",
    fn: (x: number) => 3 * x - 5,
    makeSteps: (x: number, L: StepLabels) => [
      { desc: L.substituteX, expr: `f(${x}) = 3(${x}) − 5` },
      { desc: L.multiply, expr: `= ${3 * x} − 5` },
      { desc: L.result, expr: `= ${3 * x - 5}` },
    ],
    color: "#f472b6", bg: "bg-pink-500/20 border-pink-500/40",
  },
  {
    id: "f4", label: "x² + 2x", latex: "f(x) = x^2 + 2x",
    fn: (x: number) => x * x + 2 * x,
    makeSteps: (x: number, L: StepLabels) => [
      { desc: L.substituteX, expr: `f(${x}) = (${x})² + 2(${x})` },
      { desc: L.compute, expr: `= ${x * x} + ${2 * x}` },
      { desc: L.result, expr: `= ${x * x + 2 * x}` },
    ],
    color: "#fbbf24", bg: "bg-yellow-500/20 border-yellow-500/40",
  },
  {
    id: "f5", label: "−x + 10", latex: "f(x) = -x + 10",
    fn: (x: number) => -x + 10,
    makeSteps: (x: number, L: StepLabels) => [
      { desc: L.substituteX, expr: `f(${x}) = −(${x}) + 10` },
      { desc: L.negate, expr: `= ${-x} + 10` },
      { desc: L.result, expr: `= ${-x + 10}` },
    ],
    color: "#4ade80", bg: "bg-green-500/20 border-green-500/40",
  },
];

const CUSTOM_COLOR = "#fb923c";
const CUSTOM_BG = "bg-orange-500/20 border-orange-500/40";

const QUICK_PRESETS = [
  { label: "4x − 7", value: "4x - 7" },
  { label: "x² + 1", value: "x^2 + 1" },
  { label: "2x² − x", value: "2x^2 - x" },
  { label: "−3x + 6", value: "-3x + 6" },
  { label: "x³", value: "x^3" },
  { label: "x² + 3x − 4", value: "x^2 + 3x - 4" },
];

function sanitizeFormula(raw: string): boolean {
  return /^[0-9x\s\+\-\*\/\^\(\)\.]+$/i.test(raw.trim());
}

function evalFormula(formula: string, x: number): number | null {
  try {
    if (!sanitizeFormula(formula)) return null;
    let expr = formula.trim();
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/(\d)(x)/gi, "$1*x");
    expr = expr.replace(/(x)(\d)/gi, "x*$2");
    expr = expr.replace(/(\))(x|\d)/gi, "$1*$2");
    expr = expr.replace(/(x|\d)(\()/gi, "$1*$2");
    // eslint-disable-next-line no-new-func
    const result = new Function("x", `"use strict"; return (${expr});`)(x);
    if (typeof result !== "number" || !isFinite(result)) return null;
    return Math.round(result * 10000) / 10000;
  } catch {
    return null;
  }
}

function buildCustomSteps(formula: string, x: number, L: StepLabels): { desc: string; expr: string }[] {
  const substituted = formula.replace(/x/gi, `(${x})`);
  const result = evalFormula(formula, x);
  return [
    { desc: L.formula, expr: `f(x) = ${formula}` },
    { desc: L.substituteX, expr: `f(${x}) = ${substituted}` },
    { desc: L.result, expr: `= ${result ?? "?"}`},
  ];
}

type Phase = "idle" | "feeding" | "processing" | "outputting" | "done";
const PRESETS = [-3, -2, -1, 0, 1, 2, 3, 5];

function GearSVG({ size, speed, clockwise, color, spinning, centerColor }: {
  size: number; speed: number; clockwise: boolean; color: string; spinning: boolean; centerColor: string;
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
      <circle r={r * 0.32} fill={centerColor} />
      <circle r={r * 0.14} fill={color} opacity={spinning ? 0.9 : 0.4} />
    </svg>
  );
}

function Ball({ value, color, visible, animClass, label, sublabel, labelClass, sublabelClass, inactiveBorderColor, inactiveTextColor, inactiveBgColor }: {
  value: string; color: string; visible: boolean; animClass?: string;
  label: string; sublabel: string;
  labelClass?: string; sublabelClass?: string;
  inactiveBorderColor?: string; inactiveTextColor?: string; inactiveBgColor?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-[10px] font-body uppercase tracking-widest ${labelClass ?? "text-white/40"}`}>{label}</span>
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-500 ${animClass ?? ""}`}
        style={{
          borderColor: visible ? color : (inactiveBorderColor ?? "rgba(255,255,255,0.15)"),
          color: visible ? color : (inactiveTextColor ?? "rgba(255,255,255,0.2)"),
          background: visible ? `${color}22` : (inactiveBgColor ?? "rgba(255,255,255,0.03)"),
          boxShadow: visible ? `0 0 18px ${color}50` : "none",
        }}
      >
        {value}
      </div>
      <span className={`text-[10px] font-body ${sublabelClass ?? "text-white/30"}`}>{sublabel}</span>
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
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isSpace = theme === "dark";
  const ui = UI[language as keyof typeof UI] ?? UI.id;
  const stepLabels = STEP_LABELS[language as keyof typeof STEP_LABELS] ?? STEP_LABELS.id;

  // Theme-sensitive colors
  const tc = {
    innerBg:          isSpace ? "from-[#0a0515] via-[#0d1220] to-[#050c1a]"  : "from-gray-50 via-white to-gray-50",
    headerBgStyle:    isSpace
      ? "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.15) 50%, rgba(236,72,153,0.20) 100%)"
      : "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.05) 50%, rgba(236,72,153,0.07) 100%)",
    subtitleText:     isSpace ? "text-white/60"  : "text-gray-500",
    selectorBorder:   isSpace ? "border-white/[0.06]" : "border-black/[0.07]",
    selectorBg:       isSpace ? "bg-white/[0.02]"     : "bg-gray-100/60",
    machineBg:        (color: string) => isSpace
      ? `linear-gradient(135deg, #0f172a 0%, ${color}1a 100%)`
      : `linear-gradient(135deg, #f8fafc 0%, ${color}18 100%)`,
    gearCenter:       isSpace ? "#0f172a"  : "#f8fafc",
    machineLabelCls:  isSpace ? "text-white/40" : "text-gray-400",
    ballLabelCls:     isSpace ? "text-white/40" : "text-gray-500",
    ballSubLabelCls:  isSpace ? "text-white/30" : "text-gray-400",
    ballInactiveBorder: isSpace ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
    ballInactiveText:   isSpace ? "rgba(255,255,255,0.2)"  : "rgba(0,0,0,0.18)",
    ballInactiveBg:     isSpace ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
    stepsBg:          (color: string) => `linear-gradient(135deg, ${color}12 0%, ${isSpace ? "rgba(15,23,42,0.9)" : "rgba(248,250,252,0.97)"} 100%)`,
    stepsExprCls:     isSpace ? "text-white/90" : "text-gray-800",
    idleHintCls:      isSpace ? "text-white/30" : "text-gray-400",
    xInputCls:        isSpace ? "text-white"    : "text-gray-800",
    selectorUnselected: isSpace
      ? { border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }
      : { border: "1.5px solid rgba(0,0,0,0.12)",       background: "rgba(0,0,0,0.04)",       color: "rgba(0,0,0,0.45)" },
    resetBtnStyle:    isSpace
      ? { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }
      : { background: "rgba(0,0,0,0.05)",        border: "1px solid rgba(0,0,0,0.10)" },
    resetBtnCls:      isSpace ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-800",
    runBtnDisabled:   isSpace
      ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)" }
      : { background: "rgba(0,0,0,0.06)",        border: "1px solid rgba(0,0,0,0.10)",       color: "rgba(0,0,0,0.3)" },
    presetSelectedText: isSpace ? "#0f172a" : "#ffffff",
    customPanelCls:   isSpace ? "bg-orange-900/20 border-orange-500/30" : "bg-orange-50 border-orange-300",
    customInputCls:   isSpace
      ? "bg-slate-900/60 border border-orange-500/30 text-orange-200 placeholder-white/20 focus:border-orange-400/60 focus:ring-orange-400/30"
      : "bg-white border border-orange-300 text-orange-700 placeholder-gray-300 focus:border-orange-400 focus:ring-orange-200",
    quickExLabelCls:  isSpace ? "text-white/30" : "text-gray-400",
    presetBtnCls:     isSpace
      ? "border-orange-500/20 bg-orange-900/20 text-orange-300/70 hover:text-orange-200 hover:border-orange-400/40 hover:bg-orange-900/30"
      : "border-orange-300 bg-orange-50 text-orange-600 hover:text-orange-700 hover:border-orange-400 hover:bg-orange-100",
    hintTextCls:      isSpace ? "text-white/25" : "text-gray-400",
    hintCodeCls:      isSpace ? "text-orange-300/60" : "text-orange-500",
    tryDomainCls:     (color: string) => isSpace ? `${color}90` : color,
  };

  const [fn, setFn] = useState(FUNCTIONS[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customFormula, setCustomFormula] = useState("2x^2 - 3x + 1");
  const [customError, setCustomError] = useState<string | null>(null);

  const [inputVal, setInputVal] = useState("3");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const addTimer = (cb: () => void, delay: number) => { timerRefs.current.push(setTimeout(cb, delay)); };

  const activeColor = isCustom ? CUSTOM_COLOR : fn.color;

  const x = parseInt(inputVal);
  const xValid = !isNaN(x);

  const customFormulaValid = isCustom
    ? (customFormula.trim().length > 0 && sanitizeFormula(customFormula) && evalFormula(customFormula, 0) !== null)
    : true;

  const getSteps = () => {
    if (!xValid) return [];
    if (isCustom) return buildCustomSteps(customFormula, x, stepLabels);
    return fn.makeSteps(x, stepLabels);
  };

  const getResult = () => {
    if (!xValid) return null;
    if (isCustom) return evalFormula(customFormula, x);
    return fn.fn(x);
  };

  const steps = getSteps();

  const run = () => {
    if (!xValid) return;
    if (isCustom && !customFormulaValid) { setCustomError(ui.invalidFormula); return; }
    playPopSound();
    clearTimers();
    const output = getResult();
    setResult(null);
    setVisibleSteps(0);
    setPhase("feeding");
    addTimer(() => setPhase("processing"), 700);
    steps.forEach((_, i) => addTimer(() => setVisibleSteps(i + 1), 700 + 500 + i * 450));
    addTimer(() => setPhase("outputting"), 700 + 500 + steps.length * 450);
    addTimer(() => { setResult(output); setPhase("done"); }, 700 + 500 + steps.length * 450 + 600);
  };

  const reset = () => { playPopSound(); clearTimers(); setPhase("idle"); setResult(null); setVisibleSteps(0); };

  const handleFnChange = (f: typeof FUNCTIONS[0]) => {
    playPopSound(); clearTimers(); setFn(f); setIsCustom(false);
    setPhase("idle"); setResult(null); setVisibleSteps(0);
  };

  const handleCustomSelect = () => {
    playPopSound(); clearTimers(); setIsCustom(true);
    setPhase("idle"); setResult(null); setVisibleSteps(0); setCustomError(null);
  };

  const handleCustomFormulaChange = (val: string) => {
    setCustomFormula(val);
    setCustomError(null);
    reset();
  };

  const isRunning = phase === "feeding" || phase === "processing" || phase === "outputting";
  const inputVisible = phase !== "processing" && phase !== "outputting" && phase !== "done";
  const outputVisible = phase === "done";
  const arrowLeftActive = phase === "feeding" || phase === "processing";
  const arrowRightActive = phase === "outputting" || phase === "done";
  const spinning = phase === "processing";

  const MachineBox = ({ size }: { size: "sm" | "lg" }) => (
    <div
      className={`relative rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${size === "lg" ? "px-5 py-4 w-full max-w-[220px]" : "px-4 py-4 flex-shrink-0"}`}
      style={{
        width: size === "sm" ? 148 : undefined,
        borderColor: activeColor,
        background: tc.machineBg(activeColor),
        boxShadow: spinning
          ? `0 0 32px ${activeColor}80, 0 0 64px ${activeColor}30`
          : `0 0 12px ${activeColor}25`,
      }}
    >
      <div className="flex items-center gap-1 mb-2" style={{ opacity: spinning ? 1 : 0.45 }}>
        <GearSVG size={size === "lg" ? 28 : 26} speed={1.8} clockwise={true}  color={activeColor} spinning={spinning} centerColor={tc.gearCenter} />
        <GearSVG size={size === "lg" ? 20 : 18} speed={1.2} clockwise={false} color={activeColor} spinning={spinning} centerColor={tc.gearCenter} />
        <GearSVG size={size === "lg" ? 24 : 22} speed={1.5} clockwise={true}  color={activeColor} spinning={spinning} centerColor={tc.gearCenter} />
      </div>
      <div className={`text-[9px] font-body uppercase tracking-wider mb-0.5 ${tc.machineLabelCls}`}>{ui.machineLabel}</div>
      <div style={{ color: activeColor }} className={`font-mono font-bold text-center leading-tight ${size === "lg" ? "text-sm" : "text-xs"} max-w-[130px] break-all`}>
        {isCustom
          ? <span>f(x) = <span className="text-orange-300">{customFormula || "..."}</span></span>
          : <InlineMath math={fn.latex} />
        }
      </div>
      {spinning ? (
        <div className="flex gap-1 mt-2">
          {[0, 0.15, 0.3].map((d, i) => (
            <div key={i} className={`rounded-full fma-glow ${size === "lg" ? "w-2 h-2" : "w-1.5 h-1.5"}`}
              style={{ background: activeColor, animationDelay: `${d}s` }} />
          ))}
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden p-[2px]" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 30%, #ec4899 60%, #f59e0b 100%)" }}>
    <div className={`rounded-2xl overflow-hidden bg-gradient-to-br ${tc.innerBg} backdrop-blur`}>
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
        @keyframes fma-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .fma-ball-enter      { animation: fma-ball-enter 0.45s ease forwards; }
        .fma-bounce-result   { animation: fma-bounce-result 0.5s ease forwards; }
        .fma-step-in         { animation: fma-step-in 0.35s ease forwards; }
        .fma-glow            { animation: fma-machine-glow 0.7s ease-in-out infinite; }
        .fma-shimmer-btn     { background-size: 200% auto; animation: fma-shimmer 2.5s linear infinite; }
      `}</style>

      {/* Header strip */}
      <div className="px-4 pt-4 pb-3 text-center" style={{ background: tc.headerBgStyle }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xl">⚙️</span>
          <p className="font-display text-base font-bold" style={{ background: "linear-gradient(90deg, #a78bfa, #22d3ee, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {ui.header}
          </p>
          <span className="text-xl">🎯</span>
        </div>
        <p className={`text-xs font-body ${tc.subtitleText}`}>{ui.subtitle}</p>
      </div>

      {/* Function Selector */}
      <div className={`flex flex-wrap gap-2 justify-center px-4 py-3 border-y ${tc.selectorBg} ${tc.selectorBorder}`}>
        {FUNCTIONS.map(f => (
          <button
            key={f.id}
            onClick={() => handleFnChange(f)}
            className="text-xs px-3 py-1.5 rounded-full font-mono font-bold transition-all cursor-pointer active:scale-95"
            style={!isCustom && fn.id === f.id
              ? { borderWidth: 2, borderStyle: "solid", borderColor: f.color, color: f.color, background: `${f.color}22`, boxShadow: `0 0 12px ${f.color}50` }
              : tc.selectorUnselected
            }
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={handleCustomSelect}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer active:scale-95"
          style={isCustom
            ? { borderWidth: 2, borderStyle: "solid", borderColor: CUSTOM_COLOR, color: CUSTOM_COLOR, background: `${CUSTOM_COLOR}22`, boxShadow: `0 0 12px ${CUSTOM_COLOR}50` }
            : tc.selectorUnselected
          }
        >
          <Pencil className="w-3 h-3" /> {ui.custom}
        </button>
      </div>

      {/* Custom Formula Input Panel */}
      {isCustom && (
        <div className={`mx-4 mb-3 border rounded-xl p-3 space-y-2 ${tc.customPanelCls}`}>
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-xs font-bold font-mono shrink-0">f(x) =</span>
            <input
              type="text"
              value={customFormula}
              onChange={e => handleCustomFormulaChange(e.target.value)}
              placeholder={ui.placeholder}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-mono outline-none focus:ring-1 transition-all ${tc.customInputCls}`}
              disabled={isRunning}
            />
            {customFormula && (
              <button onClick={() => { handleCustomFormulaChange(""); reset(); }}
                className={`transition-colors shrink-0 ${isSpace ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {customError && (
            <p className="text-[11px] text-red-500 font-body">{customError}</p>
          )}
          {!customError && customFormula && !customFormulaValid && (
            <p className="text-[11px] text-red-500 font-body">⚠️ {ui.invalidFormula}</p>
          )}
          {!customError && customFormulaValid && customFormula && (
            <p className="text-[11px] text-green-600 font-body">✅ {ui.validFormula} {customFormula}</p>
          )}
          <div>
            <p className={`text-[10px] font-body mb-1.5 uppercase tracking-wider ${tc.quickExLabelCls}`}>{ui.quickExamples}</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map(p => (
                <button key={p.value}
                  onClick={() => { handleCustomFormulaChange(p.value); }}
                  className={`text-[11px] font-mono px-2 py-1 rounded-lg border transition-all active:scale-95 ${tc.presetBtnCls}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <p className={`text-[10px] font-body ${tc.hintTextCls}`}>
            💡 {ui.hint} <code className={tc.hintCodeCls}>{ui.hintVar}</code> {ui.hintAsPow} <code className={tc.hintCodeCls}>^</code> {ui.hintPow} <code className={tc.hintCodeCls}>x^2</code>{ui.hintBracket} <code className={tc.hintCodeCls}>()</code> {ui.hintJika}
          </p>
        </div>
      )}

      {/* ===== MACHINE VISUAL ===== */}
      <div className="px-3 pb-3">

        {/* HORIZONTAL layout — sm and above */}
        <div className="hidden sm:flex items-center justify-center gap-0">
          <Ball
            value={xValid ? String(x) : "?"}
            color={activeColor} visible={inputVisible}
            animClass={phase === "feeding" ? "fma-ball-enter" : ""}
            label={ui.inputLabel} sublabel={ui.inputSub}
            labelClass={tc.ballLabelCls} sublabelClass={tc.ballSubLabelCls}
            inactiveBorderColor={tc.ballInactiveBorder} inactiveTextColor={tc.ballInactiveText} inactiveBgColor={tc.ballInactiveBg}
          />
          <Arrow color={activeColor} active={arrowLeftActive} />
          <MachineBox size="sm" />
          <Arrow color={activeColor} active={arrowRightActive} />
          <Ball
            value={phase === "done" && result !== null ? String(result) : "?"}
            color={activeColor} visible={outputVisible}
            animClass={phase === "done" ? "fma-bounce-result" : ""}
            label={ui.outputLabel} sublabel={ui.outputSub}
            labelClass={tc.ballLabelCls} sublabelClass={tc.ballSubLabelCls}
            inactiveBorderColor={tc.ballInactiveBorder} inactiveTextColor={tc.ballInactiveText} inactiveBgColor={tc.ballInactiveBg}
          />
        </div>

        {/* VERTICAL layout — mobile only */}
        <div className="flex sm:hidden flex-col items-center gap-0">
          <Ball
            value={xValid ? String(x) : "?"}
            color={activeColor} visible={inputVisible}
            animClass={phase === "feeding" ? "fma-ball-enter" : ""}
            label={ui.inputLabel} sublabel={ui.inputSub}
            labelClass={tc.ballLabelCls} sublabelClass={tc.ballSubLabelCls}
            inactiveBorderColor={tc.ballInactiveBorder} inactiveTextColor={tc.ballInactiveText} inactiveBgColor={tc.ballInactiveBg}
          />
          <Arrow color={activeColor} active={arrowLeftActive} vertical />
          <MachineBox size="lg" />
          <Arrow color={activeColor} active={arrowRightActive} vertical />
          <Ball
            value={phase === "done" && result !== null ? String(result) : "?"}
            color={activeColor} visible={outputVisible}
            animClass={phase === "done" ? "fma-bounce-result" : ""}
            label={ui.outputLabel} sublabel={ui.outputSub}
            labelClass={tc.ballLabelCls} sublabelClass={tc.ballSubLabelCls}
            inactiveBorderColor={tc.ballInactiveBorder} inactiveTextColor={tc.ballInactiveText} inactiveBgColor={tc.ballInactiveBg}
          />
        </div>
      </div>

      {/* Step-by-step */}
      <div className="px-4 pb-3">
        <div className="rounded-xl px-4 py-3 transition-all min-h-[80px]" style={{
          background: tc.stepsBg(activeColor),
          border: `1.5px solid ${activeColor}40`,
          boxShadow: phase !== "idle" ? `0 0 16px ${activeColor}20` : "none",
        }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor, boxShadow: `0 0 6px ${activeColor}` }} />
            <p className="text-[10px] font-bold uppercase tracking-wider font-body" style={{ color: activeColor }}>{ui.stepsTitle}</p>
          </div>
          {visibleSteps === 0 && phase === "idle" && (
            <p className={`text-xs font-body italic ${tc.idleHintCls}`}>
              {isCustom && !customFormulaValid ? ui.invalidHint : ui.idleHint}
            </p>
          )}
          {steps.slice(0, visibleSteps).map((step, i) => (
            <div key={i} className="fma-step-in flex items-center gap-3 mb-2" style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full font-body flex-shrink-0 text-white"
                style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}60` }}>
                {i + 1}
              </span>
              <span className="text-[10px] font-semibold font-body shrink-0" style={{ color: activeColor }}>{step.desc}</span>
              <span className={`font-mono text-sm ml-auto ${tc.stepsExprCls}`}>{step.expr}</span>
            </div>
          ))}
          {phase === "done" && result !== null && (
            <div className="fma-bounce-result mt-2 flex items-center gap-3 px-3 py-2 rounded-lg"
              style={{ background: `${activeColor}20`, border: `1px solid ${activeColor}50` }}>
              <span className="text-xl">🎯</span>
              <span className="font-mono font-bold text-lg" style={{ color: activeColor }}>
                f({x}) = {result}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{ background: `${activeColor}10`, borderColor: `${activeColor}40` }}>
            <span className="font-mono text-sm font-bold" style={{ color: activeColor }}>x =</span>
            <input
              type="number"
              value={inputVal}
              onChange={e => { setInputVal(e.target.value); reset(); }}
              className={`w-14 bg-transparent font-mono text-sm font-bold outline-none text-center ${tc.xInputCls}`}
              disabled={isRunning}
            />
          </div>
          <button
            onClick={run}
            disabled={!xValid || isRunning || (isCustom && !customFormulaValid)}
            className="flex-1 min-w-[130px] py-2.5 rounded-xl font-display font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 text-white"
            style={!xValid || isRunning || (isCustom && !customFormulaValid)
              ? tc.runBtnDisabled
              : { background: `linear-gradient(135deg, ${activeColor} 0%, ${activeColor}cc 100%)`, border: "none", boxShadow: `0 4px 16px ${activeColor}50` }
            }
          >
            {isRunning ? ui.processing : ui.run}
          </button>
          {phase === "done" && (
            <button onClick={reset}
              className={`px-3 py-2 rounded-xl text-xs font-body transition-all cursor-pointer active:scale-95 ${tc.resetBtnCls}`}
              style={tc.resetBtnStyle}>
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Preset values */}
      <div className="px-4 pb-5">
        <p className="text-[10px] font-bold uppercase tracking-wider font-body mb-2" style={{ color: tc.tryDomainCls(activeColor) }}>
          {ui.tryDomain}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((v, idx) => {
            const presetColors = ["#a78bfa","#22d3ee","#f472b6","#fbbf24","#4ade80","#fb923c","#60a5fa","#e879f9"];
            const pColor = presetColors[idx % presetColors.length];
            const isSelected = inputVal === String(v);
            return (
              <button key={v}
                onClick={() => { setInputVal(String(v)); reset(); }}
                className="w-10 h-10 rounded-xl font-mono text-sm font-bold transition-all cursor-pointer hover:scale-110 active:scale-95"
                style={isSelected
                  ? { background: pColor, color: tc.presetSelectedText, boxShadow: `0 0 12px ${pColor}80`, border: "none" }
                  : { background: `${pColor}15`, borderWidth: 1.5, borderStyle: "solid", borderColor: `${pColor}50`, color: pColor }
                }
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
}
