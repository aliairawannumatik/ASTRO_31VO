import { useEffect, useRef } from "react";
import type { UseGuruQuizReturn } from "@/hooks/useGuruQuiz";

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = [
  { base: "#3B82F6", light: "#BFDBFE", dark: "#1E40AF" },
  { base: "#10B981", light: "#A7F3D0", dark: "#065F46" },
  { base: "#F59E0B", light: "#FDE68A", dark: "#92400E" },
  { base: "#EF4444", light: "#FECACA", dark: "#991B1B" },
];

const STAR_EMOJIS = ["⭐", "🌟", "✨", "💫", "🎉", "🏆", "🎊", "🥳"];

interface Props extends UseGuruQuizReturn {}

export default function GuruQuizOverlay({
  isVisible,
  currentQuestion,
  handleAnswer,
  guruScore,
  questionNumber,
  totalQuestions,
  showCelebration,
  onDismissCelebration,
  lastResult,
  secondsUntilNext,
  isCountdownActive,
}: Props) {
  const answeredRef = useRef(false);

  useEffect(() => {
    if (isVisible) {
      answeredRef.current = false;
    }
  }, [isVisible]);

  const onOption = (idx: number) => {
    if (answeredRef.current || lastResult !== null) return;
    answeredRef.current = true;
    handleAnswer(idx);
  };

  if (!isVisible && !showCelebration) {
    if (!isCountdownActive) return null;
    const urgent = secondsUntilNext <= 5;
    return (
      <div
        className="pointer-events-none fixed left-1/2 z-40 -translate-x-1/2 select-none"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
      >
        <div
          className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold tracking-wider shadow-lg backdrop-blur-md"
          style={{
            background: urgent
              ? "rgba(239,68,68,0.22)"
              : "rgba(15,23,42,0.65)",
            borderColor: urgent ? "#FCA5A5" : "rgba(129,140,248,0.55)",
            color: urgent ? "#FCA5A5" : "#C7D2FE",
            boxShadow: urgent
              ? "0 0 16px rgba(239,68,68,0.45)"
              : "0 0 14px rgba(129,140,248,0.35)",
          }}
        >
          <img
            src="/numatik-ai-avatar.png"
            alt="NUMATIK"
            className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-300/60"
          />
          <span>SOAL NUMATIK:</span>
          <span
            className={urgent ? "animate-pulse" : ""}
            style={{
              minWidth: "2.2em",
              textAlign: "center",
              color: urgent ? "#FECACA" : "#FDE68A",
              textShadow: urgent
                ? "0 0 8px rgba(252,165,165,0.8)"
                : "0 0 6px rgba(253,224,71,0.55)",
            }}
          >
            {secondsUntilNext}s
          </span>
        </div>
      </div>
    );
  }

  if (showCelebration) {
    const maxScore = totalQuestions * 50;
    const correctCount = guruScore / 50;
    const allCorrect = guruScore === maxScore;
    const noneCorrect = guruScore === 0;

    const tier = allCorrect
      ? {
          bg: "linear-gradient(135deg, #1a0050 0%, #6d00b0 20%, #c2006a 45%, #ff6a00 70%, #ffd700 100%)",
          border: "#ff6a00",
          glow: "rgba(255,106,0,0.55)",
          emoji: ["🏆", "🎉", "🌈", "🎊", "🌟", "✨", "🥇"],
          badge: "bg-yellow-500/20 border-yellow-400/50",
          scoreColor: "#ffd700",
          scoreGlow: "#ff6a00",
          titleColor: "#fff",
          titleGlow: "#ff6a00",
          title: "SEMPURNA! NILAI 100! 🏆",
          subtitle: "Semua soal dijawab dengan benar!",
          message: "LUAR BIASA! Kamu meraih nilai sempurna 100! Kamu benar-benar jagoan Metode Eliminasi! Pertahankan terus ya, Juara! 🥇",
          btnBg: "linear-gradient(135deg, #ff6a00, #c2006a, #6d00b0)",
          btnColor: "#fff",
          btnGlow: "rgba(255,106,0,0.65)",
          btnText: "🚀 Lanjut Main Lagi!",
          stars: totalQuestions,
        }
      : noneCorrect
      ? {
          bg: "linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #1e1b4b 100%)",
          border: "#a78bfa",
          glow: "rgba(167,139,250,0.4)",
          emoji: ["💪", "🔥", "📚", "⚡", "💥"],
          badge: "bg-violet-500/20 border-violet-400/50",
          scoreColor: "#c4b5fd",
          scoreGlow: "#a78bfa",
          titleColor: "#c4b5fd",
          titleGlow: "#a78bfa",
          title: "SEMANGAT EKSTRA!",
          subtitle: "Jangan pernah menyerah!",
          message: "Setiap jagoan matematika pernah gagal dulu! Pelajari kembali materinya dan coba lagi — kamu PASTI bisa! 🌟",
          btnBg: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          btnColor: "#ede9fe",
          btnGlow: "rgba(124,58,237,0.55)",
          btnText: "🔥 Coba Lagi, Ayo!",
          stars: 0,
        }
      : {
          bg: "linear-gradient(135deg, #1c1917 0%, #292524 40%, #1c1917 100%)",
          border: "#fbbf24",
          glow: "rgba(251,191,36,0.4)",
          emoji: ["👍", "✨", "💡", "🌈", "⭐"],
          badge: "bg-amber-500/20 border-amber-400/50",
          scoreColor: "#fde68a",
          scoreGlow: "#fbbf24",
          titleColor: "#fde68a",
          titleGlow: "#fbbf24",
          title: "AYO SEMANGAT!",
          subtitle: "Hampir sempurna, terus berjuang!",
          message: "Bagus! Kamu sudah menjawab sebagian benar. Pelajari soal yang terlewat dan kamu akan semakin jago! 💪",
          btnBg: "linear-gradient(135deg, #f59e0b, #d97706)",
          btnColor: "#1c1917",
          btnGlow: "rgba(245,158,11,0.55)",
          btnText: "⚡ Lanjut Main!",
          stars: correctCount,
        };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }} />
        <div
          className="relative z-10 flex flex-col items-center gap-4 rounded-3xl border-4 px-7 py-9 text-center shadow-2xl overflow-hidden"
          style={{
            background: tier.bg,
            borderColor: tier.border,
            maxWidth: 380,
            width: "92vw",
            boxShadow: `0 0 70px ${tier.glow}`,
          }}
        >
          {/* Floating emoji strip */}
          <div className="flex gap-2 text-3xl">
            {tier.emoji.map((e, i) => (
              <span
                key={i}
                className={allCorrect ? "animate-bounce" : noneCorrect ? "animate-pulse" : "animate-pulse"}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {e}
              </span>
            ))}
          </div>

          {/* Title */}
          <div>
            <h2
              className="text-2xl font-black tracking-wide"
              style={{ color: tier.titleColor, textShadow: `0 0 24px ${tier.titleGlow}` }}
            >
              {tier.title}
            </h2>
            <p className="text-xs mt-1" style={{ color: tier.scoreColor, opacity: 0.8 }}>
              {tier.subtitle}
            </p>
          </div>

          {/* Score badge */}
          <div
            className={`rounded-2xl border-2 px-8 py-4 w-full ${tier.badge}`}
          >
            <p className="text-xs mb-1" style={{ color: tier.scoreColor, opacity: 0.75 }}>
              Skor Postes Kamu
            </p>
            <p
              className="text-5xl font-black"
              style={{ color: tier.scoreColor, textShadow: `0 0 24px ${tier.scoreGlow}` }}
            >
              {guruScore}
              <span className="text-lg font-semibold" style={{ opacity: 0.5 }}>/{maxScore}</span>
            </p>
            {/* Stars row */}
            <div className="flex justify-center gap-1 mt-2 text-xl">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <span key={i} style={{ opacity: i < tier.stars ? 1 : 0.2, filter: i < tier.stars ? `drop-shadow(0 0 6px ${tier.scoreGlow})` : "none" }}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: tier.scoreColor, opacity: 0.6 }}>
              {correctCount} dari {totalQuestions} soal benar
            </p>
          </div>

          {/* Message */}
          <p className="text-sm leading-relaxed" style={{ color: tier.scoreColor, opacity: 0.9 }}>
            {tier.message}
          </p>

          {/* CTA button */}
          <button
            onClick={onDismissCelebration}
            className="mt-1 w-full rounded-2xl py-3.5 text-base font-black tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: tier.btnBg,
              color: tier.btnColor,
              boxShadow: `0 4px 24px ${tier.btnGlow}`,
            }}
          >
            {tier.btnText}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(4px)" }}
      />
      <div
        className="game-quiz-panel relative z-10 flex flex-col gap-4 rounded-3xl border-4 px-6 py-7 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          borderColor: "#818CF8",
          maxWidth: 400,
          width: "92vw",
          boxShadow: "0 0 50px rgba(129,140,248,0.5)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 p-[2px] shadow-[0_0_18px_rgba(34,211,238,0.55)]">
              <img
                src="/numatik-ai-avatar.png"
                alt="NUMATIK"
                className="h-full w-full rounded-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[8px] ring-2 ring-slate-900">
                🤖
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                Soal dari NUMATIK
              </p>
              <p className="text-xs text-indigo-400">
                Pertanyaan {questionNumber} / {totalQuestions}
              </p>
            </div>
          </div>
          <div
            className="rounded-xl px-3 py-1 text-sm font-bold text-yellow-300"
            style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)" }}
          >
            +50 poin ✓
          </div>
        </div>

        <div
          className="rounded-2xl px-4 py-4 text-center"
          style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.3)" }}
        >
          <p className="text-base font-bold leading-snug text-white">
            {currentQuestion.question}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((opt, i) => {
            const col = OPTION_COLORS[i];
            let bg = col.base;
            let border = col.base;
            let scale = "scale-100";

            if (lastResult !== null) {
              if (i === currentQuestion.correctIdx) {
                bg = col.dark;
                border = "#4ADE80";
                scale = "scale-105";
              } else {
                bg = "rgba(30,30,60,0.5)";
                border = "rgba(255,255,255,0.1)";
              }
            }

            return (
              <button
                key={i}
                onClick={() => onOption(i)}
                disabled={lastResult !== null}
                className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-left font-bold text-white transition-all duration-300 ${scale}`}
                style={{
                  background: bg,
                  border: `2px solid ${border}`,
                  opacity: lastResult !== null && i !== currentQuestion.correctIdx ? 0.45 : 1,
                  cursor: lastResult !== null ? "not-allowed" : "pointer",
                  boxShadow: lastResult === null ? `0 4px 14px ${col.base}55` : "none",
                }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {lastResult !== null && i === currentQuestion.correctIdx
                    ? "✓"
                    : OPTION_LABELS[i]}
                </span>
                <span className="text-sm leading-tight">{opt}</span>
              </button>
            );
          })}
        </div>

        {lastResult !== null && (
          <div
            className="rounded-2xl px-4 py-3 text-center font-bold animate-pulse"
            style={{
              background:
                lastResult === "correct"
                  ? "rgba(74,222,128,0.2)"
                  : "rgba(239,68,68,0.2)",
              border: `2px solid ${lastResult === "correct" ? "#4ADE80" : "#EF4444"}`,
              color: lastResult === "correct" ? "#4ADE80" : "#FCA5A5",
            }}
          >
            {lastResult === "correct"
              ? "✅ BENAR! +50 poin! Hebat! 🎉"
              : `❌ Salah. Jawaban: ${currentQuestion.options[currentQuestion.correctIdx]}`}
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-indigo-400">Game di-pause sementara</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full"
                style={{
                  background: i < questionNumber ? "#818CF8" : "rgba(129,140,248,0.2)",
                  border: "1px solid rgba(129,140,248,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
