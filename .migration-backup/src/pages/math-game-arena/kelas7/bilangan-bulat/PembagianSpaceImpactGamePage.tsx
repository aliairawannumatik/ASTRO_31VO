import SpaceImpactPage, { MQ } from "@/pages/math-game-arena/umum/SpaceImpactPage";

import { PEMBAGIAN_SPACE_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "12 ÷ 3", ans: 4 },
    { q: "(-15) ÷ 5", ans: -3 },
    { q: "(-20) ÷ (-4)", ans: 5 },
    { q: "0 ÷ 9", ans: 0 },
    { q: "16 ÷ (-2)", ans: -8 },
    { q: "(-9) ÷ 3", ans: -3 },
    { q: "24 ÷ 6", ans: 4 },
    { q: "(-25) ÷ (-5)", ans: 5 },
    { q: "18 ÷ (-3)", ans: -6 },
    { q: "(-14) ÷ 7", ans: -2 },
    { q: "21 ÷ 7", ans: 3 },
    { q: "(-30) ÷ (-6)", ans: 5 },
  ];

  const PembagianSpaceImpactGamePage = () => (
    <SpaceImpactPage
      questions={questions}
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      homePath="/menu"

      quizQuestions={PEMBAGIAN_SPACE_QUIZ}
    />
  );

  export default PembagianSpaceImpactGamePage;
  