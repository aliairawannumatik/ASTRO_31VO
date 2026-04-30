import DinoRunGamePage, { MQ } from "@/pages/math-game-arena/umum/DinoRunGamePage";

import { PERKALIAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "3 × 5 = ?", opts: ["8", "15", "-15", "-8"], correctIndex: 1, bonus: 25 },
    { q: "(-2) × 4 = ?", opts: ["8", "-8", "6", "-6"], correctIndex: 1, bonus: 25 },
    { q: "(-3) × (-6) = ?", opts: ["18", "-18", "9", "-9"], correctIndex: 0, bonus: 30 },
    { q: "7 × 0 = ?", opts: ["7", "0", "1", "-7"], correctIndex: 1, bonus: 25 },
    { q: "5 × (-4) = ?", opts: ["20", "-20", "1", "-1"], correctIndex: 1, bonus: 30 },
    { q: "(-1) × 8 = ?", opts: ["8", "-8", "7", "-7"], correctIndex: 1, bonus: 25 },
    { q: "9 × 2 = ?", opts: ["18", "11", "-18", "-11"], correctIndex: 0, bonus: 25 },
    { q: "Lift turun 2 lt × 5 = ?", opts: ["+10", "-10", "-7", "+7"], correctIndex: 1, bonus: 35 },
  ];

  const PerkalianTurtleRunGamePage = () => (
    <DinoRunGamePage
      questions={questions}
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      homePath="/menu"

      quizQuestions={PERKALIAN_QUIZ}
    />
  );

  export default PerkalianTurtleRunGamePage;
  