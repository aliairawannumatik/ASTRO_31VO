import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
  import type { GuruQuestion } from "@/hooks/useGuruQuiz";

  const QUESTIONS: GuruQuestion[] = [
    { question: "Hasil dari 4 + 6 × 2 adalah ...", options: ["20", "16", "12", "8"], correctIdx: 1 },
    { question: "Hasil dari (8 − 2) ÷ 3 adalah ...", options: ["2", "6", "4", "8"], correctIdx: 0 },
    { question: "Hasil dari 10 − 2 × 3 adalah ...", options: ["24", "4", "-4", "30"], correctIdx: 1 },
    { question: "Hasil dari 12 ÷ 4 + 5 adalah ...", options: ["3", "8", "12", "17"], correctIdx: 1 },
    { question: "Hasil dari 3 × (5 + 1) adalah ...", options: ["8", "16", "18", "15"], correctIdx: 2 },
    { question: "Hasil dari (−3) × 2 + 8 adalah ...", options: ["-2", "2", "14", "-14"], correctIdx: 1 },
    { question: "Hasil dari 15 − 9 ÷ 3 adalah ...", options: ["12", "2", "6", "8"], correctIdx: 0 },
    { question: "Hasil dari 20 ÷ 4 − 1 adalah ...", options: ["4", "5", "6", "3"], correctIdx: 0 },
    { question: "Urutan operasi yang benar adalah ...", options: ["+, −, ×, ÷", "×, ÷, +, −", "−, +, ÷, ×", "÷, ×, −, +"], correctIdx: 1 },
    { question: "Hasil dari 5 + 3 × 2 adalah ...", options: ["16", "11", "13", "10"], correctIdx: 1 },
    { question: "Hasil dari (10 − 4) × 2 adalah ...", options: ["12", "2", "16", "8"], correctIdx: 0 },
    { question: "Hasil dari 7 + 14 ÷ 2 adalah ...", options: ["10", "14", "21", "7"], correctIdx: 1 },
  ];

  const OperasiCampuranSnakeMathGamePage = () => (
    <SnakeMathPage
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      homePath="/menu"
      quizQuestions={QUESTIONS}
      quizIntervalMs={25_000}
    />
  );

  export default OperasiCampuranSnakeMathGamePage;
  