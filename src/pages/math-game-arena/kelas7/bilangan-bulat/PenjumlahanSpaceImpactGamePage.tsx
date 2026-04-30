import SpaceImpactPage, { MQ } from "@/pages/math-game-arena/umum/SpaceImpactPage";

import { PENJUMLAHAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
const questions: MQ[] = [
  { q: "(-7) + 12", ans: 5 },
  { q: "8 + (-15)", ans: -7 },
  { q: "(-9) + (-4)", ans: -13 },
  { q: "20 + (-13)", ans: 7 },
  { q: "(-25) + 30", ans: 5 },
  { q: "12 + (-5) + (-3)", ans: 4 },
  { q: "(-8) + 17", ans: 9 },
  { q: "(-14) + (-6)", ans: -20 },
  { q: "Suhu −3°C + 11°C", ans: 8 },
  { q: "(-50) + 75", ans: 25 },
  { q: "(-3) + (-4) + 10", ans: 3 },
  { q: "16 + (-9) + (-2)", ans: 5 },
];

const PenjumlahanSpaceImpactGamePage = () => (
  <SpaceImpactPage
    questions={questions}
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"

    quizQuestions={PENJUMLAHAN_QUIZ}
  />
);

export default PenjumlahanSpaceImpactGamePage;
