import { useCallback, useEffect, useRef, useState } from "react";

export interface GuruQuestion {
  question: string;
  options: string[];
  correctIdx: number;
}

const GURU_QUESTIONS: GuruQuestion[] = [
  { question: "Berapa hasil dari 15 × 12?", options: ["160", "170", "180", "190"], correctIdx: 2 },
  { question: "Berapa √225 ?", options: ["13", "14", "15", "16"], correctIdx: 2 },
  { question: "Berapakah FPB dari 36 dan 48?", options: ["6", "9", "12", "18"], correctIdx: 2 },
  { question: "Berapakah KPK dari 6 dan 9?", options: ["18", "27", "36", "54"], correctIdx: 0 },
  { question: "Jika 3x − 5 = 16, berapakah x?", options: ["5", "6", "7", "8"], correctIdx: 2 },
  { question: "Berapa luas persegi dengan sisi 13 cm?", options: ["156 cm²", "169 cm²", "182 cm²", "196 cm²"], correctIdx: 1 },
  { question: "0,6 × 0,4 = ?", options: ["0,024", "0,24", "2,4", "24"], correctIdx: 1 },
  { question: "25% dari 320 adalah?", options: ["64", "80", "100", "128"], correctIdx: 1 },
  { question: "Berapa 7³ ?", options: ["147", "243", "343", "343"], correctIdx: 2 },
  { question: "Dalam segitiga siku-siku, sisi miring = √(6² + 8²). Hasilnya?", options: ["8 cm", "9 cm", "10 cm", "11 cm"], correctIdx: 2 },
  { question: "Persentase 45 dari 180 adalah?", options: ["20%", "25%", "30%", "35%"], correctIdx: 1 },
  { question: "Berapakah 2⁸?", options: ["128", "256", "512", "1024"], correctIdx: 1 },
  { question: "Luas lingkaran dengan r = 7 cm (π = 22/7)?", options: ["144 cm²", "154 cm²", "164 cm²", "176 cm²"], correctIdx: 1 },
  { question: "Nilai dari (−3) × (−7) = ?", options: ["−21", "−10", "10", "21"], correctIdx: 3 },
  { question: "Berapa hasil 144 ÷ 12?", options: ["10", "11", "12", "13"], correctIdx: 2 },
  { question: "Keliling persegi panjang 14 cm × 9 cm?", options: ["42 cm", "46 cm", "48 cm", "52 cm"], correctIdx: 1 },
  { question: "Median dari data: 3, 5, 7, 9, 11 adalah?", options: ["5", "6", "7", "8"], correctIdx: 2 },
  { question: "Modus dari data: 2, 4, 4, 5, 6, 4, 7 adalah?", options: ["2", "4", "5", "6"], correctIdx: 1 },
  { question: "Jika y = 2x + 3 dan x = 4, berapakah y?", options: ["9", "10", "11", "12"], correctIdx: 2 },
  { question: "Pecahan 3/8 dalam desimal adalah?", options: ["0,275", "0,325", "0,375", "0,425"], correctIdx: 2 },
  { question: "Berapa nilai dari 4! (4 faktorial)?", options: ["12", "18", "24", "48"], correctIdx: 2 },
  { question: "Sudut dalam segitiga sama sisi masing-masing?", options: ["45°", "60°", "72°", "90°"], correctIdx: 1 },
  { question: "Hasil dari 1000 − 378 = ?", options: ["612", "622", "632", "642"], correctIdx: 1 },
  { question: "Berapa 3/4 dari 200?", options: ["100", "125", "150", "175"], correctIdx: 2 },
  { question: "Jika 5x = 75, maka x = ?", options: ["12", "13", "14", "15"], correctIdx: 3 },
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
