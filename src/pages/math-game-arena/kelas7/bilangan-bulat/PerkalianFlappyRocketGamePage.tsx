import FlappyRocketPage, { MQ } from "@/pages/math-game-arena/umum/FlappyRocketPage";

import { PERKALIAN_FLAPPY_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "5 × 3 = ?", opts: ["8", "15", "-15", "-8"], ans: 1 },
    { q: "(-2) × 6 = ?", opts: ["12", "-12", "-4", "4"], ans: 1 },
    { q: "(-4) × (-5) = ?", opts: ["20", "-20", "-9", "9"], ans: 0 },
    { q: "8 × 0 = ?", opts: ["8", "0", "1", "-8"], ans: 1 },
    { q: "3 × (-7) = ?", opts: ["21", "-21", "-10", "10"], ans: 1 },
    { q: "(-1) × 9 = ?", opts: ["9", "-9", "8", "-8"], ans: 1 },
    { q: "6 × 4 = ?", opts: ["10", "-10", "24", "-24"], ans: 2 },
    { q: "(-3) × (-3) = ?", opts: ["9", "-9", "6", "-6"], ans: 0 },
  ];

  const PerkalianFlappyRocketGamePage = () => (
    <FlappyRocketPage
      questions={questions}
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      homePath="/menu"

      quizQuestions={PERKALIAN_FLAPPY_QUIZ}
    />
  );

  export default PerkalianFlappyRocketGamePage;
  