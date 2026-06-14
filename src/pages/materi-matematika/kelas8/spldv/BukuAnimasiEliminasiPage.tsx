import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { BookOpen, ChevronLeft, ChevronRight, Play, RotateCcw, Sparkles } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
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
  varName: string;
  note?: string;
}

interface Example {
  id: number;
  difficulty: "MUDAH" | "SEDANG" | "SULIT";
  diffColor: string;
  title: string;
  soal: string;
  soalTex: string;
  steps: ElimStep[];
  verification: string[];
  answer: string;
  answerTex: string;
  tips: string;
}

// ─────────────────────────────────────────────────────────────────
// DATA — 3 CONTOH SOAL
// ─────────────────────────────────────────────────────────────────

const EXAMPLES: Example[] = [
  {
    id: 1,
    difficulty: "MUDAH",
    diffColor: "bg-emerald-700/70 text-emerald-100",
    title: "Koefisien variabel sudah sama",
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
        varName: "x",
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
        varName: "y",
        note: "Kalikan PLDV (2) dengan 3 agar koefisien x sama → kurangkan (−)",
      },
    ],
    verification: [
      "P1:\\; 3(2) + 1 = 6 + 1 = 7 \\checkmark",
      "P2:\\; 2 + 1 = 3 \\checkmark",
    ],
    answer: "Jadi solusinya adalah x = 2 dan y = 1",
    answerTex: "\\boxed{\\; x = 2, \\quad y = 1 \\;}",
    tips: "Jika koefisien salah satu variabel sudah sama di kedua persamaan, kamu bisa langsung eliminasi tanpa perlu mengalikan!",
  },
  {
    id: 2,
    difficulty: "SEDANG",
    diffColor: "bg-amber-700/70 text-amber-100",
    title: "Perlu perkalian sebelum eliminasi",
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
        varName: "x",
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
        varName: "y",
        note: "KPK(2,5) = 10. Koefisien x sama dan bertanda sama → kurangkan (−)",
      },
    ],
    verification: [
      "P1:\\; 2(2) + 3(4) = 4 + 12 = 16 \\checkmark",
      "P2:\\; 5(2) - 2(4) = 10 - 8 = 2 \\checkmark",
    ],
    answer: "Jadi solusinya adalah x = 2 dan y = 4",
    answerTex: "\\boxed{\\; x = 2, \\quad y = 4 \\;}",
    tips: "Ingat: koefisien BERTANDA SAMA → kurangkan (−). Koefisien BERTANDA BERBEDA → jumlahkan (+).",
  },
  {
    id: 3,
    difficulty: "SULIT",
    diffColor: "bg-rose-700/70 text-rose-100",
    title: "Soal cerita — harga dua barang",
    soal: "Pak Budi membeli 3 buku dan 2 pensil seharga Rp19.000. Ibu Ani membeli 2 buku dan 5 pensil seharga Rp20.000. Tentukan harga satu buku dan satu pensil!",
    soalTex:
      "\\text{Misalkan: } b = \\text{harga buku},\\; p = \\text{harga pensil}\\\\" +
      "\\begin{cases} 3b + 2p = 19.000 \\quad \\cdots (1)\\\\ 2b + 5p = 20.000 \\quad \\cdots (2) \\end{cases}",
    steps: [
      {
        label1: "PLDV (1)",
        eq1: "3b + 2p = 19.000",
        mult1: "\\times 5",
        newEq1: "15b + 10p = 95.000",
        label2: "PLDV (2)",
        eq2: "2b + 5p = 20.000",
        mult2: "\\times 2",
        newEq2: "4b + 10p = 40.000",
        op: "−",
        result: "11b = 55.000",
        solve: "b = \\dfrac{55.000}{11}",
        solveVal: "b = 5.000",
        varName: "b",
        note: "KPK(2,5) = 10. Koefisien p sama dan bertanda sama → kurangkan (−)",
      },
      {
        label1: "PLDV (1)",
        eq1: "3b + 2p = 19.000",
        mult1: "\\times 2",
        newEq1: "6b + 4p = 38.000",
        label2: "PLDV (2)",
        eq2: "2b + 5p = 20.000",
        mult2: "\\times 3",
        newEq2: "6b + 15p = 60.000",
        op: "−",
        result: "-11p = -22.000",
        solve: "p = \\dfrac{-22.000}{-11}",
        solveVal: "p = 2.000",
        varName: "p",
        note: "KPK(3,2) = 6. Koefisien b sama dan bertanda sama → kurangkan (−)",
      },
    ],
    verification: [
      "P1:\\; 3(5.000) + 2(2.000) = 15.000 + 4.000 = 19.000 \\checkmark",
      "P2:\\; 2(5.000) + 5(2.000) = 10.000 + 10.000 = 20.000 \\checkmark",
    ],
    answer: "Harga 1 buku = Rp5.000, harga 1 pensil = Rp2.000",
    answerTex: "\\boxed{\\; b = 5.000, \\quad p = 2.000 \\;}",
    tips: "Pada soal cerita: (1) buat pemisalan variabel, (2) tulis model SPLDV, (3) selesaikan, (4) jawab pertanyaan soal.",
  },
];

// ─────────────────────────────────────────────────────────────────
// ELIMINATION BLOCK COMPONENT — the core visual format
// ─────────────────────────────────────────────────────────────────

interface ElimBlockProps {
  step: ElimStep;
  phase: number; // 0=hidden, 1=rows, 2=line, 3=result, 4=solve, 5=solveVal
}

const ElimBlock: React.FC<ElimBlockProps> = ({ step, phase }) => {
  const show = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-3 pointer-events-none";

  const transClass = "transition-all duration-500 ease-out";

  return (
    <div className="font-mono text-sm select-none">

      {/* Optional note */}
      {step.note && (
        <div className={`mb-3 ${transClass} ${show(1)}`}>
          <p className="font-body text-xs text-cyan-300/80 italic bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2">
            💡 {step.note}
          </p>
        </div>
      )}

      {/* The main elimination table */}
      <div className="bg-slate-900/70 border border-white/10 rounded-xl overflow-hidden">

        {/* Column headers */}
        <div className={`grid grid-cols-[1fr_60px_1fr] gap-0 border-b border-white/10 ${transClass} ${show(1)}`}>
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-body text-center">Persamaan asal</div>
          <div className="px-1 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-body text-center border-x border-white/10">Pengali</div>
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-body text-center">Bentuk baru</div>
        </div>

        {/* Row 1 */}
        <div className={`grid grid-cols-[1fr_60px_1fr] gap-0 border-b border-white/5 ${transClass} ${show(1)}`}>
          {/* Label + original eq */}
          <div className="px-3 py-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-white/30 font-body">{step.label1}</span>
            <span className="text-white/70 text-sm">{step.eq1}</span>
          </div>
          {/* Multiplier */}
          <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
            <span className="text-amber-300 font-bold text-sm">
              <InlineMath math={step.mult1} />
            </span>
          </div>
          {/* New equation */}
          <div className="px-3 py-3 flex flex-col gap-0.5 justify-center">
            <span className="text-cyan-200 text-sm font-semibold">{step.newEq1}</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className={`grid grid-cols-[1fr_60px_1fr] gap-0 ${transClass} ${show(1)}`}>
          <div className="px-3 py-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-white/30 font-body">{step.label2}</span>
            <span className="text-white/70 text-sm">{step.eq2}</span>
          </div>
          <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
            <span className="text-amber-300 font-bold text-sm">
              <InlineMath math={step.mult2} />
            </span>
          </div>
          <div className="px-3 py-3 flex flex-col gap-0.5 justify-center">
            <span className="text-cyan-200 text-sm font-semibold">{step.newEq2}</span>
          </div>
        </div>

        {/* Divider line with operation sign */}
        <div className={`relative border-t-2 border-white/25 ${transClass} ${show(2)}`}>
          <div className="absolute right-3 -top-3.5 bg-slate-900 px-2">
            <span
              className={`text-lg font-bold ${
                step.op === "−" ? "text-red-400" : "text-green-400"
              }`}
            >
              ({step.op})
            </span>
          </div>
        </div>

        {/* Result row */}
        <div className={`px-3 py-3 flex justify-end ${transClass} ${show(3)}`}>
          <div className="flex flex-col items-end gap-1">
            <span className="text-yellow-300 font-bold text-base">{step.result}</span>
          </div>
        </div>
      </div>

      {/* Solve steps */}
      <div className={`mt-3 ml-4 space-y-1.5 ${transClass} ${show(4)}`}>
        <div className="flex items-center gap-3 text-white/80 text-sm">
          <span className="text-white/30">⟹</span>
          <InlineMath math={step.solve} />
        </div>
      </div>

      {/* Final answer for this variable */}
      <div className={`mt-2 ml-4 ${transClass} ${show(5)}`}>
        <div className="inline-flex items-center gap-3 bg-emerald-900/30 border border-emerald-500/40 rounded-xl px-4 py-2">
          <span className="text-emerald-300 font-bold text-base font-mono">
            <InlineMath math={step.solveVal} />
          </span>
          <span className="text-emerald-400 text-lg">✓</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// EXAMPLE VIEWER COMPONENT
// ─────────────────────────────────────────────────────────────────

const ExampleViewer: React.FC<{ example: Example }> = ({ example }) => {
  const [stepIdx, setStepIdx] = useState(0); // which elim step we're on (0 or 1)
  const [phase, setPhase] = useState(0);      // animation phase within a step
  const [showVerif, setShowVerif] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MAX_PHASE = 5; // phases 0–5 per elim block

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Reset when example changes
  useEffect(() => {
    clearTimer();
    setStepIdx(0);
    setPhase(0);
    setShowVerif(false);
    setShowAnswer(false);
    setIsPlaying(false);
  }, [example.id]);

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setTimeout(() => {
      if (phase < MAX_PHASE) {
        setPhase(p => p + 1);
      } else if (stepIdx < example.steps.length - 1) {
        // Move to next elim block
        setStepIdx(s => s + 1);
        setPhase(1);
      } else if (!showVerif) {
        setShowVerif(true);
      } else if (!showAnswer) {
        setShowAnswer(true);
        setIsPlaying(false);
      }
    }, 600);

    return clearTimer;
  }, [isPlaying, phase, stepIdx, showVerif, showAnswer, example.steps.length]);

  const handlePlay = () => {
    playPopSound();
    setIsPlaying(true);
    if (phase === 0) setPhase(1);
  };

  const handleReset = () => {
    playPopSound();
    clearTimer();
    setStepIdx(0);
    setPhase(0);
    setShowVerif(false);
    setShowAnswer(false);
    setIsPlaying(false);
  };

  const handleSkip = () => {
    playPopSound();
    clearTimer();
    setStepIdx(example.steps.length - 1);
    setPhase(MAX_PHASE);
    setShowVerif(true);
    setShowAnswer(true);
    setIsPlaying(false);
  };

  const isDone = showAnswer;

  return (
    <div className="space-y-5">

      {/* Difficulty badge + title */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-xs font-bold px-3 py-1 rounded-full font-body ${example.diffColor}`}>
          {example.difficulty}
        </span>
        <span className="font-body text-sm font-semibold text-white/80">{example.title}</span>
      </div>

      {/* SOAL */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
        <p className="font-body text-xs font-bold text-white/40 uppercase tracking-widest">📝 Soal</p>
        <p className="font-body text-sm text-white/80 leading-relaxed">{example.soal}</p>
        <div className="overflow-x-auto">
          <BlockMath math={example.soalTex} />
        </div>
      </div>

      {/* PENYELESAIAN */}
      <div className="space-y-4">
        <p className="font-body text-xs font-bold text-cyan-300/70 uppercase tracking-widest">✏️ Penyelesaian — Metode Eliminasi</p>

        {example.steps.map((step, i) => {
          const isActive   = i === stepIdx;
          const isDone_    = i < stepIdx || (i === stepIdx && phase >= MAX_PHASE && (stepIdx < example.steps.length - 1 ? true : showAnswer));
          const phaseToUse = i < stepIdx ? MAX_PHASE : isActive ? phase : 0;

          return (
            <div
              key={i}
              className={`border rounded-xl p-4 space-y-3 transition-all duration-300 ${
                i === 0
                  ? "border-cyan-500/30 bg-cyan-900/10"
                  : "border-violet-500/30 bg-violet-900/10"
              } ${phaseToUse === 0 ? "opacity-30" : "opacity-100"}`}
            >
              {/* Step header */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    i === 0 ? "bg-cyan-600 text-white" : "bg-violet-600 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="font-body text-sm font-semibold text-white">
                  Eliminasi variabel{" "}
                  <span
                    className={`font-mono font-bold ${
                      i === 0 ? "text-cyan-300" : "text-violet-300"
                    }`}
                  >
                    {/* figure out which variable is eliminated */}
                    {i === 0
                      ? step.varName === "x"
                        ? "y"
                        : step.varName === "y"
                        ? "x"
                        : step.varName === "b"
                        ? "p"
                        : "b"
                      : step.varName === "x"
                      ? "y"
                      : step.varName === "y"
                      ? "x"
                      : step.varName === "b"
                      ? "p"
                      : "b"}
                  </span>
                  {" "}untuk mencari{" "}
                  <span
                    className={`font-mono font-bold ${
                      i === 0 ? "text-cyan-300" : "text-violet-300"
                    }`}
                  >
                    {step.varName}
                  </span>
                </p>
              </div>

              <ElimBlock step={step} phase={phaseToUse} />
            </div>
          );
        })}
      </div>

      {/* VERIFIKASI */}
      <div
        className={`border border-green-500/30 bg-green-900/10 rounded-xl p-4 space-y-3 transition-all duration-500 ${
          showVerif ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="font-body text-xs font-bold text-green-300/70 uppercase tracking-widest">🔍 Verifikasi</p>
        <div className="space-y-1 overflow-x-auto">
          {example.verification.map((v, i) => (
            <BlockMath key={i} math={v} />
          ))}
        </div>
      </div>

      {/* JAWABAN */}
      <div
        className={`border border-yellow-500/40 bg-yellow-900/10 rounded-xl p-4 space-y-3 transition-all duration-500 ${
          showAnswer ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <p className="font-body text-xs font-bold text-yellow-300/70 uppercase tracking-widest">🎉 Jawaban Akhir</p>
        <p className="font-body text-sm text-white/80">{example.answer}</p>
        <div className="overflow-x-auto">
          <BlockMath math={example.answerTex} />
        </div>
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg px-3 py-2 mt-2">
          <p className="font-body text-xs text-blue-300">💡 <strong>Tips:</strong> {example.tips}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 pt-2 flex-wrap">
        {!isDone && !isPlaying && (
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-900/30"
          >
            <Play className="w-4 h-4" />
            Mulai Animasi
          </button>
        )}
        {isPlaying && (
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 bg-slate-700/70 hover:bg-slate-600/70 border border-white/10 text-white/70 text-sm font-body px-5 py-2.5 rounded-xl transition-all"
          >
            Lewati Animasi ⏭
          </button>
        )}
        {(phase > 0 || showVerif) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 text-white/60 text-sm font-body px-4 py-2.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi
          </button>
        )}
        {isDone && !isPlaying && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-body">
            <Sparkles className="w-4 h-4" />
            Selesai! Hebat! 🎉
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// THEORY SECTION — the "how to" visual format
// ─────────────────────────────────────────────────────────────────

const TheorySection: React.FC = () => (
  <div className="space-y-5">
    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
      <p className="font-body text-sm font-bold text-primary">Apa itu Metode Eliminasi?</p>
      <p className="font-body text-sm text-white/70 leading-relaxed">
        Metode <strong className="text-cyan-300">eliminasi</strong> berarti <em>menghilangkan</em> satu variabel
        dengan menjumlahkan atau mengurangkan dua persamaan yang koefisien salah satu variabelnya sudah
        disamakan. Sehingga tersisa <strong className="text-yellow-300">satu variabel</strong> yang bisa langsung diselesaikan.
      </p>
    </div>

    {/* Visual format guide */}
    <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-cyan-500/20 bg-cyan-900/20">
        <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest">📐 Format Penulisan Eliminasi</p>
      </div>

      <div className="p-4 space-y-1 font-mono text-sm overflow-x-auto">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_60px_1fr] gap-0 text-[10px] text-white/30 uppercase tracking-wider font-body mb-2">
          <div className="text-center">Persamaan Asal</div>
          <div className="text-center">Pengali</div>
          <div className="text-center">Bentuk Baru</div>
        </div>

        {/* PLDV 1 */}
        <div className="grid grid-cols-[1fr_60px_1fr] gap-0 border border-white/10 rounded-t-lg">
          <div className="px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-white/30 font-body">PLDV (1)</span>
            <span className="text-white/70">ax + by = c</span>
          </div>
          <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
            <span className="text-amber-300 font-bold">× <em>k</em>₁</span>
          </div>
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-cyan-200">k₁ax + k₁by = k₁c</span>
          </div>
        </div>

        {/* PLDV 2 */}
        <div className="grid grid-cols-[1fr_60px_1fr] gap-0 border-x border-b border-white/10 rounded-b-lg">
          <div className="px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-white/30 font-body">PLDV (2)</span>
            <span className="text-white/70">dx + ey = f</span>
          </div>
          <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
            <span className="text-amber-300 font-bold">× <em>k</em>₂</span>
          </div>
          <div className="px-3 py-2.5 flex items-center">
            <span className="text-cyan-200">k₂dx + k₂ey = k₂f</span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative border-t-2 border-white/30 mt-1">
          <div className="absolute right-0 -top-3.5 bg-slate-900 px-2">
            <span className="text-red-400 font-bold text-base">(±)</span>
          </div>
        </div>

        {/* Result */}
        <div className="pt-2 space-y-1">
          <div className="flex justify-end pr-1">
            <span className="text-yellow-300 font-bold">px = q</span>
          </div>
          <div className="flex justify-end pr-1">
            <span className="text-emerald-300 font-bold">x = q/p</span>
          </div>
        </div>
      </div>
    </div>

    {/* Rules */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="border border-red-500/30 bg-red-900/10 rounded-xl p-3">
        <p className="font-body text-xs font-bold text-red-300 mb-2">🔴 Koefisien SAMA TANDA → Kurangkan (−)</p>
        <div className="overflow-x-auto">
          <BlockMath math="+3y \text{ dan } +3y \;\Rightarrow\; \text{kurangkan}" />
        </div>
      </div>
      <div className="border border-green-500/30 bg-green-900/10 rounded-xl p-3">
        <p className="font-body text-xs font-bold text-green-300 mb-2">🟢 Koefisien BEDA TANDA → Jumlahkan (+)</p>
        <div className="overflow-x-auto">
          <BlockMath math="+3y \text{ dan } -3y \;\Rightarrow\; \text{jumlahkan}" />
        </div>
      </div>
    </div>

    {/* Steps summary */}
    <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-3">
      <p className="font-body text-xs font-bold text-white/60 uppercase tracking-widest">📋 Langkah-Langkah</p>
      <div className="space-y-2">
        {[
          { no: "1", text: "Tuliskan kedua persamaan dalam bentuk standar ax + by = c", color: "bg-cyan-600" },
          { no: "2", text: "Pilih variabel yang akan dieliminasi (dihilangkan)", color: "bg-violet-600" },
          { no: "3", text: "Samakan koefisien variabel itu dengan mengalikan persamaan", color: "bg-amber-600" },
          { no: "4", text: "Kurangkan atau jumlahkan kedua persamaan → variabel hilang!", color: "bg-red-600" },
          { no: "5", text: "Selesaikan untuk mendapat nilai variabel pertama", color: "bg-emerald-600" },
          { no: "6", text: "Ulangi proses untuk mencari variabel kedua", color: "bg-blue-600" },
          { no: "7", text: "Verifikasi hasilnya ke kedua persamaan asal", color: "bg-green-600" },
        ].map(({ no, text, color }) => (
          <div key={no} className="flex items-start gap-3">
            <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${color}`}>{no}</span>
            <p className="font-body text-xs text-white/70 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// PAGE TABS
// ─────────────────────────────────────────────────────────────────

type TabId = "teori" | "contoh1" | "contoh2" | "contoh3";

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "teori",   label: "Teori",   emoji: "📘" },
  { id: "contoh1", label: "Soal 1",  emoji: "🟢" },
  { id: "contoh2", label: "Soal 2",  emoji: "🟡" },
  { id: "contoh3", label: "Soal 3",  emoji: "🔴" },
];

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────

const BukuAnimasiEliminasiPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("teori");

  const currentTabIdx = TABS.findIndex(t => t.id === activeTab);

  const goPrev = () => {
    playPopSound();
    if (currentTabIdx > 0) setActiveTab(TABS[currentTabIdx - 1].id);
  };
  const goNext = () => {
    playPopSound();
    if (currentTabIdx < TABS.length - 1) setActiveTab(TABS[currentTabIdx + 1].id);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-16">

        {/* Page header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-body text-xs font-bold text-primary uppercase tracking-widest">Buku Animasi Matematika</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            METODE ELIMINASI
          </h1>
          <p className="font-display text-sm font-semibold text-cyan-400 mb-1">
            Penyelesaian SPLDV — Sistem Persamaan Linear Dua Variabel
          </p>
          <p className="text-white/40 text-xs font-body">Kelas 8 · Semester 1</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-5 bg-slate-900/60 border border-white/10 rounded-2xl p-1.5 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { playPopSound(); setActiveTab(tab.id); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-body whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 min-h-[400px] animate-slide-up">
          {activeTab === "teori"   && <TheorySection />}
          {activeTab === "contoh1" && <ExampleViewer key="ex1" example={EXAMPLES[0]} />}
          {activeTab === "contoh2" && <ExampleViewer key="ex2" example={EXAMPLES[1]} />}
          {activeTab === "contoh3" && <ExampleViewer key="ex3" example={EXAMPLES[2]} />}
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={goPrev}
            disabled={currentTabIdx === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white/70 text-sm font-body rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentTabIdx > 0 ? TABS[currentTabIdx - 1].label : ""}
          </button>
          <span className="font-body text-xs text-white/30">
            {currentTabIdx + 1} / {TABS.length}
          </span>
          <button
            onClick={goNext}
            disabled={currentTabIdx === TABS.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white/70 text-sm font-body rounded-xl transition-all"
          >
            {currentTabIdx < TABS.length - 1 ? TABS[currentTabIdx + 1].label : ""}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv/metode-eliminasi"); }}
            className="font-body text-xs text-white/30 hover:text-white/60 transition-all underline underline-offset-2"
          >
            ← Kembali ke Materi Metode Eliminasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default BukuAnimasiEliminasiPage;
