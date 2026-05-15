import { useCallback, useEffect, useRef, useState } from "react";

export interface GuruQuestion {
  question: string;
  options: string[];
  correctIdx: number;
}

const GURU_QUESTIONS: GuruQuestion[] = [
  { question: "Dari gambar 6 apel dan 4 jeruk, perbandingan apel terhadap jeruk ditulis ...", options: ["4 : 6", "6 : 4", "6 + 4", "6 × 4"], correctIdx: 1 },
  { question: "Bilangan terbesar yang dapat membagi 6 dan 4 adalah ...", options: ["1", "2", "3", "4"], correctIdx: 1 },
  { question: "Bentuk paling sederhana dari 6 : 4 adalah ...", options: ["2 : 3", "3 : 2", "3 : 4", "4 : 3"], correctIdx: 1 },
  { question: "Sebelum membandingkan 45 menit dengan 1 jam, 1 jam harus diubah menjadi ... menit", options: ["30", "45", "60", "90"], correctIdx: 2 },
  { question: "Perbandingan 45 menit terhadap 60 menit adalah ...", options: ["45 : 60", "60 : 45", "45 + 60", "1 : 60"], correctIdx: 0 },
  { question: "Bentuk sederhana dari 45 : 60 adalah ...", options: ["2 : 3", "3 : 4", "4 : 5", "5 : 6"], correctIdx: 1 },
  { question: "Jika 12 buku dibagikan kepada 3 siswa, setiap 1 siswa mendapat ... buku", options: ["3", "4", "5", "6"], correctIdx: 1 },
  { question: "Jarak 150 km ditempuh dalam 3 jam. Satuan pembanding kecepatannya adalah ... km/jam", options: ["30", "45", "50", "60"], correctIdx: 2 },
  { question: "Perbandingan digunakan untuk membandingkan dua besaran. Jika satuannya berbeda, satuan harus dibuat ... terlebih dahulu", options: ["berbeda", "sama", "besar", "kecil"], correctIdx: 1 },
  { question: "Rumus baku: Rasio a terhadap b ditulis ...", options: ["a + b", "a − b", "a : b", "a × b"], correctIdx: 2 },
  { question: "Rumus baku: Rasio paling sederhana diperoleh dengan membagi kedua bilangan oleh ...", options: ["KPK", "FPB", "Jumlah", "Selisih"], correctIdx: 1 },
  { question: "Rumus baku: Nilai tiap 1 satuan diperoleh dari jumlah besaran dibagi ...", options: ["selisih satuan", "banyak satuan", "hasil kali satuan", "akar satuan"], correctIdx: 1 },
];

const DEFAULT_MAX_QUESTIONS = 5;
const DEFAULT_INTERVAL_MS = 25000;

export interface UseGuruQuizReturn {
  isPausedRef: React.MutableRefObject<boolean>;
  isVisible: boolean;
  currentQuestion: GuruQuestion | null;
  handleAnswer: (idx: number) => void;
  guruScore: number;
  questionNumber: number;
  totalQuestions: number;
  showCelebration: boolean;
  onDismissCelebration: () => void;
  lastResult: "correct" | "wrong" | null;
  /** Seconds remaining until the next question is shown. Frozen while a question
   *  is open or the game is not in the playing phase. */
  secondsUntilNext: number;
  /** True when the countdown should be visible to the player (game is actively
   *  running, no question on screen, and more questions are still scheduled). */
  isCountdownActive: boolean;
}

export function useGuruQuiz(
  phaseRef: React.MutableRefObject<string>,
  playingPhase: string | string[] = "playing",
  intervalMs: number = DEFAULT_INTERVAL_MS,
  customQuestions?: GuruQuestion[]
): UseGuruQuizReturn {
  const isPausedRef = useRef(false);
  const MAX_QUESTIONS = customQuestions && customQuestions.length > 0
    ? Math.min(customQuestions.length, DEFAULT_MAX_QUESTIONS)
    : DEFAULT_MAX_QUESTIONS;

  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<GuruQuestion | null>(null);
  const [guruScore, setGuruScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);
  const [secondsUntilNext, setSecondsUntilNext] = useState<number>(Math.ceil(intervalMs / 1000));
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const internal = useRef({
    questionCount: 0,
    guruScore: 0,
    prevPhase: "",
    /** Timestamp (ms) at which the next question should fire. */
    nextTriggerAt: 0,
    /** Timestamp recorded when the game leaves the playing phase, so we can
     *  shift `nextTriggerAt` forward by the paused duration on resume. */
    pauseStart: 0,
    usedIndices: [] as number[],
    active: false,
  });

  // Mirror `secondsUntilNext` into a ref so the interval doesn't need to
  // re-subscribe on every change.
  const secondsUntilNextRef = useRef(secondsUntilNext);
  useEffect(() => { secondsUntilNextRef.current = secondsUntilNext; }, [secondsUntilNext]);
  const isCountdownActiveRef = useRef(isCountdownActive);
  useEffect(() => { isCountdownActiveRef.current = isCountdownActive; }, [isCountdownActive]);

  const questionPool = customQuestions && customQuestions.length > 0 ? customQuestions : GURU_QUESTIONS;

  const pickQuestion = useCallback((): GuruQuestion => {
    const used = internal.current.usedIndices;
    if (used.length >= questionPool.length) {
      internal.current.usedIndices = [];
    }
    let idx: number;
    do {
      idx = Math.floor(Math.random() * questionPool.length);
    } while (internal.current.usedIndices.includes(idx));
    internal.current.usedIndices.push(idx);
    return questionPool[idx];
  }, [questionPool]);

  useEffect(() => {
    const timer = setInterval(() => {
      const phase = phaseRef.current;
      const ref = internal.current;
      const now = Date.now();

      const isPlaying = Array.isArray(playingPhase) ? playingPhase.includes(phase) : phase === playingPhase;
      const wasPlaying = Array.isArray(playingPhase) ? playingPhase.includes(ref.prevPhase) : ref.prevPhase === playingPhase;

      // Transition: idle → playing (game just started)
      if (!wasPlaying && isPlaying) {
        ref.questionCount = 0;
        ref.guruScore = 0;
        ref.usedIndices = [];
        ref.active = true;
        ref.nextTriggerAt = now + intervalMs;
        ref.pauseStart = 0;
        isPausedRef.current = false;
        setIsVisible(false);
        setCurrentQuestion(null);
        setGuruScore(0);
        setQuestionNumber(0);
        setShowCelebration(false);
        setLastResult(null);
        setSecondsUntilNext(Math.ceil(intervalMs / 1000));
        setIsCountdownActive(true);
      }

      // Transition: playing → not playing (game paused or ended)
      if (wasPlaying && !isPlaying && ref.pauseStart === 0) {
        ref.pauseStart = now;
      }

      // Transition: not playing → playing again (game resumed) — shift the
      // remaining countdown forward so the player gets the time they had left.
      if (!wasPlaying && isPlaying && ref.pauseStart !== 0) {
        const pausedDuration = now - ref.pauseStart;
        ref.nextTriggerAt += pausedDuration;
        ref.pauseStart = 0;
      }

      ref.prevPhase = phase;

      if (!ref.active) {
        if (isCountdownActiveRef.current) setIsCountdownActive(false);
        return;
      }

      // While a question is on screen, freeze the countdown display and hide chip.
      if (isPausedRef.current) {
        if (isCountdownActiveRef.current) setIsCountdownActive(false);
        return;
      }

      // While the game is paused (not playing), don't decrement either.
      if (!isPlaying) {
        if (isCountdownActiveRef.current) setIsCountdownActive(false);
        return;
      }

      // No more questions to fire this session.
      if (ref.questionCount >= MAX_QUESTIONS) {
        if (secondsUntilNextRef.current !== 0) setSecondsUntilNext(0);
        if (isCountdownActiveRef.current) setIsCountdownActive(false);
        return;
      }

      if (!isCountdownActiveRef.current) setIsCountdownActive(true);

      const remainingMs = Math.max(0, ref.nextTriggerAt - now);
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      if (secondsUntilNextRef.current !== remainingSec) {
        setSecondsUntilNext(remainingSec);
      }

      // Time to fire the next question.
      if (now >= ref.nextTriggerAt) {
        ref.questionCount += 1;
        const q = pickQuestion();
        isPausedRef.current = true;
        setCurrentQuestion(q);
        setQuestionNumber(ref.questionCount);
        setLastResult(null);
        setIsVisible(true);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [phaseRef, playingPhase, pickQuestion, intervalMs]);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (!currentQuestion) return;
      const correct = idx === currentQuestion.correctIdx;
      setLastResult(correct ? "correct" : "wrong");
      if (correct) {
        internal.current.guruScore += 50;
        setGuruScore(internal.current.guruScore);
      }
      setTimeout(() => {
        setIsVisible(false);
        setCurrentQuestion(null);
        // Restart the countdown only AFTER the player answered the question.
        internal.current.nextTriggerAt = Date.now() + intervalMs;
        setSecondsUntilNext(Math.ceil(intervalMs / 1000));
        isPausedRef.current = false;
        if (internal.current.questionCount >= MAX_QUESTIONS) {
          internal.current.active = false;
          setShowCelebration(true);
        }
      }, 1200);
    },
    [currentQuestion, intervalMs]
  );

  const onDismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return {
    isPausedRef,
    isVisible,
    currentQuestion,
    handleAnswer,
    guruScore,
    questionNumber,
    totalQuestions: MAX_QUESTIONS,
    showCelebration,
    onDismissCelebration,
    lastResult,
    secondsUntilNext,
    isCountdownActive,
  };
}
