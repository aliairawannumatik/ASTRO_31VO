import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Sparkles, List } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Garis Bilangan SVG (-5 sampai 5) ──────────────────────── */
const NumberLineSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
  const { language } = useLanguage();
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const cx = (n: number) => 300 + n * 50;
  const numFill = lightMode ? "var(--text-primary)" : "#FFE57F";
  const labelFill = lightMode ? "var(--text-secondary)" : "#FFD700";

  const negLabel = language === "en" ? "← negative" : language === "ja" ? "← 負" : "← negatif";
  const posLabel = language === "en" ? "positive →" : language === "ja" ? "正 →" : "positif →";

  return (
    <svg viewBox="0 0 620 88" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
        <marker id="arr-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
      </defs>
      <line x1="14" y1="38" x2="606" y2="38"
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#arr-r)" markerStart="url(#arr-l)" />
      <text x="7"   y="43" style={{ fill: labelFill }} fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      <text x="613" y="43" style={{ fill: labelFill }} fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      {nums.map(n => {
        const x = cx(n);
        const isZero = n === 0;
        return (
          <g key={n}>
            <line
              x1={x} y1={isZero ? 26 : 30}
              x2={x} y2={isZero ? 50 : 46}
              stroke="var(--text-primary)"
              strokeWidth={isZero ? 2.5 : 1.8}
            />
            <text
              x={x} y={66}
              textAnchor="middle"
              style={{ fill: isZero ? "var(--text-primary)" : numFill }}
              fontSize={isZero ? "14" : "12"}
              fontWeight={isZero ? "bold" : "normal"}
              fontFamily="monospace"
            >{n}</text>
          </g>
        );
      })}
      <text x="58"  y="83" style={{ fill: labelFill }} fontSize="10" fontFamily="sans-serif" opacity="0.65">{negLabel}</text>
      <text x="475" y="83" style={{ fill: labelFill }} fontSize="10" fontFamily="sans-serif" opacity="0.65">{posLabel}</text>
    </svg>
  );
};

/* ── Demo Arah: positif=kanan, negatif=kiri ────────────────── */
const DirectionDemoSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 700  :
      step === 5  ? 2000 :
      step === 6  ? 450  :
      step === 11 ? 2000 :
      step === 12 ? 600  :
      750;
    const t = setTimeout(() => setStep(s => (s >= 12 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 52;
  const cx   = (n: number) => 320 + n * sp;
  const yA   = 72;
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  const numGreen = step >= 1 && step <= 5 ? Math.min(step, 4) : 0;
  const numRed   = step >= 7 && step <= 11 ? Math.min(step - 6, 4) : 0;

  const showResultRight = step === 5;
  const showResultLeft  = step === 11;
  const isPhaseRight    = step >= 1 && step <= 5;
  const isPhaseLeft     = step >= 7;

  const statusText =
    step === 0  ? "" :
    step <= 4   ? (
      language === "en" ? `Step +${step} · from ${step - 1} to ${step}` :
      language === "ja" ? `ステップ +${step} · ${step - 1} から ${step} へ` :
      `Langkah +${step} · dari ${step - 1} ke ${step}`
    ) :
    step === 5  ? (
      language === "en" ? "0 + 4 = 4  ✓  Positive → moves to the RIGHT →" :
      language === "ja" ? "0 + 4 = 4  ✓  正の数 → 右へ移動 →" :
      "0 + 4 = 4  ✓  Positif → bergerak ke KANAN →"
    ) :
    step === 6  ? (
      language === "en" ? "Now with a negative number..." :
      language === "ja" ? "次は負の数で..." :
      "Sekarang dengan bilangan negatif..."
    ) :
    step <= 10  ? (
      language === "en" ? `Step −${step - 6} · from ${step === 7 ? 0 : -(step - 7)} to ${-(step - 6)}` :
      language === "ja" ? `ステップ −${step - 6} · ${step === 7 ? 0 : -(step - 7)} から ${-(step - 6)} へ` :
      `Langkah −${step - 6} · dari ${step === 7 ? 0 : -(step - 7)} ke ${-(step - 6)}`
    ) :
    step === 11 ? (
      language === "en" ? "0 + (−4) = −4  ✓  Negative → moves to the LEFT ←" :
      language === "ja" ? "0 + (−4) = −4  ✓  負の数 → 左へ移動 ←" :
      "0 + (−4) = −4  ✓  Negatif → bergerak ke KIRI ←"
    ) :
    "";

  const statusColor =
    step === 5  ? "#4ade80" :
    step === 11 ? "#f87171" :
    step >= 7   ? "#f87171" :
    step >= 1   ? "#4ade80" :
    "var(--text-primary)";

  const leftLabel    = language === "en" ? "← LEFT" : language === "ja" ? "← 左" : "← KIRI";
  const leftSubLabel = language === "en" ? "(negative)" : language === "ja" ? "（負）" : "(negatif)";
  const rightLabel    = language === "en" ? "RIGHT →" : language === "ja" ? "右 →" : "KANAN →";
  const rightSubLabel = language === "en" ? "(positive)" : language === "ja" ? "（正）" : "(positif)";

  return (
    <svg viewBox="0 0 640 152" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="dird-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="dird-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="dird-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="dird-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>

      <text x="14" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold">{leftLabel}</text>
      <text x="14" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8">{leftSubLabel}</text>
      <text x="626" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">{rightLabel}</text>
      <text x="626" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8" textAnchor="end">{rightSubLabel}</text>

      {isPhaseRight && (
        <text x="320" y="22" textAnchor="middle" fill="#4ade8099" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          0 + 4 = ?
        </text>
      )}
      {isPhaseLeft && (
        <text x="320" y="22" textAnchor="middle" fill="#f8717199" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          0 + (−4) = ?
        </text>
      )}

      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#dird-ar)" markerStart="url(#dird-al)"/>

      <circle cx={cx(0)} cy={yA} r="5" fill="#ffffff" opacity="0.9"/>

      {nums.map(n => {
        const x         = cx(n);
        const isZero    = n === 0;
        const isResR    = showResultRight && n === 4;
        const isResL    = showResultLeft  && n === -4;
        const tickColor = isResR ? "#4ade80" : isResL ? "#f87171" : isZero ? "var(--text-primary)" : "#FFD700";
        const txtColor  = isResR ? "#4ade80" : isResL ? "#f87171" : isZero ? "var(--text-primary)" : (lightMode ? "var(--text-primary)" : "#FFE57F");
        const prominent = isZero || isResR || isResL;
        return (
          <g key={n}>
            <line
              x1={x} y1={prominent ? 60 : 65}
              x2={x} y2={prominent ? 84 : 79}
              stroke={tickColor} strokeWidth={prominent ? 2.5 : 1.8}
            />
            <text x={x} y={97} textAnchor="middle" fontFamily="monospace"
              fill={txtColor}
              fontSize={prominent ? "13" : "11"}
              fontWeight={prominent ? "bold" : "normal"}
            >{n}</text>
          </g>
        );
      })}

      {Array.from({length: numGreen}, (_, i) => {
        const x1 = cx(i), x2 = cx(i + 1), mx = (x1 + x2) / 2;
        return (
          <path key={`dg${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA - 30} ${x2},${yA}`}
            fill="none" stroke="#4ade80" strokeWidth="2.2"
            markerEnd="url(#dird-g)"
          />
        );
      })}

      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(-i), x2 = cx(-i - 1), mx = (x1 + x2) / 2;
        return (
          <path key={`dr${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA + 30} ${x2},${yA}`}
            fill="none" stroke="#f87171" strokeWidth="2.2"
            markerEnd="url(#dird-r)"
          />
        );
      })}

      {showResultRight && (
        <circle cx={cx(4)}  cy={yA} r="9" fill="none" stroke="#4ade80" strokeWidth="2.5"/>
      )}
      {showResultLeft && (
        <circle cx={cx(-4)} cy={yA} r="9" fill="none" stroke="#f87171" strokeWidth="2.5"/>
      )}

      {step >= 1 && step <= 4 && (
        <circle cx={cx(step)}        cy={yA} r="5" fill="#4ade80"/>
      )}
      {step >= 7 && step <= 10 && (
        <circle cx={cx(-(step - 6))} cy={yA} r="5" fill="#f87171"/>
      )}

      {statusText && (
        <text x="320" y="136" textAnchor="middle" fontFamily="sans-serif"
          fontSize="11.5" fontWeight="bold" fill={statusColor}>
          {statusText}
        </text>
      )}
    </svg>
  );
};

/* ── Animasi bertahap: 8 + (−3) = 5 ──────────────────────── */
const NumberLineContoh1SVG = () => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 800  :
      step === 9  ? 1100 :
      step === 13 ? 2800 :
      750;
    const t = setTimeout(() => setStep(s => (s >= 13 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 50;
  const cx   = (n: number) => 90 + n * sp;
  const yA   = 68;
  const nums = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const numGreen   = Math.min(step, 8);
  const numRed     = Math.min(step >= 10 ? step - 9 : 0, 3);
  const showResult = step >= 12;

  const statusText =
    step === 0  ? (language === "en" ? "Ready..." : language === "ja" ? "準備完了..." : "Siap...") :
    step <= 8   ? (
      language === "en" ? `Step +${step} · from ${step - 1} to ${step}` :
      language === "ja" ? `ステップ +${step} · ${step - 1} から ${step} へ` :
      `Langkah +${step} · dari ${step - 1} ke ${step}`
    ) :
    step === 9  ? (
      language === "en" ? "At 8 · now stepping back −3..." :
      language === "ja" ? "8 に到達 · −3 戻る..." :
      "Sudah di 8 · sekarang mundur −3..."
    ) :
    step <= 12  ? (
      language === "en" ? `Step −${step - 9} · from ${8 - (step - 10)} to ${7 - (step - 10)}` :
      language === "ja" ? `ステップ −${step - 9} · ${8 - (step - 10)} から ${7 - (step - 10)} へ` :
      `Langkah −${step - 9} · dari ${8 - (step - 10)} ke ${7 - (step - 10)}`
    ) :
    (language === "en" ? "Result: 8 + (−3) = 5  ✓" : language === "ja" ? "結果: 8 + (−3) = 5  ✓" : "Hasil: 8 + (−3) = 5  ✓");

  const statusColor =
    step >= 13 ? "#67e8f9" :
    step >= 10 ? "#f87171" :
    "#4ade80";

  return (
    <svg viewBox="0 0 640 136" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="nl2-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="nl2-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="nl2-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="nl2-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>

      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#nl2-ar)" markerStart="url(#nl2-al)"/>

      {nums.map(n => {
        const x       = cx(n);
        const isZero  = n === 0;
        const isKey   = n === 5 || n === 8;
        const tickClr = n === 5 && showResult ? "#67e8f9"
                       : n === 8 && step >= 9  ? "#86efac"
                       : isZero               ? "#ffffff"
                       :                        "#FFD700";
        const txtClr  = n === 5 && showResult ? "#67e8f9"
                       : n === 8 && step >= 9  ? "#86efac"
                       : isZero               ? "#ffffff"
                       :                        "#FFE57F";
        return (
          <g key={n}>
            <line
              x1={x} y1={isZero || isKey ? 57 : 62}
              x2={x} y2={isZero || isKey ? 79 : 74}
              stroke={tickClr} strokeWidth={isZero || isKey ? 2.5 : 1.8}
            />
            <text x={x} y={93} textAnchor="middle" fontFamily="monospace"
              fill={txtClr}
              fontSize={isZero || isKey ? "13" : "11"}
              fontWeight={isZero || isKey ? "bold" : "normal"}
            >{n}</text>
          </g>
        );
      })}

      {Array.from({length: numGreen}, (_, i) => {
        const x1 = cx(i), x2 = cx(i + 1), mx = (x1 + x2) / 2;
        return (
          <path key={`g${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA - 26} ${x2},${yA}`}
            fill="none" stroke="#4ade80" strokeWidth="2.2"
            markerEnd="url(#nl2-g)"
          />
        );
      })}

      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(8 - i), x2 = cx(7 - i), mx = (x1 + x2) / 2;
        return (
          <path key={`r${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA + 26} ${x2},${yA}`}
            fill="none" stroke="#f87171" strokeWidth="2.2"
            markerEnd="url(#nl2-r)"
          />
        );
      })}

      {showResult && (
        <circle cx={cx(5)} cy={yA} r="8"
          fill="none" stroke="#67e8f9" strokeWidth="2.5"/>
      )}

      {step >= 1 && step <= 8 && (
        <circle cx={cx(step)} cy={yA} r="4" fill="#4ade80"/>
      )}
      {step >= 10 && step <= 12 && (
        <circle cx={cx(7 - (step - 10))} cy={yA} r="4" fill="#f87171"/>
      )}

      <text x="320" y="122" textAnchor="middle" fontFamily="sans-serif"
        fontSize="11.5" fontWeight="bold" fill={statusColor}>
        {statusText}
      </text>
    </svg>
  );
};

/* ── Kalkulator Interaktif Garis Bilangan ─────────────────── */
const InteraktifPenjumlahan = ({ lightMode = false }: { lightMode?: boolean }) => {
  const { language } = useLanguage();
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [phase, setPhase] = useState<"idle" | "animating" | "done">("idle");
  const [animStep, setAnimStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rawA = parseInt(inputA);
  const rawB = parseInt(inputB);
  const validA = inputA !== "" && !isNaN(rawA);
  const validB = inputB !== "" && !isNaN(rawB);
  const bothValid = validA && validB;

  const a = validA ? Math.max(-20, Math.min(20, rawA)) : 0;
  const b = validB ? Math.max(-20, Math.min(20, rawB)) : 0;
  const result = a + b;
  const steps = Math.abs(b);

  const ARC_DUR = 1.1;
  const totalMs = steps * ARC_DUR * 1000 + 900;

  const allPoints = bothValid ? [0, a, result] : validA ? [0, a] : [0];
  const minV = Math.min(...allPoints) - 2;
  const maxV = Math.max(...allPoints) + 2;
  const rangeW = Math.max(maxV - minV, 6);

  const SVG_W = 580;
  const SVG_H = 120;
  const PAD = 28;
  const lineY = 66;
  const toX = (n: number) => PAD + ((n - minV) / rangeW) * (SVG_W - PAD * 2);

  const visibleNums: number[] = [];
  for (let i = Math.ceil(minV); i <= Math.floor(maxV); i++) visibleNums.push(i);
  const labelStep = rangeW > 16 ? 5 : rangeW > 8 ? 2 : 1;

  useEffect(() => {
    if (phase !== "animating") return;
    timerRef.current = setTimeout(() => setPhase("done"), totalMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, totalMs]);

  useEffect(() => {
    if (phase !== "animating") {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      return;
    }
    setAnimStep(0);
    stepIntervalRef.current = setInterval(() => {
      setAnimStep(s => s + 1);
    }, ARC_DUR * 1000);
    return () => { if (stepIntervalRef.current) clearInterval(stepIntervalRef.current); };
  }, [phase]);

  const handleOperate = () => {
    if (!bothValid) return;
    playPopSound();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    if (steps === 0) { setPhase("done"); return; }
    setAnimStep(0);
    setPhase("idle");
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("animating")));
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    setAnimStep(0);
    setPhase("idle");
  };

  const arcColor = b >= 0 ? "#38bdf8" : "#f87171";
  const arcUp    = b >= 0;
  const markerId = b >= 0 ? "ia-arrow-b" : "ia-arrow-r";
  const unitPx   = (SVG_W - PAD * 2) / rangeW;

  const isDone = phase === "done";
  const resultEmoji = isDone ? (b === 0 ? "😐" : b > 0 ? "🎉" : "🔄") : "";

  const lbl = {
    header: language === "en" ? "Interactive Number Line Calculator"
           : language === "ja" ? "インタラクティブ数直線計算機"
           : "Kalkulator Interaktif Garis Bilangan",
    num1: language === "en" ? "Number 1" : language === "ja" ? "数 1" : "Bilangan ke-1",
    num2: language === "en" ? "Number 2" : language === "ja" ? "数 2" : "Bilangan ke-2",
    result: language === "en" ? "Result" : language === "ja" ? "結果" : "Hasil",
    enterNums: language === "en" ? "Enter numbers to see the number line"
             : language === "ja" ? "数字を入力して数直線を表示"
             : "Masukkan angka untuk melihat garis bilangan",
    enterNum2: language === "en" ? `Purple dot = ${a} · enter the second number`
             : language === "ja" ? `紫の点 = ${a} · 2番目の数字を入力`
             : `Titik merah = ${a} · masukkan bilangan ke-2`,
    ready: language === "en" ? "Ready! Click Operate to see the arc animation"
         : language === "ja" ? "準備完了！「操作する」をクリックしてアニメーションを見よう"
         : "Siap! Klik Operasikan untuk melihat animasi busur",
    stepping: language === "en" ? `Stepping... ${animStep} of ${steps} step(s)`
            : language === "ja" ? `ステップ中... ${animStep} / ${steps} ステップ`
            : `Melangkah... ${animStep} dari ${steps} langkah`,
    done: `${a} + (${b}) = ${result} ${resultEmoji}`,
    hintPos: language === "en" ? `Second number is positive → blue arcs move RIGHT by ${steps} step(s)`
           : language === "ja" ? `2番目の数が正 → 青い弧が右に ${steps} ステップ移動`
           : `Bilangan ke-2 positif → busur biru bergerak ke KANAN sejauh ${steps} langkah`,
    hintNeg: language === "en" ? `Second number is negative → red arcs move LEFT by ${steps} step(s)`
           : language === "ja" ? `2番目の数が負 → 赤い弧が左に ${steps} ステップ移動`
           : `Bilangan ke-2 negatif → busur merah bergerak ke KIRI sejauh ${steps} langkah`,
    btnAnimating: language === "en" ? "⏳ Animating..." : language === "ja" ? "⏳ アニメーション中..." : "⏳ Animasi berjalan...",
    btnRepeat: language === "en" ? "🔄 Repeat" : language === "ja" ? "🔄 もう一度" : "🔄 Ulangi",
    btnOperate: language === "en" ? "🚀 Operate" : language === "ja" ? "🚀 操作する" : "🚀 Operasikan",
    btnReset: "Reset",
    startLabel: language === "en" ? `start (${a})` : language === "ja" ? `開始 (${a})` : `mulai (${a})`,
  };

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-xl mb-4 ${lightMode ? "bg-white/80 border-blue-200" : "bg-slate-900/90 border-cyan-500/40"}`}>
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">🧮</span>
        <span className="font-display text-sm font-bold text-white tracking-wide">{lbl.header}</span>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-cyan-300/70"}`}>{lbl.num1}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const v = inputA === "" ? 0 : parseInt(inputA); if (!isNaN(v)) { setInputA(String(Math.max(-20, v - 1))); handleReset(); } else { setInputA("-1"); handleReset(); } }}
                className={`w-8 h-12 rounded-l-xl border-2 border-r-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-blue-100 border-blue-300 text-slate-600 hover:bg-blue-200" : "bg-slate-700 border-cyan-500/60 text-cyan-300 hover:bg-slate-600"}`}
              >−</button>
              <input
                type="number"
                value={inputA}
                onChange={e => { setInputA(e.target.value); handleReset(); }}
                placeholder="0"
                min={-20} max={20}
                className={`w-16 h-12 text-center text-xl font-bold border-y-2 outline-none transition-all font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                  ${lightMode ? "bg-blue-50 border-blue-300 text-slate-800" : "bg-slate-800 border-cyan-500/60 text-cyan-200"}
                  ${validA ? (lightMode ? "border-blue-500" : "border-cyan-400") : ""}`}
              />
              <button
                onClick={() => { const v = inputA === "" ? 0 : parseInt(inputA); if (!isNaN(v)) { setInputA(String(Math.min(20, v + 1))); handleReset(); } else { setInputA("1"); handleReset(); } }}
                className={`w-8 h-12 rounded-r-xl border-2 border-l-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-blue-100 border-blue-300 text-slate-600 hover:bg-blue-200" : "bg-slate-700 border-cyan-500/60 text-cyan-300 hover:bg-slate-600"}`}
              >+</button>
            </div>
          </div>

          <span className={`text-3xl font-bold mt-5 ${lightMode ? "text-slate-600" : "text-yellow-300"}`}>+</span>

          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-cyan-300/70"}`}>{lbl.num2}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const v = inputB === "" ? 0 : parseInt(inputB); if (!isNaN(v)) { setInputB(String(Math.max(-20, v - 1))); handleReset(); } else { setInputB("-1"); handleReset(); } }}
                className={`w-8 h-12 rounded-l-xl border-2 border-r-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-blue-100 border-blue-300 text-slate-600 hover:bg-blue-200" : "bg-slate-700 border-cyan-500/60 text-cyan-300 hover:bg-slate-600"}`}
              >−</button>
              <input
                type="number"
                value={inputB}
                onChange={e => { setInputB(e.target.value); handleReset(); }}
                placeholder="0"
                min={-20} max={20}
                className={`w-16 h-12 text-center text-xl font-bold border-y-2 outline-none transition-all font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                  ${lightMode ? "bg-blue-50 border-blue-300 text-slate-800" : "bg-slate-800 border-cyan-500/60 text-cyan-200"}
                  ${validB ? (b >= 0
                    ? (lightMode ? "border-sky-500" : "border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]")
                    : (lightMode ? "border-red-400" : "border-red-400 shadow-[0_0_12px_rgba(248,113,113,0.3)]")
                  ) : ""}`}
              />
              <button
                onClick={() => { const v = inputB === "" ? 0 : parseInt(inputB); if (!isNaN(v)) { setInputB(String(Math.min(20, v + 1))); handleReset(); } else { setInputB("1"); handleReset(); } }}
                className={`w-8 h-12 rounded-r-xl border-2 border-l-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-blue-100 border-blue-300 text-slate-600 hover:bg-blue-200" : "bg-slate-700 border-cyan-500/60 text-cyan-300 hover:bg-slate-600"}`}
              >+</button>
            </div>
          </div>

          <span className={`text-3xl font-bold mt-5 ${lightMode ? "text-slate-600" : "text-yellow-300"}`}>=</span>

          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-cyan-300/70"}`}>{lbl.result}</span>
            <div className={`w-20 h-12 flex items-center justify-center rounded-xl border-2 text-xl font-bold font-mono transition-all
              ${isDone
                ? (lightMode ? "bg-amber-50 border-amber-400 text-amber-700" : "bg-amber-900/30 border-amber-400 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.4)]")
                : (lightMode ? "bg-slate-100 border-slate-200 text-slate-300" : "bg-slate-800/50 border-slate-600 text-slate-500")
              }`}>
              {isDone ? result : "?"}
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-3 border ${lightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-white/10"}`}>
          <p className={`text-xs text-center mb-2 font-body ${lightMode ? "text-slate-400" : "text-white/40"}`}>
            {phase === "idle" && !validA && lbl.enterNums}
            {phase === "idle" && validA && !validB && lbl.enterNum2}
            {phase === "idle" && bothValid && lbl.ready}
            {phase === "animating" && lbl.stepping}
            {phase === "done" && lbl.done}
          </p>

          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
            <defs>
              <style>{`
                @keyframes arcDraw {
                  0%   { stroke-dashoffset: 100; opacity: 0; }
                  15%  { opacity: 1; }
                  100% { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes shimmer {
                  0%, 100% { stroke-opacity: 0.65; }
                  50%      { stroke-opacity: 1; }
                }
                @keyframes dotFade {
                  0%   { opacity: 0; transform: scale(0.4); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes ringPulse {
                  0%   { opacity: 0; transform: scale(0.5); }
                  60%  { opacity: 0.9; transform: scale(1.15); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes sparkle {
                  0%   { opacity: 1; transform: scale(1); }
                  100% { opacity: 0; transform: scale(3); }
                }
                .arc-draw   { animation: arcDraw 1.0s cubic-bezier(0.4,0,0.2,1) both; }
                .arc-shimmer { animation: shimmer 3s ease-in-out infinite; }
                .dot-fade   { animation: dotFade 0.5s ease-out both; }
                .ring-pop   {
                  animation: ringPulse 0.8s cubic-bezier(0.34,1.4,0.64,1) forwards;
                  transform-box: fill-box;
                  transform-origin: center;
                }
                .sparkle-burst {
                  animation: sparkle 0.9s ease-out forwards;
                  transform-box: fill-box;
                  transform-origin: center;
                }
              `}</style>

              <filter id="glow-g" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.75  0 0 0 0 1  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-r" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-amber" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.75  0 0 0 0 0  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-dot" x="-80%" y="-80%" width="360%" height="360%">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              <linearGradient id="grad-g" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#bae6fd"/>
                <stop offset="50%"  stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#0ea5e9"/>
              </linearGradient>
              <linearGradient id="grad-r" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#fca5a5"/>
                <stop offset="50%"  stopColor="#f87171"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>

              <marker id="ia-axis-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
              </marker>
              <marker id="ia-axis-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
                <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
              </marker>
              <marker id="ia-arrow-g" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#38bdf8"/>
              </marker>
              <marker id="ia-arrow-b" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#38bdf8"/>
              </marker>
              <marker id="ia-arrow-r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#f87171"/>
              </marker>
            </defs>

            <line x1={10} y1={lineY} x2={SVG_W - 10} y2={lineY}
              stroke="#FFD700" strokeWidth="2.5"
              markerEnd="url(#ia-axis-r)" markerStart="url(#ia-axis-l)"
              style={{ filter: "drop-shadow(0 0 3px #FFD70088)" }}
            />

            {visibleNums.map(n => {
              const x = toX(n);
              const isZero = n === 0;
              const isA    = validA && n === a;
              const isRes  = isDone && n === result;
              const showLabel = n % labelStep === 0 || isA || isRes || isZero;
              const prominent = isZero || isA || isRes;
              const tickColor = isRes ? "#67e8f9" : isA ? "#f0abfc" : isZero ? "#ffffff" : "#FFD700";
              const textColor = isRes ? "#67e8f9" : isA ? "#f0abfc" : isZero ? "#ffffff" : (lightMode ? "#334155" : "#FFE57F");
              return (
                <g key={n}>
                  <line
                    x1={x} y1={prominent ? lineY - 11 : lineY - 6}
                    x2={x} y2={prominent ? lineY + 11 : lineY + 6}
                    stroke={tickColor} strokeWidth={prominent ? 2.5 : 1.5}
                    style={prominent ? { filter: `drop-shadow(0 0 4px ${tickColor}99)` } : undefined}
                  />
                  {showLabel && (
                    <text x={x} y={lineY + 26} textAnchor="middle" fontFamily="monospace"
                      fill={textColor}
                      fontSize={prominent ? 13 : 10}
                      fontWeight={prominent ? "bold" : "normal"}
                    >{n}</text>
                  )}
                </g>
              );
            })}

            {validA && phase === "idle" && (
              <g key={`dot-a-${a}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={toX(a)} cy={lineY} r="9" fill="#f0abfc" opacity="0.18" className="dot-fade"/>
                <circle cx={toX(a)} cy={lineY} r="6" fill="#f0abfc" filter="url(#glow-dot)" className="dot-fade"/>
              </g>
            )}

            {phase !== "idle" && Array.from({ length: steps }, (_, i) => {
              const x1 = b > 0 ? toX(a + i)     : toX(a - i);
              const x2 = b > 0 ? toX(a + i + 1) : toX(a - i - 1);
              const mx = (x1 + x2) / 2;
              const arcH = Math.min(34, unitPx * 0.6 + 10);
              const cy = arcUp ? lineY - arcH : lineY + arcH;
              const dPath = `M ${x1},${lineY} Q ${mx},${cy} ${x2},${lineY}`;
              const delay = `${i * ARC_DUR}s`;
              const glowFilter = arcUp ? "url(#glow-g)" : "url(#glow-r)";
              const gradId = arcUp ? "url(#grad-g)" : "url(#grad-r)";
              return (
                <g key={`arc-${i}`}>
                  <path d={dPath} fill="none" stroke={arcColor} strokeWidth="10"
                    strokeLinecap="round" strokeOpacity="0.18" pathLength="100"
                    strokeDasharray="100" className="arc-draw arc-shimmer"
                    style={{ animationDelay: delay }}
                  />
                  <path d={dPath} fill="none" stroke={gradId} strokeWidth="3.2"
                    strokeLinecap="round" pathLength="100" strokeDasharray="100"
                    filter={glowFilter} className="arc-draw"
                    style={{ animationDelay: delay }}
                    markerEnd={`url(#${markerId})`}
                  />
                </g>
              );
            })}

            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13" fill="#fbbf24" opacity="0.15" className="dot-fade"/>
                <circle cx={toX(result)} cy={lineY} r="7" fill="#fbbf24" filter="url(#glow-amber)" className="dot-fade"/>
              </g>
            )}

            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13"
                  fill="none" stroke="#fbbf24" strokeWidth="2.5"
                  filter="url(#glow-amber)" className="ring-pop"
                />
                {[0, 60, 120, 180, 240, 300].map((deg, si) => {
                  const rad = (deg * Math.PI) / 180;
                  const sx = toX(result) + Math.cos(rad) * 18;
                  const sy = lineY + Math.sin(rad) * 18;
                  return (
                    <circle key={`sp${si}`} cx={sx} cy={sy} r="2"
                      fill="#fbbf24" className="sparkle-burst"
                      style={{ animationDelay: `${si * 0.06}s`, transformOrigin: `${sx}px ${sy}px` }}
                    />
                  );
                })}
              </g>
            )}

            {phase !== "idle" && (
              <text x={toX(a)} y={lineY - 22}
                textAnchor="middle" fontFamily="sans-serif" fontSize="9"
                fill="#f0abfc" opacity="0.85">
                {lbl.startLabel}
              </text>
            )}
          </svg>
        </div>

        {bothValid && phase === "idle" && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body ${lightMode ? "bg-blue-50 text-blue-600" : "bg-cyan-900/30 text-cyan-300"}`}>
            <span>{b >= 0 ? "➡️" : "⬅️"}</span>
            <span>{b >= 0 ? lbl.hintPos : lbl.hintNeg}</span>
          </div>
        )}
        {isDone && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body font-semibold ${lightMode ? "bg-green-50 text-green-700 border border-green-200" : "bg-green-900/30 text-green-300 border border-green-500/30"}`}>
            <span>✅</span>
            <span>{a} + ({b}) = <strong>{result}</strong> {resultEmoji}</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleOperate}
            disabled={!bothValid || phase === "animating"}
            className={`px-6 py-2.5 rounded-xl font-display text-sm font-bold tracking-wide transition-all
              ${!bothValid || phase === "animating"
                ? "bg-slate-600/40 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 cursor-pointer"
              }`}
          >
            {phase === "animating" ? lbl.btnAnimating : phase === "done" ? lbl.btnRepeat : lbl.btnOperate}
          </button>
          {phase === "done" && (
            <button
              onClick={() => { setInputA(""); setInputB(""); handleReset(); }}
              className={`ml-2 px-4 py-2.5 rounded-xl font-body text-sm transition-all cursor-pointer
                ${lightMode ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60"}`}
            >
              {lbl.btnReset}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Pola Percobaan: 2+2=4, 2+1=3, 2+0=2, 2+(-1)=1, 2+(-2)=0 ── */
const POLA_ROWS = [
  { bLabel: "2",    bColor: "#38bdf8", res: 4,  resColor: "#fbbf24" },
  { bLabel: "1",    bColor: "#38bdf8", res: 3,  resColor: "#fbbf24" },
  { bLabel: "0",    bColor: "#94a3b8", res: 2,  resColor: "#fbbf24" },
  { bLabel: "(-1)", bColor: "#f87171", res: 1,  resColor: "#fbbf24" },
  { bLabel: "(-2)", bColor: "#f87171", res: 0,  resColor: "#94a3b8" },
];

const PolaPercobaanAnim = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const TOTAL = POLA_ROWS.length - 1; // 4 arc gaps
    const CYCLE = TOTAL + 3;            // 4 show + 3 pause frames
    let frame = 0;
    const iv = setInterval(() => {
      frame = (frame + 1) % CYCLE;
      setStep(frame <= TOTAL ? frame : TOTAL);
    }, 650);
    return () => clearInterval(iv);
  }, []);

  const ROW_H = 58;
  const SVG_W = 310;
  const SVG_H = POLA_ROWS.length * ROW_H + 30;
  const X2    = 44;
  const XPLUS = 78;
  const XB    = 132;
  const XEQ   = 190;
  const XRES  = 228;
  const ARC_L_CX = XB - 34;
  const ARC_R_CX = XRES + 34;

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-900/70 p-4 mb-4">
      <p className="text-xs font-body text-indigo-300/80 mb-2 text-center font-semibold">
        🔍 Perhatikan — apa yang terjadi saat bilangan kedua berkurang 1?
      </p>
      <div className="flex justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W, display: "block" }}>
          <defs>
            <style>{`
              @keyframes arcAppearL {
                from { stroke-dashoffset: 100; opacity: 0; }
                to   { stroke-dashoffset: 0;   opacity: 1; }
              }
              @keyframes lblPopIn {
                from { opacity: 0; transform: scale(0.4); }
                to   { opacity: 1; transform: scale(1); }
              }
              .arc-l { stroke-dasharray: 100; pathLength: 100; animation: arcAppearL 0.55s cubic-bezier(0.22,1,0.36,1) both; }
              .lbl-in { animation: lblPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.28s both; transform-box: fill-box; transform-origin: center; }
            `}</style>
            <marker id="pola-arr-l" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0,7 3,0 6" fill="#818cf8"/>
            </marker>
            <marker id="pola-arr-r" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0,7 3,0 6" fill="#34d399"/>
            </marker>
          </defs>

          {/* rows */}
          {POLA_ROWS.map(({ bLabel, bColor, res, resColor }, i) => {
            const y = 18 + i * ROW_H + ROW_H / 2;
            return (
              <g key={i}>
                <text x={X2}   y={y + 7} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#c084fc" fontFamily="monospace">2</text>
                <text x={XPLUS} y={y + 7} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#ffffff70" fontFamily="monospace">+</text>
                <text x={XB}   y={y + 7} textAnchor="middle" fontSize="20" fontWeight="bold" fill={bColor}   fontFamily="monospace"
                  style={{ filter: `drop-shadow(0 0 5px ${bColor}99)` }}>{bLabel}</text>
                <text x={XEQ}  y={y + 7} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#ffffff70" fontFamily="monospace">=</text>
                <text x={XRES} y={y + 7} textAnchor="middle" fontSize="22" fontWeight="bold" fill={resColor} fontFamily="monospace"
                  style={{ filter: `drop-shadow(0 0 6px ${resColor}99)` }}>{res}</text>
              </g>
            );
          })}

          {/* arcs between rows — appear one by one */}
          {Array.from({ length: POLA_ROWS.length - 1 }, (_, i) => {
            if (i >= step) return null;
            const y1  = 18 + i * ROW_H + ROW_H / 2 + 15;
            const y2  = 18 + (i + 1) * ROW_H + ROW_H / 2 - 15;
            const mid = (y1 + y2) / 2;
            return (
              <g key={`a${i}`}>
                {/* left arc — b side */}
                <path d={`M ${XB} ${y1} Q ${ARC_L_CX} ${mid} ${XB} ${y2}`}
                  fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"
                  pathLength="100" className="arc-l"
                  markerEnd="url(#pola-arr-l)"
                  style={{ filter: "drop-shadow(0 0 5px #818cf8aa)" }}
                />
                <text x={ARC_L_CX - 10} y={mid + 5} textAnchor="middle" fontSize="11"
                  fontWeight="bold" fill="#a5b4fc" fontFamily="monospace" className="lbl-in">−1</text>

                {/* right arc — result side */}
                <path d={`M ${XRES} ${y1} Q ${ARC_R_CX} ${mid} ${XRES} ${y2}`}
                  fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"
                  pathLength="100" className="arc-l"
                  markerEnd="url(#pola-arr-r)"
                  style={{ filter: "drop-shadow(0 0 5px #34d39988)" }}
                />
                <text x={ARC_R_CX + 10} y={mid + 5} textAnchor="middle" fontSize="11"
                  fontWeight="bold" fill="#6ee7b7" fontFamily="monospace" className="lbl-in">−1</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-center gap-6 mt-1 text-xs font-body">
        <span className="flex items-center gap-1 text-indigo-300">
          <svg width="18" height="8"><path d="M 0 4 Q 9 0 18 4" fill="none" stroke="#818cf8" strokeWidth="2"/></svg>
          bilangan ke-2 berkurang 1
        </span>
        <span className="flex items-center gap-1 text-emerald-300">
          <svg width="18" height="8"><path d="M 0 4 Q 9 0 18 4" fill="none" stroke="#34d399" strokeWidth="2"/></svg>
          hasil berkurang 1
        </span>
      </div>
    </div>
  );
};

const PenjumlahanBilanganBulatPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const lightMode = ["light", "white", "forest"].includes(theme);
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh", "sifat", "kesimpulan"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const translations = {
    id: {
      title: "PENJUMLAHAN BILANGAN BULAT",
      subtitle: "Kelas 7 - Bilangan Bulat - Materi Matematika",
      secIntroTitle: "Mengapa Kita Butuh Bilangan Negatif?",
      secKonsepTitle: "Ringkasan Intisari: Konsep Penjumlahan",
      secContohTitle: "Contoh Soal dan Pembahasan",
      secSifatTitle: "Sifat-sifat Penjumlahan Bilangan Bulat",
      secKesimpulanTitle: "Kesimpulan dan Tips",
      introP: "Dulu di Sekolah Dasar, kita sudah kenal dengan",
      introBold1: "bilangan asli",
      introP2: "(1, 2, 3, 4, ...) dan",
      introBold2: "bilangan cacah",
      introP3: "(0, 1, 2, 3, ...). Tapi ternyata, kedua jenis bilangan ini belum cukup untuk menggambarkan semua situasi di dunia nyata.",
      exampleBold: "Contoh nyata:",
      exampleBody: "Bayangkan kamu sedang melihat prakiraan cuaca di Jepang saat musim dingin. Suhunya tertulis",
      exampleBody2: ". Bagaimana cara menuliskan suhu yang berada di bawah titik beku (0°C) kalau kita hanya punya bilangan positif?",
      imgAlt: "Termometer menunjukkan suhu di bawah nol",
      imgCaption: "Sumber: Ilustrasi garis bilangan",
      negNumBold: "bilangan negatif",
      negNumP: "Inilah alasan diciptakannya",
      negNumP2: ". Bilangan negatif digunakan untuk menyatakan nilai yang berada di bawah nol, seperti:",
      listTemp: "Suhu di bawah",
      listTempEnd: "(misalnya",
      listTempEnd2: "di puncak Himalaya)",
      listDepth: "Ketinggian di bawah permukaan laut (misalnya",
      listDepthEnd: "meter untuk palung laut)",
      listDebt: "Hutang atau kerugian dalam keuangan",
      defBold: "Definisi:",
      defIntegerBold: "Bilangan bulat",
      defBody: "adalah kumpulan bilangan yang terdiri dari bilangan bulat negatif (..., -3, -2, -1), nol (0), dan bilangan bulat positif (1, 2, 3, ...).",
      konsepP: "Cara paling mudah memahami penjumlahan bilangan bulat adalah dengan membayangkan",
      konsepBold: "garis bilangan",
      konsepP2: ". Bayangkan kamu berdiri di titik nol dan berjalan sesuai instruksi.",
      ruleTitle: "Aturan Jalan di Garis Bilangan:",
      rulePos: "Bilangan positif (+)",
      rulePosBody: "= bergerak ke",
      rulePosKey: "kanan",
      ruleNeg: "Bilangan negatif (-)",
      ruleNegBody: "= bergerak ke",
      ruleNegKey: "kiri",
      numberLineLabel: "Garis Bilangan",
      formulaTitle: "Rumus Penjumlahan Bilangan Bulat:",
      formulaBothPos: "Kedua bilangan",
      formulaBothPosBold: "positif",
      formulaIfAGtB: "Jika",
      formulaIfBGtA: "Jika",
      formulaBothNeg: "Kedua bilangan negatif:",
      tipsBold: "Tips Mudah:",
      tipsBody: "Saat menjumlahkan dua bilangan dengan tanda berbeda, kurangkan nilai absolutnya, lalu gunakan tanda bilangan yang nilainya lebih besar.",
      badgeEasy: "MUDAH",
      badgeMedium: "SEDANG",
      badgeHard: "SULIT",
      badgeBonus: "BONUS",
      ex1Label: "Contoh 1",
      ex2Label: "Contoh 2",
      ex3Label: "Contoh 3",
      ex4Label: "Contoh 4: Mencari Nilai yang Belum Diketahui",
      solutionLabel: "PEMBAHASAN:",
      answerLabel: "Jawaban:",
      ex1Q: "Hitunglah hasil dari",
      ex1QEnd: "menggunakan garis bilangan!",
      ex1S1: "Langkah 1:",
      ex1S1Body: "Mulai dari titik 0, bergerak 8 satuan ke",
      ex1S1Bold: "kanan",
      ex1S1End: "(karena 8 positif).",
      ex1S2: "Langkah 2:",
      ex1S2Body: "Dari titik 8, bergerak 3 satuan ke",
      ex1S2Bold: "kiri",
      ex1S2End: "(karena -3 negatif).",
      ex1S3: "Langkah 3:",
      ex1S3Body: "Titik akhir berada di angka",
      ex1VizLabel: "Visualisasi di Garis Bilangan",
      ex1LegRight: "+8 ke kanan",
      ex1LegLeft: "−3 ke kiri",
      ex1LegResult: "hasil = 5",
      ex1Conclusion: "Jadi,",
      ex2Q: "Hitunglah hasil penjumlahan berikut:",
      ex2aBody: "Karena 27 > 12 dan 27 bertanda negatif, maka:",
      ex2bBody: "Karena 29 > 14 dan 29 bertanda positif, maka:",
      ex2cBody: "Kedua bilangan sama-sama negatif, maka jumlahkan nilainya dan beri tanda negatif:",
      ex3Q1: "Di sebuah pabrik es krim, suhu ruang penyimpanan adalah",
      ex3Q2: ". Suhu di ruang administrasi tercatat",
      ex3Q3: "lebih tinggi dari suhu gudang. Berapa suhu di ruang administrasi?",
      ex3S1: "Langkah 1:",
      ex3S1Body: "Identifikasi informasi yang diketahui:",
      ex3Ref1: "Suhu gudang =",
      ex3Ref2: "Selisih suhu =",
      ex3Ref2End: "lebih tinggi",
      ex3S2: "Langkah 2:",
      ex3S2Body: "Susun model matematika:",
      ex3S3: "Langkah 3:",
      ex3S3Body: "Hitung hasil:",
      ex3Calc: "Karena 41 > 17 dan 41 bertanda positif:",
      katexEx3: "\\text{Suhu administrasi} = -17 + 41",
      ex3Conclusion: "Jadi, suhu di ruang administrasi adalah",
      ex4Q: "Tentukan nilai",
      ex4QEnd: "pada persamaan berikut:",
      ex4aThink: "Pikirkan: bilangan berapa yang jika dikurangi 8 hasilnya -14?",
      ex4aMethod: "Gunakan garis bilangan: dari titik",
      ex4aMethod2: ", bergerak 8 langkah ke kiri sampai di -14.",
      ex4aMeaning: "Berarti",
      ex4aMeaning2: "berada 8 langkah di sebelah kanan -14:",
      ex4bThink: "Pikirkan: dari 10, harus bergerak sejauh berapa agar sampai di -5?",
      ex4bMethod: "Jarak dari 10 ke -5 adalah 15 langkah ke kiri (arah negatif):",
      sifatP: "Penjumlahan pada bilangan bulat memiliki empat sifat penting yang perlu dipahami:",
      sifat1Badge: "Sifat 1",
      sifat1Title: "Sifat Komutatif (Pertukaran)",
      sifat1Body: "Menukar urutan dua bilangan yang dijumlahkan",
      sifat1Bold: "tidak mengubah hasilnya",
      sifat1Body2: ".",
      sifat1Ex1: "Contoh positif:",
      sifat1Ex2: "Contoh negatif:",
      sifat2Badge: "Sifat 2",
      sifat2Title: "Unsur Identitas pada Penjumlahan",
      sifat2Body: "Bilangan",
      sifat2Bold: "0 (nol)",
      sifat2Body2: "disebut unsur identitas penjumlahan karena menjumlahkan bilangan apapun dengan 0 menghasilkan bilangan itu sendiri.",
      sifat2Ex1: "Contoh positif:",
      sifat2Ex2: "Contoh negatif:",
      sifat3Badge: "Sifat 3",
      sifat3Title: "Sifat Asosiatif (Pengelompokan)",
      sifat3Body: "Cara",
      sifat3Bold: "mengelompokkan",
      sifat3Body2: "tiga atau lebih bilangan yang dijumlahkan tidak mengubah hasilnya.",
      sifat3Ex1Label: "Contoh dengan angka:",
      sifat3SameAs: "sama dengan",
      sifat3Ex2Label: "Contoh dengan bilangan negatif:",
      sifat4Badge: "Sifat 4",
      sifat4Title: "Sifat Tertutup",
      sifat4Body: "Hasil penjumlahan dua bilangan bulat",
      sifat4Bold: "selalu bilangan bulat juga",
      sifat4Body2: ". Operasi ini tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.",
      sifat4Note: "(Untuk setiap a dan b bilangan bulat, hasil a + b juga bilangan bulat)",
      sifat4PosPos: "positif + positif",
      sifat4NegNeg: "negatif + negatif",
      sifat4PosNeg: "positif + negatif",
      cara1Title: "Cara 1 — Menggunakan Garis Bilangan",
      cara1Body: "Bayangkan kamu berdiri di titik awal pada garis bilangan. Setiap angka yang dijumlahkan menentukan arah gerakmu:",
      cara1PosLabel: "Bilangan Positif (+)",
      cara1PosBody: "Bergerak ke",
      cara1PosKey: "kanan",
      cara1PosBodyEnd: "sejumlah angka tersebut",
      cara1PosEx: "Contoh: +5 → maju 5 langkah ke kanan",
      cara1NegLabel: "Bilangan Negatif (−)",
      cara1NegBody: "Bergerak ke",
      cara1NegKey: "kiri",
      cara1NegBodyEnd: "sejumlah nilai absolutnya",
      cara1NegEx: "Contoh: −3 → mundur 3 langkah ke kiri",
      cara1StepsLabel: "Langkah-langkah:",
      cara1Step1: "① Mulai dari 0",
      cara1Step2: "② Bergerak sesuai bilangan pertama",
      cara1Step3: "③ Lanjut sesuai bilangan kedua",
      cara1Step4: "④ Posisi akhir = hasil",
      cara2Title: "Cara 2 — Menggunakan Rumus",
      cara2BothPos: "Kedua positif",
      cara2BothNeg: "Kedua negatif",
      cara2DiffA: "Beda tanda,",
      cara2DiffADesc: "hasil bertanda negatif",
      cara2DiffB: "Beda tanda,",
      cara2DiffBDesc: "hasil bertanda positif",
      cara2ExBothPos: "Contoh: 3 + 5 = 8",
      cara2ExBothNeg: "Contoh: −3 + (−5) = −8",
      cara2ExDiffA: "Contoh: −7 + 3 = −4",
      cara2ExDiffB: "Contoh: −3 + 7 = 4",
      tipsQuickTitle: "Tips Cepat",
      tip1Bold: "Tanda sama → jumlahkan, pakai tanda itu.",
      tip1Ex: "Contoh: 4 + 6 = 10  |  −4 + (−6) = −10",
      tip2Bold: "Tanda beda → kurangkan nilai absolutnya, pakai tanda yang lebih besar.",
      tip2Ex: "Contoh: −8 + 5 = −3  (|−8| > |5|, hasilnya negatif)",
      tip3Bold: "Penjumlahan bersifat komutatif:",
      tip3Ex: "Urutan tidak mengubah hasil.",
      tip4Bold: "Menjumlah dengan 0 hasilnya tetap:",
      tip4Ex: "0 disebut elemen identitas penjumlahan.",
      propSummaryTitle: "Penjumlahan Bilangan Bulat Memenuhi Sifat-sifat Berikut:",
      prop1: "Komutatif",
      prop1Desc: "a + b = b + a",
      prop2: "Unsur Identitas",
      prop2Desc: "a + 0 = 0 + a = a",
      prop3: "Asosiatif",
      prop3Desc: "(a + b) + c = a + (b + c)",
      prop4: "Tertutup",
      prop4Desc: "a + b selalu bilangan bulat",
      calcTipsTitle: "Tips Menggunakan Kalkulator",
      calcTipsBody: "Pada kalkulator ilmiah, untuk menghitung",
      calcTipsBody2: ", tekan tombol:",
      calcTipsResult: "dan hasilnya akan muncul",
      summaryTitle: "➕ RANGKUMAN LENGKAP",
      summarySubtitle: "Penjumlahan Bilangan Bulat — Kelas 7",
      sum1Title: "Aturan Penjumlahan Bilangan Bulat",
      sum1Rules: [
        { label: "(+) + (+) = (+)", desc: "Dua bilangan positif dijumlah → hasilnya positif. Contoh: 8 + 5 = 13", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
        { label: "(−) + (−) = (−)", desc: "Dua bilangan negatif dijumlah → hasilnya negatif. Contoh: (−8) + (−5) = −13", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
        { label: "(+) + (−) atau (−) + (+)", desc: "Berbeda tanda → kurangi nilai mutlaknya, ambil tanda yang nilainya lebih besar. Contoh: 8 + (−5) = 3", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
        { label: "Sifat Komutatif", desc: "a + b = b + a. Urutan tidak mempengaruhi hasil penjumlahan.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
        { label: "Sifat Asosiatif", desc: "(a + b) + c = a + (b + c). Pengelompokan tidak mempengaruhi hasil.", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      ],
      sum2Title: "Tips & Trik Jitu Penjumlahan",
      sum2Tips: [
        { icon: "🎯", tip: "Bayangkan garis bilangan", detail: "Bilangan positif = langkah ke kanan. Bilangan negatif = langkah ke kiri. Mulai dari 0, jalan sesuai aturan!", color: "bg-cyan-900/30 border-cyan-500/30" },
        { icon: "⚡", tip: "Tanda sama → jumlahkan, tanda beda → kurangkan", detail: "Ini adalah rumus cepat untuk menentukan operasi yang harus dilakukan sebelum menentukan tandanya.", color: "bg-yellow-900/30 border-yellow-500/30" },
        { icon: "🔢", tip: "Gunakan nilai mutlak (|  |) untuk menghitung", detail: "Nilai mutlak mengabaikan tanda. Hitung besar angkanya dulu, baru tentukan tanda di akhir berdasarkan bilangan yang lebih besar nilai mutlaknya.", color: "bg-green-900/30 border-green-500/30" },
        { icon: "🧮", tip: "Substitusi ke soal untuk verifikasi", detail: "Setelah mendapat jawaban, substitusi kembali ke soal aslinya. Jika cocok, jawabanmu benar!", color: "bg-violet-900/30 border-violet-500/30" },
      ],
      conclusionFinal: "KESIMPULAN",
      conclusionBody: "Penjumlahan bilangan bulat adalah fondasi dari semua operasi matematika. Kunci utamanya adalah",
      conclusionBold: "memahami tanda",
      conclusionBody2: ": sama tanda berarti jumlahkan, beda tanda berarti kurangi. Dengan memahami garis bilangan, kamu bisa",
      conclusionBold2: "memvisualisasikan setiap operasi",
      conclusionBody3: "dan tidak akan pernah salah lagi!",
      tags: ["Tanda Sama = Jumlah", "Tanda Beda = Kurang", "Nilai Mutlak", "Garis Bilangan", "Komutatif & Asosiatif"],
      nextLabel: "🚀 Lanjut ke Pengurangan untuk melengkapi pemahamanmu!",
      backBtn: "Kembali ke Bilangan Bulat",
    },
    en: {
      title: "ADDITION OF INTEGERS",
      subtitle: "Grade 7 - Integers - Mathematics",
      secIntroTitle: "Why Do We Need Negative Numbers?",
      secKonsepTitle: "Core Concept Summary: Addition",
      secContohTitle: "Worked Examples",
      secSifatTitle: "Properties of Integer Addition",
      secKesimpulanTitle: "Conclusion & Tips",
      introP: "In primary school, we learned about",
      introBold1: "natural numbers",
      introP2: "(1, 2, 3, 4, ...) and",
      introBold2: "whole numbers",
      introP3: "(0, 1, 2, 3, ...). But it turns out these two types of numbers are not enough to describe every situation in the real world.",
      exampleBold: "Real-world example:",
      exampleBody: "Imagine you are checking the weather forecast in Japan during winter. The temperature shown is",
      exampleBody2: ". How do you write a temperature below freezing (0°C) if we only have positive numbers?",
      imgAlt: "Thermometer showing temperature below zero",
      imgCaption: "Source: Number line illustration",
      negNumBold: "negative numbers",
      negNumP: "This is the reason",
      negNumP2: "were invented. Negative numbers are used to represent values below zero, such as:",
      listTemp: "Temperature below",
      listTempEnd: "(e.g.",
      listTempEnd2: "at the peak of the Himalayas)",
      listDepth: "Depth below sea level (e.g.",
      listDepthEnd: "metres for ocean trenches)",
      listDebt: "Debts or losses in finance",
      defBold: "Definition:",
      defIntegerBold: "Integers",
      defBody: "are the set of numbers consisting of negative integers (..., -3, -2, -1), zero (0), and positive integers (1, 2, 3, ...).",
      konsepP: "The easiest way to understand integer addition is to imagine a",
      konsepBold: "number line",
      konsepP2: ". Imagine you are standing at zero and walking according to instructions.",
      ruleTitle: "Movement Rules on the Number Line:",
      rulePos: "Positive number (+)",
      rulePosBody: "= move to the",
      rulePosKey: "right",
      ruleNeg: "Negative number (-)",
      ruleNegBody: "= move to the",
      ruleNegKey: "left",
      numberLineLabel: "Number Line",
      formulaTitle: "Integer Addition Formulas:",
      formulaBothPos: "Both numbers",
      formulaBothPosBold: "positive",
      formulaIfAGtB: "If",
      formulaIfBGtA: "If",
      formulaBothNeg: "Both numbers negative:",
      tipsBold: "Easy Tip:",
      tipsBody: "When adding two numbers with different signs, subtract their absolute values, then use the sign of the number with the larger absolute value.",
      badgeEasy: "Easy",
      badgeMedium: "Medium",
      badgeHard: "Hard",
      badgeBonus: "BONUS",
      ex1Label: "Example 1",
      ex2Label: "Example 2",
      ex3Label: "Example 3",
      ex4Label: "Example 4: Finding the Unknown Value",
      solutionLabel: "SOLUTION:",
      answerLabel: "Answer:",
      ex1Q: "Calculate",
      ex1QEnd: "using a number line!",
      ex1S1: "Step 1:",
      ex1S1Body: "Start at 0, move 8 units to the",
      ex1S1Bold: "right",
      ex1S1End: "(since 8 is positive).",
      ex1S2: "Step 2:",
      ex1S2Body: "From 8, move 3 units to the",
      ex1S2Bold: "left",
      ex1S2End: "(since -3 is negative).",
      ex1S3: "Step 3:",
      ex1S3Body: "The final position is at",
      ex1VizLabel: "Number Line Visualization",
      ex1LegRight: "+8 to the right",
      ex1LegLeft: "−3 to the left",
      ex1LegResult: "result = 5",
      ex1Conclusion: "Therefore,",
      ex2Q: "Calculate the following additions:",
      ex2aBody: "Since 27 > 12 and 27 is negative:",
      ex2bBody: "Since 29 > 14 and 29 is positive:",
      ex2cBody: "Both numbers are negative, so add their absolute values and keep the negative sign:",
      ex3Q1: "In an ice cream factory, the storage room temperature is",
      ex3Q2: ". The administration room temperature is",
      ex3Q3: "higher than the storage room. What is the temperature in the administration room?",
      ex3S1: "Step 1:",
      ex3S1Body: "Identify the known information:",
      ex3Ref1: "Storage temperature =",
      ex3Ref2: "Temperature difference =",
      ex3Ref2End: "higher",
      ex3S2: "Step 2:",
      ex3S2Body: "Write the mathematical model:",
      ex3S3: "Step 3:",
      ex3S3Body: "Calculate the result:",
      ex3Calc: "Since 41 > 17 and 41 is positive:",
      katexEx3: "\\text{Admin temp} = -17 + 41",
      ex3Conclusion: "Therefore, the temperature in the administration room is",
      ex4Q: "Find the value of",
      ex4QEnd: "in the following equations:",
      ex4aThink: "Think: what number, when decreased by 8, gives -14?",
      ex4aMethod: "Use the number line: from",
      ex4aMethod2: ", move 8 steps to the left to reach -14.",
      ex4aMeaning: "So",
      ex4aMeaning2: "is 8 steps to the right of -14:",
      ex4bThink: "Think: from 10, how far must you move to reach -5?",
      ex4bMethod: "The distance from 10 to -5 is 15 steps to the left (negative direction):",
      sifatP: "Integer addition has four important properties to understand:",
      sifat1Badge: "Property 1",
      sifat1Title: "Commutative Property",
      sifat1Body: "Swapping the order of two numbers being added",
      sifat1Bold: "does not change the result",
      sifat1Body2: ".",
      sifat1Ex1: "Positive example:",
      sifat1Ex2: "Negative example:",
      sifat2Badge: "Property 2",
      sifat2Title: "Identity Element for Addition",
      sifat2Body: "The number",
      sifat2Bold: "0 (zero)",
      sifat2Body2: "is called the additive identity because adding any number to 0 gives that number itself.",
      sifat2Ex1: "Positive example:",
      sifat2Ex2: "Negative example:",
      sifat3Badge: "Property 3",
      sifat3Title: "Associative Property",
      sifat3Body: "The way you",
      sifat3Bold: "group",
      sifat3Body2: "three or more numbers being added does not change the result.",
      sifat3Ex1Label: "Example with numbers:",
      sifat3SameAs: "equals",
      sifat3Ex2Label: "Example with negative numbers:",
      sifat4Badge: "Property 4",
      sifat4Title: "Closure Property",
      sifat4Body: "The result of adding two integers is",
      sifat4Bold: "always an integer",
      sifat4Body2: ". This operation never produces a number outside the set of integers.",
      sifat4Note: "(For every a and b integer, the result a + b is also an integer)",
      sifat4PosPos: "positive + positive",
      sifat4NegNeg: "negative + negative",
      sifat4PosNeg: "positive + negative",
      cara1Title: "Method 1 — Using the Number Line",
      cara1Body: "Imagine you are standing at the starting point on the number line. Each number you add determines your direction of movement:",
      cara1PosLabel: "Positive Number (+)",
      cara1PosBody: "Move to the",
      cara1PosKey: "right",
      cara1PosBodyEnd: "by that amount",
      cara1PosEx: "Example: +5 → move 5 steps to the right",
      cara1NegLabel: "Negative Number (−)",
      cara1NegBody: "Move to the",
      cara1NegKey: "left",
      cara1NegBodyEnd: "by its absolute value",
      cara1NegEx: "Example: −3 → step back 3 to the left",
      cara1StepsLabel: "Steps:",
      cara1Step1: "① Start from 0",
      cara1Step2: "② Move according to the first number",
      cara1Step3: "③ Continue according to the second number",
      cara1Step4: "④ Final position = result",
      cara2Title: "Method 2 — Using Formulas",
      cara2BothPos: "Both positive",
      cara2BothNeg: "Both negative",
      cara2DiffA: "Different signs,",
      cara2DiffADesc: "negative result",
      cara2DiffB: "Different signs,",
      cara2DiffBDesc: "positive result",
      cara2ExBothPos: "Example: 3 + 5 = 8",
      cara2ExBothNeg: "Example: −3 + (−5) = −8",
      cara2ExDiffA: "Example: −7 + 3 = −4",
      cara2ExDiffB: "Example: −3 + 7 = 4",
      tipsQuickTitle: "Quick Tips",
      tip1Bold: "Same sign → add, use that sign.",
      tip1Ex: "Example: 4 + 6 = 10  |  −4 + (−6) = −10",
      tip2Bold: "Different signs → subtract absolute values, use the sign of the larger.",
      tip2Ex: "Example: −8 + 5 = −3  (|−8| > |5|, result is negative)",
      tip3Bold: "Addition is commutative:",
      tip3Ex: "Order does not change the result.",
      tip4Bold: "Adding 0 leaves the number unchanged:",
      tip4Ex: "0 is called the additive identity element.",
      propSummaryTitle: "Integer Addition Satisfies the Following Properties:",
      prop1: "Commutative",
      prop1Desc: "a + b = b + a",
      prop2: "Identity Element",
      prop2Desc: "a + 0 = 0 + a = a",
      prop3: "Associative",
      prop3Desc: "(a + b) + c = a + (b + c)",
      prop4: "Closure",
      prop4Desc: "a + b is always an integer",
      calcTipsTitle: "Calculator Tips",
      calcTipsBody: "On a scientific calculator, to compute",
      calcTipsBody2: ", press:",
      calcTipsResult: "and the result will show",
      summaryTitle: "➕ COMPLETE SUMMARY",
      summarySubtitle: "Integer Addition — Grade 7",
      sum1Title: "Rules of Integer Addition",
      sum1Rules: [
        { label: "(+) + (+) = (+)", desc: "Two positive numbers added → positive result. Example: 8 + 5 = 13", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
        { label: "(−) + (−) = (−)", desc: "Two negative numbers added → negative result. Example: (−8) + (−5) = −13", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
        { label: "(+) + (−) or (−) + (+)", desc: "Different signs → subtract absolute values, take sign of the larger. Example: 8 + (−5) = 3", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
        { label: "Commutative Property", desc: "a + b = b + a. Order does not affect the result.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
        { label: "Associative Property", desc: "(a + b) + c = a + (b + c). Grouping does not affect the result.", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      ],
      sum2Tips: [
        { icon: "🎯", tip: "Visualise the number line", detail: "Positive number = step right. Negative number = step left. Start from 0 and follow the rules!", color: "bg-cyan-900/30 border-cyan-500/30" },
        { icon: "⚡", tip: "Same sign → add; different sign → subtract", detail: "This is the quick formula for determining the operation before deciding the sign.", color: "bg-yellow-900/30 border-yellow-500/30" },
        { icon: "🔢", tip: "Use absolute value (|  |) to calculate", detail: "Absolute value ignores the sign. Calculate the magnitude first, then determine the sign at the end based on the number with the larger absolute value.", color: "bg-green-900/30 border-green-500/30" },
        { icon: "🧮", tip: "Substitute back to verify", detail: "After getting your answer, substitute it back into the original equation. If it matches, your answer is correct!", color: "bg-violet-900/30 border-violet-500/30" },
      ],
      sum2Title: "Smart Tips & Tricks for Addition",
      conclusionFinal: "CONCLUSION",
      conclusionBody: "Integer addition is the foundation of all mathematical operations. The key is",
      conclusionBold: "understanding signs",
      conclusionBody2: ": same sign means add, different sign means subtract. By understanding the number line, you can",
      conclusionBold2: "visualise every operation",
      conclusionBody3: "and never get it wrong again!",
      tags: ["Same Sign = Add", "Different Sign = Subtract", "Absolute Value", "Number Line", "Commutative & Associative"],
      nextLabel: "🚀 Continue to Subtraction to complete your understanding!",
      backBtn: "Back to Integers",
    },
    ja: {
      title: "整数の足し算",
      subtitle: "中学1年 - 整数 - 数学",
      secIntroTitle: "なぜ負の数が必要なのか？",
      secKonsepTitle: "概念まとめ：足し算",
      secContohTitle: "例題と解説",
      secSifatTitle: "整数の足し算の性質",
      secKesimpulanTitle: "結論とヒント",
      introP: "小学校では",
      introBold1: "自然数",
      introP2: "（1, 2, 3, 4, ...）と",
      introBold2: "全体数",
      introP3: "（0, 1, 2, 3, ...）を学びましたが、実は現実の状況をすべて表すには、これらの2種類の数だけでは十分ではありませんでした。",
      exampleBold: "身近な例：",
      exampleBody: "冬の日本の天気予報を見ていると、気温が",
      exampleBody2: "と表示されていました。正の数しかない場合、氷点下（0°C以下）の温度をどうやって書きますか？",
      imgAlt: "ゼロ以下の温度を示す温度計",
      imgCaption: "出典：数直線イラスト",
      negNumBold: "負の数",
      negNumP: "これが",
      negNumP2: "が発明された理由です。負の数はゼロ以下の値を表すために使われます：",
      listTemp: "0°C以下の気温（例：",
      listTempEnd: "ヒマラヤ山頂の",
      listTempEnd2: "）",
      listDepth: "海面以下の深さ（例：海溝の",
      listDepthEnd: "メートル）",
      listDebt: "財政における借金や損失",
      defBold: "定義：",
      defIntegerBold: "整数",
      defBody: "は、負の整数（..., -3, -2, -1）、ゼロ（0）、正の整数（1, 2, 3, ...）からなる数の集まりです。",
      konsepP: "整数の足し算を理解する一番簡単な方法は",
      konsepBold: "数直線",
      konsepP2: "を想像することです。ゼロの位置に立って、指示に従って歩くと思ってください。",
      ruleTitle: "数直線での移動ルール：",
      rulePos: "正の数 (+)",
      rulePosBody: "=",
      rulePosKey: "右",
      ruleNeg: "負の数 (-)",
      ruleNegBody: "=",
      ruleNegKey: "左",
      numberLineLabel: "数直線",
      formulaTitle: "整数の足し算の公式：",
      formulaBothPos: "両方",
      formulaBothPosBold: "正の数",
      formulaIfAGtB: "a > b のとき：",
      formulaIfBGtA: "b > a のとき：",
      formulaBothNeg: "両方の数が負：",
      tipsBold: "簡単なヒント：",
      tipsBody: "符号が異なる2つの数を足す場合、絶対値を引いて、絶対値が大きい方の符号を使います。",
      badgeEasy: "基本",
      badgeMedium: "標準",
      badgeHard: "発展",
      badgeBonus: "ボーナス",
      ex1Label: "例題 1",
      ex2Label: "例題 2",
      ex3Label: "例題 3",
      ex4Label: "例題 4：未知の値を求める",
      solutionLabel: "解説：",
      answerLabel: "答え：",
      ex1Q: "数直線を使って",
      ex1QEnd: "を計算せよ！",
      ex1S1: "手順 1：",
      ex1S1Body: "0から出発して、8単位",
      ex1S1Bold: "右",
      ex1S1End: "に移動する（8は正の数なので）。",
      ex1S2: "手順 2：",
      ex1S2Body: "8から3単位",
      ex1S2Bold: "左",
      ex1S2End: "に移動する（-3は負の数なので）。",
      ex1S3: "手順 3：",
      ex1S3Body: "最終位置は",
      ex1VizLabel: "数直線での視覚化",
      ex1LegRight: "+8 右へ",
      ex1LegLeft: "−3 左へ",
      ex1LegResult: "結果 = 5",
      ex1Conclusion: "よって、",
      ex2Q: "次の足し算を計算せよ：",
      ex2aBody: "27 > 12 で 27 は負の数なので：",
      ex2bBody: "29 > 14 で 29 は正の数なので：",
      ex2cBody: "両方とも負の数なので、絶対値を足して負の符号をつける：",
      ex3Q1: "あるアイスクリーム工場の貯蔵庫の温度は",
      ex3Q2: "です。管理室の温度は貯蔵庫より",
      ex3Q3: "高いです。管理室の温度はいくらですか？",
      ex3S1: "手順 1：",
      ex3S1Body: "既知の情報を整理する：",
      ex3Ref1: "貯蔵庫の温度 =",
      ex3Ref2: "温度差 =",
      ex3Ref2End: "高い",
      ex3S2: "手順 2：",
      ex3S2Body: "数式を立てる：",
      ex3S3: "手順 3：",
      ex3S3Body: "計算する：",
      ex3Calc: "41 > 17 で 41 は正の数なので：",
      katexEx3: "\\text{管理室} = -17 + 41",
      ex3Conclusion: "よって、管理室の温度は",
      ex4Q: "次の方程式で",
      ex4QEnd: "の値を求めよ：",
      ex4aThink: "考えよう：8を引いたら−14になる数は何？",
      ex4aMethod: "数直線を使う：",
      ex4aMethod2: "から8ステップ左に移動すると−14になる。",
      ex4aMeaning: "つまり",
      ex4aMeaning2: "は−14の8ステップ右にある：",
      ex4bThink: "考えよう：10から−5まで何ステップ動けばよいか？",
      ex4bMethod: "10から−5までの距離は左に15ステップ（負の方向）：",
      sifatP: "整数の足し算には4つの重要な性質があります：",
      sifat1Badge: "性質 1",
      sifat1Title: "交換法則",
      sifat1Body: "2つの数を足す順序を入れ替えても",
      sifat1Bold: "結果は変わりません",
      sifat1Body2: "。",
      sifat1Ex1: "正の例：",
      sifat1Ex2: "負の例：",
      sifat2Badge: "性質 2",
      sifat2Title: "加法の単位元",
      sifat2Body: "",
      sifat2Bold: "0（ゼロ）",
      sifat2Body2: "は加法の単位元と呼ばれます。どんな数に0を足しても、その数自身になるからです。",
      sifat2Ex1: "正の例：",
      sifat2Ex2: "負の例：",
      sifat3Badge: "性質 3",
      sifat3Title: "結合法則",
      sifat3Body: "3つ以上の数を足すとき、数を",
      sifat3Bold: "グループ化する方法",
      sifat3Body2: "を変えても結果は変わりません。",
      sifat3Ex1Label: "数の例：",
      sifat3SameAs: "と等しい",
      sifat3Ex2Label: "負の数の例：",
      sifat4Badge: "性質 4",
      sifat4Title: "閉包性",
      sifat4Body: "2つの整数の和は",
      sifat4Bold: "常に整数",
      sifat4Body2: "です。この演算は整数の集合の外の数を生み出しません。",
      sifat4Note: "（a と b がすべて整数のとき、a + b も整数）",
      sifat4PosPos: "正 + 正",
      sifat4NegNeg: "負 + 負",
      sifat4PosNeg: "正 + 負",
      cara1Title: "方法 1 — 数直線を使う",
      cara1Body: "数直線の出発点に立っていると想像してください。足す数ごとに移動方向が決まります：",
      cara1PosLabel: "正の数 (+)",
      cara1PosBody: "",
      cara1PosKey: "右",
      cara1PosBodyEnd: "にその分だけ移動",
      cara1PosEx: "例：+5 → 右に5ステップ移動",
      cara1NegLabel: "負の数 (−)",
      cara1NegBody: "",
      cara1NegKey: "左",
      cara1NegBodyEnd: "にその絶対値分だけ移動",
      cara1NegEx: "例：−3 → 左に3ステップ戻る",
      cara1StepsLabel: "手順：",
      cara1Step1: "① 0から出発",
      cara1Step2: "② 1つ目の数に従って移動",
      cara1Step3: "③ 2つ目の数に従って移動",
      cara1Step4: "④ 最終位置 = 答え",
      cara2Title: "方法 2 — 公式を使う",
      cara2BothPos: "両方正",
      cara2BothNeg: "両方負",
      cara2DiffA: "符号が異なる、",
      cara2DiffADesc: "負の結果",
      cara2DiffB: "符号が異なる、",
      cara2DiffBDesc: "正の結果",
      cara2ExBothPos: "例：3 + 5 = 8",
      cara2ExBothNeg: "例：−3 + (−5) = −8",
      cara2ExDiffA: "例：−7 + 3 = −4",
      cara2ExDiffB: "例：−3 + 7 = 4",
      tipsQuickTitle: "クイックヒント",
      tip1Bold: "同じ符号 → 足して、その符号をつける。",
      tip1Ex: "例：4 + 6 = 10  |  −4 + (−6) = −10",
      tip2Bold: "異なる符号 → 絶対値を引いて、大きい方の符号をつける。",
      tip2Ex: "例：−8 + 5 = −3  （|−8| > |5| なので負）",
      tip3Bold: "足し算は交換法則が成り立つ：",
      tip3Ex: "順序は結果に影響しない。",
      tip4Bold: "0を足しても変わらない：",
      tip4Ex: "0は加法の単位元と呼ばれる。",
      propSummaryTitle: "整数の足し算が満たす性質：",
      prop1: "交換法則",
      prop1Desc: "a + b = b + a",
      prop2: "単位元",
      prop2Desc: "a + 0 = 0 + a = a",
      prop3: "結合法則",
      prop3Desc: "(a + b) + c = a + (b + c)",
      prop4: "閉包性",
      prop4Desc: "a + b は常に整数",
      calcTipsTitle: "電卓のヒント",
      calcTipsBody: "関数電卓で",
      calcTipsBody2: "を計算するには：",
      calcTipsResult: "と入力すると結果が",
      summaryTitle: "➕ 完全まとめ",
      summarySubtitle: "整数の足し算 — 中学1年",
      sum1Title: "整数の足し算のルール",
      sum1Rules: [
        { label: "(+) + (+) = (+)", desc: "正の数同士を足す → 正の結果。例：8 + 5 = 13", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
        { label: "(−) + (−) = (−)", desc: "負の数同士を足す → 負の結果。例：(−8) + (−5) = −13", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
        { label: "(+) + (−) または (−) + (+)", desc: "符号が異なる → 絶対値を引いて、大きい方の符号をつける。例：8 + (−5) = 3", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
        { label: "交換法則", desc: "a + b = b + a。順序は結果に影響しない。", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
        { label: "結合法則", desc: "(a + b) + c = a + (b + c)。グループ化は結果に影響しない。", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      ],
      sum2Tips: [
        { icon: "🎯", tip: "数直線をイメージする", detail: "正の数 = 右へのステップ。負の数 = 左へのステップ。0から始めてルールに従って歩こう！", color: "bg-cyan-900/30 border-cyan-500/30" },
        { icon: "⚡", tip: "同じ符号 → 足す、異なる符号 → 引く", detail: "これは符号を決める前に、どの演算を行うべきかを素早く判断するための公式です。", color: "bg-yellow-900/30 border-yellow-500/30" },
        { icon: "🔢", tip: "絶対値（|  |）を使って計算する", detail: "絶対値は符号を無視します。まず数の大きさを計算して、最後に絶対値が大きい方の符号をつけます。", color: "bg-green-900/30 border-green-500/30" },
        { icon: "🧮", tip: "代入して確認する", detail: "答えが出たら、元の式に代入して確認しましょう。合っていれば正解です！", color: "bg-violet-900/30 border-violet-500/30" },
      ],
      sum2Title: "足し算のスマートなヒントとコツ",
      conclusionFinal: "結論",
      conclusionBody: "整数の足し算はすべての数学の演算の基礎です。鍵は",
      conclusionBold: "符号を理解すること",
      conclusionBody2: "：同じ符号なら足す、異なる符号なら引く。数直線を理解することで、",
      conclusionBold2: "すべての演算を視覚化",
      conclusionBody3: "でき、もう間違えることはありません！",
      tags: ["同じ符号 = 足す", "異なる符号 = 引く", "絶対値", "数直線", "交換法則・結合法則"],
      nextLabel: "🚀 引き算へ進んで理解を深めよう！",
      backBtn: "整数に戻る",
    },
  };

  const c = translations[language as keyof typeof translations] ?? translations.id;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {c.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {c.subtitle}
        </p>

        {/* Buku Animasi shortcut */}
        <button
          onClick={() => navigate("/materi-matematika/kelas-7/bilangan-bulat/penjumlahan/buku-animasi")}
          className="w-full mb-6 flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-indigo-900/40 hover:from-cyan-800/50 hover:via-blue-800/40 hover:to-indigo-800/40 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎬</span>
            <div className="text-left">
              <p className="font-display font-bold text-sm text-cyan-200 leading-tight">BUKU ANIMASI MATEMATIKA</p>
              <p className="font-body text-xs text-cyan-300/60 mt-0.5">Lihat busur animasi interaktif di garis bilangan</p>
            </div>
          </div>
          <span className="text-cyan-400/60 group-hover:text-cyan-300 transition-colors text-lg">→</span>
        </button>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{c.secIntroTitle}</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.introP} <strong className="text-primary">{c.introBold1}</strong>{" "}{c.introP2}{" "}
                  <strong className="text-primary">{c.introBold2}</strong>{" "}{c.introP3}
                </p>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.exampleBold}</strong>{" "}{c.exampleBody}{" "}
                    <InlineMath math="-5°C" />{c.exampleBody2}
                  </p>
                  <figure className="flex flex-col items-center gap-2">
                    <img
                      src="/images/termometer-penjumlahan.png"
                      alt={c.imgAlt}
                      className="w-full max-w-xl rounded-lg shadow-lg border border-white/10"
                    />
                    <figcaption className="font-body text-xs text-cyan-200/60 text-center italic max-w-xl">
                      {c.imgCaption}
                    </figcaption>
                  </figure>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.negNumP} <strong className="text-primary">{c.negNumBold}</strong>{c.negNumP2}
                </p>

                <ul className="font-body text-sm text-white/70 space-y-2 ml-4">
                  <li>{c.listTemp} <InlineMath math="0°C" /> ({c.listTempEnd} <InlineMath math="-10°C" /> {c.listTempEnd2})</li>
                  <li>{c.listDepth} <InlineMath math="-80" /> {c.listDepthEnd}</li>
                  <li>{c.listDebt}</li>
                </ul>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>{c.defBold}</strong>{" "}
                    <strong className="text-white">{c.defIntegerBold}</strong>{" "}{c.defBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Konsep Penjumlahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{c.secKonsepTitle}</span>
              </div>
              {expandedSections.includes("konsep") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.konsepP} <strong className="text-primary">{c.konsepBold}</strong>{c.konsepP2}
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.ruleTitle}</p>
                  <ul className="font-body text-sm text-green-200 space-y-1">
                    <li><strong>{c.rulePos}</strong>{" "}{c.rulePosBody}{" "}<strong>{c.rulePosKey}</strong></li>
                    <li><strong>{c.ruleNeg}</strong>{" "}{c.ruleNegBody}{" "}<strong>{c.ruleNegKey}</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/20">
                  <p className={`text-xs text-center mb-2 font-body ${lightMode ? "text-foreground/60" : "text-yellow-300/70"}`}>{c.numberLineLabel}</p>
                  <NumberLineSVG lightMode={lightMode} />
                </div>

                <DirectionDemoSVG lightMode={lightMode} />

                <InteraktifPenjumlahan lightMode={lightMode} />

                <PolaPercobaanAnim />

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{c.formulaTitle}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 border border-green-500/20">
                      <p className="text-white/70 text-xs mb-1">{c.formulaBothPos} <strong className="text-green-400">{c.formulaBothPosBold}</strong>:</p>
                      <BlockMath math="a + b = a + b" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">{c.formulaIfAGtB} <InlineMath math="a > b" /> :</p>
                      <BlockMath math="-a + b = -(a - b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">{c.formulaIfBGtA} <InlineMath math="b > a" /> :</p>
                      <BlockMath math="-a + b = b - a" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">{c.formulaBothNeg}</p>
                      <BlockMath math="-a + (-b) = -(a + b)" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.tipsBold}</strong>{" "}{c.tipsBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{c.secContohTitle}</span>
              </div>
              {expandedSections.includes("contoh") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{c.badgeEasy}</span>
                    <span className="font-body font-semibold text-white">{c.ex1Label}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      {c.ex1Q} <InlineMath math="8 + (-3)" /> {c.ex1QEnd}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{c.ex1S1}</strong> {c.ex1S1Body} <strong className="text-green-400">{c.ex1S1Bold}</strong> {c.ex1S1End}</p>
                      <p><strong>{c.ex1S2}</strong> {c.ex1S2Body} <strong className="text-red-400">{c.ex1S2Bold}</strong> {c.ex1S2End}</p>
                      <p><strong>{c.ex1S3}</strong> {c.ex1S3Body} <strong className="text-cyan-300">5</strong>.</p>

                      <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20 mt-2">
                        <p className="text-yellow-300/70 text-xs text-center mb-1 font-body">{c.ex1VizLabel}</p>
                        <NumberLineContoh1SVG />
                        <div className="flex flex-wrap gap-3 justify-center mt-1 text-xs font-body">
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-green-400"></span> {c.ex1LegRight}</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-red-400"></span> {c.ex1LegLeft}</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full border-2 border-cyan-300"></span> {c.ex1LegResult}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded p-3 mt-2">
                        <BlockMath math="8 + (-3) = 8 - 3 = 5" />
                      </div>
                      <p className="text-primary font-semibold">{c.ex1Conclusion} <InlineMath math="8 + (-3) = 5" /></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{c.badgeMedium}</span>
                    <span className="font-body font-semibold text-white">{c.ex2Label}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">{c.ex2Q}</p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="-27 + 12" /></p>
                      <p className="text-white/80">b. <InlineMath math="-14 + 29" /></p>
                      <p className="text-white/80">c. <InlineMath math="-36 + (-58)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="-27 + 12" /></p>
                        <p className="mb-1">{c.ex2aBody}</p>
                        <BlockMath math="-27 + 12 = -(27 - 12) = -15" />
                        <p className="text-primary">{c.answerLabel} <InlineMath math="-15" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="-14 + 29" /></p>
                        <p className="mb-1">{c.ex2bBody}</p>
                        <BlockMath math="-14 + 29 = 29 - 14 = 15" />
                        <p className="text-primary">{c.answerLabel} <InlineMath math="15" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">c. <InlineMath math="-36 + (-58)" /></p>
                        <p className="mb-1">{c.ex2cBody}</p>
                        <BlockMath math="-36 + (-58) = -(36 + 58) = -94" />
                        <p className="text-primary">{c.answerLabel} <InlineMath math="-94" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{c.badgeHard}</span>
                    <span className="font-body font-semibold text-white">{c.ex3Label}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      {c.ex3Q1} <InlineMath math="-17°C" />{c.ex3Q2} <InlineMath math="41°" /> {c.ex3Q3}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{c.ex3S1}</strong> {c.ex3S1Body}</p>
                      <ul className="ml-4 space-y-1">
                        <li>{c.ex3Ref1} <InlineMath math="-17°C" /></li>
                        <li>{c.ex3Ref2} <InlineMath math="41°" /> {c.ex3Ref2End}</li>
                      </ul>
                      <p><strong>{c.ex3S2}</strong> {c.ex3S2Body}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={c.katexEx3} />
                      </div>
                      <p><strong>{c.ex3S3}</strong> {c.ex3S3Body}</p>
                      <p className="ml-4">{c.ex3Calc}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-17 + 41 = 41 - 17 = 24" />
                      </div>
                      <p className="text-primary font-semibold">{c.ex3Conclusion} <InlineMath math="24°C" /></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 4 - Bonus */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">{c.badgeBonus}</span>
                    <span className="font-body font-semibold text-white">{c.ex4Label}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      {c.ex4Q} <InlineMath math="n" /> {c.ex4QEnd}
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="n + (-8) = -14" /></p>
                      <p className="text-white/80">b. <InlineMath math="10 + n = -5" /></p>
                    </div>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="n + (-8) = -14" /></p>
                        <p className="mb-1">{c.ex4aThink}</p>
                        <p className="mb-1">{c.ex4aMethod} <InlineMath math="n" /> {c.ex4aMethod2}</p>
                        <p className="mb-1">{c.ex4aMeaning} <InlineMath math="n" /> {c.ex4aMeaning2}</p>
                        <BlockMath math="n = -14 + 8 = -6" />
                        <p className="text-primary">{c.answerLabel} <InlineMath math="n = -6" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="10 + n = -5" /></p>
                        <p className="mb-1">{c.ex4bThink}</p>
                        <p className="mb-1">{c.ex4bMethod}</p>
                        <BlockMath math="n = -5 - 10 = -15" />
                        <p className="text-primary">{c.answerLabel} <InlineMath math="n = -15" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Sifat-sifat */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifat")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{c.secSifatTitle}</span>
              </div>
              {expandedSections.includes("sifat") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("sifat") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">{c.sifatP}</p>

                {/* Sifat 1: Komutatif */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat1Badge}</span>
                    <p className="font-body text-sm font-bold text-blue-300">{c.sifat1Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat1Body} <strong className="text-white">{c.sifat1Bold}</strong>{c.sifat1Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a + b = b + a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat1Ex1}</p>
                      <InlineMath math="3 + 5 = 5 + 3 = 8" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat1Ex2}</p>
                      <InlineMath math="-7 + 4 = 4 + (-7) = -3" />
                    </div>
                  </div>
                </div>

                {/* Sifat 2: Unsur Identitas */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat2Badge}</span>
                    <p className="font-body text-sm font-bold text-green-300">{c.sifat2Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat2Body} <strong className="text-white">{c.sifat2Bold}</strong>{" "}{c.sifat2Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a + 0 = 0 + a = a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat2Ex1}</p>
                      <InlineMath math="9 + 0 = 0 + 9 = 9" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat2Ex2}</p>
                      <InlineMath math="-6 + 0 = 0 + (-6) = -6" />
                    </div>
                  </div>
                </div>

                {/* Sifat 3: Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat3Badge}</span>
                    <p className="font-body text-sm font-bold text-purple-300">{c.sifat3Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat3Body} <strong className="text-white">{c.sifat3Bold}</strong>{" "}{c.sifat3Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="(a + b) + c = a + (b + c)" />
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-1">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">{c.sifat3Ex1Label}</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(2 + 3) + 4 = 5 + 4 = 9" /></div>
                      <div className="text-white/40 text-xs">{c.sifat3SameAs}</div>
                      <div><InlineMath math="2 + (3 + 4) = 2 + 7 = 9" /></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">{c.sifat3Ex2Label}</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(-5 + 3) + (-2) = -2 + (-2) = -4" /></div>
                      <div className="text-white/40 text-xs">{c.sifat3SameAs}</div>
                      <div><InlineMath math="-5 + (3 + (-2)) = -5 + 1 = -4" /></div>
                    </div>
                  </div>
                </div>

                {/* Sifat 4: Tertutup */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat4Badge}</span>
                    <p className="font-body text-sm font-bold text-orange-300">{c.sifat4Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat4Body} <strong className="text-white">{c.sifat4Bold}</strong>{c.sifat4Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="\forall\, a, b \in \mathbb{Z},\quad a + b \in \mathbb{Z}" />
                  </div>
                  <p className="font-body text-xs text-white/50 text-center mb-2">{c.sifat4Note}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat4PosPos}</p>
                      <InlineMath math="4 + 6 = 10 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat4NegNeg}</p>
                      <InlineMath math="-3 + (-5) = -8 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat4PosNeg}</p>
                      <InlineMath math="7 + (-4) = 3 \in \mathbb{Z}" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section: Kesimpulan dan Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="font-body font-semibold text-white">{c.secKesimpulanTitle}</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">

                {/* Cara 1 */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {c.cara1Title}
                  </p>
                  <p className="font-body text-sm text-white/80 mb-3 leading-relaxed">{c.cara1Body}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-green-300 text-2xl font-bold mb-1">→</p>
                      <p className="font-body text-sm font-semibold text-green-300">{c.cara1PosLabel}</p>
                      <p className="font-body text-xs text-green-200/80 mt-1">{c.cara1PosBody} <strong>{c.cara1PosKey}</strong> {c.cara1PosBodyEnd}</p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">{c.cara1PosEx}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                      <p className="text-red-300 text-2xl font-bold mb-1">←</p>
                      <p className="font-body text-sm font-semibold text-red-300">{c.cara1NegLabel}</p>
                      <p className="font-body text-xs text-red-200/80 mt-1">{c.cara1NegBody} <strong>{c.cara1NegKey}</strong> {c.cara1NegBodyEnd}</p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">{c.cara1NegEx}</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3 text-center">
                    <p className="font-body text-xs text-white/60">{c.cara1StepsLabel}</p>
                    <p className="font-body text-sm text-white/90 mt-1">
                      <span className="text-white font-semibold">{c.cara1Step1}</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-green-300 font-semibold">{c.cara1Step2}</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-primary font-semibold">{c.cara1Step3}</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-cyan-300 font-semibold">{c.cara1Step4}</span>
                    </p>
                  </div>
                </div>

                {/* Cara 2 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> {c.cara2Title}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-green-500/20">
                      <p className="font-body text-xs text-green-300 font-semibold mb-1">{c.cara2BothPos}</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center"><InlineMath math="a + b = a + b" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExBothPos}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-red-500/20">
                      <p className="font-body text-xs text-red-300 font-semibold mb-1">{c.cara2BothNeg}</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center"><InlineMath math="-a + (-b) = -(a+b)" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExBothNeg}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20">
                      <p className="font-body text-xs text-yellow-300 font-semibold mb-1">{c.cara2DiffA} <InlineMath math="|a| > |b|" /></p>
                      <p className="font-body text-xs text-white/60 mb-2">{c.cara2DiffADesc}</p>
                      <div className="text-center"><InlineMath math="-a + b = -(a-b)" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExDiffA}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-blue-500/20">
                      <p className="font-body text-xs text-blue-300 font-semibold mb-1">{c.cara2DiffB} <InlineMath math="|b| > |a|" /></p>
                      <p className="font-body text-xs text-white/60 mb-2">{c.cara2DiffBDesc}</p>
                      <div className="text-center"><InlineMath math="-a + b = b - a" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExDiffB}</p>
                    </div>
                  </div>
                </div>

                {/* Tips Cepat */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> {c.tipsQuickTitle}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip1Bold}</strong><br/>
                        <span className="text-white/60 text-xs">{c.tip1Ex}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip2Bold}</strong><br/>
                        <span className="text-white/60 text-xs">{c.tip2Ex}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip3Bold}</strong> <InlineMath math="a + b = b + a" /><br/>
                        <span className="text-white/60 text-xs">{c.tip3Ex}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip4Bold}</strong> <InlineMath math="a + 0 = a" /><br/>
                        <span className="text-white/60 text-xs">{c.tip4Ex}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Properties summary */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                    <List className="w-4 h-4" /> {c.propSummaryTitle}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-blue-300">{c.prop1}</p>
                        <p className="font-body text-xs text-white/60">{c.prop1Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/30 text-green-200 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-green-300">{c.prop2}</p>
                        <p className="font-body text-xs text-white/60">{c.prop2Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-purple-300">{c.prop3}</p>
                        <p className="font-body text-xs text-white/60">{c.prop3Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500/30 text-orange-200 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-orange-300">{c.prop4}</p>
                        <p className="font-body text-xs text-white/60">{c.prop4Desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Tips Kalkulator */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> {c.calcTipsTitle}
            </p>
            <p className="font-body text-sm text-white/70 leading-relaxed">
              {c.calcTipsBody} <InlineMath math="-14 + 29" />{c.calcTipsBody2}{" "}
              <code className="bg-slate-800 px-2 py-1 rounded mx-1 text-cyan-300">(-)</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">1</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">4</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">+</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">2</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">9</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">=</code>
              {" "}{c.calcTipsResult} <strong className="text-primary">15</strong>.
            </p>
          </div>

          {/* Rangkuman Akhir */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{c.summaryTitle}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{c.summarySubtitle}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                  {c.sum1Title}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {c.sum1Rules.map(({ label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                      <div>
                        <p className="font-mono text-xs font-bold">{label}</p>
                        <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                  {c.sum2Title}
                </p>
                <div className="space-y-2">
                  {c.sum2Tips.map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-indigo-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌟</div>
                <p className="font-display text-base font-bold text-white">{c.conclusionFinal}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.conclusionBody}{" "}
                  <strong className="text-cyan-300">{c.conclusionBold}</strong>{c.conclusionBody2}{" "}
                  <strong className="text-yellow-300">{c.conclusionBold2}</strong>{" "}{c.conclusionBody3}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {c.tags.map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{c.nextLabel}</p>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/materi-matematika/kelas-7/bilangan-bulat");
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {c.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanBilanganBulatPage;
