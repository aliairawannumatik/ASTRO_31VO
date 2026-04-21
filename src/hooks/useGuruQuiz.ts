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

const MAX_QUESTIONS = 5;
const DEFAULT_INTERVAL_MS = 30000;

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
}

export function useGuruQuiz(
  phaseRef: React.MutableRefObject<string>,
  playingPhase: string | string[] = "playing",
  intervalMs: number = DEFAULT_INTERVAL_MS
): UseGuruQuizReturn {
  const isPausedRef = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<GuruQuestion | null>(null);
  const [guruScore, setGuruScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);

  const internal = useRef({
    questionCount: 0,
    guruScore: 0,
    sessionStart: 0,
    prevPhase: "",
    triggered: [false, false, false, false, false] as boolean[],
    usedIndices: [] as number[],
    active: false,
  });

  const pickQuestion = useCallback((): GuruQuestion => {
    const used = internal.current.usedIndices;
    let idx: number;
    if (used.length >= GURU_QUESTIONS.length) {
      internal.current.usedIndices = [];
    }
    do {
      idx = Math.floor(Math.random() * GURU_QUESTIONS.length);
    } while (internal.current.usedIndices.includes(idx));
    internal.current.usedIndices.push(idx);
    return GURU_QUESTIONS[idx];
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const phase = phaseRef.current;
      const ref = internal.current;

      const isPlaying = Array.isArray(playingPhase) ? playingPhase.includes(phase) : phase === playingPhase;
      const wasPlaying = Array.isArray(playingPhase) ? playingPhase.includes(ref.prevPhase) : ref.prevPhase === playingPhase;
      if (!wasPlaying && isPlaying) {
        ref.questionCount = 0;
        ref.guruScore = 0;
        ref.sessionStart = Date.now();
        ref.triggered = [false, false, false, false, false];
        ref.usedIndices = [];
        ref.active = true;
        isPausedRef.current = false;
        setIsVisible(false);
        setCurrentQuestion(null);
        setGuruScore(0);
        setQuestionNumber(0);
        setShowCelebration(false);
        setLastResult(null);
      }
      ref.prevPhase = phase;

      if (!ref.active) return;
      if (!isPlaying) return;
      if (isPausedRef.current) return;
      if (ref.questionCount >= MAX_QUESTIONS) return;

      const elapsed = Date.now() - ref.sessionStart;
      for (let i = 0; i < MAX_QUESTIONS; i++) {
        if (!ref.triggered[i] && elapsed >= (i + 1) * intervalMs) {
          ref.triggered[i] = true;
          ref.questionCount += 1;
          const q = pickQuestion();
          isPausedRef.current = true;
          setCurrentQuestion(q);
          setQuestionNumber(ref.questionCount);
          setLastResult(null);
          setIsVisible(true);
          break;
        }
      }
    }, 500);

    return () => clearInterval(timer);
  }, [phaseRef, playingPhase, pickQuestion]);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (!currentQuestion) return;
      const correct = idx === currentQuestion.correctIdx;
      setLastResult(correct ? "correct" : "wrong");
      if (correct) {
        internal.current.guruScore += 20;
        setGuruScore(internal.current.guruScore);
      }
      setTimeout(() => {
        setIsVisible(false);
        setCurrentQuestion(null);
        isPausedRef.current = false;
        if (internal.current.questionCount >= MAX_QUESTIONS) {
          internal.current.active = false;
          setShowCelebration(true);
        }
      }, 1200);
    },
    [currentQuestion]
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
  };
}
