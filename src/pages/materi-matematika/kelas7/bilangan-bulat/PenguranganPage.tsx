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

/* ── Garis Bilangan SVG statis (-5 sampai 5) ──────────────────────── */
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
        <marker id="sub-arr-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
        <marker id="sub-arr-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
      </defs>
      <line x1="14" y1="38" x2="606" y2="38"
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#sub-arr-r)" markerStart="url(#sub-arr-l)" />
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

/* ── Demo Konsep: a − b = a + (−b) ──────────────────────────────── */
const SubtractionConceptSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 700  :
      step === 6  ? 1800 :
      step === 7  ? 450  :
      step === 11 ? 2500 :
      step === 12 ? 600  :
      750;
    const t = setTimeout(() => setStep(s => (s >= 12 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 52;
  const cx   = (n: number) => 320 + n * sp;
  const yA   = 72;
  const nums = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

  const numGreen = step >= 1 && step <= 6 ? Math.min(step, 5) : 0;
  const numRed   = step >= 8 && step <= 11 ? Math.min(step - 7, 3) : 0;

  const showResult = step === 11 || step === 12;
  const isPhaseRight = step >= 1 && step <= 6;
  const isPhaseLeft  = step >= 8;

  const statusText =
    step === 0  ? "" :
    step <= 5   ? (
      language === "en" ? `Step +${step} · from ${step - 1} to ${step}` :
      language === "ja" ? `ステップ +${step} · ${step - 1} から ${step} へ` :
      `Langkah +${step} · dari ${step - 1} ke ${step}`
    ) :
    step === 6  ? (
      language === "en" ? "Now at 5 · converting: −3 → +(−3), stepping back 3..." :
      language === "ja" ? "5 に到達 · 変換: −3 → +(−3)、3 戻る..." :
      "Sudah di 5 · sekarang ubah: −3 → +(−3), mundur 3..."
    ) :
    step === 7  ? (
      language === "en" ? "Applying concept: 5 − 3 = 5 + (−3)..." :
      language === "ja" ? "概念を適用: 5 − 3 = 5 + (−3)..." :
      "Menerapkan konsep: 5 − 3 = 5 + (−3)..."
    ) :
    step <= 10  ? (
      language === "en" ? `Step −${step - 7} · from ${5 - (step - 8)} to ${4 - (step - 8)}` :
      language === "ja" ? `ステップ −${step - 7} · ${5 - (step - 8)} から ${4 - (step - 8)} へ` :
      `Langkah −${step - 7} · dari ${5 - (step - 8)} ke ${4 - (step - 8)}`
    ) :
    step === 11 ? "5 − 3 = 5 + (−3) = 2  ✓" :
    "";

  const statusColor =
    step === 11 ? "#67e8f9" :
    step >= 8   ? "#f87171" :
    step >= 1   ? "#4ade80" :
    "var(--text-primary)";

  const labelRight = language === "en" ? "RIGHT →" : language === "ja" ? "右 →" : "KANAN →";
  const labelRightSub = language === "en" ? "(add positive)" : language === "ja" ? "（正を足す）" : "(tambah positif)";
  const labelLeft = language === "en" ? "← LEFT" : language === "ja" ? "← 左" : "← KIRI";
  const labelLeftSub = language === "en" ? "(subtract / add negative)" : language === "ja" ? "（引く・負を足す）" : "(kurangi / tambah negatif)";
  const phaseRightLabel = language === "en" ? "0 + 5 → move right" : language === "ja" ? "0 + 5 → 右へ移動" : "0 + 5 → bergerak kanan";
  const phaseLeftLabel = language === "en" ? "5 − 3 = 5 + (−3) → step back left" : language === "ja" ? "5 − 3 = 5 + (−3) → 左へ戻る" : "5 − 3 = 5 + (−3) → mundur kiri";
  const resultLabel = "5 − 3 = 2  ✓";

  return (
    <svg viewBox="0 0 640 152" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="sc-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="sc-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="sc-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="sc-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>

      <text x="14" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold">{labelRight}</text>
      <text x="14" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8">{labelRightSub}</text>
      <text x="626" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">{labelLeft}</text>
      <text x="626" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8" textAnchor="end">{labelLeftSub}</text>

      {isPhaseRight && (
        <text x="320" y="22" textAnchor="middle" fill="#4ade8099" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          {phaseRightLabel}
        </text>
      )}
      {isPhaseLeft && !showResult && (
        <text x="320" y="22" textAnchor="middle" fill="#f8717199" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          {phaseLeftLabel}
        </text>
      )}
      {showResult && (
        <text x="320" y="22" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          {resultLabel}
        </text>
      )}

      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#sc-ar)" markerStart="url(#sc-al)"/>

      <circle cx={cx(0)} cy={yA} r="5" fill="var(--text-primary)" opacity="0.9"/>

      {nums.map(n => {
        const x         = cx(n);
        const isZero    = n === 0;
        const isRes     = showResult && n === 2;
        const isMid     = step >= 6 && n === 5;
        const tickColor = isRes ? "#67e8f9" : isMid ? "#86efac" : isZero ? "var(--text-primary)" : "#FFD700";
        const txtColor  = isRes ? "#67e8f9" : isMid ? "#86efac" : isZero ? "var(--text-primary)" : (lightMode ? "var(--text-primary)" : "#FFE57F");
        const prominent = isZero || isRes || isMid;
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
          <path key={`sg${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA - 30} ${x2},${yA}`}
            fill="none" stroke="#4ade80" strokeWidth="2.2"
            markerEnd="url(#sc-g)"
          />
        );
      })}

      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(5 - i), x2 = cx(4 - i), mx = (x1 + x2) / 2;
        return (
          <path key={`sr${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA + 30} ${x2},${yA}`}
            fill="none" stroke="#f87171" strokeWidth="2.2"
            markerEnd="url(#sc-r)"
          />
        );
      })}

      {showResult && (
        <circle cx={cx(2)} cy={yA} r="9" fill="none" stroke="#67e8f9" strokeWidth="2.5"/>
      )}

      {step >= 1 && step <= 5 && (
        <circle cx={cx(step)} cy={yA} r="5" fill="#4ade80"/>
      )}
      {step >= 8 && step <= 10 && (
        <circle cx={cx(5 - (step - 7))} cy={yA} r="5" fill="#f87171"/>
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

/* ── Animasi bertahap contoh: 6 − 4 = 2 ──────────────────────────── */
const NumberLineContoh1SVG = () => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 800  :
      step === 7  ? 1100 :
      step === 12 ? 2800 :
      750;
    const t = setTimeout(() => setStep(s => (s >= 12 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 50;
  const cx   = (n: number) => 90 + n * sp;
  const yA   = 68;
  const nums = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const numGreen   = Math.min(step, 6);
  const numRed     = Math.min(step >= 8 ? step - 7 : 0, 4);
  const showResult = step >= 12;

  const statusText =
    step === 0  ? (language === "en" ? "Ready..." : language === "ja" ? "準備完了..." : "Siap...") :
    step <= 6   ? (
      language === "en" ? `Step +${step} · from ${step - 1} to ${step}` :
      language === "ja" ? `ステップ +${step} · ${step - 1} から ${step} へ` :
      `Langkah +${step} · dari ${step - 1} ke ${step}`
    ) :
    step === 7  ? (
      language === "en" ? "At 6 · now stepping back −4..." :
      language === "ja" ? "6 に到達 · −4 戻る..." :
      "Sudah di 6 · sekarang mundur −4..."
    ) :
    step <= 11  ? (
      language === "en" ? `Step −${step - 7} · from ${6 - (step - 8)} to ${5 - (step - 8)}` :
      language === "ja" ? `ステップ −${step - 7} · ${6 - (step - 8)} から ${5 - (step - 8)} へ` :
      `Langkah −${step - 7} · dari ${6 - (step - 8)} ke ${5 - (step - 8)}`
    ) :
    (language === "en" ? "Result: 6 − 4 = 2  ✓" : language === "ja" ? "結果: 6 − 4 = 2  ✓" : "Hasil: 6 − 4 = 2  ✓");

  const statusColor =
    step >= 12 ? "#67e8f9" :
    step >= 8  ? "#f87171" :
    "#4ade80";

  return (
    <svg viewBox="0 0 640 136" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="nc1-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="nc1-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="nc1-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="nc1-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>

      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#nc1-ar)" markerStart="url(#nc1-al)"/>

      {nums.map(n => {
        const x      = cx(n);
        const isZero = n === 0;
        const isKey  = n === 2 || n === 6;
        const tickClr = n === 2 && showResult ? "#67e8f9"
                       : n === 6 && step >= 7  ? "#86efac"
                       : isZero               ? "var(--text-primary)"
                       :                        "#FFD700";
        const txtClr  = n === 2 && showResult ? "#67e8f9"
                       : n === 6 && step >= 7  ? "#86efac"
                       : isZero               ? "var(--text-primary)"
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
          <path key={`cg${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA - 26} ${x2},${yA}`}
            fill="none" stroke="#4ade80" strokeWidth="2.2"
            markerEnd="url(#nc1-g)"
          />
        );
      })}

      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(6 - i), x2 = cx(5 - i), mx = (x1 + x2) / 2;
        return (
          <path key={`cr${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA + 26} ${x2},${yA}`}
            fill="none" stroke="#f87171" strokeWidth="2.2"
            markerEnd="url(#nc1-r)"
          />
        );
      })}

      {showResult && (
        <circle cx={cx(2)} cy={yA} r="8"
          fill="none" stroke="#67e8f9" strokeWidth="2.5"/>
      )}

      {step >= 1 && step <= 6 && (
        <circle cx={cx(step)} cy={yA} r="4" fill="#4ade80"/>
      )}
      {step >= 8 && step <= 11 && (
        <circle cx={cx(6 - (step - 7))} cy={yA} r="4" fill="#f87171"/>
      )}

      <text x="320" y="122" textAnchor="middle" fontFamily="sans-serif"
        fontSize="11.5" fontWeight="bold" fill={statusColor}>
        {statusText}
      </text>
    </svg>
  );
};

/* ── Kalkulator Interaktif Pengurangan Garis Bilangan ─────────────── */
const InteraktifPengurangan = ({ lightMode = false }: { lightMode?: boolean }) => {
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
  const result = a - b;
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

  const arcUp    = b < 0;
  const arcColor = b < 0 ? "#4ade80" : "#f87171";
  const markerId = b < 0 ? "is-arrow-g" : "is-arrow-r";
  const unitPx   = (SVG_W - PAD * 2) / rangeW;

  const isDone = phase === "done";
  const resultEmoji = isDone ? (b === 0 ? "😐" : b > 0 ? "⬅️" : "➡️") : "";

  const lbl = {
    header: language === "en" ? "Interactive Subtraction Calculator – Number Line"
           : language === "ja" ? "引き算インタラクティブ計算機 – 数直線"
           : "Kalkulator Interaktif Pengurangan – Garis Bilangan",
    num1: language === "en" ? "Number 1" : language === "ja" ? "数 1" : "Bilangan ke-1",
    num2: language === "en" ? "Number 2" : language === "ja" ? "数 2" : "Bilangan ke-2",
    result: language === "en" ? "Result" : language === "ja" ? "結果" : "Hasil",
    enterNums: language === "en" ? "Enter numbers to see the number line"
             : language === "ja" ? "数字を入力して数直線を表示"
             : "Masukkan angka untuk melihat garis bilangan",
    enterNum2: language === "en" ? `Red dot = ${a} · enter the second number`
             : language === "ja" ? `赤い点 = ${a} · 2番目の数字を入力`
             : `Titik merah = ${a} · masukkan bilangan ke-2`,
    ready: language === "en" ? "Ready! Click Operate to see the arc animation"
         : language === "ja" ? "準備完了！「操作する」をクリックしてアニメーションを見よう"
         : "Siap! Klik Operasikan untuk melihat animasi busur",
    stepping: language === "en" ? `Stepping... ${animStep} of ${steps} step(s)`
            : language === "ja" ? `ステップ中... ${animStep} / ${steps} ステップ`
            : `Melangkah... ${animStep} dari ${steps} langkah`,
    done: `${a} − (${b}) = ${result} ${resultEmoji}`,
    hintPos: language === "en" ? `Subtracting a positive → red arcs move LEFT by ${steps} step(s)`
           : language === "ja" ? `正の数を引く → 赤い弧が左に ${steps} ステップ移動`
           : `Mengurangi bilangan positif → busur merah bergerak ke KIRI sejauh ${steps} langkah`,
    hintNeg: language === "en" ? `Subtracting a negative → green arcs move RIGHT by ${steps} step(s) (minus-minus = plus!)`
           : language === "ja" ? `負の数を引く → 緑の弧が右に ${steps} ステップ移動（マイナスマイナス＝プラス！）`
           : `Mengurangi bilangan negatif → busur hijau bergerak ke KANAN sejauh ${steps} langkah (min-min = plus!)`,
    hintZero: language === "en" ? "Subtracting zero → position unchanged"
            : language === "ja" ? "ゼロを引く → 位置は変わらない"
            : "Mengurangi nol → posisi tidak berubah",
    btnAnimating: language === "en" ? "⏳ Animating..." : language === "ja" ? "⏳ アニメーション中..." : "⏳ Animasi berjalan...",
    btnRepeat: language === "en" ? "🔄 Repeat" : language === "ja" ? "🔄 もう一度" : "🔄 Ulangi",
    btnOperate: language === "en" ? "🚀 Operate" : language === "ja" ? "🚀 操作する" : "🚀 Operasikan",
    btnReset: "Reset",
    startLabel: language === "en" ? `start (${a})` : language === "ja" ? `開始 (${a})` : `mulai (${a})`,
  };

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-xl mb-4 ${lightMode ? "bg-white/80 border-orange-200" : "bg-slate-900/90 border-orange-500/40"}`}>
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">🔢</span>
        <span className="font-display text-sm font-bold text-white tracking-wide">{lbl.header}</span>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-orange-300/70"}`}>{lbl.num1}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const v = inputA === "" ? 0 : parseInt(inputA); if (!isNaN(v)) { setInputA(String(Math.max(-20, v - 1))); handleReset(); } else { setInputA("-1"); handleReset(); } }}
                className={`w-8 h-12 rounded-l-xl border-2 border-r-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-orange-100 border-orange-300 text-slate-600 hover:bg-orange-200" : "bg-slate-700 border-orange-500/60 text-orange-300 hover:bg-slate-600"}`}
              >−</button>
              <input
                type="number"
                value={inputA}
                onChange={e => { setInputA(e.target.value); handleReset(); }}
                placeholder="0"
                min={-20} max={20}
                className={`w-16 h-12 text-center text-xl font-bold border-y-2 outline-none transition-all font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                  ${lightMode ? "bg-orange-50 border-orange-300 text-slate-800" : "bg-slate-800 border-orange-500/60 text-orange-200"}
                  ${validA ? (lightMode ? "border-orange-500" : "border-orange-400") : ""}`}
              />
              <button
                onClick={() => { const v = inputA === "" ? 0 : parseInt(inputA); if (!isNaN(v)) { setInputA(String(Math.min(20, v + 1))); handleReset(); } else { setInputA("1"); handleReset(); } }}
                className={`w-8 h-12 rounded-r-xl border-2 border-l-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-orange-100 border-orange-300 text-slate-600 hover:bg-orange-200" : "bg-slate-700 border-orange-500/60 text-orange-300 hover:bg-slate-600"}`}
              >+</button>
            </div>
          </div>

          <span className={`text-3xl font-bold mt-5 ${lightMode ? "text-slate-600" : "text-yellow-300"}`}>−</span>

          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-orange-300/70"}`}>{lbl.num2}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const v = inputB === "" ? 0 : parseInt(inputB); if (!isNaN(v)) { setInputB(String(Math.max(-20, v - 1))); handleReset(); } else { setInputB("-1"); handleReset(); } }}
                className={`w-8 h-12 rounded-l-xl border-2 border-r-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-orange-100 border-orange-300 text-slate-600 hover:bg-orange-200" : "bg-slate-700 border-orange-500/60 text-orange-300 hover:bg-slate-600"}`}
              >−</button>
              <input
                type="number"
                value={inputB}
                onChange={e => { setInputB(e.target.value); handleReset(); }}
                placeholder="0"
                min={-20} max={20}
                className={`w-16 h-12 text-center text-xl font-bold border-y-2 outline-none transition-all font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                  ${lightMode ? "bg-orange-50 border-orange-300 text-slate-800" : "bg-slate-800 border-orange-500/60 text-orange-200"}
                  ${validB ? (b <= 0
                    ? (lightMode ? "border-red-400" : "border-red-400 shadow-[0_0_12px_rgba(248,113,113,0.3)]")
                    : (lightMode ? "border-green-500" : "border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.3)]")
                  ) : ""}`}
              />
              <button
                onClick={() => { const v = inputB === "" ? 0 : parseInt(inputB); if (!isNaN(v)) { setInputB(String(Math.min(20, v + 1))); handleReset(); } else { setInputB("1"); handleReset(); } }}
                className={`w-8 h-12 rounded-r-xl border-2 border-l-0 text-lg font-bold transition-all active:scale-95 ${lightMode ? "bg-orange-100 border-orange-300 text-slate-600 hover:bg-orange-200" : "bg-slate-700 border-orange-500/60 text-orange-300 hover:bg-slate-600"}`}
              >+</button>
            </div>
          </div>

          <span className={`text-3xl font-bold mt-5 ${lightMode ? "text-slate-600" : "text-yellow-300"}`}>=</span>

          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-orange-300/70"}`}>{lbl.result}</span>
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
                @keyframes isArcDraw {
                  0%   { stroke-dashoffset: 100; opacity: 0; }
                  15%  { opacity: 1; }
                  100% { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes isShimmer {
                  0%, 100% { stroke-opacity: 0.65; }
                  50%      { stroke-opacity: 1; }
                }
                @keyframes isDotFade {
                  0%   { opacity: 0; transform: scale(0.4); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes isRingPulse {
                  0%   { opacity: 0; transform: scale(0.5); }
                  60%  { opacity: 0.9; transform: scale(1.15); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes isSparkle {
                  0%   { opacity: 1; transform: scale(1); }
                  100% { opacity: 0; transform: scale(3); }
                }
                .is-arc-draw   { animation: isArcDraw 1.0s cubic-bezier(0.4,0,0.2,1) both; }
                .is-arc-shimmer { animation: isShimmer 3s ease-in-out infinite; }
                .is-dot-fade   { animation: isDotFade 0.5s ease-out both; }
                .is-ring-pop   { animation: isRingPulse 0.8s cubic-bezier(0.34,1.4,0.64,1) forwards; transform-box: fill-box; transform-origin: center; }
                .is-sparkle    { animation: isSparkle 0.9s ease-out forwards; transform-box: fill-box; transform-origin: center; }
              `}</style>

              <filter id="is-glow-g" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.27  0 0 0 0 0.87  0 0 0 0 0.5  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="is-glow-r" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="is-glow-amber" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.75  0 0 0 0 0  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="is-glow-dot" x="-80%" y="-80%" width="360%" height="360%">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              <linearGradient id="is-grad-g" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#bbf7d0"/>
                <stop offset="50%"  stopColor="#4ade80"/>
                <stop offset="100%" stopColor="#16a34a"/>
              </linearGradient>
              <linearGradient id="is-grad-r" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#fca5a5"/>
                <stop offset="50%"  stopColor="#f87171"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>

              <marker id="is-axis-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
              </marker>
              <marker id="is-axis-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
                <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
              </marker>
              <marker id="is-arrow-g" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#4ade80"/>
              </marker>
              <marker id="is-arrow-r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#f87171"/>
              </marker>
            </defs>

            <line x1={10} y1={lineY} x2={SVG_W - 10} y2={lineY}
              stroke="#FFD700" strokeWidth="2.5"
              markerEnd="url(#is-axis-r)" markerStart="url(#is-axis-l)"
              style={{ filter: "drop-shadow(0 0 3px #FFD70088)" }}
            />

            {visibleNums.map(n => {
              const x = toX(n);
              const isZero = n === 0;
              const isA    = validA && n === a;
              const isRes  = isDone && n === result;
              const showLabel = n % labelStep === 0 || isA || isRes || isZero;
              const prominent = isZero || isA || isRes;
              const tickColor = isRes ? "#67e8f9" : isA ? "#fb923c" : isZero ? "#ffffff" : "#FFD700";
              const textColor = isRes ? "#67e8f9" : isA ? "#fb923c" : isZero ? "#ffffff" : (lightMode ? "#334155" : "#FFE57F");
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
              <g key={`is-dot-a-${a}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={toX(a)} cy={lineY} r="9" fill="#fb923c" opacity="0.18" className="is-dot-fade"/>
                <circle cx={toX(a)} cy={lineY} r="6" fill="#fb923c" filter="url(#is-glow-dot)" className="is-dot-fade"/>
              </g>
            )}

            {phase !== "idle" && Array.from({ length: steps }, (_, i) => {
              const x1 = b > 0 ? toX(a - i)     : toX(a + i);
              const x2 = b > 0 ? toX(a - i - 1) : toX(a + i + 1);
              const mx = (x1 + x2) / 2;
              const arcH = Math.min(34, unitPx * 0.6 + 10);
              const cy = arcUp ? lineY - arcH : lineY + arcH;
              const dPath = `M ${x1},${lineY} Q ${mx},${cy} ${x2},${lineY}`;
              const delay = `${i * ARC_DUR}s`;
              const glowFilter = arcUp ? "url(#is-glow-g)" : "url(#is-glow-r)";
              const gradId = arcUp ? "url(#is-grad-g)" : "url(#is-grad-r)";
              return (
                <g key={`is-arc-${i}`}>
                  <path d={dPath} fill="none" stroke={arcColor} strokeWidth="10"
                    strokeLinecap="round" strokeOpacity="0.18" pathLength="100"
                    strokeDasharray="100" className="is-arc-draw is-arc-shimmer"
                    style={{ animationDelay: delay }}
                  />
                  <path d={dPath} fill="none" stroke={gradId} strokeWidth="3.2"
                    strokeLinecap="round" pathLength="100" strokeDasharray="100"
                    filter={glowFilter} className="is-arc-draw"
                    style={{ animationDelay: delay }}
                    markerEnd={`url(#${markerId})`}
                  />
                </g>
              );
            })}

            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13" fill="#fbbf24" opacity="0.15" className="is-dot-fade"/>
                <circle cx={toX(result)} cy={lineY} r="7" fill="#fbbf24" filter="url(#is-glow-amber)" className="is-dot-fade"/>
              </g>
            )}

            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13"
                  fill="none" stroke="#fbbf24" strokeWidth="2.5"
                  filter="url(#is-glow-amber)" className="is-ring-pop"
                />
                {[0, 60, 120, 180, 240, 300].map((deg, si) => {
                  const rad = (deg * Math.PI) / 180;
                  const sx = toX(result) + Math.cos(rad) * 18;
                  const sy = lineY + Math.sin(rad) * 18;
                  return (
                    <circle key={`is-sp${si}`} cx={sx} cy={sy} r="2"
                      fill="#fbbf24" className="is-sparkle"
                      style={{ animationDelay: `${si * 0.06}s`, transformOrigin: `${sx}px ${sy}px` }}
                    />
                  );
                })}
              </g>
            )}

            {phase !== "idle" && (
              <text x={toX(a)} y={lineY - 22}
                textAnchor="middle" fontFamily="sans-serif" fontSize="9"
                fill="#fb923c" opacity="0.85">
                {lbl.startLabel}
              </text>
            )}
          </svg>
        </div>

        {bothValid && phase === "idle" && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body ${lightMode ? "bg-orange-50 text-orange-700" : "bg-orange-900/30 text-orange-300"}`}>
            <span>{b > 0 ? "⬅️" : b < 0 ? "➡️" : "⏸️"}</span>
            <span>
              {b > 0 ? lbl.hintPos : b < 0 ? lbl.hintNeg : lbl.hintZero}
            </span>
          </div>
        )}
        {isDone && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body font-semibold ${lightMode ? "bg-green-50 text-green-700 border border-green-200" : "bg-green-900/30 text-green-300 border border-green-500/30"}`}>
            <span>✅</span>
            <span>{a} − ({b}) = <strong>{result}</strong> {resultEmoji}</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleOperate}
            disabled={!bothValid || phase === "animating"}
            className={`px-6 py-2.5 rounded-xl font-display text-sm font-bold tracking-wide transition-all
              ${!bothValid || phase === "animating"
                ? "bg-slate-600/40 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-orange-500/40 hover:scale-105 active:scale-95 cursor-pointer"
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

const PenguranganBilanganBulatPage = () => {
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
      title: "PENGURANGAN BILANGAN BULAT",
      subtitle: "Kelas 7 - Bilangan Bulat - Materi Matematika",
      secIntroTitle: "Kunci Rahasia Pengurangan Bilangan Bulat",
      secKonsepTitle: "Ringkasan Intisari: Konsep Pengurangan",
      secContohTitle: "Contoh Soal dan Pembahasan",
      secSifatTitle: "Sifat-sifat Pengurangan Bilangan Bulat",
      secKesimpulanTitle: "Kesimpulan dan Tips",
      introP1: "Pernah bingung saat menghitung",
      introP2: "? Tenang, kamu tidak sendirian! Pengurangan bilangan bulat memang terlihat tricky, tapi sebenarnya ada",
      introBold: "satu trik sederhana",
      introP3: "yang akan membuatmu jago menyelesaikan soal apapun.",
      goldenTrickTitle: "🔑 Trik Emas Pengurangan:",
      goldenTrickBody: "Mengurangi suatu bilangan sama dengan menambah dengan lawan bilangan tersebut!",
      goldenTrickNote: "Artinya, cukup ubah tanda pengurangan menjadi penjumlahan, lalu balik tanda bilangan pengurangnya!",
      illustrationBold: "Ilustrasi nyata:",
      illustrationP: "Bayangkan kamu punya uang Rp100.000 dan harus membayar hutang Rp30.000. Ini bisa ditulis",
      illustrationP2: ". Bisa juga dipikirkan sebagai: uangmu \"bertambah\" dengan nilai negatif (hutang), yaitu",
      rememberBold: "Ingat:",
      rememberP: "Di garis bilangan,",
      rememberPBold: "pengurangan = bergerak ke KIRI",
      rememberP2: "sejumlah bilangan pengurang. Ini adalah kebalikan dari penjumlahan positif.",
      konsepP: "Cara paling mudah memahami pengurangan bilangan bulat adalah dengan",
      konsepBold: "garis bilangan",
      konsepP2: ". Di garis bilangan, pengurangan artinya bergerak ke",
      konsepBoldRed: "KIRI",
      konsepP3: ".",
      ruleTitle: "Aturan Jalan Pengurangan di Garis Bilangan:",
      ruleA: "a − b",
      ruleADesc: ": dari posisi a, mundur b langkah ke",
      ruleAKey: "kiri",
      ruleB: "a − (−b)",
      ruleBDesc: ": mengurangi negatif = maju b langkah ke",
      ruleBKey: "kanan",
      numberLineLabel: "Garis Bilangan",
      patternTitle: "Pola Pengurangan Bilangan Bulat:",
      patPosPosLabel: "Positif dikurangi Positif:",
      patPosNegLabel: "Positif dikurangi Negatif (hasilnya pasti lebih besar!):",
      patNegPosLabel: "Negatif dikurangi Positif:",
      patNegNegLabel: "Negatif dikurangi Negatif:",
      tipProBold: "Tips Pro:",
      tipProBody: "Setiap kali ketemu tanda \"minus-minus\"",
      tipProBody2: ", langsung ubah jadi \"plus\"",
      tipProBody3: ". Dua negatif yang bertemu akan saling menghilangkan!",
      badgeEasy: "MUDAH",
      badgeMedium: "SEDANG",
      badgeHard: "SULIT",
      badgeBonus: "BONUS",
      ex1Label: "Contoh 1",
      ex2Label: "Contoh 2",
      ex3Label: "Contoh 3: Soal Cerita",
      ex4Label: "Contoh 4: Rantai Pengurangan",
      solutionLabel: "PEMBAHASAN:",
      answerLabel: "Jawaban:",
      ex1Q: "Hitunglah hasil dari",
      ex1QEnd: "menggunakan garis bilangan!",
      ex1S1: "Langkah 1:",
      ex1S1Body: "Mulai dari titik 0, bergerak 6 satuan ke",
      ex1S1Bold: "kanan",
      ex1S1End: "(karena 6 positif).",
      ex1S2: "Langkah 2:",
      ex1S2Body: "Dari titik 6, mundur 4 satuan ke",
      ex1S2Bold: "kiri",
      ex1S2End: "(pengurangan = mundur).",
      ex1S3: "Langkah 3:",
      ex1S3Body: "Titik akhir berada di angka",
      ex1VizLabel: "Visualisasi di Garis Bilangan",
      ex1LegRight: "+6 ke kanan",
      ex1LegLeft: "−4 ke kiri",
      ex1LegResult: "hasil = 2",
      ex1Conclusion: "Jadi,",
      ex2Q: "Hitunglah hasil pengurangan berikut:",
      ex2aS1: "Langkah 1:",
      ex2aS1Body: "Ubah pengurangan menjadi penjumlahan dengan lawan bilangan.",
      ex2aS2: "Langkah 2:",
      ex2aS2Body: "Kedua bilangan negatif, jumlahkan nilainya dan beri tanda negatif.",
      ex2bS1: "Langkah 1:",
      ex2bS1Body: "Tanda minus-minus berubah jadi plus!",
      ex2bS2: "Langkah 2:",
      ex2bS2Body: "Jumlahkan kedua bilangan positif.",
      ex3QP1: "Seekor lumba-lumba melompat hingga mencapai ketinggian",
      ex3QP2: "meter di atas permukaan air laut, kemudian menyelam hingga kedalaman",
      ex3QP3: "meter di bawah permukaan. Berapa jarak total antara titik tertinggi lompatan dengan titik terendah penyelaman?",
      ex3ImgAlt: "Ilustrasi lumba-lumba melompat dan menyelam",
      ex3ImgCaption: "Sumber: Ilustrasi garis bilangan",
      ex3S1: "Langkah 1:",
      ex3S1Body: "Tentukan titik acuan dan nilai masing-masing posisi.",
      ex3Ref0: "Permukaan air laut = titik nol (0)",
      ex3RefUp: "Ketinggian lompatan =",
      ex3RefUpEnd: "meter (di atas nol)",
      ex3RefDown: "Kedalaman penyelaman =",
      ex3RefDownEnd: "meter (di bawah nol)",
      ex3S2: "Langkah 2:",
      ex3S2Body: "Hitung jarak = posisi atas dikurangi posisi bawah.",
      ex3S3: "Langkah 3:",
      ex3S3Body: "Terapkan rumus pengurangan.",
      katexEx3Distance: "\\text{Jarak} = 3 - (-7)",
      ex3Conclusion: "Jadi, jarak antara puncak lompatan dengan kedalaman penyelaman adalah",
      ex3ConcEnd: "meter.",
      ex4Q: "Hitunglah hasil dari",
      ex4S1: "Langkah 1:",
      ex4S1Body: "Ubah semua pengurangan menjadi penjumlahan dengan lawan bilangan.",
      ex4S2: "Langkah 2:",
      ex4S2Body: "Hitung dari kiri ke kanan. Pertama, jumlahkan dua bilangan negatif:",
      ex4S3: "Langkah 3:",
      ex4S3Body: "Kemudian tambahkan dengan 21:",
      sifatP: "Pengurangan bilangan bulat memiliki sifat-sifat penting yang berbeda dari penjumlahan. Mari kita pelajari satu per satu:",
      sifat1Badge: "Sifat 1",
      sifat1Title: "Sifat Tertutup",
      sifat1Body: "Hasil pengurangan dua bilangan bulat",
      sifat1Bold: "selalu bilangan bulat juga",
      sifat1Body2: ". Operasi ini tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.",
      sifat1KatexNote: "(Untuk setiap a dan b bilangan bulat, hasil a − b juga bilangan bulat)",
      sifat1PosPos: "positif − positif",
      sifat1NegPos: "negatif − positif",
      sifat1NegNeg: "negatif − negatif",
      sifat2Badge: "Sifat 2",
      sifat2Title: "Tidak Memiliki Sifat Komutatif",
      sifat2Body: "Berbeda dengan penjumlahan,",
      sifat2Bold: "menukar urutan bilangan yang dikurangi MENGUBAH hasilnya",
      sifat2Body2: ".",
      sifat2OrderA: "Urutan asal:",
      sifat2OrderB: "Urutan dibalik:",
      sifat2Note: "Urutan sangat penting dalam pengurangan!",
      sifat3Badge: "Sifat 3",
      sifat3Title: "Tidak Memiliki Sifat Asosiatif",
      sifat3Body: "Cara",
      sifat3Bold: "mengelompokkan",
      sifat3Body2: "bilangan yang dikurangi mempengaruhi hasil akhirnya.",
      sifat3ProofLabel: "Contoh pembuktian:",
      sifat3NotEqual: "TIDAK sama dengan",
      sifat3Note: "Selalu kerjakan pengurangan dari kiri ke kanan!",
      sifat4Badge: "Sifat 4",
      sifat4Title: "Elemen Nol pada Pengurangan",
      sifat4Body: "Mengurangi suatu bilangan dengan nol menghasilkan bilangan itu sendiri. Namun, nol dikurangi bilangan menghasilkan lawan bilangan tersebut.",
      sifat4LabelA: "Dikurangi 0:",
      sifat4LabelB: "0 dikurangi:",
      cara1Title: "Cara 1 — Menggunakan Garis Bilangan",
      cara1Body: "Bayangkan kamu berdiri di titik awal pada garis bilangan. Arah gerakanmu menentukan hasilnya:",
      cara1SubNeg: "Dikurangi Negatif",
      cara1SubNegMath: "= maju ke",
      cara1SubNegKey: "kanan",
      cara1SubNegEx: "Contoh: 4 − (−3) → maju 3 ke kanan",
      cara1SubPos: "Dikurangi Positif",
      cara1SubPosMath: "= mundur ke",
      cara1SubPosKey: "kiri",
      cara1SubPosEx: "Contoh: 6 − 4 → mundur 4 ke kiri",
      cara1StepsLabel: "Langkah-langkah:",
      cara1Step1: "① Mulai dari titik pertama",
      cara1Step2: "② Mundur sesuai bilangan pengurang",
      cara1Step3: "③ Posisi akhir = hasil",
      cara2Title: "Cara 2 — Ubah ke Penjumlahan",
      cara2PosPos: "Positif − Positif",
      cara2PosNeg: "Positif − Negatif",
      cara2NegPos: "Negatif − Positif",
      cara2NegNeg: "Negatif − Negatif",
      cara2ExPosPos: "Contoh: 8 − 3 = 8 + (−3) = 5",
      cara2ExPosNeg: "Contoh: 4 − (−6) = 4 + 6 = 10",
      cara2ExNegPos: "Contoh: −5 − 3 = −(5+3) = −8",
      cara2ExNegNeg: "Contoh: −7 − (−2) = −7+2 = −5",
      sumPropTitle: "📋 Rangkuman Sifat Pengurangan",
      sumClosed: "Tertutup:",
      sumClosedDesc: "Hasil selalu bilangan bulat",
      sumNotComm: "Tidak Komutatif:",
      sumNotAssoc: "Tidak Asosiatif:",
      sumZero: "Elemen Nol:",
      tipsTitle: "Tips Mengubah Pengurangan ke Penjumlahan",
      tipsBody: "Dengan mengubah operasi pengurangan menjadi penjumlahan, perhitungan menjadi lebih mudah dan konsisten. Ingat satu aturan ini:",
      tipsQuote: "\"Ubah tanda operasi, balik tanda bilangan pengurang!\"",
      summaryTitle: "➖ RANGKUMAN LENGKAP",
      summarySubtitle: "Pengurangan Bilangan Bulat — Kelas 7",
      sum1Title: "Aturan Pengurangan Bilangan Bulat",
      sum1Rules: [
        { label: "Kunci Utama: a − b = a + (−b)", desc: "Setiap pengurangan dapat diubah menjadi penjumlahan dengan lawan dari bilangan pengurang.", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
        { label: "(+) − (+): kurangi positif", desc: "Jika positif lebih besar → hasil positif. Jika negatif lebih besar → hasil negatif. Contoh: 5 − 8 = 5 + (−8) = −3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
        { label: "(−) − (−): kurangi negatif", desc: "Mengurangi negatif = menambah positif. Contoh: (−5) − (−3) = (−5) + 3 = −2", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
        { label: "Pengurangan TIDAK Komutatif", desc: "a − b ≠ b − a (umumnya). Urutan sangat penting! Contoh: 7 − 3 = 4, tetapi 3 − 7 = −4", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
        { label: "Garis Bilangan: Pengurangan = Mundur", desc: "Mengurang bilangan positif = langkah ke kiri. Mengurang bilangan negatif = langkah ke kanan.", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      ],
      sum2Title: "Tips & Trik Jitu Pengurangan",
      sum2Tips: [
        { icon: "🔄", tip: "Selalu ubah pengurangan → penjumlahan", detail: "Ubah a − b menjadi a + (−b) terlebih dahulu, lalu gunakan aturan penjumlahan. Ini strategi paling aman!", color: "bg-orange-900/30 border-orange-500/30" },
        { icon: "⚠️", tip: "Hati-hati dengan dua tanda negatif", detail: "a − (−b) = a + b. Dua tanda minus berturut-turut menjadi plus! Contoh: 5 − (−3) = 5 + 3 = 8.", color: "bg-red-900/30 border-red-500/30" },
        { icon: "🎯", tip: "Cek tanda hasil dengan nilai mutlak", detail: "Hitung nilai mutlak kedua bilangan, kurangi yang lebih kecil dari yang lebih besar, lalu ambil tanda dari bilangan yang nilai mutlaknya lebih besar.", color: "bg-yellow-900/30 border-yellow-500/30" },
        { icon: "✅", tip: "Verifikasi dengan penjumlahan balik", detail: "Jika a − b = c, maka c + b harus = a. Gunakan ini untuk memeriksa jawabanmu!", color: "bg-green-900/30 border-green-500/30" },
      ],
      conclusionFinal: "KESIMPULAN",
      conclusionBody: "Pengurangan bilangan bulat sebenarnya",
      conclusionBold: "adalah penjumlahan yang tersamarkan",
      conclusionBody2: "! Cukup ingat satu rumus ajaib:",
      conclusionFormula: "a − b = a + (−b)",
      conclusionBody3: ". Ubah semua pengurangan menjadi penjumlahan, dan kamu tidak perlu menghafal aturan baru sama sekali!",
      tags: ["a − b = a + (−b)", "Dua Minus = Plus", "Tidak Komutatif", "Garis Bilangan", "Nilai Mutlak"],
      nextLabel: "🚀 Siap lanjut ke Perkalian Bilangan Bulat!",
      backBtn: "Kembali ke Daftar Materi",
    },
    en: {
      title: "SUBTRACTION OF INTEGERS",
      subtitle: "Grade 7 - Integers - Mathematics",
      secIntroTitle: "The Secret Key to Integer Subtraction",
      secKonsepTitle: "Core Concept Summary: Subtraction",
      secContohTitle: "Worked Examples",
      secSifatTitle: "Properties of Integer Subtraction",
      secKesimpulanTitle: "Conclusion & Tips",
      introP1: "Ever confused when calculating",
      introP2: "? Don't worry, you're not alone! Integer subtraction may look tricky, but there's actually",
      introBold: "one simple trick",
      introP3: "that will make you great at solving any problem.",
      goldenTrickTitle: "🔑 The Golden Subtraction Trick:",
      goldenTrickBody: "Subtracting a number is the same as adding its opposite!",
      goldenTrickNote: "Simply change the subtraction sign to addition, then flip the sign of the number being subtracted!",
      illustrationBold: "Real-world example:",
      illustrationP: "Imagine you have Rp100,000 and need to pay a debt of Rp30,000. This can be written as",
      illustrationP2: ". It can also be thought of as: your money \"increases\" by a negative amount (debt), i.e.",
      rememberBold: "Remember:",
      rememberP: "On the number line,",
      rememberPBold: "subtraction = moving LEFT",
      rememberP2: "by the amount of the subtrahend. This is the opposite of adding a positive number.",
      konsepP: "The easiest way to understand integer subtraction is with a",
      konsepBold: "number line",
      konsepP2: ". On the number line, subtraction means moving to the",
      konsepBoldRed: "LEFT",
      konsepP3: ".",
      ruleTitle: "Movement Rules for Subtraction on the Number Line:",
      ruleA: "a − b",
      ruleADesc: ": from position a, move b steps to the",
      ruleAKey: "left",
      ruleB: "a − (−b)",
      ruleBDesc: ": subtracting a negative = move b steps to the",
      ruleBKey: "right",
      numberLineLabel: "Number Line",
      patternTitle: "Integer Subtraction Patterns:",
      patPosPosLabel: "Positive minus Positive:",
      patPosNegLabel: "Positive minus Negative (result is always larger!):",
      patNegPosLabel: "Negative minus Positive:",
      patNegNegLabel: "Negative minus Negative:",
      tipProBold: "Pro Tip:",
      tipProBody: "Whenever you see a \"minus-minus\"",
      tipProBody2: ", immediately change it to \"plus\"",
      tipProBody3: ". Two negatives meeting each other cancel out!",
      badgeEasy: "Easy",
      badgeMedium: "Medium",
      badgeHard: "Hard",
      badgeBonus: "BONUS",
      ex1Label: "Example 1",
      ex2Label: "Example 2",
      ex3Label: "Example 3: Word Problem",
      ex4Label: "Example 4: Chain Subtraction",
      solutionLabel: "SOLUTION:",
      answerLabel: "Answer:",
      ex1Q: "Calculate the result of",
      ex1QEnd: "using a number line!",
      ex1S1: "Step 1:",
      ex1S1Body: "Start at 0, move 6 units to the",
      ex1S1Bold: "right",
      ex1S1End: "(since 6 is positive).",
      ex1S2: "Step 2:",
      ex1S2Body: "From 6, step back 4 units to the",
      ex1S2Bold: "left",
      ex1S2End: "(subtraction = stepping back).",
      ex1S3: "Step 3:",
      ex1S3Body: "The final position is at",
      ex1VizLabel: "Number Line Visualization",
      ex1LegRight: "+6 to the right",
      ex1LegLeft: "−4 to the left",
      ex1LegResult: "result = 2",
      ex1Conclusion: "Therefore,",
      ex2Q: "Calculate the following subtractions:",
      ex2aS1: "Step 1:",
      ex2aS1Body: "Convert subtraction to addition with the opposite number.",
      ex2aS2: "Step 2:",
      ex2aS2Body: "Both numbers are negative; add their absolute values and keep the negative sign.",
      ex2bS1: "Step 1:",
      ex2bS1Body: "Minus-minus becomes plus!",
      ex2bS2: "Step 2:",
      ex2bS2Body: "Add the two positive numbers.",
      ex3QP1: "A dolphin leaps to a height of",
      ex3QP2: "metres above sea level, then dives to a depth of",
      ex3QP3: "metres below the surface. What is the total distance between the highest point of the leap and the lowest point of the dive?",
      ex3ImgAlt: "Illustration of a dolphin leaping and diving",
      ex3ImgCaption: "Source: Number line illustration",
      ex3S1: "Step 1:",
      ex3S1Body: "Establish the reference point and the value of each position.",
      ex3Ref0: "Sea level = zero point (0)",
      ex3RefUp: "Height of leap =",
      ex3RefUpEnd: "metres (above zero)",
      ex3RefDown: "Depth of dive =",
      ex3RefDownEnd: "metres (below zero)",
      ex3S2: "Step 2:",
      ex3S2Body: "Calculate the distance = upper position minus lower position.",
      ex3S3: "Step 3:",
      ex3S3Body: "Apply the subtraction formula.",
      katexEx3Distance: "\\text{Distance} = 3 - (-7)",
      ex3Conclusion: "Therefore, the distance between the peak of the leap and the depth of the dive is",
      ex3ConcEnd: "metres.",
      ex4Q: "Calculate",
      ex4S1: "Step 1:",
      ex4S1Body: "Convert all subtractions to addition with the opposite number.",
      ex4S2: "Step 2:",
      ex4S2Body: "Work from left to right. First, add the two negative numbers:",
      ex4S3: "Step 3:",
      ex4S3Body: "Then add 21:",
      sifatP: "Integer subtraction has important properties that differ from addition. Let's study them one by one:",
      sifat1Badge: "Property 1",
      sifat1Title: "Closure Property",
      sifat1Body: "The result of subtracting two integers is",
      sifat1Bold: "always an integer",
      sifat1Body2: ". This operation never produces a number outside the set of integers.",
      sifat1KatexNote: "(For every a and b integer, the result a − b is also an integer)",
      sifat1PosPos: "positive − positive",
      sifat1NegPos: "negative − positive",
      sifat1NegNeg: "negative − negative",
      sifat2Badge: "Property 2",
      sifat2Title: "No Commutative Property",
      sifat2Body: "Unlike addition,",
      sifat2Bold: "swapping the order of numbers in subtraction CHANGES the result",
      sifat2Body2: ".",
      sifat2OrderA: "Original order:",
      sifat2OrderB: "Reversed order:",
      sifat2Note: "Order matters in subtraction!",
      sifat3Badge: "Property 3",
      sifat3Title: "No Associative Property",
      sifat3Body: "The way you",
      sifat3Bold: "group",
      sifat3Body2: "numbers in subtraction affects the final result.",
      sifat3ProofLabel: "Verification example:",
      sifat3NotEqual: "NOT equal to",
      sifat3Note: "Always perform subtraction from left to right!",
      sifat4Badge: "Property 4",
      sifat4Title: "Zero Element in Subtraction",
      sifat4Body: "Subtracting zero from a number gives that number itself. However, zero minus a number gives the opposite of that number.",
      sifat4LabelA: "Minus 0:",
      sifat4LabelB: "0 minus:",
      cara1Title: "Method 1 — Using the Number Line",
      cara1Body: "Imagine you are standing at the starting point on the number line. Your direction of movement determines the result:",
      cara1SubNeg: "Subtract Negative",
      cara1SubNegMath: "= move to the",
      cara1SubNegKey: "right",
      cara1SubNegEx: "Example: 4 − (−3) → move 3 to the right",
      cara1SubPos: "Subtract Positive",
      cara1SubPosMath: "= step back to the",
      cara1SubPosKey: "left",
      cara1SubPosEx: "Example: 6 − 4 → step back 4 to the left",
      cara1StepsLabel: "Steps:",
      cara1Step1: "① Start from the first number",
      cara1Step2: "② Step back by the subtrahend",
      cara1Step3: "③ Final position = result",
      cara2Title: "Method 2 — Convert to Addition",
      cara2PosPos: "Positive − Positive",
      cara2PosNeg: "Positive − Negative",
      cara2NegPos: "Negative − Positive",
      cara2NegNeg: "Negative − Negative",
      cara2ExPosPos: "Example: 8 − 3 = 8 + (−3) = 5",
      cara2ExPosNeg: "Example: 4 − (−6) = 4 + 6 = 10",
      cara2ExNegPos: "Example: −5 − 3 = −(5+3) = −8",
      cara2ExNegNeg: "Example: −7 − (−2) = −7+2 = −5",
      sumPropTitle: "📋 Subtraction Properties Summary",
      sumClosed: "Closure:",
      sumClosedDesc: "Result is always an integer",
      sumNotComm: "Not Commutative:",
      sumNotAssoc: "Not Associative:",
      sumZero: "Zero Element:",
      tipsTitle: "Tips for Converting Subtraction to Addition",
      tipsBody: "By converting subtraction to addition, calculations become easier and more consistent. Remember this one rule:",
      tipsQuote: "\"Change the operation sign, flip the sign of the number being subtracted!\"",
      summaryTitle: "➖ COMPLETE SUMMARY",
      summarySubtitle: "Integer Subtraction — Grade 7",
      sum1Title: "Rules of Integer Subtraction",
      sum1Rules: [
        { label: "Golden Rule: a − b = a + (−b)", desc: "Every subtraction can be converted to addition with the opposite of the subtrahend.", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
        { label: "(+) − (+): subtract positive", desc: "If positive is larger → positive result. If negative is larger → negative result. Example: 5 − 8 = 5 + (−8) = −3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
        { label: "(−) − (−): subtract negative", desc: "Subtracting a negative = adding a positive. Example: (−5) − (−3) = (−5) + 3 = −2", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
        { label: "Subtraction is NOT Commutative", desc: "a − b ≠ b − a (generally). Order is crucial! Example: 7 − 3 = 4, but 3 − 7 = −4", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
        { label: "Number Line: Subtraction = Step Back", desc: "Subtracting a positive = step left. Subtracting a negative = step right.", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      ],
      sum2Title: "Smart Tips & Tricks for Subtraction",
      sum2Tips: [
        { icon: "🔄", tip: "Always convert subtraction → addition", detail: "Change a − b to a + (−b) first, then use the addition rules. This is the safest strategy!", color: "bg-orange-900/30 border-orange-500/30" },
        { icon: "⚠️", tip: "Watch out for double negatives", detail: "a − (−b) = a + b. Two consecutive minus signs become plus! Example: 5 − (−3) = 5 + 3 = 8.", color: "bg-red-900/30 border-red-500/30" },
        { icon: "🎯", tip: "Check the sign using absolute values", detail: "Calculate the absolute values of both numbers, subtract the smaller from the larger, then take the sign of the number with the larger absolute value.", color: "bg-yellow-900/30 border-yellow-500/30" },
        { icon: "✅", tip: "Verify with reverse addition", detail: "If a − b = c, then c + b must equal a. Use this to check your answers!", color: "bg-green-900/30 border-green-500/30" },
      ],
      conclusionFinal: "CONCLUSION",
      conclusionBody: "Integer subtraction is actually",
      conclusionBold: "addition in disguise",
      conclusionBody2: "! Just remember one magic formula:",
      conclusionFormula: "a − b = a + (−b)",
      conclusionBody3: ". Convert all subtractions to addition and you won't need to memorise any new rules at all!",
      tags: ["a − b = a + (−b)", "Double Minus = Plus", "Not Commutative", "Number Line", "Absolute Value"],
      nextLabel: "🚀 Ready for Integer Multiplication!",
      backBtn: "Back to Material List",
    },
    ja: {
      title: "整数の引き算",
      subtitle: "中学1年 - 整数 - 数学",
      secIntroTitle: "整数の引き算の秘密のカギ",
      secKonsepTitle: "概念まとめ：引き算",
      secContohTitle: "例題と解説",
      secSifatTitle: "整数の引き算の性質",
      secKesimpulanTitle: "結論とヒント",
      introP1: "計算で困ったことはありませんか",
      introP2: "？大丈夫、あなただけではありません！整数の引き算は難しそうに見えますが、実は",
      introBold: "たった一つのコツ",
      introP3: "でどんな問題も解けるようになります。",
      goldenTrickTitle: "🔑 引き算の黄金ルール：",
      goldenTrickBody: "ある数を引くことは、その数の反数を足すことと同じです！",
      goldenTrickNote: "引き算の記号を足し算に変えて、引く数の符号を逆にするだけです！",
      illustrationBold: "身近な例：",
      illustrationP: "100,000円持っていて30,000円の借金を返す場合、",
      illustrationP2: "と書けます。または「負の金額（借金）を足す」と考えると、",
      rememberBold: "覚えよう：",
      rememberP: "数直線では、",
      rememberPBold: "引き算 = 左へ移動",
      rememberP2: "引く数の分だけ移動します。これは正の数を足すことと反対方向です。",
      konsepP: "整数の引き算を理解する一番簡単な方法は",
      konsepBold: "数直線",
      konsepP2: "を使うことです。数直線では、引き算は",
      konsepBoldRed: "左",
      konsepP3: "への移動を意味します。",
      ruleTitle: "数直線での引き算の移動ルール：",
      ruleA: "a − b",
      ruleADesc: "：位置 a から b ステップ",
      ruleAKey: "左",
      ruleB: "a − (−b)",
      ruleBDesc: "：負の数を引く ＝ b ステップ",
      ruleBKey: "右",
      numberLineLabel: "数直線",
      patternTitle: "整数の引き算のパターン：",
      patPosPosLabel: "正 − 正：",
      patPosNegLabel: "正 − 負（結果は必ず大きくなる！）：",
      patNegPosLabel: "負 − 正：",
      patNegNegLabel: "負 − 負：",
      tipProBold: "プロのヒント：",
      tipProBody: "「マイナスマイナス」",
      tipProBody2: "が出てきたら、すぐに「プラス」",
      tipProBody3: "に変えましょう。負が2つ重なると打ち消し合います！",
      badgeEasy: "基本",
      badgeMedium: "標準",
      badgeHard: "発展",
      badgeBonus: "ボーナス",
      ex1Label: "例題 1",
      ex2Label: "例題 2",
      ex3Label: "例題 3：文章題",
      ex4Label: "例題 4：連続引き算",
      solutionLabel: "解説：",
      answerLabel: "答え：",
      ex1Q: "数直線を使って",
      ex1QEnd: "の答えを求めよ！",
      ex1S1: "手順 1：",
      ex1S1Body: "0から出発して、6単位",
      ex1S1Bold: "右",
      ex1S1End: "に移動する（6は正の数なので）。",
      ex1S2: "手順 2：",
      ex1S2Body: "6から4単位",
      ex1S2Bold: "左",
      ex1S2End: "に戻る（引き算 = 戻る）。",
      ex1S3: "手順 3：",
      ex1S3Body: "最終位置は",
      ex1VizLabel: "数直線での視覚化",
      ex1LegRight: "+6 右へ",
      ex1LegLeft: "−4 左へ",
      ex1LegResult: "結果 = 2",
      ex1Conclusion: "よって、",
      ex2Q: "次の引き算を計算せよ：",
      ex2aS1: "手順 1：",
      ex2aS1Body: "引き算を反数の足し算に変換する。",
      ex2aS2: "手順 2：",
      ex2aS2Body: "両方とも負の数なので、絶対値を足して負の符号をつける。",
      ex2bS1: "手順 1：",
      ex2bS1Body: "マイナスマイナスはプラスになる！",
      ex2bS2: "手順 2：",
      ex2bS2Body: "2つの正の数を足す。",
      ex3QP1: "イルカが海面から",
      ex3QP2: "メートルの高さまでジャンプし、その後",
      ex3QP3: "メートルの深さまで潜りました。ジャンプの最高点と潜水の最深点の間の距離はいくらですか？",
      ex3ImgAlt: "イルカがジャンプして潜る図",
      ex3ImgCaption: "出典：数直線イラスト",
      ex3S1: "手順 1：",
      ex3S1Body: "基準点と各位置の値を決める。",
      ex3Ref0: "海面 = 原点 (0)",
      ex3RefUp: "ジャンプの高さ =",
      ex3RefUpEnd: "メートル（ゼロより上）",
      ex3RefDown: "潜水の深さ =",
      ex3RefDownEnd: "メートル（ゼロより下）",
      ex3S2: "手順 2：",
      ex3S2Body: "距離 = 上の位置 − 下の位置 で計算する。",
      ex3S3: "手順 3：",
      ex3S3Body: "引き算の公式を適用する。",
      katexEx3Distance: "\\text{距離} = 3 - (-7)",
      ex3Conclusion: "よって、ジャンプの最高点と潜水の最深点の間の距離は",
      ex3ConcEnd: "メートルです。",
      ex4Q: "次を計算せよ：",
      ex4S1: "手順 1：",
      ex4S1Body: "すべての引き算を反数の足し算に変換する。",
      ex4S2: "手順 2：",
      ex4S2Body: "左から右へ計算する。まず、2つの負の数を足す：",
      ex4S3: "手順 3：",
      ex4S3Body: "次に 21 を足す：",
      sifatP: "整数の引き算には、足し算と異なる重要な性質があります。一つずつ学びましょう：",
      sifat1Badge: "性質 1",
      sifat1Title: "閉包性",
      sifat1Body: "2つの整数の引き算の結果は",
      sifat1Bold: "常に整数",
      sifat1Body2: "です。この演算は整数の集合の外の数を生み出しません。",
      sifat1KatexNote: "（a と b がすべて整数のとき、a − b も整数）",
      sifat1PosPos: "正 − 正",
      sifat1NegPos: "負 − 正",
      sifat1NegNeg: "負 − 負",
      sifat2Badge: "性質 2",
      sifat2Title: "交換法則が成り立たない",
      sifat2Body: "足し算とは異なり、",
      sifat2Bold: "引き算で数の順序を入れ替えると結果が変わります",
      sifat2Body2: "。",
      sifat2OrderA: "元の順序：",
      sifat2OrderB: "順序を逆にすると：",
      sifat2Note: "引き算では順序がとても重要です！",
      sifat3Badge: "性質 3",
      sifat3Title: "結合法則が成り立たない",
      sifat3Body: "引き算の数を",
      sifat3Bold: "グループ化する方法",
      sifat3Body2: "によって最終結果が変わります。",
      sifat3ProofLabel: "確認の例：",
      sifat3NotEqual: "とは等しくない",
      sifat3Note: "引き算は必ず左から右に計算しましょう！",
      sifat4Badge: "性質 4",
      sifat4Title: "引き算のゼロ元素",
      sifat4Body: "ある数から0を引くとその数自身になります。しかし、0からある数を引くとその数の反数になります。",
      sifat4LabelA: "0 を引く：",
      sifat4LabelB: "0 から引く：",
      cara1Title: "方法 1 — 数直線を使う",
      cara1Body: "数直線の出発点に立っていると想像してください。移動する方向が結果を決めます：",
      cara1SubNeg: "負の数を引く",
      cara1SubNegMath: "=",
      cara1SubNegKey: "右",
      cara1SubNegEx: "例：4 − (−3) → 右に3移動",
      cara1SubPos: "正の数を引く",
      cara1SubPosMath: "=",
      cara1SubPosKey: "左",
      cara1SubPosEx: "例：6 − 4 → 左に4戻る",
      cara1StepsLabel: "手順：",
      cara1Step1: "① 最初の数から出発",
      cara1Step2: "② 引く数の分だけ戻る",
      cara1Step3: "③ 最終位置 = 答え",
      cara2Title: "方法 2 — 足し算に変換する",
      cara2PosPos: "正 − 正",
      cara2PosNeg: "正 − 負",
      cara2NegPos: "負 − 正",
      cara2NegNeg: "負 − 負",
      cara2ExPosPos: "例：8 − 3 = 8 + (−3) = 5",
      cara2ExPosNeg: "例：4 − (−6) = 4 + 6 = 10",
      cara2ExNegPos: "例：−5 − 3 = −(5+3) = −8",
      cara2ExNegNeg: "例：−7 − (−2) = −7+2 = −5",
      sumPropTitle: "📋 引き算の性質まとめ",
      sumClosed: "閉包性：",
      sumClosedDesc: "結果は常に整数",
      sumNotComm: "非交換法則：",
      sumNotAssoc: "非結合法則：",
      sumZero: "ゼロ元素：",
      tipsTitle: "引き算を足し算に変換するヒント",
      tipsBody: "引き算を足し算に変換することで、計算がより簡単で一貫性のあるものになります。この一つのルールを覚えましょう：",
      tipsQuote: "「演算の符号を変えて、引く数の符号を逆にする！」",
      summaryTitle: "➖ 完全まとめ",
      summarySubtitle: "整数の引き算 — 中学1年",
      sum1Title: "整数の引き算のルール",
      sum1Rules: [
        { label: "黄金ルール：a − b = a + (−b)", desc: "すべての引き算は、引く数の反数を足す形に変換できます。", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
        { label: "(+) − (+)：正の数を引く", desc: "正が大きい → 正の結果。負が大きい → 負の結果。例：5 − 8 = 5 + (−8) = −3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
        { label: "(−) − (−)：負の数を引く", desc: "負を引く ＝ 正を足す。例：(−5) − (−3) = (−5) + 3 = −2", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
        { label: "引き算に交換法則はない", desc: "a − b ≠ b − a（一般的に）。順序がとても重要！例：7 − 3 = 4、しかし 3 − 7 = −4", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
        { label: "数直線：引き算 = 戻る", desc: "正の数を引く = 左に移動。負の数を引く = 右に移動。", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      ],
      sum2Title: "引き算のスマートなヒントとコツ",
      sum2Tips: [
        { icon: "🔄", tip: "常に引き算 → 足し算に変換する", detail: "まず a − b を a + (−b) に変換し、足し算のルールを使います。これが最も確実な方法です！", color: "bg-orange-900/30 border-orange-500/30" },
        { icon: "⚠️", tip: "二重マイナスに注意", detail: "a − (−b) = a + b。マイナスが2つ連続するとプラスになります！例：5 − (−3) = 5 + 3 = 8。", color: "bg-red-900/30 border-red-500/30" },
        { icon: "🎯", tip: "絶対値で符号を確認する", detail: "両方の絶対値を計算し、小さい方を大きい方から引いて、絶対値が大きい方の符号をつけます。", color: "bg-yellow-900/30 border-yellow-500/30" },
        { icon: "✅", tip: "逆の足し算で確認する", detail: "a − b = c ならば、c + b = a のはず。これを使って答えを確認しましょう！", color: "bg-green-900/30 border-green-500/30" },
      ],
      conclusionFinal: "結論",
      conclusionBody: "整数の引き算は実は",
      conclusionBold: "足し算に変換できる演算",
      conclusionBody2: "です！魔法の公式を一つ覚えるだけでいいのです：",
      conclusionFormula: "a − b = a + (−b)",
      conclusionBody3: "。すべての引き算を足し算に変換すれば、新しいルールを一切覚える必要がありません！",
      tags: ["a − b = a + (−b)", "マイナスマイナス = プラス", "非交換法則", "数直線", "絶対値"],
      nextLabel: "🚀 整数の掛け算へ進もう！",
      backBtn: "教材リストに戻る",
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
                  {c.introP1} <InlineMath math="5 - (-3)" />{c.introP2}{" "}
                  <strong className="text-primary">{c.introBold}</strong>{" "}{c.introP3}
                </p>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-2">{c.goldenTrickTitle}</p>
                  <p className="font-body text-sm text-yellow-100 leading-relaxed">
                    <strong>{c.goldenTrickBody}</strong>
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <BlockMath math="a - b = a + (-b)" />
                  </div>
                  <p className="font-body text-xs text-yellow-200/70 mt-2">
                    {c.goldenTrickNote}
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.illustrationBold}</strong>{" "}{c.illustrationP}{" "}
                    <InlineMath math="100.000 - 30.000" />{c.illustrationP2}{" "}
                    <InlineMath math="100.000 + (-30.000) = 70.000" />.
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>{c.rememberBold}</strong>{" "}{c.rememberP}{" "}
                    <strong className="text-white">{c.rememberPBold}</strong>{" "}{c.rememberP2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Konsep */}
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
                  {c.konsepP}{" "}<strong className="text-primary">{c.konsepBold}</strong>{c.konsepP2}{" "}
                  <strong className="text-red-400">{c.konsepBoldRed}</strong>{c.konsepP3}
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{c.ruleTitle}</p>
                  <ul className="font-body text-sm text-red-200 space-y-1">
                    <li><strong>{c.ruleA}</strong> {c.ruleADesc} <strong>{c.ruleAKey}</strong></li>
                    <li><strong>{c.ruleB}</strong> {c.ruleBDesc} <strong>{c.ruleBKey}</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/20">
                  <p className={`text-xs text-center mb-2 font-body ${lightMode ? "text-foreground/60" : "text-yellow-300/70"}`}>{c.numberLineLabel}</p>
                  <NumberLineSVG lightMode={lightMode} />
                </div>

                <SubtractionConceptSVG lightMode={lightMode} />

                <InteraktifPengurangan lightMode={lightMode} />

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{c.patternTitle}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 border border-green-500/20">
                      <p className="text-white/70 text-xs mb-1">{c.patPosPosLabel}</p>
                      <BlockMath math="a - b = a + (-b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 border border-cyan-500/20">
                      <p className="text-white/70 text-xs mb-1">{c.patPosNegLabel}</p>
                      <BlockMath math="a - (-b) = a + b" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">{c.patNegPosLabel}</p>
                      <BlockMath math="-a - b = -a + (-b) = -(a + b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">{c.patNegNegLabel}</p>
                      <BlockMath math="-a - (-b) = -a + b" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.tipProBold}</strong>{" "}{c.tipProBody}{" "}
                    <InlineMath math="- (-)" />{c.tipProBody2}{" "}
                    <InlineMath math="+" />{c.tipProBody3}
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
                      {c.ex1Q} <InlineMath math="6 - 4" /> {c.ex1QEnd}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{c.ex1S1}</strong> {c.ex1S1Body} <strong className="text-green-400">{c.ex1S1Bold}</strong> {c.ex1S1End}</p>
                      <p><strong>{c.ex1S2}</strong> {c.ex1S2Body} <strong className="text-red-400">{c.ex1S2Bold}</strong> {c.ex1S2End}</p>
                      <p><strong>{c.ex1S3}</strong> {c.ex1S3Body} <strong className="text-cyan-300">2</strong>.</p>

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
                        <BlockMath math="6 - 4 = 6 + (-4) = 2" />
                      </div>
                      <p className="text-primary font-semibold">{c.ex1Conclusion} <InlineMath math="6 - 4 = 2" /></p>
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
                      <p className="text-white/80">a. <InlineMath math="-8 - 12" /></p>
                      <p className="text-white/80">b. <InlineMath math="6 - (-10)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="-8 - 12" /></p>
                        <p className="mb-1"><strong>{c.ex2aS1}</strong> {c.ex2aS1Body}</p>
                        <BlockMath math="-8 - 12 = -8 + (-12)" />
                        <p className="mb-1"><strong>{c.ex2aS2}</strong> {c.ex2aS2Body}</p>
                        <BlockMath math="-8 + (-12) = -(8 + 12) = -20" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="-20" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="6 - (-10)" /></p>
                        <p className="mb-1"><strong>{c.ex2bS1}</strong> {c.ex2bS1Body}</p>
                        <BlockMath math="6 - (-10) = 6 + 10" />
                        <p className="mb-1"><strong>{c.ex2bS2}</strong> {c.ex2bS2Body}</p>
                        <BlockMath math="6 + 10 = 16" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="16" /></p>
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
                      {c.ex3QP1} <InlineMath math="3" /> {c.ex3QP2} <InlineMath math="7" /> {c.ex3QP3}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{c.ex3S1}</strong> {c.ex3S1Body}</p>
                      <ul className="ml-4 space-y-1 text-white/70">
                        <li>{c.ex3Ref0}</li>
                        <li>{c.ex3RefUp} <InlineMath math="+3" /> {c.ex3RefUpEnd}</li>
                        <li>{c.ex3RefDown} <InlineMath math="-7" /> {c.ex3RefDownEnd}</li>
                      </ul>

                      <figure className="flex flex-col items-center gap-2">
                        <img
                          src="/images/lumba-lumba-pengurangan.png"
                          alt={c.ex3ImgAlt}
                          className="w-full max-w-xl rounded-lg shadow-lg border border-white/10"
                        />
                        <figcaption className="font-body text-xs text-white/60 text-center italic max-w-xl">
                          {c.ex3ImgCaption}
                        </figcaption>
                      </figure>

                      <p><strong>{c.ex3S2}</strong> {c.ex3S2Body}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={c.katexEx3Distance} />
                      </div>
                      <p><strong>{c.ex3S3}</strong> {c.ex3S3Body}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="3 - (-7) = 3 + 7 = 10" />
                      </div>
                      <p className="text-primary font-semibold">{c.ex3Conclusion} <InlineMath math="10" /> {c.ex3ConcEnd}</p>
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
                      {c.ex4Q} <InlineMath math="-14 - 15 - (-21)" />
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{c.ex4S1}</strong> {c.ex4S1Body}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-14 - 15 - (-21) = -14 + (-15) + 21" />
                      </div>
                      <p><strong>{c.ex4S2}</strong> {c.ex4S2Body}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-14 + (-15) = -(14 + 15) = -29" />
                      </div>
                      <p><strong>{c.ex4S3}</strong> {c.ex4S3Body}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-29 + 21 = -(29 - 21) = -8" />
                      </div>
                      <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="-8" /></p>
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

                {/* Sifat 1: Tertutup */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat1Badge}</span>
                    <p className="font-body text-sm font-bold text-orange-300">{c.sifat1Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat1Body} <strong className="text-white">{c.sifat1Bold}</strong>{c.sifat1Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="\forall\, a, b \in \mathbb{Z},\quad a - b \in \mathbb{Z}" />
                  </div>
                  <p className="font-body text-xs text-white/50 text-center mb-2">{c.sifat1KatexNote}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat1PosPos}</p>
                      <InlineMath math="12 - 17 = -5 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat1NegPos}</p>
                      <InlineMath math="-6 - 10 = -16 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{c.sifat1NegNeg}</p>
                      <InlineMath math="-2 - (-9) = 7 \in \mathbb{Z}" />
                    </div>
                  </div>
                </div>

                {/* Sifat 2: Tidak Komutatif */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500/30 text-red-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat2Badge}</span>
                    <p className="font-body text-sm font-bold text-red-300">{c.sifat2Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat2Body} <strong className="text-white">{c.sifat2Bold}</strong>{c.sifat2Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a - b \neq b - a \quad \text{(umumnya)}" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-red-300/80 mb-1">{c.sifat2OrderA}</p>
                      <InlineMath math="8 - 3 = 5" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-red-300/80 mb-1">{c.sifat2OrderB}</p>
                      <InlineMath math="3 - 8 = -5 \neq 5" />
                    </div>
                  </div>
                  <p className="font-body text-xs text-red-200/70 mt-2 text-center">{c.sifat2Note}</p>
                </div>

                {/* Sifat 3: Tidak Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat3Badge}</span>
                    <p className="font-body text-sm font-bold text-purple-300">{c.sifat3Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    {c.sifat3Body} <strong className="text-white">{c.sifat3Bold}</strong>{" "}{c.sifat3Body2}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="(a - b) - c \neq a - (b - c) \quad \text{(umumnya)}" />
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-1">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">{c.sifat3ProofLabel}</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(10 - 5) - 2 = 5 - 2 = 3" /></div>
                      <div className="text-white/40 text-xs">{c.sifat3NotEqual}</div>
                      <div><InlineMath math="10 - (5 - 2) = 10 - 3 = 7" /></div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-purple-200/70 mt-2 text-center">{c.sifat3Note}</p>
                </div>

                {/* Sifat 4: Identitas Kanan */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full">{c.sifat4Badge}</span>
                    <p className="font-body text-sm font-bold text-green-300">{c.sifat4Title}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">{c.sifat4Body}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a - 0 = a \quad \text{dan} \quad 0 - a = -a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-green-300/80 mb-1">{c.sifat4LabelA}</p>
                      <InlineMath math="9 - 0 = 9" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-green-300/80 mb-1">{c.sifat4LabelB}</p>
                      <InlineMath math="0 - 9 = -9" />
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
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {c.cara1Title}
                  </p>
                  <p className="font-body text-sm text-white/80 mb-3 leading-relaxed">{c.cara1Body}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-green-300 text-2xl font-bold mb-1">→</p>
                      <p className="font-body text-sm font-semibold text-green-300">{c.cara1SubNeg}</p>
                      <p className="font-body text-xs text-green-200/80 mt-1"><InlineMath math="a - (-b)" /> {c.cara1SubNegMath} <strong>{c.cara1SubNegKey}</strong></p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">{c.cara1SubNegEx}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                      <p className="text-red-300 text-2xl font-bold mb-1">←</p>
                      <p className="font-body text-sm font-semibold text-red-300">{c.cara1SubPos}</p>
                      <p className="font-body text-xs text-red-200/80 mt-1"><InlineMath math="a - b" /> {c.cara1SubPosMath} <strong>{c.cara1SubPosKey}</strong></p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">{c.cara1SubPosEx}</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3 text-center">
                    <p className="font-body text-xs text-white/60">{c.cara1StepsLabel}</p>
                    <p className="font-body text-sm text-white/90 mt-1">
                      <span className="text-white font-semibold">{c.cara1Step1}</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-red-300 font-semibold">{c.cara1Step2}</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-cyan-300 font-semibold">{c.cara1Step3}</span>
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
                      <p className="font-body text-xs text-green-300 font-semibold mb-1">{c.cara2PosPos}</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center"><InlineMath math="a - b = a + (-b)" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExPosPos}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                      <p className="font-body text-xs text-cyan-300 font-semibold mb-1">{c.cara2PosNeg}</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center"><InlineMath math="a - (-b) = a + b" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExPosNeg}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-red-500/20">
                      <p className="font-body text-xs text-red-300 font-semibold mb-1">{c.cara2NegPos}</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center"><InlineMath math="-a - b = -(a + b)" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExNegPos}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20">
                      <p className="font-body text-xs text-yellow-300 font-semibold mb-1">{c.cara2NegNeg}</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center"><InlineMath math="-a - (-b) = -a + b" /></div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">{c.cara2ExNegNeg}</p>
                    </div>
                  </div>
                </div>

                {/* Rangkuman Sifat */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3">{c.sumPropTitle}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-green-400">{c.sumClosed}</strong> {c.sumClosedDesc}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-red-400 text-sm font-bold">✗</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-red-400">{c.sumNotComm}</strong> <InlineMath math="a - b \neq b - a" /></p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-red-400 text-sm font-bold">✗</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-red-400">{c.sumNotAssoc}</strong> <InlineMath math="(a-b)-c \neq a-(b-c)" /></p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-green-400">{c.sumZero}</strong> <InlineMath math="a - 0 = a" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Tips Box */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> {c.tipsTitle}
            </p>
            <p className="font-body text-sm text-white/70 leading-relaxed mb-3">{c.tipsBody}</p>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="font-body text-sm text-cyan-200">
                <strong>{c.tipsQuote}</strong>
              </p>
              <div className="mt-2">
                <InlineMath math="a - b \rightarrow a + (-b)" />
              </div>
            </div>
          </div>

          {/* Rangkuman Akhir */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{c.summaryTitle}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{c.summarySubtitle}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500 flex items-center justify-center text-[10px]">1</span>
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

              <div className="bg-gradient-to-br from-orange-500/20 via-red-500/15 to-pink-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🏆</div>
                <p className="font-display text-base font-bold text-white">{c.conclusionFinal}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.conclusionBody}{" "}
                  <strong className="text-orange-300">{c.conclusionBold}</strong>{c.conclusionBody2}{" "}
                  <strong className="text-yellow-300">{c.conclusionFormula}</strong>{c.conclusionBody3}
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

          <button
            onClick={() => {
              playPopSound();
              navigate("/materi-matematika/kelas-7/bilangan-bulat");
            }}
            className="mt-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl px-6 py-3 text-primary font-body text-sm transition-all duration-300 mx-auto"
          >
            {c.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenguranganBilanganBulatPage;
