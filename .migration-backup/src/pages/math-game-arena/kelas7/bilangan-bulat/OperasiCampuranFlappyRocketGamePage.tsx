import FlappyRocketPage, { MQ } from "@/pages/math-game-arena/umum/FlappyRocketPage";

import { OPERASI_CAMPURAN_FLAPPY_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "4 + 6 × 2 = ?", opts: ["20", "16", "12", "8"], ans: 1 },
    { q: "(8 - 2) ÷ 3 = ?", opts: ["2", "6", "4", "8"], ans: 0 },
    { q: "10 - 2 × 3 = ?", opts: ["24", "4", "-4", "30"], ans: 1 },
    { q: "12 ÷ 4 + 5 = ?", opts: ["3", "8", "12", "17"], ans: 1 },
    { q: "3 × (5 + 1) = ?", opts: ["8", "16", "18", "15"], ans: 2 },
    { q: "(-3) × 2 + 8 = ?", opts: ["-2", "2", "14", "-14"], ans: 1 },
    { q: "15 - 9 ÷ 3 = ?", opts: ["12", "2", "6", "8"], ans: 0 },
    { q: "20 ÷ 4 - 1 = ?", opts: ["4", "5", "6", "3"], ans: 0 },
  ];

  const OperasiCampuranFlappyRocketGamePage = () => (
    <FlappyRocketPage
      questions={questions}
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      homePath="/menu"

      quizQuestions={OPERASI_CAMPURAN_FLAPPY_QUIZ}
    />
  );

  export default OperasiCampuranFlappyRocketGamePage;
  