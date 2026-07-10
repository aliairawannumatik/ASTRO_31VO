import BattleTankPage, { MQ } from "@/pages/math-game-arena/umum/BattleTankPage";

import { PENJUMLAHAN_TANK_QUIZ } from "@/data/mga-k7-bilbul-quiz";
const questions: MQ[] = [
  { q: "(-7) + 9 = ...", opts: ["2", "-2", "16", "-16"], ans: 0 },
  { q: "15 + (-22) = ...", opts: ["-7", "7", "37", "-37"], ans: 0 },
  { q: "(-14) + (-6) = ...", opts: ["-20", "-8", "20", "8"], ans: 0 },
  { q: "30 + (-30) = ...", opts: ["0", "60", "-60", "1"], ans: 0 },
  { q: "(-9) + 4 + (-3) = ...", opts: ["-8", "-2", "8", "16"], ans: 0 },
  { q: "(-25) + 18 = ...", opts: ["-7", "7", "-43", "43"], ans: 0 },
  { q: "(-50) + 75 = ...", opts: ["25", "-25", "-125", "125"], ans: 0 },
  { q: "(-12) + (-8) + 5 = ...", opts: ["-15", "1", "25", "-25"], ans: 0 },
  { q: "Suhu -3°C naik 11°C → ...", opts: ["8°C", "-8°C", "14°C", "-14°C"], ans: 0 },
  { q: "Hutang Rp30.000 + tabungan Rp50.000 = ...", opts: ["Rp20.000", "-Rp20.000", "Rp80.000", "-Rp80.000"], ans: 0 },
  { q: "(-100) + 45 = ...", opts: ["-55", "55", "-145", "145"], ans: 0 },
  { q: "(-6) + 6 + (-9) = ...", opts: ["-9", "9", "3", "-3"], ans: 0 },
];

const PenjumlahanTembakTankGamePage = () => (
  <BattleTankPage
    questions={questions}
    topicLabel="PENJUMLAHAN BILANGAN BULAT · Tembak tank dengan jawaban benar!"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"

    quizQuestions={PENJUMLAHAN_TANK_QUIZ}
  />
);

export default PenjumlahanTembakTankGamePage;
