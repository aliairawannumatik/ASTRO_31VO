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
    const stars = Math.round((guruScore / (totalQuestions * 20)) * 5);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
        />
        <div
          className="relative z-10 flex flex-col items-center gap-4 rounded-3xl border-4 px-8 py-10 text-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
            borderColor: "#FFD700",
            maxWidth: 380,
            width: "92vw",
            boxShadow: "0 0 60px rgba(255,215,0,0.4)",
          }}
        >
          <div className="text-5xl animate-bounce">🏆</div>
          <h2 className="text-2xl font-black text-yellow-300" style={{ textShadow: "0 0 20px #FFD700" }}>
            TANTANGAN NUMATIK SELESAI!
          </h2>

          <div className="flex gap-1 text-3xl">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} style={{ opacity: i < stars ? 1 : 0.25 }}>⭐</span>
            ))}
          </div>

          <div
            className="rounded-2xl px-6 py-4 text-center"
            style={{ background: "rgba(255,215,0,0.15)", border: "2px solid rgba(255,215,0,0.4)" }}
          >
            <p className="text-sm text-yellow-200 mb-1">Skor Tantangan NUMATIK</p>
            <p
              className="text-5xl font-black text-yellow-300"
              style={{ textShadow: "0 0 20px #FFD700" }}
            >
              {guruScore}
            </p>
            <p className="text-xs text-yellow-200 mt-1">
              dari {totalQuestions * 20} poin maksimal
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1 text-2xl">
            {STAR_EMOJIS.slice(0, 6).map((e, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
                {e}
              </span>
            ))}
          </div>

          <p className="text-sm text-indigo-200">
            {guruScore === totalQuestions * 20
              ? "Luar biasa! Semua jawaban benar! Kamu hebat! 🥇"
              : guruScore >= (totalQuestions * 20) / 2
              ? "Bagus sekali! Terus semangat belajar matematika! 💪"
              : "Jangan menyerah! Terus berlatih dan kamu pasti bisa! 🌟"}
          </p>

          <button
            onClick={onDismissCelebration}
            className="mt-2 rounded-2xl px-8 py-3 text-base font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              color: "#1e1b4b",
              boxShadow: "0 4px 20px rgba(255,215,0,0.5)",
            }}
          >
            Lanjutkan Main! 🎮
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
        className="relative z-10 flex flex-col gap-4 rounded-3xl border-4 px-6 py-7 shadow-2xl"
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
            +20 poin ✓
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
              ? "✅ BENAR! +20 poin! Hebat! 🎉"
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
