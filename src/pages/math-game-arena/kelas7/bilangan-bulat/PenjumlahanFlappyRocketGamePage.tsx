import FlappyRocketPage, { MQ } from "@/pages/math-game-arena/umum/FlappyRocketPage";

import { PENJUMLAHAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
const questions: MQ[] = [
  { q: "7 + (-12) = ?", opts: ["19", "-5", "5", "-19"], ans: 1 },
  { q: "(-25) + 40 = ?", opts: ["-15", "65", "15", "-65"], ans: 2 },
  { q: "(-8) + (-13) = ?", opts: ["5", "-21", "21", "-5"], ans: 1 },
  { q: "18 + (-18) = ?", opts: ["36", "-36", "0", "1"], ans: 2 },
  { q: "Suhu di puncak -6°C\nturun 9°C. Suhu jadi?", opts: ["3°C", "-3°C", "-15°C", "15°C"], ans: 2 },
  { q: "Penyelam di -12 m\nnaik 15 m. Posisi?", opts: ["-3 m", "3 m", "27 m", "-27 m"], ans: 1 },
  { q: "(-30) + 50 = ?", opts: ["80", "-80", "20", "-20"], ans: 2 },
  { q: "Hutang 20.000 +\nbayar 35.000 =", opts: ["-15.000", "15.000", "55.000", "-55.000"], ans: 1 },
];

const PenjumlahanFlappyRocketGamePage = () => (
  <FlappyRocketPage
    questions={questions}
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"

    quizQuestions={PENJUMLAHAN_QUIZ}
  />
);

export default PenjumlahanFlappyRocketGamePage;
