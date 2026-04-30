import BattleTankPage, { MQ } from "@/pages/math-game-arena/umum/BattleTankPage";

import { PEMBAGIAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "8 ÷ 2 = ...", opts: ["4", "10", "-4", "-10"], ans: 0 },
    { q: "(-12) ÷ 4 = ...", opts: ["-3", "3", "-8", "8"], ans: 0 },
    { q: "(-18) ÷ (-3) = ...", opts: ["6", "-6", "15", "-15"], ans: 0 },
    { q: "20 ÷ (-5) = ...", opts: ["-4", "4", "-15", "15"], ans: 0 },
    { q: "0 ÷ 6 = ...", opts: ["0", "6", "1", "tak terdefinisi"], ans: 0 },
    { q: "(-25) ÷ 5 = ...", opts: ["-5", "5", "-20", "20"], ans: 0 },
    { q: "14 ÷ 7 = ...", opts: ["2", "7", "-2", "-7"], ans: 0 },
    { q: "(-30) ÷ (-6) = ...", opts: ["5", "-5", "24", "-24"], ans: 0 },
    { q: "9 ÷ (-9) = ...", opts: ["-1", "1", "0", "9"], ans: 0 },
    { q: "(-16) ÷ 8 = ...", opts: ["-2", "2", "-8", "8"], ans: 0 },
    { q: "27 ÷ 3 = ...", opts: ["9", "24", "-9", "-24"], ans: 0 },
    { q: "(-10) ÷ 2 = ...", opts: ["-5", "5", "-8", "8"], ans: 0 },
  ];

  const PembagianTembakTankGamePage = () => (
    <BattleTankPage
      questions={questions}
      topicLabel="PEMBAGIAN BILANGAN BULAT · Tembak tank dengan jawaban benar!"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      homePath="/menu"

      quizQuestions={PEMBAGIAN_QUIZ}
    />
  );

  export default PembagianTembakTankGamePage;
  