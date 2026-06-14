import React, { useState, useEffect, useRef } from "react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import "katex/dist/katex.min.css";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface ElimStep {
  label1: string;
  eq1: string;
  mult1: string;
  newEq1: string;
  label2: string;
  eq2: string;
  mult2: string;
  newEq2: string;
  op: "+" | "−";
  result: string;
  solve: string;
  solveVal: string;
  varElim: string;
  varSolve: string;
  note?: string;
}

interface Example {
  id: number;
  difficulty: "MUDAH" | "SEDANG" | "SULIT";
  diffColor: string;
  borderColor: string;
  bgColor: string;
  soal: string;
  soalTex: string;
  steps: ElimStep[];
  verification: string[];
  answerTex: string;
  tips: string;
}

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────

const EXAMPLES: Example[] = [
  {
    id: 1,
    difficulty: "MUDAH",
    diffColor: "bg-emerald-700/70 text-emerald-100",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-900/10",
    soal: "Selesaikan SPLDV berikut dengan metode eliminasi:",
    soalTex: "\\begin{cases} 3x + y = 7 \\quad \\cdots (1)\\\\ x + y = 3 \\quad \\cdots (2) \\end{cases}",
    steps: [
      {
        label1: "PLDV (1)",
        eq1: "3x + y = 7",
        mult1: "\\times 1",
        newEq1: "3x + y = 7",
        label2: "PLDV (2)",
        eq2: "x + y = 3",
        mult2: "\\times 1",
        newEq2: "x + y = 3",
        op: "−",
        result: "2x = 4",
        solve: "x = \\dfrac{4}{2}",
        solveVal: "x = 2",
        varElim: "y",
        varSolve: "x",
        note: "Koefisien y sama (1 = 1) dan bertanda sama → kurangkan (−)",
      },
      {
        label1: "PLDV (1)",
        eq1: "3x + y = 7",
        mult1: "\\times 1",
        newEq1: "3x + y = 7",
        label2: "PLDV (2)",
        eq2: "x + y = 3",
        mult2: "\\times 3",
        newEq2: "3x + 3y = 9",
        op: "−",
        result: "-2y = -2",
        solve: "y = \\dfrac{-2}{-2}",
        solveVal: "y = 1",
        varElim: "x",
        varSolve: "y",
        note: "Kalikan PLDV (2) dengan 3 agar koefisien x sama → kurangkan (−)",
      },
    ],
    verification: [
      "P1:\\; 3(2) + 1 = 6 + 1 = 7 \\checkmark",
      "P2:\\; 2 + 1 = 3 \\checkmark",
    ],
    answerTex: "\\boxed{\\; x = 2, \\quad y = 1 \\;}",
    tips: "Jika koefisien salah satu variabel sudah sama, langsung eliminasi tanpa perlu mengalikan!",
  },
  {
    id: 2,
    difficulty: "SEDANG",
    diffColor: "bg-amber-700/70 text-amber-100",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-900/10",
    soal: "Selesaikan SPLDV berikut dengan metode eliminasi:",
    soalTex: "\\begin{cases} 2x + 3y = 16 \\quad \\cdots (1)\\\\ 5x - 2y = 2 \\quad \\cdots (2) \\end{cases}",
    steps: [
      {
        label1: "PLDV (1)",
        eq1: "2x + 3y = 16",
        mult1: "\\times 2",
        newEq1: "4x + 6y = 32",
        label2: "PLDV (2)",
        eq2: "5x - 2y = 2",
        mult2: "\\times 3",
        newEq2: "15x - 6y = 6",
        op: "+",
        result: "19x = 38",
        solve: "x = \\dfrac{38}{19}",
        solveVal: "x = 2",
        varElim: "y",
        varSolve: "x",
        note: "KPK(3,2) = 6. Koefisien y bertanda berbeda (+6 dan −6) → jumlahkan (+)",
      },
      {
        label1: "PLDV (1)",
        eq1: "2x + 3y = 16",
        mult1: "\\times 5",
        newEq1: "10x + 15y = 80",
        label2: "PLDV (2)",
        eq2: "5x - 2y = 2",
        mult2: "\\times 2",
        newEq2: "10x - 4y = 4",
        op: "−",
        result: "19y = 76",
        solve: "y = \\dfrac{76}{19}",
        solveVal: "y = 4",
        varElim: "x",
        varSolve: "y",
        note: "KPK(2,5) = 10. Koefisien x sama dan bertanda sama → kurangkan (−)",
      },
    ],
    verification: [
      "P1:\\; 2(2) + 3(4) = 4 + 12 = 16 \\checkmark",
      "P2:\\; 5(2) - 2(4) = 10 - 8 = 2 \\checkmark",
    ],
    answerTex: "\\boxed{\\; x = 2, \\quad y = 4 \\;}",
    tips: "Koefisien BERTANDA SAMA → kurangkan (−). Koefisien BERTANDA BERBEDA → jumlahkan (+).",
  },
  {
    id: 3,
    difficulty: "SULIT",
    diffColor: "bg-rose-700/70 text-rose-100",
    borderColor: "border-rose-500/30",
    bgColor: "bg-rose-900/10",
    soal: "Pak Budi membeli 3 buku dan 2 pensil seharga Rp19.000. Ibu Ani membeli 2 buku dan 5 pensil seharga Rp20.000. Tentukan harga satu buku dan satu pensil!",
    soalTex:
      "\\text{Misal: } b = \\text{harga buku},\\; p = \\text{harga pensil (dalam ribuan)}\\\\" +
      "\\begin{cases} 3b + 2p = 19 \\quad \\cdots (1)\\\\ 2b + 5p = 20 \\quad \\cdots (2) \\end{cases}",
    steps: [
      {
        label1: "PLDV (1)",
        eq1: "3b + 2p = 19",
        mult1: "\\times 5",
        newEq1: "15b + 10p = 95",
        label2: "PLDV (2)",
        eq2: "2b + 5p = 20",
        mult2: "\\times 2",
        newEq2: "4b + 10p = 40",
        op: "−",
        result: "11b = 55",
        solve: "b = \\dfrac{55}{11}",
        solveVal: "b = 5 \\;(\\text{Rp5.000})",
        varElim: "p",
        varSolve: "b",
        note: "KPK(2,5) = 10. Koefisien p sama dan bertanda sama → kurangkan (−)",
      },
      {
        label1: "PLDV (1)",
        eq1: "3b + 2p = 19",
        mult1: "\\times 2",
        newEq1: "6b + 4p = 38",
        label2: "PLDV (2)",
        eq2: "2b + 5p = 20",
        mult2: "\\times 3",
        newEq2: "6b + 15p = 60",
        op: "−",
        result: "-11p = -22",
        solve: "p = \\dfrac{-22}{-11}",
        solveVal: "p = 2 \\;(\\text{Rp2.000})",
        varElim: "b",
        varSolve: "p",
        note: "KPK(3,2) = 6. Koefisien b sama dan bertanda sama → kurangkan (−)",
      },
    ],
    verification: [
      "P1:\\; 3(5) + 2(2) = 15 + 4 = 19 \\checkmark",
      "P2:\\; 2(5) + 5(2) = 10 + 10 = 20 \\checkmark",
    ],
    answerTex: "\\boxed{\\; b = 5.000, \\quad p = 2.000 \\;}",
    tips: "Pada soal cerita: buat pemisalan → tulis model SPLDV → selesaikan → jawab pertanyaan soal.",
  },
];

// ─────────────────────────────────────────────────────────────────
// ELIM BLOCK — visual 3-column elimination table
// ─────────────────────────────────────────────────────────────────

const MAX_PHASE = 5;

interface ElimBlockProps {
  step: ElimStep;
  phase: number; // 0=hidden, 1=rows visible, 2=line, 3=result, 4=solve, 5=solveVal
}

const ElimBlock: React.FC<ElimBlockProps> = ({ step, phase }) => {
  const show = (minPhase: number) =>
    phase >= minPhase ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none";
  const t = "transition-all duration-500 ease-out";

  return (
    <div className="font-mono text-sm">
      {step.note && (
        <p className={`mb-3 font-body text-xs text-cyan-300/80 italic bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2 ${t} ${show(1)}`}>
          💡 {step.note}
        </p>
      )}

      <div className="bg-slate-900/70 border border-white/10 rounded-xl overflow-hidden">

        {/* Column headers */}
        <div className={`grid grid-cols-[1fr_58px_1fr] border-b border-white/10 ${t} ${show(1)}`}>
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-body text-center">Persamaan Asal</div>
          <div className="px-1 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-body text-center border-x border-white/10">Pengali</div>
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-body text-center">Bentuk Baru</div>
        </div>

        {/* Row 1 */}
        <div className={`grid grid-cols-[1fr_58px_1fr] border-b border-white/5 ${t} ${show(1)}`}>
          <div className="px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-white/30 font-body">{step.label1}</span>
            <span className="text-white/70 text-sm">{step.eq1}</span>
          </div>
          <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
            <span className="text-amber-300 font-bold text-sm"><InlineMath math={step.mult1} /></span>
          </div>
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-cyan-200 text-sm font-semibold">{step.newEq1}</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className={`grid grid-cols-[1fr_58px_1fr] ${t} ${show(1)}`}>
          <div className="px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-white/30 font-body">{step.label2}</span>
            <span className="text-white/70 text-sm">{step.eq2}</span>
          </div>
          <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
            <span className="text-amber-300 font-bold text-sm"><InlineMath math={step.mult2} /></span>
          </div>
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-cyan-200 text-sm font-semibold">{step.newEq2}</span>
          </div>
        </div>

        {/* Divider with op sign */}
        <div className={`relative border-t-2 border-white/25 ${t} ${show(2)}`}>
          <div className="absolute right-3 -top-3.5 bg-slate-900 px-2">
            <span className={`text-lg font-bold ${step.op === "−" ? "text-red-400" : "text-green-400"}`}>
              ({step.op})
            </span>
          </div>
        </div>

        {/* Result */}
        <div className={`px-3 py-2.5 flex justify-end ${t} ${show(3)}`}>
          <span className="text-yellow-300 font-bold text-base">{step.result}</span>
        </div>
      </div>

      {/* Solve steps */}
      <div className={`mt-3 ml-4 space-y-1.5 ${t} ${show(4)}`}>
        <div className="flex items-center gap-3 text-white/80 text-sm">
          <span className="text-white/30">⟹</span>
          <InlineMath math={step.solve} />
        </div>
      </div>

      {/* Final value */}
      <div className={`mt-2 ml-4 ${t} ${show(5)}`}>
        <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 rounded-xl px-4 py-1.5">
          <span className="text-emerald-300 font-bold text-base"><InlineMath math={step.solveVal} /></span>
          <span className="text-emerald-400">✓</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// EXAMPLE VIEWER
// ─────────────────────────────────────────────────────────────────

const ExampleViewer: React.FC<{ example: Example }> = ({ example }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showVerif, setShowVerif] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  useEffect(() => {
    clearTimer();
    setStepIdx(0); setPhase(0); setShowVerif(false); setShowAnswer(false); setIsPlaying(false);
  }, [example.id]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(() => {
      if (phase < MAX_PHASE) {
        setPhase(p => p + 1);
      } else if (stepIdx < example.steps.length - 1) {
        setStepIdx(s => s + 1); setPhase(1);
      } else if (!showVerif) {
        setShowVerif(true);
      } else if (!showAnswer) {
        setShowAnswer(true); setIsPlaying(false);
      }
    }, 580);
    return clearTimer;
  }, [isPlaying, phase, stepIdx, showVerif, showAnswer, example.steps.length]);

  const handlePlay = () => { playPopSound(); setIsPlaying(true); if (phase === 0) setPhase(1); };
  const handleReset = () => {
    playPopSound(); clearTimer();
    setStepIdx(0); setPhase(0); setShowVerif(false); setShowAnswer(false); setIsPlaying(false);
  };
  const handleSkip = () => {
    playPopSound(); clearTimer();
    setStepIdx(example.steps.length - 1); setPhase(MAX_PHASE);
    setShowVerif(true); setShowAnswer(true); setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      {/* Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-bold px-3 py-1 rounded-full font-body ${example.diffColor}`}>{example.difficulty}</span>
      </div>

      {/* Soal */}
      <div className={`border ${example.borderColor} ${example.bgColor} rounded-xl p-4 space-y-2`}>
        <p className="font-body text-xs font-bold text-white/40 uppercase tracking-widest">📝 Soal</p>
        <p className="font-body text-sm text-white/85 leading-relaxed">{example.soal}</p>
        <div className="overflow-x-auto"><BlockMath math={example.soalTex} /></div>
      </div>

      {/* Penyelesaian */}
      <div className="space-y-3">
        <p className="font-body text-xs font-bold text-cyan-300/70 uppercase tracking-widest">✏️ Penyelesaian</p>

        {example.steps.map((step, i) => {
          const phaseToUse = i < stepIdx ? MAX_PHASE : i === stepIdx ? phase : 0;
          const accent = i === 0
            ? { border: "border-cyan-500/30", bg: "bg-cyan-900/10", badge: "bg-cyan-600" }
            : { border: "border-violet-500/30", bg: "bg-violet-900/10", badge: "bg-violet-600" };

          return (
            <div
              key={i}
              className={`border ${accent.border} ${accent.bg} rounded-xl p-4 space-y-3 transition-all duration-300 ${phaseToUse === 0 ? "opacity-30" : "opacity-100"}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${accent.badge}`}>{i + 1}</span>
                <p className="font-body text-sm font-semibold text-white">
                  Eliminasi <span className="font-mono font-bold text-amber-300">{step.varElim}</span>
                  {" "}→ cari <span className="font-mono font-bold text-emerald-300">{step.varSolve}</span>
                </p>
              </div>
              <ElimBlock step={step} phase={phaseToUse} />
            </div>
          );
        })}
      </div>

      {/* Verifikasi */}
      <div className={`border border-green-500/30 bg-green-900/10 rounded-xl p-4 space-y-2 transition-all duration-500 ${showVerif ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        <p className="font-body text-xs font-bold text-green-300/70 uppercase tracking-widest">🔍 Verifikasi</p>
        <div className="overflow-x-auto space-y-1">
          {example.verification.map((v, i) => <BlockMath key={i} math={v} />)}
        </div>
      </div>

      {/* Jawaban */}
      <div className={`border border-yellow-500/40 bg-yellow-900/10 rounded-xl p-4 space-y-2 transition-all duration-500 ${showAnswer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        <p className="font-body text-xs font-bold text-yellow-300/70 uppercase tracking-widest">🎉 Jawaban</p>
        <div className="overflow-x-auto"><BlockMath math={example.answerTex} /></div>
        <p className="font-body text-xs text-blue-300 bg-blue-900/20 border border-blue-500/20 rounded-lg px-3 py-2">
          💡 <strong>Tips:</strong> {example.tips}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center pt-1">
        {!showAnswer && !isPlaying && (
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold font-body px-5 py-2 rounded-xl transition-all"
          >
            <Play className="w-4 h-4" /> Mulai Animasi
          </button>
        )}
        {isPlaying && (
          <button onClick={handleSkip} className="flex items-center gap-2 bg-slate-700/70 border border-white/10 text-white/70 text-sm font-body px-5 py-2 rounded-xl transition-all hover:bg-slate-600/70">
            Lewati Animasi ⏭
          </button>
        )}
        {phase > 0 && (
          <button onClick={handleReset} className="flex items-center gap-2 bg-slate-700/60 border border-white/10 text-white/60 text-sm font-body px-4 py-2 rounded-xl transition-all hover:bg-slate-600/60">
            <RotateCcw className="w-4 h-4" /> Ulangi
          </button>
        )}
        {showAnswer && !isPlaying && (
          <span className="text-emerald-400 text-sm font-body flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Selesai! Hebat! 🎉
          </span>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT — section wrapper with tab switcher
// ─────────────────────────────────────────────────────────────────

const EliminasiAnimasiPembahasan: React.FC = () => {
  const [activeEx, setActiveEx] = useState(0);

  return (
    <div className="space-y-4">
      {/* Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="border border-red-500/30 bg-red-900/10 rounded-xl p-3">
          <p className="font-body text-xs font-bold text-red-300 mb-1">🔴 Koefisien SAMA TANDA → Kurangkan (−)</p>
          <div className="overflow-x-auto"><BlockMath math="+3y \text{ dan } +3y \;\Rightarrow\; \text{kurangkan}" /></div>
        </div>
        <div className="border border-green-500/30 bg-green-900/10 rounded-xl p-3">
          <p className="font-body text-xs font-bold text-green-300 mb-1">🟢 Koefisien BEDA TANDA → Jumlahkan (+)</p>
          <div className="overflow-x-auto"><BlockMath math="+3y \text{ dan } -3y \;\Rightarrow\; \text{jumlahkan}" /></div>
        </div>
      </div>

      {/* Example tabs */}
      <div className="flex gap-1 bg-slate-900/60 border border-white/10 rounded-2xl p-1.5">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => { playPopSound(); setActiveEx(i); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-body whitespace-nowrap transition-all ${
              activeEx === i ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            {ex.difficulty === "MUDAH" ? "🟢" : ex.difficulty === "SEDANG" ? "🟡" : "🔴"}
            {" Soal "}{i + 1}
          </button>
        ))}
      </div>

      <ExampleViewer key={activeEx} example={EXAMPLES[activeEx]} />
    </div>
  );
};

export default EliminasiAnimasiPembahasan;
