import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Sparkles, List } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Garis Bilangan SVG statis (-5 sampai 5) ──────────────────────── */
const NumberLineSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const cx = (n: number) => 300 + n * 50;
  const numFill = lightMode ? "var(--text-primary)" : "#FFE57F";
  const labelFill = lightMode ? "var(--text-secondary)" : "#FFD700";

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
      <text x="58"  y="83" style={{ fill: labelFill }} fontSize="10" fontFamily="sans-serif" opacity="0.65">← negatif</text>
      <text x="475" y="83" style={{ fill: labelFill }} fontSize="10" fontFamily="sans-serif" opacity="0.65">positif →</text>
    </svg>
  );
};

/* ── Demo Konsep: a − b = a + (−b)
   Phase A (step 1–5)  : pergi ke kanan 5 (busur hijau) dari 0 ke 5
   Phase B (step 6)    : jeda di 5
   Phase C (step 7)    : transisi
   Phase D (step 8–10) : mundur 3 ke kiri dari 5 (busur merah) → hasil = 2
   Phase E (step 11)   : tampilkan hasil, jeda
   → loop
──────────────────────────────────────────────────────────────── */
const SubtractionConceptSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
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
    step <= 5   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 6  ? "Sudah di 5 · sekarang ubah: −3 → +(−3), mundur 3..." :
    step === 7  ? "Menerapkan konsep: 5 − 3 = 5 + (−3)..." :
    step <= 10  ? `Langkah −${step - 7} · dari ${5 - (step - 8)} ke ${4 - (step - 8)}` :
    step === 11 ? "5 − 3 = 5 + (−3) = 2  ✓" :
                  "";

  const statusColor =
    step === 11 ? "#67e8f9" :
    step >= 8   ? "#f87171" :
    step >= 1   ? "#4ade80" :
    "var(--text-primary)";

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

      <text x="14" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold">KANAN →</text>
      <text x="14" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8">(tambah positif)</text>
      <text x="626" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">← KIRI</text>
      <text x="626" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8" textAnchor="end">(kurangi / tambah negatif)</text>

      {isPhaseRight && (
        <text x="320" y="22" textAnchor="middle" fill="#4ade8099" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          0 + 5 → bergerak kanan
        </text>
      )}
      {isPhaseLeft && !showResult && (
        <text x="320" y="22" textAnchor="middle" fill="#f8717199" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          5 − 3 = 5 + (−3) → mundur kiri
        </text>
      )}
      {showResult && (
        <text x="320" y="22" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          5 − 3 = 2  ✓
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

/* ── Animasi bertahap contoh: 6 − 4 = 2 ────────────────────────────
   step 0       : jeda awal
   step 1–6     : busur hijau satu-satu (0→1, …, 5→6)
   step 7       : jeda sejenak
   step 8–11    : busur merah satu-satu (6→5, 5→4, 4→3, 3→2)
   step 12      : tampilkan hasil, lalu mulai ulang
──────────────────────────────────────────────────────────────── */
const NumberLineContoh1SVG = () => {
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
    step === 0  ? "Siap..." :
    step <= 6   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 7  ? "Sudah di 6 · sekarang mundur −4..." :
    step <= 11  ? `Langkah −${step - 7} · dari ${6 - (step - 8)} ke ${5 - (step - 8)}` :
                  "Hasil: 6 − 4 = 2  ✓";

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

/* ── Kalkulator Interaktif Pengurangan Garis Bilangan ───────────────────── */
const InteraktifPengurangan = ({ lightMode = false }: { lightMode?: boolean }) => {
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

  // b > 0 → subtract positive → move LEFT (red arcs, curve down)
  // b < 0 → subtract negative → move RIGHT (green arcs, curve up)
  const arcUp    = b < 0;
  const arcColor = b < 0 ? "#4ade80" : "#f87171";
  const markerId = b < 0 ? "is-arrow-g" : "is-arrow-r";
  const unitPx   = (SVG_W - PAD * 2) / rangeW;

  const isDone = phase === "done";
  const resultEmoji = isDone ? (b === 0 ? "😐" : b > 0 ? "⬅️" : "➡️") : "";

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-xl mb-4 ${lightMode ? "bg-white/80 border-orange-200" : "bg-slate-900/90 border-orange-500/40"}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">🔢</span>
        <span className="font-display text-sm font-bold text-white tracking-wide">Kalkulator Interaktif Pengurangan – Garis Bilangan</span>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Input Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Bilangan ke-1 */}
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-orange-300/70"}`}>Bilangan ke-1</span>
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

          {/* Bilangan ke-2 */}
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-orange-300/70"}`}>Bilangan ke-2</span>
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

          {/* Hasil */}
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-orange-300/70"}`}>Hasil</span>
            <div className={`w-20 h-12 flex items-center justify-center rounded-xl border-2 text-xl font-bold font-mono transition-all
              ${isDone
                ? (lightMode ? "bg-amber-50 border-amber-400 text-amber-700" : "bg-amber-900/30 border-amber-400 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.4)]")
                : (lightMode ? "bg-slate-100 border-slate-200 text-slate-300" : "bg-slate-800/50 border-slate-600 text-slate-500")
              }`}>
              {isDone ? result : "?"}
            </div>
          </div>
        </div>

        {/* Number line SVG */}
        <div className={`rounded-xl p-3 border ${lightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-white/10"}`}>
          <p className={`text-xs text-center mb-2 font-body ${lightMode ? "text-slate-400" : "text-white/40"}`}>
            {phase === "idle" && !validA && "Masukkan angka untuk melihat garis bilangan"}
            {phase === "idle" && validA && !validB && `Titik merah = ${a} · masukkan bilangan ke-2`}
            {phase === "idle" && bothValid && `Siap! Klik Operasikan untuk melihat animasi busur`}
            {phase === "animating" && `Melangkah... ${animStep} dari ${steps} langkah`}
            {phase === "done" && `${a} − (${b}) = ${result} ${resultEmoji}`}
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

              {/* Glow filters */}
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

              {/* Gradients */}
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

              {/* Axis markers */}
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

            {/* Axis */}
            <line x1={10} y1={lineY} x2={SVG_W - 10} y2={lineY}
              stroke="#FFD700" strokeWidth="2.5"
              markerEnd="url(#is-axis-r)" markerStart="url(#is-axis-l)"
              style={{ filter: "drop-shadow(0 0 3px #FFD70088)" }}
            />

            {/* Ticks and labels */}
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

            {/* Idle dot at A */}
            {validA && phase === "idle" && (
              <g key={`is-dot-a-${a}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={toX(a)} cy={lineY} r="9" fill="#fb923c" opacity="0.18" className="is-dot-fade"/>
                <circle cx={toX(a)} cy={lineY} r="6" fill="#fb923c" filter="url(#is-glow-dot)" className="is-dot-fade"/>
              </g>
            )}

            {/* Arcs with staggered CSS animation */}
            {phase !== "idle" && Array.from({ length: steps }, (_, i) => {
              // b > 0 → go left; b < 0 → go right
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
                  <path
                    d={dPath}
                    fill="none"
                    stroke={arcColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeOpacity="0.18"
                    pathLength="100"
                    strokeDasharray="100"
                    className="is-arc-draw is-arc-shimmer"
                    style={{ animationDelay: delay }}
                  />
                  <path
                    d={dPath}
                    fill="none"
                    stroke={gradId}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="100"
                    filter={glowFilter}
                    className="is-arc-draw"
                    style={{ animationDelay: delay }}
                    markerEnd={`url(#${markerId})`}
                  />
                </g>
              );
            })}

            {/* Result dot */}
            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13" fill="#fbbf24" opacity="0.15" className="is-dot-fade"/>
                <circle cx={toX(result)} cy={lineY} r="7" fill="#fbbf24" filter="url(#is-glow-amber)" className="is-dot-fade"/>
              </g>
            )}

            {/* Result ring + sparkle */}
            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13"
                  fill="none" stroke="#fbbf24" strokeWidth="2.5"
                  filter="url(#is-glow-amber)"
                  className="is-ring-pop"
                />
                {[0, 60, 120, 180, 240, 300].map((deg, si) => {
                  const rad = (deg * Math.PI) / 180;
                  const sx = toX(result) + Math.cos(rad) * 18;
                  const sy = lineY + Math.sin(rad) * 18;
                  return (
                    <circle key={`is-sp${si}`} cx={sx} cy={sy} r="2"
                      fill="#fbbf24"
                      className="is-sparkle"
                      style={{ animationDelay: `${si * 0.06}s`, transformOrigin: `${sx}px ${sy}px` }}
                    />
                  );
                })}
              </g>
            )}

            {/* Label "mulai" */}
            {phase !== "idle" && (
              <text x={toX(a)} y={lineY - 22}
                textAnchor="middle" fontFamily="sans-serif" fontSize="9"
                fill="#fb923c" opacity="0.85">
                mulai ({a})
              </text>
            )}
          </svg>
        </div>

        {/* Hint row */}
        {bothValid && phase === "idle" && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body ${lightMode ? "bg-orange-50 text-orange-700" : "bg-orange-900/30 text-orange-300"}`}>
            <span>{b > 0 ? "⬅️" : b < 0 ? "➡️" : "⏸️"}</span>
            <span>
              {b > 0
                ? `Mengurangi bilangan positif → busur merah bergerak ke KIRI sejauh ${steps} langkah`
                : b < 0
                ? `Mengurangi bilangan negatif → busur hijau bergerak ke KANAN sejauh ${steps} langkah (min-min = plus!)`
                : "Mengurangi nol → posisi tidak berubah"}
            </span>
          </div>
        )}
        {isDone && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body font-semibold ${lightMode ? "bg-green-50 text-green-700 border border-green-200" : "bg-green-900/30 text-green-300 border border-green-500/30"}`}>
            <span>✅</span>
            <span>{a} − ({b}) = <strong>{result}</strong> {resultEmoji}</span>
          </div>
        )}

        {/* Button */}
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
            {phase === "animating" ? "⏳ Animasi berjalan..." : phase === "done" ? "🔄 Ulangi" : "🚀 Operasikan"}
          </button>
          {phase === "done" && (
            <button
              onClick={() => { setInputA(""); setInputB(""); handleReset(); }}
              className={`ml-2 px-4 py-2.5 rounded-xl font-body text-sm transition-all cursor-pointer
                ${lightMode ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60"}`}
            >
              Reset
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
  const lightMode = ["light", "white", "forest"].includes(theme);
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh", "sifat", "kesimpulan"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGURANGAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── Kalkulator Interaktif ── */}
          <InteraktifPengurangan lightMode={lightMode} />

          {/* Section: Pengantar - Kunci Rahasia Pengurangan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kunci Rahasia Pengurangan Bilangan Bulat</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernah bingung saat menghitung <InlineMath math="5 - (-3)" />? Tenang, kamu tidak sendirian! Pengurangan bilangan bulat memang terlihat tricky, tapi sebenarnya ada <strong className="text-primary">satu trik sederhana</strong> yang akan membuatmu jago menyelesaikan soal apapun.
                </p>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-2">🔑 Trik Emas Pengurangan:</p>
                  <p className="font-body text-sm text-yellow-100 leading-relaxed">
                    <strong>Mengurangi suatu bilangan sama dengan menambah dengan lawan bilangan tersebut!</strong>
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <BlockMath math="a - b = a + (-b)" />
                  </div>
                  <p className="font-body text-xs text-yellow-200/70 mt-2">
                    Artinya, cukup ubah tanda pengurangan menjadi penjumlahan, lalu balik tanda bilangan pengurangnya!
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Ilustrasi nyata:</strong> Bayangkan kamu punya uang Rp100.000 dan harus membayar hutang Rp30.000. Ini bisa ditulis <InlineMath math="100.000 - 30.000" />. Bisa juga dipikirkan sebagai: uangmu "bertambah" dengan nilai negatif (hutang), yaitu <InlineMath math="100.000 + (-30.000) = 70.000" />.
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>Ingat:</strong> Di garis bilangan, <strong className="text-white">pengurangan = bergerak ke KIRI</strong> sejumlah bilangan pengurang. Ini adalah kebalikan dari penjumlahan positif.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Ringkasan Intisari: Konsep Pengurangan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Konsep Pengurangan</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Cara paling mudah memahami pengurangan bilangan bulat adalah dengan <strong className="text-primary">garis bilangan</strong>. Di garis bilangan, pengurangan artinya bergerak ke <strong className="text-red-400">KIRI</strong>.
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">Aturan Jalan Pengurangan di Garis Bilangan:</p>
                  <ul className="font-body text-sm text-red-200 space-y-1">
                    <li><strong>a − b</strong> : dari posisi a, mundur b langkah ke <strong>kiri</strong></li>
                    <li><strong>a − (−b)</strong> : mengurangi negatif = maju b langkah ke <strong>kanan</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/20">
                  <p className={`text-xs text-center mb-2 font-body ${lightMode ? "text-foreground/60" : "text-yellow-300/70"}`}>Garis Bilangan</p>
                  <NumberLineSVG lightMode={lightMode} />
                </div>

                {/* ── Demo Animasi Konsep ── */}
                <div className="bg-slate-900/60 rounded-xl p-3 border border-cyan-500/20">
                  <p className={`text-xs text-center mb-1 font-body ${lightMode ? "text-foreground/60" : "text-cyan-300/70"}`}>
                    Demo: Pengurangan pada Garis Bilangan · 5 − 3 = 5 + (−3) = 2
                  </p>
                  <SubtractionConceptSVG lightMode={lightMode} />
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Pola Pengurangan Bilangan Bulat:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 border border-green-500/20">
                      <p className="text-white/70 text-xs mb-1">Positif dikurangi Positif:</p>
                      <BlockMath math="a - b = a + (-b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 border border-cyan-500/20">
                      <p className="text-white/70 text-xs mb-1">Positif dikurangi Negatif (hasilnya pasti lebih besar!):</p>
                      <BlockMath math="a - (-b) = a + b" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Negatif dikurangi Positif:</p>
                      <BlockMath math="-a - b = -a + (-b) = -(a + b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Negatif dikurangi Negatif:</p>
                      <BlockMath math="-a - (-b) = -a + b" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Pro:</strong> Setiap kali ketemu tanda "minus-minus" <InlineMath math="- (-)" />, langsung ubah jadi "plus" <InlineMath math="+" />. Dua negatif yang bertemu akan saling menghilangkan!
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
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah hasil dari <InlineMath math="6 - 4" /> menggunakan garis bilangan!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Mulai dari titik 0, bergerak 6 satuan ke <strong className="text-green-400">kanan</strong> (karena 6 positif).</p>
                      <p><strong>Langkah 2:</strong> Dari titik 6, mundur 4 satuan ke <strong className="text-red-400">kiri</strong> (pengurangan = mundur).</p>
                      <p><strong>Langkah 3:</strong> Titik akhir berada di angka <strong className="text-cyan-300">2</strong>.</p>

                      <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20 mt-2">
                        <p className="text-yellow-300/70 text-xs text-center mb-1 font-body">Visualisasi di Garis Bilangan</p>
                        <NumberLineContoh1SVG />
                        <div className="flex flex-wrap gap-3 justify-center mt-1 text-xs font-body">
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-green-400"></span> +6 ke kanan</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-red-400"></span> −4 ke kiri</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full border-2 border-cyan-300"></span> hasil = 2</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded p-3 mt-2">
                        <BlockMath math="6 - 4 = 6 + (-4) = 2" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, <InlineMath math="6 - 4 = 2" /></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah hasil pengurangan berikut:
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="-8 - 12" /></p>
                      <p className="text-white/80">b. <InlineMath math="6 - (-10)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="-8 - 12" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Ubah pengurangan menjadi penjumlahan dengan lawan bilangan.</p>
                        <BlockMath math="-8 - 12 = -8 + (-12)" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Kedua bilangan negatif, jumlahkan nilainya dan beri tanda negatif.</p>
                        <BlockMath math="-8 + (-12) = -(8 + 12) = -20" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="-20" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="6 - (-10)" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Tanda minus-minus berubah jadi plus!</p>
                        <BlockMath math="6 - (-10) = 6 + 10" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Jumlahkan kedua bilangan positif.</p>
                        <BlockMath math="6 + 10 = 16" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="16" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit (Soal Cerita) */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3: Soal Cerita</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Seekor lumba-lumba melompat hingga mencapai ketinggian <InlineMath math="3" /> meter di atas permukaan air laut, kemudian menyelam hingga kedalaman <InlineMath math="7" /> meter di bawah permukaan. Berapa jarak total antara titik tertinggi lompatan dengan titik terendah penyelaman?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan titik acuan dan nilai masing-masing posisi.</p>
                      <ul className="ml-4 space-y-1 text-white/70">
                        <li>Permukaan air laut = titik nol (0)</li>
                        <li>Ketinggian lompatan = <InlineMath math="+3" /> meter (di atas nol)</li>
                        <li>Kedalaman penyelaman = <InlineMath math="-7" /> meter (di bawah nol)</li>
                      </ul>

                      <figure className="flex flex-col items-center gap-2">
                        <img
                          src="/images/lumba-lumba-pengurangan.png"
                          alt="Ilustrasi lumba-lumba melompat dan menyelam"
                          className="w-full max-w-xl rounded-lg shadow-lg border border-white/10"
                        />
                        <figcaption className="font-body text-xs text-white/60 text-center italic max-w-xl">
                          Sumber: Ilustrasi garis bilangan
                        </figcaption>
                      </figure>

                      <p><strong>Langkah 2:</strong> Hitung jarak = posisi atas dikurangi posisi bawah.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Jarak} = 3 - (-7)" />
                      </div>
                      <p><strong>Langkah 3:</strong> Terapkan rumus pengurangan.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="3 - (-7) = 3 + 7 = 10" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, jarak antara puncak lompatan dengan kedalaman penyelaman adalah <InlineMath math="10" /> meter.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 4 - Bonus: Operasi Campuran */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white">Contoh 4: Rantai Pengurangan</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah hasil dari <InlineMath math="-14 - 15 - (-21)" />
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ubah semua pengurangan menjadi penjumlahan dengan lawan bilangan.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-14 - 15 - (-21) = -14 + (-15) + 21" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung dari kiri ke kanan. Pertama, jumlahkan dua bilangan negatif:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-14 + (-15) = -(14 + 15) = -29" />
                      </div>
                      <p><strong>Langkah 3:</strong> Kemudian tambahkan dengan 21:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-29 + 21 = -(29 - 21) = -8" />
                      </div>
                      <p className="text-primary font-semibold">Jawaban: <InlineMath math="-8" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section: Sifat-sifat Pengurangan Bilangan Bulat */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifat")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Sifat-sifat Pengurangan Bilangan Bulat</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Pengurangan bilangan bulat memiliki sifat-sifat penting yang berbeda dari penjumlahan. Mari kita pelajari satu per satu:
                </p>

                {/* Sifat 1: Tertutup */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 1</span>
                    <p className="font-body text-sm font-bold text-orange-300">Sifat Tertutup</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Hasil pengurangan dua bilangan bulat <strong className="text-white">selalu bilangan bulat juga</strong>. Operasi ini tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="\forall\, a, b \in \mathbb{Z},\quad a - b \in \mathbb{Z}" />
                  </div>
                  <p className="font-body text-xs text-white/50 text-center mb-2">(Untuk setiap a dan b bilangan bulat, hasil a − b juga bilangan bulat)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">positif − positif</p>
                      <InlineMath math="12 - 17 = -5 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">negatif − positif</p>
                      <InlineMath math="-6 - 10 = -16 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">negatif − negatif</p>
                      <InlineMath math="-2 - (-9) = 7 \in \mathbb{Z}" />
                    </div>
                  </div>
                </div>

                {/* Sifat 2: Tidak Komutatif */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500/30 text-red-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 2</span>
                    <p className="font-body text-sm font-bold text-red-300">Tidak Memiliki Sifat Komutatif</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Berbeda dengan penjumlahan, <strong className="text-white">menukar urutan bilangan yang dikurangi MENGUBAH hasilnya</strong>.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a - b \neq b - a \quad \text{(umumnya)}" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-red-300/80 mb-1">Urutan asal:</p>
                      <InlineMath math="8 - 3 = 5" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-red-300/80 mb-1">Urutan dibalik:</p>
                      <InlineMath math="3 - 8 = -5 \neq 5" />
                    </div>
                  </div>
                  <p className="font-body text-xs text-red-200/70 mt-2 text-center">
                    Urutan sangat penting dalam pengurangan!
                  </p>
                </div>

                {/* Sifat 3: Tidak Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 3</span>
                    <p className="font-body text-sm font-bold text-purple-300">Tidak Memiliki Sifat Asosiatif</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Cara <strong className="text-white">mengelompokkan</strong> bilangan yang dikurangi mempengaruhi hasil akhirnya.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="(a - b) - c \neq a - (b - c) \quad \text{(umumnya)}" />
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-1">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">Contoh pembuktian:</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(10 - 5) - 2 = 5 - 2 = 3" /></div>
                      <div className="text-white/40 text-xs">TIDAK sama dengan</div>
                      <div><InlineMath math="10 - (5 - 2) = 10 - 3 = 7" /></div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-purple-200/70 mt-2 text-center">
                    Selalu kerjakan pengurangan dari kiri ke kanan!
                  </p>
                </div>

                {/* Sifat 4: Identitas Kanan */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 4</span>
                    <p className="font-body text-sm font-bold text-green-300">Elemen Nol pada Pengurangan</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Mengurangi suatu bilangan dengan nol menghasilkan bilangan itu sendiri. Namun, nol dikurangi bilangan menghasilkan lawan bilangan tersebut.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a - 0 = a \quad \text{dan} \quad 0 - a = -a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-green-300/80 mb-1">Dikurangi 0:</p>
                      <InlineMath math="9 - 0 = 9" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-green-300/80 mb-1">0 dikurangi:</p>
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
                <span className="font-body font-semibold text-white">Kesimpulan dan Tips</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">

                {/* Cara 1: Garis Bilangan */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Cara 1 — Menggunakan Garis Bilangan
                  </p>
                  <p className="font-body text-sm text-white/80 mb-3 leading-relaxed">
                    Bayangkan kamu berdiri di titik awal pada garis bilangan. Arah gerakanmu menentukan hasilnya:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-green-300 text-2xl font-bold mb-1">→</p>
                      <p className="font-body text-sm font-semibold text-green-300">Dikurangi Negatif</p>
                      <p className="font-body text-xs text-green-200/80 mt-1"><InlineMath math="a - (-b)" /> = maju ke <strong>kanan</strong></p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">Contoh: 4 − (−3) → maju 3 ke kanan</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                      <p className="text-red-300 text-2xl font-bold mb-1">←</p>
                      <p className="font-body text-sm font-semibold text-red-300">Dikurangi Positif</p>
                      <p className="font-body text-xs text-red-200/80 mt-1"><InlineMath math="a - b" /> = mundur ke <strong>kiri</strong></p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">Contoh: 6 − 4 → mundur 4 ke kiri</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3 text-center">
                    <p className="font-body text-xs text-white/60">Langkah-langkah:</p>
                    <p className="font-body text-sm text-white/90 mt-1">
                      <span className="text-white font-semibold">① Mulai dari titik pertama</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-red-300 font-semibold">② Mundur sesuai bilangan pengurang</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-cyan-300 font-semibold">③ Posisi akhir = hasil</span>
                    </p>
                  </div>
                </div>

                {/* Cara 2: Rumus Ubah ke Penjumlahan */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> Cara 2 — Ubah ke Penjumlahan
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-green-500/20">
                      <p className="font-body text-xs text-green-300 font-semibold mb-1">Positif − Positif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="a - b = a + (-b)" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: 8 − 3 = 8 + (−3) = 5</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                      <p className="font-body text-xs text-cyan-300 font-semibold mb-1">Positif − Negatif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="a - (-b) = a + b" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: 4 − (−6) = 4 + 6 = 10</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-red-500/20">
                      <p className="font-body text-xs text-red-300 font-semibold mb-1">Negatif − Positif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="-a - b = -(a + b)" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −5 − 3 = −(5+3) = −8</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20">
                      <p className="font-body text-xs text-yellow-300 font-semibold mb-1">Negatif − Negatif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="-a - (-b) = -a + b" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −7 − (−2) = −7+2 = −5</p>
                    </div>
                  </div>
                </div>

                {/* Rangkuman Sifat */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3">📋 Rangkuman Sifat Pengurangan</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-green-400">Tertutup:</strong> Hasil selalu bilangan bulat</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-red-400 text-sm font-bold">✗</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-red-400">Tidak Komutatif:</strong> <InlineMath math="a - b \neq b - a" /></p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-red-400 text-sm font-bold">✗</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-red-400">Tidak Asosiatif:</strong> <InlineMath math="(a-b)-c \neq a-(b-c)" /></p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-green-400">Elemen Nol:</strong> <InlineMath math="a - 0 = a" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Tips Box */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Tips Mengubah Pengurangan ke Penjumlahan
            </p>
            <p className="font-body text-sm text-white/70 leading-relaxed mb-3">
              Dengan mengubah operasi pengurangan menjadi penjumlahan, perhitungan menjadi lebih mudah dan konsisten. Ingat satu aturan ini:
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="font-body text-sm text-cyan-200">
                <strong>"Ubah tanda operasi, balik tanda bilangan pengurang!"</strong>
              </p>
              <div className="mt-2">
                <InlineMath math="a - b \rightarrow a + (-b)" />
              </div>
            </div>
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">➖ RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Pengurangan Bilangan Bulat — Kelas 7</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              {/* Konsep Utama */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500 flex items-center justify-center text-[10px]">1</span>
                  Aturan Pengurangan Bilangan Bulat
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Kunci Utama: a − b = a + (−b)", desc: "Setiap pengurangan dapat diubah menjadi penjumlahan dengan lawan dari bilangan pengurang.", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
                    { label: "(+) − (+): kurangi positif", desc: "Jika positif lebih besar → hasil positif. Jika negatif lebih besar → hasil negatif. Contoh: 5 − 8 = 5 + (−8) = −3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
                    { label: "(−) − (−): kurangi negatif", desc: "Mengurangi negatif = menambah positif. Contoh: (−5) − (−3) = (−5) + 3 = −2", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
                    { label: "Pengurangan TIDAK Komutatif", desc: "a − b ≠ b − a (umumnya). Urutan sangat penting! Contoh: 7 − 3 = 4, tetapi 3 − 7 = −4", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
                    { label: "Garis Bilangan: Pengurangan = Mundur", desc: "Mengurang bilangan positif = langkah ke kiri. Mengurang bilangan negatif = langkah ke kanan.", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
                  ].map(({ label, desc, color }) => (
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

              {/* Tips & Trik */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                  Tips &amp; Trik Jitu Pengurangan
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "🔄", tip: "Selalu ubah pengurangan → penjumlahan", detail: "Ubah a − b menjadi a + (−b) terlebih dahulu, lalu gunakan aturan penjumlahan. Ini strategi paling aman!", color: "bg-orange-900/30 border-orange-500/30" },
                    { icon: "⚠️", tip: "Hati-hati dengan dua tanda negatif", detail: "a − (−b) = a + b. Dua tanda minus berturut-turut menjadi plus! Contoh: 5 − (−3) = 5 + 3 = 8.", color: "bg-red-900/30 border-red-500/30" },
                    { icon: "🎯", tip: "Cek tanda hasil dengan nilai mutlak", detail: "Hitung nilai mutlak kedua bilangan, kurangi yang lebih kecil dari yang lebih besar, lalu ambil tanda dari bilangan yang nilai mutlaknya lebih besar.", color: "bg-yellow-900/30 border-yellow-500/30" },
                    { icon: "✅", tip: "Verifikasi dengan penjumlahan balik", detail: "Jika a − b = c, maka c + b harus = a. Gunakan ini untuk memeriksa jawabanmu!", color: "bg-green-900/30 border-green-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
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

              {/* Kesimpulan */}
              <div className="bg-gradient-to-br from-orange-500/20 via-red-500/15 to-pink-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🏆</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pengurangan bilangan bulat sebenarnya{" "}
                  <strong className="text-orange-300">adalah penjumlahan yang tersamarkan</strong>! Cukup ingat satu rumus ajaib:{" "}
                  <strong className="text-yellow-300">a − b = a + (−b)</strong>. Ubah semua pengurangan menjadi penjumlahan, dan kamu tidak perlu menghafal aturan baru sama sekali!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["a − b = a + (−b)", "Dua Minus = Plus", "Tidak Komutatif", "Garis Bilangan", "Nilai Mutlak"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Siap lanjut ke Perkalian Bilangan Bulat!</p>
              </div>

            </div>
          </div>

          {/* Back Navigation */}
          <button
            onClick={() => {
              playPopSound();
              navigate("/materi-matematika/kelas-7/bilangan-bulat");
            }}
            className="mt-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl px-6 py-3 text-primary font-body text-sm transition-all duration-300 mx-auto"
          >
            Kembali ke Daftar Materi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenguranganBilanganBulatPage;
