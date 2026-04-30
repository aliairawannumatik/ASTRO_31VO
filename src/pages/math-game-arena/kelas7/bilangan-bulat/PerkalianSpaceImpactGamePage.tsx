import SpaceImpactPage, { MQ } from "@/pages/math-game-arena/umum/SpaceImpactPage";

import { PERKALIAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "4 × 6", ans: 24 },
    { q: "(-2) × 7", ans: -14 },
    { q: "(-3) × (-5)", ans: 15 },
    { q: "8 × 0", ans: 0 },
    { q: "5 × (-4)", ans: -20 },
    { q: "(-6) × 2", ans: -12 },
    { q: "9 × 3", ans: 27 },
    { q: "(-1) × (-9)", ans: 9 },
    { q: "7 × (-2)", ans: -14 },
    { q: "(-5) × (-3)", ans: 15 },
    { q: "11 × 2", ans: 22 },
    { q: "(-4) × 4", ans: -16 },
  ];

  const PerkalianSpaceImpactGamePage = () => (
    <SpaceImpactPage
      questions={questions}
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      homePath="/menu"

      quizQuestions={PERKALIAN_QUIZ}
    />
  );

  export default PerkalianSpaceImpactGamePage;
  