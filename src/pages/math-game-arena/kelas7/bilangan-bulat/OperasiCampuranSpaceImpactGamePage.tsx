import SpaceImpactPage, { MQ } from "@/pages/math-game-arena/umum/SpaceImpactPage";

import { OPERASI_CAMPURAN_SPACE_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "5 + 2 × 3", ans: 11 },
    { q: "(8 - 3) × 2", ans: 10 },
    { q: "12 ÷ 4 + 2", ans: 5 },
    { q: "9 - 6 ÷ 2", ans: 6 },
    { q: "4 × 3 - 5", ans: 7 },
    { q: "(-2) + 3 × 4", ans: 10 },
    { q: "16 ÷ 2 + 1", ans: 9 },
    { q: "20 - 5 × 2", ans: 10 },
    { q: "(7 + 3) ÷ 2", ans: 5 },
    { q: "(-3) × 4 + 6", ans: -6 },
    { q: "15 - 9 ÷ 3", ans: 12 },
    { q: "6 + 8 ÷ 4", ans: 8 },
  ];

  const OperasiCampuranSpaceImpactGamePage = () => (
    <SpaceImpactPage
      questions={questions}
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      homePath="/menu"

      quizQuestions={OPERASI_CAMPURAN_SPACE_QUIZ}
    />
  );

  export default OperasiCampuranSpaceImpactGamePage;
  