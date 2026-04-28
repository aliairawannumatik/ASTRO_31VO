import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
  import type { GuruQuestion } from "@/hooks/useGuruQuiz";

  const QUESTIONS: GuruQuestion[] = [
    { question: "Hasil dari 5 × 3 adalah ...", options: ["8", "15", "-15", "-8"], correctIdx: 1 },
    { question: "Hasil dari (−2) × 6 adalah ...", options: ["12", "-12", "8", "-8"], correctIdx: 1 },
    { question: "Hasil dari (−4) × (−5) adalah ...", options: ["20", "-20", "9", "-9"], correctIdx: 0 },
    { question: "Hasil dari 8 × 0 adalah ...", options: ["8", "0", "1", "-8"], correctIdx: 1 },
    { question: "Hasil dari 3 × (−7) adalah ...", options: ["21", "-21", "10", "-10"], correctIdx: 1 },
    { question: "Hasil dari (−1) × 9 adalah ...", options: ["9", "-9", "8", "-8"], correctIdx: 1 },
    { question: "Hasil dari 6 × 4 adalah ...", options: ["10", "24", "-24", "-10"], correctIdx: 1 },
    { question: "Hasil dari (−3) × (−3) adalah ...", options: ["9", "-9", "6", "-6"], correctIdx: 0 },
    { question: "Hasil dari 7 × 2 adalah ...", options: ["14", "9", "-14", "-9"], correctIdx: 0 },
    { question: "Sifat: positif × negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 1 },
    { question: "Sifat: negatif × negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 0 },
    { question: "Lift turun 3 lt sebanyak 4 kali. Total perpindahan ...", options: ["+12", "-12", "-7", "+7"], correctIdx: 1 },
  ];

  const PerkalianSnakeMathGamePage = () => (
    <SnakeMathPage
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      homePath="/menu"
      quizQuestions={QUESTIONS}
      quizIntervalMs={25_000}
    />
  );

  export default PerkalianSnakeMathGamePage;
  