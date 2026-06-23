import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Sparkles, List } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Garis Bilangan SVG (-5 sampai 5) ──────────────────────── */
const NumberLineSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const cx = (n: number) => 300 + n * 50; // 0 berada di tengah x=300
  const numFill = lightMode ? "var(--text-primary)" : "#FFE57F";
  const labelFill = lightMode ? "var(--text-secondary)" : "#FFD700";

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

      {/* Sumbu utama */}
      <line x1="14" y1="38" x2="606" y2="38"
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#arr-r)" markerStart="url(#arr-l)" />

      {/* Elipsis */}
      <text x="7"   y="43" style={{ fill: labelFill }} fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      <text x="613" y="43" style={{ fill: labelFill }} fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>

      {/* Tick + label per angka */}
      {nums.map(n => {
        const x = cx(n);
        const isZero = n === 0;
        return (
          <g key={n}>
            {/* Tick mark */}
            <line
              x1={x} y1={isZero ? 26 : 30}
              x2={x} y2={isZero ? 50 : 46}
              stroke="var(--text-primary)"
              strokeWidth={isZero ? 2.5 : 1.8}
            />
            {/* Angka */}
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

      {/* Label negatif / positif */}
      <text x="58"  y="83" style={{ fill: labelFill }} fontSize="10" fontFamily="sans-serif" opacity="0.65">← negatif</text>
      <text x="475" y="83" style={{ fill: labelFill }} fontSize="10" fontFamily="sans-serif" opacity="0.65">positif →</text>
    </svg>
  );
};

/* ── Demo Arah: positif=kanan, negatif=kiri ──────────────────────
   Phase A (step 1–4)  : busur hijau ke kanan  0→+4
   Phase B (step 5)    : tahan hasil kanan (2 detik)
   Phase C (step 6)    : transisi
   Phase D (step 7–10) : busur merah ke kiri   0→−4
   Phase E (step 11)   : tahan hasil kiri (2 detik)
   → loop
──────────────────────────────────────────────────────────────── */
const DirectionDemoSVG = ({ lightMode = false }: { lightMode?: boolean }) => {
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
    step <= 4   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 5  ? "0 + 4 = 4  ✓  Positif → bergerak ke KANAN →" :
    step === 6  ? "Sekarang dengan bilangan negatif..." :
    step <= 10  ? `Langkah −${step - 6} · dari ${step === 7 ? 0 : -(step - 7)} ke ${-(step - 6)}` :
    step === 11 ? "0 + (−4) = −4  ✓  Negatif → bergerak ke KIRI ←" :
                  "";

  const statusColor =
    step === 5  ? "#4ade80" :
    step === 11 ? "#f87171" :
    step >= 7   ? "#f87171" :
    step >= 1   ? "#4ade80" :
    "var(--text-primary)";

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

      {/* ── Label arah kiri/kanan ── */}
      <text x="14" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold">← KIRI</text>
      <text x="14" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#f87171" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8">(negatif)</text>
      <text x="626" y="15" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">KANAN →</text>
      <text x="626" y="27" style={{ fill: lightMode ? "var(--text-secondary)" : "#4ade80" }} fontSize="9"  fontFamily="sans-serif" opacity="0.8" textAnchor="end">(positif)</text>

      {/* ── Label operasi sedang berjalan ── */}
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

      {/* ── Sumbu kuning ── */}
      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#dird-ar)" markerStart="url(#dird-al)"/>

      {/* ── Titik awal di 0 (putih) ── */}
      <circle cx={cx(0)} cy={yA} r="5" fill="#ffffff" opacity="0.9"/>

      {/* ── Tick + angka ── */}
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

      {/* ── Busur HIJAU: +1 ke kanan, satu-satu ── */}
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

      {/* ── Busur MERAH: −1 ke kiri, satu-satu ── */}
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

      {/* ── Lingkaran hasil ── */}
      {showResultRight && (
        <circle cx={cx(4)}  cy={yA} r="9" fill="none" stroke="#4ade80" strokeWidth="2.5"/>
      )}
      {showResultLeft && (
        <circle cx={cx(-4)} cy={yA} r="9" fill="none" stroke="#f87171" strokeWidth="2.5"/>
      )}

      {/* ── Titik posisi saat ini ── */}
      {step >= 1 && step <= 4 && (
        <circle cx={cx(step)}        cy={yA} r="5" fill="#4ade80"/>
      )}
      {step >= 7 && step <= 10 && (
        <circle cx={cx(-(step - 6))} cy={yA} r="5" fill="#f87171"/>
      )}

      {/* ── Teks status ── */}
      {statusText && (
        <text x="320" y="136" textAnchor="middle" fontFamily="sans-serif"
          fontSize="11.5" fontWeight="bold" fill={statusColor}>
          {statusText}
        </text>
      )}
    </svg>
  );
};

/* ── Animasi bertahap: 8 + (−3) = 5 ────────────────────────────
   step 0       : jeda awal
   step 1–8     : busur hijau satu-satu (0→1, 1→2, … 7→8)
   step 9       : jeda sejenak
   step 10–12   : busur merah satu-satu (8→7, 7→6, 6→5)
   step 13      : tampilkan hasil, lalu mulai ulang
──────────────────────────────────────────────────────────────── */
const NumberLineContoh1SVG = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 800  :
      step === 9  ? 1100 :   // jeda setelah semua hijau
      step === 13 ? 2800 :   // tampilkan hasil sebelum reset
      750;
    const t = setTimeout(() => setStep(s => (s >= 13 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 50;
  const cx   = (n: number) => 90 + n * sp;  // cx(0)=90, cx(8)=490, cx(5)=340
  const yA   = 68;                            // y sumbu
  const nums = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const numGreen   = Math.min(step, 8);
  const numRed     = Math.min(step >= 10 ? step - 9 : 0, 3);  // max 3 busur
  const showResult = step >= 12;

  const statusText =
    step === 0  ? "Siap..." :
    step <= 8   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 9  ? "Sudah di 8 · sekarang mundur −3..." :
    step <= 12  ? `Langkah −${step - 9} · dari ${8 - (step - 10)} ke ${7 - (step - 10)}` :
                  "Hasil: 8 + (−3) = 5  ✓";

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

      {/* ── Sumbu kuning ── */}
      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#nl2-ar)" markerStart="url(#nl2-al)"/>

      {/* ── Tick + angka ── */}
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

      {/* ── Busur HIJAU: tiap langkah +1 ke kanan ── */}
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

      {/* ── Busur MERAH: tiap langkah −1 ke kiri ── */}
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

      {/* ── Lingkaran hasil di angka 5 ── */}
      {showResult && (
        <circle cx={cx(5)} cy={yA} r="8"
          fill="none" stroke="#67e8f9" strokeWidth="2.5"/>
      )}

      {/* ── Titik posisi saat ini ── */}
      {step >= 1 && step <= 8 && (
        <circle cx={cx(step)} cy={yA} r="4" fill="#4ade80"/>
      )}
      {step >= 10 && step <= 12 && (
        <circle cx={cx(7 - (step - 10))} cy={yA} r="4" fill="#f87171"/>
      )}

      {/* ── Label status di bawah ── */}
      <text x="320" y="122" textAnchor="middle" fontFamily="sans-serif"
        fontSize="11.5" fontWeight="bold" fill={statusColor}>
        {statusText}
      </text>
    </svg>
  );
};

/* ── Kalkulator Interaktif Garis Bilangan ───────────────────── */
const InteraktifPenjumlahan = ({ lightMode = false }: { lightMode?: boolean }) => {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [phase, setPhase] = useState<"idle" | "animating" | "done">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawA = parseInt(inputA);
  const rawB = parseInt(inputB);
  const validA = inputA !== "" && !isNaN(rawA);
  const validB = inputB !== "" && !isNaN(rawB);
  const bothValid = validA && validB;

  const a = validA ? Math.max(-20, Math.min(20, rawA)) : 0;
  const b = validB ? Math.max(-20, Math.min(20, rawB)) : 0;
  const result = a + b;
  const steps = Math.abs(b);

  // Per-arc duration (seconds) — arcs stagger by this amount
  const ARC_DUR = 1.1;
  // Total animation time in ms = steps * ARC_DUR * 1000 + tail
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
  const step = rangeW > 16 ? 5 : rangeW > 8 ? 2 : 1;

  // Single timer: marks done after all CSS arcs finish
  useEffect(() => {
    if (phase !== "animating") return;
    timerRef.current = setTimeout(() => setPhase("done"), totalMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, totalMs]);

  const handleOperate = () => {
    if (!bothValid) return;
    playPopSound();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (steps === 0) { setPhase("done"); return; }
    setPhase("idle");          // brief reset so CSS animations restart
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("animating")));
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  };

  const arcColor = b >= 0 ? "#4ade80" : "#f87171";
  const arcUp    = b >= 0;
  const markerId = b >= 0 ? "ia-arrow-g" : "ia-arrow-r";
  const unitPx   = (SVG_W - PAD * 2) / rangeW;

  const isDone = phase === "done";
  // Dot x-offset from starting position a, driven by CSS transition
  const dotTargetX = isDone ? toX(result) : phase === "animating" ? toX(result) : toX(a);

  const resultEmoji = isDone ? (b === 0 ? "😐" : b > 0 ? "🎉" : "🔄") : "";

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-xl mb-4 ${lightMode ? "bg-white/80 border-blue-200" : "bg-slate-900/90 border-cyan-500/40"}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">🧮</span>
        <span className="font-display text-sm font-bold text-white tracking-wide">Kalkulator Interaktif Garis Bilangan</span>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Input Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-cyan-300/70"}`}>Bilangan ke-1</span>
            <input
              type="number"
              value={inputA}
              onChange={e => { setInputA(e.target.value); handleReset(); }}
              placeholder="0"
              min={-20} max={20}
              className={`w-20 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all font-mono
                ${lightMode
                  ? "bg-blue-50 border-blue-300 text-slate-800 focus:border-blue-500"
                  : "bg-slate-800 border-cyan-500/60 text-cyan-200 focus:border-cyan-400"
                }
                ${validA ? (lightMode ? "border-blue-500 shadow-md" : "border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]") : ""}`}
            />
          </div>

          <span className={`text-3xl font-bold mt-5 ${lightMode ? "text-slate-600" : "text-yellow-300"}`}>+</span>

          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-cyan-300/70"}`}>Bilangan ke-2</span>
            <input
              type="number"
              value={inputB}
              onChange={e => { setInputB(e.target.value); handleReset(); }}
              placeholder="0"
              min={-20} max={20}
              className={`w-20 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all font-mono
                ${lightMode
                  ? "bg-blue-50 border-blue-300 text-slate-800 focus:border-blue-500"
                  : "bg-slate-800 border-cyan-500/60 text-cyan-200 focus:border-cyan-400"
                }
                ${validB ? (b >= 0
                  ? (lightMode ? "border-green-500 shadow-md" : "border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.3)]")
                  : (lightMode ? "border-red-400 shadow-md" : "border-red-400 shadow-[0_0_12px_rgba(248,113,113,0.3)]")
                ) : ""}`}
            />
          </div>

          <span className={`text-3xl font-bold mt-5 ${lightMode ? "text-slate-600" : "text-yellow-300"}`}>=</span>

          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${lightMode ? "text-slate-500" : "text-cyan-300/70"}`}>Hasil</span>
            <div className={`w-20 h-12 flex items-center justify-center rounded-xl border-2 text-xl font-bold font-mono transition-all
              ${isDone
                ? (lightMode ? "bg-green-50 border-green-400 text-green-700" : "bg-green-900/30 border-green-400 text-green-300 shadow-[0_0_16px_rgba(74,222,128,0.4)]")
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
            {phase === "done" && `${a} + (${b}) = ${result} ${resultEmoji}`}
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
                .arc-draw  {
                  animation: arcDraw 1.0s cubic-bezier(0.4,0,0.2,1) both;
                }
                .arc-shimmer { animation: shimmer 3s ease-in-out infinite; }
                .dot-fade  { animation: dotFade 0.5s ease-out both; }
                .ring-pop  {
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

              {/* Glow filters */}
              <filter id="glow-g" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                  values="0 0 0 0 0.2  0 0 0 0 1  0 0 0 0 0.4  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-r" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                  values="0 0 0 0 1  0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-cyan" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0.9  0 0 0 0 1  0 0 0 1 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-dot" x="-80%" y="-80%" width="360%" height="360%">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              {/* Gradients for arcs */}
              <linearGradient id="grad-g" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#86efac"/>
                <stop offset="50%"  stopColor="#4ade80"/>
                <stop offset="100%" stopColor="#22c55e"/>
              </linearGradient>
              <linearGradient id="grad-r" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#fca5a5"/>
                <stop offset="50%"  stopColor="#f87171"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>

              {/* Axis markers */}
              <marker id="ia-axis-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
              </marker>
              <marker id="ia-axis-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
                <polygon points="0 0,9 3.5,0 7" fill="#FFD700"/>
              </marker>
              <marker id="ia-arrow-g" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#4ade80"/>
              </marker>
              <marker id="ia-arrow-r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#f87171"/>
              </marker>
            </defs>

            {/* Axis */}
            <line x1={10} y1={lineY} x2={SVG_W - 10} y2={lineY}
              stroke="#FFD700" strokeWidth="2.5"
              markerEnd="url(#ia-axis-r)" markerStart="url(#ia-axis-l)"
              style={{ filter: "drop-shadow(0 0 3px #FFD70088)" }}
            />

            {/* Ticks and labels */}
            {visibleNums.map(n => {
              const x = toX(n);
              const isZero = n === 0;
              const isA    = validA && n === a;
              const isRes  = isDone && n === result;
              const showLabel = n % step === 0 || isA || isRes || isZero;
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

            {/* Idle dot at A */}
            {validA && phase === "idle" && (
              <g key={`dot-a-${a}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={toX(a)} cy={lineY} r="9" fill="#f0abfc" opacity="0.18" className="dot-fade"/>
                <circle cx={toX(a)} cy={lineY} r="6" fill="#f0abfc" filter="url(#glow-dot)" className="dot-fade"/>
              </g>
            )}

            {/* All arcs — rendered immediately with staggered CSS animationDelay */}
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
                  {/* Soft glow halo */}
                  <path
                    d={dPath}
                    fill="none"
                    stroke={arcColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeOpacity="0.18"
                    pathLength="100"
                    strokeDasharray="100"
                    className="arc-draw arc-shimmer"
                    style={{ animationDelay: delay }}
                  />
                  {/* Main glowing arc */}
                  <path
                    d={dPath}
                    fill="none"
                    stroke={gradId}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="100"
                    filter={glowFilter}
                    className="arc-draw"
                    style={{ animationDelay: delay }}
                    markerEnd={`url(#${markerId})`}
                  />
                </g>
              );
            })}

            {/* Moving dot — slides smoothly via CSS transition on transform */}
            {phase !== "idle" && (
              <g
                style={{
                  transform: `translateX(${dotTargetX - toX(a)}px)`,
                  transition: phase === "animating"
                    ? `transform ${totalMs * 0.001 * 0.92}s cubic-bezier(0.4,0,0.2,1)`
                    : "none",
                }}
              >
                <circle cx={toX(a)} cy={lineY} r="13"
                  fill={isDone ? "#67e8f9" : arcColor} opacity="0.13" className="dot-fade"/>
                <circle cx={toX(a)} cy={lineY} r="7"
                  fill={isDone ? "#67e8f9" : arcColor}
                  filter={isDone ? "url(#glow-cyan)" : (arcUp ? "url(#glow-g)" : "url(#glow-r)")}
                  className="dot-fade"
                />
              </g>
            )}

            {/* Result ring + sparkle */}
            {isDone && (
              <g>
                <circle cx={toX(result)} cy={lineY} r="13"
                  fill="none" stroke="#67e8f9" strokeWidth="2.5"
                  filter="url(#glow-cyan)"
                  className="ring-pop"
                />
                {/* Mini sparkle stars around result */}
                {[0, 60, 120, 180, 240, 300].map((deg, si) => {
                  const rad = (deg * Math.PI) / 180;
                  const sx = toX(result) + Math.cos(rad) * 18;
                  const sy = lineY + Math.sin(rad) * 18;
                  return (
                    <circle key={`sp${si}`} cx={sx} cy={sy} r="2"
                      fill="#67e8f9"
                      className="sparkle-burst"
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
                fill="#f0abfc" opacity="0.85">
                mulai ({a})
              </text>
            )}
          </svg>
        </div>

        {/* Hint row */}
        {bothValid && phase === "idle" && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body ${lightMode ? "bg-blue-50 text-blue-600" : "bg-cyan-900/30 text-cyan-300"}`}>
            <span>{b >= 0 ? "➡️" : "⬅️"}</span>
            <span>
              {b >= 0
                ? `Bilangan ke-2 positif → busur hijau bergerak ke KANAN sejauh ${steps} langkah`
                : `Bilangan ke-2 negatif → busur merah bergerak ke KIRI sejauh ${steps} langkah`}
            </span>
          </div>
        )}
        {isDone && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-body font-semibold ${lightMode ? "bg-green-50 text-green-700 border border-green-200" : "bg-green-900/30 text-green-300 border border-green-500/30"}`}>
            <span>✅</span>
            <span>{a} + ({b}) = <strong>{result}</strong> {resultEmoji}</span>
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
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 cursor-pointer"
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

const PenjumlahanBilanganBulatPage = () => {
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
          PENJUMLAHAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* ── Kalkulator Interaktif ── */}
          <InteraktifPenjumlahan lightMode={lightMode} />

          {/* Section: Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Mengapa Kita Butuh Bilangan Negatif?</span>
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
                  Dulu di Sekolah Dasar, kita sudah kenal dengan <strong className="text-primary">bilangan asli</strong> (1, 2, 3, 4, ...) dan <strong className="text-primary">bilangan cacah</strong> (0, 1, 2, 3, ...). Tapi ternyata, kedua jenis bilangan ini belum cukup untuk menggambarkan semua situasi di dunia nyata.
                </p>
                
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Contoh nyata:</strong> Bayangkan kamu sedang melihat prakiraan cuaca di Jepang saat musim dingin. Suhunya tertulis <InlineMath math="-5°C" />. Bagaimana cara menuliskan suhu yang berada di bawah titik beku (0°C) kalau kita hanya punya bilangan positif?
                  </p>
                  <figure className="flex flex-col items-center gap-2">
                    <img
                      src="/images/termometer-penjumlahan.png"
                      alt="Termometer menunjukkan suhu di bawah nol"
                      className="w-full max-w-xl rounded-lg shadow-lg border border-white/10"
                    />
                    <figcaption className="font-body text-xs text-cyan-200/60 text-center italic max-w-xl">
                      Sumber: Ilustrasi garis bilangan
                    </figcaption>
                  </figure>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Inilah alasan diciptakannya <strong className="text-primary">bilangan negatif</strong>. Bilangan negatif digunakan untuk menyatakan nilai yang berada di bawah nol, seperti:
                </p>

                <ul className="font-body text-sm text-white/70 space-y-2 ml-4">
                  <li>Suhu di bawah <InlineMath math="0°C" /> (misalnya <InlineMath math="-10°C" /> di puncak Himalaya)</li>
                  <li>Ketinggian di bawah permukaan laut (misalnya <InlineMath math="-80" /> meter untuk palung laut)</li>
                  <li>Hutang atau kerugian dalam keuangan</li>
                </ul>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>Definisi:</strong> <strong className="text-white">Bilangan bulat</strong> adalah kumpulan bilangan yang terdiri dari bilangan bulat negatif (..., -3, -2, -1), nol (0), dan bilangan bulat positif (1, 2, 3, ...).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Konsep Penjumlahan dengan Garis Bilangan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Konsep Penjumlahan</span>
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
                  Cara paling mudah memahami penjumlahan bilangan bulat adalah dengan membayangkan <strong className="text-primary">garis bilangan</strong>. Bayangkan kamu berdiri di titik nol dan berjalan sesuai instruksi.
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Aturan Jalan di Garis Bilangan:</p>
                  <ul className="font-body text-sm text-green-200 space-y-1">
                    <li><strong>Bilangan positif (+)</strong> = bergerak ke <strong>kanan</strong></li>
                    <li><strong>Bilangan negatif (-)</strong> = bergerak ke <strong>kiri</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/20">
                  <p className={`text-xs text-center mb-2 font-body ${lightMode ? "text-foreground/60" : "text-yellow-300/70"}`}>Garis Bilangan</p>
                  <NumberLineSVG lightMode={lightMode} />
                </div>

                {/* ── Demo Arah Pergerakan ── */}
                <div className="bg-slate-900/60 rounded-xl p-3 border border-cyan-500/20">
                  <p className={`text-xs text-center mb-1 font-body ${lightMode ? "text-foreground/60" : "text-cyan-300/70"}`}>
                    Demo: Tambah Positif = Kanan · Tambah Negatif = Kiri
                  </p>
                  <DirectionDemoSVG lightMode={lightMode} />
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Penjumlahan Bilangan Bulat:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 border border-green-500/20">
                      <p className="text-white/70 text-xs mb-1">Kedua bilangan <strong className="text-green-400">positif</strong>:</p>
                      <BlockMath math="a + b = a + b" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Jika <InlineMath math="a > b" /> :</p>
                      <BlockMath math="-a + b = -(a - b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Jika <InlineMath math="b > a" /> :</p>
                      <BlockMath math="-a + b = b - a" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Kedua bilangan negatif:</p>
                      <BlockMath math="-a + (-b) = -(a + b)" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Mudah:</strong> Saat menjumlahkan dua bilangan dengan tanda berbeda, kurangkan nilai absolutnya, lalu gunakan tanda bilangan yang nilainya lebih besar.
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
                      Hitunglah hasil dari <InlineMath math="8 + (-3)" /> menggunakan garis bilangan!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Mulai dari titik 0, bergerak 8 satuan ke <strong className="text-green-400">kanan</strong> (karena 8 positif).</p>
                      <p><strong>Langkah 2:</strong> Dari titik 8, bergerak 3 satuan ke <strong className="text-red-400">kiri</strong> (karena -3 negatif).</p>
                      <p><strong>Langkah 3:</strong> Titik akhir berada di angka <strong className="text-cyan-300">5</strong>.</p>

                      {/* Visualisasi garis bilangan */}
                      <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20 mt-2">
                        <p className="text-yellow-300/70 text-xs text-center mb-1 font-body">Visualisasi di Garis Bilangan</p>
                        <NumberLineContoh1SVG />
                        <div className="flex flex-wrap gap-3 justify-center mt-1 text-xs font-body">
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-green-400"></span> +8 ke kanan</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-red-400"></span> −3 ke kiri</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full border-2 border-cyan-300"></span> hasil = 5</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded p-3 mt-2">
                        <BlockMath math="8 + (-3) = 8 - 3 = 5" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, <InlineMath math="8 + (-3) = 5" /></p>
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
                      Hitunglah hasil penjumlahan berikut:
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="-27 + 12" /></p>
                      <p className="text-white/80">b. <InlineMath math="-14 + 29" /></p>
                      <p className="text-white/80">c. <InlineMath math="-36 + (-58)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      {/* Soal a */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="-27 + 12" /></p>
                        <p className="mb-1">Karena 27 {">"} 12 dan 27 bertanda negatif, maka:</p>
                        <BlockMath math="-27 + 12 = -(27 - 12) = -15" />
                        <p className="text-primary">Jawaban: <InlineMath math="-15" /></p>
                      </div>
                      {/* Soal b */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="-14 + 29" /></p>
                        <p className="mb-1">Karena 29 {">"} 14 dan 29 bertanda positif, maka:</p>
                        <BlockMath math="-14 + 29 = 29 - 14 = 15" />
                        <p className="text-primary">Jawaban: <InlineMath math="15" /></p>
                      </div>
                      {/* Soal c */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">c. <InlineMath math="-36 + (-58)" /></p>
                        <p className="mb-1">Kedua bilangan sama-sama negatif, maka jumlahkan nilainya dan beri tanda negatif:</p>
                        <BlockMath math="-36 + (-58) = -(36 + 58) = -94" />
                        <p className="text-primary">Jawaban: <InlineMath math="-94" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Di sebuah pabrik es krim, suhu ruang penyimpanan adalah <InlineMath math="-17°C" />. Suhu di ruang administrasi tercatat <InlineMath math="41°" /> lebih tinggi dari suhu gudang. Berapa suhu di ruang administrasi?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Identifikasi informasi yang diketahui:</p>
                      <ul className="ml-4 space-y-1">
                        <li>Suhu gudang = <InlineMath math="-17°C" /></li>
                        <li>Selisih suhu = <InlineMath math="41°" /> lebih tinggi</li>
                      </ul>
                      <p><strong>Langkah 2:</strong> Susun model matematika:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Suhu administrasi} = -17 + 41" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung hasil:</p>
                      <p className="ml-4">Karena 41 {">"} 17 dan 41 bertanda positif:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-17 + 41 = 41 - 17 = 24" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, suhu di ruang administrasi adalah <InlineMath math="24°C" /></p>
                    </div>
                  </div>
                </div>

                {/* Contoh Bonus - Mencari Nilai n */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white">Contoh 4: Mencari Nilai yang Belum Diketahui</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Tentukan nilai <InlineMath math="n" /> pada persamaan berikut:
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="n + (-8) = -14" /></p>
                      <p className="text-white/80">b. <InlineMath math="10 + n = -5" /></p>
                    </div>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      {/* Soal a */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="n + (-8) = -14" /></p>
                        <p className="mb-1">Pikirkan: bilangan berapa yang jika dikurangi 8 hasilnya -14?</p>
                        <p className="mb-1">Gunakan garis bilangan: dari titik <InlineMath math="n" />, bergerak 8 langkah ke kiri sampai di -14.</p>
                        <p className="mb-1">Berarti <InlineMath math="n" /> berada 8 langkah di sebelah kanan -14:</p>
                        <BlockMath math="n = -14 + 8 = -6" />
                        <p className="text-primary">Jawaban: <InlineMath math="n = -6" /></p>
                      </div>
                      {/* Soal b */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="10 + n = -5" /></p>
                        <p className="mb-1">Pikirkan: dari 10, harus bergerak sejauh berapa agar sampai di -5?</p>
                        <p className="mb-1">Jarak dari 10 ke -5 adalah 15 langkah ke kiri (arah negatif):</p>
                        <BlockMath math="n = -5 - 10 = -15" />
                        <p className="text-primary">Jawaban: <InlineMath math="n = -15" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Sifat-sifat Penjumlahan Bilangan Bulat */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifat")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Sifat-sifat Penjumlahan Bilangan Bulat</span>
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
                  Penjumlahan pada bilangan bulat memiliki empat sifat penting yang perlu dipahami:
                </p>

                {/* Sifat 1: Komutatif */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 1</span>
                    <p className="font-body text-sm font-bold text-blue-300">Sifat Komutatif (Pertukaran)</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Menukar urutan dua bilangan yang dijumlahkan <strong className="text-white">tidak mengubah hasilnya</strong>.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a + b = b + a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">Contoh positif:</p>
                      <InlineMath math="3 + 5 = 5 + 3 = 8" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">Contoh negatif:</p>
                      <InlineMath math="-7 + 4 = 4 + (-7) = -3" />
                    </div>
                  </div>
                </div>

                {/* Sifat 2: Unsur Identitas */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 2</span>
                    <p className="font-body text-sm font-bold text-green-300">Unsur Identitas pada Penjumlahan</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Bilangan <strong className="text-white">0 (nol)</strong> disebut unsur identitas penjumlahan karena menjumlahkan bilangan apapun dengan 0 menghasilkan bilangan itu sendiri.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a + 0 = 0 + a = a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">Contoh positif:</p>
                      <InlineMath math="9 + 0 = 0 + 9 = 9" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">Contoh negatif:</p>
                      <InlineMath math="-6 + 0 = 0 + (-6) = -6" />
                    </div>
                  </div>
                </div>

                {/* Sifat 3: Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 3</span>
                    <p className="font-body text-sm font-bold text-purple-300">Sifat Asosiatif (Pengelompokan)</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Cara <strong className="text-white">mengelompokkan</strong> tiga atau lebih bilangan yang dijumlahkan tidak mengubah hasilnya.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="(a + b) + c = a + (b + c)" />
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-1">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">Contoh dengan angka:</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(2 + 3) + 4 = 5 + 4 = 9" /></div>
                      <div className="text-white/40 text-xs">sama dengan</div>
                      <div><InlineMath math="2 + (3 + 4) = 2 + 7 = 9" /></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">Contoh dengan bilangan negatif:</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(-5 + 3) + (-2) = -2 + (-2) = -4" /></div>
                      <div className="text-white/40 text-xs">sama dengan</div>
                      <div><InlineMath math="-5 + (3 + (-2)) = -5 + 1 = -4" /></div>
                    </div>
                  </div>
                </div>

                {/* Sifat 4: Tertutup */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 4</span>
                    <p className="font-body text-sm font-bold text-orange-300">Sifat Tertutup</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Hasil penjumlahan dua bilangan bulat <strong className="text-white">selalu bilangan bulat juga</strong>. Operasi ini tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="\forall\, a, b \in \mathbb{Z},\quad a + b \in \mathbb{Z}" />
                  </div>
                  <p className="font-body text-xs text-white/50 text-center mb-2">(Untuk setiap a dan b bilangan bulat, hasil a + b juga bilangan bulat)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">positif + positif</p>
                      <InlineMath math="4 + 6 = 10 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">negatif + negatif</p>
                      <InlineMath math="-3 + (-5) = -8 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">positif + negatif</p>
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
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Cara 1 — Menggunakan Garis Bilangan
                  </p>
                  <p className="font-body text-sm text-white/80 mb-3 leading-relaxed">
                    Bayangkan kamu berdiri di titik awal pada garis bilangan. Setiap angka yang dijumlahkan menentukan arah gerakmu:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-green-300 text-2xl font-bold mb-1">→</p>
                      <p className="font-body text-sm font-semibold text-green-300">Bilangan Positif (+)</p>
                      <p className="font-body text-xs text-green-200/80 mt-1">Bergerak ke <strong>kanan</strong> sejumlah angka tersebut</p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">Contoh: +5 → maju 5 langkah ke kanan</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                      <p className="text-red-300 text-2xl font-bold mb-1">←</p>
                      <p className="font-body text-sm font-semibold text-red-300">Bilangan Negatif (−)</p>
                      <p className="font-body text-xs text-red-200/80 mt-1">Bergerak ke <strong>kiri</strong> sejumlah nilai absolutnya</p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">Contoh: −3 → mundur 3 langkah ke kiri</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3 text-center">
                    <p className="font-body text-xs text-white/60">Langkah-langkah:</p>
                    <p className="font-body text-sm text-white/90 mt-1">
                      <span className="text-white font-semibold">① Mulai dari 0</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-green-300 font-semibold">② Bergerak sesuai bilangan pertama</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-primary font-semibold">③ Lanjut sesuai bilangan kedua</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-cyan-300 font-semibold">④ Posisi akhir = hasil</span>
                    </p>
                  </div>
                </div>

                {/* Cara 2: Rumus */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> Cara 2 — Menggunakan Rumus
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-green-500/20">
                      <p className="font-body text-xs text-green-300 font-semibold mb-1">Kedua positif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center">
                        <InlineMath math="a + b = a + b" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: 3 + 5 = 8</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-red-500/20">
                      <p className="font-body text-xs text-red-300 font-semibold mb-1">Kedua negatif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a &gt; 0, b &gt; 0</p>
                      <div className="text-center">
                        <InlineMath math="-a + (-b) = -(a+b)" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −3 + (−5) = −8</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20">
                      <p className="font-body text-xs text-yellow-300 font-semibold mb-1">Beda tanda, <InlineMath math="|a| > |b|" /></p>
                      <p className="font-body text-xs text-white/60 mb-2">hasil bertanda negatif</p>
                      <div className="text-center">
                        <InlineMath math="-a + b = -(a-b)" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −7 + 3 = −4</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-blue-500/20">
                      <p className="font-body text-xs text-blue-300 font-semibold mb-1">Beda tanda, <InlineMath math="|b| > |a|" /></p>
                      <p className="font-body text-xs text-white/60 mb-2">hasil bertanda positif</p>
                      <div className="text-center">
                        <InlineMath math="-a + b = b - a" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −3 + 7 = 4</p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Tips Cepat
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Tanda sama → jumlahkan, pakai tanda itu.</strong><br/>
                        <span className="text-white/60 text-xs">Contoh: 4 + 6 = 10 &nbsp;|&nbsp; −4 + (−6) = −10</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Tanda beda → kurangkan nilai absolutnya, pakai tanda yang lebih besar.</strong><br/>
                        <span className="text-white/60 text-xs">Contoh: −8 + 5 = −3 &nbsp;(|−8| &gt; |5|, hasilnya negatif)</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Penjumlahan bersifat komutatif:</strong> <InlineMath math="a + b = b + a" /><br/>
                        <span className="text-white/60 text-xs">Urutan tidak mengubah hasil.</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Menjumlah dengan 0 hasilnya tetap:</strong> <InlineMath math="a + 0 = a" /><br/>
                        <span className="text-white/60 text-xs">0 disebut elemen identitas penjumlahan.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Catatan sifat-sifat */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                    <List className="w-4 h-4" /> Penjumlahan Bilangan Bulat Memenuhi Sifat-sifat Berikut:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-blue-300">Komutatif</p>
                        <p className="font-body text-xs text-white/60">a + b = b + a</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/30 text-green-200 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-green-300">Unsur Identitas</p>
                        <p className="font-body text-xs text-white/60">a + 0 = 0 + a = a</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-purple-300">Asosiatif</p>
                        <p className="font-body text-xs text-white/60">(a + b) + c = a + (b + c)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500/30 text-orange-200 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-orange-300">Tertutup</p>
                        <p className="font-body text-xs text-white/60">a + b selalu bilangan bulat</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Tips Penggunaan Kalkulator */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Tips Menggunakan Kalkulator
            </p>
            <p className="font-body text-sm text-white/70 leading-relaxed">
              Pada kalkulator ilmiah, untuk menghitung <InlineMath math="-14 + 29" />, tekan tombol: 
              <code className="bg-slate-800 px-2 py-1 rounded mx-1 text-cyan-300">(-)</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">1</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">4</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">+</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">2</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">9</code>
              <code className="bg-slate-800 px-2 py-1 rounded mx-1">=</code>
              dan hasilnya akan muncul <strong className="text-primary">15</strong>.
            </p>
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">➕ RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Penjumlahan Bilangan Bulat — Kelas 7</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              {/* Konsep Utama */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                  Aturan Penjumlahan Bilangan Bulat
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "(+) + (+) = (+)", desc: "Dua bilangan positif dijumlah → hasilnya positif. Contoh: 8 + 5 = 13", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
                    { label: "(−) + (−) = (−)", desc: "Dua bilangan negatif dijumlah → hasilnya negatif. Contoh: (−8) + (−5) = −13", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
                    { label: "(+) + (−) atau (−) + (+)", desc: "Berbeda tanda → kurangi nilai mutlaknya, ambil tanda yang nilainya lebih besar. Contoh: 8 + (−5) = 3", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
                    { label: "Sifat Komutatif", desc: "a + b = b + a. Urutan tidak mempengaruhi hasil penjumlahan.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
                    { label: "Sifat Asosiatif", desc: "(a + b) + c = a + (b + c). Pengelompokan tidak mempengaruhi hasil.", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
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
                  Tips &amp; Trik Jitu Penjumlahan
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "🎯", tip: "Bayangkan garis bilangan", detail: "Bilangan positif = langkah ke kanan. Bilangan negatif = langkah ke kiri. Mulai dari 0, jalan sesuai aturan!", color: "bg-cyan-900/30 border-cyan-500/30" },
                    { icon: "⚡", tip: "Tanda sama → jumlahkan, tanda beda → kurangkan", detail: "Ini adalah rumus cepat untuk menentukan operasi yang harus dilakukan sebelum menentukan tandanya.", color: "bg-yellow-900/30 border-yellow-500/30" },
                    { icon: "🔢", tip: "Gunakan nilai mutlak (|  |) untuk menghitung", detail: "Nilai mutlak mengabaikan tanda. Hitung besar angkanya dulu, baru tentukan tanda di akhir berdasarkan bilangan yang lebih besar nilai mutlaknya.", color: "bg-green-900/30 border-green-500/30" },
                    { icon: "🧮", tip: "Substitusi ke soal untuk verifikasi", detail: "Setelah mendapat jawaban, substitusi kembali ke soal aslinya. Jika cocok, jawabanmu benar!", color: "bg-violet-900/30 border-violet-500/30" },
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
              <div className="bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-indigo-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌟</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Penjumlahan bilangan bulat adalah fondasi dari semua operasi matematika. Kunci utamanya adalah{" "}
                  <strong className="text-cyan-300">memahami tanda</strong>: sama tanda berarti jumlahkan, beda tanda berarti kurangi. Dengan memahami garis bilangan, kamu bisa{" "}
                  <strong className="text-yellow-300">memvisualisasikan setiap operasi</strong> dan tidak akan pernah salah lagi!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Tanda Sama = Jumlah", "Tanda Beda = Kurang", "Nilai Mutlak", "Garis Bilangan", "Komutatif & Asosiatif"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Lanjut ke Pengurangan untuk melengkapi pemahamanmu!</p>
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
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanBilanganBulatPage;
